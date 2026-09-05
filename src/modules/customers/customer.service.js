const Customer = require('./customer.model');

const nibss =
    require('../../integrations/nibssByPhoenix');

const {
    AppError
} = require('../../utils/app-error');

/**
 * Normalize values before comparing
 * customer information with NIBSS data.
 */
function normalize(value) {
    return String(value || '')
        .trim()
        .toLowerCase();
}

/**
 * Compare customer information with
 * the identity returned by NIBSS.
 */
function identityMatches(
    customer,
    verification
) {
    const firstNameMatches =
        normalize(customer.firstName) ===
        normalize(verification.firstName);

    const lastNameMatches =
        normalize(customer.lastName) ===
        normalize(verification.lastName);

    const customerDob =
        new Date(customer.dateOfBirth)
            .toISOString()
            .slice(0, 10);

    const nibssDob =
        String(verification.dob || '')
            .slice(0, 10);

    return (
        firstNameMatches &&
        lastNameMatches &&
        customerDob === nibssDob
    );
}

/**
 * Create customer.
 */
async function createCustomer(data) {
    const {
        firstName,
        lastName,
        email,
        phone,
        dateOfBirth,
        address,
        kycType,
        bvn,
        nin
    } = data;

    if (!firstName) {
        throw new AppError(
            'First name is required',
            400
        );
    }

    if (!lastName) {
        throw new AppError(
            'Last name is required',
            400
        );
    }

    if (!email) {
        throw new AppError(
            'Email is required',
            400
        );
    }

    if (!phone) {
        throw new AppError(
            'Phone number is required',
            400
        );
    }

    if (!dateOfBirth) {
        throw new AppError(
            'Date of birth is required',
            400
        );
    }

    if (!kycType) {
        throw new AppError(
            'KYC type is required',
            400
        );
    }

    const normalizedKycType =
        kycType.toLowerCase();

    if (
        !['bvn', 'nin'].includes(
            normalizedKycType
        )
    ) {
        throw new AppError(
            'KYC type must be bvn or nin',
            400
        );
    }

    if (
        normalizedKycType === 'bvn' &&
        !bvn
    ) {
        throw new AppError(
            'BVN is required when kycType is bvn',
            400
        );
    }

    if (
        normalizedKycType === 'nin' &&
        !nin
    ) {
        throw new AppError(
            'NIN is required when kycType is nin',
            400
        );
    }

    const existingCustomer =
        await Customer.findOne({
            $or: [
                { email },
                ...(bvn ? [{ bvn }] : []),
                ...(nin ? [{ nin }] : [])
            ]
        });

    if (existingCustomer) {
        throw new AppError(
            'Customer already exists',
            409
        );
    }

    const customer =
        await Customer.create({
            firstName,
            lastName,
            email,
            phone,
            dateOfBirth,
            address,
            kycType: normalizedKycType,
            bvn: bvn || null,
            nin: nin || null
        });

    return customer;
}

/**
 * Get customer by MongoDB ID.
 */
async function getCustomerById(
    customerId
) {
    const customer =
        await Customer.findById(customerId);

    if (!customer) {
        throw new AppError(
            'Customer not found',
            404
        );
    }

    return customer;
}

/**
 * Get customers.
 */
async function getCustomers({
    page = 1,
    limit = 20
} = {}) {
    page = Math.max(
        Number(page) || 1,
        1
    );

    limit = Math.min(
        Math.max(
            Number(limit) || 20,
            1
        ),
        100
    );

    const skip =
        (page - 1) * limit;

    const [
        customers,
        total
    ] = await Promise.all([
        Customer.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),

        Customer.countDocuments()
    ]);

    return {
        customers,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(
                total / limit
            )
        }
    };
}

/**
 * Verify BVN or NIN through NIBSS.
 *
 * The NIBSS documentation defines:
 *
 * POST /api/validateBvn
 * POST /api/validateNin
 */
async function verifyKyc(
    customerId,
    token
) {
    const customer =
        await getCustomerById(
            customerId
        );

    let response;

    if (customer.kycType === 'bvn') {
        response =
            await nibss.bvn.validateBvn(
                customer.bvn,
                token
            );
    } else {
        response =
            await nibss.nin.validateNin(
                customer.nin,
                token
            );
    }

    customer.kycVerificationData =
        response || null;

    if (
        !response ||
        response.valid !== true
    ) {
        customer.kycVerified = false;

        await customer.save();

        throw new AppError(
            'Customer KYC verification failed',
            400
        );
    }

    if (
        !identityMatches(
            customer,
            response
        )
    ) {
        customer.kycVerified = false;

        await customer.save();

        throw new AppError(
            'Customer identity does not match NIBSS records',
            400
        );
    }

    customer.kycVerified = true;
    customer.kycVerifiedAt = new Date();

    await customer.save();

    return {
        customer,
        verification: response
    };
}

/**
 * Create NIBSS account for customer.
 */
async function createCustomerAccount(
    customerId,
    token
) {
    const customer =
        await getCustomerById(
            customerId
        );

    if (!token) {
        throw new AppError(
            'NIBSS access token is required',
            401
        );
    }

    if (!customer.kycVerified) {
        throw new AppError(
            'Customer KYC must be verified before account creation',
            400
        );
    }

    if (customer.accountCreated) {
        throw new AppError(
            'Customer already has an account',
            409
        );
    }

    const kycID =
        customer.kycType === 'bvn'
            ? customer.bvn
            : customer.nin;

    const response =
        await nibss.account.createAccount(
            {
                kycType: customer.kycType,
                kycID,
                dob: customer.dateOfBirth
                    .toISOString()
                    .slice(0, 10)
            },
            token
        );

    customer.accountNumber =
        response.accountNumber;

    customer.bankCode =
        response.bankCode;

    customer.bankName =
        response.bankName;

    customer.accountBalance =
        Number(response.balance || 0);

    customer.accountCreated = true;
    customer.accountCreatedAt =
        new Date();

    customer.status = 'ACTIVE';

    await customer.save();

    return {
        customer,
        nibss: response
    };
}

/**
 * Get customer's NIBSS balance.
 */
async function getCustomerBalance(
    customerId,
    token
) {
    const customer =
        await getCustomerById(
            customerId
        );

    if (!token) {
        throw new AppError(
            'NIBSS access token is required',
            401
        );
    }

    if (!customer.accountNumber) {
        throw new AppError(
            'Customer does not have an account',
            404
        );
    }

    const response =
        await nibss.account.getBalance(
            customer.accountNumber,
            token
        );

    customer.accountBalance =
        Number(response.balance || 0);

    await customer.save();

    return {
        customerId:
            customer._id,

        accountNumber:
            customer.accountNumber,

        balance:
            response.balance
    };
}

/**
 * Find customer by account number.
 */
async function getCustomerByAccountNumber(
    accountNumber
) {
    const customer =
        await Customer.findOne({
            accountNumber
        });

    if (!customer) {
        throw new AppError(
            'Customer account not found',
            404
        );
    }

    return customer;
}

/**
 * Update customer.
 */
async function updateCustomer(
    customerId,
    data
) {
    const customer =
        await getCustomerById(
            customerId
        );

    const allowedFields = [
        'firstName',
        'lastName',
        'phone',
        'address'
    ];

    for (
        const field of allowedFields
    ) {
        if (
            data[field] !== undefined
        ) {
            customer[field] =
                data[field];
        }
    }

    await customer.save();

    return customer;
}

module.exports = {
    createCustomer,
    getCustomerById,
    getCustomers,
    verifyKyc,
    createCustomerAccount,
    getCustomerBalance,
    getCustomerByAccountNumber,
    updateCustomer
};
const Account = require('./account.model');
const Customer = require('../customers/customer.model');

const nibss =
    require('../../integrations/nibssByPhoenix');

const {
    AppError
} = require('../../utils/app-error');


/**
 * Create a NIBSS account for a customer.
 *
 * NIBSS:
 * POST /api/account/create
 */
async function createAccount(
    customerId,
    token
) {
    if (!token) {
        throw new AppError(
            'NIBSS access token is required',
            401
        );
    }

    const customer =
        await Customer.findById(
            customerId
        );

    if (!customer) {
        throw new AppError(
            'Customer not found',
            404
        );
    }

    /**
     * Customer must have completed KYC.
     */
    if (!customer.kycVerified) {
        throw new AppError(
            'Customer KYC must be verified before account creation',
            400
        );
    }

    /**
     * Prevent duplicate local account.
     */
    const existingAccount =
        await Account.findOne({
            customer: customerId
        });

    if (existingAccount) {
        throw new AppError(
            'Customer already has an account',
            409
        );
    }

    const kycID =
        customer.kycType === 'bvn'
            ? customer.bvn
            : customer.nin;

    if (!kycID) {
        throw new AppError(
            `${customer.kycType.toUpperCase()} is required`,
            400
        );
    }

    const dob =
        new Date(customer.dateOfBirth)
            .toISOString()
            .slice(0, 10);

    const response =
        await nibss.account.createAccount(
            {
                kycType:
                    customer.kycType,

                kycID,

                dob
            },
            token
        );

    if (
        !response ||
        !response.accountNumber
    ) {
        throw new AppError(
            'NIBSS did not return a valid account number',
            502
        );
    }

    const account =
        await Account.create({
            customer: customer._id,

            accountNumber:
                response.accountNumber,

            accountName:
                `${customer.firstName} ${customer.lastName}`,

            bankCode:
                response.bankCode,

            bankName:
                response.bankName,

            kycType:
                customer.kycType,

            kycID,

            dateOfBirth:
                customer.dateOfBirth,

            balance:
                Number(
                    response.balance || 0
                ),

            status:
                'ACTIVE',

            nibssResponse:
                response,

            lastBalanceSync:
                new Date()
        });

    /**
     * Keep the Customer document
     * synchronized with the account.
     */
    customer.accountNumber =
        response.accountNumber;

    customer.bankCode =
        response.bankCode;

    customer.bankName =
        response.bankName;

    customer.accountBalance =
        Number(
            response.balance || 0
        );

    customer.accountCreated =
        true;

    customer.accountCreatedAt =
        new Date();

    customer.status =
        'ACTIVE';

    await customer.save();

    return account;
}


/**
 * Get one account by MongoDB ID.
 */
async function getAccountById(
    accountId
) {
    const account =
        await Account.findById(
            accountId
        ).populate(
            'customer'
        );

    if (!account) {
        throw new AppError(
            'Account not found',
            404
        );
    }

    return account;
}


/**
 * Get account by account number.
 */
async function getAccountByNumber(
    accountNumber
) {
    const account =
        await Account.findOne({
            accountNumber
        }).populate(
            'customer'
        );

    if (!account) {
        throw new AppError(
            'Account not found',
            404
        );
    }

    return account;
}


/**
 * Get all local accounts.
 *
 * Also supports pagination.
 */
async function getAccounts({
    page = 1,
    limit = 20
} = {}) {
    page =
        Math.max(
            Number(page) || 1,
            1
        );

    limit =
        Math.min(
            Math.max(
                Number(limit) || 20,
                1
            ),
            100
        );

    const skip =
        (page - 1) * limit;

    const [
        accounts,
        total
    ] = await Promise.all([
        Account.find()
            .populate('customer')
            .sort({
                createdAt: -1
            })
            .skip(skip)
            .limit(limit),

        Account.countDocuments()
    ]);

    return {
        accounts,

        pagination: {
            page,
            limit,
            total,
            pages:
                Math.ceil(
                    total / limit
                )
        }
    };
}


/**
 * Get all accounts directly
 * from NIBSS.
 *
 * NIBSS:
 * GET /api/accounts
 */
async function getAllNIBSSAccounts(
    token
) {
    if (!token) {
        throw new AppError(
            'NIBSS access token is required',
            401
        );
    }

    const response =
        await nibss.account
            .getAllAccounts(
                token
            );

    return response;
}


/**
 * Name enquiry.
 *
 * NIBSS:
 * GET /api/account/name-enquiry/{accountNumber}
 */
async function nameEnquiry(
    accountNumber,
    token
) {
    if (!token) {
        throw new AppError(
            'NIBSS access token is required',
            401
        );
    }

    if (!accountNumber) {
        throw new AppError(
            'Account number is required',
            400
        );
    }

    const response =
        await nibss.account
            .nameEnquiry(
                accountNumber,
                token
            );

    return response;
}


/**
 * Get account balance from NIBSS.
 *
 * NIBSS:
 * GET /api/account/balance/{accountNumber}
 */
async function getBalance(
    accountNumber,
    token
) {
    if (!token) {
        throw new AppError(
            'NIBSS access token is required',
            401
        );
    }

    if (!accountNumber) {
        throw new AppError(
            'Account number is required',
            400
        );
    }

    const response =
        await nibss.account
            .getBalance(
                accountNumber,
                token
            );

    /**
     * Synchronize local account
     * balance if account exists locally.
     */
    const account =
        await Account.findOne({
            accountNumber
        });

    if (account) {
        account.balance =
            Number(
                response.balance || 0
            );

        account.lastBalanceSync =
            new Date();

        await account.save();
    }

    return response;
}


/**
 * Synchronize account balance.
 */
async function syncBalance(
    accountNumber,
    token
) {
    const response =
        await getBalance(
            accountNumber,
            token
        );

    return response;
}


module.exports = {
    createAccount,
    getAccountById,
    getAccountByNumber,
    getAccounts,
    getAllNIBSSAccounts,
    nameEnquiry,
    getBalance,
    syncBalance
};
const customerService =
    require('./customer.service');

const {
    sendSuccess
} = require('../../utils/api-response');

/**
 * Extract Bearer token.
 */
function getBearerToken(req) {
    const authorization =
        req.headers.authorization;

    if (
        !authorization ||
        !authorization.startsWith(
            'Bearer '
        )
    ) {
        return null;
    }

    return authorization.substring(7);
}

/**
 * Create customer.
 */
async function createCustomer(
    req,
    res,
    next
) {
    try {
        const customer =
            await customerService.createCustomer(
                req.body
            );

        return sendSuccess(
            res,
            201,
            'Customer created successfully',
            customer
        );
    } catch (error) {
        next(error);
    }
}

/**
 * Get customers.
 */
async function getCustomers(
    req,
    res,
    next
) {
    try {
        const result =
            await customerService.getCustomers({
                page: req.query.page,
                limit: req.query.limit
            });

        return sendSuccess(
            res,
            200,
            'Customers retrieved successfully',
            result
        );
    } catch (error) {
        next(error);
    }
}

/**
 * Get customer.
 */
async function getCustomerById(
    req,
    res,
    next
) {
    try {
        const customer =
            await customerService.getCustomerById(
                req.params.customerId
            );

        return sendSuccess(
            res,
            200,
            'Customer retrieved successfully',
            customer
        );
    } catch (error) {
        next(error);
    }
}

/**
 * Verify customer KYC.
 */
async function verifyKyc(
    req,
    res,
    next
) {
    try {
        const token =
            getBearerToken(req);

        const result =
            await customerService.verifyKyc(
                req.params.customerId,
                token
            );

        return sendSuccess(
            res,
            200,
            'Customer KYC verified successfully',
            result
        );
    } catch (error) {
        next(error);
    }
}

/**
 * Create NIBSS account.
 */
async function createCustomerAccount(
    req,
    res,
    next
) {
    try {
        const token =
            getBearerToken(req);

        const result =
            await customerService.createCustomerAccount(
                req.params.customerId,
                token
            );

        return sendSuccess(
            res,
            201,
            'Customer account created successfully',
            result
        );
    } catch (error) {
        next(error);
    }
}

/**
 * Get NIBSS balance.
 */
async function getCustomerBalance(
    req,
    res,
    next
) {
    try {
        const token =
            getBearerToken(req);

        const result =
            await customerService.getCustomerBalance(
                req.params.customerId,
                token
            );

        return sendSuccess(
            res,
            200,
            'Customer balance retrieved successfully',
            result
        );
    } catch (error) {
        next(error);
    }
}

/**
 * Find customer by account number.
 */
async function getCustomerByAccountNumber(
    req,
    res,
    next
) {
    try {
        const customer =
            await customerService
                .getCustomerByAccountNumber(
                    req.params.accountNumber
                );

        return sendSuccess(
            res,
            200,
            'Customer retrieved successfully',
            customer
        );
    } catch (error) {
        next(error);
    }
}

/**
 * Update customer.
 */
async function updateCustomer(
    req,
    res,
    next
) {
    try {
        const customer =
            await customerService.updateCustomer(
                req.params.customerId,
                req.body
            );

        return sendSuccess(
            res,
            200,
            'Customer updated successfully',
            customer
        );
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createCustomer,
    getCustomers,
    getCustomerById,
    verifyKyc,
    createCustomerAccount,
    getCustomerBalance,
    getCustomerByAccountNumber,
    updateCustomer
};
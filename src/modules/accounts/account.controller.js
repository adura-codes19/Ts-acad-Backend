const accountService =
    require('./account.service');


/**
 * Extract Bearer token
 * from Authorization header.
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

    return authorization
        .substring(7)
        .trim();
}


/**
 * Create account.
 *
 * POST /api/accounts
 */
async function createAccount(
    req,
    res,
    next
) {
    try {
        const token =
            getBearerToken(req);

        const {
            customerId
        } = req.body;

        const account =
            await accountService
                .createAccount(
                    customerId,
                    token
                );

        return res
            .status(201)
            .json({
                success: true,
                message:
                    'Account created successfully',
                data: account
            });

    } catch (error) {
        next(error);
    }
}


/**
 * Get local account by ID.
 *
 * GET /api/accounts/:accountId
 */
async function getAccountById(
    req,
    res,
    next
) {
    try {
        const account =
            await accountService
                .getAccountById(
                    req.params.accountId
                );

        return res
            .status(200)
            .json({
                success: true,
                message:
                    'Account retrieved successfully',
                data: account
            });

    } catch (error) {
        next(error);
    }
}


/**
 * Get local account by
 * account number.
 *
 * GET /api/accounts/number/:accountNumber
 */
async function getAccountByNumber(
    req,
    res,
    next
) {
    try {
        const account =
            await accountService
                .getAccountByNumber(
                    req.params.accountNumber
                );

        return res
            .status(200)
            .json({
                success: true,
                message:
                    'Account retrieved successfully',
                data: account
            });

    } catch (error) {
        next(error);
    }
}


/**
 * Get all local accounts.
 *
 * GET /api/accounts
 */
async function getAccounts(
    req,
    res,
    next
) {
    try {
        const result =
            await accountService
                .getAccounts({
                    page:
                        req.query.page,

                    limit:
                        req.query.limit
                });

        return res
            .status(200)
            .json({
                success: true,
                message:
                    'Accounts retrieved successfully',
                data: result
            });

    } catch (error) {
        next(error);
    }
}


/**
 * Get all accounts
 * directly from NIBSS.
 *
 * GET /api/accounts/nibss/all
 */
async function getAllNIBSSAccounts(
    req,
    res,
    next
) {
    try {
        const token =
            getBearerToken(req);

        const result =
            await accountService
                .getAllNIBSSAccounts(
                    token
                );

        return res
            .status(200)
            .json({
                success: true,
                message:
                    'NIBSS accounts retrieved successfully',
                data: result
            });

    } catch (error) {
        next(error);
    }
}


/**
 * Name enquiry.
 *
 * GET /api/accounts/name-enquiry/:accountNumber
 */
async function nameEnquiry(
    req,
    res,
    next
) {
    try {
        const token =
            getBearerToken(req);

        const result =
            await accountService
                .nameEnquiry(
                    req.params.accountNumber,
                    token
                );

        return res
            .status(200)
            .json({
                success: true,
                message:
                    'Account name retrieved successfully',
                data: result
            });

    } catch (error) {
        next(error);
    }
}


/**
 * Get balance.
 *
 * GET /api/accounts/balance/:accountNumber
 */
async function getBalance(
    req,
    res,
    next
) {
    try {
        const token =
            getBearerToken(req);

        const result =
            await accountService
                .getBalance(
                    req.params.accountNumber,
                    token
                );

        return res
            .status(200)
            .json({
                success: true,
                message:
                    'Account balance retrieved successfully',
                data: result
            });

    } catch (error) {
        next(error);
    }
}


module.exports = {
    createAccount,
    getAccountById,
    getAccountByNumber,
    getAccounts,
    getAllNIBSSAccounts,
    nameEnquiry,
    getBalance
};
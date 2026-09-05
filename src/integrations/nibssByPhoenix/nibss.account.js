const {
    authenticatedGet,
    authenticatedPost
} = require('./nibss.client');

const {
    NIBSS_ENDPOINTS
} = require('./nibss.constants');

/**
 * Create a customer bank account.
 *
 * @param {Object} payload
 * @param {string} payload.kycType
 * @param {string} payload.kycID
 * @param {string} payload.dob
 * @param {string} token
 *
 * @returns {Promise<Object>}
 */
async function createAccount(
    {
        kycType,
        kycID,
        dob
    },
    token
) {
    if (!kycType) {
        throw new Error(
            'KYC type is required'
        );
    }

    if (!kycID) {
        throw new Error(
            'KYC ID is required'
        );
    }

    if (!dob) {
        throw new Error(
            'Date of birth is required'
        );
    }

    if (!token) {
        throw new Error(
            'NIBSS access token is required'
        );
    }

    return authenticatedPost(
        NIBSS_ENDPOINTS.CREATE_ACCOUNT,
        {
            kycType,
            kycID,
            dob
        },
        token
    );
}

/**
 * Perform account name enquiry.
 *
 * @param {string} accountNumber
 * @param {string} token
 *
 * @returns {Promise<Object>}
 */
async function nameEnquiry(
    accountNumber,
    token
) {
    if (!accountNumber) {
        throw new Error(
            'Account number is required'
        );
    }

    if (!token) {
        throw new Error(
            'NIBSS access token is required'
        );
    }

    const endpoint =
        `${NIBSS_ENDPOINTS.NAME_ENQUIRY}/${accountNumber}`;

    return authenticatedGet(
        endpoint,
        token
    );
}

/**
 * Get all accounts.
 *
 * @param {string} token
 *
 * @returns {Promise<Object>}
 */
async function getAccounts(token) {
    if (!token) {
        throw new Error(
            'NIBSS access token is required'
        );
    }

    return authenticatedGet(
        NIBSS_ENDPOINTS.GET_ACCOUNTS,
        token
    );
}

/**
 * Get account balance.
 *
 * @param {string} accountNumber
 * @param {string} token
 *
 * @returns {Promise<Object>}
 */
async function getBalance(
    accountNumber,
    token
) {
    if (!accountNumber) {
        throw new Error(
            'Account number is required'
        );
    }

    if (!token) {
        throw new Error(
            'NIBSS access token is required'
        );
    }

    const endpoint =
        `${NIBSS_ENDPOINTS.ACCOUNT_BALANCE}/${accountNumber}`;

    return authenticatedGet(
        endpoint,
        token
    );
}

module.exports = {
    createAccount,
    nameEnquiry,
    getAccounts,
    getBalance
};
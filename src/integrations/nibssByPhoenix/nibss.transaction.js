const {
    authenticatedGet,
    authenticatedPost
} = require('./nibss.client');

const {
    NIBSS_ENDPOINTS
} = require('./nibss.constants');

/**
 * Initiate a fund transfer.
 *
 * @param {Object} payload
 * @param {string} payload.from
 * @param {string} payload.to
 * @param {string|number} payload.amount
 * @param {string} token
 *
 * @returns {Promise<Object>}
 */
async function transfer(
    {
        from,
        to,
        amount
    },
    token
) {
    if (!from) {
        throw new Error(
            'Sender account is required'
        );
    }

    if (!to) {
        throw new Error(
            'Recipient account is required'
        );
    }

    if (
        amount === undefined ||
        amount === null ||
        amount === ''
    ) {
        throw new Error(
            'Transfer amount is required'
        );
    }

    if (!token) {
        throw new Error(
            'NIBSS access token is required'
        );
    }

    return authenticatedPost(
        NIBSS_ENDPOINTS.TRANSFER,
        {
            from,
            to,
            amount: String(amount)
        },
        token
    );
}

/**
 * Query transaction status.
 *
 * @param {string} transactionId
 * @param {string} token
 *
 * @returns {Promise<Object>}
 */
async function getTransactionStatus(
    transactionId,
    token
) {
    if (!transactionId) {
        throw new Error(
            'Transaction ID is required'
        );
    }

    if (!token) {
        throw new Error(
            'NIBSS access token is required'
        );
    }

    const endpoint =
        `${NIBSS_ENDPOINTS.TRANSACTION_STATUS}/${transactionId}`;

    return authenticatedGet(
        endpoint,
        token
    );
}

module.exports = {
    transfer,
    getTransactionStatus
};
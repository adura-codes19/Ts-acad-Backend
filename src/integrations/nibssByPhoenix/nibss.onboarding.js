const {
    post
} = require('./nibss.client');

const {
    NIBSS_ENDPOINTS
} = require('./nibss.constants');

/**
 * Onboard a fintech institution with NIBSS.
 *
 * @param {Object} payload
 * @param {string} payload.name
 * @param {string} payload.email
 *
 * @returns {Promise<Object>}
 */
async function onboardFintech({
    name,
    email
}) {
    if (!name) {
        throw new Error(
            'Fintech name is required'
        );
    }

    if (!email) {
        throw new Error(
            'Fintech email is required'
        );
    }

    return post(
        NIBSS_ENDPOINTS.ONBOARD_FINTECH,
        {
            name,
            email
        }
    );
}

module.exports = {
    onboardFintech
};
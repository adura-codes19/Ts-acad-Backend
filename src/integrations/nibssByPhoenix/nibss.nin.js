const {
    post
} = require('./nibss.client');

const {
    NIBSS_ENDPOINTS
} = require('./nibss.constants');

/**
 * Create/register a NIN record.
 *
 * @param {Object} payload
 * @param {string} payload.nin
 * @param {string} payload.firstName
 * @param {string} payload.lastName
 * @param {string} payload.dob
 *
 * @returns {Promise<Object>}
 */
async function createNin({
    nin,
    firstName,
    lastName,
    dob
}) {
    if (!nin) {
        throw new Error('NIN is required');
    }

    if (!firstName) {
        throw new Error(
            'First name is required'
        );
    }

    if (!lastName) {
        throw new Error(
            'Last name is required'
        );
    }

    if (!dob) {
        throw new Error(
            'Date of birth is required'
        );
    }

    return post(
        NIBSS_ENDPOINTS.INSERT_NIN,
        {
            nin,
            firstName,
            lastName,
            dob
        }
    );
}

/**
 * Validate a NIN.
 *
 * @param {string} nin
 *
 * @returns {Promise<Object>}
 */
async function validateNin(nin) {
    if (!nin) {
        throw new Error('NIN is required');
    }

    return post(
        NIBSS_ENDPOINTS.VALIDATE_NIN,
        {
            nin
        }
    );
}

module.exports = {
    createNin,
    validateNin
};
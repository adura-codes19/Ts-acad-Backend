const {
    post
} = require('./nibss.client');

const {
    NIBSS_ENDPOINTS
} = require('./nibss.constants');

/**
 * Create/register a BVN record.
 *
 * @param {Object} payload
 * @param {string} payload.bvn
 * @param {string} payload.firstName
 * @param {string} payload.lastName
 * @param {string} payload.dob
 * @param {string} payload.phone
 *
 * @returns {Promise<Object>}
 */
async function createBvn({
    bvn,
    firstName,
    lastName,
    dob,
    phone
}) {
    if (!bvn) {
        throw new Error('BVN is required');
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

    if (!phone) {
        throw new Error(
            'Phone number is required'
        );
    }

    return post(
        NIBSS_ENDPOINTS.INSERT_BVN,
        {
            bvn,
            firstName,
            lastName,
            dob,
            phone
        }
    );
}

/**
 * Validate a BVN.
 *
 * @param {string} bvn
 *
 * @returns {Promise<Object>}
 */
async function validateBvn(bvn) {
    if (!bvn) {
        throw new Error('BVN is required');
    }

    return post(
        NIBSS_ENDPOINTS.VALIDATE_BVN,
        {
            bvn
        }
    );
}

module.exports = {
    createBvn,
    validateBvn
};
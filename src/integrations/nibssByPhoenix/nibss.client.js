const axios = require('axios');

const {
    NIBSS_DEFAULT_TIMEOUT
} = require('./nibss.constants');

const {
    createNibssError
} = require('./nibss.errors');

const baseURL =
    process.env.NIBSS_BASE_URL ||
    'https://nibssbyphoenix.onrender.com';

const nibssClient = axios.create({
    baseURL,
    timeout: Number(
        process.env.NIBSS_TIMEOUT || NIBSS_DEFAULT_TIMEOUT
    ),
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
    }
});

/**
 * Add JWT authentication to a request.
 */
function buildAuthConfig(token, config = {}) {
    const headers = {
        ...(config.headers || {})
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    return {
        ...config,
        headers
    };
}

/**
 * Generic GET request.
 */
async function get(endpoint, config = {}) {
    try {
        const response = await nibssClient.get(
            endpoint,
            config
        );

        return response.data;
    } catch (error) {
        throw createNibssError(error);
    }
}

/**
 * Generic POST request.
 */
async function post(
    endpoint,
    payload = {},
    config = {}
) {
    try {
        const response = await nibssClient.post(
            endpoint,
            payload,
            config
        );

        return response.data;
    } catch (error) {
        throw createNibssError(error);
    }
}

/**
 * Authenticated GET request.
 */
async function authenticatedGet(
    endpoint,
    token,
    config = {}
) {
    return get(
        endpoint,
        buildAuthConfig(token, config)
    );
}

/**
 * Authenticated POST request.
 */
async function authenticatedPost(
    endpoint,
    payload = {},
    token,
    config = {}
) {
    return post(
        endpoint,
        payload,
        buildAuthConfig(token, config)
    );
}

module.exports = {
    nibssClient,
    get,
    post,
    authenticatedGet,
    authenticatedPost
};
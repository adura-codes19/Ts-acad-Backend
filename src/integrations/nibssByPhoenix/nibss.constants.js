const NIBSS_ENDPOINTS = {
    // Fintech
    ONBOARD_FINTECH: '/api/fintech/onboard',

    // Authentication
    AUTH_TOKEN: '/api/auth/token',

    // Accounts
    CREATE_ACCOUNT: '/api/account/create',
    GET_ACCOUNTS: '/api/accounts',
    NAME_ENQUIRY: '/api/account/name-enquiry',
    ACCOUNT_BALANCE: '/api/account/balance',

    // Transactions
    TRANSFER: '/api/transfer',
    TRANSACTION_STATUS: '/api/transaction',

    // BVN
    INSERT_BVN: '/api/insertBvn',
    VALIDATE_BVN: '/api/validateBvn',

    // NIN
    INSERT_NIN: '/api/insertNin',
    VALIDATE_NIN: '/api/validateNin'
};

const NIBSS_KYC_TYPES = {
    BVN: 'bvn',
    NIN: 'nin'
};

const NIBSS_TRANSACTION_STATUS = {
    SUCCESS: 'SUCCESS',
    PENDING: 'PENDING',
    FAILED: 'FAILED'
};

const NIBSS_DEFAULT_TIMEOUT = 30000;

module.exports = {
    NIBSS_ENDPOINTS,
    NIBSS_KYC_TYPES,
    NIBSS_TRANSACTION_STATUS,
    NIBSS_DEFAULT_TIMEOUT
};
const express = require('express');

const router =
    express.Router();

const accountController =
    require('./account.controller');

const authMiddleware =
    require('../../middleware/auth.middleware');


/**
 * Create customer account.
 *
 * POST /api/accounts
 *
 * Body:
 * {
 *     "customerId": "..."
 * }
 */
router.post(
    '/',
    authMiddleware,
    accountController.createAccount
);


/**
 * Get all local accounts.
 *
 * GET /api/accounts
 */
router.get(
    '/',
    authMiddleware,
    accountController.getAccounts
);


/**
 * Get all accounts from NIBSS.
 *
 * GET /api/accounts/nibss/all
 *
 * IMPORTANT:
 * This route must come before
 * /:accountId.
 */
router.get(
    '/nibss/all',
    authMiddleware,
    accountController
        .getAllNIBSSAccounts
);


/**
 * Name enquiry.
 *
 * GET /api/accounts/name-enquiry/:accountNumber
 */
router.get(
    '/name-enquiry/:accountNumber',
    authMiddleware,
    accountController.nameEnquiry
);


/**
 * Get balance.
 *
 * GET /api/accounts/balance/:accountNumber
 */
router.get(
    '/balance/:accountNumber',
    authMiddleware,
    accountController.getBalance
);


/**
 * Get local account by account number.
 *
 * GET /api/accounts/number/:accountNumber
 */
router.get(
    '/number/:accountNumber',
    authMiddleware,
    accountController
        .getAccountByNumber
);


/**
 * Get local account by MongoDB ID.
 *
 * GET /api/accounts/:accountId
 */
router.get(
    '/:accountId',
    authMiddleware,
    accountController.getAccountById
);


module.exports =
    router;
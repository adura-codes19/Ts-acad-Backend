const express = require('express');

const router = express.Router();

const customerController =
    require('./customer.controller');

const authMiddleware =
    require('../../middleware/auth.middleware');

const validate =
    require('../../middleware/validate.middleware');

const customerValidation =
    require('./customer.validation');


/**
 * Create customer
 *
 * POST /api/customers
 */
router.post(
    '/',
    authMiddleware,
    validate(customerValidation.create),
    customerController.createCustomer
);


/**
 * Get all customers
 *
 * GET /api/customers
 */
router.get(
    '/',
    authMiddleware,
    customerController.getCustomers
);


/**
 * Get customer by account number
 *
 * GET /api/customers/account/:accountNumber
 */
router.get(
    '/account/:accountNumber',
    authMiddleware,
    customerController.getCustomerByAccountNumber
);


/**
 * Get customer by ID
 *
 * GET /api/customers/:customerId
 */
router.get(
    '/:customerId',
    authMiddleware,
    customerController.getCustomerById
);


/**
 * Verify customer KYC
 *
 * POST /api/customers/:customerId/verify-kyc
 */
router.post(
    '/:customerId/verify-kyc',
    authMiddleware,
    customerController.verifyKyc
);


/**
 * Create NIBSS account
 *
 * POST /api/customers/:customerId/account
 */
router.post(
    '/:customerId/account',
    authMiddleware,
    customerController.createCustomerAccount
);


/**
 * Get customer balance
 *
 * GET /api/customers/:customerId/balance
 */
router.get(
    '/:customerId/balance',
    authMiddleware,
    customerController.getCustomerBalance
);


/**
 * Update customer
 *
 * PATCH /api/customers/:customerId
 */
router.patch(
    '/:customerId',
    authMiddleware,
    customerController.updateCustomer
);


module.exports = router;
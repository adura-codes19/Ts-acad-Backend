
const express = require("express");

const {
    createCustomer,
    createBVN,
    verifyBVN,
    createNIN,
    verifyNIN,
} = require("./onboarding.controller");

const {
    validateCustomerOnboarding,
    validateBVN,
    validateNIN,
} = require("./onboarding.validation");

const router = express.Router();


// Start customer onboarding
router.post(
    "/",
    validateCustomerOnboarding,
    createCustomer
);


// Register BVN
router.post(
    "/:customerId/bvn",
    validateBVN,
    createBVN
);


// Verify BVN
router.post(
    "/:customerId/bvn/verify",
    validateBVN,
    verifyBVN
);


// Register NIN
router.post(
    "/:customerId/nin",
    validateNIN,
    createNIN
);


// Verify NIN
router.post(
    "/:customerId/nin/verify",
    validateNIN,
    verifyNIN
);


module.exports = router;


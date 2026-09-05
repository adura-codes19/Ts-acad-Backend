
const Onboarding = require("./onboarding.model");
const nibssOnboarding =
    require('../../integrations/nibssByPhoenix/nibss.onboarding');


/**
 * Create the local customer onboarding record.
 */
const createCustomer = async ({
    firstName,
    lastName,
    email,
    phone,
    dob,
}) => {
    const existingCustomer = await Onboarding.findOne({ email });

    if (existingCustomer) {
        throw new Error("Customer with this email already exists");
    }

    const customer = await Onboarding.create({
        firstName,
        lastName,
        email,
        phone,
        dob,
        onboardingStatus: "PENDING",
        bvnVerified: false,
        ninVerified: false,
        accountCreated: false,
    });

    return customer;
};


/**
 * Register a BVN with NIBSS.
 *
 * IMPORTANT:
 * Registration does NOT mean verification.
 */
const createBVN = async (customerId, bvn) => {
    const customer = await Onboarding.findById(customerId);

    if (!customer) {
        throw new Error("Customer not found");
    }

    const response = await nibssOnboarding.createBVN({
        bvn,
        firstName: customer.firstName,
        lastName: customer.lastName,
        dob: customer.dob,
        phone: customer.phone,
    });

    customer.bvn = bvn;

    await customer.save();

    return {
        customer,
        nibssResponse: response,
    };
};


/**
 * Validate the customer's BVN.
 */
const verifyBVN = async (customerId, bvn) => {
    const customer = await Onboarding.findById(customerId).select("+bvn");

    if (!customer) {
        throw new Error("Customer not found");
    }

    const response = await nibssOnboarding.validateBVN({
        bvn,
    });

    if (response.valid !== true) {
        throw new Error("BVN verification failed");
    }

    customer.bvn = bvn;
    customer.bvnVerified = true;

    // Either verified BVN or verified NIN completes onboarding.
    customer.onboardingStatus = "VERIFIED";

    await customer.save();

    return {
        customer,
        nibssResponse: response,
    };
};


/**
 * Register a NIN with NIBSS.
 *
 * Registration does NOT mean verification.
 */
const createNIN = async (customerId, nin) => {
    const customer = await Onboarding.findById(customerId);

    if (!customer) {
        throw new Error("Customer not found");
    }

    const response = await nibssOnboarding.createNIN({
        nin,
        firstName: customer.firstName,
        lastName: customer.lastName,
        dob: customer.dob,
    });

    customer.nin = nin;

    await customer.save();

    return {
        customer,
        nibssResponse: response,
    };
};


/**
 * Validate the customer's NIN.
 */
const verifyNIN = async (customerId, nin) => {
    const customer = await Onboarding.findById(customerId).select("+nin");

    if (!customer) {
        throw new Error("Customer not found");
    }

    const response = await nibssOnboarding.validateNIN({
        nin,
    });

    if (response.valid !== true) {
        throw new Error("NIN verification failed");
    }

    customer.nin = nin;
    customer.ninVerified = true;

    // Either verified BVN or verified NIN completes onboarding.
    customer.onboardingStatus = "VERIFIED";

    await customer.save();

    return {
        customer,
        nibssResponse: response,
    };
};


/**
 * Used by the account module before account creation.
 *
 * Account creation is allowed when:
 *
 *     BVN verified
 *             OR
 *     NIN verified
 */
const ensureCustomerVerified = async (customerId) => {
    const customer = await Onboarding.findById(customerId);

    if (!customer) {
        throw new Error("Customer not found");
    }

    const verified =
        customer.bvnVerified === true ||
        customer.ninVerified === true;

    if (!verified) {
        throw new Error(
            "Customer must have a successfully verified BVN or NIN before account creation"
        );
    }

    return customer;
};


module.exports = {
    createCustomer,
    createBVN,
    verifyBVN,
    createNIN,
    verifyNIN,
    ensureCustomerVerified,
};


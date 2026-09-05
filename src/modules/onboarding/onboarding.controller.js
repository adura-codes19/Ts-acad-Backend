
const onboardingService = require("./onboarding.service");


/**
 * POST /api/onboarding
 *
 * Start customer onboarding.
 */
const createCustomer = async (req, res) => {
    try {
        const customer = await onboardingService.createCustomer(
            req.body
        );

        return res.status(201).json({
            success: true,
            message: "Customer onboarding started successfully",
            data: {
                id: customer._id,
                firstName: customer.firstName,
                lastName: customer.lastName,
                email: customer.email,
                onboardingStatus: customer.onboardingStatus,
            },
        });
    } catch (error) {
        console.error("Create customer error:", error);

        if (
            error.message ===
            "Customer with this email already exists"
        ) {
            return res.status(409).json({
                success: false,
                message: error.message,
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to start customer onboarding",
        });
    }
};


/**
 * POST /api/onboarding/:customerId/bvn
 *
 * Register BVN with NIBSS.
 */
const createBVN = async (req, res) => {
    try {
        const { customerId } = req.params;
        const { bvn } = req.body;

        const result = await onboardingService.createBVN(
            customerId,
            bvn
        );

        return res.status(201).json({
            success: true,
            message: "BVN registration successful",
            data: result.nibssResponse,
        });
    } catch (error) {
        console.error("BVN registration error:", error);

        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};


/**
 * POST /api/onboarding/:customerId/bvn/verify
 *
 * Validate BVN against NIBSS.
 */
const verifyBVN = async (req, res) => {
    try {
        const { customerId } = req.params;
        const { bvn } = req.body;

        const result = await onboardingService.verifyBVN(
            customerId,
            bvn
        );

        return res.status(200).json({
            success: true,
            message: "BVN verified successfully",
            data: {
                customerId: result.customer._id,
                onboardingStatus:
                    result.customer.onboardingStatus,
                bvnVerified:
                    result.customer.bvnVerified,
            },
        });
    } catch (error) {
        console.error("BVN verification error:", error);

        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};


/**
 * POST /api/onboarding/:customerId/nin
 *
 * Register NIN with NIBSS.
 */
const createNIN = async (req, res) => {
    try {
        const { customerId } = req.params;
        const { nin } = req.body;

        const result = await onboardingService.createNIN(
            customerId,
            nin
        );

        return res.status(201).json({
            success: true,
            message: "NIN registration successful",
            data: result.nibssResponse,
        });
    } catch (error) {
        console.error("NIN registration error:", error);

        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};


/**
 * POST /api/onboarding/:customerId/nin/verify
 *
 * Validate NIN against NIBSS.
 */
const verifyNIN = async (req, res) => {
    try {
        const { customerId } = req.params;
        const { nin } = req.body;

        const result = await onboardingService.verifyNIN(
            customerId,
            nin
        );

        return res.status(200).json({
            success: true,
            message: "NIN verified successfully",
            data: {
                customerId: result.customer._id,
                onboardingStatus:
                    result.customer.onboardingStatus,
                ninVerified:
                    result.customer.ninVerified,
            },
        });
    } catch (error) {
        console.error("NIN verification error:", error);

        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};


module.exports = {
    createCustomer,
    createBVN,
    verifyBVN,
    createNIN,
    verifyNIN,
};



const validateCustomerOnboarding = (req, res, next) => {
    const {
        firstName,
        lastName,
        email,
        phone,
        dob,
    } = req.body;

    if (!firstName || !firstName.trim()) {
        return res.status(400).json({
            success: false,
            message: "First name is required",
        });
    }

    if (!lastName || !lastName.trim()) {
        return res.status(400).json({
            success: false,
            message: "Last name is required",
        });
    }

    if (!email || !email.trim()) {
        return res.status(400).json({
            success: false,
            message: "Email is required",
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
        return res.status(400).json({
            success: false,
            message: "Invalid email address",
        });
    }

    if (!dob) {
        return res.status(400).json({
            success: false,
            message: "Date of birth is required",
        });
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
        return res.status(400).json({
            success: false,
            message: "Date of birth must be in YYYY-MM-DD format",
        });
    }

    if (!phone) {
        return res.status(400).json({
            success: false,
            message: "Phone number is required for BVN onboarding",
        });
    }

    next();
};


const validateBVN = (req, res, next) => {
    const { bvn } = req.body;

    if (!bvn) {
        return res.status(400).json({
            success: false,
            message: "BVN is required",
        });
    }

    if (!/^\d{11}$/.test(bvn)) {
        return res.status(400).json({
            success: false,
            message: "BVN must be 11 digits",
        });
    }

    next();
};


const validateNIN = (req, res, next) => {
    const { nin } = req.body;

    if (!nin) {
        return res.status(400).json({
            success: false,
            message: "NIN is required",
        });
    }

    if (!/^\d{11}$/.test(nin)) {
        return res.status(400).json({
            success: false,
            message: "NIN must be 11 digits",
        });
    }

    next();
};


module.exports = {
    validateCustomerOnboarding,
    validateBVN,
    validateNIN,
};


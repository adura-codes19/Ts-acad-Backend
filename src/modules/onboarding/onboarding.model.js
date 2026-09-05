
const mongoose = require("mongoose");

const onboardingSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, "First name is required"],
            trim: true,
        },

        lastName: {
            type: String,
            required: [true, "Last name is required"],
            trim: true,
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                "Please provide a valid email address",
            ],
        },

        phone: {
            type: String,
            trim: true,
        },

        dob: {
            type: String,
            required: [true, "Date of birth is required"],
        },

        bvn: {
            type: String,
            default: null,
            select: false,
        },

        nin: {
            type: String,
            default: null,
            select: false,
        },

        bvnVerified: {
            type: Boolean,
            default: false,
        },

        ninVerified: {
            type: Boolean,
            default: false,
        },

        onboardingStatus: {
            type: String,
            enum: ["PENDING", "VERIFIED"],
            default: "PENDING",
        },

        accountCreated: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Onboarding", onboardingSchema);
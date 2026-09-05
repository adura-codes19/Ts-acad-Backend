const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true
        },

        lastName: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        phone: {
            type: String,
            required: true,
            trim: true
        },

        dateOfBirth: {
            type: Date,
            required: true
        },

        address: {
            type: String,
            trim: true,
            default: null
        },

        /**
         * KYC information
         */
        kycType: {
            type: String,
            enum: ['bvn', 'nin'],
            required: true
        },

        bvn: {
            type: String,
            trim: true,
            default: null
        },

        nin: {
            type: String,
            trim: true,
            default: null
        },

        kycVerified: {
            type: Boolean,
            default: false
        },

        kycVerifiedAt: {
            type: Date,
            default: null
        },

        kycVerificationData: {
            type: mongoose.Schema.Types.Mixed,
            default: null
        },

        /**
         * NIBSS account information
         */
        accountNumber: {
            type: String,
            trim: true,
            default: null
        },

        bankCode: {
            type: String,
            trim: true,
            default: null
        },

        bankName: {
            type: String,
            trim: true,
            default: null
        },

        accountBalance: {
            type: Number,
            default: 0,
            min: 0
        },

        accountCreated: {
            type: Boolean,
            default: false
        },

        accountCreatedAt: {
            type: Date,
            default: null
        },

        status: {
            type: String,
            enum: [
                'PENDING',
                'ACTIVE',
                'SUSPENDED',
                'INACTIVE'
            ],
            default: 'PENDING'
        }
    },
    {
        timestamps: true
    }
);


/**
 * ================================
 * CUSTOMER DATABASE INDEXES
 * ================================
 *
 * BVN and NIN are unique when supplied.
 * sparse prevents null/missing values from
 * violating the unique constraint.
 */

customerSchema.index(
    { bvn: 1 },
    {
        unique: true,
        sparse: true
    }
);

customerSchema.index(
    { nin: 1 },
    {
        unique: true,
        sparse: true
    }
);

customerSchema.index(
    { accountNumber: 1 },
    {
        unique: true,
        sparse: true
    }
);


/**
 * Export Customer model
 */
module.exports = mongoose.model(
    'Customer',
    customerSchema
);
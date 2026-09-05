const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer',
            required: true
        },

        accountNumber: {
            type: String,
            required: true,
            trim: true
        },

        accountName: {
            type: String,
            required: true,
            trim: true
        },

        bankCode: {
            type: String,
            required: true,
            trim: true
        },

        bankName: {
            type: String,
            required: true,
            trim: true
        },

        kycType: {
            type: String,
            enum: ['bvn', 'nin'],
            required: true
        },

        kycID: {
            type: String,
            required: true,
            trim: true
        },

        dateOfBirth: {
            type: Date,
            required: true
        },

        balance: {
            type: Number,
            default: 0,
            min: 0
        },

        status: {
            type: String,
            enum: [
                'ACTIVE',
                'INACTIVE',
                'SUSPENDED',
                'CLOSED'
            ],
            default: 'ACTIVE'
        },

        nibssResponse: {
            type: mongoose.Schema.Types.Mixed,
            default: null
        },

        lastBalanceSync: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);


/**
 * Database indexes
 */
accountSchema.index(
    { accountNumber: 1 },
    {
        unique: true
    }
);

accountSchema.index(
    { customer: 1 }
);


module.exports =
    mongoose.model(
        'Account',
        accountSchema
    );
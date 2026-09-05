const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
    {
        transactionId: {
    type: String,
    required: true,
    trim: true
},
        from: {
            type: String,
            required: true,
            trim: true
        },

        to: {
            type: String,
            required: true,
            trim: true
        },

        amount: {
            type: Number,
            required: true,
            min: 0
        },

        status: {
            type: String,
            enum: [
                'PENDING',
                'SUCCESS',
                'FAILED'
            ],
            default: 'PENDING'
        },

        timestamp: {
            type: Date,
            default: Date.now
        },

        /**
         * Recipient information returned
         * from NIBSS name enquiry.
         */
        recipientName: {
            type: String,
            trim: true,
            default: null
        },

        recipientBankName: {
            type: String,
            trim: true,
            default: null
        },

        /**
         * NIBSS response stored for
         * reconciliation and troubleshooting.
         */
        nibssResponse: {
            type: mongoose.Schema.Types.Mixed,
            default: null
        },

        failureReason: {
            type: String,
            trim: true,
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
transactionSchema.index(
    { transactionId: 1 },
    {
        unique: true
    }
);

transactionSchema.index(
    { from: 1 }
);

transactionSchema.index(
    { to: 1 }
);

transactionSchema.index(
    { status: 1 }
);

transactionSchema.index(
    { createdAt: -1 }
);


module.exports = mongoose.model(
    'Transaction',
    transactionSchema
);
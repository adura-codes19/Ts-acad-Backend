const Joi = require('joi');


/**
 * Transfer validation
 */
const transfer = Joi.object({
    from: Joi.string()
        .pattern(/^\d{10}$/)
        .required()
        .messages({
            'string.pattern.base':
                'Sender account number must be 10 digits',
            'any.required':
                'Sender account number is required'
        }),

    to: Joi.string()
        .pattern(/^\d{10}$/)
        .required()
        .messages({
            'string.pattern.base':
                'Recipient account number must be 10 digits',
            'any.required':
                'Recipient account number is required'
        }),

    amount: Joi.number()
        .positive()
        .required()
        .messages({
            'number.base':
                'Amount must be a number',
            'number.positive':
                'Amount must be greater than zero',
            'any.required':
                'Amount is required'
        })
});


/**
 * Transaction status validation
 */
const transactionStatus = Joi.object({
    transactionId: Joi.string()
        .trim()
        .required()
        .messages({
            'any.required':
                'Transaction ID is required'
        })
});


module.exports = {
    transfer,
    transactionStatus
};
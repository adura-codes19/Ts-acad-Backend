const customerValidation = {
    create: {
        body: {
            firstName: {
                required: true,
                type: 'string'
            },

            lastName: {
                required: true,
                type: 'string'
            },

            email: {
                required: true,
                type: 'string'
            },

            phone: {
                required: true,
                type: 'string'
            },

            dateOfBirth: {
                required: true,
                type: 'string'
            },

            kycType: {
                required: true,
                type: 'string',
                enum: ['bvn', 'nin']
            }
        }
    }
};

module.exports =
    customerValidation;
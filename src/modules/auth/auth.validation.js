const authValidation = {

    /**
     * NIBSS login validation.
     *
     * POST /api/auth/token
     */
    login: {
        body: {

            apiKey: {
                required: true,
                type: 'string',
                minLength: 1
            },

            apiSecret: {
                required: true,
                type: 'string',
                minLength: 1
            }

        }
    },


    /**
     * Token validation.
     *
     * The Authorization header is checked
     * directly by auth.controller.js.
     */
    token: {
        body: {}
    }

};


module.exports =
    authValidation;
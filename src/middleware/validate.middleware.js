const {
    AppError
} = require('../utils/app-error');

/**
 * Generic validation middleware.
 *
 * Usage:
 *
 * router.post(
 *     '/',
 *     validate(schema),
 *     controller
 * );
 *
 * The schema should contain optional:
 *
 * {
 *     body: {},
 *     params: {},
 *     query: {}
 * }
 */
function validate(schema) {
    return function validationMiddleware(
        req,
        res,
        next
    ) {
        try {
            const errors = [];

            /**
             * Validate request body.
             */
            if (schema.body) {
                validateObject(
                    req.body,
                    schema.body,
                    'body',
                    errors
                );
            }

            /**
             * Validate route parameters.
             */
            if (schema.params) {
                validateObject(
                    req.params,
                    schema.params,
                    'params',
                    errors
                );
            }

            /**
             * Validate query parameters.
             */
            if (schema.query) {
                validateObject(
                    req.query,
                    schema.query,
                    'query',
                    errors
                );
            }

            if (errors.length > 0) {
                throw new AppError(
                    'Request validation failed',
                    400,
                    errors
                );
            }

            next();

        } catch (error) {
            next(error);
        }
    };
}

/**
 * Validate an object against
 * a simple field schema.
 */
function validateObject(
    data,
    rules,
    location,
    errors
) {
    for (
        const field of Object.keys(rules)
    ) {
        const rule =
            rules[field];

        const value =
            data
                ? data[field]
                : undefined;

        /**
         * Required validation.
         */
        if (
            rule.required &&
            (
                value === undefined ||
                value === null ||
                value === ''
            )
        ) {
            errors.push({
                field,
                location,
                message:
                    `${field} is required`
            });

            continue;
        }

        /**
         * Skip optional empty fields.
         */
        if (
            value === undefined ||
            value === null ||
            value === ''
        ) {
            continue;
        }

        /**
         * Type validation.
         */
        if (rule.type) {
            const validType =
                checkType(
                    value,
                    rule.type
                );

            if (!validType) {
                errors.push({
                    field,
                    location,
                    message:
                        `${field} must be of type ${rule.type}`
                });

                continue;
            }
        }

        /**
         * String length.
         */
        if (
            typeof value === 'string' &&
            rule.minLength &&
            value.length <
                rule.minLength
        ) {
            errors.push({
                field,
                location,
                message:
                    `${field} must be at least ${rule.minLength} characters`
            });
        }

        if (
            typeof value === 'string' &&
            rule.maxLength &&
            value.length >
                rule.maxLength
        ) {
            errors.push({
                field,
                location,
                message:
                    `${field} must not exceed ${rule.maxLength} characters`
            });
        }

        /**
         * Regular expression.
         */
        if (
            rule.pattern &&
            typeof value === 'string'
        ) {
            if (
                !rule.pattern.test(value)
            ) {
                errors.push({
                    field,
                    location,
                    message:
                        `${field} has an invalid format`
                });
            }
        }

        /**
         * Enum validation.
         */
        if (
            rule.enum &&
            !rule.enum.includes(value)
        ) {
            errors.push({
                field,
                location,
                message:
                    `${field} must be one of: ${rule.enum.join(', ')}`
            });
        }

        /**
         * Minimum number.
         */
        if (
            typeof value === 'number' &&
            rule.min !== undefined &&
            value < rule.min
        ) {
            errors.push({
                field,
                location,
                message:
                    `${field} must be at least ${rule.min}`
            });
        }

        /**
         * Maximum number.
         */
        if (
            typeof value === 'number' &&
            rule.max !== undefined &&
            value > rule.max
        ) {
            errors.push({
                field,
                location,
                message:
                    `${field} must not exceed ${rule.max}`
            });
        }
    }
}

/**
 * Check JavaScript value type.
 */
function checkType(
    value,
    type
) {
    switch (type) {

        case 'string':
            return typeof value ===
                'string';

        case 'number':
            return (
                typeof value ===
                    'number' &&
                !Number.isNaN(value)
            );

        case 'boolean':
            return typeof value ===
                'boolean';

        case 'array':
            return Array.isArray(
                value
            );

        case 'object':
            return (
                typeof value ===
                    'object' &&
                value !== null &&
                !Array.isArray(value)
            );

        default:
            return true;
    }
}

module.exports = validate;
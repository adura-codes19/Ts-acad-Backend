
const express = require('express');

const app = express();

/**
 * ================================
 * Middleware
 * ================================
 */
const errorMiddleware =
    require('./middleware/error.middleware');


/**
 * ================================
 * Routes
 * ================================
 */
const authRoutes =
    require('./modules/auth/auth.routes');

const customerRoutes =
    require('./modules/customers/customer.routes');

const accountRoutes =
    require('./modules/accounts/account.routes');

const onboardingRoutes =
    require('./modules/onboarding/onboarding.routes');

const transactionRoutes =
    require('./modules/transactions/transaction.routes');


/**
 * ================================
 * Global Middleware
 * ================================
 */

/**
 * Parse incoming JSON requests.
 */
app.use(express.json());

/**
 * Parse URL-encoded requests.
 */
app.use(
    express.urlencoded({
        extended: true
    })
);


/**
 * ================================
 * Health Check
 * ================================
 */
app.get(
    '/',
    (req, res) => {
        res.status(200).json({
            success: true,
            message: 'Fintech API is running',
            environment:
                process.env.NODE_ENV || 'development'
        });
    }
);


/**
 * ================================
 * API Routes
 * ================================
 */

/**
 * Authentication
 *
 * POST /api/auth/register
 * POST /api/auth/login
 * etc.
 */
app.use(
    '/api/auth',
    authRoutes
);


/**
 * Customer Management
 *
 * POST   /api/customers
 * GET    /api/customers
 * GET    /api/customers/:id
 * PUT    /api/customers/:id
 * DELETE /api/customers/:id
 */
app.use(
    '/api/customers',
    customerRoutes
);


/**
 * Account Management
 *
 * Account-related operations.
 */
app.use(
    '/api/accounts',
    accountRoutes
);


/**
 * Customer Onboarding
 *
 * Customer onboarding and KYC workflow.
 */
app.use(
    '/api/onboarding',
    onboardingRoutes
);


/**
 * Transaction Management
 *
 * POST /api/transactions/transfer
 * GET  /api/transactions/:transactionId
 */
app.use(
    '/api/transactions',
    transactionRoutes
);


/**
 * ================================
 * 404 Handler
 * ================================
 */
app.use(
    (req, res) => {
        res.status(404).json({
            success: false,
            message: `Route not found: ${req.method} ${req.originalUrl}`
        });
    }
);


/**
 * ================================
 * Global Error Handler
 * ================================
 *
 * This MUST remain the final middleware.
 */
app.use(errorMiddleware);


/**
 * ================================
 * Export Application
 * ================================
 */
module.exports = app;


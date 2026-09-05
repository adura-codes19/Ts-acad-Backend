const transactionService =
    require('./transaction.service');

const {
    successResponse
} = require('../../utils/api-response');


/**
 * POST /api/transactions/transfer
 */
async function transfer(
    req,
    res,
    next
) {
    try {
        const token =
            req.headers.authorization
                ?.replace('Bearer ', '');

        const transaction =
            await transactionService
                .initiateTransfer(
                    req.body,
                    token
                );


        return successResponse(
            res,
            {
                statusCode: 201,
                message:
                    'Transfer initiated successfully',
                data: transaction
            }
        );

    } catch (error) {
        next(error);
    }
}


/**
 * GET /api/transactions/:transactionId
 */
async function getStatus(
    req,
    res,
    next
) {
    try {
        const token =
            req.headers.authorization
                ?.replace('Bearer ', '');

        const transaction =
            await transactionService
                .getTransactionStatus(
                    req.params.transactionId,
                    token
                );


        return successResponse(
            res,
            {
                statusCode: 200,
                message:
                    'Transaction status retrieved successfully',
                data: transaction
            }
        );

    } catch (error) {
        next(error);
    }
}


module.exports = {
    transfer,
    getStatus
};
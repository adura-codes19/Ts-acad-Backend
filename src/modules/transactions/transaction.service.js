const Transaction = require('./transaction.model');

const nibss =
    require('../../integrations/nibssByPhoenix');


/**
 * Initiate a transfer.
 */
async function initiateTransfer(
    transferData,
    token
) {
    const {
        from,
        to,
        amount
    } = transferData;


    /**
     * Prevent transfer to same account.
     */
    if (from === to) {
        const error = new Error(
            'Sender and recipient accounts cannot be the same'
        );

        error.statusCode = 400;

        throw error;
    }


    /**
     * Perform recipient name enquiry
     * before transfer.
     */
    const nameEnquiry =
        await nibss.account.nameEnquiry(
            to,
            token
        );


    /**
     * Perform NIBSS transfer.
     */
    const response =
        await nibss.transfer(
            {
                from,
                to,
                amount: String(amount)
            },
            token
        );


    const transaction =
        await Transaction.create({
            transactionId:
                response.transactionId,

            from:
                response.from || from,

            to:
                response.to || to,

            amount:
                Number(
                    response.amount || amount
                ),

            status:
                response.status || 'PENDING',

            recipientName:
                nameEnquiry.accountName ||
                null,

            recipientBankName:
                nameEnquiry.bankName ||
                null,

            nibssResponse:
                response
        });


    return transaction;
}


/**
 * Get transaction status.
 */
async function getTransactionStatus(
    transactionId,
    token
) {
    const response =
        await nibss.transaction.status(
            transactionId,
            token
        );


    const transaction =
        await Transaction.findOneAndUpdate(
            {
                transactionId
            },
            {
                status:
                    response.status,

                amount:
                    response.amount,

                from:
                    response.from,

                to:
                    response.to,

                timestamp:
                    response.timestamp
                        ? new Date(response.timestamp)
                        : undefined,

                nibssResponse:
                    response
            },
            {
                new: true,
                upsert: false
            }
        );


    /**
     * If the transaction was not previously
     * saved locally, create it from TSQ.
     */
    if (!transaction) {
        return Transaction.create({
            transactionId:
                response.transactionId,

            status:
                response.status,

            amount:
                Number(response.amount),

            from:
                response.from,

            to:
                response.to,

            timestamp:
                response.timestamp
                    ? new Date(response.timestamp)
                    : new Date(),

            nibssResponse:
                response
        });
    }


    return transaction;
}


/**
 * Find a transaction in our database.
 */
async function findTransaction(
    transactionId
) {
    return Transaction.findOne({
        transactionId
    });
}


module.exports = {
    initiateTransfer,
    getTransactionStatus,
    findTransaction
};
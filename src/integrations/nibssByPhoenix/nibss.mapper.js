/**
 * Map fintech onboarding response.
 */
function mapFintechOnboardingResponse(
    response
) {
    return {
        apiKey: response?.apiKey,
        apiSecret: response?.apiSecret,
        bankCode: response?.bankCode,
        bankName: response?.bankName
    };
}

/**
 * Map login response.
 */
function mapAuthResponse(response) {
    return {
        token: response?.token,
        fintech: response?.fintech
    };
}

/**
 * Map account creation response.
 */
function mapAccountResponse(response) {
    return {
        message: response?.message,
        accountNumber: response?.accountNumber,
        bankCode: response?.bankCode,
        bankName: response?.bankName,
        balance: response?.balance
    };
}

/**
 * Map name enquiry response.
 */
function mapNameEnquiryResponse(response) {
    return {
        accountNumber: response?.accountNumber,
        accountName: response?.accountName,
        bankName: response?.bankName
    };
}

/**
 * Map account list response.
 */
function mapAccountsResponse(response) {
    return {
        accounts: response?.accounts || []
    };
}

/**
 * Map balance response.
 */
function mapBalanceResponse(response) {
    return {
        accountNumber: response?.accountNumber,
        balance: response?.balance
    };
}

/**
 * Map transfer response.
 */
function mapTransferResponse(response) {
    return {
        message: response?.message,
        transactionId: response?.transactionId,
        amount: response?.amount,
        from: response?.from,
        to: response?.to,
        status: response?.status
    };
}

/**
 * Map transaction status response.
 */
function mapTransactionStatusResponse(
    response
) {
    return {
        transactionId: response?.transactionId,
        status: response?.status,
        amount: response?.amount,
        from: response?.from,
        to: response?.to,
        timestamp: response?.timestamp
    };
}

/**
 * Map BVN response.
 */
function mapBvnResponse(response) {
    return {
        valid: response?.valid,
        bvn: response?.bvn,
        firstName: response?.firstName,
        lastName: response?.lastName,
        dob: response?.dob,
        message: response?.message
    };
}

/**
 * Map NIN response.
 */
function mapNinResponse(response) {
    return {
        valid: response?.valid,
        nin: response?.nin,
        firstName: response?.firstName,
        lastName: response?.lastName,
        dob: response?.dob,
        message: response?.message
    };
}

module.exports = {
    mapFintechOnboardingResponse,
    mapAuthResponse,
    mapAccountResponse,
    mapNameEnquiryResponse,
    mapAccountsResponse,
    mapBalanceResponse,
    mapTransferResponse,
    mapTransactionStatusResponse,
    mapBvnResponse,
    mapNinResponse
};
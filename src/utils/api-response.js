/**
 * Standard API response helper.
 */

function successResponse(
    res,
    {
        statusCode = 200,
        message = 'Request successful',
        data = null
    } = {}
) {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
}


function errorResponse(
    res,
    {
        statusCode = 500,
        message = 'Internal server error',
        errors = null
    } = {}
) {
    const response = {
        success: false,
        message
    };

    if (errors) {
        response.errors = errors;
    }

    return res
        .status(statusCode)
        .json(response);
}


module.exports = {
    successResponse,
    errorResponse
};
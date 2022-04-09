const { INTERNAL_SERVER_ERROR, SERVICE_UNAVAILABLE } = require('./httpStatusCodes');

module.exports = {
    LOGIN_FAILED: {
        code: INTERNAL_SERVER_ERROR,
        message: 'Login failed'
    },
    INVALID_DATA : {
        code: INTERNAL_SERVER_ERROR,
        message: 'Invalid data'
    },
    ACCOUNT_CREATION_FAILED: {
        code: SERVICE_UNAVAILABLE,
        message: 'Account creation failed'
    }
}
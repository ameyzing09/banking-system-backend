const { INTERNAL_SERVER_ERROR, UNAUTHORIZED, NOT_FOUND } = require('./httpStatusCodes');

module.exports = {
    LOGIN_FAILED: {
        code: UNAUTHORIZED,
        message: 'Login failed'
    },
    SERVER_UNAVAILABLE:{
        code: NOT_FOUND,
        message: 'Server not reachable'
    },
    INVALID_DATA : {
        code: INTERNAL_SERVER_ERROR,
        message: 'Invalid data'
    },
    ACCOUNT_CREATION_FAILED: {
        code: INTERNAL_SERVER_ERROR,
        message: 'Account creation failed'
    }
}
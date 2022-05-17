const { INTERNAL_SERVER_ERROR, UNAUTHORIZED, NOT_FOUND, BAD_REQUEST } = require('./httpStatusCodes');

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
    },
    NO_ACCOUNT_FOUND: {
        code: NOT_FOUND,
        message: 'No account found'
    },
    ERROR_CREATING_TRANSACTION_REPORT: {
        code: INTERNAL_SERVER_ERROR,
        message: 'Error creating transaction report'
    },
    INSUFFICIENT_BALANCE: {
        code: BAD_REQUEST,
        message: 'Insufficient balance'
    },
    ACCOUNT_DELETION_FAILED:{
        code: INTERNAL_SERVER_ERROR,
        message: 'Account deletion failed'
    },
    ACCOUNT_BALANCE_NOT_ZERO:{
        code: BAD_REQUEST,
        message: 'Account balance should be zero to delete'
    }
}
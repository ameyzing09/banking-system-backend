const { SUCCESS } = require('./httpStatusCodes');

module.exports = {
    LOGIN_SUCCESS: {
        code: SUCCESS,
        message: 'Login successful'
    },
    ACCOUNT_CREATION_SUCCESS: {
        code: SUCCESS,
        message: 'Account creation successful'
    },
    VIEW_TRANSACTION_SUCCESS: {
        code: SUCCESS,
        message: 'View transaction successful'
    },
    CASH_DEPOSIT_SUCCESS: {
        code: SUCCESS,
        message: 'Cash deposit successful'
    }
}
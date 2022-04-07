const { INTERNAL_SERVER_ERROR, SERVICE_UNAVAILABLE } = require('./httpStatusCodes');

module.exports = {
    LOGIN_FAILED: {
        code: INTERNAL_SERVER_ERROR,
        message: 'login failed'
    }
}
const user = require('../models/user')
const { LOGIN_SUCCESS } = require('../constants/success')
const { LOGIN_FAILED } = require('../constants/error')

const checkLoginCredentials = async (request, response) => {
    try{
        const userLoginCredentials = await user.findOne({
            where: {
                username: request.body.username,
            },
            raw: true
        })
        if(request.body.username 
            && request.body.password 
            && request.body.username === userLoginCredentials.username 
            && request.body.password === userLoginCredentials.password) {
                response.status(200).json(LOGIN_SUCCESS)
        }
        else {
            response.status(400).json(LOGIN_FAILED)
        }
    } catch(err) {
        response.status(400).json(LOGIN_FAILED)
    }
}

module.exports = checkLoginCredentials
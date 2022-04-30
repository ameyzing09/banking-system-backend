const user = require('../models/user')
const { LOGIN_SUCCESS } = require('../constants/success')
const { LOGIN_FAILED, SERVER_UNAVAILABLE } = require('../constants/error')

const checkLoginCredentials = async (request, response) => {
    let userLoggedIn = false;
    try{
        const userLoginCredentials = await user.findOne({
            where: {
                username: request.body.username,
            },
            raw: true
        })
        if(request.body.password 
            && request.body.password === userLoginCredentials?.password) {
                console.info('User logged in successfully creds fetched form DB are: ', userLoginCredentials)
                response.status(200).json({...LOGIN_SUCCESS, userLoggedIn: true})
        } else {
            response.status(401).json({...LOGIN_FAILED, userLoggedIn})
        }
    } catch(err) {
        response.status(404).json({...SERVER_UNAVAILABLE, userLoggedIn })
    }
}

module.exports = checkLoginCredentials
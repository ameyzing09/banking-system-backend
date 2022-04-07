const db = require('./dbConfig')
const getConnection = async () => {
    try{
        await db.authenticate()
        console.log('Connection has been established successfully.')
    } catch(error) {
        console.error('Unable to connect to the database:', error)
    }
}

module.exports = getConnection()
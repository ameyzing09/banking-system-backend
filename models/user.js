const db = require('../dbConfig')
const sequelize = require('sequelize')

const User = db.define('user', {
    id: {
        type: sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },

    username: {
        type: sequelize.STRING,
        allowNull: false,
    },

    password: {
        type: sequelize.STRING,
        allowNull: false,
    },

}, {
    timestamps: false,
    freezeTableName: true
})

module.exports = User
const db = require('../dbConfig')
const sequelize = require('sequelize')

const AccountInfo = db.define('account_info', {
    id: {
        type: sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },

    account_no: {
        type: sequelize.STRING,
        allowNull: false,
        unique: true
    },

    a_holder_name: {
        type: sequelize.STRING,
        allowNull: false,
    },
    a_holder_address:{
        type: sequelize.TEXT,
        allowNull: false,
    },
    a_phone_no:{
        type:sequelize.STRING,
        allowNull:false,
    },
    a_dob:{
        type:sequelize.DATE,
        allowNull:false,
    },
    a_gender:{
        type:sequelize.ENUM("MALE","FEMALE","OTHER"),
        allowNull:false,
    },
    a_type:{
        type:sequelize.ENUM("SAVING","CURRENT"),
        allowNull:false,
    },
    a_balance:{
        type:sequelize.FLOAT,
        allowNull:true,
        defaultValue: 0,
    },
    a_date_opened:{
        type:sequelize.DATE,
        allowNull:false,
        defaultValue: Date.now(),
    },

}, {
    timestamps: false,
    freezeTableName: true
})

module.exports = AccountInfo
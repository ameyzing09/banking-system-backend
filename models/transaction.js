const db = require('../dbConfig')
const sequelize = require('sequelize')
const accountInfo = require('./accountInfo')

const Transaction = db.define('transaction', {
    id: {
        type: sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },

    account_id: {
        type: sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'account_info',
            key: 'id'
        }
    },

    transaction_type:{
        type:sequelize.ENUM("CREDIT","DEBIT"),
        allowNull:false,
    },

    transaction_description: {
        type: sequelize.STRING,
        allowNull: false,
    },
    
    transaction_amount: {
        type: sequelize.FLOAT,
        allowNull: false,
    },

    transaction_date:{
        type:sequelize.DATE,
        allowNull:false,
    },
}, {
    timestamps: false,
    freezeTableName: true
})

Transaction.belongsTo(accountInfo, {as: 'account_info', foreignKey: 'account_id'})
accountInfo.hasMany(Transaction,  {as: 'transaction', foreignKey: 'account_id'})

// Transaction.sync({force: true})
module.exports = Transaction
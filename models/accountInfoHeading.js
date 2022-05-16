const db = require('../dbConfig');
const sequelize = require('sequelize');

const AccountInfoHeading = db.define('account_info_heading', {
    id: {
        type: sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },

    key: {
        type: sequelize.STRING,
        allowNull: false,
    },

    value: {
        type: sequelize.STRING,
        allowNull: false,
    },
}, {
    timestamps: false,
    freezeTableName: true
}
);

module.exports = AccountInfoHeading;
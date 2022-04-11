const moment = require('moment')

const accountInfoModel = require('../models/accountInfo')

const getAccountNumber = require('../utils/getAccountNumber')
const { ACCOUNT_CREATION_FAILED, INVALID_DATA } = require('../constants/error')
const { ACCOUNT_CREATION_SUCCESS } = require('../constants/success')

module.exports = async (req, res) => {
    const { accountHolderName, accountHolderAddress, accountHolderPhone, 
            accountHolderGender, accountHolderType, 
            accountHolderBalance } = req.body
    try {
        if (req.body) {
            let accountHolderDob = moment(req.body.accountHolderDob, 'DD-MM-YYYY').utc()
            if (+accountHolderPhone.length === 10 && moment(req.body.accountHolderDob, 'DD-MM-YYYY').isValid()) {
                const accountNumber = getAccountNumber()
                console.info('accountNumber', accountNumber)
                await accountInfoModel.create({
                    account_no: accountNumber,
                    a_holder_name: accountHolderName,
                    a_holder_address: accountHolderAddress,
                    a_phone_no: accountHolderPhone,
                    a_dob: accountHolderDob,
                    a_gender: accountHolderGender,
                    a_type: accountHolderType,
                    a_balance: (accountHolderBalance && accountHolderBalance > 0) ? accountHolderBalance : 0
                })
                res.status(200).json({...ACCOUNT_CREATION_SUCCESS, accountNumber})
            } else {
                res.status(400).json(INVALID_DATA)
            }
        }
    } catch(err){
        console.error('Error in creating account', err)
        res.status(500).json(ACCOUNT_CREATION_FAILED)
    }
}
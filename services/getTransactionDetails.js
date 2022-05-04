const moment = require("moment");

const transactionModel = require("../models/transaction");
const transactionHeader = require("../models/transactionHeader");
const accountInfoModel = require("../models/accountInfo");

const { SUCCESS, NOT_FOUND } = require("../constants/httpStatusCodes");
const { VIEW_TRANSACTION_SUCCESS } = require("../constants/success");
const { NO_ACCOUNT_FOUND } = require("../constants/error");
const { Sequelize } = require("../dbConfig");
const getTransactionHeader = async () => {
  return await transactionHeader.findAll({ raw: true });
};

module.exports = async (req, res) => {
  try {
    let transactionHeading = await getTransactionHeader();
    console.info("transactionHeading ", transactionHeading);
    transactionHeading = transactionHeading.map(
      (transactionHead) => transactionHead.value
    );
    console.info("req.body.accountNumber", req.body);
    let transactionDetails = await transactionModel.findAll({
      include: [
        {
          model: accountInfoModel,
          as: "account_info",
          where: {
            account_no: req.body.accountNumber,
          },
          attributes: [],
        },
      ],
      attributes: [
        "id",
        "transaction_date",
        "transaction_description",
        "transaction_type",
        "transaction_amount",
        [Sequelize.col("account_info.a_balance"), "a_balance"],
      ],
      raw: true,
      nest: true,
    });

    if (transactionDetails.length !== 0) {
      // transactionDetails[0]['transaction_date'] = moment(transactionDetails[0]['transaction_date']).format('DD-MM-YYYY HH:mm:ss');
      // console.info("transactionDetails ", transactionDetails[0]['transaction_date']);
      transactionDetails = transactionDetails.map(detail => ({...detail, ['transaction_date']: moment(detail['transaction_date']).format('DD-MM-YYYY HH:mm:ss')}));
      res.status(SUCCESS).json({
        ...VIEW_TRANSACTION_SUCCESS,
        error: null,
        data: { transactionHeading, transactionDetails },
      });
    } else {
      throw new Error(NO_ACCOUNT_FOUND); 
    }
  } catch (error) {
    console.error("error ", error);
    res.status(NOT_FOUND).json({
      error: NO_ACCOUNT_FOUND,
      data: null,
    });
  }
};

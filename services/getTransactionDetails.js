const transactionModel = require("../models/transaction");
const accountInfoModel = require("../models/accountInfo");


const { SUCCESS, NOT_FOUND } = require("../constants/httpStatusCodes");
const { VIEW_TRANSACTION_SUCCESS } = require("../constants/success");
const { NO_ACCOUNT_FOUND } = require("../constants/error");

module.exports = async (req, res) => {
  try {
    const transactionDetails = await transactionModel.findAll({
      include: [
        {
          model: accountInfoModel,
          as: "account_info",
          where: {
            account_no: req.body.accountNumber,
          },
        },
      ],
      raw: true,
      nest: true,
    });
    if (transactionDetails.length !== 0) {

    console.info("transactionDetails ", transactionDetails);
    res
      .status(SUCCESS)
      .json({ ...VIEW_TRANSACTION_SUCCESS, data: transactionDetails });
    } else {
      throw new Error(NO_ACCOUNT_FOUND);
    }
  } catch (error) {
    console.error("error ", error);
    res.status(NOT_FOUND).json({
      ...NO_ACCOUNT_FOUND,
      data: null,
    });
  }
};

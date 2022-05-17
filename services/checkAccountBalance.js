const { NO_ACCOUNT_FOUND } = require("../constants/error");
const accountInfo = require("../models/accountInfo");

const checkAccountBalance = async (accountNumber) => {
  try {
    console.log("in checkAccountBalance accountNumber ", accountNumber);
    const accountBalance = await accountInfo.findOne({
      where: {
        account_no: accountNumber,
      },
      attributes: ["id", "a_balance"],
      raw: true,
    });
    console.log('accountBalance in checkAccountBalance(): ', accountBalance);
    if (accountBalance.a_balance >= 0) {
      return accountBalance;
    }
  } catch (error) {
    console.error("Error in checkAccountBalance: ", error);
    throw Error(NO_ACCOUNT_FOUND.message, {
      cause: { status: NO_ACCOUNT_FOUND.code },
    });
    // res.status(error.cause.status).json({
    //   error: {
    //     code: error.cause.status,
    //     message: error.message,
    //   },
    //   data: null,
    // });
    // throw Error(error);
  }
};

module.exports = checkAccountBalance;

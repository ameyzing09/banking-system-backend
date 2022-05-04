const { NO_ACCOUNT_FOUND } = require("../constants/error");
const accountInfo = require("../models/accountInfo");

const checkAccountBalance = async (accountNumber) => {
  try {
    const accountBalance = await accountInfo.findOne({
        where: {
          account_no: accountNumber,
        },
        attributes: ["a_balance"],
        raw: true,
      });
      if(accountBalance) {
        return accountBalance;
      } else {
        throw new Error(NO_ACCOUNT_FOUND);
      }
  } catch (error) {
      console.error(`Error fetching balance for ${accountNumber}`);
      throw {error, message: "Error fetching balance for account"};
  }
};

module.exports = checkAccountBalance;

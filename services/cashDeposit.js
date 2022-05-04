const { NO_ACCOUNT_FOUND } = require("../constants/error");
const { SUCCESS, NOT_FOUND } = require("../constants/httpStatusCodes");
const { CASH_DEPOSIT_SUCCESS } = require("../constants/success");
const accountInfo = require("../models/accountInfo");
const checkAccountBalance = require("./checkAccountBalance");

const cashDeposit = async (req, res) => {
  const { accountNumber, amount } = req.body;
  try {
    const accountBalance = await checkAccountBalance(accountNumber);
    if (accountBalance) {
      const accountBalanceUpdated = await accountInfo.update(
        {
          a_balance: accountBalance.a_balance + amount,
        },
        {
          where: {
            account_no: accountNumber,
          },
        }
      );
      console.info("accountBalanceUpdated ", accountBalanceUpdated);
      if (accountBalanceUpdated) {
        res.status(SUCCESS).json({
          ...CASH_DEPOSIT_SUCCESS,
          error: null,
          data: null,
        });
      } else {
        throw new Error(NO_ACCOUNT_FOUND);
      }
    }
  } catch (error) {
    console.error(`Error fetching balance for ${accountNumber}`);
    res.status(NOT_FOUND).json({
      ...NO_ACCOUNT_FOUND,
      data: null,
    });
  }
};

module.exports = cashDeposit;

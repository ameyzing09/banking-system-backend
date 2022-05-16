const moment = require("moment");

const accountInfoModel = require("../models/accountInfo");
const accountInfoHeaderModel = require("../models/accountInfoHeading");
const transactionModel = require("../models/transaction");
const transactionHeaderModel = require("../models/transactionHeader");

const getAccountNumber = require("../utils/getAccountNumber");

const {
  ACCOUNT_CREATION_FAILED,
  INVALID_DATA,
  INSUFFICIENT_BALANCE,
  NO_ACCOUNT_FOUND,
} = require("../constants/error");
const {
  VIEW_TRANSACTION_SUCCESS,
  ACCOUNT_CREATION_SUCCESS,
  CASH_DEPOSIT_SUCCESS,
  CASH_WITHDRAW_SUCCESS,
} = require("../constants/success");

const { TRANSACTION_TYPE } = require("../constants/transactionConstants");

const {
  SUCCESS,
  NOT_FOUND,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
} = require("../constants/httpStatusCodes");

const checkAccountBalance = require("./checkAccountBalance");

const Sequelize = require("../dbConfig");
const { Op } = require("sequelize");

const createBankAccount = async (req, res) => {
  const {
    accountHolderName,
    accountHolderAddress,
    accountHolderPhone,
    accountHolderGender,
    accountHolderType,
    accountHolderBalance,
  } = req.body;
  try {
    if (req.body) {
      let accountHolderDob = moment(
        req.body.accountHolderDob,
        "DD-MM-YYYY"
      ).utc();
      if (
        +accountHolderPhone?.length === 10 &&
        moment(req.body.accountHolderDob, "DD-MM-YYYY").isValid()
      ) {
        const accountNumber = getAccountNumber(); // TODO: Check if account number exists
        console.info("accountNumber", accountNumber);
        await accountInfoModel.create({
          account_no: accountNumber,
          a_holder_name: accountHolderName,
          a_holder_address: accountHolderAddress,
          a_phone_no: accountHolderPhone,
          a_dob: accountHolderDob,
          a_gender: accountHolderGender,
          a_type: accountHolderType,
          a_balance:
            accountHolderBalance && accountHolderBalance > 0
              ? accountHolderBalance
              : 0,
        });
        res
          .status(SUCCESS)
          .json({ ...ACCOUNT_CREATION_SUCCESS, data: { accountNumber } });
      } else {
        res.status(BAD_REQUEST).json(INVALID_DATA);
      }
    }
  } catch (err) {
    console.error("Error in creating account", err);
    res.status(INTERNAL_SERVER_ERROR).json(ACCOUNT_CREATION_FAILED);
  }
};

const getTransactionHeader = async () => {
  return await transactionHeaderModel.findAll({ raw: true });
};

const getTransactionDetails = async (req, res) => {
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
        "available_balance",
      ],
      raw: true,
      nest: true,
    });

    if (transactionDetails.length !== 0) {
      // transactionDetails[0]['transaction_date'] = moment(transactionDetails[0]['transaction_date']).format('DD-MM-YYYY HH:mm:ss');
      // console.info("transactionDetails ", transactionDetails[0]['transaction_date']);
      transactionDetails = transactionDetails.map((detail) => ({
        ...detail,
        ["transaction_date"]: moment(detail["transaction_date"]).format(
          "DD-MM-YYYY HH:mm:ss"
        ),
      }));
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

const cashDeposit = async (req, res) => {
  let transaction;
  const { accountNumber, amount } = req.body;
  try {
    transaction = await Sequelize.transaction();
    const { id: accountId, a_balance: accountBalance } =
      await checkAccountBalance(accountNumber);
    if (accountBalance >= 0 && accountId) {
      const accountBalanceUpdated = await accountInfoModel.update(
        {
          a_balance: accountBalance + amount,
        },
        {
          where: {
            account_no: accountNumber,
          },
          transaction,
        }
      );

      console.info("accountBalanceUpdated ", accountBalanceUpdated);
      if (accountBalanceUpdated) {
        await transactionModel.create(
          {
            account_id: accountId,
            transaction_description: "Cash Deposit",
            transaction_type: TRANSACTION_TYPE.CREDIT,
            transaction_amount: amount,
            available_balance: accountBalance + amount,
            transaction_date: new Date(),
          },
          { transaction }
        );

        res.status(SUCCESS).json({
          error: null,
          data: {
            ...CASH_DEPOSIT_SUCCESS,
            accountBalance: accountBalance + amount,
          },
        });
        await transaction.commit();
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
    await transaction.rollback();
  }
};

const getAccountInfoHeader = async (req, res) => {
  try {
    const accountInfoHeader = await accountInfoHeaderModel.findAll({
      attributes: ["key", "value"],
      raw: true,
    });
    res.status(SUCCESS).json({ error: null, data: [...accountInfoHeader] });
  } catch (error) {
    console.error("Error in getting account info header", error);
    res.status(INTERNAL_SERVER_ERROR).json({
      error,
      data: null,
    });
  }
};

const cashWithdrawal = async (req, res) => {
  let transaction;
  CASH_WITHDRAW_SUCCESS;
  const { accountNumber, amount } = req.body;
  try {
    transaction = await Sequelize.transaction();
    const { id: accountId, a_balance: accountBalance } =
      await checkAccountBalance(accountNumber);
    console.log("accountBalance", accountBalance);
    console.log("amount", amount);
    const accountBalanceToUpdate = accountBalance - amount
    if (accountBalance && accountId && accountBalance >= amount) {
      const payload = {
        a_balance: accountBalanceToUpdate,
      };
      console.log("Payload to update", payload);

      const option = {
        id: accountId,
        account_no: accountNumber,
      };

      console.log("option", option);
      const accountBalanceUpdated = await accountInfoModel.update(
        {
          a_balance: accountBalanceToUpdate,
        },
        {
          where: {
            [Op.and]: [{ id: accountId }, { account_no: accountNumber }],
          },
          returning: true,
          plain: true,
          transaction,
        }
      );

      console.info("accountBalanceUpdated ", accountBalanceUpdated);
        await transactionModel.create(
          {
            account_id: accountId,
            transaction_description: "Cash Withdrawal",
            transaction_type: TRANSACTION_TYPE.DEBIT,
            transaction_amount: amount,
            available_balance: accountBalanceToUpdate,
            transaction_date: new Date(),
          },
          { transaction }
        );

        res.status(SUCCESS).json({
          error: null,
          data: {
            ...CASH_WITHDRAW_SUCCESS,
            accountBalance: accountBalanceToUpdate,
          },
        });
        await transaction.commit();
    } else {
      console.log("Insufficient balance", INSUFFICIENT_BALANCE);
      throw Error(INSUFFICIENT_BALANCE.message, {
        cause: { status: INSUFFICIENT_BALANCE.code },
      });
    }
  } catch (error) {
    console.error("Error ", error);
    res.status(error.cause.status).json({
      error: {
        code: error.cause.status,
        message: error.message,
      },
      data: null,
    });
    await transaction.rollback();
  }
};

const getAccountDetails = async (req, res) => {
  const { accountNumber } = req.body;
  console.info("req body", req.body);
  try {
    const accountDetails = await accountInfoModel.findOne({
      where: {
        account_no: accountNumber,
      },
      attributes: [
        "a_holder_name",
        "a_holder_address",
        "account_no",
        "a_type",
        "a_balance",
      ],
      raw: true,
    });
    if (accountDetails) {
      res.status(SUCCESS).json({
        error: null,
        data: {
          ...accountDetails,
        },
      });
    } else {
      throw Error(NO_ACCOUNT_FOUND.message, {
        cause: { status: NO_ACCOUNT_FOUND.code },
      });
    }
  } catch (error) {
    // console.error("Error in fetching account details", error);
    console.error("Error ", error);
    res.status(error.cause.status).json({
      error: {
        code: error.cause.status,
        message: error.message,
      },
      data: null,
    });
  }
};

module.exports = {
  createBankAccount,
  getTransactionDetails,
  cashDeposit,
  cashWithdrawal,
  getAccountInfoHeader,
  getAccountDetails,
};

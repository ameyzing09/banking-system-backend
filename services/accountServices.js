const moment = require("moment");

const accountInfoModel = require("../models/accountInfo");
const transactionModel = require("../models/transaction");
const transactionHeader = require("../models/transactionHeader");

const getAccountNumber = require("../utils/getAccountNumber");

const { ACCOUNT_CREATION_FAILED, INVALID_DATA } = require("../constants/error");
const {
  VIEW_TRANSACTION_SUCCESS,
  ACCOUNT_CREATION_SUCCESS,
  CASH_DEPOSIT_SUCCESS,
  CASH_WITHDRAW_SUCCESS,
} = require("../constants/success");
const { NO_ACCOUNT_FOUND } = require("../constants/error");
const { TRANSACTION_TYPE } = require("../constants/transactionConstants");

const {
  SUCCESS,
  NOT_FOUND,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
} = require("../constants/httpStatusCodes");

const checkAccountBalance = require("./checkAccountBalance");

const Sequelize = require("../dbConfig");

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
  return await transactionHeader.findAll({ raw: true });
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
        [Sequelize.col("account_info.a_balance"), "a_balance"],
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
    if (accountBalance && accountId) {
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

const cashWithdrawal = async (req, res) => {
  let transaction;
  CASH_WITHDRAW_SUCCESS;
  const { accountNumber, amount } = req.body;
  try {
    transaction = await Sequelize.transaction();
    const { id: accountId, a_balance: accountBalance } =
      await checkAccountBalance(accountNumber);
    if (accountBalance && accountId && accountBalance >= amount) {
      const accountBalanceUpdated = await accountInfoModel.update(
        {
          a_balance: accountBalance - amount,
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
            transaction_description: "Cash Withdrawal",
            transaction_type: TRANSACTION_TYPE.DEBIT,
            transaction_amount: amount,
            available_balance: accountBalance - amount,
            transaction_date: new Date(),
          },
          { transaction }
        );

        res.status(SUCCESS).json({
          error: null,
          data: {
            ...CASH_WITHDRAW_SUCCESS,
            accountBalance: accountBalance - amount,
          },
        });
        await transaction.commit();
      } else {
        throw new Error(NO_ACCOUNT_FOUND);
      }
    }
  } catch (error) {
    console.error(`Error fetching balance for ${accountNumber}`);
    res.status(INTERNAL_SERVER_ERROR).json({
      error,
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
      include: ["id"],
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
      throw new Error(NO_ACCOUNT_FOUND);
    }
  } catch (error) {
    console.error("Error in fetching account details", error);
    res.status(NOT_FOUND).json({
      error: NO_ACCOUNT_FOUND,
      data: null,
    });
  }
};

module.exports = {
  createBankAccount,
  getTransactionDetails,
  cashDeposit,
  cashWithdrawal,
  getAccountDetails,
};

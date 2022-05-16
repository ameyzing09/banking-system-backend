ALTER TABLE `banking-system`.`transaction` 
ADD COLUMN `transaction_amount` FLOAT NOT NULL AFTER `transaction_description`,
CHANGE COLUMN `transaction_description` `transaction_description` VARCHAR(255) NOT NULL AFTER `account_id`;

ALTER TABLE `banking-system`.`transaction` 
ADD COLUMN `balance` FLOAT NOT NULL AFTER `transaction_amount`,
CHANGE COLUMN `transaction_date` `transaction_date` DATETIME NOT NULL ;

CREATE TABLE `banking-system`.`transaction_heading` (
  `id` INT NOT NULL,
  `key` VARCHAR(45) NOT NULL,
  `value` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`));

INSERT INTO `banking-system`.`transaction_heading` (`id`, `key`, `value`) VALUES ('1', 'transactionId', 'Transaction ID');
INSERT INTO `banking-system`.`transaction_heading` (`id`, `key`, `value`) VALUES ('2', 'transactionDate', 'Date');
INSERT INTO `banking-system`.`transaction_heading` (`id`, `key`, `value`) VALUES ('3', 'transactionDescription', 'Description');
INSERT INTO `banking-system`.`transaction_heading` (`id`, `key`, `value`) VALUES ('4', 'transactionType', 'Transaction Type');
INSERT INTO `banking-system`.`transaction_heading` (`id`, `key`, `value`) VALUES ('5', 'balance', 'Balance');
INSERT INTO `banking-system`.`transaction_heading` (`id`, `key`, `value`) VALUES ('6', 'totalBalance', 'Available Balance');

ALTER TABLE `banking-system`.`transaction` 
DROP COLUMN `balance`;

ALTER TABLE `banking-system`.`transaction` 
ADD COLUMN `available_balance` FLOAT NOT NULL AFTER `transaction_amount`;

CREATE TABLE `banking-system`.`account_info_heading` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `key` VARCHAR(100) NOT NULL,
  `value` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`));

INSERT INTO `banking-system`.`account_info_heading` (`id`, `key`, `value`) VALUES ('1', 'account_holder_name', 'Account Holder Name');
INSERT INTO `banking-system`.`account_info_heading` (`key`, `value`) VALUES ('account_no', 'Account Number');
INSERT INTO `banking-system`.`account_info_heading` (`key`, `value`) VALUES ('a_holder_address', 'Account Address');
INSERT INTO `banking-system`.`account_info_heading` (`key`, `value`) VALUES ('a_phone_no', 'Contact');
INSERT INTO `banking-system`.`account_info_heading` (`key`, `value`) VALUES ('a_gender', 'Gender');
INSERT INTO `banking-system`.`account_info_heading` (`key`, `value`) VALUES ('a_type', 'Account Type');
INSERT INTO `banking-system`.`account_info_heading` (`key`, `value`) VALUES ('a_balance', 'Available Balance');

UPDATE `banking-system`.`account_info_heading` SET `key` = 'a_holder_name' WHERE (`id` = '1');

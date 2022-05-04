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

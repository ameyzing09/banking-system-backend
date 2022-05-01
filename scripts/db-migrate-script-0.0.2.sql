ALTER TABLE `banking-system`.`transaction` 
ADD COLUMN `transaction_amount` FLOAT NOT NULL AFTER `transaction_description`,
CHANGE COLUMN `transaction_description` `transaction_description` VARCHAR(255) NOT NULL AFTER `account_id`;

ALTER TABLE `banking-system`.`transaction` 
ADD COLUMN `balance` FLOAT NOT NULL AFTER `transaction_amount`,
CHANGE COLUMN `transaction_date` `transaction_date` DATETIME NOT NULL ;

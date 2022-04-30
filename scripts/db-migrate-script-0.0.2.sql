ALTER TABLE `banking-system`.`transaction` 
ADD COLUMN `transaction_amount` FLOAT NOT NULL AFTER `transaction_description`,
CHANGE COLUMN `transaction_description` `transaction_description` VARCHAR(255) NOT NULL AFTER `account_id`;

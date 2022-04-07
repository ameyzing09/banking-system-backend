USE `banking-system`;
DROP TABLE IF EXISTS `banking-system`.`user`;
CREATE TABLE `banking-system`.`user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`));

INSERT INTO `banking-system`.`user` (`id`, `username`, `password`) VALUES (1, 'admin', 'admin');


DROP TABLE IF EXISTS `banking-system`.`account_info`;
CREATE TABLE `banking-system`.`account_info` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `account_no` VARCHAR(45) NOT NULL,
  `a_holder_name` VARCHAR(45) NOT NULL,
  `a_holder_address` LONGTEXT NOT NULL,
  `a_phone_no` VARCHAR(45) NOT NULL,
  `a_dob` DATE NOT NULL,
  `a_gender` ENUM("MALE", "FEMALE", "OTHER") NOT NULL,
  `a_type` ENUM("SAVING", "CURRENT") NOT NULL,
  `a_balance` FLOAT NULL DEFAULT 0,
  `a_date_opened` DATETIME(1) NOT NULL,
  PRIMARY KEY (`id`));


DROP TABLE IF EXISTS `banking-system`.`transaction`;
CREATE TABLE `banking-system`.`transaction` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `account_id` INT NOT NULL,
  `transaction_type` ENUM("DEBIT", "CREDIT") NOT NULL,
  `transaction_description` VARCHAR(255) NOT NULL,
  `transaction_date` DATETIME NULL,
  PRIMARY KEY (`id`),
  INDEX `account_id_idx` (`account_id` ASC) VISIBLE,
  CONSTRAINT `account_id`
    FOREIGN KEY (`account_id`)
    REFERENCES `banking-system`.`account_info` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);

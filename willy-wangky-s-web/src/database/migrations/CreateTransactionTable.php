<?php


class CreateTransactionTable
{
    public static function up($conn) {
        echo '[+] Migrating transaction table...'.PHP_EOL;
        $conn->query("
        CREATE TABLE IF NOT EXISTS transaction (
            id int PRIMARY KEY AUTO_INCREMENT,
            user_id int,
            chocolate int,
            amount int,
            total_price bigint,
            address varchar(20),
            transaction_date date,
            transaction_time time,
            FOREIGN KEY (chocolate) REFERENCES chocolate(id),
            FOREIGN KEY (user_id) REFERENCES user(id)
        );");
        $conn->commit();
        echo '[+] Done...'.PHP_EOL;
    }
}
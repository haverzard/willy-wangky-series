<?php


class CreateChocolateTable
{
    public static function up($conn) {
        echo '[+] Migrating chocolate table...'.PHP_EOL;
        $conn->query("
        CREATE TABLE IF NOT EXISTS chocolate (
            id int PRIMARY KEY AUTO_INCREMENT,
            name varchar(100),
            price int,
            image_file_type varchar(7),
            description varchar(500),
            stock int,
            sold int
        );");
        $conn->commit();
        echo '[+] Done...'.PHP_EOL;
    }
}
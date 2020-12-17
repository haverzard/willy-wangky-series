<?php


class CreateUserTable
{
    public static function up($conn) {
        echo '[+] Migrating user table...'.PHP_EOL;
        $conn->query("
        CREATE TABLE IF NOT EXISTS user (
            id int PRIMARY KEY AUTO_INCREMENT,
            username varchar(100) unique,
            email varchar(100) unique,
            password varchar(100),
            is_superuser bit,
            access_token varchar(64) unique,
            token_creation_time datetime
        );");
        $conn->query("
        INSERT IGNORE INTO user (username, email, password, is_superuser) 
        VALUES ('admin', 'admin@admin', 'admin', 1);");
        $conn->commit();
        echo '[+] Done...'.PHP_EOL;
    }
}

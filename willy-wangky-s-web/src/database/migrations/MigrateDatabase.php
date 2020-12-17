<?php


class MigrateDatabase
{
    private static $conn;

    public static function getConnection() {
        if (!empty(self::$conn)) {
            return self::$conn;
        }

        self::$conn = new mysqli(getenv("DB_HOST"), getenv("DB_USERNAME"), getenv("DB_PASSWORD"));
        if (self::$conn->connect_error) {
            throw new Exception("Connection failed: " . self::$conn->connect_error);
        }
        self::$conn->query("CREATE DATABASE ".getenv("DB_DATABASE"));
        self::$conn->begin_transaction();
        self::$conn->select_db(getenv("DB_DATABASE"));

        return self::$conn;
    }

    public static function up() {
        echo '[+] Starting migration...'.PHP_EOL;
        $conn = self::getConnection();
        CreateUserTable::up($conn);
        CreateChocolateTable::up($conn);
        CreateTransactionTable::up($conn);
        CreatePendingAddStockRequestTable::up($conn);
        echo '[+] Finished...'.PHP_EOL;
    }
}
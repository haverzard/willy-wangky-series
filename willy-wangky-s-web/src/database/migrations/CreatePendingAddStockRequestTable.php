<?php


class CreatePendingAddStockRequestTable
{
    public static function up($conn) {
        echo '[+] Migrating add stock request table...'.PHP_EOL;
        $conn->query("
        CREATE TABLE IF NOT EXISTS pending_add_stock_request (
          id int PRIMARY KEY
        );");
        $conn->commit();
        echo '[+] Done...'.PHP_EOL;
    }
}
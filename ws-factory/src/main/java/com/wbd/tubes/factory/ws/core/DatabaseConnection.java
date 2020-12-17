package com.wbd.tubes.factory.ws.core;

import java.sql.*;

public class DatabaseConnection {
    private Connection conn;

    static final String DB_URL = "jdbc:mysql://localhost/factory_db";
    static final String DB_USER = "root";
    static final String DB_PASS = "admin";

    static final String JDBC_DRIVER = "com.mysql.cj.jdbc.Driver";

    public DatabaseConnection() {
        try {
            Class.forName(JDBC_DRIVER);
            this.conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASS);
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }

    public Connection getConnection() {
        return this.conn;
    }
}

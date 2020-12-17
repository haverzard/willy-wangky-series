package com.wbd.tubes.factory.ws.exceptions;

public class SaldoNotFoundException extends Exception {

    public SaldoNotFoundException() {
        super("Saldo data not found in the database");
    }
}

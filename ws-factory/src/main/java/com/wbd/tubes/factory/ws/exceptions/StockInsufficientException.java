package com.wbd.tubes.factory.ws.exceptions;

public class StockInsufficientException extends Exception {

    public StockInsufficientException(int stock, int required) {
        super(String.format("Stock: %d, Required: %d", stock, required));
    }
}

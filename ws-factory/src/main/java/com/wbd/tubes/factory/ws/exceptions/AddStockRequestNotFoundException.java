package com.wbd.tubes.factory.ws.exceptions;

public class AddStockRequestNotFoundException extends Exception {

    public AddStockRequestNotFoundException() {
        super("Add stock request with supplied id not found");
    }
}

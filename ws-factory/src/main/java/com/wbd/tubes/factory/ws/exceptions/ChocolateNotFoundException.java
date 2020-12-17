package com.wbd.tubes.factory.ws.exceptions;

public class ChocolateNotFoundException extends Exception {

    public ChocolateNotFoundException() {
        super("Chocolate with supplied id not found");
    }
}

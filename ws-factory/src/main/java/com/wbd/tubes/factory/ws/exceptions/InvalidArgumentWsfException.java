package com.wbd.tubes.factory.ws.exceptions;

public class InvalidArgumentWsfException extends Exception {

    public InvalidArgumentWsfException(int argNumber, String argName, String message) {
        super(String.format("Invalid input in arg%d:%s with message: '%s'", argNumber, argName, message));
    }
}

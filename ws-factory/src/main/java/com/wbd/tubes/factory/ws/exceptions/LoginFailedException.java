package com.wbd.tubes.factory.ws.exceptions;

public class LoginFailedException extends Exception {

    public LoginFailedException() {
        super("Login attempt failed");
    }
}

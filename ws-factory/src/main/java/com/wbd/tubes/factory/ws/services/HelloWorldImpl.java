package com.wbd.tubes.factory.ws.services;

import com.wbd.tubes.factory.ws.services.interfaces.HelloWorld;

import javax.jws.WebService;

@WebService(endpointInterface = "com.wbd.tubes.factory.ws.services.interfaces.HelloWorld")
public class HelloWorldImpl implements HelloWorld {

    @Override
    public String getMessage(String name) {
        return "Hello " + name + "!";
    }
}

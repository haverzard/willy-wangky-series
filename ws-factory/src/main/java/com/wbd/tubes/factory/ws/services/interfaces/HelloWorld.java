package com.wbd.tubes.factory.ws.services.interfaces;

import javax.jws.WebMethod;
import javax.jws.WebService;
import javax.jws.soap.SOAPBinding;

@WebService
@SOAPBinding(style = SOAPBinding.Style.DOCUMENT)
public interface HelloWorld {

    @WebMethod
    String getMessage(String name);
}

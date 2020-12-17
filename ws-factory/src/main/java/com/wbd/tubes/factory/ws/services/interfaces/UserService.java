package com.wbd.tubes.factory.ws.services.interfaces;

import com.wbd.tubes.factory.ws.exceptions.SQLWsfException;
import com.wbd.tubes.factory.ws.exceptions.LoginFailedException;

import javax.jws.WebMethod;
import javax.jws.WebParam;
import javax.jws.WebService;
import javax.jws.soap.SOAPBinding;

@WebService
@SOAPBinding(style = SOAPBinding.Style.DOCUMENT)
public interface UserService {

    @WebMethod
    String login(@WebParam(name="username") String username, @WebParam(name="password") String password)
            throws SQLWsfException, LoginFailedException;

}

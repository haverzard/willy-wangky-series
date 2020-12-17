package com.wbd.tubes.factory.ws.services.interfaces;

import com.wbd.tubes.factory.ws.exceptions.InvalidArgumentWsfException;
import com.wbd.tubes.factory.ws.exceptions.SQLWsfException;
import com.wbd.tubes.factory.ws.exceptions.SaldoNotFoundException;

import javax.jws.WebMethod;
import javax.jws.WebParam;
import javax.jws.WebService;
import javax.jws.soap.SOAPBinding;

@WebService
@SOAPBinding(style = SOAPBinding.Style.DOCUMENT)
public interface SaldoService {

    @WebMethod
    int getSaldo() throws SaldoNotFoundException, SQLWsfException;

    @WebMethod
    boolean addSaldo(@WebParam(name="addition") int addition)
            throws InvalidArgumentWsfException, SaldoNotFoundException, SQLWsfException;
}

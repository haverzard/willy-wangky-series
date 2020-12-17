package com.wbd.tubes.factory.ws.services.interfaces;

import com.wbd.tubes.factory.ws.exceptions.AddStockRequestNotFoundException;
import com.wbd.tubes.factory.ws.exceptions.StockInsufficientException;
import com.wbd.tubes.factory.ws.exceptions.InvalidArgumentWsfException;
import com.wbd.tubes.factory.ws.exceptions.SQLWsfException;
import com.wbd.tubes.factory.ws.models.AddStockRequest;

import javax.jws.WebMethod;
import javax.jws.WebParam;
import javax.jws.WebService;
import javax.jws.soap.SOAPBinding;

@WebService
@SOAPBinding(style = SOAPBinding.Style.DOCUMENT)
public interface AddStockRequestService {

    @WebMethod
    AddStockRequest[] getAllAddStockRequests() throws SQLWsfException;

    @WebMethod
    boolean approveAddStockRequest(@WebParam(name="id") int id)
            throws AddStockRequestNotFoundException, SQLWsfException, StockInsufficientException;

    @WebMethod
    int addAddStockRequest(@WebParam(name="chocolateId") int chocolateId, @WebParam(name="amountToAdd") int amountToAdd)
            throws InvalidArgumentWsfException, SQLWsfException;

    @WebMethod
    AddStockRequest getAddStockRequest(@WebParam(name="id") int id)
            throws AddStockRequestNotFoundException, SQLWsfException;
}

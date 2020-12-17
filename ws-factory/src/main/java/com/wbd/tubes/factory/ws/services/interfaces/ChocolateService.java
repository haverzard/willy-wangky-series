package com.wbd.tubes.factory.ws.services.interfaces;

import com.wbd.tubes.factory.ws.exceptions.InvalidArgumentWsfException;
import com.wbd.tubes.factory.ws.exceptions.ChocolateNotFoundException;
import com.wbd.tubes.factory.ws.exceptions.IngredientInsufficientException;
import com.wbd.tubes.factory.ws.exceptions.SQLWsfException;
import com.wbd.tubes.factory.ws.models.Chocolate;

import javax.jws.WebMethod;
import javax.jws.WebParam;
import javax.jws.WebService;
import javax.jws.soap.SOAPBinding;

@WebService
@SOAPBinding(style = SOAPBinding.Style.DOCUMENT)
public interface ChocolateService {

    @WebMethod
    boolean addChocolate(@WebParam(name="id") int id, @WebParam(name="name") String name)
            throws InvalidArgumentWsfException, SQLWsfException;

    @WebMethod
    Chocolate[] getAllChocolates() throws SQLWsfException;

    @WebMethod
    boolean restockChocolate(@WebParam(name="id") int id, @WebParam(name="amountToCreate") int amountToCreate)
            throws IngredientInsufficientException, ChocolateNotFoundException,
                InvalidArgumentWsfException, SQLWsfException;
}

package com.wbd.tubes.factory.ws.services.interfaces;

import com.wbd.tubes.factory.ws.exceptions.InvalidArgumentWsfException;
import com.wbd.tubes.factory.ws.exceptions.SQLWsfException;
import com.wbd.tubes.factory.ws.exceptions.IngredientNotFoundException;
import com.wbd.tubes.factory.ws.models.Ingredient;
import com.wbd.tubes.factory.ws.models.Supply;

import javax.jws.WebMethod;
import javax.jws.WebService;
import javax.jws.WebParam;
import javax.jws.soap.SOAPBinding;

@WebService
@SOAPBinding(style = SOAPBinding.Style.DOCUMENT)
public interface IngredientService {

    @WebMethod
    boolean addIngredient(@WebParam(name="id") int id, @WebParam(name="name") String name, @WebParam(name="expConstant") int expConstant)
            throws InvalidArgumentWsfException, SQLWsfException;

    @WebMethod
    boolean addSupplies(@WebParam(name="saldo") int saldo, @WebParam(name="supplies") Supply[] supplies)
            throws IngredientNotFoundException, SQLWsfException,
                    InvalidArgumentWsfException;

    @WebMethod
    Ingredient[] getAllIngredients() throws SQLWsfException;

    @WebMethod
    Ingredient getIngredient(@WebParam(name="id") int id) throws IngredientNotFoundException, SQLWsfException;
}

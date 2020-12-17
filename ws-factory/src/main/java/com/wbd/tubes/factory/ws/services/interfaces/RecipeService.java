package com.wbd.tubes.factory.ws.services.interfaces;

import com.wbd.tubes.factory.ws.exceptions.InvalidArgumentWsfException;
import com.wbd.tubes.factory.ws.exceptions.SQLWsfException;
import com.wbd.tubes.factory.ws.models.Recipe;

import javax.jws.WebMethod;
import javax.jws.WebParam;
import javax.jws.WebService;
import javax.jws.soap.SOAPBinding;

@WebService
@SOAPBinding(style = SOAPBinding.Style.DOCUMENT)
public interface RecipeService {

    @WebMethod
    boolean addRecipe(@WebParam(name="recipe") Recipe recipe)
            throws InvalidArgumentWsfException, SQLWsfException;

    @WebMethod
    Recipe[] getAllRecipes() throws SQLWsfException;
}

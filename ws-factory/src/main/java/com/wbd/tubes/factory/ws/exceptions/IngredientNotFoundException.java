package com.wbd.tubes.factory.ws.exceptions;

public class IngredientNotFoundException extends Exception {

    public IngredientNotFoundException() {
        super("Ingredient with supplied id not found");
    }
}

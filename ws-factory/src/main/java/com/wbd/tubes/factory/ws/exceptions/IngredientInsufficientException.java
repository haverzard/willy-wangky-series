package com.wbd.tubes.factory.ws.exceptions;

public class IngredientInsufficientException extends Exception {

    public IngredientInsufficientException(String name, int required, int stock) {
        super(String.format("Ingredient: %s - Required: %d, In Stock: %d", name, required, stock));
    }
}

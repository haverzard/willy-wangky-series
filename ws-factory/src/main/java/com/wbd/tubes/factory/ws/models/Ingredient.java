package com.wbd.tubes.factory.ws.models;

import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlElement;

@XmlRootElement
public class Ingredient {

    @XmlElement
    public int id;
    @XmlElement
    public int ingredient_id;
    @XmlElement
    public String name;
    @XmlElement
    public int stock;
    @XmlElement
    public String expDate;

    public Ingredient() {}

    public Ingredient(int id, int ingredient_id, String name, int stock, String expDate) {
        this.id = id;
        this.ingredient_id = ingredient_id;
        this.name = name;
        this.stock = stock;
        this.expDate = expDate;
    }

    public int getId() {
        return id;
    }

    public int getIngredientId() {
        return ingredient_id;
    }

    public String getName() {
        return name;
    }

    public int getStock() {
        return stock;
    }

    public String getExpDate() {
        return expDate;
    }
}

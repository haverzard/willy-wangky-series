package com.wbd.tubes.factory.ws.models;

import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlElement;

@XmlRootElement
public class SingleRecipe {

    @XmlElement
    public int chocolateId;
    @XmlElement
    public int ingredientId;
    @XmlElement
    public String name;
    @XmlElement
    public int amount;

    public SingleRecipe() {
        this.chocolateId = -1;
        this.ingredientId = -1;
        this.amount = -1;
    }

    public SingleRecipe(int chocolateId, int ingredientId, String name, int amount) {
        this.chocolateId = chocolateId;
        this.ingredientId = ingredientId;
        this.name = name;
        this.amount = amount;
    }

    public int getChocolateId() {
        return chocolateId;
    }

    public int getIngredientId() {
        return ingredientId;
    }

    public String getName() {
        return name;
    }

    public int getAmount() {
        return amount;
    }
}

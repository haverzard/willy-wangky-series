package com.wbd.tubes.factory.ws.models;

import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlElement;

@XmlRootElement
public class Recipe {

    @XmlElement
    public SingleRecipe[] singleRecipes;

    public Recipe() {
        this.singleRecipes = new SingleRecipe[0];
    }

    public Recipe(SingleRecipe[] singleRecipes) {
        this.singleRecipes = singleRecipes;
    }

    public SingleRecipe[] getSingleRecipes() {
        return singleRecipes;
    }
}

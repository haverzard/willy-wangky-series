package com.wbd.tubes.factory.ws.services;

import com.wbd.tubes.factory.ws.core.DatabaseConnection;
import com.wbd.tubes.factory.ws.exceptions.InvalidArgumentWsfException;
import com.wbd.tubes.factory.ws.exceptions.SQLWsfException;
import com.wbd.tubes.factory.ws.models.Chocolate;
import com.wbd.tubes.factory.ws.models.Recipe;
import com.wbd.tubes.factory.ws.models.SingleRecipe;
import com.wbd.tubes.factory.ws.services.interfaces.RecipeService;

import javax.jws.WebService;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@WebService(endpointInterface = "com.wbd.tubes.factory.ws.services.interfaces.RecipeService")
public class RecipeServiceImpl implements RecipeService {

    @Override
    public boolean addRecipe(Recipe recipe) throws InvalidArgumentWsfException, SQLWsfException {
        try {
            // get connection
            Connection conn = (new DatabaseConnection()).getConnection();
            // prepare statement
            String query1 = "INSERT INTO recipe (chocolate_id,ingredient_id,amount) VALUES (?,?,?)";
            PreparedStatement preparedStatement = conn.prepareStatement(query1);
            String query2 = "INSERT INTO base_ingredient VALUES (?,?,?)";
            PreparedStatement psIngredient = conn.prepareStatement(query2);
            Statement stmt = conn.createStatement();
            Random rand = new Random();
            // add single recipe batch
            for (SingleRecipe singleRecipe: recipe.getSingleRecipes()) {
                // validate input, if fails throw invalid argument exception
                if (singleRecipe.amount <= 0) {
                    throw new InvalidArgumentWsfException(1, "recipe", "Single recipe amount value must be positive");
                }
                // check if ingredient in db
                String queryFinder = String.format("SELECT * FROM base_ingredient WHERE id = %d", singleRecipe.ingredientId);
                ResultSet rs = stmt.executeQuery(queryFinder);
                if (!rs.next()) {
                    // if not in db, insert ingredient
                    psIngredient.setInt(1, singleRecipe.ingredientId);
                    psIngredient.setString(2, singleRecipe.name);
                    psIngredient.setInt(3, rand.nextInt(30));
                    psIngredient.addBatch();
                }
                // bind value
                preparedStatement.setInt(1, singleRecipe.chocolateId);
                preparedStatement.setInt(2, singleRecipe.ingredientId);
                preparedStatement.setInt(3, singleRecipe.amount);
                // add batch
                preparedStatement.addBatch();
            }
            // execute batch
            psIngredient.executeBatch();
            preparedStatement.executeBatch();
            // return true
            return true;
        } catch (SQLException sqle) {
            sqle.printStackTrace();
            throw new SQLWsfException();
        }
    }

    private List<Chocolate> getChocolateList() throws SQLException {
        // get connection
        Connection conn = (new DatabaseConnection()).getConnection();
        // prepare statement
        String query = "SELECT * FROM chocolate";
        Statement stmt = conn.createStatement();
        // execute statement
        ResultSet rs = stmt.executeQuery(query);
        // convert to chocolate object
        List<Chocolate> chocolateList = new ArrayList<>();
        while (rs.next()) {
            int id = rs.getInt("id");
            String name = rs.getString("name");
            int stock = rs.getInt("stock");
            chocolateList.add(new Chocolate(id, name, stock));
        }
        // return
        return chocolateList;
    }

    private Recipe getRecipe(int chocolateIdInput) throws SQLException {
        // get connection
        Connection conn = (new DatabaseConnection()).getConnection();
        // prepare statement
        String query = String.format("SELECT * FROM recipe JOIN base_ingredient WHERE ingredient_id = base_ingredient.id AND chocolate_id=%d", chocolateIdInput);
        Statement stmt = conn.createStatement();
        // execute statement
        ResultSet rs = stmt.executeQuery(query);
        // convert to chocolate object
        List<SingleRecipe> singleRecipeList = new ArrayList<>();
        while (rs.next()) {
            int chocolateId = rs.getInt("chocolate_id");
            int ingredientId = rs.getInt("ingredient_id");
            String name = rs.getString("name");
            int amount = rs.getInt("amount");
            singleRecipeList.add(new SingleRecipe(chocolateId, ingredientId, name, amount));
        }
        // convert to array
        SingleRecipe[] singleRecipeArray = new SingleRecipe[singleRecipeList.size()];
        singleRecipeList.toArray(singleRecipeArray);
        // create recipe object
        Recipe recipe = new Recipe(singleRecipeArray);
        // return
        return recipe;
    }

    @Override
    public Recipe[] getAllRecipes() throws SQLWsfException {
        try {
            // get chocolate list
            List<Chocolate> chocolateList = getChocolateList();
            // create recipe list
            List<Recipe> recipeList = new ArrayList<>();
            // get recipe
            for (Chocolate chocolate: chocolateList) {
                recipeList.add(getRecipe(chocolate.getId()));
            }
            // convert to array
            Recipe[] recipeArray = new Recipe[recipeList.size()];
            recipeList.toArray(recipeArray);
            // return
            return recipeArray;
        } catch (SQLException sqle) {
            sqle.printStackTrace();
            throw new SQLWsfException();
        }
    }
}

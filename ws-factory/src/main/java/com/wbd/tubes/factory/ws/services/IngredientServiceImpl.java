package com.wbd.tubes.factory.ws.services;

import com.wbd.tubes.factory.ws.core.DatabaseConnection;
import com.wbd.tubes.factory.ws.exceptions.InvalidArgumentWsfException;
import com.wbd.tubes.factory.ws.exceptions.SQLWsfException;
import com.wbd.tubes.factory.ws.exceptions.IngredientNotFoundException;
import com.wbd.tubes.factory.ws.models.Ingredient;
import com.wbd.tubes.factory.ws.models.Supply;
import com.wbd.tubes.factory.ws.services.interfaces.IngredientService;

import javax.jws.WebService;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@WebService(endpointInterface = "com.wbd.tubes.factory.ws.services.interfaces.IngredientService")
public class IngredientServiceImpl implements IngredientService {

    @Override
    public boolean addIngredient(int id, String name, int expConstant)
            throws InvalidArgumentWsfException, SQLWsfException {
        // validate input
        if (expConstant < 0) {
            throw new InvalidArgumentWsfException(3, "expConstant", "Expire Constant value must not be negative");
        }

        try {
            // get connection
            Connection conn = (new DatabaseConnection()).getConnection();
            // prepare statement
            String query = "INSERT INTO base_ingredient (id, name, exp_constant) VALUES (?, ?, ?)";
            PreparedStatement preparedStatement = conn.prepareStatement(query);
            preparedStatement.setString(1, name);
            preparedStatement.setInt(2, expConstant);
            // execute statement
            int rowsUpdated = preparedStatement.executeUpdate();
            // return true
            return true;
        } catch (SQLException sqle) {
            sqle.printStackTrace();
            throw new SQLWsfException();
        }
    }

    @Override
    public boolean addSupplies(int saldo, Supply[] supplies)
            throws SQLWsfException, InvalidArgumentWsfException {
        // check saldo value
        if (saldo < 0) {
            throw new InvalidArgumentWsfException(1, "saldo", "saldo value must not be negative or zero");
        }

        try {
            // get connection
            Connection conn = (new DatabaseConnection()).getConnection();
            // create selector statement
            Statement stmt = conn.createStatement();
            // create batch statement for base_ingredient
            String query = "INSERT INTO base_ingredient VALUES (?,?,?)";
            PreparedStatement psBaseIngredient = conn.prepareStatement(query);
            // create batch statement for ingredient
            query = "INSERT INTO ingredient (ingredient_id, stock, exp_date) VALUES (?, ?, DATE_ADD(CURDATE(), INTERVAL ? DAY))";
            PreparedStatement psIngredient = conn.prepareStatement(query);
            // random expire constant generator
            Random rand = new Random();
            for (Supply supply: supplies) {
                // check amount value
                if (supply.getAmount() <= 0) {
                    throw new InvalidArgumentWsfException(2, "supplies", "supply's amount value must not be negative or zero");
                }
                // check if ingredient exists in db
                String queryFinder = String.format("SELECT * FROM base_ingredient WHERE id = %d", supply.getId());
                ResultSet rs = stmt.executeQuery(queryFinder);
                int exp_constant = 0;
                if (!rs.next()) {
                    exp_constant = rand.nextInt(30);
                    // create ingredient to db if not found
                    psBaseIngredient.setInt(1, supply.getId());
                    psBaseIngredient.setString(2, supply.getName());
                    psBaseIngredient.setInt(3, exp_constant);
                    psBaseIngredient.addBatch();
                } else {
                    exp_constant = rs.getInt("exp_constant");
                }
                // insert ingredient to batch
                psIngredient.setInt(1, supply.getId());
                psIngredient.setInt(2, supply.getAmount());
                psIngredient.setInt(3, exp_constant);
                psIngredient.addBatch();
            }
            // update saldo
            query = "UPDATE saldo SET saldo=?";
            PreparedStatement psSaldo = conn.prepareStatement(query);
            psSaldo.setInt(1, saldo);
            psSaldo.executeUpdate();
            // insert new ingredients
            psBaseIngredient.executeBatch();
            // insert supplies
            psIngredient.executeBatch();
            // return
            return true;
        } catch (SQLException sqle) {
            sqle.printStackTrace();
            throw new SQLWsfException();
        }
    }

    @Override
    public Ingredient[] getAllIngredients() throws SQLWsfException {
        try {
            // get connection
            Connection conn = (new DatabaseConnection()).getConnection();
            // prepare statement
            String query = "SELECT * FROM ingredient JOIN base_ingredient ON ingredient_id = base_ingredient.id";
            Statement stmt = conn.createStatement();
            // execute statement
            ResultSet rs = stmt.executeQuery(query);
            // convert to chocolate object
            List<Ingredient> ingredientList = new ArrayList<>();
            while (rs.next()) {
                int id = rs.getInt("ingredient.id");
                int ingredientId = rs.getInt("ingredient_id");
                String name = rs.getString("name");
                int stock = rs.getInt("stock");
                String expDate = rs.getString("exp_date");
                ingredientList.add(new Ingredient(id, ingredientId, name, stock, expDate));
            }
            // convert to array
            Ingredient[] ingredientArray = new Ingredient[ingredientList.size()];
            ingredientList.toArray(ingredientArray);
            // return
            return ingredientArray;
        } catch (SQLException sqle) {
            sqle.printStackTrace();
            throw new SQLWsfException();
        }
    }

    @Override
    public Ingredient getIngredient(int id) throws IngredientNotFoundException, SQLWsfException {
        try {
            // get connection
            Connection conn = (new DatabaseConnection()).getConnection();
            // prepare statement
            String query = "SELECT * FROM ingredient JOIN base_ingredient ON ingredient_id = base_ingredient.id WHERE base_ingredient.id = ?;";
            PreparedStatement preparedStatement = conn.prepareStatement(query);
            preparedStatement.setInt(1, id);
            // execute statement
            ResultSet rs = preparedStatement.executeQuery();
            // convert to chocolate object
            if (rs.next()) {
                int iid = rs.getInt("ingredient.id");
                int ingredientId = rs.getInt("ingredient_id");
                String name = rs.getString("name");
                int stock = rs.getInt("stock");
                String expDate = rs.getString("exp_date");
                // return
                return new Ingredient(iid, ingredientId, name, stock, expDate);
            } else {
                throw new IngredientNotFoundException();
            }
        } catch (SQLException sqle) {
            sqle.printStackTrace();
            throw new SQLWsfException();
        }
    }
}

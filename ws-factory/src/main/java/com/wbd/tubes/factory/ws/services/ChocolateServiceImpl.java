package com.wbd.tubes.factory.ws.services;

import com.wbd.tubes.factory.ws.core.DatabaseConnection;
import com.wbd.tubes.factory.ws.exceptions.InvalidArgumentWsfException;
import com.wbd.tubes.factory.ws.exceptions.ChocolateNotFoundException;
import com.wbd.tubes.factory.ws.exceptions.IngredientInsufficientException;
import com.wbd.tubes.factory.ws.exceptions.SQLWsfException;
import com.wbd.tubes.factory.ws.models.Chocolate;
import com.wbd.tubes.factory.ws.models.SingleRecipe;
import com.wbd.tubes.factory.ws.services.interfaces.ChocolateService;

import javax.jws.WebService;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@WebService(endpointInterface = "com.wbd.tubes.factory.ws.services.interfaces.ChocolateService")
public class ChocolateServiceImpl implements ChocolateService {

    @Override
    public boolean addChocolate(int id, String name)
            throws InvalidArgumentWsfException, SQLWsfException {

        try {
            // get connection
            Connection conn = (new DatabaseConnection()).getConnection();
            // prepare statement
            String query = "INSERT INTO chocolate (id,name,stock) VALUES (?,?,0)";
            PreparedStatement preparedStatement = conn.prepareStatement(query);
            preparedStatement.setInt(1, id);
            preparedStatement.setString(2, name);
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
    public Chocolate[] getAllChocolates() throws SQLWsfException {
        try {
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
            // convert to array
            Chocolate[] chocolateArray = new Chocolate[chocolateList.size()];
            chocolateList.toArray(chocolateArray);
            // return
            return chocolateArray;
        } catch (SQLException sqle) {
            sqle.printStackTrace();
            throw new SQLWsfException();
        }
    }

    public void useStock(Connection conn, Statement stmtBatcher, int id, int amount, String name)
            throws IngredientInsufficientException, SQLWsfException {
        try {
            String query = String.format("SELECT * FROM ingredient WHERE ingredient_id = %d AND exp_date >= CURDATE() ORDER BY exp_date ASC", id);
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery(query);
            int amountNeeded = amount;
            while (rs.next() && amountNeeded != 0) {
                int stock = rs.getInt("stock");
                int stockId = rs.getInt("id");
                if (stock > amountNeeded) {
                    query = String.format("UPDATE ingredient SET stock = %d WHERE id = %d", (stock-amountNeeded), stockId);
                    amountNeeded = 0;
                } else {
                    query = String.format("DELETE FROM ingredient WHERE id = %d", stockId);
                    amountNeeded -= stock;
                }
                stmtBatcher.addBatch(query);
            }
            if (amountNeeded != 0) {
                throw new IngredientInsufficientException(name, amount, amount-amountNeeded);
            }
        } catch (SQLException sqle) {
            sqle.printStackTrace();
            throw new SQLWsfException();
        }
    }

    @Override
    public boolean restockChocolate(int id, int amountToCreate)
            throws IngredientInsufficientException, ChocolateNotFoundException,
                    InvalidArgumentWsfException, SQLWsfException {
        // validate input
        if (amountToCreate <= 0) {
            throw new InvalidArgumentWsfException(2, "amountToCreate", "amountToCreate value must not be negative or zero");
        }

        try {
            // get connection
            Connection conn = (new DatabaseConnection()).getConnection();
            // create statement
            Statement stmt = conn.createStatement();
            // get old chocolate stock
            String query = String.format("SELECT * FROM chocolate WHERE id=%d", id);
            // execute statement
            ResultSet rs = stmt.executeQuery(query);
            if (!rs.next()) {
                throw new ChocolateNotFoundException();
            }
            int stock = rs.getInt("stock");

            // prepare statement
            Statement stmtBatcher = conn.createStatement(ResultSet.TYPE_SCROLL_SENSITIVE, ResultSet.CONCUR_UPDATABLE);
            // get recipe
            query = String.format("SELECT * FROM recipe JOIN base_ingredient WHERE ingredient_id = base_ingredient.id AND chocolate_id=%d", id);
            // execute statement
            rs = stmt.executeQuery(query);
            // convert to chocolate object
            while (rs.next()) {
                int ingredientId = rs.getInt("ingredient_id");
                String name = rs.getString("name");
                int amount = rs.getInt("amount");
                // use stock
                this.useStock(conn, stmtBatcher, ingredientId, amount * amountToCreate, name);
            }
            // execute statement
            stmtBatcher.executeBatch();
            // update chocolate stock
            query = "UPDATE chocolate SET stock = ? WHERE id = ?";
            PreparedStatement preparedStatement = conn.prepareStatement(query);
            preparedStatement.setInt(1, stock+amountToCreate);
            preparedStatement.setInt(2, id);
            preparedStatement.executeUpdate();
            return true;
        } catch (SQLException sqle) {
            sqle.printStackTrace();
            throw new SQLWsfException();
        }
    }
}

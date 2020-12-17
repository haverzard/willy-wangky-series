package com.wbd.tubes.factory.ws.services;

import com.wbd.tubes.factory.ws.core.DatabaseConnection;
import com.wbd.tubes.factory.ws.exceptions.AddStockRequestNotFoundException;
import com.wbd.tubes.factory.ws.exceptions.StockInsufficientException;
import com.wbd.tubes.factory.ws.exceptions.InvalidArgumentWsfException;
import com.wbd.tubes.factory.ws.exceptions.SQLWsfException;
import com.wbd.tubes.factory.ws.models.AddStockRequest;
import com.wbd.tubes.factory.ws.services.interfaces.AddStockRequestService;

import javax.jws.WebService;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@WebService(endpointInterface = "com.wbd.tubes.factory.ws.services.interfaces.AddStockRequestService")
public class AddStockRequestServiceImpl implements AddStockRequestService {

    @Override
    public AddStockRequest[] getAllAddStockRequests() throws SQLWsfException {
        try {
            // get connection
            Connection conn = (new DatabaseConnection()).getConnection();
            String query = "SELECT * FROM add_stock_request JOIN chocolate WHERE chocolate.id=chocolate_id";
            Statement stmt = conn.createStatement();
            // execute statement
            ResultSet rs = stmt.executeQuery(query);
            // convert to AddStockRequests object
            List<AddStockRequest> addStockRequestList = new ArrayList<>();
            while (rs.next()) {
                int id = rs.getInt("id");
                int chocolateId = rs.getInt("chocolate_id");
                String chocolateName = rs.getString("name");
                int amountToAdd = rs.getInt("amount_to_add");
                String status = rs.getString("status");
                addStockRequestList.add(new AddStockRequest(id, chocolateId, chocolateName, amountToAdd, status));
            }
            // convert to array
            AddStockRequest[] addStockRequestArray = new AddStockRequest[addStockRequestList.size()];
            addStockRequestList.toArray(addStockRequestArray);
            // return
            return addStockRequestArray;
        } catch (SQLException sqle) {
            sqle.printStackTrace();
            throw new SQLWsfException();
        }
    }

    @Override
    public boolean approveAddStockRequest(int id)
        throws AddStockRequestNotFoundException, SQLWsfException, StockInsufficientException {
        try {
            // get connection
            Connection conn = (new DatabaseConnection()).getConnection();
            // prepare statement
            String query = "SELECT * FROM add_stock_request JOIN chocolate WHERE add_stock_request.id=? AND chocolate.id=chocolate_id";
            PreparedStatement preparedStatement = conn.prepareStatement(query);
            preparedStatement.setInt(1, id);
            // execute statement
            ResultSet rs = preparedStatement.executeQuery();
            // if found return add stock request status object, else throw exception
            if (rs.next()) {
                String chocolateName = rs.getString("name");
                int chocolateId = rs.getInt("chocolate.id");
                int amountToAdd = rs.getInt("amount_to_add");
                String status = rs.getString("status");
                int stock = rs.getInt("stock");
                // Has been approved
                if (status.equals("delivered")) {
                    return false;
                }
                // If chocolate's stock is insufficient
                if (stock < amountToAdd) {
                    throw new StockInsufficientException(stock, amountToAdd);
                }
                // If chocolate's stock is sufficient
                Statement stmt = conn.createStatement();
                query = String.format("UPDATE add_stock_request SET status = 'delivered' WHERE id = %d", id);
                stmt.executeUpdate(query);
                stmt = conn.createStatement();
                query = String.format("UPDATE chocolate SET stock = %d WHERE id = %d", stock-amountToAdd, chocolateId);
                stmt.executeUpdate(query);
                return true;
            } else {
                throw new AddStockRequestNotFoundException();
            }
        } catch (SQLException sqle) {
            sqle.printStackTrace();
            throw new SQLWsfException();
        }
    }

    @Override
    public int addAddStockRequest(int chocolateId, int amountToAdd) throws InvalidArgumentWsfException, SQLWsfException {
        // validate input
        if (amountToAdd <= 0) {
            throw new InvalidArgumentWsfException(2, "amountToAdd", "amountToAdd value must be positive");
        }

        try {
            // get connection
            Connection conn = (new DatabaseConnection()).getConnection();
            // prepare statement
            String query = "INSERT INTO add_stock_request (chocolate_id,amount_to_add,status) VALUES (?,?,?)";
            PreparedStatement preparedStatement = conn.prepareStatement(query, Statement.RETURN_GENERATED_KEYS);
            preparedStatement.setInt(1, chocolateId);
            preparedStatement.setInt(2, amountToAdd);
            preparedStatement.setString(3, "pending"); // initial pending status
            // execute statement
            int rowsUpdated = preparedStatement.executeUpdate();
            // get request id
            int id = 0;
            try (ResultSet generatedKeys = preparedStatement.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    id = generatedKeys.getInt(1);
                }
                else {
                    throw new SQLException("Insertion failed, no ID obtained.");
                }
            }
            // return request id
            return id;
        } catch (SQLException sqle) {
            sqle.printStackTrace();
            throw new SQLWsfException();
        }
    }

    @Override
    public AddStockRequest getAddStockRequest(int id) throws AddStockRequestNotFoundException, SQLWsfException {
        try {
            // get connection
            Connection conn = (new DatabaseConnection()).getConnection();
            // prepare statement
            String query = "SELECT * FROM add_stock_request JOIN chocolate WHERE add_stock_request.id=? AND chocolate.id=chocolate_id";
            PreparedStatement preparedStatement = conn.prepareStatement(query);
            preparedStatement.setInt(1, id);
            // execute statement
            ResultSet rs = preparedStatement.executeQuery();
            // if found return add stock request status object, else throw exception
            if (rs.next()) {
                int chocolateId = rs.getInt("chocolate_id");
                String chocolateName = rs.getString("name");
                int amountToAdd = rs.getInt("amount_to_add");
                String status = rs.getString("status");
                return new AddStockRequest(id, chocolateId, chocolateName, amountToAdd, status);
            } else {
                throw new AddStockRequestNotFoundException();
            }
        } catch (SQLException sqle) {
            sqle.printStackTrace();
            throw new SQLWsfException();
        }
    }
}

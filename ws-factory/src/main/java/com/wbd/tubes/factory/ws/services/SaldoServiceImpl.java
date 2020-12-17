package com.wbd.tubes.factory.ws.services;

import com.wbd.tubes.factory.ws.core.DatabaseConnection;
import com.wbd.tubes.factory.ws.exceptions.InvalidArgumentWsfException;
import com.wbd.tubes.factory.ws.exceptions.SQLWsfException;
import com.wbd.tubes.factory.ws.exceptions.SaldoNotFoundException;
import com.wbd.tubes.factory.ws.services.interfaces.SaldoService;

import javax.jws.WebService;
import java.sql.*;

@WebService(endpointInterface = "com.wbd.tubes.factory.ws.services.interfaces.SaldoService")
public class SaldoServiceImpl implements SaldoService {

    private ResultSet getFirstSaldoHelper() throws SQLException {
        // get connection
        Connection conn = (new DatabaseConnection()).getConnection();
        // prepare statement
        String query = "SELECT * FROM saldo LIMIT 1";  // get first saldo
        Statement stmt = conn.createStatement();
        // execute statement
        ResultSet rs = stmt.executeQuery(query);
        // return
        return rs;
    }

    @Override
    public int getSaldo() throws SaldoNotFoundException, SQLWsfException {
        try {
            ResultSet rs = getFirstSaldoHelper();
            if (rs.next()) {
                return rs.getInt("saldo");
            } else {
                throw new SaldoNotFoundException();
            }
        } catch (SQLException sqle) {
            sqle.printStackTrace();
            throw new SQLWsfException();
        }
    }

    @Override
    public boolean addSaldo(int addition) throws InvalidArgumentWsfException, SaldoNotFoundException, SQLWsfException {
        // validate input
        if (addition <= 0) {
            throw new InvalidArgumentWsfException(1, "addition", "Addition value must be positive");
        }

        try {
            // get current saldo
            ResultSet rs = getFirstSaldoHelper();
            if (rs.next()) {
                // calculate new saldo
                int saldo = rs.getInt("saldo");
                int id = rs.getInt("id");
                int newSaldo = saldo + addition;
                // update database
                String query = "UPDATE saldo SET saldo=? WHERE id=?";
                Connection conn = (new DatabaseConnection()).getConnection();
                // prepare statement
                PreparedStatement preparedStatement = conn.prepareStatement(query);
                preparedStatement.setInt(1, newSaldo);
                preparedStatement.setInt(2, id);
                // execute statement
                int rowsUpdated = preparedStatement.executeUpdate();
                System.out.println("Row updated: " + rowsUpdated + " row(s)");
                return true;
            } else {
                throw new SaldoNotFoundException();
            }
        } catch (SQLException sqle) {
            sqle.printStackTrace();
            throw new SQLWsfException();
        }
    }
}

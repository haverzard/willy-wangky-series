package com.wbd.tubes.factory.ws.services;

import com.wbd.tubes.factory.ws.core.DatabaseConnection;
import com.wbd.tubes.factory.ws.exceptions.SQLWsfException;
import com.wbd.tubes.factory.ws.exceptions.LoginFailedException;
import com.wbd.tubes.factory.ws.services.interfaces.UserService;

import javax.jws.WebService;
import java.sql.*;

@WebService(endpointInterface = "com.wbd.tubes.factory.ws.services.interfaces.UserService")
public class UserServiceImpl implements UserService {

    @Override
    public String login(String username, String password) throws SQLWsfException, LoginFailedException {
        try {
            String query = "SELECT * FROM user WHERE username = ? AND password = ? LIMIT 1";
            Connection conn = (new DatabaseConnection()).getConnection();
            // prepare statement
            PreparedStatement preparedStatement = conn.prepareStatement(query);
            preparedStatement.setString(1, username);
            preparedStatement.setString(2, password);
            // execute statement
            ResultSet rs = preparedStatement.executeQuery();
            if (rs.next()) {
                return "INI_TOKEN_API_NYA_OKEE";
            } else {
                throw new LoginFailedException();
            }
        } catch (SQLException sqle) {
            sqle.printStackTrace();
            throw new SQLWsfException();
        }
    }

}
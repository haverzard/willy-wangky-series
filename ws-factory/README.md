# Web Service Factory
## Description
Web service for creating chocolates and process request from chocolate shop.

This web service can:
- Handle restock request from chocolate shop
- Resupply ingredients' stock
- Create chocolate using ingredients that're available

## Requirements
- Tomcat 9
- Maven Projects
- MySQL & JDBC

## How to Use
- Create a new database and run the DDL's query below
- Change `factory_db` with your database's name and `DB_USER` & `DB_PASS` with your MySQL's credentials on `DatabaseConnection.java`
- Run `mvn install` to build web application archive (war)
- Put the war to `webapps` folder in Tomcat directory
- Run Tomcat

## Database Schema
```
create table chocolate (
  id int PRIMARY KEY,
  name varchar(100),
  stock int
);

create table saldo (
  id int PRIMARY KEY,
  saldo int
);

create table base_ingredient (
  id int PRIMARY KEY AUTO_INCREMENT,
  name varchar(100),
  exp_constant int
);

create table ingredient (
  id int PRIMARY KEY AUTO_INCREMENT,
  ingredient_id int,
  stock int,
  exp_date date,
  FOREIGN KEY (ingredient_id) REFERENCES base_ingredient(id)
);

create table recipe (
  id int PRIMARY KEY AUTO_INCREMENT,
  chocolate_id int,
  ingredient_id int,
  amount int,
  FOREIGN KEY (ingredient_id) REFERENCES base_ingredient(id),
  FOREIGN KEY (chocolate_id) REFERENCES chocolate(id)
);

create table add_stock_request (
  id int PRIMARY KEY AUTO_INCREMENT,
  chocolate_id int,
  amount_to_add int,
  status varchar(10),
  FOREIGN KEY (chocolate_id) REFERENCES chocolate(id)
);

create table user (
  id int PRIMARY KEY AUTO_INCREMENT,
  username varchar(100) UNIQUE,
  password varchar(100)
);
```

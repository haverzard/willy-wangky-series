# Web Service Supplier
## Description
Web service for ordering ingredients for chocolates.

This web service can:
1. Handle buy requests from factory
2. Handle requests for ingredients' list

## Requirements
- Node.js
- MySQL

## How to Use
- Run `npm install`
- Run `npm start` (for development)

## Database Schema
```
CREATE TABLE IF NOT EXISTS material (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    price INT
);
```

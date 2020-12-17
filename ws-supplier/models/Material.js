module.exports = function(connection) {
  console.log("Load table material")
  connection.execute(`
    CREATE TABLE IF NOT EXISTS material (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(100),
      price INT
    );
  `)
}
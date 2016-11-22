var pg = require('pg');
var connectionString = 'joeun://localhost:5432/joeundb';
var client = new pg.Client(connectionString);
client.connect();

var query = client.query(
  "DROP TABLE IF EXISTS users;" +
  "CREATE TABLE users(id serial unique, name varchar(255) not null, age int not null);" +
  "INSERT INTO users(name, age) values('하조은', 27);" +
  "INSERT INTO users(name, age) values('오한나', 23);" +
  "INSERT INTO users(name, age) values('박기쁨', 25);");

query.on('end', function(){ client.end(); });
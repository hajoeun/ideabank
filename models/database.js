require('../public/javascripts/partial');
var pg = require('pg');
var connectionString = 'joeun://localhost:5432/joeundb';
var client = new pg.Client(connectionString);
client.connect();

var query = client.query(
  "DROP TABLE IF EXISTS icontents;\
  DROP TABLE IF EXISTS iposts;\
  CREATE TABLE icontents(c_id serial unique, product_or_service varchar(50) not null, mission text, vision text, market text, main_idea text, member text, extra_info text);\
  CREATE TABLE iposts(p_id serial unique, title text not null, c_id int not null, user_id varchar(100) not null, create_date date not null);\
  ");

// client.query('select content from json_table').on('row', function(row){console.log(row.content.type)});

query.on('end', function() { client.end(); });
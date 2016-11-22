require('../public/javascripts/partial');
var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'joeun://localhost:5432/joeundb';

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.send('<h1>hello world!</h1>');
  res.send(_.T('','\
    h1 hello world\
  ')());
});

function showResult(query, res, done, results) {
  query.on('row', function(row) {
    results.push(row);
  });

  query.on('end', function() {
    done();
    return res.json(results);
  });
}

function error(err, res, done) {
  done();
  console.log(err);
  return res.status(500).json({ success: false, data: err });
}

//insert
router.post('/api/v1/users', function(req, res, next) {
  var results = [];
  var data = { name: req.body.name, age: req.body.age };

  pg.connect(connectionString, function(err, client, done) {
    if (err) { return error(err, res, done); }

    client.query('insert into users(name, age) values($1, $2)', [data.name, data.age]);

    return showResult(client.query('select * from users order by id asc'), res, done, results);
  })
});

//read
router.get('/api/v1/users', function(req, res, next) {
  var results = [];
  pg.connect(connectionString, function(err, client, done) {
    return err ? error(err, res, done) : showResult(client.query('select * from users order by id asc'), res, done, results);
  })
});

//update
router.put('/api/v1/users/:user_id', function(req, res, next) {
  var results = [];
  var id = req.params.user_id;
  var data = { name: req.body.name, age: req.body.age };

  pg.connect(connectionString, function(err, client, done) {
    if (err) { return error(err, res, done); }

    client.query('update users set name=($1), age=($2) where id=($3)', [data.name, data.age, id]);

    return showResult(client.query('select * from users order by id asc'), res, done, results);
  })
});

//delete
router.delete('/api/v1/users/:user_id', function(req, res, next) {
  var results = [];
  var id = req.params.user_id;

  pg.connect(connectionString, function (err, client, done) {
    if (err) { return error(err, res, done); }

    client.query('delete from users where id=($1)', [id]);

    return showResult(client.query('select * from users order by id asc'), res, done, results);
  })
});


module.exports = router;

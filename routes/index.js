require('../public/javascripts/partial');
require('../public/javascripts/view');
var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'joeun://localhost:5432/joeundb';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send(views.input_forms() + views.table([[],[],[]]));
});

function showResult(query, res, done, results) {
  query.on('row', function(row) {
    results.push(row);
  });

  query.on('end', function() {
    done();
    return res.send(results);
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

router.post('/api/v1/iposts', function(req, res, next) {
  var d = { title: req.body.title, c_id: 0,p_or_s: req.body.p_or_s, mission: req.body.mission, vision: req.body.vision,
    market: req.body.market, main_idea: req.body.main_idea, member: req.body.member, extra_info: req.body.extra_info };

  pg.connect(connectionString, function(err, client, done) {
    if (err) { return error(err, res, done); }
    client.query('insert into icontents(product_or_service, mission, vision, market, main_idea, member, extra_info) values($1, $2, $3, $4, $5, $6, $7)',
      [d.p_or_s, d.mission, d.vision, d.market, d.main_idea, d.member, d.extra_info]);

    client.query('select c_id from icontents order by c_id desc limit 1;')
      .on('row', function(row){ d.c_id = row.c_id; })
      .then(
        function() {
          client.query('insert into iposts(title, c_id, user_id, create_date) values($1, $2, $3, current_date)', [d.title, d.c_id, _.uniqueId('User_')])
            .on('end', function() { done(); return res.redirect('/'); });
        });

    // client.query('select p.title, c.product_or_service, c.mission, c.vision, c.market, c.main_idea, c.member, c.extra_info from iposts as p join icontents as c on c.c_id = p.c_id;');
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

require('../public/javascripts/partial');
var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'joeun://localhost:5432/joeundb';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send(_.T('','\
    div\
      h2 idea bank prototype\
      form[action=/api/v1/iposts method=post]\
        label.control-label 제목\
        input.form-control[type=text name=title placeholder="제목을 입력하세요."]\
        label.control-label 유저 ID\
        input.form-control[type=text name=u_id placeholder="유저 id"]\
        label.control-label 내용\
        textarea.form-control[type=number name=contents placeholder="내용"]\
        button[type=submit] 완료\
  ')());
});

function showResult(query, res, done, results) {
  query.on('row', function(row) {
    results.push(row);
  });

  query.on('end', function() {
    done();
    return res.redirect(303, '/');
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
  var results = [];
  var data = { title: req.body.title, contents: req.body.contents, u_id: req.body.u_id };

  pg.connect(connectionString, function(err, client, done) {
    if (err) { return error(err, res, done); }
    // client.query('insert into icontents(p_id') // 여기에 데이터를 집어 넣으면됨! 콘텐츠 데이터!
    client.query('insert into iposts(title, content_id, user_id, create_date) values($1, $2, $3, current_date)', [data.title, data.u_id]);

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

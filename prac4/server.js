
var express = require('express');
var pg = require("pg");
var app = express();

var connectionString = "postgres://postgres:1234@localhost:5432/postgres";

var config = {
    user: 'postgres',
    database: 'postgres',
    password: '1234',
    port: 5432,
    max: 10, // max number of connection can be open to database
    idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};

var pool = new pg.Pool(config);

app.get('/', function (req, res, next) { 
    pg.connect(connectionString,function(err,client,done) {
        if(err){
            console.log("not able to get connection "+ err); 
            res.status(400).send(err);
    }
    client.query('SELECT * FROM Employee where empid=  $1', [1],function(err,result) {
        done(); // closing the connection;
        if(err){
            console.log(err);
            res.status(400).send(err);
        }
        res.status(200).send(result.rows); 
    });
}); });

app.get('/sp', function(req,res,next) {
    pg.connect(connectionString, function(err,client,done) {
        if (err) {
            console.log("not able to get connection " + err);
            res.status(400).send(err);
        }
        client.query('SELECT * from GetAllEmployee()', function(err, results) {
            done(); //closing the connection
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send(results.rows);
        })
    })
});

app.get('/pool', function(req,res) {
    pool.connect(function(err,client,done) {
        if (err) {
            console.log("not able to get connection " + err);
            res.status(400).send(err);
        }
        client.query('SELECT * from GetAllEmployee()', function (err,results) {
            //call done() to release the client back to the pool
            done();

            if(err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send(results.rows);
        })
    })
});

app.listen(3000, function () {
    console.log('Server is running.. on Port 3000');
});
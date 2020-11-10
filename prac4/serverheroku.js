let port = process.env.PORT || 3000;

var express = require('express');
var app = express();

var pg = require('pg');
pg.defaults.ssl = true;

const Sequelize = require('sequelize');

// set up sequelize to point to our postgres database
var sequelize = new Sequelize('dei8ebh2ucui0k', 'wvydpjhrpvfolc', '5711bf34b949f04416c6a5c8c938fa5a41b971769c50a8f5748cc98159930071', {
    host: 'ec2-107-20-177-161.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: true
      }
});

sequelize
    .authenticate()
    .then(function() {
        console.log('Connection has been established successfully.');
    })
    .catch(function(err) {
        console.log('Unable to connect to the database:', err);
    });

var config = {
    user: 'wvydpjhrpvfolc',
    database: 'dei8ebh2ucui0k',
    password: '5711bf34b949f04416c6a5c8c938fa5a41b971769c50a8f5748cc98159930071',
    port: 5432,
    max: 10, // max number of connection can be open to database
    idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
    ssl: true
};

var pool = new pg.Pool(config);
var connectionString = 'postgres://wvydpjhrpvfolc:5711bf34b949f04416c6a5c8c938fa5a41b971769c50a8f5748cc98159930071@ec2-107-20-177-161.compute-1.amazonaws.com:5432/dei8ebh2ucui0k';

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


app.listen(port);
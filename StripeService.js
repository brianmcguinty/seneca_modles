
var express = require('express')
var app = express()

var https      = require("https");
var fs         = require("fs");
var key_file   = "./ssl/key.pem";
var cert_file  = "./ssl/server.crt";
var config     = {
  key: fs.readFileSync(key_file, 'utf8'),
 cert: fs.readFileSync(cert_file, 'utf8')
};

var bodyParser = require('body-parser');
app.use(bodyParser());

var stripeKeys = require('./stripeKeys.js');
//var stripe = require('stripe')(stripeKeys.secretKey);
var stripe = require("stripe")("3fwFI1HgBYfhcrTviai5jzMs7smCrQeo");

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  // The form's action is '/' and its method is 'POST',
  // so the `app.post('/', ...` route will receive the
  // result of our form
  var html = 'Hello World';
  res.send(html);
});

app.post('/', function(req, res){
  res.send('Hello Again World');
});

app.post('/charge', function(req, res) {
    console.log(JSON.stringify(req.body, null, 2));
    var stripeToken = req.body.token;

    var charge = stripe.charges.create({
        amount: 0005, // amount in cents, again
        currency: "usd",
        card: stripeToken,
        description: "payinguser@example.com"
    }, function(err, charge) {
        if (err && err.type === 'StripeCardError') {
            console.log(JSON.stringify(err, null, 2));
        }
        res.send("completed payment!")
    });
});

var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

})


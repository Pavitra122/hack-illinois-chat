const bodyParser = require('body-parser');
const express = require('express')
const session = require('express-session')
const app = express()

const redis = require("redis")
const client = redis.createClient()
const uuid = require('uuid')

client.on("error", function (err) {
    console.log("Error " + err);
});


var getMessages = (done) =>{
  var args1 = [ 'myzset', '+inf', '-inf' ];
  client.zrevrangebyscore(args1, function (err, response) {
      if (err) throw err;
      console.log('example1', response);
      return done(null, response)
  });
}

var sendMessage = (message) =>{

    const timestamp = Date.now()
    var args = [ 'myzset', `${Date.now()}`, `${uuid.v4()}:${message}` ];
    client.zadd(args, function (err, response) {
      if (err) throw err;
      console.log('added '+response+' items.');

      // -Infinity and +Infinity also work


      // var max = 3, min = 1, offset = 1, count = 2;
      // var args2 = [ 'myzset', max, min, 'WITHSCORES', 'LIMIT', offset, count ];
      // client.zrevrangebyscore(args2, function (err, response) {
      //     if (err) throw err;
      //     console.log('example2', response);
      //     // write your code here
      // });
      //client.quit();

  });
}

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(session({secret: '7cb98f81-e35a-4ea0-9a39-7568197c0593'}))

app.post('/login', function (req, res) {
  if (!req.body || !req.body.name) {
    res.send(500, {error: 'must provide name for login'})
  } else {
    req.session.name = req.body.name
    res.send({hello: req.body.name})
  }
})

app.get('/FetchDatabase', function(req,res){

  //return getMessages();
  const message = getMessages((err, message) => {
    res.send({message})
  });
})

app.get('/whoami', function (req, res) {
  const name = req.session.name || 'Anonymous'
  res.send({name})
})

app.post('/addToDatabase', function (req,res) {
    sendMessage(req.body.message);
    const message = 'success'
    res.send({message})
})

const port = process.env.PORT || 3000
app.listen(port, function () {
  console.log(`App Started on PORT ${port}`)
})

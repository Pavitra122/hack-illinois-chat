const redis = require("redis")
const client = redis.createClient()
const uuid = require('uuid')

// if you'd like to select database 3, instead of 0 (default), call
// client.select(3, function() { /* ... */ });

client.on("error", function (err) {
    console.log("Error " + err);
});


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

//sendMessage("hello")


var getMessages = () =>{

  var args1 = [ 'myzset', '+inf', '-inf' , 'WITHSCORES'];
  client.zrevrangebyscore(args1, function (err, response) {
      if (err) throw err;
      console.log('example1', response);
      // write your code here
  });


}


getMessages()
// sendMessage("hello1")
//
// client.set("string key", "string val", redis.print);
// client.hset("hash key", "hashtest 1", "some value", redis.print);
// client.hset(["hash key", "hashtest 2", "some other value"], redis.print);
// client.hkeys("hash key", function (err, replies) {
//     console.log(replies.length + " replies:");
//     replies.forEach(function (reply, i) {
//         console.log("    " + i + ": " + reply);
//     });
//     client.quit();
// });

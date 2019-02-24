var CHAT_HEIGHT = 500;
var $input=$(".chat-input")
var Messages = function() {
	this.$input = $(".chat-input");
}
setInterval(function(){

	fetch('http://127.0.0.1:3000/FetchDatabase', {
    method: 'GET',
    headers: {
    	"Content-Type": "application/json"
    },
		mode: "cors",

    //body: JSON.stringify({message: newMessage})
  })
  .then((response) => {
    /*console.log('Request succeeded with JSON response', data);
		console.log(data);
		data.message.forEach(msg.addMessage());

		console.log(data);*/
		const ret = response.json()
		console.log(typeof ret)
		return ret
  })
	.then((json) => {
		console.info(json)
	})
  .catch(function (error) {
    console.log('Request failed', error);
  });


}, 10000);


var msg = new Messages();

Messages.prototype.appendSelfMessage = function(message){
	var $messageContainer=$("<li/>")
		.addClass('chat-message '+('chat-message-self'))
		.appendTo($(".messages-list"))
	;
	var $messageBubble=$("<div/>")
		.addClass('box')
		.appendTo($messageContainer)
	;

	$messageBubble.text(message);

	return {
		$container:$messageContainer,
		$bubble:$messageBubble
	};
}

Messages.prototype.appendCrossMessage = function(message){
	var $messageContainer=$("<li/>")
		.addClass('chat-message '+('chat-message-friend'))
		.appendTo($(".messages-list"))
	;
	var $messageBubble=$("<div/>")
		.addClass('box')
		.appendTo($messageContainer)
	;

	$messageBubble.text(message);

	return {
		$container:$messageContainer,
		$bubble:$messageBubble
	};
}



Messages.prototype.getCleanText = function(m){
	for(var i =0 ; i<=Math.floor(m.length/25); i++) {
		m = m.substr(0, (i+1)*25+i-1) + '\n' + m.substr((i+1)*25+i);
	}
	return m;
}

Messages.prototype.addMessage = function(){
	if($input.text()=="") return;
	var newMessage = this.getCleanText($input.text());

	var messageElements;
	if(newMessage[0] == '2') {
		messageElements=this.appendCrossMessage(newMessage)
		,$messageContainer=messageElements.$container
		,$messageBubble=messageElements.$bubble
	;
	} else {
	messageElements=this.appendSelfMessage(newMessage)
		,$messageContainer=messageElements.$container
		,$messageBubble=messageElements.$bubble
	;
	}
	$input.text('');
	msg.setHeight();
	var $messageEffect=$("<div/>")
		.addClass('chat-message-effect')
		.appendTo($(".chat-effect-container"))
		.css({
			left:$input.position().left-10
		})
	;
	$messageEffect.text('');
	$(".chat-input").text('');
	$(".messages").animate({ scrollTop: $(".messages")[0].scrollHeight }, "slow");



	fetch('http://127.0.0.1:3000/addToDatabase', {
    method: 'POST',
    headers: {
    	"Content-Type": "application/json"
    },
		mode: "cors",

    body: JSON.stringify({message: newMessage})
  })
  .then(function (data) {
    console.log('Request succeeded with JSON response', data);
  })
  .catch(function (error) {
    console.log('Request failed', error);
  });

}

Messages.prototype.setHeight = function(){
	$(".messages").css({
		height:CHAT_HEIGHT-$(".bar").height()
	});
}

Messages.prototype.setDefaults = function(){
	$input.keydown(function(e) {
		if(e.keyCode==13){
			e.preventDefault();
			msg.addMessage();
		}
	});

	$(".chat-send").click(function(e){
		e.preventDefault();
		msg.addMessage();
	});

	$(".chat-send").on("touchstart",function(e){
		e.preventDefault();
		msg.addMessage();
	});

	$input.on("input",function(){
		msg.setHeight();
	});

}

msg.setHeight();
msg.setDefaults();

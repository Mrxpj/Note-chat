var socket = io();

//when user login or logut will appear warn
socket.on('loginInfo',function(msg){
	addMsgFromSys(msg);
	Messager().post({
		message: msg,
		showCloseButton: true
	});
});

//add user in ui
socket.on('userList',function(userList){
	addUser(userList);
});

//after login show information of user
socket.on('userInfo',function(userObj){
	userSelf = userObj;
	$('#spanuser').text('欢迎您！' + userObj.name);
})

//show message to all
socket.on('toWhole',function(msgObj){
	addMsgFromUser(msgObj,false);
})

//
socket.on('toOne',function(msgObj){
	Messenger().post({
		message:"<a href=\"javascript:showSetMsgToOne(\'"+msgObj.from.name+"\',\'"+msgObj.from.id+"\');\">"+msgObj.from.name + " send to you a message:"+ msgObj.msg+"</a>",
		showCloseButton: true
	});
})

socket.on('sendImageToAll',function(msgObj){
	addImgFromUser(msgObj,false);
})

socket.on('sendEmToAll',function(msgObj){
	addEmFromUser(msgObj,false)
})


// socket.on('online', function(msg){
// 	showMsg(1);
// });

// socket.on('offline', function(msg){
// 	showMsg(0);
// });
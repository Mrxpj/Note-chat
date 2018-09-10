// function showMsg(type) {
// 	if(type==1) {
// 		 $.scojs_message('This is an info message', $.scojs_message.TYPE_OK);
// 	}else {
// 		$.scojs_message('This is an error message', $.scojs_message.TYPE_ERROR);
// 	}
// }
var userSelf = {};
var toOneId;

$(function(){
	//Modal Window,keyboard:当按下 escape 键时关闭模态框，设置为 false 时则按键无效。 
	//backdrop:指定一个静态的背景，当用户点击模态框外部时不会关闭模态框。 
	$('#myModal').modal({
		backdrop: 'static',
		// keyboard: false
	});
	//login
	$('#btn-setName').click(function(){
		var name = $('#username').val();
		//judge username exits or empty
		if(checkUser(name)){
			$('#username').val('');
			alert('Nickname already exits or can not be empty!')
		}else{
			var imgList = ["/images/1.jpg","/images/2.jpg","/images/3.jpg","/images/4.jpg","/images/5.jpg"];
			var randomNum = Math.floor(Math.random()*5);
			//radom user
			var img = imgList[randomNum];
			//package user
			var dataObj = {
				name: name,
				img: img
			};
			//send user info to server
			socket.emit('login',dataObj);
			//hide login modal
			$('#myModal').modal('hide');
			$('username').val('');
			$('#msg').focus();
		}
	})
	//send to everyone
	$('#sendMsg').click(function(){
		var msg = $('#msg').val();
		if(msg == ''){
			alert('The content can not empty!');
			return;
		}
		var from = userSelf;
		var msgObj = {
			from: from,
			msg: msg,
		};
		socket.emit('toWhole',msgObj);
		addMsgFromUser(msgObj,true);
		$('#msg').val('');
	});

	//send to one
	$('#btn_toOne').click(function(){
		var msg = $('#input_msgToOne').val();
		if(msg=''){
			alert('The content can not empty!');
			return;
		}
		var msgObj = {
			from: userSelf,
			to: toOneId,
			msg: msg
		}
		socket.emit('toOne',msgObj);
		$('#setMsgToOne').modal('hide');
		$('#inout_msgToOne').val('');
	})
	//send img
	$('#sendImage').change(function(){
		if(this.files.length !=0){
			var file = this.files[0];
			//judge browser support or do not support fileReader
			reader = new FileReader();
			if(!reader){
				alert("your browser do not support fileReader!");
				return;
			}
			reader.onload = function(e){
				console.log(e.target.result);
				var msgObj = {
					from:userSelf,
					img:e.target.result
				};
				socket.emit('sendImageToAll',msgObj);
				addImgFromUser(msgObj,true);
			};
			reader.readAsDataURL(file);
		}
	})
	//send emoticon

});

//add msg from system in UI
function addMsgFromSys(msg){
	$.scojs_message(msg, $.scojs_message.TYPE_OK);
}

//check username exist
function checkUser(name) {
	var names = false;
	$(".user-content").children('ul').children('li').each(function(){
		//jquery methods(find): traverse span
		if(name == $(this).find('span').text()){
			names = true;
		}
	});
	return names;
}
//add user
function addUser(userList){
	var parentUl = $('.user-content').children('ul');
	var cloneLi = parentUl.children('li:first').clone();
	parentUl.html('');
	parentUl.append(cloneLi);
	for(var i in userList){
		var cloneLi = parentUl.children('li:first').clone();
		cloneLi.children('a').attr('href',"javascript:showSetMsgToOne('" + userList[i].name + "','" + userList[i].id + "');");
		cloneLi.children('a').children('img').attr('src',userList[i].img);
		cloneLi.children('a').children('span').text(userList[i].name);
		cloneLi.show();
		parentUl.append(cloneLi);
	}
}
//single chat
function showSetMsgToOne(name,id){
	$('#setMsgToOne').modal();
	$('#myModalLabel1').text("send to " + name);
	toOneId = id;
}

function addMsgFromUser(msgObj,isSelf){
	var msgType = isSelf ? "message-reply" : "message-receive";
	var msgHtml = $('<div><div class="message-info"><div class="user-info"><img src="/images/1.jpg" class="user-avatar img-thumbnail"></div><div class="message-content-box"><div class="arrow"></div><div class="message-content">test</div></div></div></div>');
	msgHtml.addClass(msgType);
	msgHtml.children('.message-info').children('.user-info').children('.user-avatar').attr('src',msgObj.from.img);
	msgHtml.children('.message-info').children('.user-info').children('.user-avatar').attr('title',msgObj.from.name);
	msgHtml.children('.message-info').children('.message-content-box').children('.message-content').text(msgObj.msg);
	$('.msg-content').append(msgHtml);
	//让滚动条最底下
	$(".msg-content").scrollTop($(".msg-content")[0].scrollHeight);
}

function addImgFromUser(msgObj,isSelf){
	var msgType = isSelf ? "message-reply" : "message-receive";
	var msgHtml = $('<div><div class="message-info"><div class="user-info"><img src="/images/1.jpg" class="user-avatar img-thumbnail"></div><div class="message-content-box"><div class="arrow"></div><div class="message-content">test</div></div></div></div>');
	msgHtml.addClass(msgType);
	msgHtml.children('.message-info').children('.user-info').children('.user-avatar').attr('src',msgObj.from.img);
	msgHtml.children('.message-info').children('.user-info').children('.user-avatar').attr('title',msgObj.from.name);
	msgHtml.children('.message-info').children('.message-content-box').children('.message-content').html("<img src='" + msgObj.img + "'>");
	$('.msg-content').append(msgHtml);
	$(".msg-content").scrollTop($(".msg-content")[0].scrollHeight);
}

function keywordsMsg(e){
	var event1 = e || window.event;
	if(event1.keyCode == 13){
		$('#sendMsg').click();
	}
}

function keywordsName(e){
	var event1 = e || window.event;
	if(event1.keyCode == 13){
		$('#btn-setName').click();
	}
}

function keywordsName1(e){
	var event1 = e || window.event;
	if(event1.keyCode == 13){
		$('#btn_toOne').click();
	}
}




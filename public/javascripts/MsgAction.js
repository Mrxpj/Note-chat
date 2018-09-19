// function showMsg(type) {
// 	if(type==1) {
// 		 $.scojs_message('This is an info message', $.scojs_message.TYPE_OK);
// 	}else {
// 		$.scojs_message('This is an error message', $.scojs_message.TYPE_ERROR);
// 	}
// }
var userSelf = {};
var toOneId;

hljs.initHighlightingOnLoad();

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
	//EmojiParse
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
	});
	//show emoticon
	$("#msg").emoji({
		button: '#btnEm',
		showTab: true,
		animation: 'fade',
		icons: [{
			name: "贴吧表情",
			path: "dist/img/tieba/",
			maxNum: 50,
			file: ".jpg",
			placeholder: ":{alias}:",
			alias: {
				1: "hehe",
				2: "haha",
				3: "tushe",
				4: "a",
				5: "ku",
				6: "lu",
				7: "kaixin",
				8: "han",
				9: "lei",
				10: "heixian",
				11: "bishi",
				12: "bugaoxing",
				13: "zhenbang",
				14: "qian",
				15: "yiwen",
				16: "yinxian",
				17: "tu",
				18: "yi",
				19: "weiqu",
				20: "huaxin",
				21: "hu",
				22: "xiaonian",
				23: "neng",
				24: "taikaixin",
				25: "huaji",
				26: "mianqiang",
				27: "kuanghan",
				28: "guai",
				29: "shuijiao",
				30: "jinku",
				31: "shengqi",
				32: "jinya",
				33: "pen",
				34: "aixin",
				35: "xinsui",
				36: "meigui",
				37: "liwu",
				38: "caihong",
				39: "xxyl",
				40: "taiyang",
				41: "qianbi",
				42: "dnegpao",
				43: "chabei",
				44: "dangao",
				45: "yinyue",
				46: "haha2",
				47: "shenli",
				48: "damuzhi",
				49: "ruo",
				50: "OK"
			},
			title: {
				1: "呵呵",
				2: "哈哈",
				3: "吐舌",
				4: "啊",
				5: "酷",
				6: "怒",
				7: "开心",
				8: "汗",
				9: "泪",
				10: "黑线",
				11: "鄙视",
				12: "不高兴",
				13: "真棒",
				14: "钱",
				15: "疑问",
				16: "阴脸",
				17: "吐",
				18: "咦",
				19: "委屈",
				20: "花心",
				21: "呼~",
				22: "笑脸",
				23: "冷",
				24: "太开心",
				25: "滑稽",
				26: "勉强",
				27: "狂汗",
				28: "乖",
				29: "睡觉",
				30: "惊哭",
				31: "生气",
				32: "惊讶",
				33: "喷",
				34: "爱心",
				35: "心碎",
				36: "玫瑰",
				37: "礼物",
				38: "彩虹",
				39: "星星月亮",
				40: "太阳",
				41: "钱币",
				42: "灯泡",
				43: "茶杯",
				44: "蛋糕",
				45: "音乐",
				46: "haha",
				47: "胜利",
				48: "大拇指",
				49: "弱",
				50: "OK"
			}
		}, {
			path: "dist/img/qq/",
			maxNum: 91,
			excludeNums: [41, 45, 54],
			file: ".gif",
			placeholder: "#qq_{alias}#"
		}]
	});

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
	$(".message-content").emojiParse({
		icons: [{
			path: "dist/img/tieba/",
			file: ".jpg",
			placeholder: ":{alias}:",
			alias: {
				1: "hehe",
				2: "haha",
				3: "tushe",
				4: "a",
				5: "ku",
				6: "lu",
				7: "kaixin",
				8: "han",
				9: "lei",
				10: "heixian",
				11: "bishi",
				12: "bugaoxing",
				13: "zhenbang",
				14: "qian",
				15: "yiwen",
				16: "yinxian",
				17: "tu",
				18: "yi",
				19: "weiqu",
				20: "huaxin",
				21: "hu",
				22: "xiaonian",
				23: "neng",
				24: "taikaixin",
				25: "huaji",
				26: "mianqiang",
				27: "kuanghan",
				28: "guai",
				29: "shuijiao",
				30: "jinku",
				31: "shengqi",
				32: "jinya",
				33: "pen",
				34: "aixin",
				35: "xinsui",
				36: "meigui",
				37: "liwu",
				38: "caihong",
				39: "xxyl",
				40: "taiyang",
				41: "qianbi",
				42: "dnegpao",
				43: "chabei",
				44: "dangao",
				45: "yinyue",
				46: "haha2",
				47: "shenli",
				48: "damuzhi",
				49: "ruo",
				50: "OK"
			}
		}, {
			path: "dist/img/qq/",
			file: ".gif",
			placeholder: "#qq_{alias}#"
		}]
	});
	//让滚动条最底下
	$(".msg-content").scrollTop($(".msg-content")[0].scrollHeight);
}

function addImgFromUser(msgObj,isSelf){
	var msgType = isSelf ? "message-reply" : "message-receive";
	var msgHtml = $('<div><div class="message-info"><div class="user-info"><img src="/images/1.jpg" class="user-avatar img-thumbnail"></div><div class="message-content-box"><div class="arrow"></div><div class="message-content">test</div></div></div></div>');
	msgHtml.addClass(msgType);
	msgHtml.children('.message-info').children('.user-info').children('.user-avatar').attr('src',msgObj.from.img);
	msgHtml.children('.message-info').children('.user-info').children('.user-avatar').attr('title',msgObj.from.name);
	msgHtml.children('.message-info').children('.message-content-box').children('.message-content').html("<img src='" + msgObj.img + "' class='img_icon'>");
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




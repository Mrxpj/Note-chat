$(function(){
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
			$('username').val('');
			$('#msg').focus();
		}
	})

}
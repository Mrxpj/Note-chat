var io = require('socket.io')();
var _ = require('underscore');

var userList = [];
io.on('connection', function(socket){
  socket.on('login', function(user){
    user.id = socket.id;
    userList.push(user);
    //send Msssage to all client
    io.emit('userList',userList);
    //send Mseeage to client
    socket.emit('userInfo',user);
    //send Message to everyone exclude youself
    socket.broadcast.emit('loginInfo',user.name + "上线了");
  });

  //send to all
  socket.on('toWhole',function(msgObj){
    socket.broadcast.emit('toWhole',msgObj);
  });

//send to one
  socket.on('toOne',function(msgObj){
    var toSocket = _.findWhere(io.sockets.sockets,{id:msgObj.to});
    toSocket.emit('toOne',msgObj);
  });
//send to img
  socket.on('sendImageToAll',function(msgObj){
    socket.broadcast.emit('sendImageToAll',msgObj)
});
//send to emoticon
socket.on('sendEmToAll',function(msgObj){
  socket.broadcast.emit('sendEmToAll',msgObj)
});
});



exports.listen = function(server){
	io.listen(server);
}
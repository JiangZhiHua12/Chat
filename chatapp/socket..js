var socket={}

var sqlquery=require('../chatapp/public/javascripts/zhmysql')

function getSocket(server) {
           socket.io=require('socket.io')(server,{cors: {
        origin: '*'
    }}
)

    var io=socket.io
    //默认命名空间
    io.on('connection',function (socket) {
        console.log(socket.id + '连接进来')
        //监听登入成功
        socket.on('login', async function (data) {

            //在登入成功之前要判断是否有人在登入，如果有那么就将那个人断开连接
            var sql1='select * from user where isonline=? and username=?'
            var result1=await sqlquery(sql1,['true',data.username])
            if (result1.length>0){
                   socket.to(result1[0].socketid).emit('loginout',{content:'有人登入进来，你已被踢出！'})

            }

            var sql = 'update user set socketid=?,isonline=? where username=?'
            var result = await sqlquery(sql, [socket.id, 'true', data.username])
            socket.emit('login', {
                status: 'ok',
                content: '登入成功'
            })

            var sql4 = 'select * from user'
            var result5 = await sqlquery(sql4)
            io.sockets.emit('user',Array.from(result5))

            var sql5='select * from chat where isread=? and`to`=?'
            var result6=await sqlquery(sql5,['false',data.username])
            socket.emit('Unread',Array.from(result6))

            //用户加入群聊
            //首先获取群聊
            //再将用户加入进来 socket.join()
            var sql6='select * from user where isgroup=?'
            var result7=await sqlquery(sql6,['true'])
           Array.from(result7).forEach((item)=>{
               socket.join(item.socketid)
           })
        })
        //监听登出，当有人再一次登进，将被挤下去
        //首先判断是否有人正在登入

        //断开连接后数据库中的socketId isonline 要清空
        socket.on('disconnect',async function () {
                 var sql2='update user set socketid=?,isonline=? where socketid=?'
                  var result2=await sqlquery(sql2,[null,null,socket.id])
        })

        socket.on('userlist',async function (data) {
            var sql3='select * from user'
            var result3=await sqlquery(sql3)
            socket.emit('userlist',Array.from(result3))
        })

        socket.on('sendMsg',async function (msg) {
               //发送过来的消息判断对面的人是否在线，
            var sql4='select * from user where isonline=? and username=?'
            var result4=await sqlquery(sql4,['true',msg.to.username])
            console.log('查询到数据库')
            console.log(result4)
            if (result4.length>0){
                //说明用户在线，将消息直接发送给用户  reception:接收
                var toid=result4[0].socketid
                console.log(toid)
                socket.to(toid).emit('reception',msg)
                var sql5='insert into chat(`from`,`to`,`content`,`time`,isread) values(?,?,?,?,?)'
                var array=[msg.from.username,msg.to.username,msg.content,msg.time,'true']
                 sqlquery(sql5,array)
            }else {
                var sql5='insert into chat (`from`,`to`,`content`,`time`,isread) values(?,?,?,?,?)'
                var array=[msg.from.username,msg.to.username,msg.content,msg.time,'false']
                sqlquery(sql5,array)

            }
        })
        /*
        socket.on('delete',function (data) {
                  var sql='delete from chat where `from`=? and `to`=?'
                var array=[data.from,data.to]
           sqlquery(sql,array)
    })*/
//一睹消息将false 改为 true
        socket.on('readMsg',function (data) {
           var sql='update chat set isread=? where `from`=? and `to`=? '
            sqlquery(sql,['true',data.to,data.self])

        })

    })



}
socket.getSocket=getSocket

module.exports=socket
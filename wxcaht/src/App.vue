<template>
  <choose-user v-if="!me" :userlist="userList"></choose-user>
  <user-list :islogin="islogin" :user="user" :clickEvent="clickEvent" :unreaduser="unreaduser"></user-list>
  <chat-com v-if="ischat" :touser="touser" :backEvent="backEvent" :newMsg="newMsg"></chat-com>
</template>

<script>
import chooseUser from "./components/chooseUser.vue";
import userList from "./components/userLIst.vue";
import chatCom from "@/components/chatCom";
import axios from "axios";
import socket from "../socket";



export default {
  name: 'App',
  components: {
    chooseUser,
    userList,
    chatCom
  },
  data(){
    return{
      userList:[],
      islogin:false,
      me:null,
      user:[],
      touser:null,
      ischat:false,
      unreaduser:[],
       newMsg:null
    }
  },
  async beforeMount() {
     var res=await axios.get('/userlist')
      this.userList=res.data
    console.log(res.data)
},
  mounted() {

    socket.on('connect',function () {
      console.log('连接成功')
    })

    socket.on('login', (data)=> {
       if (data.status==='ok'){
         this.islogin=true
         socket.emit('userlist')
       }

     })
    socket.on('loginout',(data)=> {
      console.log(data)
      socket.disconnect()
      this.islogin=false
    })
    socket.on('disconnect',function () {
      console.log('断开连接')
    })

    socket.on('userlist',(data)=>{
          this.user=data

    })
    socket.on('user',(data)=> {
      //console.log(data)
       this.user=data
    })
     /*socket.on('update',(data)=> {
         this.user=data
       console.log(data)
     })*/
    socket.on('Unread',(data)=>{
      //console.log(data)
      //将未读的消息进行一个循环 循环的目的是生成用户红点和存储数据在本地
      data.forEach((item)=>{

           this.unreaduser.push(item.from)
       var strkey='chat-from-'+this.me.username+'-to-'+item.from
           localStorage[strkey]=localStorage[strkey]?localStorage[strkey]:'[]'
         var newArr=JSON.parse(localStorage[strkey])
        item.from=this.userObj[item.from]
        item.to=this.userObj[item.to]
           newArr.push(item)
           //console.log(newArr)
           localStorage[strkey]=JSON.stringify(newArr)
        console.log(this.touser)
      })

    })

    socket.on('reception',(msg)=>{
      //console.log('接收数据')
     console.log(msg)

      if(this.ischat==true){
        if (msg.from.username==this.touser.username && msg.to.isgroup!='true' ||msg.to.username==this.touser.username){
          this.newMsg=msg
          console.log('-------')
          console.log(this.touser.username)
        }else if( msg.to.isgroup=='true'){
          var strkey4='chat-from-'+this.me.username+'-to-'+msg.to.username
          localStorage[strkey4]=localStorage[strkey4]?localStorage[strkey4]:'[]'
          var newArr3=JSON.parse(localStorage[strkey4])
          newArr3.push(msg)
          //console.log(newArr)
          localStorage[strkey]=JSON.stringify(newArr3)
          this.unreaduser.push(msg.to.username)
          //console.log('-------')
        }
        else {
          var strkey3='chat-from-'+this.me.username+'-to-'+msg.from.username

          localStorage[strkey3]=localStorage[strkey3]?localStorage[strkey3]:'[]'
          var newArr2=JSON.parse(localStorage[strkey3])
          newArr2.push(msg)
          //console.log(newArr)
          localStorage[strkey3]=JSON.stringify(newArr2)
          this.unreaduser.push(msg.from.username)
        }
      }else if ( msg.to.isgroup=='true'){
        var strkey='chat-from-'+this.me.username+'-to-'+msg.to.username

        localStorage[strkey]=localStorage[strkey]?localStorage[strkey]:'[]'
        var newArr=JSON.parse(localStorage[strkey])
        newArr.push(msg)
        //console.log(newArr)
        localStorage[strkey]=JSON.stringify(newArr)
        this.unreaduser.push(msg.to.username)

      }
      else {
        var strkey2='chat-from-'+this.me.username+'-to-'+msg.from.username

        localStorage[strkey2]=localStorage[strkey2]?localStorage[strkey2]:'[]'
        var newArr1=JSON.parse(localStorage[strkey2])
        newArr1.push(msg)
        //console.log(newArr)
        localStorage[strkey2]=JSON.stringify(newArr1)
        this.unreaduser.push(msg.from.username)

      }
    })

  },
  methods:{
    clickEvent:function(user) {
          this.touser=user
      console.log(this.touser.username)
          this.ischat=true
          var index=this.unreaduser.indexOf(user.username)
           this.unreaduser.splice(index,1)
      /*
           var d={
            from:user.username,
             to:this.me.username
           }
         socket.emit('delete',d)*/
    },
    backEvent:function () {
                this.ischat=false
    }
  },
  computed:{
    userObj:function () {
             var obj={}
             this.user.forEach((item)=>{
             obj[item.username]=item
             })
      return obj
    }
  }
}
</script>

<style>
  *{
    margin: 0;
    padding: 0;
  }
</style>

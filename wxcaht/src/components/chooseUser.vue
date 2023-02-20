<template>
    <div class="chooseUser">
        <div class="nav">请选择聊天的用户</div>

            <div class="li" >
                <div class="item" v-for="(item,index) in userlist" :key="index" @click="chooseEvent(item)">
                    <img :src="item.headerimg">
                    <span>{{item.username}}</span>
                </div>
            </div>
    </div>
</template>

<script>


    import socket from "../../socket";

    export default {
        name: "chooseUser",
        props:['userlist'],
        methods:{
            chooseEvent:function (user) {
                  this.$parent.me=user
                    localStorage.chatme=JSON.stringify(user)
                     socket.emit('login',user)



            }
        }
    }

</script>

<style scoped>
    .chooseUser{
        background-color: skyblue;
        margin: 0;
        width: 100vw;
        height: 100vh;
    }
    .li{
        display: flex;
        flex-wrap: wrap;
    }
  .item{
      width: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      height: 130px;
      line-height: 15px;
  }
    .item img{
        width: 100px;
        height: 100px;
        border-radius: 50%;
    }
    .nav{
         padding: 20px;
        text-align: center;
    }
    .span{
        position: relative;top: 20px;
    }
</style>
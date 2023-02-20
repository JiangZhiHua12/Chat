<template>
    <div class="userlist"  >
        <div  class="nav">
            <div  :class="{disonline:!islogin,online:islogin}">
                <img v-if="$parent.me!=null" :src="$parent.me.headerimg">
            </div>

            <div>消 息</div>
             <div class="juzho"></div>
        </div>

        <div class="list" @click="clickEvent(item)" v-for="(item,index) in friends" :key="index" @mousemove="moveEvent">
            <div class="item" >
                <div :class="{disline:item.isonline===null,line:item.isonline===true,unread:this.unreaduser.indexOf(item.username)!=-1}">
                    <img :src="item.headerimg">
                </div>

                <div>{{item.username}}</div>
            </div>


        </div>
    </div>
</template>

<script>

    //import socket from "../../socket";

    export default {
        name: "userLIst",
        props:["islogin",'user','clickEvent','unreaduser'],
        computed:{
          friends:function () {
              return  this.user.filter((item)=>{
                     return item.username!==this.$parent.me.username
              })
          }
        }
        ,
       methods:{

        }
    }

</script>

<style scoped>
    .unread{
        position: relative;
    }
    .unread:before{
        position: absolute;
        display: block;
        content: '';
        background-color: red;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        bottom: 15px;
        right: 20px;

    }
    .userlist{
        display: flex;
        flex-direction: column;
        position: fixed;
    }
    .nav{
        display: flex;
        width: 100vw;
        height: 60px;
        background-color: skyblue;
        align-items: center;
        justify-content: space-between;
    }
    .online{
        filter: grayscale(0);
    }
    .disonline{
        filter: grayscale(1);
    }

    .nav img{
        width: 50px;
        height:50px;
        border-radius: 50%;
        padding: 10px 10px;
    }
    .nav div{
        font-weight: bold;
    }
    .juzho{
        width: 50px;
    }
    .item{
        display: flex;
        align-items: center;
        background-color: #eeeeee;
        border-bottom: 1px solid #cccccc;
    }
    .item img{
        width: 80px;
        height: 80px;
        border-radius: 50%;
        padding: 10px 10px;
    }
    .disline{
        filter:grayscale(1);
    }
    .line{
        filter: grayscale(0);
    }
</style>
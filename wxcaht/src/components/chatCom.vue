<template>
    <div class="chatcom">

        <div class="nav">
            <i  @click="backEvent" class="fa fa-angle-left" aria-hidden="true"></i>
            <div class="username"><label>{{touser.username}}</label></div>
            <div></div>
        </div>

        <div class='chatlist' ref="chatbox">
            <div  v-for="(item,index) in chatlist" :key="index" :class="{itemself:$parent.me.username===item.from.username,item:$parent.me.username!==item.from.username}" >
                <div><img :src="item.from.headerimg"></div>
                <div class="content">{{item.content}}</div>
            </div>
        </div>

        <div class="inputCom">
            <input @keydown.enter="sendMsgEvent" v-model="inputData">
            <button @click="sendMsgEvent">发送</button>
        </div>

    </div>
</template>

<script>
    import 'font-awesome/css/font-awesome.min.css'
    import socket from "../../socket";
    export default {
        name: "chatCom",
        props:['touser','backEvent','newMsg'],
        data(){
            return{
                chatlist:[],
                inputData:''
            }
        },

        methods:{
            sendMsgEvent:function(){
                var msg={
                    from:this.$parent.me,
                    to:this.touser,
                    content:this.inputData,
                    time:new Date().getDate()
                }
                socket.emit('sendMsg',msg)
                this.chatlist.push(msg)
                  this.savelocalStorage()
                this.inputData=''
                this.scrollBottom()
            },
            savelocalStorage() {
                var strkey='chat-from-'+this.$parent.me.username+'-to-'+this.touser.username
                    localStorage[strkey]=JSON.stringify(this.chatlist)
            },
            getlocalStorage(){

                    var strkey='chat-from-'+this.$parent.me.username+'-to-'+this.touser.username
                    localStorage[strkey]=localStorage[strkey]?localStorage[strkey]:'[]'
                    this.chatlist=JSON.parse(localStorage[strkey])


            },
            scrollBottom(){
                var chatbox=this.$refs.chatbox
                chatbox.scrollTop=chatbox.scrollHeight - chatbox.clientHeight
            }
        },

        beforeMount() {
            this.getlocalStorage()
            socket.emit('readMsg',{
                self:this.$parent.me.username,
                to:this.touser.username
            })

        },
        mounted() {
            this.scrollBottom()
        },
        updated() {
            this.scrollBottom()
        },
        watch:{
            newMsg: function (data) {
                 this.chatlist.push(data)
                this.savelocalStorage()
            }
        }

    }
</script>

<style scoped>

    .itemself{
        display: flex;

        align-items: center;
        align-content: center;
        margin: 10px 10px;
        justify-content: flex-start;
        flex-direction: row-reverse;

    }

    .item{
        display: flex;
        flex-direction: row;
        align-items: center;
        align-content: center;
        margin: 10px 10px;
    }

    .itemself img{
        width: 50px;
        height: 50px;
        border-radius: 50%;
        margin: 10px 10px;
    }

.item img{
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin: 10px 10px;
}
    .itemself .content{
        background-color: #cccccc;
        border-radius: 5px;
        line-height:40px;
        padding: 0 10px;
        margin: 0 5px;
        position: relative;
    }
    .itemself .content:before{
        position: absolute;
        content: '';
        border-left: 15px solid #cccccc;
        border-bottom: 5px solid transparent;
        border-top: 8px solid transparent;
        width: 0;
        height: 0;
        top: 20px;
        right: -10px;
        left: initial;

    }
.item .content{
    position: relative;
    background-color: #cccccc;
    border-radius: 5px;
    line-height:40px;
    padding: 0 10px;
    margin: 0 5px;}

    .item .content:before{

        position: absolute;
        content: '';
        border-right: 15px solid #cccccc;
        border-bottom: 5px solid transparent;
        border-top: 8px solid transparent;
        width: 0;
        height: 0;
        top: 20px;
        left: -10px;
    }
    .nav i{
        display: flex;
        font-size: 40px;
        position: relative;
        margin: 0 10px;
        cursor: pointer;
    }
    .nav .username label{
        font-size: 20px;
        font-weight: bold;
        position: relative;left: -10px;
    }

   .chatcom{
       display: flex;
       width: 100vw;
       height: 100vh;
       position: fixed;
       top: 0;
       left: 0;
       flex-direction: column;
       background-color: #eeeeee;

   }
    .nav{
        display: flex;
        width: 100vw;
        height: 60px;
        text-align: center;
        background-color: skyblue;
        align-items: center;
        justify-content: space-between;

    }
    .chatlist{
        flex:1;
        overflow: scroll;
    }
    .inputCom{
        display: flex;
        justify-content: space-between;

    }
    .inputCom input{
        width: 270px;
        height: 40px;
        outline: none;
        border-radius: 5px;
        padding: 0 10px;
    }
    .inputCom button{
        outline:none;
        border: 1px solid #cccccc;
        width: 80px;
        height: 40px;
        border-radius: 5px;
    }
</style>
var express = require('express');
var router = express.Router();
var sqlquery=require('../public/javascripts/zhmysql')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('你好')
});

router.all("*",function(req,res,next){
  //设置允许跨域的域名，*代表允许任意域名跨域
  res.header("Access-Control-Allow-Origin","*");
  //允许的header类型
  res.header("Access-Control-Allow-Headers","content-type");
  //跨域允许的请求方式
  res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");
  if (req.method.toLowerCase() == 'options')
    res.send(200);  //让options尝试请求快速结束
  else
    next();
})

router.get('/api/userlist',async function (req,res) {
  var sql='select * from user where isgroup is null'
  var result=await sqlquery(sql)
  //跨域处理
  res.json(Array.from(result))

})


module.exports = router;

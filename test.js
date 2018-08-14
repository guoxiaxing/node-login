var express = require('express');
var mysql = require('mysql');
var server = express();
server.listen(2182);
var i = 7;
server.use('/res',function(req,res){
	i=i+1;
	console.log(i);
	res.setHeader('Access-Control-Allow-Origin','*');
	var pool = mysql.createPool({
		'host':'localhost',
		'user':'root',
		'password':'162129',
		'database':'test'
	});
	pool.getConnection(function(err,connection){
		if(err){
			throw err;
		}else{
			connection.query('SELECT * FROM `user` WHERE name="'+req.query.user+'";',function(err,data){
				if(err){//注意SQL语句的拼接形式，此时用户名为字符串
					throw err;
				}else{
					//返回的数据格式为数组里面的每一个元素为一个对象
					if(data.length>0){
						res.send('用户名已存在');
					}else{
						// 插入
						connection.query('INSERT INTO `user` (`id`,`name`,`age`) VALUES('+i+',"'+req.query.user+'","'+req.query.pass+'");',function(err,data){
							if(err){
								throw err;
							}else{
								//断开连接
								connection.end();
								res.send('注册成功');
							}
						})
					}
				}
			});
		}
	});
});
server.use('/login',function(req,res){
	res.setHeader('Access-Control-Allow-Origin','*');
	var pool = mysql.createPool({
		'host':'localhost',
		'user':'root',
		'password':'162129',
		'database':'test'
	});
	var i = 7;
	pool.getConnection(function(err,connection){
		if(err){
			throw err;
		}else{
			connection.query('SELECT * FROM `user` WHERE name="'+req.query.user+'"'+' AND age='+req.query.pass+';',function(err,data){
				if(err){//注意SQL语句的拼接形式，此时用户名为字符串
					throw err;
				}else{
					//返回的数据格式为数组里面的每一个元素为一个对象
					if(data.length>0){
						res.send('登录成功');
					}else{
						res.send('登录失败');
					}
					connection.end();
				}
			});
		}
	});
});
require('dotenv').config();
const mysql = require('mysql');
const connDB = mysql.createConnection({
	user:process.env.ROOT,
	host:process.env.HOST,
	database:process.env.DB,
	password:process.env.PASS
});
connDB.connect((err)=>{
	if(err) throw err;
	console.log('DB is now connected.')
});

module.exports = connDB;

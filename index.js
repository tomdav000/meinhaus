require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const override = require('method-override');
const db = require('./config/db');
const path = require('path');
const favicon = require('serve-favicon');
const session = require('express-session');
const app = express();

db();
require('./config/passport')(passport)
app.set('view engine','ejs');
app.use(express.static('images/favicon.ico'));
app.use(cors());
app.use('/uploads',express.static('uploads'));
app.use(express.static('public/images'));
app.use(override('_method'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(session({
	secret:'123abc',
	resave: false,
	saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());


app.use('/',require('./routes/routes'));
app.use('/api/admin',require('./routes/userRoutes'));

const PORT = process.env.PORT || 5000;

if(process.env.PROD_ENV === 'production'){
	app.use(express.static('client/build'))
	const path = require('path')
	app.use('*',(req,res)=>{
		res.sendFile(path.resolve('client','build','public/index.html'))
	})
}

app.listen(PORT,()=>console.log(`we are live on port ${PORT}`));
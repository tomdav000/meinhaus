const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const {auth} = require('../config/auth');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Article = require('../models/Article');
const multer = require('multer');
const storage = multer.diskStorage({
	destination: function(req,file,cb){
		if(file.fieldname === 'image'){
			cb(null, './uploads');
		}
		if(file.fieldname === 'video'){
			cb(null,'./uploads');
		}
	},
	filename: (req,file,cb) => {
		cb(null, new Date().toISOString() + file.originalname)
	}
})
const upload = multer({storage: storage, limits:{
	fileSize: 1024 * 1024 * 125
}});

const router = express.Router();

router.get('/',(req,res)=>{
	res.render('admin/home')
})

router.get('/hello',(req,res)=>{
	res.send('You are in the admin area')
})

router.get('/index',(req,res)=>{
	res.render('admin/home')
})

router.get('/signup',(req,res)=>{
	res.render('admin/signup')
})

router.get('/login',(req,res)=>{
	res.render('admin/login')
})

router.get('/new',auth,(req,res)=>{
	res.render('admin/newArticle')
})

router.get('/admins',auth,async(req,res)=>{
	try{
		const admins = await User.find({});
		res.render('admin/admin',{admins:admins})
	}catch(err){
		console.error(err);
		res.status(500).send('Not Available...')
	}
})

router.get('/editAdmin/:id',auth,async(req,res)=>{
	const admin = await User.findById(req.params.id)
	res.render('admin/eAdmin',{admin: admin})
})

router.get('/api/articles',auth,async(req,res)=>{
	try{
		const perPage = 5;
		const page = req.params.page;
		
		await Article.find({}).skip((perPage * page) - perPage)
		.limit(perPage).exec(function(err, articles){
			Article.count().count().exec(function(err,count){
				if(err) return next(err)
					res.render('admin/articles',{
						articles: articles,
						current: page,
						pages: Math.ceil(count / perPage)
					})
			})
		})
	} catch(err){
		console.error(err);
		res.status(500).send('Not Available...')
	}
})

router.get('/api/articles/:page',auth,async(req,res)=>{
	try{
		const perPage = 5;
		const page = req.params.page;
		
		await Article.find({}).skip((perPage * page) - perPage)
		.limit(perPage).exec(function(err, articles){
			Article.count().count().exec(function(err,count){
				if(err) return next(err)
					res.render('admin/articles',{
						articles: articles,
						current: page,
						pages: Math.ceil(count / perPage)
					})
			})
		})
	} catch(err){
		console.error(err);
		res.status(500).send('Not Available...')
	}
})

router.post('/articles',upload.fields([{name: 'image'},{name: 'video'}]),auth,async(req,res)=>{
	try{
		console.log(req.body);
		console.log(req.files);
		if(req.files){
		//let path = 'public/images/'+`${req.file.filename}`;
		let newArticle = new Article({
			title: req.body.title,
			description: req.body.description,
			training: req.body.training,
			link: req.body.link,
			image: req.files.image[0].path,
			video: req.files.video[0].path
		});
		await newArticle.save();
		res.redirect('/api/admin/api/articles')
		} else if((!req.files.image[0].path && !req.files.video[0].path)){
			//const path = '../public/images/default-image.png';
			let newArticle = new Article({
				title: req.body.title,
				description: req.body.description,
				training: req.body.training,
				link: req.body.link
			});
			await newArticle.save();
			res.status(200).redirect('/api/admin/api/articles')

		}
	} catch(err){
		console.error(err);
		res.status(500).redirect('/api/admin/new')
	}
})

router.get('/articles/article/:id',auth,async(req,res)=>{
	const article = await Article.findById(req.params.id)
	res.render('admin/removeArticle',{article: article})
})

router.delete('/articles/:id',auth,async(req,res)=>{
	try{
		await Article.findByIdAndRemove(req.params.id)
		res.status(200).redirect('/api/admin/api/articles')
	} catch(err){
		console.error(err);
		res.status(500).send('Not Available...')
	}
})



router.post('/',async(req,res)=>{
	try{
		let newUser = new User({
			name: req.body.name,
			email: req.body.email,
			password: req.body.password
		});
		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(newUser.password,salt);
		newUser.password = hash;
		await newUser.save();
		res.status(200).redirect('/api/admin/login')
	}catch(err){
		console.error(err);
		res.status(500).send('Not Available...')
	}
})


router.delete('/:id',async(req,res)=>{
	try{
		await User.findByIdAndRemove(req.params.id);
		res.status(200).redirect('/api/admin/admins')
	}catch(err){
		console.error(err);
		res.status(500).send('Not Available...')
	}
})

router.post('/login',(req,res,next)=>{
	passport.authenticate('local',{
		successRedirect: '/api/admin/admins',
		failureRedirect: '/api/admin/login',
	})(req,res,next)
})

router.get('/logout',(req,res)=>{
	req.logout();
	res.redirect('/api/admin/login')
})

module.exports = router;
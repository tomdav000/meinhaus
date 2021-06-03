const express = require('express');
const mongoose = require('mongoose');
const Article = require('../models/Article');
const {auth} = require('../config/auth');
const moment = require('moment');
const Publishable_Key = 'pk_test_GNoY4oxkGQRiNy4eqDC3iKnv00fXwaheB6';
const Secret_Key = 'sk_test_D6CWYXkw0cojSNcAgPE09qZz00nvL6l71V';
const stripe = require('stripe')(Secret_Key);
const products = require('../config/products');
const router = express.Router();

router.get('/greet',(req,res)=>{
	res.send('Hello welcome to Mein Haus basic route')
})

router.get('/',async(req,res)=>{
	try{
		const perPage = 15;
		const page = req.params.page || 1;

		if(req.query.search){
			const regex = new RegExp(escapeRegex(req.query.search),'gi');
			await Article.find({title: regex}).sort({createdAt: -1}).skip((perPage * page) - perPage)
			.limit(perPage).exec(function(err, articles){
				Article.count().count().exec(function(err,count){
					if(err) return next(err)
						res.render('home',{
							articles: articles,
							current: page,
							pages: Math.ceil(count / perPage)
						})
				})
			})
		} else{
			await Article.find({}).sort({createdAt: -1}).skip((perPage * page) - perPage)
			.limit(perPage).exec(function(err, articles){
				Article.count().count().exec(function(err,count){
					if(err) return next(err)
						res.render('home',{
							articles: articles,
							current: page,
							pages: Math.ceil(count / perPage)
						})
				})
			})
		}
	} catch(err){
		console.error(err);
		res.status(500).send('Not Available...')
	}
})

router.get('/:page',async(req,res)=>{
	try{
		const perPage = 15;
		const page = req.params.page || 1;
		
		await Article.find({}).sort({createdAt: -1}).skip((perPage * page) - perPage)
		.limit(perPage).exec(function(err, articles){
			Article.count().count().exec(function(err,count){
				if(err) return next(err)
					res.render('home',{
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

router.get('/api/store',(req,res)=>{
	res.render('store',{products:products});
})

router.get('/api/store/:id',(req,res)=>{
	const product = products.find(product => product.id === req.params.id);
	res.render('product',{key: Publishable_Key,product: product})
})

router.post('/payment', function(req, res){
    // Moreover you can take more details from user
    // like Address, Name, etc from form
    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken
    })
    .then((customer) => {
  
        return stripe.charges.create({
            amount: 2500,    
            description: req.body.description,
            currency: 'usd',
            customer: customer.id
        });
    })
    .then((charge) => {
        res.render('success')  // If no error occurs
    })
    .catch((err) => {
        res.send(err)       // If some error occurs
    });
})
  


router.get('/api/success',(req,res)=>{
	res.render('success');
})

router.get('/api/about',(req,res)=>{
	res.render('about');
})

router.get('/api/contact',(req,res)=>{
	res.render('contact');
})

router.get('/api/downloads',(req,res)=>{
	res.render('downloads')
})

router.get('/articles/:id',async(req,res)=>{
	const article = await Article.findById(req.params.id).populate('postedBy');
	res.render('article',{article: article, moment:moment});
})



router.get('/articles',async(req,res)=>{
	try{
		const articles = await Article.find({}).sort({createdAt: 1})
		res.status(200).send(articles)
	}catch(err){
		console.error(err);
		res.status(500).send('Not Available...')
	}
})

router.get('/articles/:id',async(req,res)=>{
	try{
		const article = await Article.findById(req.params.id)
		res.status(200).send(article)
	}catch(err){
		console.error(err);
		res.status(500).send('Not Available...')
	}
})

router.put('/articles/:id',async(req,res)=>{
	try{
		const article = await Article.findByIdAndUpdate(req.params.id)
		article.title = req.body.title;
		article.description = req.body.description;
		article.training = req.body.training;
		article.link = req.body.link;
		await article.save();
		res.status(200).redirect('/articles')
	}catch(err){
		console.error(err);
		res.status(500).send('Not Available...')
	}
})

router.delete('/articles/:id',async(req,res)=>{
	try{
		await Article.findByIdAndRemove(req.params.id)
		res.status(200).redirect('/articles')
	}catch(err){
		console.error(err);
		res.status(500).send('Not Available...')
	}
})

router.post('/articles',async(req,res)=>{
	try{
		let newArticle = new Article({
			title: req.body.title,
			description: req.body.description,
			training: req.body.training,
			link: req.body.link
		});
		await newArticle.save();
		res.status(200).redirect('/articles')
	}catch(err){
		console.error(err);
		res.status(500).send('Not Available...')
	}
})

function escapeRegex(text){
	return text.replace(/[-[\]{}*+?.,\\^$|#\s]/g,"\\$&");
};


module.exports = router;
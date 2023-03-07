const express = require('express');
const DB = require('../config/db');
const router = express.Router();

router.get('/test',(req,res)=>{
	res.send('Hola,Hello,Yo,Konnichiwa,NiHao')
});

router.get('/about',(req,res)=>{
	res.render('about');
});

router.get('/contact',(req,res)=>{
	res.render('contact');
});

router.get('/downloads',(req,res)=>{
	res.render('downloads');
});

router.get('/meinhaus',(req,res)=>{
	res.render('meinhaus');
});

router.get('/davis',(req,res)=>{
	res.render('davis');
});

router.get('/thunderground',(req,res)=>{
	res.render('thunderground');
});

router.get('/goons',(req,res)=>{
	res.render('goons')
})

router.get('/',(req,res)=>{
	res.render('home');
})

router.get('/home',async(req,res)=>{
	await DB.query('SELECT * FROM posts',(err,posts)=>{
		if(err) throw err;
		res.render('home',{posts:posts});
	})
})

router.get('/:id',async(req,res)=>{
	const id = req.params.id;
	await DB.query('SELECT * FROM posts WHERE id=?',[id],(err,results)=>{
		if(err) throw err;
		res.send(results);
	})
})

router.get('/remove/:id',async(req,res)=>{
	const id = req.params.id;
	await DB.query('DELETE FROM posts WHERE id=?',[id],(err,results)=>{
		if(err) throw err;
		res.redirect('/api/postages');
	})
})

router.post('/',async(req,res)=>{
	const title = req.body.title;
	const description = req.body.description;
	await DB.query('INSERT INTO posts SET title=?, description=?',[title,description],(err,results)=>{
		if(err) throw err;
		res.redirect('/api/postages')
	})
})

router.post('/update/:id',async(req,res)=>{
	const id = req.params.id;
	const title = req.body.title;
	const description = req.body.description;
	await DB.query('UPDATE posts SET title=?, description=? WHERE id=?',[title,description,id],(err,results)=>{
		if(err) throw err;
		res.redirect('/api/postages')
	})
})

module.exports = router;

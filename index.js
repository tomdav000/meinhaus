const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const app = express();

app.set('view engine','ejs');
app.use(cors());
app.use(express.static('public'));
app.use(express.static('uploads'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/api/pages',require('./routes/routes'));
if(process.env.PROD_ENV === 'production'){
	app.use(express.static('client/build'))
	const path = require('path')
	app.use('*',(req,res)=>{
		res.sendFile(path.resolve('client','build','index.html'))
	})
}
const PORT = process.env.PORT || 8888;

app.listen(PORT,()=>console.log(`live on port ${PORT}`));
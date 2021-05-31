const mongoose = require('mongoose');
const MONGODB = process.env.MONGODB

const connectDB = async ()=>{
	try{
		mongoose.connect(MONGODB,{
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false
		}).then(console.log('DB is connected')).catch(err=>()=>console.log('DB not Connected',err));
	} catch(err){
		console.error(err);
		console.log('Database is not connected...')
	}
}

module.exports = connectDB;
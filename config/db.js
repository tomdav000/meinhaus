const mongoose = require('mongoose');
const MONGODB = 'mongodb+srv://tommy_d:tommyd@silla-kwoam.mongodb.net/test?retryWrites=true&w=majority';

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
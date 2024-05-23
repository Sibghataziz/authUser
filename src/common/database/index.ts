const mongoose = require("mongoose");


async function init() {
    console.log("mongoose connection")
    const connectionParams = {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		autoIndex: true
	};
	try {
		// console.log(process.env.MONGODB_CONNECT_URL)
		mongoose.connect(process.env.MONGODB_CONNECT_URL, connectionParams);
		// mongoose.set('debug', true);
		console.log("Connected to database successfully");
	} catch (error) {
		console.log(error);
		console.log("Could not connect database!");
	}
}


export default {init}

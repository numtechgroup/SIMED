const mongoose = require('mongoose');

const dispoSchema = new mongoose.Schema({
	doctor :{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Doctor',
		required: true,
	},
	titre :{
		type: String,
		maxLength: 100
	}, 
	start :{
		type: Date,
		required: false
	},
	end:{
		type: Date,
		required: false
	},
//   start: {
// 		type: Date,
// 		required: true,
// 		// validate: {
// 		// 	validator: function (v) {
// 		// 		if (!v) {
// 		// 			return true;
// 		// 		}
// 		// 			return /([01]?[0-9]|2[0-3]):[0-5][0-9]/.test(v);
// 		// 		},
// 		// 		message: (props) => `${propss.value} is not valid time!`,
// 		// 	},
// 			},
// 	end: {
// 		type: Date,
// 		required: true,
// 		// validate: {
// 		// 	validator: function (v) {
// 		// 		if (!v) {
// 		// 			return true;
// 		// 		}
// 		// 			return /([01]?[0-9]|2[0-3]):[0-5][0-9]/.test(v);
// 		// 		},
// 		// 		message: (props) => `${props.value} is not valid time!`,
// 		// 	},
// 	}
});

module.exports = mongoose.model('Disponibility', dispoSchema);
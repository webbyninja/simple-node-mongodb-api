let mongoose = require('mongoose');
let Schema = mongoose.Schema;

//book schema definition
let ObjectSchema = new Schema(
  {
    key: { type: String, required: true },
    value: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  }, 
  { 
    versionKey: false
  }
);

ObjectSchema.statics.findByKey = function(c, cb) {
	return this.find( c )
				.sort({createdAt: -1})
					.limit(1)
						.exec(cb);
};

//Exports the ObjectSchema for use elsewhere.
module.exports = mongoose.model('object', ObjectSchema);
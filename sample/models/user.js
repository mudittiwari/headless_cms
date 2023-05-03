const mongoose = require('mongoose');
    const userSchema = new mongoose.Schema({
        id: { type: Number, unique: true },
        firstname: { type: String, required: true },
        lastname: { type: String, required: true },
    });
    let autoIncrement = 1;
    userSchema.pre('save', function (next) {
        if (this.isNew) {
            this.id = autoIncrement++;
        }
        next();
    });
    module.exports = mongoose.model('User', userSchema)
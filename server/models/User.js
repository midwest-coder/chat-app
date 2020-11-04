const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true,
        min: 6,
        max: 20
    },
    password: {
        type: String, 
        required: true,
        min: 6,
        max: 30
    },
    email: {
        type: String, 
        required: true,
        min: 6,
        max: 100
    },
    role: {
        type: String,
        enum: ['user','admin'],
        required: true
    },
    account: {
        type: String,
        required: true,
        min: 12,
        max: 24
    },
    balance: {
        type: Number, 
        required: true
        //FINISH FILLING THIS OUT
    },
    chatrooms: [{type: mongoose.Schema.Types.ObjectId, ref: 'Chatroom'}]
})

UserSchema.pre('save', function(next){
    if(!this.isModified('password'))
        return next()

    bcrypt.hash(this.password,10, (err,hashedPass) => {
        if(err)
            return next(err)

        this.password = hashedPass
        next()
    })
})

UserSchema.methods.comparePassword = function(password,callback){
    bcrypt.compare(password, this.password, (err, isMatch) => {
        if(err)
            return callback(err)
        else {
            if(!isMatch)
                return callback(null, isMatch)

            return callback(null, this)
        }
    })
}

UserSchema.methods.addTokens = function(amount) {
    this.balance += amount
    return this.balance
}

UserSchema.methods.subtractTokens = function(amount) {
    if(this.balance < amount)
    return false
    else
    this.balance -= amount
    return true
}

module.exports = mongoose.model('User', UserSchema)
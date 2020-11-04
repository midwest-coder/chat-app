const express = require('express')
const userRouter = express.Router()
const passport = require('passport')
const passportConfig = require('../passport')
const JWT = require('jsonwebtoken')
const User = require('../models/User')
const Chatroom = require('../models/Chatroom')
const Message = require('../models/Message')

const signToken = (id) => {
    return JWT.sign({
        iss: "CryptoWar",
        sub: id
    }, "CWBR2020", {expiresIn: "1m"})
}

userRouter.post('/register',(req, res) => {
    const { username, password, email, role, account, balance} = req.body
    User.findOne({account}, (err, user) => {
        if(err)
            res.status(500).json({message: {msgBody: "Error occured accessing database", msgError: true}})

        if(user)
            res.status(400).json({message: {msgBody: "User with that wallet already exists", msgError: true}})
        else {
            User.findOne({username}, (err, user) => {
                if(err)
                    res.status(500).json({message: {msgBody: "Error occured accessing database", msgError: true}})
        
                if(user)
                    res.status(400).json({message: {msgBody: "Username already exists", msgError: true}})
                else {
                    const newUser = new User({username, password, email, role, account, balance})
                    newUser.save((err) => {
                        if(err)
                            res.status(500).json({message: {msgBody: "Error occured saving user to database", msgError: true}})
                        else
                            res.status(201).json({message: {msgBody: "Account successfully created", msgError: false}})
                    })
                }
            })
        }
    })
})

userRouter.post('/login', passport.authenticate('local', {session: false}), (req, res) => {
    if(req.isAuthenticated()){
        const {_id, username, role, account, balance } = req.user
        const token = signToken(_id)
        res.cookie('access_token', token, {httpOnly: true, sameSite: true})
        res.status(200).json({isAuthenticated: true, user: {username, role, account, balance}})
    }
})

userRouter.post('/logout', passport.authenticate('jwt', {session: false}), (req, res) => {
    res.clearCookie('access_token')
    res.json({user:{username: '', role: '', account: '', balance: ''}, success: true})
})

module.exports = userRouter
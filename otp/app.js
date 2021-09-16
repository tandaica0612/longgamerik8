const TeleBot = require('telebot');
//const bot = new TeleBot('1673490412:AAFxiiIPutl6InsTys7XQ4Ef6TdOBBgPcXs'); Dev
const bot = new TeleBot('1846134307:AAEGsOG7rOgvqe7Q9YYPPKRxYZuAy8d5emQ');
let configDB = require('./config/database');
let mongoose = require('mongoose');

require('mongoose-long')(mongoose); // INT 64bit
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect(configDB.url, configDB.options)
    .catch(function(error) {
        if (error)
            console.log('Connect to MongoDB failed', error);
        else
            console.log('Connect to MongoDB success');
    });
bot.start();
require('./Controllers/start')(bot)
require('./Controllers/contact')(bot)
require('./Controllers/otp')
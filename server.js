// server.js

require('dotenv').config();
var cors = require('cors');
const path = require('path');

let Telegram = require('node-telegram-bot-api');
let TelegramToken = "1846134307:AAEGsOG7rOgvqe7Q9YYPPKRxYZuAy8d5emQ";
let TelegramBot = new Telegram(TelegramToken, { polling: false });


let express = require('express');
let app = express();
app.use(cors({
    origin: '*',
    optionsSuccessStatus: 200
}));
//let port = process.env.PORT ||  2002;
let port = process.env.PORT ||  80;
// port = 3000;
let expressWs = require('express-ws')(app);
let bodyParser = require('body-parser');
var morgan = require('morgan');

// Setting & Connect to the Database
let configDB = require('./config/database');
let mongoose = require('mongoose');
// mongoose.set('debug', true);

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

// kết nối tới database

// cấu hình tài khoản admin mặc định và các dữ liệu mặc định
require('./config/admin');
// đọc dữ liệu from
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(morgan('combined'));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

// Serve static html, js, css, and image files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// server socket
let redT = expressWs.getWss();
redT.telegram = TelegramBot;
process.redT = redT;
global.VIPCount = 1000000;
global.VIPToRIK = 5000;
global.SKnapthe = 2;
global['redT'] = redT;
global['userOnline'] = 0;


require('./app/Helpers/socketUser')(redT); // Add function socket

require('./routerHttp')(app, redT); // load các routes HTTP
require('./routerHTTPV1')(app, redT);//load routes news
require('./routerSocket')(app, redT); // load các routes WebSocket

require('./app/Cron/taixiu')(redT); // Chạy game Tài Xỉu

//require('./app/Cron/xocxoc')(redT); // Chạy game Tài Xỉu

require('./app/Cron/baucua')(redT); // Chạy game Bầu Cua
require('./config/Cron')();
require('./config/croncleardata')();
require('./update')();
//require('./config/crontextchatdata')(); // copy text chat
//require('./config/croncreateboot')();// create boot name duoc doc tu file
//require('./config/cronchattx')(redT);// boot chat tài xiu


require('./app/Telegram/Telegram')(TelegramBot); // Telegram Bot

app.listen(port, function() {
    console.log("Server listen on port ", port);
});

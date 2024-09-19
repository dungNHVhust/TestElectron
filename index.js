require('dotenv').config();
const express = require("express"); // Import express
const methodOverride = require('method-override'); //Import method-override
const bodyParser = require('body-parser'); //Import body-parser
const flash = require("express-flash"); //Import express-flash
const cookieParser = require('cookie-parser'); //Import cookie-parser
const session = require('express-session'); //Import express-session
const favicon = require('serve-favicon');
const arrayFlatten = require('array-flatten');
const path = require('path');
//Connect Database
const database = require("./config/database.js");
database.connect();

const systemConfig = require("./config/system.js")

const app = express(); //Gọi hàm express() và khởi tạo app
const port = process.env.PORT; //Set port mặc định là 3000
const route = require("./routes/client/index.route.js");
const routeAdmin = require("./routes/admin/index.route.js");

//Setup PUG
app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");
app.use(express.static(`${__dirname}/public`));
app.use(methodOverride('_method'));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

//Setup body-parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

//App Locals Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;

//Express-flash
app.use(cookieParser("t4n3or4t4n3or4"));
app.use(session({ cookie: {maxAge: 60000}}));
app.use(flash());

//Nhúng router
route(app);
routeAdmin(app);

app.listen(port, () => {
  //Gọi hàm listen truyền vào tham số port và gọi hàm arrow
  console.log(`This is example app listening on port ${port}`);
});




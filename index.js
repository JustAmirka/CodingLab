const express = require("express");
const bodyParser = require('body-parser')
const app = express();
const ejs=require('ejs');
const port = 7000;


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('public'))

app.use("/", require("./home"));


app.listen(port, () =>
    console.log(`App listening at http://localhost:${port}`)
);


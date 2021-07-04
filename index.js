const http = require("http");
const fs = require("fs");
var requests = require("requests");

const port = process.env.PORT || 8000;

//var express = require("express");
//var bodyParser = require('body-parser');
//const { response } = require("express");

//var app = express();

/*app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var city = 'delhi';

app.get('/value', function(req, res){
   city = req.body.city;
   
});
/*const prompt = require('prompt-sync')({sigint: true});

var jalert = require("js-alert");

const city = jalert.alert(prompt("enter city"));
*/

//response.write(city);

const homeFile = fs.readFileSync("home.html","utf-8");

const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%tempval%}",orgVal.list[0].main.temp);
     temperature = temperature.replace("{%tempmin%}",orgVal.list[0].main.temp_min);
     temperature = temperature.replace("{%tempmax%}",orgVal.list[0].main.temp_max);
     temperature = temperature.replace("{%location%}",orgVal.list[0].name);
     temperature = temperature.replace("{%country%}",orgVal.list[0].sys.country);
     temperature = temperature.replace("{%tempstatus%}",orgVal.list[0].weather[0].main);

    return temperature;
}

const server = http.createServer((req, res) => {
    if(req.url == "/") {
        requests("https://api.openweathermap.org/data/2.5/find?q=pune&units=metric&appid=7985c6feb7e61d9f7b7560c1db28bdc7")
            .on('data',  (chunk) => {
                const objdata = JSON.parse(chunk);
                const arrData = [objdata];
           // console.log(arrData);

                const realTimedata = arrData.map((val) => replaceVal(homeFile,val))
                .join("");
               res.write(realTimedata);

               // console.log(realTimedata);
    })
        .on('end',  (err)=> {
        if (err) return console.log('connection closed due to errors', err);
            res.end();
    });
    }
});

server.listen(port, () => {
    console.log('listening to the port no at',port);
});
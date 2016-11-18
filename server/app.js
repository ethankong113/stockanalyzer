var http = require('http');
var express = require('express');
var path = require('path');
var app = express();
var fs = require('fs');
var readCSV = require('./spider.js');

app.use(express.static(path.join(__dirname, '../client/assets')));

app.get('/', (req, res)=> {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.get('/:ticker/prices', (req, res) => {
  var ticker = req.params.ticker;
  fs.readFile(path.join(__dirname, `../data/${ticker}/prices.json`), 'utf8', (err, data) => {
    if (err) throw err;
    var raw = JSON.parse(data).dataset.data;
    var info = raw.map((datum)=> {
      return {
        date: datum[0],
        price: datum[11],
        vol: datum[12]
      };
    });
    res.json(info);
  });
});

app.get('/:ticker/fundamentals', (req, res) => {
  var ticker = req.params.ticker;
  readCSV(ticker, (data) => {res.json(data);});
});

app.listen(8008, ()=>{
  console.log("Listening.");
});

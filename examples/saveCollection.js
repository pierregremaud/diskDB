'use strict';
// once you run npm install diskDB,
// var db = require('diskdb'); instead of
var DiskDB = require('..').default;
var db = new DiskDB();

db.connect(`${__dirname}/db`, ['articles']);
var article = {
    title : 'diskDB rocks',
    published : 'today',
    rating : '5 stars'
}

var article2 = {
    title : 'diskDB rocks',
    published : 'yesterday',
    rating : '5 stars'
}

var article3 = {
    title : 'diskDB rocks',
    published : 'today',
    rating : '4 stars'
}

//var savedArticle = db.articles.save(article);
//var savedArticle = db.articles.save([article]);
var savedArticle = db.articles.save([article, article2, article3]);

console.log(savedArticle);

// run : node saveCollection.js

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
var savedArticle = db.articles.save(article);
console.log(db.articles.count());
//db.articles.remove();
//db.articles.remove({rating : '5 stars'});
//db.articles.remove({rating : '5 stars'}, true);
db.articles.remove({rating : '5 stars'}, false);
console.log(db.articles.count());
// run : node remove.js

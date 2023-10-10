/*
 * diskDB
 * http://arvindr21.github.io/diskDB
 *
 * Copyright (c) 2014 Arvind Ravulavaru
 * Licensed under the MIT license.
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _path = require("path");
var _uuid = require("uuid");
var util = _interopRequireWildcard(require("./util"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var UUID = function UUID() {
  return (0, _uuid.v4)().replace(/-/g, '');
};
var Collection = exports["default"] = /*#__PURE__*/function () {
  function Collection(db, collectionName) {
    var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    _classCallCheck(this, Collection);
    this.db = db;
    this.opts = opts;

    // throw an exception if the collection's JSON file is invalid?
    this.opts.throwParseError = opts.throwParseError === undefined ? false : opts.throwParseError;
    this.collectionName = collectionName;
    this._f = (0, _path.join)(db._db.path, "".concat(collectionName, ".json"));
  }
  _createClass(Collection, [{
    key: "_parse",
    value: function _parse() {
      try {
        return JSON.parse(String(util.readFromFile(this._f)));
      } catch (err) {
        if (this.opts.throwParseError) {
          throw err;
        }
      }
      return [];
    }
  }, {
    key: "find",
    value: function find(query) {
      var collection = this._parse();
      if (!query || Object.keys(query).length === 0) {
        return collection;
      }
      var searcher = new util.ObjectSearcher();
      return searcher.findAllInObject(collection, query, true);
    }
  }, {
    key: "findOne",
    value: function findOne(query) {
      var collection = this._parse();
      if (!query) {
        return collection[0];
      }
      var searcher = new util.ObjectSearcher();
      return searcher.findAllInObject(collection, query, false)[0];
    }
  }, {
    key: "save",
    value: function save(data) {
      var collection = this._parse();
      if (_typeof(data) === 'object' && data.length) {
        if (data.length === 1) {
          if (data[0].length > 0) {
            data = data[0];
          }
        }
        var retCollection = [];
        for (var i = data.length - 1; i >= 0; i--) {
          var d = data[i];
          d._id = UUID().replace(/-/g, '');
          collection.push(d);
          retCollection.push(d);
        }
        util.writeToFile(this._f, collection);
        return retCollection;
      } else {
        data._id = UUID().replace(/-/g, '');
        collection.push(data);
        util.writeToFile(this._f, collection);
        return data;
      }
    }
  }, {
    key: "update",
    value: function update(query, data, options) {
      var ret = {},
        collection = this._parse(); // update
      var records = util.finder(collection, query, true);
      if (records.length) {
        if (options && options.multi) {
          collection = util.updateFiltered(collection, query, data, true);
          ret.updated = records.length;
          ret.inserted = 0;
        } else {
          collection = util.updateFiltered(collection, query, data, false);
          ret.updated = 1;
          ret.inserted = 0;
        }
      } else {
        if (options && options.upsert) {
          data._id = UUID().replace(/-/g, '');
          collection.push(data);
          ret.updated = 0;
          ret.inserted = 1;
        } else {
          ret.updated = 0;
          ret.inserted = 0;
        }
      }
      util.writeToFile(this._f, collection);
      return ret;
    }
  }, {
    key: "remove",
    value: function remove(query, multi) {
      if (query) {
        var collection = this._parse();
        if (typeof multi === 'undefined') {
          multi = true;
        }
        collection = util.removeFiltered(collection, query, multi);
        util.writeToFile(this._f, collection);
      } else {
        util.removeFile(this._f);
        delete this.db[this.collectionName];
      }
      return true;
    }
  }, {
    key: "count",
    value: function count() {
      return this._parse().length;
    }
  }]);
  return Collection;
}();
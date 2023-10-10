/*
 * diskDB
 * http://arvindr21.github.io/diskDB
 *
 * Copyright (c) 2014 Arvind Ravulavaru
 * Licensed under the MIT license.
 */

'use strict';

// global modules
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _path = require("path");
var _chalk = require("chalk");
var _util = require("./util");
var _collection = _interopRequireDefault(require("./collection"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); } //local modules
var DiskDB = exports["default"] = /*#__PURE__*/function () {
  function DiskDB() {
    _classCallCheck(this, DiskDB);
  }
  _createClass(DiskDB, [{
    key: "connect",
    value: function connect(path, collections) {
      if ((0, _util.isValidPath)(path)) {
        this._db = {
          path: path
        };
        console.log((0, _chalk.green)('Successfully connected to : ' + path));
        if (collections) {
          this.loadCollections(collections);
        }
      } else {
        console.log((0, _chalk.red)('The DB Path [' + path + '] does not seem to be valid. Recheck the path and try again'));
        return false;
      }
      return this;
    }
  }, {
    key: "loadCollections",
    value: function loadCollections(collections) {
      var _this = this;
      if (!this._db) {
        console.log((0, _chalk.red)('Initialize the DB before you add collections. Use : ', 'db.connect(\'path-to-db\');'));
        return false;
      }
      if (Array.isArray(collections)) {
        collections.forEach(function (collection) {
          if (!collection.includes('.json')) {
            collection = "".concat(collection, ".json");
          }
          var collectionFile = (0, _path.join)(_this._db.path, collection);
          if (!(0, _util.isValidPath)(collectionFile)) {
            (0, _util.writeToFile)(collectionFile);
          }
          var collectionName = collection.replace('.json', '');
          _this[collectionName] = new _collection["default"](_this, collectionName);
        });
      } else {
        console.log((0, _chalk.red)('Invalid Collections Array.', 'Expected Format : ', '[\'collection1\',\'collection2\',\'collection3\']'));
      }
      return this;
    }
  }]);
  return DiskDB;
}();
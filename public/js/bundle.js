(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var data = require('./utils.js');
$(document).ready(function () {
        AP.register({
          "dialog-button-click":saveClicked,
	 	  "ad-bookmarks-message.action.nonlink": textData 
        });

	  	function textData(message,form) {
				$("#namefield").val(message.body);
			}
			
		function saveClicked(event, closeDialog) {
			if (event.action == 'ad-bookmarks.save') {
				 bookmark = $("#namefield").val();
         		 label = $("#labelfield").val();
         		 data.push({bookmark: bookmark, label: label});
			}
			closeDialog(true);
		}
});

},{"./utils.js":2}],2:[function(require,module,exports){
// APP FIREBASE URL
var root = 'https://blinding-heat-1117.firebaseio.com/';
var data = new Firebase('https://blinding-heat-1117.firebaseio.com/dialog');

module.exports = data;


},{}]},{},[1]);

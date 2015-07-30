var client = require('client');

function doClick(e) {
	alert($.label.text);
}

$.index.open();

function init(e) {
	client.create();
	client.connect();
};

function connect(e) {
	client.connect();
};

function pick(e) {
	Ti.API.info("PICK");
	client.write("PICK");
};

function release(e) {
	Ti.API.info("RELEASE");
	client.write("RELEASE");
};
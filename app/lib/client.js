var hostname = '10.70.1.47';
var port = '5000';

var clientSocket;

exports.create = function create(e) {
	Ti.API.info("Calling create on client socket. ++++ " + clientSocket);

	if (!clientSocket) {
		clientSocket = createClientSocket();
	}

	Ti.API.info("Socket state: " + clientSocket.getState());
};

exports.connect = function connect(e) {
	Ti.API.info("Calling connect on client socket.");
	try {
		if (!clientSocket) {
			clientSocket = createClientSocket();
		}
		clientSocket.connect();
	} catch(err) {
		Ti.API.error(err);
	}

	Ti.API.info("Socket state: " + clientSocket.getState());
};

exports.write = function write(e) {
	// Ti.Stream.pump(clientSocket, pumpCallback, 1024, true);

	clientSocket.write(Ti.createBuffer({
		value : e + '\n'
	}));

};

function pumpCallback(e) {

	// Has the remote socket closed its end?
	if (e.bytesProcessed < 0) {
		Ti.API.info("Closing client socket." + JSON.stringify(e));
		closeClientSocket();
		return;
	}
	try {
		if (e.buffer) {
			var received = e.buffer.toString();
			Ti.API.info('Received: ' + received);
		} else {
			Ti.API.error('Error: read callback called with no buffer!');
		}
	} catch (ex) {
		Ti.API.error("Error in pumpCallback(): " + ex);
	}
}

function createClientSocket() {
	Ti.API.info("CREATING");
	return Ti.Network.Socket.createTCP({
		host : hostname,
		port : port,
		connected : function(e) {
			Ti.API.info('Client socket connected!');
			Ti.Stream.pump(e.socket, pumpCallback, 1024, true);
			e.socket.write(Ti.createBuffer({
				value : 'A message from a connecting socket.\n'
			}));
		},
		error : function(e) {
			Ti.API.info('Error (' + e.errorCode + '): ' + e.error);
		}
	});
}

function closeClientSocket() {
	try {
		if (clientSocket) {
			clientSocket.close();
			clientSocket = undefined;
		}
	} catch(err) {
		Ti.API.info("Error in closeSocket(): " + err);
	}
};

// exports.connect = function connect(e) {
//
//
// if (!clientSocket) {
// clientSocket = Ti.Network.Socket.createTCP({
// host : hostname,
// port : 5000,
// connected : function(e) {
// Ti.API.info('Client socket connected!');
// Ti.Stream.pump(e.socket, pumpCallback, 1024, true);
// e.socket.write(Ti.createBuffer({
// value : 'A message from a connecting socket.\n'
// }));
// },
// error : function(e) {
// Ti.API.info('Error (' + e.errorCode + '): ' + e.error);
// }
// });
// } else {
// clientSocket.connect();
// }
// };
//
// exports.write = function write(e) {
// if (checkSocket()) {
// Ti.Stream.pump(clientSocket, pumpCallback, 1024, true);
// clientSocket.write(Ti.createBuffer({
// value : e + '\n'
// }));
// }
// };
//
// function pumpCallback(e) {
// // Has the remote socket closed its end?
// if (e.bytesProcessed < 0) {
// Ti.API.info("Closing client socket.");
// clientSocket.close();
// return;
// }
// try {
// if (e.buffer) {
// var received = e.buffer.toString();
// Ti.API.info('Received: ' + received);
// } else {
// Ti.API.error('Error: read callback called with no buffer!');
// }
// } catch (ex) {
// Ti.API.error(ex);
// }
// }
//
// function checkSocket() {
// if (!clientSocket)
// return;
// else
// return clientSocket.getState();
// }

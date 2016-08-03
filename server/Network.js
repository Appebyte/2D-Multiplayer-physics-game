var Game = require('./Game');

function Network(io) {
    this.io = io;
    this.game = new Game(io);

    this.connect();
}

Network.prototype.connect = function() {
    var network = this;
    var self = this.io;

    this.io.sockets.on('connect', function(socket) {
        self.sockets.connected[socket.id].emit('connected', true);

        socket.on('getPlayers', function() {
            var data = [];

            for (var i = 0; i < network.game.players.length; i++) {
                var marblesContext = network.game.players[i].marbles;
                data.push(marblesContext[marblesContext.length-1].getClientDetails());
            }

            socket.emit('getPlayers', data);
        });

        socket.on('getWalls', function() {
            var data = [];

            for (var i = 0; i < network.game.walls.length; i++) {
                data.push(network.game.walls[i].getClientDetails());
            }

            socket.emit('getWalls', data);
        });

        socket.on('getWorldDetails', function() {
            var data = {
                time: network.game.world.time
            };

            socket.emit('getWorldDetails', data);
        });

        // TODO: Add add player logic inside the game class
        socket.on('addMainPlayer', function() {
            var player = network.game.addPlayer();
            var marblesContext = player.marbles;
            self.sockets.connected[socket.id].emit('addMainPlayer', marblesContext[marblesContext.length-1].getClientDetails());
            socket.broadcast.emit('addNewPlayer', marblesContext[marblesContext.length-1].getClientDetails());
        });

        socket.on('impulse', function(data) {
            network.game.currentId = data.id;
            network.game.currentX = data.x;
            network.game.currentY = data.y;
            network.game.request = true;

            if (self) {
                self.emit('impulseState', data);
            }
        });
    });
};

module.exports = Network;

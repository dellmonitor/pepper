var Game = {
	fps: 50,
	width: 1920,
	height: 1080,
};

var Order = {
	queue: []
}

var Mouse = {
	onMouseDown: function(event) {
		if (event.button == 2) {
			let screen = Game.canvas.getBoundingClientRect();
			let order = { x: (event.x - screen.x) * Game.width / screen.width,
						  y: (event.y - screen.y) * Game.height / screen.height  };
			if (event.shiftKey) Order.queue.push(order);
			else Order.queue = [ order ];
		}
	}
}

Game.start = function() {
	Game.canvas = document.getElementById('game');
	Game.canvas.width = Game.width;
	Game.canvas.height = Game.height;
	Game.canvas.oncontextmenu = () => false;
	Game.canvas.addEventListener("mousedown", (event) => { Mouse.onMouseDown(event); } );

	Game.context = Game.canvas.getContext('2d');

	Game.objects = [];

	Game._onEachFrame(Game.run);
};

Game.draw = function() {
	this.context.clearRect(0, 0, this.width, this.height);
	this.objects.forEach((object) => object.draw());
}

Game.update = function() {
	this.objects.forEach((object) => object.update());
}

Game.run = (function() {
	var loops = 0, skipTicks = 1000 / Game.fps,
		maxFrameSkip = 10,
		nextGameTick = (new Date).getTime();

	return function() {
		loops = 0;

		while ((new Date).getTime() > nextGameTick && loops < maxFrameSkip) {
			Game.update();
			nextGameTick += skipTicks;
			loops++;
		}

		if (loops) Game.draw();
	}
})();

Game._onEachFrame = (function() {
	if (requestAnimationFrame) {
		return function(cb) {
			var _cb = function() { cb(); requestAnimationFrame(_cb); }
			_cb();
		};
	} else {
		return function(cb) {
			setInterval(cb, 1000 / Game.fps);
		}
	}
})();

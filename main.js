var Game = {
	fps: 50,
	width: 1920,
	height: 1080,
};

var Order = {
	queue: [],
	immediate: NaN,
}

var Screen;

var Mouse = {
	onMouseDown: function(event) {
		if (! Game.pause && event.button == 2) {
			let order = {
				x: (event.x - Screen.x) * Game.width / Screen.width,
				y: (event.y - Screen.y) * Game.height / Screen.height };
			if (event.shiftKey) Order.queue.push(order);
			else {
				Order.queue = [];
				Order.immediate = order;
			}
		}
	},
}

var Key = {
	_pressed: {
		s: {
			action: function() {
				Order.queue = [];
				Order.immediate = NaN;
				Game.player.clearOrder();
			}
		}
	},
	onKeyDown: function(event) {
		this._pressed[event.key].action();
		console.log(event.key);
	},
}

Game.start = function() {
	Game.canvas = document.getElementById('game');
	Game.canvas.width = Game.width;
	Game.canvas.height = Game.height;
	Game.canvas.oncontextmenu = () => false;
	Game.canvas.addEventListener("mousedown", (event) => { Mouse.onMouseDown(event); } );
	Screen = Game.canvas.getBoundingClientRect();

	Game.context = Game.canvas.getContext('2d');

	document.getElementById('pauseMenu').oncontextmenu = () => false;

	Game.pause = false;

	Game.objects = [];
	Game.player = new Player(Game.width / 2, Game.height / 2, new Rectangle(Game.width / 2, Game.height / 2, 16, 16), 'black', 5);
	Game.objects.push(Game.player);

	window.addEventListener('keydown', (event) => {
		if (event.key === 'Escape') Game.togglePause();
		else Key.onKeyDown(event);
	});
	window.addEventListener('resize', (event) => { Screen = Game.canvas.getBoundingClientRect(); });

	Game._onEachFrame(Game.run);
};

Game.togglePause = function() {
	this.pause = ! this.pause;
	if (this.pause) Game.showPauseMenu();
	else Game.hidePauseMenu();
}

Game.showPauseMenu = function() {
	document.getElementById('pauseMenu').style.display = 'block';
}

Game.hidePauseMenu = function() {
	document.getElementById('pauseMenu').style.display = 'none';
}

Game.draw = function(interpolation) {
	this.context.clearRect(0, 0, this.width, this.height);
	this.objects.forEach((object) => object.draw(this.context, interpolation));
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

		let interpolation = 0;
		while ((new Date).getTime() > nextGameTick) {
			if (! Game.pause) Game.update();
			nextGameTick += skipTicks;
			loops++;
		}
		if (! Game.pause) interpolation = (nextGameTick - (new Date).getTime()) / skipTicks;
		Game.draw(interpolation);
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

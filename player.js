class Player {
	constructor(x, y, hitbox, color, speed) {
		this.x = x;
		this.y = y;
		this.hitbox = hitbox;
		this.color = color;
		this.speed = speed;
		this.velocity = { x: 0, y: 0 };
		this.dist = 0;
		this.order = NaN;
	}

	update() {
		if (Order.immediate) {
			this.setOrder(Order.immediate);
			Order.immediate = NaN;
		} else if (! this.order && Order.queue.length != 0) {
			this.setOrder(Order.queue.shift());
		}
		if (this.order) {
			if (! this.close()) {
				this.move();
			} else {
				this.velocity = { x: 0, y: 0 };
				this.x = this.order.x;
				this.y = this.order.y;
				this.order = NaN;
			} 
		}
		this.hitbox = new Rectangle(this.x, this.y, this.hitbox.width, this.hitbox.height);
	}

	draw(context, interpolation) {
		context.fillStyle = this.color;
		context.fillRect(
			- Camera.x + this.hitbox.left - this.velocity.x * interpolation,
			- Camera.y + this.hitbox.top - this.velocity.y * interpolation,
			this.hitbox.width * 2,
			this.hitbox.height * 2
		);
	}

	setOrder(order) {
		this.order = order;
		let dx = order.x - this.x,
			dy = order.y - this.y,
			dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)),
			ratio = this.speed / dist;
		this.velocity = { x: dx * ratio, y: dy * ratio };
	}

	clearOrder() {
		this.order = NaN;
		this.velocity = { x: 0, y: 0 };
	}

	close() {
		return (Math.sqrt(Math.pow(this.x - this.order.x, 2) + Math.pow(this.y - this.order.y, 2)) < this.speed);
	}

	move() {
		this.x += this.velocity.x;
		this.y += this.velocity.y;
	}
}

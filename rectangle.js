class Rectangle {
	constructor(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

		this.left = x - width;
		this.right = x + width;
		this.top = y - height;
		this.bottom = y + height;
	}
}

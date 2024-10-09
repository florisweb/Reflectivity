
export default class Line {
	position;
	delta;
	constructor({position, delta}) {
		this.position = position;
		this.delta = delta;
	}

	intersects(_line) {
		let deltaStart = _line.position.difference(this.position);

		let t1 = (deltaStart.y * _line.delta.x - deltaStart.x * _line.delta.y) / (_line.delta.y * this.delta.x - this.delta.y * _line.delta.x);
		let t2 = (deltaStart.x + this.delta.x * t1) / _line.delta.x;
		if (t2 < 0 || t2 > 1 || isNaN(t2)) return false;

		return {
			t1: t1,
			position: this.getPositionByT(t1)
		}
	}

	getPositionByT(t) {
		return this.position.copy().add(this.delta.copy().scale(t));
	}
}
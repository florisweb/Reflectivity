import Vector from './vector.js';


export class Shape {
	vectors = [];

	constructor({vectors}) {
		this.vectors = vectors;
	}
}

export class BoxShape extends Shape {
	constructor({width, height}) {
		super({vectors: [
			new Vector(0, 0),
			new Vector(width, 0),
			new Vector(width, height),
			new Vector(0, height),
		]});
	}
}
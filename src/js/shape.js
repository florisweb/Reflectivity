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

export class CircleShape extends Shape {
	constructor({radius, startAngle = 0, stopAngle = 2 * Math.PI, segments = 200}) {
		let vectors = [];

		let stepSize = (stopAngle - startAngle) / segments;
		for (let i = startAngle; i < stopAngle; i += stepSize)
		{
			vectors.push(new Vector(
				radius * Math.cos(i),
				radius * Math.sin(i),

			))
		}

		super({vectors: vectors});
	}
}

export class LenticuleShape extends Shape {
	constructor({radius, height, segments = 200}) {
		let vectors = [];
		if (height < radius) height = radius;

		let stepSize = Math.PI / segments;
		for (let i = Math.PI; i < Math.PI * 2; i += stepSize)
		{
			vectors.push(new Vector(
				radius * Math.cos(i),
				radius * Math.sin(i),
			))
		}

		vectors.push(new Vector(radius, height - radius));
		vectors.push(new Vector(-radius, height - radius));

		super({vectors: vectors});
	}
}

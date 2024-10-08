import Vector from './vector.js';
import Line from './line.js';

export class Shape {
	vectors = [];
	#material;

	area = 0;
	boundingBox = {
		x: [Infinity, -Infinity],
		y: [Infinity, -Infinity]
	}

	constructor({vectors}) {
		this.vectors = vectors;

		for (let v of this.vectors)
		{
			if (v.x < this.boundingBox.x[0]) this.boundingBox.x[0] = v.x;
			if (v.x > this.boundingBox.x[1]) this.boundingBox.x[1] = v.x;
			if (v.y < this.boundingBox.y[0]) this.boundingBox.y[0] = v.y;
			if (v.y > this.boundingBox.y[1]) this.boundingBox.y[1] = v.y;
		}
	}

	setMaterial(_material) {
		this.#material = _material;
	}

	pointIsInside(_point) {
		let delta = this.#material.position.difference(_point);
		if (delta.x < this.boundingBox.x[0] || delta.x > this.boundingBox.x[1] || 
			delta.y < this.boundingBox.y[0] || delta.y > this.boundingBox.y[1]
		) return false;

		let startPoint = new Vector(-100, -100);
		let testLine = new Line({position: startPoint, delta: startPoint.difference(_point)});
		return this.getIntersections(testLine).filter(int => int.t1 >= 0 && int.t1 <= 1).length % 2 === 1; 
	}

	getIntersectionLines() {
		let startPos = this.#material.position.copy().add(this.vectors[0]); 
		let prevPos = startPos.copy()
		let lines = [];
		for (let i = 1; i < this.vectors.length; i++)
		{
			let newPos = this.#material.position.copy().add(this.vectors[i]);
			lines.push(new Line({
				position: prevPos.copy(),
				delta: prevPos.difference(newPos)
			}))

			prevPos = newPos.copy();
		}
		lines.push(new Line({
			position: prevPos.copy(),
			delta: prevPos.difference(startPos)
		}));
		return lines;
	}

	getIntersections(_probeLine) {
		let intersections = [];
		let lines = this.getIntersectionLines();
		for (let line of lines)
		{
			let data = _probeLine.intersects(line);
			if (!data) continue;

			data.material = this.#material;
			data.normal = line.delta.perpendicular.getProjection(data.position.difference(_probeLine.position));
			data.probeLine = _probeLine;
			data.matLine = line;
			intersections.push(data);
		}
		return intersections;
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
		this.area = width * height;
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
		this.area = Math.PI * radius**2 * (stopAngle - startAngle) / 2 / Math.PI;
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
		this.area = .5 * Math.PI * radius**2 + radius * 2 * (height - radius);
	}
}


export class InverseLenticuleShape extends Shape {
	constructor({radius, height, segments = 200}) {
		let vectors = [];
		if (height < radius) height = radius;

		vectors.push(new Vector(-radius, 0));

		let stepSize = Math.PI / segments;
		for (let i = -Math.PI; i < 0; i += stepSize)
		{
			vectors.push(new Vector(
				radius * Math.cos(i),
				radius * Math.sin(i) + height,
			))
		}

		vectors.push(new Vector(radius, 0));

		super({vectors: vectors});
		this.area = (radius*radius / 2 - .5 * Math.PI * radius**2) + radius * 2 * (height - radius);
	}
}

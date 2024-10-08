import Vector from './vector.js';
window.Vector = Vector;

export default class LightRay {
	position = new Vector(5, 5);
	direction = new Vector(1, 1);
	wavelength = 500;



	constructor({position, direction, wavelength}) {
		this.direction = direction;
		this.position = position;
		this.wavelength = wavelength;
	}

	computeSections(_materials) {
		let ownLine = new Line({position: this.position, delta: this.direction.copy().scale(1000)});

		let intersections = [];

		for (let material of _materials)
		{
			let startPos = material.position.copy().add(material.shape.vectors[0]); 
			let prevPos = startPos.copy()
			let lines = [];
			for (let i = 1; i < material.shape.vectors.length; i++)
			{
				let newPos = material.position.copy().add(material.shape.vectors[i]);
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


			for (let line of lines)
			{
				let data = ownLine.intersects(line);
				if (!data) continue;

				data.target = material;
				intersections.push(data);
			}
		}

		return intersections;
	}
}

class Line {
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
			position: this.position.copy().add(this.delta.copy().scale(t1))
		}
	}
}
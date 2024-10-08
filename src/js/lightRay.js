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

	computeSections(_materials, _preRefractiveIndex = 1.0) {
		let intersections = this.#getPrimaryIntersections(_materials);
		intersections = intersections.filter(int => int.t1 > 0.0001);
		intersections.sort((a, b) => a.t1 > b.t1);

		let sections = [this.position.copy()];

		if (intersections.length)
		{
			sections.push(intersections[0].position);
			let curRefIndex = intersections[0].material.refractiveIndex;
			let normalAngle = intersections[0].normal.angle;
			let inAngle = this.direction.angle - Math.PI;
			let dAngleIn = Math.abs(normalAngle - inAngle);
			while (dAngleIn > .5 * Math.PI) dAngleIn -= .5 * Math.PI;
			
			let dAngleOut = Math.asin(Math.sin(dAngleIn) * _preRefractiveIndex / curRefIndex);

			let outAngle = normalAngle + Math.PI - dAngleOut;
			console.log(dAngleIn / Math.PI * 180, normalAngle / Math.PI * 180, dAngleOut/Math.PI * 180)


			let newRay = new LightRay({
				position: intersections[0].position, 
				direction: new Vector(1, 1).setAngle(outAngle)
			});

			let newSections = newRay.computeSections(_materials, curRefIndex);
			sections = sections.concat(newSections);


		} else sections.push(this.position.copy().add(this.direction.copy().scale(100)));

		return sections;
	}

	#getPrimaryIntersections(_materials) {
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
				data.normal = line.delta.perpendicular;
				if (line.delta.perpendicular.getProjection(ownLine.position).angle - line.delta.perpendicular.angle === 0) data.normal = line.delta.perpendicular.copy().scale(-1);


				data.material = material;
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
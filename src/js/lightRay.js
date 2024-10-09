import Vector from './vector.js';
import Line from './line.js';


window.Vector = Vector;
export default class LightRay {
	position = new Vector(5, 5);
	direction = new Vector(1, 1);
	wavelength = 500;
	color = '#ccc';


	constructor({position, direction, wavelength, color}) {
		this.direction = direction.setLength(1);
		this.position = position;
		this.wavelength = wavelength;
		this.color = color || this.color;
	}

	computeSections(_materials, _prevMaterial) {
		const minorTDiff = .0001;

		let intersections = this.#getPrimaryIntersections(_materials);
		intersections = intersections.filter(int => int.t1 > 0.0001);
		intersections.sort((a, b) => a.t1 > b.t1);

		let sections = [{
			pos: this.position.copy(),
			color: this.color,
		}];

		if (intersections.length)
		{	
			let curMaterial = intersections[0].material;
			let preContactPos = intersections[0].probeLine.getPositionByT(intersections[0].t1 - minorTDiff);
			let postContactPos = intersections[0].probeLine.getPositionByT(intersections[0].t1 + minorTDiff);
			let preMat = App.getMaterialByPosition(preContactPos);
			let postMat = App.getMaterialByPosition(postContactPos)


			let baseRefIndex = 1;
			// if (intersections[0].position.y > _materials[0].position.y + 1) baseRefIndex = 1.5;

			let prevRefIndex = preMat ? preMat.refractiveIndex : baseRefIndex;
			let curRefIndex = postMat ? postMat.refractiveIndex : baseRefIndex;

			sections.push({
				pos: intersections[0].position,
				color: this.color
			});
			this.color = postMat.color || this.color;

			// App.renderer.drawVector(intersections[0].position, intersections[0].normal, '#0f0');
			let normalAngle = intersections[0].normal.angle;
			let inAngle = this.direction.angle - Math.PI;
			let dAngleIn = (normalAngle - inAngle) % (Math.PI * 2);


			let dAngleOut = Math.asin(Math.sin(dAngleIn) * prevRefIndex / curRefIndex);
			let outNormal = normalAngle + Math.PI; 
			if (isNaN(dAngleOut) || curMaterial.reflectAll) // Reflected: Total internal reflection
			{
				dAngleOut = -dAngleIn;
				outNormal = normalAngle
			}

			// console.log(dAngleIn/Math.PI*180,dAngleOut / Math.PI*180, 'n1', prevRefIndex, 'n2', curRefIndex, preMat, postMat, preContactPos, intersections[0].position, postContactPos);
			let outAngle = outNormal - dAngleOut;
			let newRay = new LightRay({
				position: intersections[0].position, 
				direction: new Vector(1, 1).setAngle(outAngle),
				color: this.color
			});

			let newSections = newRay.computeSections(_materials, intersections[0].material);
			sections = sections.concat(newSections);
		} else sections.push({
			pos: this.position.copy().add(this.direction.copy().scale(100)),
			color: this.color,
		});

		return sections;
	}

	#getPrimaryIntersections(_materials) {
		let ownLine = new Line({position: this.position, delta: this.direction.copy().scale(1000)});

		let intersections = [];

		for (let material of _materials)
		{
			let curIntersects = material.shape.getIntersections(ownLine);
			intersections = intersections.concat(curIntersects);
		}

		return intersections;

	}
}

import Vector from './vector.js';
import Line from './line.js';


window.Vector = Vector;
export default class LightRay {
	position = new Vector(5, 5);
	direction = new Vector(1, 1);
	wavelength = 500;
	markerColor = '#333';


	constructor({position, direction, wavelength, markerColor}) {
		this.direction = direction;
		this.position = position;
		this.wavelength = wavelength;
		this.markerColor = markerColor || this.markerColor;
	}

	computeSections(_materials, _prevMaterial) {
		const minorTDiff = .0001;

		let intersections = this.#getPrimaryIntersections(_materials);
		intersections = intersections.filter(int => int.t1 > minorTDiff);
		intersections.sort((a, b) => a.t1 > b.t1);

		let sections = [this.position.copy()];

		if (intersections.length)
		{
			sections.push(intersections[0].position);
			
			let curMaterial = intersections[0].material;
			let preContactPos = intersections[0].probeLine.getPositionByT(intersections[0].t1 - minorTDiff);
			let postContactPos = intersections[0].probeLine.getPositionByT(intersections[0].t1 + minorTDiff);
			let preMat = App.getMaterialByPosition(preContactPos);
			let postMat = App.getMaterialByPosition(postContactPos)
			let prevRefIndex = preMat ? preMat.refractiveIndex : 1.0;
			let curRefIndex = postMat ? postMat.refractiveIndex : 1.0;	

			App.renderer.drawVector(intersections[0].position, intersections[0].normal, '#0f0');
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

			console.log(dAngleIn/Math.PI*180,dAngleOut / Math.PI*180, prevRefIndex, curRefIndex)
			let outAngle = outNormal - dAngleOut;
			let newRay = new LightRay({
				position: intersections[0].position, 
				direction: new Vector(1, 1).setAngle(outAngle)
			});

			let newSections = newRay.computeSections(_materials, intersections[0].material);
			sections = sections.concat(newSections);


		} else sections.push(this.position.copy().add(this.direction.copy().scale(100)));

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

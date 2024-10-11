import LightRay from './lightRay.js';
import Vector from './vector.js';


export class BeamLight {
	#rays = [];
	constructor({position, direction, beamWidth = 1, rayCount = 20}) {
		for (let i = 0; i < rayCount; i++)	
		{
			let curPos = position.copy().add(direction.perpendicular.setLength(beamWidth / 2 + beamWidth * i / rayCount));

			this.#rays.push(new LightRay({
				position: curPos,
				direction: direction,
			}));	
		}
	}

	getRays() {
		return this.#rays;
	}
}



export class SunLight {
	#rays = [];
	constructor({position, rayCount = 20, minAngle = 0, maxAngle = Math.PI * 2}) {

		for (let a = minAngle; a <= maxAngle; a += (maxAngle - minAngle) / rayCount)
		{
			this.#rays.push(new LightRay({
				position: position,
				direction: new Vector(1, 0).setAngle(a),
			}));	

		}
	}

	getRays() {
		return this.#rays;
	}
}

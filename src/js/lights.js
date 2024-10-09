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

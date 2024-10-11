import Vector from './vector.js';
import Material from './material.js';
import { BoxShape, CircleShape, LenticuleShape, InverseLenticuleShape, Shape } from './shape.js';

class Composite {
	getMaterials() {
		return []
	}
	generate() {
		let mats = this.getMaterials();
		for (let m of mats) m.compositeParent = this;
		return mats;
	}
}

export class LenticuleComposite extends Composite {
	#position;
	#refractiveIndex;
	#radius;
	#height;
	setPosition(_pos) {
		this.#position = _pos;
	} 

	constructor({position, refractiveIndex, radius, height}) {
		super(...arguments);
		this.#position = position;
		this.#refractiveIndex = refractiveIndex;
		this.#radius = radius;
		this.#height = height;
	}


	getMaterials() {
		const reflectiveThickness = .1;
		return [
			new Material({
				refractiveIndex: this.#refractiveIndex,
				position: new Vector(this.#position.x + this.#radius, this.#position.y + this.#radius),
				shape: new LenticuleShape({radius: this.#radius, height: this.#height, segments: 1000})
			}),
			new Material({
				color: '#f00',
				position: new Vector(this.#position.x, this.#position.y + this.#height),
				shape: new BoxShape({width: this.#radius, height: reflectiveThickness})
			}),
			new Material({
				color: '#0f0',
				position: new Vector(this.#position.x + this.#radius, this.#position.y + this.#height),
				shape: new BoxShape({width: this.#radius, height: reflectiveThickness})
			})
		];
	}
}

export class LenticuleCompositeWithCover extends LenticuleComposite {
	#position;
	#refractiveIndex;
	#radius;
	#height;
	#coverHeight;
	#coverRefractiveIndex;
	setPosition(_pos) {
		this.#position = _pos;
		super.setPosition(new Vector(_pos.x, _pos.y + this.#coverHeight));
	} 

	constructor({position, refractiveIndex, coverRefractiveIndex, radius, height, coverHeight}) {
		super({
			position: new Vector(position.x, position.y + coverHeight),
			refractiveIndex: refractiveIndex,
			radius: radius,
			height: height,
		});
		this.#position = position;
		this.#radius = radius;

		this.#coverRefractiveIndex = coverRefractiveIndex;
		this.#coverHeight = coverHeight;
	}
	getMaterials() {
		let preMats = super.getMaterials();
		return [
			...preMats,
			new Material({
				refractiveIndex: this.#coverRefractiveIndex,
				position: new Vector(this.#position.x + this.#radius, this.#position.y),
				shape: new InverseLenticuleShape({radius: this.#radius, height: this.#radius + this.#coverHeight, segments: 1000})
			})
		]
	}
}

		

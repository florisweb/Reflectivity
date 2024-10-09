import Vector from './vector.js';


export default class Material {
	shape;
	refractiveIndex = 1;
	reflectAll = false;
	position = new Vector(5, 5);

	constructor({position, shape, refractiveIndex, reflectAll = false}) {
		this.shape = shape;
		this.position = position;
		this.reflectAll = reflectAll;
		this.refractiveIndex = reflectAll ? this.refractiveIndex : refractiveIndex || this.refractiveIndex;
	}
}
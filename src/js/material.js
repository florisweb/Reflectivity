import Vector from './vector.js';


export default class Object {
	shape;
	refractiveIndex = 1;

	position = new Vector(5, 5);

	constructor({position, shape, refractiveIndex}) {
		this.shape = shape;
		this.position = position;
		this.refractiveIndex = refractiveIndex || this.refractiveIndex;
	}
}
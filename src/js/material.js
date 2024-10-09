import Vector from './vector.js';


export default class Material {
	shape;
	reflectAll = false;
	position = new Vector(5, 5);

	refractiveIndex = 1;
	color;

	constructor({position, shape, refractiveIndex, reflectAll = false, color}) {
		this.shape = shape;
		this.shape.setMaterial(this);
		this.position = position;
		this.reflectAll = reflectAll;

		if (color)
		{
			this.color = color;
			this.reflectAll = true;
		}
		this.refractiveIndex = this.reflectAll ? this.refractiveIndex : refractiveIndex || this.refractiveIndex;
	}
}
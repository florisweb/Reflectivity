import Vector from './vector.js';
import Renderer from './renderer.js';
import Material from './material.js';
import { BoxShape, CircleShape, LenticuleShape, Shape } from './shape.js';
import LightRay from './lightRay.js';

const App = new class {
	materials = [];
	lightRays = [];
	size = new Vector(20, 20);
	renderer = new Renderer(renderCanvas, this);

	getMaterialByPosition(_pos) {
		for (let mat of this.materials)
		{
			if (mat.shape.pointIsInside(_pos)) return mat;
		}
		return false;
	}

	constructor() {
		window.App = this;

		// this.materials.push(new Material({
		// 	refractiveIndex: 1.5,
		// 	position: new Vector(5, 10 + 1),
		// 	shape: new BoxShape({width: 15, height: 1})
		// }));
		

		// this.materials.push(new Material({
		// 	refractiveIndex: 3,
		// 	position: new Vector(5, 12),
		// 	shape: new BoxShape({width: 15, height: 1})
		// }));

		// this.materials.push(new Material({
		// 	refractiveIndex: 3.5,
		// 	position: new Vector(6, 12),
		// 	shape: new CircleShape({radius: 3, startAngle: Math.PI, stopAngle: 2 * Math.PI, segments: 250})
		// }));
		
		this.materials.push(new Material({
			refractiveIndex: 2.5, // 2.5
			position: new Vector(11, 12),
			shape: new LenticuleShape({radius: 1.5, height: 2.3, segments: 250})
		}));
		this.materials.push(new Material({
			refractiveIndex: 2.5, // 2.5
			position: new Vector(11 - 3, 12),
			shape: new LenticuleShape({radius: 1.5, height: 2.3, segments: 250})
		}));
		this.materials.push(new Material({
			refractiveIndex: 2.5, // 2.5
			position: new Vector(11 + 3, 12),
			shape: new LenticuleShape({radius: 1.5, height: 2.3, segments: 250})
		}));

		

		this.materials.push(new Material({
			color: '#f00',
			position: new Vector(1, 10 + 2.8),
			shape: new BoxShape({width: 10, height: 1})
		}));

		this.materials.push(new Material({
			color: '#0f0',
			position: new Vector(11, 10 + 2.8),
			shape: new BoxShape({width: 8, height: 1})
		}));




			// this.lightRays.push(new LightRay({
			// 	position: new Vector(.5, 9),
			// 	direction: new Vector(4.5, 1)
			// }));	

			// this.lightRays.push(new LightRay({
			// 	position: new Vector(15, 9),
			// 	direction: new Vector(-1.5, -1)
			// }));	

		// for (let i = 0; i < 10; i++)	
		// {
		// 	this.lightRays.push(new LightRay({
		// 		position: new Vector(7, 6),
		// 		direction: new Vector(i / 10, 1)
		// 	}));	
		// }

	

		// for (let i = 0; i < 13; i++)	
		// {
		// 	this.lightRays.push(new LightRay({
		// 		position: new Vector(9 + i / 3, 0),
		// 		direction: new Vector(0, 1),
		// 	}));	
		// }


		// for (let i = 0; i < 5; i++)	
		// {
		// 	this.lightRays.push(new LightRay({
		// 		position: new Vector(3 + i / 3, 0),
		// 		direction: new Vector(.6, 1),
		// 	}));	
		// }


		for (let i = 0; i < 5; i++)	
		{
			this.lightRays.push(new LightRay({
				position: new Vector(-8 + i / 3, 0),
				direction: new Vector(1.3, 1),
			}));	
		}


		this.render();
	}
	

	render() {
		this.renderer.render();
		// requestAnimationFrame(() => this.render());
	}
}

export default App;
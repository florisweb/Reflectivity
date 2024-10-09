import Vector from './vector.js';
import Renderer from './renderer.js';
import Material from './material.js';
import { BoxShape, Shape } from './shape.js';
import LightRay from './lightRay.js';

const App = new class {
	materials = [];
	lightRays = [];
	size = new Vector(20, 20);
	renderer = new Renderer(renderCanvas, this);

	constructor() {
		window.App = this;

		this.materials.push(new Material({
			refractiveIndex: 1.5,
			position: new Vector(5, 10 + 1),
			shape: new BoxShape({width: 15, height: 1})
		}));
		

		this.materials.push(new Material({
			refractiveIndex: 3,
			position: new Vector(5, 12),
			shape: new BoxShape({width: 15, height: 1})
		}));

		// this.materials.push(new Material({
		// 	refractiveIndex: 1.5,
		// 	position: new Vector(3, 15),
		// 	shape: new Shape({
		// 		vectors: [
		// 			new Vector(0, 0), 
		// 			new Vector(10, -10),
		// 			new Vector(11, -9),
		// 			new Vector(1, 1)
		// 		]
		// 	})
		// }));
		


			// this.lightRays.push(new LightRay({
			// 	position: new Vector(.5, 9),
			// 	direction: new Vector(4.5, 1)
			// }));	

			// this.lightRays.push(new LightRay({
			// 	position: new Vector(15, 9),
			// 	direction: new Vector(-1.5, -1)
			// }));	

		for (let i = 0; i < 10; i++)	
		{
			this.lightRays.push(new LightRay({
				position: new Vector(2, 6),
				direction: new Vector(1.5 + i / 10, 1)
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
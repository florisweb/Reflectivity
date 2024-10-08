import Vector from './vector.js';
import Renderer from './renderer.js';
import Material from './material.js';
import { BoxShape } from './shape.js';
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
			position: new Vector(5, 10),
			shape: new BoxShape({width: 10, height: 1})
		}));
		this.materials.push(new Material({
			refractiveIndex: 2,
			position: new Vector(5, 10 + 1.5),
			shape: new BoxShape({width: 10, height: 1})
		}));
		
			this.lightRays.push(new LightRay({
				position: new Vector(2, 9),
				direction: new Vector(7, 1)
			}));	

		// for (let i = 0; i < 10; i++)	
		// {
		// 	this.lightRays.push(new LightRay({
		// 		position: new Vector(2, 6),
		// 		direction: new Vector(1.5 + i / 10, 1)
		// 	}));	
		// }


		this.render();
	}
	

	render() {
		this.renderer.render();
		// requestAnimationFrame(() => this.render());
	}
}

export default App;
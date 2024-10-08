import Vector from './vector.js';
import Renderer from './renderer.js';
import Material from './material.js';
import { BoxShape } from './shape.js';

const App = new class {
	materials = [];
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
			position: new Vector(5, 10 + 1),
			shape: new BoxShape({width: 10, height: 1})
		}));
		
		this.render();
	}
	
	optimize() {
		Simulation.optimize(1000);
		this.render();
	}	

	render() {
		this.renderer.render();
		requestAnimationFrame(() => this.render());
	}
}

export default App;
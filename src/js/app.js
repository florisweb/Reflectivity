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
		let foundMats = this.materials.filter(mat => mat.shape.pointIsInside(_pos))
		foundMats.sort((a, b) => a.shape.area > b.shape.area);
		if (foundMats.length) return foundMats[0];
		return false;
	}

	constructor() {
		window.App = this;

		const lenticuleHeight = 2.5;
		const lenticuleRadius = 1.5;
		const refractiveIndex = 2.2;
		const minMargin = 0;
		
		const lenticules = 5;
		const reflectiveThickness = .1;


		// this.materials.push(new Material({
		// 	refractiveIndex: 1.5,
		// 	position: new Vector(this.size.x / 2 - lenticules * lenticuleRadius, 21.1),
		// 	shape: new BoxShape({width: lenticules * lenticuleRadius * 2, height: 1})
		// }));


		for (let i = 0; i < lenticules; i++)
		{
			let x = this.size.x / 2 + i * lenticuleRadius * 2 - lenticules * lenticuleRadius + lenticuleRadius;
			let y = this.size.y - lenticuleHeight + lenticuleRadius - reflectiveThickness - 1;

			this.materials.push(new Material({
				refractiveIndex: refractiveIndex, // 2.5 
				position: new Vector(x, y),
				shape: new LenticuleShape({radius: lenticuleRadius, height: lenticuleHeight, segments: 2000})
			}));

				this.materials.push(new Material({
					color: '#f00',
					position: new Vector(x - lenticuleRadius, y - lenticuleRadius + lenticuleHeight - minMargin),
					shape: new BoxShape({width: lenticuleRadius, height: reflectiveThickness})
				}));
				this.materials.push(new Material({
					color: '#0f0',
					position: new Vector(x, y - lenticuleRadius + lenticuleHeight - minMargin),
					shape: new BoxShape({width: lenticuleRadius, height: reflectiveThickness})
				}));
		}
		
		
		// WATER DROPLET
		// this.materials.push(new Material({
		// 	refractiveIndex: 1.33, // 2.5 
		// 	position: new Vector(10, 20),
		// 	shape: new CircleShape({radius: .4, segments: 2000})
		// }));


		// NORMAL LIGHTNING
		const rayCount = 50;
		const target = new Vector(10, 25);
		const sideMargin = 0;
		const stepSize = (this.size.x + 2 * sideMargin) / rayCount;
		for (let x = -sideMargin; x <= this.size.x + sideMargin; x += stepSize)	
		{
			let delta = new Vector(x, 0).difference(target)
			this.lightRays.push(new LightRay({
				position: new Vector(x, 0),
				direction: delta,
				// color: '#fff'
			}));	
		}

		// let x = this.size.x + sideMargin;
		// let delta = new Vector(x, 0).difference(target)
		// this.lightRays.push(new LightRay({
		// 		position: new Vector(x, 0),
		// 		direction: delta,
		// 		// color: '#fff'
		// 	}));	

		// const widthDomain = 1.3;
		// for (let x = -widthDomain; x <= widthDomain; x += widthDomain * 2 / rayCount)	
		// {
		// 	this.lightRays.push(new LightRay({
		// 		position: new Vector(this.size.x / 2 + x, 0),
		// 		direction: new Vector(0, 1),
		// 	}));	
		// }







		
		// let baseAngle = -.65;
		// let offset = 0.1;
		// let start = baseAngle - offset;
		// let end = baseAngle + offset;
		// let steps = 5;
		// for (let i = 0; i < steps; i++)	
		// {
		// 	this.lightRays.push(new LightRay({
		// 		position: new Vector(20, 0),
		// 		direction: new Vector(start + (end - start) / (steps - 1) * i, 1),
		// 	}));	
		// }

	


		// ANGLE DEPENDENT COLOR
		// for (let i = 0; i < 5; i++)	
		// {
		// 	this.lightRays.push(new LightRay({
		// 		position: new Vector(7 - 3 + i / 5, 0),
		// 		direction: new Vector(.3, 1),
		// 	}));	
		// }

		// for (let i = 0; i < 5; i++)	
		// {
		// 	this.lightRays.push(new LightRay({
		// 		position: new Vector(10.75 + i / 5, 0),
		// 		direction: new Vector(0, 1),
		// 	}));	
		// }

		// for (let i = 0; i < 5; i++)	
		// {
		// 	this.lightRays.push(new LightRay({
		// 		position: new Vector(14.1 + 3 + i / 5, 0),
		// 		direction: new Vector(-.3, 1),
		// 	}));	
		// }

		// const rayCount = 20;
		// for (let i = 0; i < rayCount; i++)	
		// {
		// 	this.lightRays.push(new LightRay({
		// 		position: new Vector(15.1 + 3 + i / rayCount, 0),
		// 		direction: new Vector(-.5, 1),
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
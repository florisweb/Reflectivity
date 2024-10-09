import Vector from './vector.js';
import Renderer from './renderer.js';
import Material from './material.js';
import { BoxShape, CircleShape, LenticuleShape, InverseLenticuleShape, Shape } from './shape.js';
import LightRay from './lightRay.js';

const App = new class {
	materials = [];
	lightRays = [];
	size = new Vector(15, 15);
	renderer = new Renderer(renderCanvas, this);

	getMaterialByPosition(_pos) {
		let foundMats = this.materials.filter(mat => mat.shape.pointIsInside(_pos))
		foundMats.sort((a, b) => a.shape.area > b.shape.area);
		if (foundMats.length) return foundMats[0];
		return false;
	}

	constructor() {
		window.App = this;

	
		// const lenticuleHeight = 2.5;
		// const lenticuleRadius = 1.5;
		// const refractiveIndex = 2.12;

		const lenticuleHeight = 2.5;
		const lenticuleRadius = 1.5;
		const refractiveIndex = 2.12;
		const minMargin = 0;
		
		const lenticules = 2;
		const reflectiveThickness = .1;


		// this.materials.push(new Material({
		// 	refractiveIndex: 1.5,
		// 	position: new Vector(5, 10),
		// 	shape: new BoxShape({width: 5, height: 5})
		// }));

		// this.materials.push(new Material({
		// 	refractiveIndex: 1.5,
		// 	position: new Vector(this.size.x / 2 - lenticules * lenticuleRadius, 21.1),
		// 	shape: new BoxShape({width: lenticules * lenticuleRadius * 2, height: 1})
		// }));





		// MIDDLE - WITH COVER
		let x = this.size.x / 2 + 1 * lenticuleRadius * 2 - lenticules * lenticuleRadius + lenticuleRadius;
		let y = this.size.y - lenticuleHeight + lenticuleRadius - reflectiveThickness - 6;

		this.materials.push(new Material({
			refractiveIndex: refractiveIndex + .5 * 2.56,
			position: new Vector(x, y),
			shape: new LenticuleShape({radius: lenticuleRadius, height: lenticuleHeight, segments: 2000})
		}));
		this.materials.push(new Material({
			refractiveIndex: 1.5,
			position: new Vector(x, y - lenticuleHeight),
			shape: new InverseLenticuleShape({radius: lenticuleRadius, height: lenticuleHeight, segments: 2000})
		}));



		// LEFT - NORMAL: WITHOUT COVER
		x = this.size.x / 2 + 0 * lenticuleRadius * 2 - lenticules * lenticuleRadius + lenticuleRadius;

		this.materials.push(new Material({
			refractiveIndex: refractiveIndex,
			position: new Vector(x, y),
			shape: new LenticuleShape({radius: lenticuleRadius, height: lenticuleHeight, segments: 2000})
		}));
		

		for (let i = 0; i < lenticules; i++)
		{
			let x = this.size.x / 2 + i * lenticuleRadius * 2 - lenticules * lenticuleRadius + lenticuleRadius;
			let y = this.size.y - lenticuleHeight + lenticuleRadius - reflectiveThickness - 6;

			// this.materials.push(new Material({
			// 	refractiveIndex: 1,
			// 	position: new Vector(x, y - lenticuleHeight),
			// 	shape: new InverseLenticuleShape({radius: lenticuleRadius, height: lenticuleHeight, segments: 2000})
			// }));

			// this.materials.push(new Material({
			// 	refractiveIndex: refractiveIndex,
			// 	position: new Vector(x, y),
			// 	shape: new LenticuleShape({radius: lenticuleRadius, height: lenticuleHeight, segments: 2000})
			// }));

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
		// const rayCount = 50;
		// const target = new Vector(8, 13);
		// const sideMargin = 10;
		// const stepSize = (this.size.x + 2 * sideMargin) / rayCount;
		// for (let x = -sideMargin; x <= this.size.x + sideMargin; x += stepSize)	
		// {
		// 	let delta = new Vector(x, 0).difference(target)
		// 	this.lightRays.push(new LightRay({
		// 		position: new Vector(x, 0),
		// 		direction: delta,
		// 		// color: '#fff'
		// 	}));	
		// }

		// let x = this.size.x + sideMargin;
		// let delta = new Vector(x, 0).difference(target)
		// this.lightRays.push(new LightRay({
		// 	position: new Vector(x, 0),
		// 	direction: delta,
		// 	// color: '#fff'
		// }));	

		// let x = -2;
		// let delta = new Vector(x, 0).difference(target)
		// this.lightRays.push(new LightRay({
		// 	position: new Vector(x, 0),
		// 	direction: delta,
		// 	// color: '#fff'
		// }));	


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
		const rayCount = 20;
		const beamWidth = 1.8;
		for (let i = 0; i < rayCount; i++)	
		{
			this.lightRays.push(new LightRay({
				position: new Vector(7.5 + lenticuleRadius - lenticuleRadius * 2 - beamWidth / 2 + beamWidth * i / rayCount, 0),
				direction: new Vector(.3, 1),
			}));	
		}


		for (let i = 0; i < rayCount; i++)	
		{
			this.lightRays.push(new LightRay({
				position: new Vector(7.5 + lenticuleRadius + lenticuleRadius * 2 - beamWidth / 2 + beamWidth * i / rayCount, 0),
				direction: new Vector(-.3, 1),
			}));	
		}


		for (let i = 0; i < rayCount; i++)	
		{
			this.lightRays.push(new LightRay({
				position: new Vector(7.5 + lenticuleRadius - lenticuleRadius * 4 - beamWidth / 2 + beamWidth * i / rayCount, 0),
				direction: new Vector(.3, 1),
			}));	
		}


		for (let i = 0; i < rayCount; i++)	
		{
			this.lightRays.push(new LightRay({
				position: new Vector(7.5 + lenticuleRadius  - beamWidth / 2 + beamWidth * i / rayCount, 0),
				direction: new Vector(-.3, 1),
			}));	
		}

	



	


		this.render();
	}
	

	render() {
		let start = new Date();
		this.renderer.render();
		console.log('dt', new Date() - start);
		// requestAnimationFrame(() => this.render());
	}
}

export default App;
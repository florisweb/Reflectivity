import Vector from './vector.js';
let App;
export default class Renderer {
	Canvas;
	ctx;
	#curWorld;

	constructor(_canvas, _app) {
		App = _app;
		this.Canvas = _canvas;
		this.ctx = this.Canvas.getContext('2d');
		this.camera = new Camera(this);
	}


	render() {
		this.ctx.clearRect(0, 0, this.Canvas.width, this.Canvas.height);
		for (let material of App.materials)
		{
			this.#renderMaterial(material);
		}

		for (let lightRay of App.lightRays)
		{
			this.#renderLightRay(lightRay);
		}
	}


	#renderMaterial(_material) {
		let startPos = this.camera.worldToPxCoord(_material.shape.vectors[0].copy().add(_material.position));
		this.ctx.strokeStyle = '#333';

		if (_material.color)
		{
			this.ctx.fillStyle = _material.color;
		} else this.ctx.fillStyle = `rgb(${255 - (_material.refractiveIndex - 1) * 50}, 255, 255)`;

		this.ctx.beginPath()
		this.ctx.moveTo(startPos.value[0], startPos.value[1]);
		for (let i = 1; i < _material.shape.vectors.length; i++)
		{
			let pos = this.camera.worldToPxCoord(_material.shape.vectors[i].copy().add(_material.position));
			this.ctx.lineTo(pos.value[0], pos.value[1]);
		}
		this.ctx.lineTo(startPos.value[0], startPos.value[1]);
		this.ctx.closePath();
		this.ctx.stroke();
		this.ctx.fill();
	}

	#renderLightRay(_ray) {
		let sections = _ray.computeSections(App.materials);

		for (let i = 1; i < sections.length; i++)
		{
			this.#drawLine(sections[i - 1].pos, sections[i].pos, sections[i].color);
		}
	}

	drawVector(_posA, _delta, _color) {
		let posB = _posA.copy().add(_delta);
		return this.#drawLine(_posA, posB, _color);
	}

	drawLine() {
		return this.#drawLine(...arguments);
	}
	#drawLine(_posA, _posB, _color) {
		let posA = this.camera.worldToPxCoord(_posA);
		let posB = this.camera.worldToPxCoord(_posB);
	
		this.ctx.strokeStyle = _color;
		this.ctx.beginPath()
		this.ctx.moveTo(posA.value[0], posA.value[1]);
		this.ctx.lineTo(posB.value[0], posB.value[1]);
		this.ctx.closePath();
		this.ctx.stroke();
	}
}	


class Camera {
	#PxToWorld;
	#WorldToPx;
	constructor(_renderer) {
		const superResolution = 3;
		window.onresize = () => {
			_renderer.Canvas.width = _renderer.Canvas.offsetWidth * superResolution;
			_renderer.Canvas.height = _renderer.Canvas.offsetHeight * superResolution;

			this.#PxToWorld = _renderer.Canvas.width / App.size.x;
			this.#WorldToPx = 1 / this.#PxToWorld;
			App.size.y = this.#WorldToPx * _renderer.Canvas.height;
		}
		window.onresize();

	} 

	getPxToWorldScalar() {
		return this.#PxToWorld;
	}


	worldToPxCoord(_coord) {
		return _coord.copy().scale(this.#PxToWorld);
	}
	pxToWorldCoord(_coord) {
		return _coord.copy().scale(this.#WorldToPx);
	}
}

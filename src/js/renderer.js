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
			this.#drawLine(lightRay.position, lightRay.direction.copy().scale(50), '#f00');
		}
	}


	#renderMaterial(_material) {
		let startPos = this.camera.worldToPxCoord(_material.shape.vectors[0].copy().add(_material.position));
		this.ctx.strokeStyle = '#333';
		this.ctx.fillStyle = `rgb(${255 - (_material.refractiveIndex - 1) * 50}, 255, 255)`;

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
		window.onresize = () => {
			_renderer.Canvas.width = _renderer.Canvas.offsetWidth;
			_renderer.Canvas.height = _renderer.Canvas.offsetHeight;

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

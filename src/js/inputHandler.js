import Vector from './vector.js';

let Canvas;
let App;
export default class InputHandler {
	curStingStartNode;
	get drawingLine() {
		return !!this.curStingStartNode;
	}


	curMousePos = new Vector(0, 0);
	curHoverMaterial;


	constructor(_canvas, _app) {
		Canvas = _canvas;
		App = _app;

		Canvas.addEventListener('mousedown', (_e) => {
			let pxPos = this.#eventToPxCoord(_e);
			let curMousePos = App.renderer.camera.pxToWorldCoord(pxPos);
		});

		window.addEventListener('mouseup', (_e) => {
			let pxPos = this.#eventToPxCoord(_e);
			let curMousePos = App.renderer.camera.pxToWorldCoord(pxPos);
		});

		Canvas.addEventListener('mousemove', (_e) => {
			let pxPos = this.#eventToPxCoord(_e);
			this.curMousePos = App.renderer.camera.pxToWorldCoord(pxPos);
			this.curHoverMaterial = App.getMaterialByPosition(this.curMousePos);
		});
	}



	#eventToPxCoord(_e) {
		return new Vector(
			_e.offsetX / Canvas.offsetWidth * Canvas.width,
			_e.offsetY / Canvas.offsetHeight * Canvas.height
		);
	}
}


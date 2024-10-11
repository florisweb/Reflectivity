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
	curDragSet = {
		startTime: new Date(),
		dragging: false
	};

	snapSize = .2;

	constructor(_canvas, _app) {
		Canvas = _canvas;
		App = _app;

		Canvas.addEventListener('mousedown', (_e) => {
			let pxPos = this.#eventToPxCoord(_e);
			let curMousePos = App.renderer.camera.pxToWorldCoord(pxPos);

			let curMat = App.getMaterialByPosition(curMousePos);
			if (this.curDragSet.dragging || !curMat) return;
			this.curDragSet.startTime = new Date();
			this.curDragSet.material = curMat;
			this.curDragSet.mouseStartPos = curMousePos;
			this.curDragSet.materialStartPos = curMat.position.copy();
			this.curDragSet.dragging = true;
			App.reCalcRequired();
		});

		window.addEventListener('mouseup', (_e) => {
			let pxPos = this.#eventToPxCoord(_e);
			let curMousePos = App.renderer.camera.pxToWorldCoord(pxPos);

			if (!this.curDragSet.dragging) return;

			if (new Date() - this.curDragSet.startTime < 300)
			{
				console.warn('click', this.curDragSet.material);
				
			} else {
				let delta = this.curDragSet.mouseStartPos.difference(curMousePos);
				let newPos = this.curDragSet.materialStartPos.copy().add(delta);
				newPos.x = Math.round(newPos.x / this.snapSize) * this.snapSize;
				newPos.y = Math.round(newPos.y / this.snapSize) * this.snapSize;
				this.curDragSet.material.position = newPos;
				// App.reCalcPaths();
			}
			this.curDragSet.material = false;
			this.curDragSet.dragging = false;
		});

		Canvas.addEventListener('mousemove', (_e) => {
			let pxPos = this.#eventToPxCoord(_e);
			this.curMousePos = App.renderer.camera.pxToWorldCoord(pxPos);
			this.curHoverMaterial = App.getMaterialByPosition(this.curMousePos);

			if (!this.curDragSet.dragging) return;

			let delta = this.curDragSet.mouseStartPos.difference(this.curMousePos);
			let newPos = this.curDragSet.materialStartPos.copy().add(delta);
			newPos.x = Math.round(newPos.x / this.snapSize) * this.snapSize;
			newPos.y = Math.round(newPos.y / this.snapSize) * this.snapSize;
			this.curDragSet.material.position = newPos;
			App.calculateRayPaths();
		});
	}



	#eventToPxCoord(_e) {
		return new Vector(
			_e.offsetX / Canvas.offsetWidth * Canvas.width,
			_e.offsetY / Canvas.offsetHeight * Canvas.height
		);
	}
}


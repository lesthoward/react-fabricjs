import { useEffect, useState } from "react";
import {
	makeNormalWalls,
	makeVertices,
	onMouseDown,
	onObjectModified,
	onObjectMoving,
} from "../../helpers/canvasHelper";
import { createCanvas } from "../../helpers/fabricHelper";
import { fabric } from "fabric";
import { useAppDispatch, useAppSelector } from "../../state/hook";
import { setReRender } from "../../state/fabricState/canvasActions";

const Canvas = () => {
	const [canvas, setCanvas] = useState<fabric.Canvas>();
	const dispatch = useAppDispatch();
	const { canvas: canvasState } = useAppSelector((state) => state);
	const { points, selectedWall, reRender } = canvasState;

	const addEventListeners = (points: IPoint[]) => {
		if (!canvas) return;

		canvas.on("mouse:down", (e: fabric.IEvent<Event>) =>
			onMouseDown(e, canvas, dispatch)
		);

		canvas.on("object:moving", (e: fabric.IEvent<Event>) => {
			onObjectMoving(e);
		});

		canvas.on("object:modified", (e) => {
			onObjectModified(e, canvas, points, dispatch);
		});
	};

	const renderCanvasShapes = () => {
		makeNormalWalls(canvas, points);
	};

	useEffect(() => {
		if (canvas && points && reRender) {
			canvas.clear();
			renderCanvasShapes();
			makeVertices(canvas, points);
			dispatch(setReRender(false));
		}
	}, [canvas, points, reRender]);

	useEffect(() => {
		if (canvas) {
			addEventListeners(points);
			dispatch({ type: "SET_CANVAS_REF", payload: canvas });
		}
	}, [canvas]);

	useEffect(() => {
		setCanvas(createCanvas({ width: 500, height: 500 }));
	}, []);

	return (
		<div>
			<h1 className="title">Canvas</h1>
			<canvas id="canvas"></canvas>
		</div>
	);
};

export default Canvas;

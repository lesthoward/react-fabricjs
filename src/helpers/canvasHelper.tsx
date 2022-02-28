import { fabric } from "fabric";
import { Dispatch } from "react";
import { v4 as uuid } from "uuid";
import {
	CanvasActions,
	movePoint,
	setSelectedWall,
} from "../state/fabricState/canvasActions";
import { makeFabricCircle, makeFabricPath } from "./fabricHelper";

export const createStringPath = (options: TStringPath) => {
	const { x1, y1, x2, y2, curveX, curveY } = options;
	return ` M ${x1}, ${y1} Q ${curveX ?? x1}, ${curveY ?? y1}, ${x2}, ${y2}`;
};

export const makePath = (options: TStringPath) => {
	const stringPath = createStringPath(options);
	const name = uuid();
	return makeFabricPath(stringPath, name);
};

export const makeNormalWalls = (
	canvas: fabric.Canvas | undefined,
	points: IPoint[]
) => {
	if (!canvas) return;
	for (let i = 0; i < points.length; i++) {
		if (points[i + 1]) {
			if (points[i].type === "rectWall") {
				canvas.add(
					makePath({
						x1: points[i].x,
						y1: points[i].y,
						x2: points[i + 1].x,
						y2: points[i + 1].y,
					})
				);
			}
		} else {
			if (points[i].type === "rectWall") {
				canvas.add(
					makePath({
						x1: points[points.length - 1].x,
						y1: points[points.length - 1].y,
						x2: points[0].x,
						y2: points[0].y,
					})
				);
			}
		}
	}
};

const clearSelection = (
	canvas: fabric.Canvas,
	dispatch: Dispatch<CanvasActions>
) => {
	if (!canvas) return;
	const canvasObjects = canvas.getObjects("path");

	changeVertexFill({ canvas, fill: "#233d93" });

	for (let canvasObject of canvasObjects) {
		canvasObject.set({ stroke: "#233d93" });
	}

	dispatch(setSelectedWall(null));
};

export const formatPath = (path: IExtendedPath["path"]) => {
	const x1 = path[0][1];
	const y1 = path[0][2];
	const x2 = path[1][3];
	const y2 = path[1][4];
	const curveX = path[1][1];
	const curveY = path[1][2];
	const coords: TCoords = { x1, y1, x2, y2, curveX, curveY };
	return coords;
};

const changeVertexFill = ({
	x1,
	y1,
	x2,
	y2,
	canvas,
	fill,
}: TChangeVertexFill) => {
	// Coords x & y are option to make this function dynamic, so it can be use to reset the vertex fill
	const canvasObjects = canvas.getObjects("vertex");
	for (let object of canvasObjects) {
		if (x1 && y1 && x2 && y2) {
			const vertex = object as fabric.Circle;
			if (vertex.left === x1 && vertex.top === y1) {
				vertex.set({ fill });
			} else if (vertex.left === x2 && vertex.top === y2) {
				vertex.set({ fill });
			}
		} else {
			object.set({ fill });
		}
	}
};

export const onMouseDown = (
	e: fabric.IEvent<Event>,
	canvas: fabric.Canvas,
	dispatch: Dispatch<CanvasActions>
) => {
	if (!canvas) return;
	clearSelection(canvas, dispatch);
	const target = canvas.getActiveObject();
	const clicked: IExtendedPath | null =
		target?.type === "path" ? (target as IExtendedPath) : null;
	if (!target?.type || !clicked) return;
	// Change path stroke color
	clicked.set({ stroke: "#00f2f2" });
	// Change vertices stroke color
	const clickedPath = formatPath(clicked.path);
	changeVertexFill({ canvas, fill: "#fff", ...clickedPath });
	
	dispatch(setSelectedWall(clicked));
	// @ts-ignore
	// console.log(e.target.path)
	// console.log(e.target?.getBoundingRect());
};

const getSimilarWalls = (
	canvas: fabric.Canvas,
	{ x, y }: TCoord
): IExtendedPath[] => {
	const canvasObjects = canvas.getObjects("path") as IExtendedPath[];
	const currentIndex = canvasObjects.findIndex(
		(path) => path.path[0][1] === x && path.path[0][2] === y
	);
	// Select the previous wall to move it along with the current wall when moving the vertex
	const prevIndexPointRef =
		currentIndex === 0 ? canvasObjects.length - 1 : currentIndex - 1;
	const similarWalls = [
		canvasObjects[prevIndexPointRef],
		canvasObjects[currentIndex],
	];
	return similarWalls;
};

export const makeVertices = (canvas: fabric.Canvas, points: IPoint[]) => {
	if (!canvas) return;
	for (let point of points) {
		if (point) {
			const referenceOfWalls = getSimilarWalls(canvas, {
				x: point.x,
				y: point.y,
			});

			const vertex: fabric.Circle = makeFabricCircle({
				left: point.x,
				top: point.y,
				type: "vertex",
				data: {
					referenceOfWalls,
				},
			});

			canvas.add(vertex);
		}
	}
};

export const onObjectMoving = (
	e: fabric.IEvent<Event>
) => {
	const pointer = e.target as fabric.Circle;
	if (!pointer) return;
	if (pointer?.type !== "vertex") return;
	// Change the vertex fill color
	pointer.set({fill: "#fff"});
	const left = pointer.left as number;
	const top = pointer.top as number;
	
	const referenceOfWalls: IExtendedPath[] = pointer.data?.referenceOfWalls;
	referenceOfWalls.forEach((wall, index) => {
		const x1 = wall.path[0][1];
		const y1 = wall.path[0][2];
		const x2 = wall.path[1][3];
		const y2 = wall.path[1][4];
		const xRadius = wall.path[1][1];
		const yRadius = wall.path[1][2];

		if (index === 0) {
			// Before updating the path, we need to get the current values. It going to be used on object modified event
			if (Object.keys(wall.data.prevPath).length === 0) {
				wall.data.prevPath = formatPath(wall.path);
			}
			
			wall.path[1][3] = left;
			wall.path[1][4] = top;
			
			// wall.path[1][1] = left;
			// wall.path[1][2] = top;


			if(x1 === xRadius || wall.data.radius.x) {
				wall.path[1][1] = left;
				wall.data.radius.x = true;
			}
			if (y1 === yRadius || wall.data.radius.y) {
				wall.path[1][2] = top;
				wall.data.radius.y = true;
			}


		} else {
			if (Object.keys(wall.data.prevPath).length === 0) {
				wall.data.prevPath = formatPath(wall.path);
			}

			wall.path[0][1] = left;
			wall.path[0][2] = top;

			wall.path[1][1] = left;
			wall.path[1][2] = top;
			// if(x1 === xRadius) {
			// 	wall.path[1][1] = left;
			// }
			
			// if(y1 === yRadius) {
			// 	wall.path[1][2] = top;

			// }
		}
		// console.log(wall.path[1][1], wall.path[1][2])
	});
};

export const onObjectModified = (
	e: fabric.IEvent<Event>,
	canvas: fabric.Canvas,
	points: IPoint[],
	dispatch: Dispatch<CanvasActions>
) => {
	const pointer = e.target;
	if (!pointer) return;
	if (pointer?.type !== "vertex") return;

	const left = pointer.left as number;
	const top = pointer.top as number;

	const referenceOfWalls: IExtendedPath[] = pointer.data?.referenceOfWalls;
	referenceOfWalls.forEach((wall) => {
		const newCoords: TCoords = {
			x1: wall.path[0][1],
			y1: wall.path[0][2],
			x2: left,
			y2: top,
			curveX: wall.path[1][1],
			curveY: wall.path[1][2],
		};

		const prevCoords: TCoords = wall.data.prevPath;

		if (Object.keys(prevCoords).length) {
			dispatch(movePoint({ prevCoords, newCoords }));
			wall.data.prevPath = {};
		}
	});
};

// export const onObjectModified = (
// 	e: fabric.IEvent<Event>,
// 	canvas: fabric.Canvas,
// 	points: IPoint[],
// 	dispatch: Dispatch<CanvasActions>
// ) => {

// 	const pointer = e.target;
// 	if (!pointer) return;
// 	if (pointer?.type !== "vertex") return;
// 	const left = pointer.left as number;
// 	const top = pointer.top as number;

// 	const referenceOfWalls: IExtendedPath[] = pointer.data?.referenceOfWalls;
// 	referenceOfWalls.forEach((wall, index) => {
// 		// Increase selection area of the path, by default its set to specific value
// 		const { x2, y2 }: TCoords = wall.data.prevPath;

// 		// Get index from original points array
// 		const indexPointRef = points.findIndex(
// 			(point) => point.x === x2 && point.y === y2
// 		);

// 		const path = makePath({
// 			x2: left,
// 			y2: top,
// 			curveX: left,
// 			curveY: top,
// 			x1: wall.path[0][1],
// 			y1: wall.path[0][2],
// 		});

// 		const pathCoords = path.path as unknown as IExtendedPath["path"];
// 		const getCoordsPoints = formatPath(pathCoords);
// 		// dispatch(
// 		// 	replacePoint({
// 		// 		indexPointRef: indexPointRef,
// 		// 		point: {
// 		// 			x: getCoordsPoints.x2,
// 		// 			y: getCoordsPoints.y2,
// 		// 			type: "rectWall",
// 		// 		},
// 		// 	})
// 		// );
// 		// dispatch(setReRender(true));

// 		// canvas.remove(wall)
// 		// pointer.data.referenceOfWalls[0] = path;
// 		// canvas.add(path)
// 		// canvas.moveTo(path, 0);
// 		// } else {
// 		// const { x2, y2 }: TCoords = wall.data.prevPath;
// 		// const indexPointRef = points.findIndex(
// 		// 	(point) => point.x === x2 && point.y === y2
// 		// );
// 		// console.log("🚀 ~ file: canvasHelper.tsx ~ line 256 ~ referenceOfWalls.forEach ~ indexPointRef", indexPointRef)

// 		// const path = makePath({
// 		// 	x1: left,
// 		// 	y1: top,
// 		// 	curveX: left,
// 		// 	curveY: top,
// 		// 	x2: wall.path[1][3],
// 		// 	y2: wall.path[1][4],
// 		// });

// 		// canvas.remove(wall)
// 		// pointer.data.referenceOfWalls[1] = path;
// 		// canvas.add(path)
// 		// canvas.moveTo(path, 0);
// 		// }
// 	});
// };

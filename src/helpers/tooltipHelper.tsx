import { Dispatch } from "react";
import { CanvasActions, removePoint, updatePoint } from "../state/fabricState/canvasActions";

export const removePaths = (
	canvas: fabric.Canvas,
	points: IPoint[],
	selectedWall: IExtendedPath,
	dispatch: Dispatch<CanvasActions>
) => {
	if (points.length <= 3) return;
	const canvasObjects = canvas.getObjects();
	canvas.remove(...canvasObjects);
	const canvasVertices = canvas.getObjects("vertex");

	// Get the point reference from points state based on selected wall coords
	const pointRef: TPoint = {
		x: selectedWall.path[0][1],
		y: selectedWall.path[0][2],
	};

	// Remove the vertex of the selected wall
	for (let vertex of canvasVertices) {
		if (vertex.left === pointRef.x && vertex.top === pointRef.y) {
			canvas.remove(vertex);
		}
	}

    dispatch(removePoint(pointRef));
};

const getMidPoint = (coords: TCoords) => {
    const { x1, y1, x2, y2 } = coords;
    const axisX = (x1 + x2) / 2;
    const axiSY = (y1 + y2) / 2;
    return { x: axisX, y: axiSY };
}

export const addPoint = (
    canvas: fabric.Canvas,
	points: IPoint[],
	selectedWall: IExtendedPath,
	dispatch: Dispatch<CanvasActions>
) => {
    canvas.remove( ...canvas.getObjects() )

    // Selected wall coords
    const coords = {
        x1: selectedWall.path[0][1],
        y1: selectedWall.path[0][2],
        x2: selectedWall.path[1][3],
        y2: selectedWall.path[1][4],
    }
    // Get index of selected wall
    const indexPoint = points.findIndex(point => point.x === coords.x1 && point.y === coords.y1);
    // Find the midpoint of the selected wall
    const newCoords = getMidPoint(coords)
    const newPoint:IPoint = { ...newCoords, type: "rectWall" }
    dispatch(updatePoint({ indexPointRef: indexPoint, point: newPoint }))
};

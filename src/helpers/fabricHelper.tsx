import { fabric } from "fabric";
import { ICanvasOptions, ICircleOptions } from "fabric/fabric-impl";

const canvasDefaultOptions: ICanvasOptions = {
    preserveObjectStacking: true,
    perPixelTargetFind: true,
    targetFindTolerance: 10,
}

export const createCanvas = ({ width, height }: TCanvas) =>
	new fabric.Canvas("canvas", {
		width,
		height,	
        ...canvasDefaultOptions
	});

const fabricPathDefaults: fabric.IPathOptions = {
	stroke: "#233d93",
	strokeWidth: 6,
	fill: "",
	backgroundColor: "transparent",
	// More...
	lockMovementX: true,
	lockMovementY: true,
	lockScalingX: true,
	lockScalingY: true,
	lockScalingFlip: true,
	lockRotation: true,
	lockSkewingX: true,
	lockSkewingY: true,
	lockUniScaling: true,
	hoverCursor: "grab",
	hasBorders: false,
	hasControls: false,
	objectCaching: false,
    originX: 'left',
    originY: 'center',
	padding:50,
	absolutePositioned: true,
	dirty: true,
	paintFirst: "fill",
    type: "path",
	data: {
		prevPath: {},
		radius: {
			x: false,
			y: false
		}
	}
    
};

export const makeFabricPath = (stringPath: string, name: string) => {
	const path = new fabric.Path(stringPath, {
		...fabricPathDefaults,
		name,
	});

	return path
};

const fabricCircleDefaults: Omit<ICircleOptions, "left" | "top"> = {
	fill: "#233d93",
    stroke: '#233d93',
    strokeWidth: 4,
    radius: 8,
    originX: "center",
    originY: "center",
    hasBorders: false,
    hasControls: false,
    type: "circle",
};

export const makeFabricCircle = (options: TMakeFabricCircle) => {
	const circle = new fabric.Circle({
		...fabricCircleDefaults,
		...options
	});

	return circle;
};

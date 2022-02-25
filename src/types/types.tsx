interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
    fabric_primary_color: string;
    fabric_secondary_color: string;
}

interface IPoint extends Pick<fabric.Point, 'x' | 'y'> {
    x: number;
    y: number;
    type: 'rectWall' | 'curvedWall',
    curveX?: number;
    curveY?: number;
    nameRef?: string | undefined;
}

type TPoint = Pick<IPoint, 'x' | 'y'> ;

type TCanvas = {
    width: number;
    height: number;
}

type TStringPath = {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    curveX?: number;
    curveY?: number;
}

interface IExtendedPath extends Omit<fabric.Path, 'path'> {
    path: [
        [ string,  number, number ],
        [ string,  number, number, number, number ],
    ]
}

type TMakeFabricCircle = Pick<fabric.Circle, 'radius' | 'data' | 'type'> & {
    left: number;
    top: number;
    type?: string;
    radius?: number;
    data?: any
}

type TCoords = {
	x1: number;
	y1: number;
	x2: number;
	y2: number;
    curveX?: number;
    curveY?: number;
};

type TCoord = {
    x: number;
    y: number;
}

type TChangeVertexFill = Partial<TCoords> & {
	canvas: fabric.Canvas;
	fill: string;
};

interface IMovePoint {
    prevCoords: TCoords;
    newCoords: TCoords;
}

type TIndexPoint = {
    indexPointRef: number;
    point: IPoint;
}
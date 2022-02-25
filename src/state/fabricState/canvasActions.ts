interface REMOVE_POINT {
    type: 'REMOVE_POINT';
    payload: TPoint;
}

interface SET_SELECTED_WALL {
    type: 'SET_SELECTED_WALL';
    payload: IExtendedPath | null;
}

interface SET_CANVAS_REF {
    type: 'SET_CANVAS_REF';
    payload: fabric.Canvas | null;
}

interface UPDATE_POINT {
    type: 'UPDATE_POINT';
    payload: TIndexPoint
}

interface RERENDER {
    type: 'RERENDER';
    payload: boolean;
}

interface REPLACE_POINT {
    type: 'REPLACE_POINT';
    payload: TIndexPoint;
}

interface GET_POINTS {
    type: 'GET_POINTS';
}

interface MOVE_POINT {
    type: 'MOVE_POINT';
    payload: IMovePoint
}

export type CanvasActions = GET_POINTS | REMOVE_POINT | UPDATE_POINT | REPLACE_POINT | MOVE_POINT | SET_SELECTED_WALL | SET_CANVAS_REF | RERENDER;

export const removePoint = (points: TPoint): CanvasActions => ({
    type: 'REMOVE_POINT',
    payload: points
})

export const updatePoint = (updatedPoint: TIndexPoint): CanvasActions => {
    return ({
        type: 'UPDATE_POINT',
        payload: updatedPoint
    })
}

export const replacePoint = ({ indexPointRef, point }: TIndexPoint): CanvasActions => ({
    type: 'REPLACE_POINT',
    payload: { indexPointRef, point }
})

export const getPoints = (): CanvasActions => ({
    type: 'GET_POINTS'
})

export const movePoint = (payload: IMovePoint): CanvasActions => ({
    type: 'MOVE_POINT',
    payload
})

export const setSelectedWall = (path: IExtendedPath | null): CanvasActions => ({
    type: 'SET_SELECTED_WALL',
    payload: path
})


export const setCanvasRef = (canvas: fabric.Canvas): CanvasActions => ({
    type: 'SET_CANVAS_REF',
    payload: canvas
})

export const setReRender = (state: boolean): CanvasActions => ({
    type: 'RERENDER',
    payload: state
})


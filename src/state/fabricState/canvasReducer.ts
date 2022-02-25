import { CanvasActions } from './canvasActions'


interface CanvasState {
    points: IPoint[];
    selectedWall: IExtendedPath | null;
    canvasRef: fabric.Canvas | null;
    reRender: boolean;
}

const initialState: CanvasState = {
    points: [
        { x: 100, y: 100,  type: 'rectWall' },
        { x: 400, y: 100, type: 'rectWall' },
        { x: 400, y: 400, type: 'rectWall' },
        { x: 100, y: 400, type: 'rectWall' },
    ],
    selectedWall: null,
    canvasRef: null,
    reRender: true
}

const canvasReducer = (state: CanvasState = initialState, action: CanvasActions): CanvasState => {
    const insertAtIndex = (state: CanvasState, payload: (TIndexPoint & { replaceChild: boolean })) => {
        const { points } = state;
        const pointsRef = [...points];
        const indexReplaceChild = payload.replaceChild ? 0 : 1;
        const methodReplaceChild = payload.replaceChild ? 1 : 0;
        pointsRef.splice(payload.indexPointRef + indexReplaceChild, methodReplaceChild, payload.point)
        return pointsRef
    }

    const gettingMoving = (state: CanvasState, pointRef: IMovePoint): IPoint[] => {
        const { points } = state;
        const { prevCoords, newCoords } = pointRef
        
        // Index is getting the previous point, by example: 3 must to modify the point 3
        const indexPointRef = points.findIndex(point => point.x === prevCoords.x1 && point.y === prevCoords.y1)
        if(indexPointRef === points.length - 1) {
            // Modify on the x & y axis
            const point: IPoint = { x: newCoords.x2, y: newCoords.y2, type: 'rectWall' } as IPoint
            points.splice(0, 1, point)
        } else {
            const point: IPoint = { x: newCoords.x2, y: newCoords.y2, type: 'rectWall' } as IPoint
            points.splice(indexPointRef + 1, 1, point)
        }
        
        return points
    }
    
    switch (action.type) {
        case 'REMOVE_POINT':
            return {
                ...state,
                points: state.points.filter(point => point.x !== action.payload.x || point.y !== action.payload.y)
            }
        case 'SET_SELECTED_WALL':
            return {
                ...state,
                selectedWall: action.payload
            }
        case'SET_CANVAS_REF':
            return {
                ...state,
                canvasRef: action.payload
            }
        case 'UPDATE_POINT':
            return {
                ...state,
                points: insertAtIndex(state, {...action.payload, replaceChild: false})
            }
        case 'RERENDER':
            return {
                ...state,
                reRender: action.payload
            }
        case 'REPLACE_POINT':
            return {
                ...state,
                points: insertAtIndex(state, {...action.payload, replaceChild: true})
            }
        case 'GET_POINTS':
            return {
                ...state,
                points: state.points
            }
        case 'MOVE_POINT':
            return {
                ...state,
                points: gettingMoving(state, action.payload),
                reRender: true
            }
        default:
            return state;
    }
}

export default canvasReducer;
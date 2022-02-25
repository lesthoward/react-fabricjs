import { combineReducers } from 'redux'
import canvasReducer from './fabricState/canvasReducer'

const reducer = combineReducers({
    canvas: canvasReducer
})

export default reducer
import { GET_ERRORS } from '../actions/authActions'
import { CLEAR_ERRORS } from '../actions/postActions'

export default function(state = {}, action){
    switch(action.type){
        case GET_ERRORS:
            return action.payload
        case CLEAR_ERRORS:
            return {}
        default: 
            return state
    }
}
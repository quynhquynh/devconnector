import axios from 'axios'
import setAuthToken from '../utils/setAuthToken'
import jwt_decode from 'jwt-decode'
export const REGISTER = 'REGISTER'
export const GET_ERRORS = 'GET_ERRORS'
export const SET_CURRENT_USER = 'SET_CURRENT_USER'

export const registerUser = (userData, cb) => dispatch => {
  axios
    .post('/api/users/register', userData)
    .then(res => cb())
    .catch(e =>
      dispatch({
        type: GET_ERRORS,
        payload: e.response.data
      })
    )
}

export const loginUser = userData => dispatch => {
  axios
    .post('/api/users/login', userData)
    .then(res => {
      //save to localStorage
      const { token } = res.data
      //set token to localStorage
      localStorage.setItem('jwtToken', token)
      //set token to Auth header

      setAuthToken(token)
      //decode token to get user data
      const decoded = jwt_decode(token)
      //set current user
      dispatch(setCurrentUser(decoded))
    })
    .catch(e =>
      dispatch({
        type: GET_ERRORS,
        payload: e.response.data
      })
    )
}

//set logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  }
}

//Log user out
export const logoutUser = () => dispatch => {
  localStorage.removeItem('jwtToken')
  setAuthToken(false)
  dispatch(setCurrentUser({}))
}

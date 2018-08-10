import axios from "axios"
import { GET_ERRORS, SET_CURRENT_USER } from "./authActions"
export const GET_PROFILE = "GET_PROFILE"
export const PROFILE_LOADING = "PROFILE_LOADING"
export const PROFILE_NOT_FOUND = "PROFILE_NOT_FOUND"
export const CLEAR_CURRENT_PROFILE = "CLEAR_CURRENT_PROFILE"
export const GET_PROFILES = "GET_PROFILES"

export const getCurrentProfile = () => dispatch => {
  dispatch(setProfileLoading())
  axios
    .get("/api/profile")
    .then(res =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      })
    )
    .catch(e =>
      dispatch({
        type: GET_PROFILE,
        payload: {}
      })
    )
}

export const getProfileByHandle = handle => dispatch => {
  dispatch(setProfileLoading())
  axios
    .get(`/api/profile/handle/${handle}`)
    .then(res =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      })
    )
    .catch(e =>
      dispatch({
        type: GET_PROFILE,
        payload: null
      })
    )
}

export const setProfileLoading = () => {
  return {
    type: PROFILE_LOADING
  }
}

export const clearCurrentProfile = () => {
  return {
    type: CLEAR_CURRENT_PROFILE
  }
}

export const createProfile = (profileData, cb) => dispatch => {
  axios
    .post("/api/profile", profileData)
    .then(res => cb())
    .catch(e =>
      dispatch({
        type: GET_ERRORS,
        payload: e.response.data
      })
    )
}

export const addExperience = (expData, cb) => dispatch => {
  axios
    .post("/api/profile/experience", expData)
    .then(res => cb())
    .catch(e =>
      dispatch({
        type: GET_ERRORS,
        payload: e.response.data
      })
    )
}

export const addEducation = (eduData, cb) => dispatch => {
  axios
    .post("/api/profile/education", eduData)
    .then(res => cb())
    .catch(e =>
      dispatch({
        type: GET_ERRORS,
        payload: e.response.data
      })
    )
}

export const deleteExperience = id => dispatch => {
  axios
    .delete(`/api/profile/experience/${id}`)
    .then(res =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      })
    )
    .catch(e =>
      dispatch({
        type: GET_ERRORS,
        payload: e.response.data
      })
    )
}

export const deleteEducation = id => dispatch => {
  axios
    .delete(`/api/profile/education/${id}`)
    .then(res =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      })
    )
    .catch(e =>
      dispatch({
        type: GET_ERRORS,
        payload: e.response.data
      })
    )
}

export const getProfiles = () => dispatch => {
  dispatch(setProfileLoading())
  axios
    .get("/api/profile/all")
    .then(res =>
      dispatch({
        type: GET_PROFILES,
        payload: res.data
      })
    )
    .catch(e =>
      dispatch({
        type: GET_PROFILES,
        payload: null
      })
    )
}

export const deleteAccount = () => dispatch => {
  if (window.confirm("Are you sure? This can NOT be undoned!")) {
    axios
      .delete("/api/profile")
      .then(res =>
        dispatch({
          type: SET_CURRENT_USER,
          payload: {}
        })
      )
      .catch(e =>
        dispatch({
          type: GET_ERRORS,
          payload: e.response.data
        })
      )
  }
}

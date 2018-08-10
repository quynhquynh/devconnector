import axios from 'axios'
import { GET_ERRORS } from './authActions'

export const POST_LOADING = 'POST_LOADING'
export const GET_POSTS = 'GET_POSTS'
export const GET_POST = 'GET_POST'
export const ADD_POST = 'ADD_POST'
export const DELETE_POST = 'DELETE_POST'
export const CLEAR_ERRORS = 'CLEAR_ERRORS'
export const UPDATE_POST = 'UPDATE_POST'

export const addPost = (postData, cb) => dispatch => {
  dispatch(clearErrors())
  axios
    .post('/api/posts', postData)
    .then(res =>
      dispatch({
        type: ADD_POST,
        payload: res.data
      })
    )
    .catch(e => {
      const { text } = e.response.data
      cb(text, ADD_POST)
      dispatch({
        type: GET_ERRORS,
        payload: {
          text,
          type: ADD_POST
        }
      })
    })
}

export const getPosts = () => dispatch => {
  dispatch(setPostLoading())
  axios
    .get('/api/posts')
    .then(res =>
      dispatch({
        type: GET_POSTS,
        payload: res.data
      })
    )
    .catch(e =>
      dispatch({
        type: GET_POSTS,
        payload: null
      })
    )
}

export const getPost = id => dispatch => {
  dispatch(setPostLoading())
  axios
    .get(`/api/posts/${id}`)
    .then(res =>
      dispatch({
        type: GET_POST,
        payload: res.data
      })
    )
    .catch(e =>
      dispatch({
        type: GET_POST,
        payload: null
      })
    )
}

export const updatePost = (postId, updatePost) => dispatch => {
  dispatch(clearErrors())
  axios
    .put(`/api/posts/${postId}`, { text: updatePost })
    .then(res =>
      dispatch({
        type: GET_POSTS,
        payload: res.data
      })
    )
    .catch(e => {
      const { text } = e.response.data
      dispatch({
        type: GET_ERRORS,
        payload: {
          text,
          type: UPDATE_POST,
          postId
        }
      })
    })
}

export const deletePost = id => dispatch => {
  axios
    .delete(`/api/posts/${id}`)
    .then(res =>
      dispatch({
        type: DELETE_POST,
        payload: id
      })
    )
    .catch(e =>
      dispatch({
        type: GET_ERRORS,
        payload: e.response.data
      })
    )
}

export const addLike = id => dispatch => {
  axios
    .post(`/api/posts/like/${id}`)
    .then(res => dispatch(getPosts()))
    .catch(e =>
      dispatch({
        type: GET_ERRORS,
        payload: e.response.data
      })
    )
}

export const removeLike = id => dispatch => {
  axios
    .post(`/api/posts/unlike/${id}`)
    .then(res => dispatch(getPosts()))
    .catch(e =>
      dispatch({
        type: GET_ERRORS,
        payload: e.response.data
      })
    )
}

export const addComment = (postId, cmt) => dispatch => {
  dispatch(clearErrors())
  axios
    .post(`/api/posts/comment/${postId}`, cmt)
    .then(res =>
      dispatch({
        type: GET_POST,
        payload: res.data
      })
    )
    .catch(e =>
      dispatch({
        type: GET_ERRORS,
        payload: {
          text: e.response.data.text,
          type: 'ADD_COMMENT'
        }
      })
    )
}

export const updateComment = (postId, cmtId, updateCmt) => dispatch => {
  dispatch(clearErrors())
  axios
    .put(`/api/posts/comment/${postId}/${cmtId}`, { text: updateCmt })
    .then(res =>
      dispatch({
        type: GET_POST,
        payload: res.data
      })
    )
    .catch(e =>
      dispatch({
        type: GET_ERRORS,
        payload: {
          text: e.response.data.text,
          type: 'UPDATE_COMMENT',
          cmtId
        }
      })
    )
}

export const deleteComment = (postId, cmtId) => dispatch => {
  axios
    .delete(`/api/posts/comment/${postId}/${cmtId}`)
    .then(res =>
      dispatch({
        type: GET_POST,
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

export const setPostLoading = () => {
  return {
    type: POST_LOADING
  }
}

export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  }
}

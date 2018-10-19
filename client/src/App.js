import React, { Component } from 'react'
import './App.css'
import { Provider } from 'react-redux'
import jwt_decode from 'jwt-decode'
import setAuthToken from './utils/setAuthToken'
import { setCurrentUser, logoutUser } from './actions/authActions'
import { clearCurrentProfile } from './actions/profileActions'
import { createStore, applyMiddleware, compose } from 'redux'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Landing from './components/layout/Landing'
import Register from './components/auth/register'
import Dashboard from './components/dashboard/Dashboard'
import Login from './components/auth/login'
import thunk from 'redux-thunk'
import reducers from './reducers'
import PrivateRoute from './components/common/PrivateRoute'
import CreateProfile from './components/create-profile/CreateProfile'
import EditProfile from './components/edit-profile/EditProfile'
import AddExperience from './components/add-credentials/AddExperience'
import AddEducation from './components/add-credentials/AddEducation'
import Profiles from './components/profiles/Profiles'
import Profile from './components/profile/Profile'
import NotFound from './components/not-found/NotFound'
import Posts from './components/posts/Posts'
import Post from './components/post/Post'
import createSagaMiddleware from 'redux-saga'
import { getPostsSaga } from './actions/postActions'

const sagaMiddleware = createSagaMiddleware()

const initialState = {}

const store = createStore(
  reducers,
  initialState,
  compose(
    applyMiddleware(sagaMiddleware, thunk),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
)
sagaMiddleware.run(getPostsSaga)
if (localStorage.jwtToken) {
  //set auth token header auth
  setAuthToken(localStorage.jwtToken)
  //decode token
  const decoded = jwt_decode(localStorage.jwtToken)
  //set current user
  store.dispatch(setCurrentUser(decoded))
  //check token expire
  const currentTime = Date.now() / 1000 // cos in milliseconds
  if (decoded.exp < currentTime) {
    store.dispatch(logoutUser())
    store.dispatch(clearCurrentProfile())
    // clear current profile
    //redirect to login
    window.location.href = '/login'
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <div className="App">
            <Navbar />
            <Switch>
              <Route exact path="/" component={Landing} />
              <div className="container">
                <Route exact path="/register" component={Register} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/profiles" component={Profiles} />
                <Route exact path="/profile/:handle" component={Profile} />
                <PrivateRoute exact path="/dashboard" component={Dashboard} />
                <PrivateRoute
                  exact
                  path="/create-profile"
                  component={CreateProfile}
                />
                <PrivateRoute
                  exact
                  path="/edit-profile"
                  component={EditProfile}
                />
                <PrivateRoute
                  exact
                  path="/add-experience"
                  component={AddExperience}
                />
                <PrivateRoute
                  exact
                  path="/add-education"
                  component={AddEducation}
                />
                <PrivateRoute exact path="/feed" component={Posts} />
                <PrivateRoute exact path="/post/:id" component={Post} />
                <Route exact path="/not-found" component={NotFound} />
              </div>
            </Switch>
            <Footer />
          </div>
        </BrowserRouter>
      </Provider>
    )
  }
}

export default App

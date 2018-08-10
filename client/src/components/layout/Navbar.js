import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { logoutUser } from '../../actions/authActions'
import { clearCurrentProfile } from '../../actions/profileActions'

class Navbar extends React.Component{
    handleLogout = e => {
        e.preventDefault()
        this.props.logoutUser()
        this.props.clearCurrentProfile()
    }

    render(){
        const { isAuthenticated, user } = this.props.auth
        const authLinks = (
            <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                    <a href="" onClick={this.handleLogout} className="nav-link">
                        <img className='rounded-circle' src={user.avatar} alt={user.name} style={{width: '25px', marginRight: '5px'}} title='You must have a Gravatar connected to your email'/>
                        Logout
                    </a>
                </li>
            </ul>
        ) 

        const guestLinks = (
            <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                    <Link className="nav-link" to="/register">Sign Up</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/login">Login</Link>
                </li>
            </ul>
        ) 

        return (
            <nav className="navbar navbar-expand-sm navbar-dark bg-dark mb-4">
                <div className="container">
                <Link className="navbar-brand"to="/feed">Posts Feed</Link>
                <Link className="navbar-brand"to="/dashboard">Dashboard</Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#mobile-nav">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="mobile-nav">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/profiles"> Developers
                            </Link>
                        </li>
                    </ul>
                    {isAuthenticated ? authLinks : guestLinks}
                </div>
                </div>
            </nav>
        )
    }
}


Navbar.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
}

const mapStateToProps = ({auth}) => ({
    auth
})

export default connect(mapStateToProps, { logoutUser, clearCurrentProfile })(Navbar)
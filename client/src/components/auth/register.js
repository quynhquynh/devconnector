import React from 'react'
import PropTypes from 'prop-types'
// import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { registerUser } from '../../actions/authActions'
import TextFieldGroup from '../common/TextFieldGroup'


class Register extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            name: '',
            email: '',
            password: '',
            password2: '',
            errors: {}
        }
    }

    componentDidMount(){
        if(this.props.auth.isAuthenticated){
            this.props.history.push('/dashboard')
        }
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.errors){
            this.setState({errors: nextProps.errors})
        }
    }

    handleChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit = e => {
        e.preventDefault()
        const { errors, ...newUser } = this.state
        
        this.props.registerUser(newUser, () => this.props.history.push('/login'))
        
    }

    render(){
        const { name, email, password, password2, errors } = this.state
        return (
            <div className="register">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 m-auto">
                            <h1 className="display-4 text-center">Sign Up</h1>
                            <p className="lead text-center">Create your DevConnector account</p>
                            <form noValidate onSubmit={this.handleSubmit} action="create-profile.html">
                                <TextFieldGroup
                                    placeholder='Name'
                                    name='name'
                                    value={name}
                                    onChange={this.handleChange}
                                    error={errors.name}
                                />
                                <TextFieldGroup
                                    placeholder='Email Address'
                                    name='email'
                                    type='email'
                                    info='This site uses Gravatar so if you want a profile image, use a Gravatar image'
                                    value={email}
                                    onChange={this.handleChange}
                                    error={errors.email}
                                />
                                <TextFieldGroup
                                    placeholder='Password'
                                    name='password'
                                    type='password'
                                    value={password}
                                    onChange={this.handleChange}
                                    error={errors.password}
                                />
                                <TextFieldGroup
                                    placeholder='Confirm Password'
                                    name='password2'
                                    type='password'
                                    value={password2}
                                    onChange={this.handleChange}
                                    error={errors.password2}
                                />
                                <input type="submit" className="btn btn-info btn-block mt-4" />
                            </form>
                        </div>
                    </div>
                </div>
          </div>
        )
    }
}


Register.propTypes = {
    registerUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
}


const mapStateToProps = ({auth, errors}) => {
    return {
        auth,
        errors
    }
}

export default connect(mapStateToProps, { registerUser })(Register)
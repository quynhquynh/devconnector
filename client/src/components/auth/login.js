import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { loginUser } from '../../actions/authActions'
import TextFieldGroup from '../common/TextFieldGroup'

class Login extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            email: '',
            password: '',
            errors: {}
        }
    }

    componentDidMount(){
        if(this.props.auth.isAuthenticated){
            this.props.history.push('/dashboard')
        }
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.auth.isAuthenticated){
            this.props.history.push('/dashboard')
        }
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
        const { errors, ...user } = this.state
        this.props.loginUser(user)
    }

    render(){
        const { email, password, errors } = this.state
        return (
            <div className="login">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 m-auto">
                        <h1 className="display-4 text-center">Log In</h1>
                        <p className="lead text-center">Sign in to your DevConnector account</p>
                        <form onSubmit={this.handleSubmit}>
                            <TextFieldGroup
                                placeholder='Email Address'
                                name='email'
                                type='email'
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
                            <input type="submit" className="btn btn-info btn-block mt-4" />
                        </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


Login.propTypes = {
    loginUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
}

const mapStateToProps = ({auth, errors}) => ({
    auth,
    errors
})

export default connect(mapStateToProps, { loginUser })(Login)
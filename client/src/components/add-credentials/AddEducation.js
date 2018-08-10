import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import TextFieldGroup from '../common/TextFieldGroup'
import TextAreaFieldGroup from '../common/TextAreaFieldGroup'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { addEducation } from '../../actions/profileActions'

class AddEducation extends Component {
    constructor(props){
        super(props)
        this.state = {
            school: '',
            degree: '',
            fieldOfStudy: '',
            from: '',
            to: '',
            current: false,
            description: '',
            errors: {},
            disabled: false
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

    handleCheck = e => {
        this.setState(prevState => ({
            current: !prevState.current,
            disabled: !prevState.disabled
        }))
    }

    handleSubmit = e => {
        e.preventDefault()
        const { errors, disabled, ...eduData } = this.state
        this.props.addEducation(eduData, () => this.props.history.push('/dashboard'))
    }

    render() {
        const { school, degree, fieldOfStudy, from, to, current, description, errors, disabled } = this.state
    
        return (
            <div className='add-education'>
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 m-auto">
                            <Link to='/dashboard' className="btn btn-light">Go Back</Link>
                            <h1 className="display-4 text-center">Add Education</h1>
                            <p className="lead text-center">Add any school, bootcamp, etc. that you have attended</p>
                            <small className="d-block pb-3">* = required</small>
                            <form onSubmit={this.handleSubmit}>
                                <TextFieldGroup 
                                    placeholder='* School'
                                    name='school'
                                    value={school}
                                    error={errors.school}
                                    onChange={this.handleChange}
                                />
                                <TextFieldGroup 
                                    placeholder='* Degree or Certification'
                                    name='degree'
                                    value={degree}
                                    error={errors.degree}
                                    onChange={this.handleChange}
                                />
                                <TextFieldGroup 
                                    placeholder='* Field of Study'
                                    name='fieldOfStudy'
                                    value={fieldOfStudy}
                                    error={errors.fieldOfStudy}
                                    onChange={this.handleChange}
                                />
                                <h6>From Date</h6>
                                <TextFieldGroup 
                                    type='date'
                                    name='from'
                                    value={from}
                                    error={errors.from}
                                    onChange={this.handleChange}
                                />
                                <h6>To Date</h6>
                                <TextFieldGroup 
                                    type='date'
                                    name='to'
                                    value={to}
                                    error={errors.to}
                                    disabled={disabled ? 'disabled' : ''}
                                    onChange={this.handleChange}
                                />
                                <div className="form-check mb-4">
                                    <input 
                                        type="checkbox" 
                                        className='form-check-input'
                                        name="current" 
                                        value={current}
                                        checked={current}
                                        onChange={this.handleCheck}
                                        id='current'/>
                                    <label htmlFor="current" className="form-check-label">Current Studies</label>
                                </div>
                                <TextAreaFieldGroup 
                                    placeholder='Program Description'
                                    name='description'
                                    value={description}
                                    error={errors.description}
                                    onChange={this.handleChange}
                                    info='Tell us about the program you were in'
                                />
                                <input type="submit" value="Submit" className='btn btn-info btn-block mt-4'/>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

AddEducation.propTypes = {
    addEducation: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
}

const mapStateToProps = ({profile, errors}) => ({profile, errors})

export default connect(mapStateToProps, { addEducation })(AddEducation)

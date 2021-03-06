import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import TextFieldGroup from '../common/TextFieldGroup'
import TextAreaFieldGroup from '../common/TextAreaFieldGroup'
import InputGroup from '../common/InputGroup'
import SelectListGroup from '../common/SelectListGroup'
import { createProfile, getCurrentProfile } from '../../actions/profileActions'
import ProfileActions from '../dashboard/ProfileActions'
import isEmpty from '../../validation/is-empty'
import { Link } from 'react-router-dom'

class EditProfile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      displaySocialInputs: false,
      handle: '',
      company: '',
      website: '',
      location: '',
      status: '',
      skills: '',
      githubusername: '',
      social: {},
      bio: '',
      twitter: '',
      facebook: '',
      linkedin: '',
      youtube: '',
      instagram: '',
      errors: {}
    }
  }

  componentDidMount() {
    this.props.getCurrentProfile()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors })
    }
    if (nextProps.profile.profile) {
      const profile = nextProps.profile.profile
      let {
        handle,
        company,
        website,
        location,
        status,
        skills,
        githubusername,
        bio,
        social
      } = profile
      const skillsCSV = skills.join(',')
      let { twitter, facebook, linkedin, youtube, instagram } =
        social !== undefined ? social : ''
      // company = !isEmpty(company) ? company : ''
      // website = !isEmpty(website) ? website : ''
      // location = !isEmpty(location) ? location : ''
      // githubusername = !isEmpty(githubusername) ? githubusername : ''
      // bio = !isEmpty(bio) ? bio : ''
      social = !isEmpty(social) ? social : {}
      // twitter = !isEmpty(twitter) ? twitter : ''
      // facebook = !isEmpty(facebook) ? facebook : ''
      // linkedin = !isEmpty(linkedin) ? linkedin : ''
      // youtube = !isEmpty(youtube) ? youtube : ''
      // instagram = !isEmpty(instagram) ? instagram : ''
      this.setState({
        handle,
        company,
        website,
        location,
        status,
        skills: skillsCSV,
        githubusername,
        bio,
        social,
        twitter,
        facebook,
        linkedin,
        youtube,
        instagram
      })
    }
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    const { errors, ...profileData } = this.state
    this.props.createProfile(profileData, () =>
      this.props.history.push('/dashboard')
    )
  }

  render() {
    console.log(this.state)
    const {
      displaySocialInputs,
      handle,
      company,
      website,
      location,
      status,
      skills,
      githubusername,
      bio,
      twitter,
      facebook,
      linkedin,
      youtube,
      instagram,
      errors
    } = this.state
    const options = [
      { label: '* Select Professional Status', value: 0 },
      { label: 'Developer', value: 'Developer' },
      { label: 'Junior Developer', value: 'Junior Developer' },
      { label: 'Senior Developer', value: 'Senior Developer' },
      { label: 'Manager', value: 'Manager' },
      { label: 'Student or Learning', value: 'Student or Learning' },
      { label: 'Instructor or teacher', value: 'Instructor or teacher' },
      { label: 'Intern', value: 'Intern' },
      { label: 'Other', value: 'Other' }
    ]

    const socialInputs = (
      <div>
        <InputGroup
          placeholder="Twitter"
          name="twitter"
          icon="fab fa-twitter"
          value={twitter}
          onChange={this.handleChange}
          error={errors.twitter}
        />
        <InputGroup
          placeholder="Facebook"
          name="facebook"
          icon="fab fa-facebook"
          value={facebook}
          error={errors.facebook}
          onChange={this.handleChange}
        />
        <InputGroup
          placeholder="Youtube"
          name="youtube"
          icon="fab fa-youtube"
          value={youtube}
          error={errors.youtube}
          onChange={this.handleChange}
        />
        <InputGroup
          placeholder="Linkedin"
          name="linkedin"
          icon="fab fa-linkedin"
          value={linkedin}
          error={errors.linkedin}
          onChange={this.handleChange}
        />
        <InputGroup
          placeholder="Instagram"
          name="instagram"
          icon="fab fa-instagram"
          value={instagram}
          error={errors.instagram}
          onChange={this.handleChange}
        />
      </div>
    )

    return (
      <div className="create-profile">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <Link to="/dashboard" className="btn btn-light">
                Go Back
              </Link>
              <h1 className="display-4 text-center">Edit profile</h1>
              <small className="d-block pb-3">* = required</small>
              <form onSubmit={this.handleSubmit}>
                <TextFieldGroup
                  placeholder="* Profile Handle"
                  name="handle"
                  value={handle}
                  onChange={this.handleChange}
                  error={errors.handle}
                  info="A unique handle for your profile URL"
                />
                <SelectListGroup
                  placeholder="Status"
                  name="status"
                  value={status}
                  onChange={this.handleChange}
                  options={options}
                  error={errors.status}
                  info="Give us an idea of where you are at in your career"
                />
                <TextFieldGroup
                  placeholder="Company"
                  name="company"
                  value={company}
                  onChange={this.handleChange}
                  error={errors.company}
                  info="Could be your own company or one you work for"
                />
                <TextFieldGroup
                  placeholder="Website"
                  name="website"
                  value={website}
                  error={errors.website}
                  onChange={this.handleChange}
                  info="Could be your own company or one you work for"
                />
                <TextFieldGroup
                  placeholder="Location"
                  name="location"
                  value={location}
                  error={errors.location}
                  onChange={this.handleChange}
                  info="Could be your own company or one you work for"
                />
                <TextFieldGroup
                  placeholder="* Skills"
                  name="skills"
                  value={skills}
                  error={errors.skills}
                  onChange={this.handleChange}
                  info="Please use comma to separate values"
                />
                <TextFieldGroup
                  placeholder="Github Username"
                  name="githubusername"
                  value={githubusername}
                  error={errors.githubusername}
                  onChange={this.handleChange}
                  info="If you want your lastest repos and a Github link, include your username"
                />
                <TextAreaFieldGroup
                  placeholder="Short Bio"
                  name="bio"
                  value={bio}
                  error={errors.bio}
                  onChange={this.handleChange}
                  info="Tell us a little about yourself"
                />
                <div className="mb-3">
                  <button
                    type="button"
                    onClick={() => {
                      this.setState(prevState => ({
                        displaySocialInputs: !prevState.displaySocialInputs
                      }))
                    }}
                    className="btn btn-light"
                  >
                    Add Social Network Links
                  </button>
                  <span className="text-muted">Optional</span>
                </div>
                {displaySocialInputs && socialInputs}
                <input
                  type="submit"
                  value="Submit"
                  className="btn btn-info btn-block mt-4"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

EditProfile.propTypes = {
  createProfile: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
}

const mapStateToProps = ({ profile, errors }) => ({ profile, errors })

export default connect(
  mapStateToProps,
  { createProfile, getCurrentProfile }
)(EditProfile)

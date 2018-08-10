import React, { Component } from 'react'
import isEmpty from '../../validation/is-empty'

class ProfileAbout extends Component {
  render() {
    let { user, bio, skills } = this.props
    const firstName = user.name.trim().split(' ')[0]
    skills = skills.map((skill, i) => (
      <div key={i} className="p-3">
        <i className="fa fa-check" />
        {skill}
      </div>
    ))

    return (
      <div className="row">
        <div className="col-md-12">
          <div className="card card-body bg-light mb-3">
            <h3 className="text-center text-info">
              {firstName}
              's Bio
            </h3>
            <p className="lead">
              <span>
                {isEmpty(bio) ? `${firstName} does not have a bio` : bio}
              </span>
            </p>
            <hr />
            <h3 className="text-center text-info">Skill Set</h3>
            <div className="row">
              <div className="d-flex flex-wrap justify-content-center align-items-center">
                {skills}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ProfileAbout

import React, { Component } from 'react'
import isEmpty from '../../validation/is-empty'

class ProfileHeader extends Component {
    render() {
        const { user, status, company, location, website, social } = this.props

        return (
            <div className="row">
                <div className="col-md-12">
                <div className="card card-body bg-info text-white mb-3">
                    <div className="row">
                    <div className="col-4 col-md-3 m-auto">
                        <img className="rounded-circle" src={user.avatar} alt="" />
                    </div>
                    </div>
                <div className="text-center">
                  <h1 className="display-4 text-center">{user.name}</h1>
                    <p className="lead text-center">{status} {isEmpty(company) ? null : <span>at {company}</span>}</p>
                  {isEmpty(location) ? null : <p>at {location}</p>}
                  <p>
                      {isEmpty(website) ? null : (
                        <a className="text-white p-2" href={website} target='_blank'>
                            <i className="fas fa-globe fa-2x"></i>
                        </a>
                      )}

                      {isEmpty(social && social.twitter) ? null : (
                        <a className="text-white p-2" href={social.twitter} target='_blank'>
                            <i className="fab fa-twitter fa-2x"></i>
                        </a>
                      )}

                      {isEmpty(social && social.facebook) ? null : (
                        <a className="text-white p-2" href={social.facebook} target='_blank'>
                            <i className="fab fa-facebook fa-2x"></i>
                        </a>
                      )}

                      {isEmpty(social && social.linkedin) ? null : (
                        <a className="text-white p-2" href={social.linkedin} target='_blank'>
                            <i className="fab fa-linkedin fa-2x"></i>
                        </a>
                      )}

                      {isEmpty(social && social.instagram) ? null : (
                        <a className="text-white p-2" href={social.instagram} target='_blank'>
                            <i className="fab fa-instagram fa-2x"></i>
                        </a>
                      )}

                        {isEmpty(social && social.youtube) ? null : (
                        <a className="text-white p-2" href={social.youtube} target='_blank'>
                            <i className="fab fa-youtube fa-2x"></i>
                        </a>
                      )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
    }
}


export default ProfileHeader
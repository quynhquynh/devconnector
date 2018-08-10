import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import TextAreaFieldGroup from '../common/TextAreaFieldGroup'
import { addPost } from '../../actions/postActions'

class PostForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      text: '',
      error: ''
    }
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    const { user } = this.props.auth
    const newPost = {
      text: this.state.text,
      name: user.name,
      avatar: user.avatar
    }
    this.props.addPost(newPost, (text, type) =>
      this.setState({
        text: '',
        error: type === 'ADD_POST' && text
      })
    )
  }

  // componentWillReceiveProps(nextProps) {
  //   const { errors } = nextProps
  //   errors.type === "ADD_POST" && this.setState({ error: errors.text })
  // }

  render() {
    const { text, error } = this.state
    return (
      <div className="post-form mb-3">
        <div className="card card-info">
          <div className="card-header bg-info text-white">Say Somthing...</div>
          <div className="card-body">
            <form onSubmit={this.handleSubmit}>
              <div className="form-group">
                <TextAreaFieldGroup
                  placeholder="Create a post"
                  name="text"
                  value={text}
                  error={error}
                  onChange={this.handleChange}
                />
              </div>
              <button type="submit" className="btn btn-dark">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

PostForm.propTypes = {
  addPost: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
}

const mapStateToProps = ({ errors, auth }) => ({ errors, auth })

export default connect(
  mapStateToProps,
  { addPost }
)(PostForm)

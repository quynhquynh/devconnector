import React, { PureComponent } from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import classnames from "classnames"
import { Link } from "react-router-dom"
import {
  deletePost,
  addLike,
  removeLike,
  updatePost
} from "../../actions/postActions"
import TextFieldGroup from "../common/TextFieldGroup"

class PostItem extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      textToUpdate: "",
      isEditing: false
    }
  }

  componentDidMount() {
    this.setState({
      textToUpdate: this.props.post.text
    })
  }

  handleEdit = () => {
    this.setState(prevState => ({
      isEditing: !prevState.isEditing
    }))
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSave = postId => {
    const { textToUpdate } = this.state
    const { updatePost } = this.props
    updatePost(postId, textToUpdate)
  }

  componentWillReceiveProps(nextProps) {
    const { auth, post, errors } = nextProps
    errors.text === undefined && this.setState({ isEditing: false })
    if (
      errors.text &&
      auth.user.id === post.user &&
      errors.postId === post._id
    ) {
      errors.type === "UPDATE_POST" && this.setState({ isEditing: true })
    }
  }

  handleDelete = id => {
    this.props.deletePost(id)
  }

  handleLike = id => {
    this.props.addLike(id)
  }

  handleUnlike = id => {
    this.props.removeLike(id)
  }

  findUserLike = likes => {
    const { auth } = this.props
    if (likes.filter(like => like.user === auth.user.id).length > 0) {
      return true
    }
    return false
  }

  render() {
    const { post, auth, showActions, errors } = this.props
    const { user, avatar, name, text, likes, _id } = post
    const { textToUpdate, isEditing } = this.state

    const renderEdit =
      user === auth.user.id ? (
        <div>
          <button onClick={this.handleEdit} className="btn btn-primary mr-2">
            <i className="fas fa-edit" />
          </button>
          <button
            onClick={() => this.handleDelete(_id)}
            type="button"
            className="btn btn-danger mr-1"
          >
            <i className="fas fa-times" />
          </button>
        </div>
      ) : null

    const renderSave =
      user === auth.user.id ? (
        <div>
          <button
            onClick={() => this.handleSave(_id)}
            className="btn btn-primary"
          >
            <i className="fas fa-save" />
          </button>
          <button
            onClick={() => this.handleDelete(_id)}
            type="button"
            className="btn btn-danger mr-1"
          >
            <i className="fas fa-times" />
          </button>
        </div>
      ) : null

    return (
      <div className="card card-body mb-3">
        <div className="row">
          <div className="col-md-2">
            <a href="profile.html">
              <img
                className="rounded-circle d-none d-md-block"
                src={avatar}
                alt=""
              />
            </a>
            <br />
            <p className="text-center">{name}</p>
          </div>
          <div className="col-md-10">
            {!isEditing ? (
              <p className="lead">{text}</p>
            ) : (
              <TextFieldGroup
                name="textToUpdate"
                value={textToUpdate}
                error={errors.text}
                onChange={this.handleChange}
              />
            )}
            {showActions ? (
              <span>
                <button
                  onClick={() => this.handleLike(_id)}
                  type="button"
                  className="btn btn-light mr-1"
                >
                  <i
                    className={classnames("fas fa-thumbs-up", {
                      "text-info": this.findUserLike(likes)
                    })}
                  />
                  <span className="badge badge-light">{likes.length}</span>
                </button>
                <button
                  onClick={() => this.handleUnlike(_id)}
                  type="button"
                  className="btn btn-light mr-1"
                >
                  <i className="text-secondary fas fa-thumbs-down" />
                </button>
                <Link to={`/post/${_id}`} className="btn btn-info mr-1">
                  Comments
                </Link>
                {!isEditing ? renderEdit : renderSave}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    )
  }
}

PostItem.defaultProps = {
  showActions: true
}

PostItem.propTypes = {
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  deletePost: PropTypes.func.isRequired,
  updatePost: PropTypes.func.isRequired,
  addLike: PropTypes.func.isRequired,
  removeLike: PropTypes.func.isRequired,
  errors: PropTypes.object
}

const mapStateToProps = ({ auth, errors }) => ({
  auth,
  errors
})

export default connect(
  mapStateToProps,
  { deletePost, addLike, removeLike, updatePost }
)(PostItem)

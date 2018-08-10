import React, { Component } from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { deleteComment, updateComment } from "../../actions/postActions"
import TextFieldGroup from "../common/TextFieldGroup"

class CommentItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      textToUpdate: "",
      isEditing: false
    }
  }

  componentDidMount() {
    this.setState({ textToUpdate: this.props.comment.text })
  }

  handleDelete = (postId, cmtId) => {
    this.props.deleteComment(postId, cmtId)
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleEdit = () => {
    this.setState(prevState => ({ isEditing: !prevState.isEditing }))
  }

  handleSave = (postId, cmtId) => {
    const { textToUpdate } = this.state
    const { updateComment } = this.props
    updateComment(postId, cmtId, textToUpdate)
  }

  componentWillReceiveProps(nextProps) {
    const { errors, auth, comment } = nextProps
    errors.text === undefined && this.setState({ isEditing: false })
    errors.text &&
      auth.user.id === comment.user &&
      errors.type === "UPDATE_COMMENT" &&
      comment._id === errors.cmtId &&
      this.setState({ isEditing: true })
  }

  render() {
    const { comment, postId, auth, errors } = this.props
    const { _id, avatar, name, text, user } = comment
    const { textToUpdate, isEditing } = this.state
    const renderSave = (
      <div className="col-md-10">
        <TextFieldGroup
          name="textToUpdate"
          value={textToUpdate}
          error={errors.text}
          onChange={this.handleChange}
        />
        {user === auth.user.id ? (
          <div>
            <button
              onClick={() => this.handleSave(postId, _id)}
              className="btn btn-primary"
            >
              <i className="fas fa-save" />
            </button>
            <button
              onClick={() => this.handleDelete(postId, _id)}
              type="button"
              className="btn btn-danger mr-1"
            >
              <i className="fas fa-times" />
            </button>
          </div>
        ) : null}
      </div>
    )

    const renderEdit = (
      <div className="col-md-10">
        <p className="lead">{text}</p>
        {user === auth.user.id ? (
          <div>
            <button onClick={this.handleEdit} className="btn btn-primary mr-2">
              <i className="fas fa-edit" />
            </button>
            <button
              onClick={() => this.handleDelete(postId, _id)}
              type="button"
              className="btn btn-danger mr-1"
            >
              <i className="fas fa-times" />
            </button>
          </div>
        ) : null}
      </div>
    )

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
          {isEditing ? renderSave : renderEdit}
        </div>
      </div>
    )
  }
}

CommentItem.propTypes = {
  deleteComment: PropTypes.func.isRequired,
  comment: PropTypes.object.isRequired,
  postId: PropTypes.string.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object
}

const mapStateToProps = ({ auth, errors }) => ({ auth, errors })

export default connect(
  mapStateToProps,
  { deleteComment, updateComment }
)(CommentItem)

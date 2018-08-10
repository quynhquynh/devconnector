import React, { Component } from 'react'
import PropTypes from 'prop-types'
import CommentItem from './CommentItem'

class CommentFeed extends Component {
  render() {
    const { comments, postId } = this.props
    return comments.map(cmt => (
      <CommentItem key={cmt._id} comment={cmt} postId={postId} />
    ))
  }
}

CommentFeed.propTypes = {
  comments: PropTypes.array.isRequired,
  postId: PropTypes.string.isRequired
}

export default CommentFeed

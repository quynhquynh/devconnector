import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Spinner from '../common/Spinner'
import { getPost } from '../../actions/postActions'
import PostItem from '../posts/PostItem'
import { Link } from 'react-router-dom'
import CommentForm from './CommentForm'
import CommentFeed from './CommentFeed'

class Post extends Component {
    componentDidMount(){
        this.props.getPost(this.props.match.params.id)
    }

  render() {
      const { post, loading } = this.props.post
      let postContent
      if(post === null || loading || Object.keys(post).length === 0){
        postContent = <Spinner />
      }else{
          postContent = (
              <div>
                  <PostItem post={post} showActions={false} />
                  <CommentForm postId={post._id} />
                  <CommentFeed postId={post._id} comments={post.comments} />
              </div>
          )
      }
        return (
        <div className='post'>
            <div className="contai">
                <div className="row">
                    <Link to='/feed' className='btn btn-light mb-3'>Back to Feed</Link>
                </div>
                {postContent}
            </div>
        </div>
        )
  }
}

Post.propTypes = {
    getPost: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired
}

const mapStateToProps = ({post}) => ({post})

export default connect(mapStateToProps, { getPost })(Post) 
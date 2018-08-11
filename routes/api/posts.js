const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const Post = require('../../models/Post');
const validatePostInput = require('../../validation/post');
const Profile = require('../../models/Profile');

// @route   GET api/posts/test
// desc     tests posts route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'posts works' }));

// @route   POST api/posts
// desc     create post
// @access  Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const { text, name, avatar } = req.body;
    const { id } = req.user;
    const newPost = new Post({
      text,
      name,
      avatar,
      user: id
    });
    newPost.save().then(post => res.json(post));
  }
);

// @route   GET api/posts
// desc     get posts
// @access  Public
router.get('/', (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(e => res.status(404).json({ nopostsfound: 'No posts found' }));
});

// @route   GET api/posts/:id
// desc     get posts by id
// @access  Public
router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(e =>
      res.status(404).json({ nopostfound: 'No post found with that ID' })
    );
});

// @route   DELETE api/posts/:id
// desc     delete posts by id
// @access  Private
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // Profile.findOne({ user: req.user.id })//? why this (find the user ??)
    //     .then(profile => {
    Post.findById(req.params.id)
      .then(post => {
        if (post.user.toString() !== req.user.id) {
          //protect not only front-end but also back-end, anyone can delete via Postman
          return res.status(401).json({ notauthorize: 'user not authorized' });
        }
        post.remove().then(() => res.json({ success: true }));
      })
      .catch(e => res.status(404).json({ postnotfound: 'No post found' }));
    // })
  }
);

// @route   PUT api/posts/:id
// desc     update posts by id
// @access  Private
router.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const { text } = req.body;
    Post.findById(req.params.id)
      .then(post => {
        if (post.user.toString() !== req.user.id) {
          return res.status(401).json({ notauthorize: 'user not authorized' });
        }
        Post.findByIdAndUpdate(
          req.params.id,
          { $set: { text } },
          { new: true }
        ).then(post => {
          Post.find()
            .sort({ date: -1 })
            .then(posts => res.json(posts))
            .catch(e =>
              res.status(404).json({ nopostsfound: 'No posts found' })
            );
        });
      })
      .catch(e => res.status(401).json({ postnotfound: 'No post found' }));
  }
);

// @route   POST api/posts/like/:id
// desc     like post
// @access  Private
router.post(
  '/like/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id).then(post => {
        if (
          post.likes.filter(like => like.user.toString() === req.user.id)
            .length > 0
        ) {
          return res
            .status(400)
            .json({ alreadyliked: 'User already liked this post' });
        }
        post.likes.unshift({ user: req.user.id });
        post.save().then(post => res.json(post));
      });
    });
  }
);

// @route   POST api/posts/unlike/:id
// desc     unlike post
// @access  Private
router.post(
  '/unlike/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // Profile.findOne({ user: req.user.id })
    //     .then(profile => {
    Post.findById(req.params.id)
      .then(post => {
        if (
          post.likes.filter(like => like.user.toString() === req.user.id)
            .length === 0
        ) {
          return res
            .status(400)
            .json({ notliked: 'User have not yet liked this post' });
        }
        const removeIndex = post.likes.findIndex(
          like => like.user.toString() === req.user.id
        );
        post.likes.splice(removeIndex, 1);
        post.save().then(post => res.json(post));
      })
      .catch(e => res.status(404).json({ postnotfound: 'No post found' }));
    // })
  }
);

// @route   POST api/posts/comment/:id
// desc     add comment to post
// @access  Private
router.post(
  '/comment/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    Post.findById(req.params.id)
      .then(post => {
        const { text, name, avatar } = req.body;
        const newComment = { text, name, avatar, user: req.user.id };
        post.comments.unshift(newComment);
        post.save().then(post => res.json(post));
      })
      .catch(e => res.status(404).json({ postnotfound: 'No post found' }));
  }
);

// router.delete('/comment/:postId/:cmtId', (req, res) => {
//     console.log(req.params.postId)
//     console.log(req.params.cmtId)
// })

// @route   DELETE api/posts/comment/:post_id/:cmt_id
// desc     delete comment from post
// @access  Private
router.delete(
  '/comment/:post_id/:cmt_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Post.findById(req.params.post_id)
      .then(post => {
        const removeIndex = post.comments.findIndex(
          cmt => cmt.id === req.params.cmt_id
        );
        console.log(removeIndex);
        if (removeIndex === -1) {
          return res.status(404).json({ commentnotfound: 'No comment found' });
        }
        if (
          post.comments[removeIndex].user.toString() !== req.user.id &&
          post.user.toString() !== req.user.id
        ) {
          return res.status(401).json({ notauthorize: 'user not authorized' });
        }
        post.comments.splice(removeIndex, 1);
        post.save().then(post => res.json(post));
      })
      .catch(e => res.status(404).json({ postnotfound: 'No post found' }));
  }
);

// @route   PUT api/posts/comment/:post_id/:cmt_id
// desc     update comment from post
// @access  Private
router.put(
  '/comment/:post_id/:cmt_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const { post_id, cmt_id } = req.params;
    Post.findById(post_id).then(post => {
      const { text } = req.body;
      const editIndex = post.comments.findIndex(cmt => cmt.id === cmt_id);
      if (editIndex === -1) {
        return res.status(404).json({ commentnotfound: 'No comment found' });
      }
      if (post.comments[editIndex].user.toString() !== req.user.id) {
        return res.status(401).json({ notauthorize: 'user not authorized' });
      }
      Post.update(
        { 'comments._id': cmt_id },
        { $set: { 'comments.$.text': text } }
      )
        .then(model => {
          Post.findById(post_id).then(post => res.json(post));
        })
        .catch(e => res.send(e));
    });
  }
);

module.exports = router;

const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const passport = require('passport')

const Profile = require('../../models/Profile')
const validateProfileInput = require('../../validation/profile')
const validateExperienceInput = require('../../validation/experience')
const validateEducationInput = require('../../validation/education')


// @route   GET api/profile/test
// desc     tests profile route
// @access  Public 
router.get('/test', (req, res) => res.json({msg: "profile works"}))

// @route   GET api/profile
// desc     get current user profile
// @access  Private
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const errors = {}
    Profile.findOne({ user: req.user.id })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if(!profile){
                errors.noprofile = 'There is no profile for this user'
                return res.status(404).json(errors)
            }
            res.json(profile)
        })
        .catch(e => res.status(404).json(e))
})


// @route   GET api/profile/all
// desc     get all profiles
// @access  Public
router.get('/all', (req, res) => {
    const errors = {}
    Profile.find()
        .populate('user', ['name', 'avatar'])
        .then(profiles => {
            if(!profiles){
                errors.noprofile = 'There are no profiles'
                return res.status(404).json(errors)
            }
            res.json(profiles)
        })
        .catch(e => res.status(404).json({profile: 'There are no profiles'}))
})

// @route   GET api/profile/handle/:handle
// desc     get profile by handle
// @access  Public
router.get('/handle/:handle', (req, res) => {
    const errors = {}
    Profile.findOne({ handle: req.params.handle })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if(!profile){
                errors.noprofile = 'There is no profile for this user'
                res.status(404).json(errors)
            }
            res.json(profile)
        })
        .catch(e => res.status(404).json(e))
})

// @route   GET api/profile/users/:user_id
// desc     get profile by handle
// @access  Public
router.get('/users/:user_id', (req, res) => {
    const errors = {}
    Profile.findOne({ user: req.params.user_id})
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if(!profile){
                errors.noprofile = 'There is no profile for this user'
                res.status(404).json(errors)
            }
            res.json(profile)
        })
        .catch(e => res.status(404).json({profile: 'There is no profile for this user'}))
})

// @route   POST api/profile
// desc     create or edit user profile
// @access  Private

//leave the passport.authenticate cos it's a protective route

router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body)
    if(!isValid){
        res.status(400).json(errors)
    }

    // const profileFields = {}
    // profileFields.user = req.user.id
    const { handle, company, website, location, bio, status, githubusername, skills, youtube, twitter, facebook, linkedin, instagram } = req.body
    const profileFields = {
        user: req.user.id,
        handle, company, website, location, bio, status, githubusername,
        skills: skills !== undefined ? skills.split(',') : [],
        social: {
            youtube, twitter, facebook, linkedin, instagram
        }

    }
    // if(req.body.handle) profileFields.handle = req.body.handle
    // if(req.body.company) profileFields.company = req.body.company
    // if(req.body.website) profileFields.website = req.body.website
    // if(req.body.location) profileFields.location = req.body.location
    // if(req.body.bio) profileFields.bio = req.body.bio
    // if(req.body.status) profileFields.status = req.body.status
    // if(req.body.githubusername) profileFields.githubusername = req.body.githubusername
    // if(typeof req.body.skills !== 'undefined'){
    //     profileFields.skills = req.body.skills.split(',')
    // }
    // profileFields.social = {}
    // if(req.body.youtube)  profileFields.social.youtube = req.body.youtube
    // if(req.body.twitter)  profileFields.social.twitter = req.body.twitter
    // if(req.body.facebook)  profileFields.social.facebook = req.body.facebook
    // if(req.body.linkedin)  profileFields.social.linkedin = req.body.linkedin
    // if(req.body.instagram)  profileFields.social.instagram = req.body.instagram

    Profile.findOne({ user: req.user.id })
        .then(profile => {
            if(profile){
                Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, {new: true})
                    .then(profile => res.json(profile))
            }else{
                Profile.findOne({ handle: profileFields.handle })
                    .then(profile => {
                        if(profile){
                            errors.handle = 'That handle already exists'
                            res.status(400).json(errors)
                        }
                        new Profile(profileFields).save().then(profile => res.json(profile))
                    })
            }
        })
})


// @route   POST api/profile/experience
// desc     add experience to profile
// @access  Private
router.post('/experience', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body)

    if(!isValid){
        return res.status(400).json(errors)
    }

    Profile.findOne({ user: req.user.id })
        .then(profile => {
            const { title, company, location, from, to, current, description } = req.body
            const newExp = {
                title, company, location, from, to, current, description
            }
            profile.experience.unshift(newExp)
            profile.save().then(profile => res.json(profile))
        })
})


// @route   POST api/profile/education
// desc     add education to profile
// @access  Private
router.post('/education', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body)

    if(!isValid){
        return res.status(400).json(errors)
    }

    Profile.findOne({ user: req.user.id })
        .then(profile => {
            const { school, degree, fieldOfStudy, from, to, current, description } = req.body
            const newEdu = {
                school, degree, fieldOfStudy, from, to, current, description
            }
            profile.education.unshift(newEdu)
            profile.save().then(profile => res.json(profile))
        })
})


// @route   DELETE api/profile/experience/:exp_id
// desc     delete experience from profile
// @access  Private
router.delete('/experience/:exp_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            //findIndex
            const removeIndex = profile.experience
                .map(item => item.id)
                .indexOf(req.params.exp_id)

            profile.experience.splice(removeIndex, 1)
            profile.save().then(profile => res.json(profile))
        })
        .catch(e => res.status(404).json(e))
})


//@route   DELETE api/profile/education/:edu_id
// desc     delete education from profile
// @access  Private
router.delete('/education/:edu_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            const removeIndex = profile.education.findIndex(edu => edu.id === req.params.edu_id)
            profile.education.splice(removeIndex, 1)
            profile.save().then(profile => res.json(profile))
        })
        .catch(e => res.status(404).json(e))
})


//@route   DELETE api/profile
// desc     delete user and profile
// @access  Private
router.delete('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id })
        .then(() => {
            User.findOneAndRemove({ _id: req.user.id })
                .then(() => res.json({ success: true }))
        })
})


module.exports = router
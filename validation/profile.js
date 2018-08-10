const Validator = require('validator')
const isEmpty = require('./is-empty') 

module.exports = function validateProfileInput(data){
    let errors = {}

    let { handle, status, skills, website, youtube, twitter, facebook, linkedin, instagram } = data
    handle = !isEmpty(handle) ? handle : ''
    status = !isEmpty(status) ? status : ''
    skills = !isEmpty(skills) ? skills : ''
    
    if(!Validator.isLength(handle, { min: 2, max: 40 })){
        errors.handle = 'Handle needs to between 2 and 40 characters'
    }
    if(Validator.isEmpty(handle)){
        errors.handle = 'Profile handle is required'
    }
    if(Validator.isEmpty(status)){
        errors.status = 'Status is required'
    }
    if(Validator.isEmpty(skills)){
        errors.skills = 'Skills is required'
    }
    if(!isEmpty(website)){
        if(!Validator.isURL(website)){
            errors.website = 'Not a valid url'
        }
    }
    if(!isEmpty(youtube)){
        if(!Validator.isURL(youtube)){
            errors.youtube = 'Not a valid url'
        }
    }
    if(!isEmpty(twitter)){
        if(!Validator.isURL(twitter)){
            errors.twitter = 'Not a valid url'
        }
    }
    if(!isEmpty(facebook)){
        if(!Validator.isURL(facebook)){
            errors.facebook = 'Not a valid url'
        }
    }
    if(!isEmpty(linkedin)){
        if(!Validator.isURL(linkedin)){
            errors.linkedin = 'Not a valid url'
        }
    }
    if(!isEmpty(instagram)){
        if(!Validator.isURL(instagram)){
            errors.instagram = 'Not a valid url'
        }
    }

    // const urlBeChecked = [
    //     {name: 'youtube', link: youtube},
    //     {name: 'twitter', link: twitter},
    //     {name: 'facebook', link: facebook},
    //     {name: 'linkedin', link: linkedin},
    //     {name: 'instagram', link: instagram},
    // ]
    // urlBeChecked.map(item => checkUrl(item.link, item.name))
    // const checkUrl = (link, name) => {
    //     if(!Validator.isURL(link)){
    //         errors[name] = 'Not a valid url'
    //     }
    // }


    return {
        errors,
        isValid: isEmpty(errors)
    }
}
const { object, string, ref } = require('yup');

const isEmailLengthValid = email => {
    if (email) {
        const part = email.split('@');
        const emailParts = part[0];
        return emailParts.length <= 64;    
    }
    return true;
}

const userRegisterSchema = object().shape({
    email: string()
        .email('This field should be a valid email address.')
        .max(100, 'Email must be at most 100 characters long.')
        .required('Email is required.')
        .test('is-valid-email-length', 'The part before @ of the email can be maximum 64 characters.',
            email => isEmailLengthValid(email)),
    password: string()
        .min(8, 'The password must be at least 8 characters long.')
        .max(50, 'The password must be at most 50 characters long.')
        .required('Password is required.'),
    confirm_password: string()
        .required('Confirm Password is required')
        .oneOf([ref('password'), null], 'Password and Confirm Password must should be matched')
});

const userUpdateSchema = object().shape({
    first_name: string()
        .min(2, 'This field must be at least 2 characters long.')
        .max(50, 'This field must be at most 50 characters long.')
        .required('This field must not be empty.'),
    last_name: string()
        .min(2, 'This field must be at least 2 characters long.')
        .max(50, 'This field must be at most 50 characters long.')
        .required('This field must not be empty.'),
    about: string()
        .max(10000, 'This field must be at most 10000 characters long.'),
    facebook_link: string()
        .max(255, 'This field must be at most 10000 characters long.'),
    github_link: string()
        .max(255, 'This field must be at most 10000 characters long.'),
    linkedin_link: string()
        .max(255, 'This field must be at most 10000 characters long.'),
    email_link: string()
        .max(255, 'This field must be at most 10000 characters long.')
});

module.exports.userRegisterSchema = userRegisterSchema;
module.exports.userUpdateSchema = userUpdateSchema;
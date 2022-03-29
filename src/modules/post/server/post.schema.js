const { object, string, number, boolean } = require('yup');

const postSchema = object().shape({
    category_id: string()
        .required('This field must not be empty.'),
    title: string()
        .min(2, 'This field must be at least 2 characters long.')
        .max(255, 'This field must be at most 50 characters long.')
        .required('This field must not be empty.'),
    content: string()
        .max(10000, 'This field must be at most 10000 characters long.')
        .required('This field must not be empty.'),
    view_order: number()
        .required('This field must not be empty.'),
    is_visible: boolean()
        .required('This field must not be empty')
});

module.exports.postSchema = postSchema;
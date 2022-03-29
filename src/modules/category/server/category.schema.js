const { object, string, number, boolean } = require("yup");

const categorySchema = object().shape({
    title: string()
        .trim()
        .min(2, 'This field must be at least 2 characters long.')
        .max(255, 'This field must be at most 255 characters long.')
        .required('This field must not be empty.'),
    description: string()
        .min(2, 'This field must be at least 2 characters long.')
        .max(1000, 'This field must be at most 1000 characters long.')
        .required('This field must not be empty.'),
    view_order: number()
        .required('This field must not be empty.'),
    is_visible: boolean()
        .required('This field must not be empty.')
});

module.exports.categorySchema = categorySchema;
const joi = require('joi');
const uservalidation = data => {
    const schema = joi.object({
        name: joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
        email: joi.string().pattern(new RegExp('hawaii.com$')).required(),
        password: joi.string().required()
    }).unknown();
    return schema.validate(data);
};
module.exports.uservalidaton = uservalidaton;
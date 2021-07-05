/*import { create } from './users';

const joi = require('joi');

export default {
    async create(req,res){
        console.log(req.body);
    
    const schema = joi.object().keys({
        name:joi.String().min(3).max(100).required(),
       
        email: joi.String().pattern(new RegExp('hawaii.com$')).required(),
        password: joi.String().required(),
        
    });
    const {value,error} = joi.validate(req.body,schema);
    if(error && error.details){
        return res.status(400).json(error);
    }
    return res.json(value);
   },
};*/


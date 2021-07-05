const express = require('express');
const app = express();
var fileupload = require('express-fileupload');
//const { registerValdation } = require('./validate/uservalidation')
const upload = require('express-fileupload')
const mongoose = require('mongoose');
const User = require('./models/users')
var bodyParser = require('body-Parser')
var jsonParser = bodyParser.json();
var crypto = require('crypto');
var key = "password";
var algo = 'aes256'
//app.use(express.json());

app.use(fileupload());

const jwt = require('jsonwebtoken')
//const { registerValdation } = require('./validation');
jwtkey = "jwt"

mongoose.connect('mongodb+srv://kavita:kavita@1997@cluster0.pgb3e.mongodb.net/registration?retryWrites=true&w=majority',

    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);


app.get('/users', function (req, res) {
    User.find().select('email').then((data) => {
        res.status(201).json(data)
    })
})
app.post('/user', jsonParser, function (req, res) {
    const data = new User({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        email: req.body.email,
        address: req.body.address
    });

})

data.save().then((result) => {
    res.status(201).json(result)
})
    .catch(() => console.warn(error)
    )

    
app.delete('/user/:id', function (req, res) {
    User.deleteOne({ _id: req.params.id }).then((result) => {
        res.status(200).json(result)
    }).catch((error) => { console.warn(err) })
})
app.put("/user/:id", jsonParser, function (req, res) {
    User.updateOne(
        { _id: req.params.id },
        { $set: { name: req.body.name } }
    ).then((result) => {
        res.status(200).json(result)
    }).catch((error) => { console.warn(err) })
})

app.post('/register', jsonParser, function (req, res) {

    var cipher = crypto.createCipher(algo, key);
    var encrypted = cipher.update(req.body.password, 'utf8', 'hex')
        + cipher.final('hex');

    console.warn(encrypted)
    const data = new User({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        email: req.body.email,
        address: req.body.address,
        password: encrypted,
        image: req.file.path

    })

    data.save().then((result) => {
        jwt.sign({ result }, jwtkey, { expiresIn: '300s' }, (err, token) => {
            res.status(200).json({ token })
        })


        // res.status(200).json(result)
    }).catch((error) => { console.warn(err) })

});
app.post('/login', jsonParser, function (req, res) {
    User.findOne({ email: req.body.email }).then((data) => {
        var decipher = crypto.createDecipher(algo, key);
        var decrypted = decipher.update(data.password, 'hex', 'utf8') +
            decipher.final('utf8');
        if (decrypted == req.body.password) {
            jwt.sign({ data }, jwtkey, { expiresIn: '300s' }, (err, token) => {
                res.status(200).json({ token })
            })
        }
    })
})
app.get('/users', verifyToekn, function (req, res) {
    User.find().then((result) => {
        res.status(200).json(result)
    })
})
function verifyToekn(req, res, next) {
    const bearerHeader = req.Headers['authorization'];

    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split('')
        console.warn(bearer[1])
        req.token = bearer[1]
        jwt.verify(req.token, jwtkey, (err, authData) => {
            if (err) {
                res.json({ result: err })
            }
            else {
                next();
            }
        })

    }
    else {
        res.send({ "result": "token not provied" })
    }
}
app.get('/', (req, res, next) => {
    res.status(200).send("hello world");
});
app.post('/upload', function (req, res, next) {
    const file = req.files.photo;

    file.mv('./uploads/', +filename, function (err, result) {
        if (err)
            throw err;
        res.send({
            success: true,
            message: "file uploaded"
        })
    })

})
app.listen(4000)

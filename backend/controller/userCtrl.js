const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const nodemailerSendgrid = require('nodemailer-sendgrid');
const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const Op = Sequelize.Op;
const User = sequelize.import('../model/user');
const UserProfile = sequelize.import('../model/userProfile');


const transport = nodemailer.createTransport(
    nodemailerSendgrid({
        apiKey: process.env.SENDGRID_API_KEY
    })
);

let sendJSONResponse = function(res, status, content) {
    return res.status(status).json(content);
};

module.exports.getUsers = function(req, res, next) {
    User.findAll({})
        .then(function(users) {
            if (!users) {
                sendJSONResponse(res, 404, { message: 'cannot find references from the query' });
            } else {
                sendJSONResponse(res, 200, users);
            }
        })
        .catch(err => console.error(err));
};

module.exports.getUserById = function(req, res, next) {
    User.findByPk(req.params.id)
        .then(function(user) {
            if (!user) {
                sendJSONResponse(res, 404, { message: 'cannot get user' });
            } else {
                sendJSONResponse(res, 200, user);
            }
        })
        .catch(err => console.error(err));
};

module.exports.updateUserProfile = function(req, res, next) {
    const profile = req.body.profile;

    UserProfile
        .findByPk(profile.id)
        .then(userProfile => {
            if (userProfile) {
                return userProfile.update({
                        firstname: profile.firstname,
                        lastname: profile.lastname,
                        company: profile.company,
                        addressOne: profile.addressOne,
                        addressTwo: profile.addressTwo,
                        phone: profile.phone,
                        mobilePhone: profile.mobilePhone,
                        newsletter: profile.newsletter,
                        city: profile.city,
                        postcode: profile.postcode,
                        region: profile.region,
                        country: profile.country
                    },
                    { fields: [
                        'firstname',
                        'lastname',
                        'company',
                        'addressOne',
                        'addressTwo',
                        'phone',
                        'mobilePhone',
                        'newsletter',
                        'city',
                        'postcode',
                        'region',
                        'country'
                    ]})
            } else {
                sendJSONResponse(res, 404, { message: 'User profile cannot be saved' });
            }
        })
        .then(userProfile => {
            if (userProfile) {
                sendJSONResponse(res, 200, { message: 'User profile updated succesfully', userProfile: userProfile });
            } else {
                sendJSONResponse(res, 404, { message: 'User profile cannot be saved' });
            }
        })
        .catch( err => console.log(err));
};

module.exports.updateUserProfilePhoto = function(req, res, next) {
    const profileId = req.body.profileId;
    const url = req.protocol + '://' + req.get('host');

    UserProfile
        .findByPk(profileId)
        .then(userProfile => {
            if (userProfile) {
                return userProfile.update(
                    {imagePath: url + '/' + req.file.path},
                    {fields: ['imagePath']})
            } else {
                sendJSONResponse(res, 404, { message: 'User profile photo cannot be saved' });
            }
        })
        .then(userProfile => {
            if (userProfile) {
                sendJSONResponse(res, 200, { message: 'User profile photo updated successfully', userProfile: userProfile });
            } else {
                sendJSONResponse(res, 404, { message: 'User profile photo cannot be saved' });
            }
        })
        .catch( err => console.log(err));
};

module.exports.getUserProfileByUserId = function(req, res, next) {
    const userId = req.params.userId;

    sequelize
        .query(`SELECT * FROM userProfile WHERE userId = :userId `, {
                replacements: { userId: userId },
                type: sequelize.QueryTypes.SELECT
            })
        .then((userProfile) => {
            console.log(userProfile);
            if (!userProfile) {
                sendJSONResponse(res, 404, { message: 'cannot get user\'s profile' });
            } else {
                sendJSONResponse(res, 200, {userProfile: userProfile});
            }
        })
        .catch(err => console.error(err));
};

module.exports.getUserByToken = function(req, res, next) {
    const token = req.body.token;

    User.findOne({
        where: {
            resetToken: token,
            resetTokenExpirationDate: {
                [Op.gt]: Date.now()
            }
        }
    })
    .then(user => {
        console.log(user);
        if (!user) {
            sendJSONResponse(res, 404, { message: 'Invalid token. User does not exist' });
        } else {
            sendJSONResponse(res, 200, user);
        }
    })
    .catch( err => console.log(err));
};

module.exports.loginUser = function(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ where: { email: email } })
        .then(function(user) {
            if (!user) {
                sendJSONResponse(res, 404, { message: "Authentication failed. Please enter valid credentials." });
            } else {
                bcrypt.compare(password, user.password).then(doMatch => {
                    if (doMatch) {
                        const token = jwt.sign(
                            { email: user.email, userId: user.id },
                            process.env.JWT_SECRET,
                            { expiresIn: '1h' }
                            );
                        sendJSONResponse(res, 200, { message: 'Authentication success', user: user, token: token, expiresIn: 3600 });
                    } else {
                        sendJSONResponse(res, 401, { message: 'Authentication failed. Please enter valid credentials.'});
                    }
                })
                .catch(err => console.error(err));
            }
        })
        .catch(err => console.error(err));
};

module.exports.signupUser = function(req, res, next) {
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;

    if (req.body.email && req.body.password) {
        bcrypt.hash(req.body.password, 10).then(hash => {
            UserProfile.create({
                    firstname: firstname,
                    lastname: lastname,
                    user: {
                        email: req.body.email,
                        password: hash
                    }
                }, {
                    include: [{
                        association: UserProfile.User
                    }]
                })
            .then(result => {
                const newUser = result;
                const token = jwt.sign(
                    { email: newUser.email, id: newUser.id },
                    process.env.JWT_SECRET,
                    { expiresIn: '1h' }
                );
                sendJSONResponse(res, 200, { message: 'User created succesfully', user: result, token: token, expiresIn: 3600 });
            })
            .catch(err => {
                console.error(err);
                sendJSONResponse(res, 500, { message: "Cannot create user. Maybe email is taken.", error: err });
            });
        });
    } else {
        sendJSONResponse(res, 500, { message: "Cannot create user - wrong data submitted" });
    }
};

module.exports.resetPassword = function (req, res, next) {
    const email = req.body.email;

    crypto.randomBytes(32, (err, buf) => {
        if (err) {
            sendJSONResponse(res, 500, { message: "Cannot create reset token. Something went wrong", error: err });
        }
        const token = buf.toString('hex');

        User.findOne({
                where: {
                    email: email
                }
            })
            .then(function(user) {
                if (!user) {
                    sendJSONResponse(res, 500, { message: "Cannot find a user with this email" });
                }
                user.resetToken = token;
                user.resetTokenExpirationDate = Date.now() + 3600000;
                return user.save();
            })
            .then(user => {
                const email = {
                    from: 'no-reply@just.auction',
                    to: user.email,
                    date: Date.now(),
                    subject: '[JustAuction] Password Reset',
                    mailedBy: 'just.auction',
                    linkedBy: 'just.auction',
                    html: `
                        <p>Click this link to reset your password.</p>
                        <p>Click this <a href="${process.env.DOMAIN_NAME}/update-password/${token}">link to reset your password.</p>
                    `
                };
                transport.sendMail(email).then(([res]) => {
                    console.log('Message delivered with code %s %s', res.statusCode, res.statusMessage);
                })
                .catch(err => {
                    console.log('Errors occurred, failed to deliver message');

                    if (err.response && err.response.body && err.response.body.errors) {
                        err.response.body.errors.forEach(error => console.log('%s: %s', error.field, error.message));
                    } else {
                        console.log(err);
                    }
                });
                sendJSONResponse(res, 200, {message: "Take a look at your email.", user: user});
            })
            .catch(err => console.error(err));
    });
};

module.exports.updatePasswordByToken = function (req, res, next) {
    const userId = req.body.userId;
    const token = req.body.token;
    const newPassword = req.body.password;

    User.findOne({
            where: {
                id: userId,
                resetToken: token,
                resetTokenExpirationDate: {
                    [Op.gt]: Date.now()
                }
            }
        })
        .then(user => {
            bcrypt.hash(newPassword, 10).then(hash => {
                user.update({password: hash}, {fields: ['password']})
                .then(result => {
                    sendJSONResponse(res, 200, { message: 'Password updated succesfully', user: result });
                })
                .catch(err => {
                    console.error(err);
                    sendJSONResponse(res, 500, { message: "Something went wrong. Cannot update password.", error: err });
                });
            });
        })
        .catch( err => console.log(err));
};

const { response } = require('express');
const UserProfile = require('./UserProfileModel');

const getUserProfiles = (req, res, next) => {
    UserProfile.find()
        .then(response => {
            res.json({ response });
        })
        .catch(error => {
            res.json({ message: error });
        });
};

const addUserProfile = (req, res, next) => {
    const { userId, firstName, lastName, email, contact, password } = req.body;

    const userProfile = new UserProfile({
        UserId: userId,
        FirstName: firstName,
        LastName: lastName,
        Email: email,
        Contact: contact,
        Password: password
    });

    // Save the user profile to the database
    userProfile.save()
        .then(response => {
            res.json({ response });
        })
        .catch(error => {
            res.json({ error });
        });
};

const updateUserProfile = (req, res, next) => {
    const { firstName, lastName, email, contact, password } = req.body;

    UserProfile.findOneAndUpdate(
        { UserId: req.params.UserId }, 
        { $set: { FirstName: firstName, LastName: lastName, Email: email, Contact: contact, Password: password } },
        { new: true }
    )
        .then(response => {
            res.json({ response });
        })
        .catch(error => {
            res.json({ error });
        });
};

const deleteUserProfile = (req, res, next) => {
    const userId = req.params.userId;

    UserProfile.deleteOne({
        UserId: userId
    })
        .then(response => {
            res.json({ response });
        })
        .catch(error => {
            res.json({ error });
        });
};

const getUserProfileById = (req, res, next) => {
    const userId = req.params.userId;

    UserProfile.findOne({ UserId: userId })
        .then(userProfile => {
            if (!userProfile) {
                return res.json({ message: 'User profile not found' });
            }
            res.json({ userProfile });
        })
        .catch(error => {
            res.json({ error: error.message });
        });
};

module.exports = { getUserProfiles, addUserProfile, updateUserProfile, deleteUserProfile, getUserProfileById };

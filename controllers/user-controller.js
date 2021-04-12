const { User } = require('../models');

const userController = {
    //get all users
    getAllUser(req, res) {
        User.find({})
            .populate({
                path: 'thoughts',
                select: '-__v'
            })
            .select('-__v')
            .then(dbUserData => res.json(dbUserData))
            .catch(err => {
                console.log(err)
                res.sendStatus(400)
            })
    },

    //get user by id
    getUserById({ params}, res) {
        User.findOne({ _id: params.id })
            .populate({
                path: 'thoughts',
                select: '-__v'
            })
            .populate({
                path: "friends",
                select: "-__v",
            })
            .select('-__v')
            .then(dbUserData => res.json(dbUserData))
            .catch(err => {
                console.log(err);
                res.sendStatus(400)
            })
    },

    //create a user
    createUser({ body }, res) {
        User.create(body)
            .then(dbUserData => res.json(dbUserData))
            .catch(err => res.json(err))
    },

    //update user by id
    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id }, body, { new: true })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user with this id!' })
                    return;
                }
                res.json(dbUserData)
            })
            .catch(err => res.json(err))
    },

    // delete user by id
    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
            .then(dbUserData => res.json(dbUserData))
            .catch(err => res.json(err))
    },

    // add friend
    addFriend({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.userId}, { $push: {friends: params.friendId} }, { new: true })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user wtih this id!' })
                    return
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err))
    },

    //delete friend
    deleteFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $pull: { friends: params.friendId } },
            { new: true }
        )
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user with this id!' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.json(err));
    },
}

module.exports = userController
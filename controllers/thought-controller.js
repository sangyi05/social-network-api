const { Thought, User, Reaction } = require('../models')

const thoughtController = {
    getAllThoughts(req, res) {
        Thought.find({})
            .populate({
                path: 'thought',
                select: '-__v'
            })
            .select('-__v')
            .sort({ _id: -1 })
            .then(dbUserData => res.json(dbUserData))
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            });
    },

    //get thought by id
    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.thoughtId })
            .then(dbUserData => res.json(dbUserData))
            .catch(err => res.json(err))
    },

    //create new thought and add to user
    addThought({ params, body}, res) {
        console.log(body)
        Thought.create(body)
            .then(({ _id }) => {
                return User.findOneAndUpdate(
                    { _id: params.userId },
                    { $push: { thought: _id} },     
                    { new: true }
                )
            })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user with this id!'})
                    return
                }
                res.json(dbUserData)
            })
            .catch(err => res.json(err))
    },

    //update thought by id
    updateThought({ params, body}, res) {
        Thought.findOneAndUpdate({ _id: params.id }, body, { new: true })
        .then(dbUserData => {
            if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id!' });
            return
            }
            res.json(dbUserData);
        })
        .catch(err => res.json(err));
    },

    //delete thought by id
    removeThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.thoughtId })
            .then((dbUserData) => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No thought found with this id!'})
                    return
                }
                res.json(dbUserData)
            })
            .catch((err) => res.json(err))
    },

    //add reaction to thought
    addReaction({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.thoughtId }, { $push: { reaction: body } }, { new: true })
            .then(dbUserData => {
                if (!dbuserData) {
                    res.status(404).json({ message: 'No user found with this id!'})
                    return
                }
                res.json(dbUserData)
            })
            .catch(err => res.json(err))
    },

    //delete reply
    removeReaction({ params }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reaction: { reactionId: params.reactionId }}},
            { new: true }
        )
            .then(dbUserData => res.json(dbUserData))
            .catch(err => res.json(err))
    }
}

module.exports = thoughtController
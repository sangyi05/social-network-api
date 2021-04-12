const { Schema, model } = require('mongoose')

const UserSchema = new Schema (
    {
        username: {
            type: String,
            unique: true,
            required: 'Username is required',
            trim: true
        },

        email: {
            type: String, 
            required: 'Email is required',
            unique: true, 
            match: [/.+@.+\..+/]
        },

        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Thoughts'
            }
        ],

        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
    },
    {
        toJSON: {
            virtuals: true,
        },
        id: false
    }
)

UserSchema.virtual('friendCount').get(function() {
    return this.friends.reduce(
        (total, friends) => total + friends.length + 1, 
        0
    )
})
const User = model('User', UserSchema)

module.exports = User;
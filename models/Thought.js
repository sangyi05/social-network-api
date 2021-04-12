const { Schema, model, Types } = require('mongoose')

const ReactionsSchema = new Schema (
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId()
        },
        reactionBody: {
            type: String,
            required: 'Text is required.',
            maxLength: 280
        },
        username: {
            type: String,
            required: 'Username is required.'
        },
        createdAt: {
            type: Date,
            default: Date.now,
        }
    }
)

const ThoughtSchema = new Schema (
    {
        username: {
            type: String,
            required: true
        }, 
        thoughtText: {
            type: String,
            required: 'Please enter your text.',
            minLength: 1,
            maxLength: 280
        }, 
        createdAt: {
            type: Date,
            default: Date.now,
        },
        reactions: [ReactionsSchema]
    },
    {
        toJSON: {
            virtuals: true,
            getters: true
        },
        id: false
    }
)

ThoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length
})

const Thought = model('Thoughts', ThoughtSchema)

module.exports =  Thought 
const bcrypt = require('bcryptjs')
const Event = require('../../models/event')
const User = require('../../models/user')

const userID = "5e8dfa6e2c1a5c17a85a94c8"

const user = async userId =>
{
    try {
        const user = await User.findById(userId)
        return { ...user._doc, createdEvents: events.bind(this, user._doc.createdEvents) }
    }
    catch(err) {
        throw err
    }
}

const events = async eventIds =>
{
    try {
        const events = await Event.find({ _id: { $in: eventIds } })
        return events.map(event => {
            return { 
                ...event._doc,
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, event.creator)
            }
        })
    }
    catch(err) {
        throw err
    }
}

module.exports = {
    events: async () => {
        try{

            const events = await Event.find().populate('creator')
            return events.map(event =>
            {
                return {
                    ...event._doc,
                    date: new Date(event._doc.date).toISOString(),
                    creator: user.bind(this, event._doc.creator)
                }
            })
        }
        catch(err)
        {
            throw err
        }
    },
    createEvent: async args => {
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: userID
        })
        let createdEvent
        try {
            const result = await event.save()

            createdEvent = { 
                ...result._doc, 
                _id: result._doc._id.toString(),
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, result._doc.creator) 
            }

            const creator = await User.findById(userID)
            
            if (!creator) {throw new Error(('No User with that ID'))}
            creator.createdEvents.push(event)
            await creator.save()
            
            return createdEvent
        }
        catch(err) {
            console.log(err)
            throw err
        }
    },
    createUser: async args => {
        try {
            const existingUser = await User.findOne({email: args.userInput.email})
            if (existingUser) {
                throw new Error('User exists already.')
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12)
            const user = new User({
                email: args.userInput.email,
                password: hashedPassword,
            })
            const result = await user.save()
            return {...result._doc, password: null}
        }
        
        catch(err) {throw err}
    }
}
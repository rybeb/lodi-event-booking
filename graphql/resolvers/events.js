const Event = require('../../models/event');
const User = require('../../models/user');
const { transformEvent } = require('./merge');

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map(event => {
        return transformEvent(event);
      });
    } catch (err) {
      throw err;
    }
  },
  createEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated');
    }
    const event = new Event({
      name: args.eventInput.name,
      description: args.eventInput.description,
      location: args.eventInput.location,
      starts: new Date(args.eventInput.starts),
      ends: args.eventInput.ends ? new Date(args.eventInput.ends) : null,
      creator: req.userId
    });
    try {
      const result = await event.save();
      const creator = await User.findById(req.userId);
      if (!creator) {
        throw new Error('User not found.');
      }
      creator.createdEvents.push(event);
      await creator.save();
      return transformEvent(result);
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  deleteEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated');
    }
    try {
      const event = await Event.findById(args.eventId).populate('event');
      await Event.deleteOne({ _id: args.eventId });
      return transformEvent(event);
    } catch (err) {
      throw err;
    }
  }
};

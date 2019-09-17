const Event = require('../../models/event');
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
  createEvent: async args => {
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: '5d7ff88881a79b15cc6c439a'
    });
    try {
      const result = await event.save();
      const creator = await User.findById('5d7ff88881a79b15cc6c439a');
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
  }
};

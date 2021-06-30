const Event = require("../../models/event");
const User = require("../../models/user");
const { user } = require("./merge");

const transformEvent = (event) => {
  return {
    ...event._doc,
    date: new Date(event._doc.date).toISOString(),
    creator: user.bind(this, event.creator),
  };
};

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map((event) => {
        return transformEvent(event);
      });
    } catch (err) {
      throw err;
    }
  },
  createEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated");
    }

    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: req.userId,
    });
    let createdEvent;
    try {
      const result = await event.save();
      createdEvent = transformEvent(result);
      const creator = await User.findById(req.userId);
      if (!creator) {
        throw new Error("User not found");
      }
      creator.createdEvents.push(event);
      await creator.save();
      return createdEvent;
    } catch (err) {
      console.log(err);
      throw new Error("Could not create a new Event", err);
    }
  },
};

// const Event = require("../../models/event");

// const { transformEvent } = require("./merge");

// const transformEvent = (event) => {
//   return {
//     ...event._doc,
//     date: new Date(event._doc.date).toISOString(),
//     creator: user.bind(this, event._doc.creator),
//   };
// };

// module.exports = {
//   events: async () => {
//     try {
//       const events = await Event.find();
//       return events.map((event) => {
//         return transformEvent(event);
//       });
//     } catch (err) {
//       throw err;
//     }
//   },
//   createEvent: async (args) => {
//     const event = new Event({
//       title: args.eventInput.title,
//       description: args.eventInput.description,
//       price: +args.eventInput.price,
//       date: new Date(args.eventInput.date),
//       creator: "5c0fbd06c816781c518e4f3e",
//     });
//     let createdEvent;
//     try {
//       const result = await event.save();
//       createdEvent = transformEvent(result);
//       const creator = await User.findById("5c0fbd06c816781c518e4f3e");

//       if (!creator) {
//         throw new Error("User not found.");
//       }
//       creator.createdEvents.push(event);
//       await creator.save();

//       return createdEvent;
//     } catch (err) {
//       console.log(err);
//       throw err;
//     }
//   },
// };
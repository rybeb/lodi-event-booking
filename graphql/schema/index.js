const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type Booking {
        _id: ID!
        event: Event!
        user: User!
        createdAt: String!
        updatedAt: String!
    }

    type Event {
        _id: ID!
        name: String!
        location: String!
        description: String!
        starts: String!
        ends: String!
        creator: User!
    }

    type User {
      _id: ID!
      email: String!
      password: String
      createdEvents: [Event!]
    }

    type AuthData {
        userId: ID!
        token: String!
        tokenExpiration: Int!
    }

    input EventInput {
        name: String!
        location: String!
        description: String!
        starts: String!
        ends: String!
    }

    input UserInput {
      email: String!
      password: String!
    }

    type RootQuery {
        events: [Event!]!
        bookings: [Booking!]!
    }
    
    type RootMutation {
        login(email: String!, password: String!): AuthData!
        createUser(userInput: UserInput): User
        createEvent(eventInput: EventInput): Event
        deleteEvent(eventId: ID!): Event!
        bookEvent(eventId: ID!): Booking!
        cancelBooking(bookingId: ID!): Event!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
    `);

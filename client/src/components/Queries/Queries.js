import gql from 'graphql-tag';

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      userId
      token
      tokenExpiration
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($email: String!, $password: String!) {
    createUser(userInput: { email: $email, password: $password }) {
      _id
      email
    }
  }
`;

export const CREATE_EVENT = gql`
  mutation CreateEvent(
    $name: String!
    $location: String!
    $description: String!
    $starts: String!
    $ends: String!
  ) {
    createEvent(
      eventInput: {
        name: $name
        location: $location
        description: $description
        starts: $starts
        ends: $ends
      }
    ) {
      _id
      name
      location
      description
      starts
      ends
    }
  }
`;

export const DELETE_EVENT = gql`
  mutation DeleteEvent($id: ID!) {
    deleteEvent(eventId: $id) {
      _id
      name
    }
  }
`;

export const PAST_EVENT = gql`
  mutation PastEvent($id: ID!) {
    pastEvent(eventId: $id) {
      _id
      name
    }
  }
`;

export const FETCH_EVENTS = gql`
  query FetchEvents {
    events {
      _id
      name
      location
      description
      starts
      ends
      creator {
        _id
        email
      }
    }
  }
`;

export const BOOK_EVENT = gql`
  mutation BookEvent($id: ID!) {
    bookEvent(eventId: $id) {
      _id
      createdAt
      updatedAt
    }
  }
`;

export const FETCH_BOOKINGS = gql`
  query FetchBookings {
    bookings {
      _id
      createdAt
      event {
        _id
        name
        location
        description
        starts
        ends
        creator {
          _id
          email
        }
      }
    }
  }
`;

export const CANCEL_BOOKING = gql`
  mutation CancelBooking($id: ID!) {
    cancelBooking(bookingId: $id) {
      _id
      name
    }
  }
`;

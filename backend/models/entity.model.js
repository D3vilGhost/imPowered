import mongoose from "mongoose";

// not using required at fields here as data will be validated at frontend

const EntitySchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    phoneNumber: {
        type: Number
    },
    password: {
        type: String
    },
    address: {
        type: String
    },
    about: {
        type: String
    },
    destinationType: {
        type: String,
        default: ''
    },
    wheelchair: {
        type: String,
        default: ''
    },
    lift: {
        type: String,
        default: ''
    },
    ramps: {
        type: String,
        default: ''
    },
    restrooms: {
        type: String,
        default: ''
    },
    helpers: {
        type: String,
        default: ''
    },
    announcementSystem: {
        type: String,
        default: ''
    },
    automaticDoors: {
        type: String,
        default: ''
    },
    accessibleToilets: {
        type: String,
        default: ''
    }
});
const Entity = mongoose.model('Entity', EntitySchema);
export default Entity;
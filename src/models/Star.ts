import mongoose from 'mongoose'

export interface IStar extends mongoose.Document {
    message: string,
    guild: string,
    channel: string,
    author: string,
    starboardMessage: string,
    starCount: number,
    starredBy: Array<string>
}

const Schema = mongoose.Schema
const starsSchema = new Schema({
    message: {
        type: String,
        unique: true,
        required: true
    },
    guild: {
        type: String,
        required: true
    },
    channel: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    starboardMessage: {
        type: String,
        required: false
    },
    starCount: {
        type: Number,
        required: true,
        default: 1
    },
    starredBy: {
        type: Array,
        required: true
    }
})

const Star = mongoose.model<IStar>('stars', starsSchema)

export default Star
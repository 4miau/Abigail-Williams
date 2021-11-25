import mongoose from 'mongoose'

export interface IThread extends mongoose.Document {
    id: number,
    guildID: string,
    channelID: string,
    userID: string,
    startedInDMs: boolean,
    startedBy: Array<string>,
    closedBy: string,
    openingMessage: string,
    openingReason: string,
    threadClosed: boolean,
    createdAt: Date
}

const Schema = mongoose.Schema
const threadsSchema = new Schema({
    id: {
        type: Number,
        unique: true,
        required: true
    },
    guildID: {
        type: String,
        required: true
    },
    channelID: {
        type: String,
        required: true
    },
    userID: {
        type: String,
        required: true
    },
    startedInDMs: {
        type: Boolean,
        default: true
    },
    startedBy: {
        type: String,
        required: false
    },
    closedBy: {
        type: String,
        required: false
    },
    openingMessage: {
        type: String,
        required: true
    },
    openingReason: {
        type: String,
        required: false
    },
    threadClosed: {
        type: Boolean,
        required: true,
        default: false
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
}, { timestamps: true })

const Threads = mongoose.model<IThread>('threads', threadsSchema)

export default Threads
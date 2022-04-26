import mongoose from 'mongoose'

export interface IGiveaway extends mongoose.Document {
    id: number,
    channel: string,
    message: string,
    reward: string,
    winners: number,
    end: number
}

const Schema = mongoose.Schema
const giveawaySchema = new Schema({
    id: {
        type: Number,
        unique: true,
        required: true
    },
    channel: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    reward: {
        type: String,
        required: false
    },
    winners: {
        type: Number,
        required: true
    },
    end: {
        type: Number,
        required: true
    }
}, { collection: 'giveaways' })

const Giveaways = mongoose.model<IGiveaway>('giveaways', giveawaySchema)

export default Giveaways
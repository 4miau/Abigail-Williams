import mongoose from 'mongoose'

export interface IStatus extends mongoose.Document {
    id: number,
    presenceType: string,
    presenceMode: string,
    presenceMessage: string,
    url: string
}

const Schema = mongoose.Schema
const statusSchema = new Schema({
    id: {
        type: Number,
        unique: true,
        required: true
    },
    presenceType: {
        type: String,
        required: false
    },
    presenceMode: {
        type: String,
        required: false
    },
    presenceMessage: {
        type: String,
        required: false
    },
    url: {
        type: String,
        required: false
    },
}, { collection: 'botstatus'})

const botStatus = mongoose.model<IStatus>('botstatus', statusSchema)

export default botStatus
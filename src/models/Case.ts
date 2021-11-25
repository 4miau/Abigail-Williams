import mongoose from 'mongoose'

export interface ICase extends mongoose.Document {
    id: number,
    guildID: string,
    messageID: string,
    logMessageID: string,
    caseID: number,
    refID: number,
    targetID: string,
    targetTag: string,
    action: number,
    modID: string,
    modTag: string,
    reason: string,
    actionDuration: Date,
    actionComplete: boolean,
    createdAt: Date
}

const Schema = mongoose.Schema
const caseSchema = new Schema({
    id: {
        type: Number,
        unique: true,
        required: true
    },
    guildID: {
        type: String,
        required: true,
    },
    messageID: {
        type: String,
        required: false,
    },
    logMessageID: {
        type: String,
        required: false
    },
    caseID: {
        type: Number,
        required: true,
    },
    refID: {
        type: Number,
        required: false
    },
    targetID: {
        type: String,
        required: true
    },
    targetTag: {
        type: String,
        required: true
    },
    action: {
        type: Number,
        required: true
    },
    modID: {
        type: String,
        required: false
    },
    modTag: {
        type: String,
        required: false
    },
    reason: {
        type: String,
        required: true
    },
    actionDuration: {
        type: Number,
        required: false,
    },
    actionComplete: {
        type: Boolean,
        required: true,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true })

const Case = mongoose.model<ICase>('case', caseSchema)

export default Case

//Thanks iCrawl
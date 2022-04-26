import mongoose from 'mongoose'

export interface IReminder extends mongoose.Document {
    id: string,
    snowflake: string,
    guildID: string,
    reminderName: string,
    note: string,
    dateTimeDue: Date
}

const Schema = mongoose.Schema
const reminderSchema = new Schema({
    id: {
        type: Number,
        unique: true,
        required: true
    },
    snowflake: {
        type: String,
        required: true
    },
    guildID: {
        type: String,
        required: false
    },
    reminderName: {
        type: String,
        required: true
    },
    note: {
        type: String,
        required: true
    },
    dateTimeDue: {
        type: Date,
        required: false
    }
}, { collection: 'reminders' })

const Reminder = mongoose.model<IReminder>('reminders', reminderSchema)

export default Reminder
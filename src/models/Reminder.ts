import mongoose from 'mongoose'

export interface IReminder extends mongoose.Document {
    id: string,
    snowflake: string,
    guildID: string,
    note: string,
    dateTimeDue?: Date
}

const Schema = mongoose.Schema
const reminderSchema = new Schema({
    id: {
        type: String,
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
    note: {
        type: String,
        required: true
    },
    dateTimeDue: {
        type: Date,
        required: false
    }
}, { collection: 'reminders' })

const Reminders = mongoose.model<IReminder>('reminders', reminderSchema)
export default Reminders
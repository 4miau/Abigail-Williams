import mongoose from 'mongoose'

export interface IProfile extends mongoose.Document {
    userID: string,
    about: string,
    motto: string,
    xp: number,
    level: number,
    coins: number,
    items: Array<Object>,
    guildstats: { guild: string, points: number, xp: number, level: number, nextWork: Date }[],
    guilditems: { guild: string, items: Array<Object> }[],
}

const Schema = mongoose.Schema
const profileSchema = new Schema({
    userID: {
        type: String,
        unique: true,
        required: true
    },
    about: {
        type: String,
        required: false,
        default: 'It\'s pretty empty here.'
    },
    motto: {
        type: String,
        required: false,
        default: 'Nothing special here.'
    },
    xp: {
        type: Number,
        required: true,
        default: 0
    },
    level: {
        type: Number,
        required: true,
        default: 0
    },
    coins: {
        type: Number,
        required: true,
        default: 100
    },
    items: {
        type: Array,
        required: false
    },
    guildstats: {
        type: Schema.Types.Mixed,
        required: false
    },
    guilditems: {
        type: Schema.Types.Mixed,
        required: false
    },
})

const Profile = mongoose.model<IProfile>('profile', profileSchema)

export default Profile
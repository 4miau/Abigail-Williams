import mongoose from 'mongoose'

export interface IMemberData extends mongoose.Document {
    memberID: string,
    memberTag: string,
    activeWarns: number
}

const Schema = mongoose.Schema
const memberDataSchema = new Schema({
    memberID: {
        type: String,
        unique: true,
        required: true
    },
    memberTag: {
        type: String,
        required: true,
        default: 'invalid#0000'
    },
    activeWarns: {
        type: Number,
        required: false,
        default: 0
    }
}, { collection: 'memberdata' })

const MemberData = mongoose.model<IMemberData>('memberdata', memberDataSchema)

export default MemberData
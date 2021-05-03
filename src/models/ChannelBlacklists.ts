import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('channelblacklists')
export class ChannelBlacklists {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({type: 'varchar', length: 22})
    guild!: string

    @Column({type: 'varchar', array: true})
    channels!: string[]
}
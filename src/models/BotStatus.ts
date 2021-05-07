import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('botstatus')
export class BotStatus {
    @PrimaryColumn({ type: 'int2'})
    id!: number

    @Column({type: 'text', default: 10})
    activityType!: string

    @Column({type: 'text', default: 16})
    type!: string

    @Column({type: 'text', length: 32})
    status!: string

    @Column({type: 'text', length: 40})
    url!: string
}
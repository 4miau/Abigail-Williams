import { Entity, Column, PrimaryColumn } from 'typeorm'

@Entity('bans')
export class Bans {
    @PrimaryColumn({type: 'varchar', length: 22})
    guild!: string

    @Column({type: 'varchar', length: 22})
    user!: string

    @Column({type: 'varchar', length: 22})
    moderator!: string

    @Column({type: 'varchar', length: 4})
    duration!: number

    @Column({type: 'text'})
    reason!: string
}
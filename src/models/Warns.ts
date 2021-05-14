import { Entity, Column, PrimaryColumn } from 'typeorm'

@Entity('warns')
export class Warns {
    @PrimaryColumn({type: 'varchar', length: 22})
    guild!: string

    @Column({type: 'varchar', length: 22})
    user!: string

    @Column({type: 'varchar', length: 22})
    moderator!: string

    @Column({type: 'text'})
    reason!: string
}
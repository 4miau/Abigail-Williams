import { Entity, Column, PrimaryColumn } from "typeorm"

@Entity('mutes')
export class Mutes {
    @PrimaryColumn({type: 'varchar', length: 22})
    guild!: string

    @Column({type: 'varchar', length: 22})
    user!: string

    @Column({type: 'varchar', length: 22})
    moderator!: string

    @Column({type: 'varchar', length: 10})
    duration!: string

    @Column({type: 'varchar', length: 22})
    reason!: string
}
import { Entity, Column, PrimaryColumn } from 'typeorm'

@Entity('muterole')
export class MuteRole {
    @PrimaryColumn({type: 'varchar', length: 22})
    guild!: string

    @Column({type: 'varchar', length: 22})
    role!: string
}
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity('muterole')
export class MuteRole {
    @PrimaryGeneratedColumn()
    id!: number
    
    @Column({type: 'varchar', length: 22})
    guild!: string

    @Column({type: 'varchar', length: 22})
    role!: string
}
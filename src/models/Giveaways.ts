import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('giveaways')
export class Giveaways {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ 'type': 'varchar', length: 22})
    channel!: string
    
    @Column({ 'type': 'varchar', length: 22})
    message!: string

    @Column({ type: 'varchar', nullable: true})
    reward!: string

    @Column({ 'type': 'integer' })
    winners!: number

    @Column({ 'type': 'integer' })
    end!: number
}
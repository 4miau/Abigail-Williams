import { Entity, PrimaryColumn, Column, Index } from "typeorm";

@Entity('stars')
export class Stars {
    @PrimaryColumn({ 'type': 'varchar', 'length': 22})
    message!: string

    @Index()
    @Column({ 'type': 'varchar', 'length': 22})
    guild!: string
    
    @Column({ 'type': 'varchar', 'length': 22})
    channel!: string

    @Column({ 'type': 'varchar', 'length': 22})
    author!: string

    @Column({ 'type': 'varchar', nullable: true, 'length': 22})
    starboardMessage!: string

    @Column({ 'type': 'int', default: 1})
    starCount!: number

    @Column({ 'type': 'simple-array', array: true})
    starredBy!: string[]
}
import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";
import { now } from "moment";

@Entity('cases')
export class Case {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ type: 'varchar', length: 22 })
    guildID!: string

    @Column({ type: 'varchar', length: 22, nullable: true })
    messageID!: string

    @Index()
    @Column()
    caseID!: number

    @Column({ nullable: true })
    refID!: number

    @Column({ type: 'varchar', length: 22 })
    targetID!: string

    @Column({ type: 'text' })
    targetTag!: string

    @Column({ type: 'int2' })
    action!: number

    @Column({ type: 'varchar', nullable: true })
    modID!: string

    @Column({ type: 'text', nullable: true })
    modTag!: string

    @Column({ type: 'varchar' })
    reason!: string

    @Column({ type: 'text', nullable: true })
    actionDuration!: Date

    @Index()
    @Column({ default: true })
    actionComplete!: boolean

    @Column({ type: 'text', default: () => 'DATETIME(\'now\')' })
    createdAt!: Date
}

//Thanks iCrawl
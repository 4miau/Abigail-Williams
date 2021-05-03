import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('modmailsetups')
export class ModmailSetup {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({type: 'varchar', length: 22})
    guild!: string

    @Column({type: 'varchar', length: 22})
    category!: string

    @Column({type: 'varchar', length: 22})
    modchannel!: string

    @Column({type: 'varchar', length: 22})
    modrole!: string
}
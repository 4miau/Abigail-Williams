import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity('memberdata')
export class MemberData {
    @PrimaryColumn({ unique: true, length: 22 })
    memberID!: string

    @Column({ type: 'integer', nullable: true, default: () => '0' })
    activeWarns!: number
}
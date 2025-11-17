import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
} from 'typeorm';

export enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
}

export enum UserStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ name: 'full_name' })
    fullName!: string;

    @Column({ name: 'date_of_birth', type: 'date' })
    dateOfBirth!: Date;

    @Column({ unique: true })
    @Index()
    email!: string;

    @Column()
    password!: string;

    @Column({
        type: 'varchar',
        default: UserRole.USER,
    })
    role!: UserRole;

    @Column({
        type: 'varchar',
        default: UserStatus.ACTIVE,
    })
    status!: UserStatus;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;

}

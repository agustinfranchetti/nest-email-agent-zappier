import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Student {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	email: string;

	@Column({ nullable: true })
	age?: number;

	@Column({ nullable: true })
	country?: string;

	@Column({ nullable: true })
	finished_highschool?: string;

	@Column({ nullable: true })
	interested_role?: string;

	@Column({ nullable: true })
	college_start_date?: string;

	@Column({ nullable: true })
	college_name?: string;

	@Column({ nullable: true })
	college_major?: string;

	// sessionId column
	@Column({ nullable: true })
	sessionId?: string;
}

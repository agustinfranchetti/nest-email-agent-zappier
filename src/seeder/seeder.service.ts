import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../student/student.entity';
import { createRandomStudents } from './students.seeder';

@Injectable()
export class SeederService {
	constructor(
		@InjectRepository(Student)
		private studentRepository: Repository<Student>,
	) {}

	async seedDatabase() {
		const randomStudents = await createRandomStudents(1);
		return this.studentRepository.save(randomStudents);
	}
}

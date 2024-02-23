// seeders/students.seeder.ts
import { faker } from '@faker-js/faker';
import { Student } from '../student/student.entity';

export const createRandomStudents = async (amount: number) => {
	const students: Partial<Student>[] = [];

	for (let i = 0; i < amount; i++) {
		students.push({
			name: faker.person.fullName(),
			email: 'agustinfranchetti@gmail.com',
			age: faker.number.int({ min: 18, max: 70 }),
		});
	}

	return students;
};

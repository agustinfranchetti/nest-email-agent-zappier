import { Controller, Get, Delete, Post } from '@nestjs/common';
import { StudentService } from './student.service';

@Controller('students')
export class StudentController {
	constructor(private readonly studentService: StudentService) {}

	@Get('incomplete')
	getIncomplete() {
		return this.studentService.findIncomplete();
	}
	@Post('contact')
	async contactIncompleteStudents() {
		return this.studentService.contactIncompleteStudents();
	}
	@Delete('all')
	async deleteAll() {
		await this.studentService.deleteAll();
		return { message: 'All students deleted.' };
	}
}

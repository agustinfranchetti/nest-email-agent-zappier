import { Controller, Post } from '@nestjs/common';
import { SeederService } from './seeder.service';

@Controller('seeder')
export class SeederController {
	constructor(private readonly studentService: SeederService) {}

	@Post('/seed')
	async seedDatabase() {
		const students = await this.studentService.seedDatabase();
		return { message: 'Seeding complete!', students };
	}
}

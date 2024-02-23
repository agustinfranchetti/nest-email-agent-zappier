import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './student.entity';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [
		ConfigModule.forRoot({}),
		TypeOrmModule.forFeature([Student]),
		HttpModule,
	],
	providers: [StudentService],
	controllers: [StudentController],
})
export class StudentModule {}

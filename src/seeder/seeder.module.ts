import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from '../student/student.entity';
import { SeederController } from './seeder.controller';
import { SeederService } from './seeder.service';
@Module({
	imports: [TypeOrmModule.forFeature([Student])],
	controllers: [SeederController],
	providers: [SeederService],
})
export class SeederModule {}

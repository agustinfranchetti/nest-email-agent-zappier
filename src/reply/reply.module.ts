import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReplyController } from './reply.controller';
import { HttpModule } from '@nestjs/axios';
import { Student } from '../student/student.entity';
import { ReplyService } from './reply.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([Student]),
		ConfigModule.forRoot({}),
		HttpModule,
	],
	controllers: [ReplyController],
	providers: [ReplyService],
})
export class ReplyModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { StudentModule } from './student/student.module';
import { SeederModule } from './seeder/seeder.module';
import { ReplyModule } from './reply/reply.module';
import { HttpModule } from '@nestjs/axios';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the environment variables globally available
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'admin',
      password: 'admin',
      database: 'students',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    HttpModule,
    StudentModule,
    SeederModule,
    ReplyModule,
  ],
})
export class AppModule {}

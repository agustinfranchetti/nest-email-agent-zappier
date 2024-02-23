import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './student.entity';
import { HttpService } from '@nestjs/axios';
import { Resend } from 'resend';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    private readonly httpService: HttpService,
  ) {}

  async findIncomplete(): Promise<Student[]> {
    return (
      this.studentRepository
        .createQueryBuilder('student')
        .where(
          'name IS NULL OR email IS NULL OR country IS NULL OR age IS NULL OR finished_highschool IS NULL OR interested_role IS NULL OR college_start_date IS NULL OR college_name IS NULL OR college_major IS NULL OR sessionId IS NULL',
        )
        .getMany() || []
    );
  }

  async deleteAll(): Promise<void> {
    await this.studentRepository.clear();
  }

  async contactIncompleteStudents(): Promise<any[]> {
    const resend = new Resend(process.env.RESEND_KEY);
    const incompleteStudents = await this.findIncomplete();
    const results = [];

    for (const student of incompleteStudents) {
      const query = `Soy Natalia de Eduqueo. Estoy invitando estudiantes dele xterior a estudiar en argentina. El estudiante en cuestion tiene estos datos """${JSON.stringify(
        student,
      )}""". Tu mision es invitar al estudiante, para lo cuale debes obtener los datos incompletos .Redacta un email que podrias utilizar para obtener dichos datos. Tu respuesta debe ser el cuerpo del email en formato html. NO ENVIES UN FORMULARIO`;

      const chatRequest = {
        query: `responde a {query} en el mismo tono e idioma que el estudiante, aunque no te vuelvas excesivamente informal.`,
        temperature: 0.8,
        conversationSession: student?.sessionId || '',
        systemTemplate: query,
        contextMaxResults: 2,
        contextScoreThreshold: 0.6,
      };
      const response = await firstValueFrom(
        this.httpService.post(
          'http://localhost:4100/apis/1f519a71-39e9-4eb0-a797-8a647af17522/ask',
          chatRequest,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${process.env.API_KEY}`,
            },
          },
        ),
      );
      //TODO: retorna sesion si es nuevo y se crea una session para ese email
      if (!student.sessionId) {
        student.sessionId = response?.data?.sessionId;
        await this.studentRepository.save(student);
      }
      const chatMessage = response?.data?.response;
      // Message to html
      const paragraphs = chatMessage.split('\n');
      const formattedChatMessage = paragraphs
        .map((paragraph: any) => `<p>${paragraph}</p>`)
        .join('');

      const emailData = await resend.emails.send({
        from: 'demo@rizt.dev',
        to: student.email,
        subject: `Asistente de email`,
        html: formattedChatMessage,
      });
      results.push({ student: student, emailData: emailData });
    }

    return results;
  }
}

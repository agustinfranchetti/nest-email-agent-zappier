import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Resend } from 'resend';
import { firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';
import { Student } from '../student/student.entity';

@Injectable()
export class ReplyService {
	constructor(
		@InjectRepository(Student)
		private studentRepository: Repository<Student>,
		private httpService: HttpService,
		private configService: ConfigService,
	) {}

	async findOrCreateStudent(email: string, name: string): Promise<Student> {
		let student = await this.studentRepository.query(
			`SELECT * FROM student WHERE email = $1`,
			[email],
		);
		if (!student.length) {
			student = await this.studentRepository.save({
				email: email,
				name: name,
			});
		}
		return student[0];
	}

	async handleReply(payload: any): Promise<any> {
		const resendApiKey = this.configService.get<string>('RESEND_API_KEY');
		const resend = new Resend(resendApiKey);

		const student = await this.findOrCreateStudent(
			payload.from_mail,
			payload.from_name,
		);

		const query = student?.sessionId
			? `Soy Natalia de Eduqueo. Estoy respondiendo a un estudiante del exterior interesado en estudiar en argentina. El estudinate me ha preguntado: ${payload.body}. Basándose en la información que tengo del estudiante: ` +
			  JSON.stringify(student) +
			  ` , ¿podrías redactar una respuesta adecuada en formato de email, incluyendo cualquier detalle adicional que deba considerar encaso de estudiar en argentina?.`
			: `Soy Natalia de Eduqueo. Estoy respondiendo a un estudiante del exterior interesado en estudiar en argentina. El estudinate me ha preguntado: ${payload.body}. Basándose en la información que tengo del estudiante: ` +
			  JSON.stringify(student) +
			  `sumada a la informacion que puede incluirse en el email, ¿podrías redactar una respuesta adecuada en formato de email, incluyendo cualquier detalle adicional que deba considerar encaso de estudiar en argentina?. No añadas una cantidad innecesaria de informacion`;

		const chatRequest = {
			query: `responde a ${query} en el mismo tono e idioma que el estudiante, aunque no te vuelvas excesivamente informal.`,
			temperature: 0.8,
			chatSession: student?.sessionId || '',
			systemTemplate: query,
			contextMaxResults: 2,
			contextScoreThreshold: 0.6,
		};
		const chatResponse = await firstValueFrom(
			this.httpService.post(
				'http://localhost:4100//apis/1f519a71-39e9-4eb0-a797-8a647af17522/ask',
				chatRequest,
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer zt-QRmEKaKsgHGJFkYvS6rK6aMDRXREzV2i5QM5Bs86e1IahLd`,
					},
				},
			),
		);
		//TODO: retorna sesion si es nuevo y se crea una session para ese email
		const chatMessage = chatResponse?.data?.response;
		// Message to html
		const paragraphs = chatMessage.split('\n');
		const formattedChatMessage = paragraphs
			.map((paragraph: any) => `<p>${paragraph}</p>`)
			.join('');

		const emailData = await resend.emails.send({
			from: 'demo@rizt.dev',
			to: [payload.from_mail],
			subject: `Re: ${payload.subject}`,
			html: formattedChatMessage,
		});

		return { data: chatResponse?.data?.data, emailData: emailData };
	}
	catch(error: string) {
		console.log(error);
		return error;
	}
}

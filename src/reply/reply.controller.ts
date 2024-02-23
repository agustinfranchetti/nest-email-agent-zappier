import { Controller, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { ReplyService } from './reply.service';

@Controller()
export class ReplyController {
	constructor(private readonly replyService: ReplyService) {}

	@Post('email')
	async handleWebhook(@Body() payload: any, @Res() res: Response) {
		try {
			const responseData = await this.replyService.handleReply(payload);
			res.status(200).json(responseData);
		} catch (error) {
			res.status(500).json({ error });
		}
	}
}

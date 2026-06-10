import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import nodemailer from "nodemailer";
import { CreateOrderDto } from "./dto";

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly config: ConfigService) {}

  async notifyOrder(order: CreateOrderDto, serviceTitle: string) {
    const host = this.config.get<string>("SMTP_HOST");
    const to = this.config.get<string>("MAIL_TO", "info@kratos.ru");
    const from = this.config.get<string>("MAIL_FROM", "site@kratos.local");

    if (!host) {
      this.logger.log(`SMTP is not configured. Order notification skipped for ${order.phone}`);
      return;
    }

    const transporter = nodemailer.createTransport({
      host,
      port: Number(this.config.get("SMTP_PORT", 587)),
      secure: false,
      auth: this.config.get("SMTP_USER")
        ? {
            user: this.config.get("SMTP_USER"),
            pass: this.config.get("SMTP_PASS")
          }
        : undefined
    });

    await transporter.sendMail({
      from,
      to,
      subject: `Новая заявка: ${serviceTitle}`,
      text: [
        `Имя: ${order.customerName}`,
        `Телефон: ${order.phone}`,
        `Услуга: ${serviceTitle}`,
        `Площадь/количество: ${order.area ?? "-"}`,
        `Комментарий: ${order.message ?? "-"}`
      ].join("\n")
    });
  }
}

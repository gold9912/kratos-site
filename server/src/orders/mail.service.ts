import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import nodemailer from "nodemailer";
import { CreateOrderDto } from "./dto";

export interface MailResult {
  status: "sent" | "skipped" | "failed";
  message: string;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly config: ConfigService) {}

  async notifyOrder(order: CreateOrderDto, serviceTitle: string) {
    const host = this.config.get<string>("SMTP_HOST");
    const port = Number(this.config.get("SMTP_PORT", 587));
    const secure = this.config.get("SMTP_SECURE", port === 465 ? "true" : "false") === "true";
    const to = this.config.get<string>("MAIL_TO", "info@kratos.ru");
    const from = this.config.get<string>("MAIL_FROM", "site@kratos.local");

    if (!host) {
      this.logger.log(`SMTP is not configured. Order notification skipped for ${order.phone}`);
      return {
        status: "skipped",
        message: "SMTP не настроен, письмо не отправлено"
      } satisfies MailResult;
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: this.config.get("SMTP_USER")
        ? {
            user: this.config.get("SMTP_USER"),
            pass: this.config.get("SMTP_PASS")
          }
        : undefined
    });

    try {
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

      return {
        status: "sent",
        message: `Письмо отправлено на ${to}`
      } satisfies MailResult;
    } catch (error) {
      this.logger.error("Order email was not sent", error);
      return {
        status: "failed",
        message: error instanceof Error ? error.message : "Ошибка отправки письма"
      } satisfies MailResult;
    }
  }
}

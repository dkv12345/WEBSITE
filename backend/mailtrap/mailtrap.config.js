import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";
dotenv.config();

export const mailtrapClient = new MailtrapClient({
    // Token là bắt buộc để xác thực tài khoản của bạn
    token: process.env.MAILTRAP_TOKEN, 
});

export const sender = {
  email: "hello@demomailtrap.co",
  name: "Khánh Vi",
};

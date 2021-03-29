import * as dotenv from "dotenv";

dotenv.config()

const config = {
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || '',
    TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID || ''
}

export default config
import * as dotenv from "dotenv";

dotenv.config()

const config = {
    DISCORD_WEBHOOK: process.env.DISCORD_WEBHOOK || ''
}

export default config
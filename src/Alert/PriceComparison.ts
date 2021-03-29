
import wait from '../utils/wait'
import INTERVALS from '../helpers/intervals'
import TelegramBot from 'node-telegram-bot-api'



import Alert from "./Alert";
import config from '../../config'

const bot = new TelegramBot(config.TELEGRAM_BOT_TOKEN, { polling: true });




export default class PriceComparison {

    alert: Alert

    price1: number | null
    price2: number | null

    date1: string | null
    date2: string | null

    constructor(alert: Alert) {
        this.alert = alert

        this.price1 = null
        this.price2 = null

        this.date1 = null
        this.date2 = null 
    }

    start = async () => {
        this.price1 = this.alert.currentPrice
        
        this.date1 = this.alert.currentdatetime

        await wait(INTERVALS[this.alert.interval])

        if(!this.alert.onCooldown) {
            this.price2 = this.alert.currentPrice
            this.date2 = this.alert.currentdatetime

            let percent = ((this.price2-this.price1)/this.price1)*100    
            if(Math.abs(percent) >= this.alert.percentPriceChange) {
                let trend = percent >= 0 ? 'up' : 'down'
                let isUp = trend == 'up' ? ' ! 🚀 ' : ''
                let message = `Price is ${trend} by ${percent.toFixed(2)}${isUp}\nInterval : ${this.alert.interval}\nPrice 1 : $${this.price1.toFixed(2)} - ${this.date1} \nPrice 2 : $${this.price2.toFixed(2)} - ${this.date2}\n ${percent.toFixed(2)}%`
                
                this.sendAlert(message)
                this.alert.startCooldown()
            }
        }

        this.alert.removePriceComparison(this)
    }

    private sendAlert = (message: string) => {
        bot.sendMessage(config.TELEGRAM_CHAT_ID, message)
        console.log("ALERT !")
    }
}
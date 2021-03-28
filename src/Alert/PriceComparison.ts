import api from '../api/binance'
import wait from '../utils/wait'
import INTERVALS from '../helpers/intervals'

import Alert from "./Alert";

import { Webhook, MessageBuilder } from 'discord-webhook-node'

import config from '../../config'

const hook = new Webhook(config.DISCORD_WEBHOOK);
const binance = new api()

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
        console.log("PriceComparison start")
        this.price1 = await binance.getPrice(this.alert.pair)
        
        this.date1 = new Date().toISOString()

        await wait(INTERVALS[this.alert.interval])

        if(!this.alert.onCooldown) {
            this.price2 = await binance.getPrice(this.alert.pair)
            this.date2 = new Date().toISOString()
            let percent = ((this.price2-this.price1)/this.price1)*100    
            if(Math.abs(percent) >= this.alert.percentPriceChange) {
                let trend = percent >= 0 ? 'up' : 'down'
                
                let message = new MessageBuilder()
                .setTitle('EGLD price alert')
                .addField('Interval:', this.alert.interval, true)
                .addField('Price 1:', this.price1.toFixed(2), true)
                .addField('Price 2:', this.price2.toFixed(2), true)
                .addField('Percent change:', percent.toFixed(2), true)
                
                this.sendAlert(message)
                this.alert.startCooldown()
            }
        }

        this.alert.removePriceComparison(this)

    }

    private sendAlert = (message: MessageBuilder) => {
        hook.send(message)
    }
}
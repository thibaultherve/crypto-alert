import wait from '../utils/wait'
import PriceComparison from './PriceComparison'

import { EventEmitter } from "events";



export default class Alert {
    
    readonly pair: string
    readonly interval: string
    readonly percentPriceChange: number
    readonly cooldown: number

    pricesComparison: Array<PriceComparison>

    onCooldown: boolean

    constructor(pair: string, interval: string, percentPriceChange: number, cooldown: number) {
        this.pair = pair
        this.interval = interval
        this.percentPriceChange = percentPriceChange
        this.cooldown = cooldown

        this.pricesComparison = []

        this.onCooldown = false
    }

    start = async () => {
        while(true) {
            let pc = new PriceComparison(this)
            this.pricesComparison.push(pc)
            pc.start()

            await wait(10)
        }
    }

    startCooldown = async () => {        
        this.onCooldown = true
        await wait (this.cooldown)
        this.onCooldown = false
    }

    removePriceComparison = (pc: PriceComparison) => {
        let index = this.pricesComparison.indexOf(pc)

        if(index > -1)
            this.pricesComparison.splice(index, 1)
        
        console.log('pc total', this.pricesComparison.length)
    }





}
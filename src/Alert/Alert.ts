import wait from '../utils/wait'
import PriceComparison from './PriceComparison'
import api from '../api/binance'

const binance = new api()

export default class Alert {
    
    readonly pair: string
    readonly interval: string
    readonly percentPriceChange: number
    readonly cooldown: number


    pricesComparison: Array<PriceComparison>
    currentPrice: number
    currentdatetime: string | null
    onCooldown: boolean

    constructor(pair: string, interval: string, percentPriceChange: number, cooldown: number) {
        this.pair = pair
        this.interval = interval
        this.percentPriceChange = percentPriceChange
        this.cooldown = cooldown

        this.pricesComparison = []
        this.currentPrice = 0
        this.currentdatetime = null
        this.onCooldown = false
    }

    start = async () => {

        while(true) {
            this.currentPrice = await binance.getPrice(this.pair)
            this.currentdatetime = new Date().toLocaleTimeString()

            let pc = new PriceComparison(this)

            this.pricesComparison.push(pc)
            
            pc.start()
            
            console.log('PC:', this.pricesComparison.length)
            await wait(1)
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
        
    }

}
import axios from 'axios'

const BINANCE_API_URL = 'https://api.binance.com/api/v3/'

export default class Api {
    constructor() {}

    getPrice = async(symbol: string) => {
        let response = await axios.get(`${BINANCE_API_URL}ticker/price?symbol=${symbol}`)
        return Number(response.data['price'])
    }
}
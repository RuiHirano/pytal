import moment, { Moment } from "moment";
import { v4 as uuid } from 'uuid';

export type ChartType = "m1" | "m5" | "m15" | "h1" | "h4" | "d1" | "w1"

export class Data {
    Chart: {
        m1: OHLCV[]
        m5: OHLCV[]
        m15: OHLCV[]
        h1: OHLCV[]
        h4: OHLCV[]
        d1: OHLCV[]
        w1: OHLCV[]
    }
    transactions: Transaction[]

    constructor() {
        this.Chart = {
            m1: [],
            m5: [],
            m15: [],
            h1: [],
            h4: [],
            d1: [],
            w1: [],
        }
        this.transactions = []
    }

    setChart(jsonArr: object[], type: ChartType) {
        try {

            const data: OHLCV[] = []
            jsonArr.forEach((json: any) => {
                //console.log("date", moment(json.date))
                if (moment(json.date).isSameOrBefore('2016-03-30') && moment(json.date).isSameOrAfter('2016-03-18')) {

                    data.push({
                        date: json.date,
                        open: json.open,
                        high: json.high,
                        low: json.low,
                        close: json.close,
                        volume: json.volume,
                    } as OHLCV)
                }
            })
            switch (type) {
                case "m1":
                    this.Chart.m1 = data
                    break;
                case "m5":
                    this.Chart.m5 = data
                    break;
                case "m15":
                    this.Chart.m15 = data
                    break;
                case "h1":
                    this.Chart.h1 = data
                    break;
                case "h4":
                    this.Chart.h4 = data
                    break;
                case "d1":
                    this.Chart.d1 = data
                    break;
                case "w1":
                    this.Chart.w1 = data
                    break;
                default:
                    break;
            }
            console.log("finish set chart", data, type)
        } catch (err) {
            console.log("setChart Error", err)
        }

    }

    setTransaction(jsonArr: object[]) {
        try {
            const data: Transaction[] = []
            jsonArr.forEach((json: any) => {
                data.push({
                    id: json.id,
                    date: json.date,
                    amount: json.amount,
                    price: json.price,
                    value: json.value,
                    symbol: json.symbol,
                } as Transaction)
            })
            this.transactions = data
        } catch (err) {
            console.log("setTransaction Error", err)
        }
    }
}

export class OHLCV {
    date: Moment
    open: number
    high: number
    low: number
    close: number
    volume: number

    constructor(date: Moment, open: number, high: number, low: number, close: number, volume: number) {
        this.date = date
        this.open = open
        this.high = high
        this.low = low
        this.close = close
        this.volume = volume
    }

    setJson(json: any) {
        try {
            this.date = json.date
            this.open = json.open
            this.high = json.high
            this.low = json.low
            this.close = json.close
            this.volume = json.volume
        } catch (err) {
            console.log("setOHLCV Error", err)
        }
    }

    toJson() {
        return {
            "date": this.date,
            "open": this.open,
            "high": this.high,
            "low": this.low,
            "close": this.close,
            "volume": this.volume
        }
    }
}

export class Transaction {
    id: string
    date: Moment
    amount: number
    price: number
    value: number  // - amount * price
    symbol: string // 株式名や通貨ペアなど

    constructor(date: Moment, amount: number, price: number, value: number, symbol: string) {
        this.id = uuid()
        this.date = date
        this.amount = amount
        this.price = price
        this.value = value
        this.symbol = symbol
    }

    setJson(json: any) {
        try {
            this.id = uuid()
            this.date = json.date
            this.amount = json.amount
            this.price = json.price
            this.value = json.value
            this.symbol = json.symbol
        } catch (err) {
            console.log("setTransaction Error", err)
        }
    }

    toJson() {
        return {
            "id": this.id,
            "date": this.date,
            "amount": this.amount,
            "price": this.price,
            "value": this.value,
            "symbol": this.symbol
        }
    }
}


export class Indicator {
    sma: SMA[]
    constructor() {
        this.sma = []
    }

}

export interface SMA {
    window: number
}
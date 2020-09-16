import { tsvParse, csvParse } from "d3-dsv";
import { timeParse } from "d3-time-format";
import { mockTransactions } from "./dataset/data";
import moment from 'moment'

function parseData(parse) {
    return function (d) {
        d.date = parse(d.date);
        d.open = +d.open;
        d.high = +d.high;
        d.low = +d.low;
        d.close = +d.close;
        d.volume = +d.volume;

        return d;
    };
}

const parseDate = timeParse("%Y-%m-%d");
const parseDateTime = timeParse("%Y-%m-%d %H:%M:%S");

export const getData = async () => {
    let dataset = []
    await fetch("https://cdn.rawgit.com/rrag/react-stockcharts/master/docs/data/MSFT.tsv")
        .then(response => response.text())
        .then(data => {
            console.log(tsvParse(data, parseData(parseDate)))
            tsvParse(data, parseData(parseDate))
            dataset = tsvParse(data, parseData(parseDate))
        })
    return dataset;
}


export const getM1Data = async () => {
    let dataset = []
    await fetch("https://cdn.rawgit.com/rrag/react-stockcharts/master/docs/data/bitfinex_xbtusd_1m.csv")
        .then(response => response.text())
        .then(data => csvParse(data, parseData(parseDateTime)))
        .then(data => {
            data.sort((a, b) => {
                return a.date.valueOf() - b.date.valueOf();
            });
            console.log("data4: ", data)
            dataset = data
        })
    return dataset;
}

export const getM5Data = async () => {
    let dataset = []
    await fetch("https://cdn.rawgit.com/rrag/react-stockcharts/master/docs/data/bitstamp_xbtusd_5m.csv")
        .then(response => response.text())
        .then(data => csvParse(data, parseData(parseDateTime)))
        .then(data => {
            data.sort((a, b) => {
                return a.date.valueOf() - b.date.valueOf();
            });
            console.log("data4: ", data)
            dataset = data
        })
    return dataset;
}

export const getM15Data = async () => {
    let dataset = []
    await fetch("https://cdn.rawgit.com/rrag/react-stockcharts/master/docs/data/bitstamp_xbtusd_15m.csv")
        .then(response => response.text())
        .then(data => csvParse(data, parseData(parseDateTime)))
        .then(data => {
            data.sort((a, b) => {
                return a.date.valueOf() - b.date.valueOf();
            });
            console.log("data4: ", data)
            const newData = [] //M15がM5と等しかったため対応
            data.forEach(item => {
                const minute = moment(item.date).minutes()
                if (minute === 15 || minute === 30 || minute === 45 || minute === 0) {
                    newData.push(item)
                }
            });
            dataset = newData
        })
    return dataset;
}

export const getH1Data = async () => {
    let dataset = []
    await fetch("https://cdn.rawgit.com/rrag/react-stockcharts/master/docs/data/bitstamp_xbtusd_1h.csv")
        .then(response => response.text())
        .then(data => csvParse(data, parseData(parseDateTime)))
        .then(data => {
            data.sort((a, b) => {
                return a.date.valueOf() - b.date.valueOf();
            });
            console.log("data4: ", data)
            dataset = data
        })
    return dataset;
}

export const getH4Data = async () => {
    let dataset = []
    await fetch("https://cdn.rawgit.com/rrag/react-stockcharts/master/docs/data/bitstamp_xbtusd_4h.csv")
        .then(response => response.text())
        .then(data => csvParse(data, parseData(parseDateTime)))
        .then(data => {
            data.sort((a, b) => {
                return a.date.valueOf() - b.date.valueOf();
            });
            console.log("data4: ", data)
            dataset = data
        })
    return dataset;
}


export const getTransactionData = async () => {
    let transactions = mockTransactions
    return transactions;
}
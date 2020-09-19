import axios from "axios"
import { OHLCV, Data, ChartType } from "../types";

const convertToChartData = (rowData: any) => {
    const data = new Data()
    const keys: ChartType[] = ["m1", "m5", "m15", "h1", "h4", "d1"]
    console.log(rowData)
    const rowChartData = rowData["chart"]
    const rowTransactionData = rowData["transactions"]
    keys.forEach((key: ChartType) => {
        if (rowChartData[key].length !== 0) {
            console.log(key)
            data.setChart(JSON.parse(rowChartData[key]), key)
        }
    })
    if (rowTransactionData.length !== 0) {
        data.setTransaction(JSON.parse(rowTransactionData))
    }
    return data
}

export const fetchData = async () => {
    console.log("tes2")
    const rowData = await axios(
        {
            url: "/data",
            method: 'get',
            baseURL: 'http://localhost:8000',
        }
    )
    console.log("tes", rowData)
    const chartData = convertToChartData(rowData.data)
    console.log("chart: ", chartData)
    return chartData
}
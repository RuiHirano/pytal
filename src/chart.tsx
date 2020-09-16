import React from "react";
import PropTypes from "prop-types";
import moment, { Moment } from 'moment'
//@ts-ignore
import { scaleTime } from "d3-scale";
//@ts-ignore
import { utcDay, utcMinute, utcHour } from "d3-time";
//@ts-ignore
import { timeFormat } from "d3-time-format";
//@ts-ignore
import { ChartCanvas, Chart } from "react-stockcharts";
//@ts-ignore
import { CandlestickSeries, LineSeries } from "react-stockcharts/lib/series";
//@ts-ignore
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
//@ts-ignore
import { fitWidth } from "react-stockcharts/lib/helper";
//@ts-ignore
import { CurrentCoordinate } from "react-stockcharts/lib/coordinates";
//@ts-ignore
import { last, timeIntervalBarWidth } from "react-stockcharts/lib/utils";
//@ts-ignore
import { LabelAnnotation, Label, Annotate } from "react-stockcharts/lib/annotation";
//@ts-ignore
import { ema, wma, sma, tma } from "react-stockcharts/lib/indicator";
import { OHLCV, ChartType, Indicator, Transaction } from "./types";

interface Props {
    type: string
    chartType: ChartType
    width: number
    data: OHLCV[]
    transactions: Transaction[]
    ratio: number
    indicator: Indicator
}
let CandleStickChart: React.FC<Props> = (props) => {

    const { type, width, data, ratio, chartType, indicator, transactions } = props;

    const getWidthByChartType = (type: ChartType) => {
        switch (type) {
            case 'm5':
                return timeIntervalBarWidth(utcMinute.every(5))
            case 'm15':
                return timeIntervalBarWidth(utcMinute.every(15))
            case 'h1':
                return timeIntervalBarWidth(utcHour)
            case 'h4':
                return timeIntervalBarWidth(utcHour.every(4)) // 4.0だとなぜか細くなる
            default:
                return timeIntervalBarWidth(utcHour)
        }
    }

    const sameDateByChartType = (type: ChartType, d1: Moment, d2: Moment) => {
        switch (type) {
            case 'm5':
                return d2.isSameOrAfter(d1, 'minutes') && d2.isBefore(d1.add(5, 'minutes'), 'minutes')
            case 'm15':
                return d2.isSameOrAfter(d1, 'minutes') && d2.isBefore(d1.add(15, 'minutes'), 'minutes')
            case 'h1':
                return d2.isSameOrAfter(d1, 'hours') && d2.isBefore(d1.add(1, 'hours'), 'hours')
            case 'h4':
                return d2.isSameOrAfter(d1, 'hours') && d2.isBefore(d1.add(4, 'hours'), 'hours')
            default:
                return d1.isSame(d2, 'hours')
        }
    }

    const sma20 = sma()
        .options({ windowSize: 20 })
        .merge((d: any, c: any) => { d.sma20 = c; })
        .accessor((d: any) => d.sma20);

    const annotationProps = {
        fontFamily: "Glyphicons Halflings",
        fontSize: 20,
        fill: "#060F8F",
        opacity: 0.8,
        text: (data: any) => {
            console.log("text: ", data)
            return "Buy"
        },
        y: (data: any) => {
            console.log("yscale: ", data)
            return data.yScale.range()[0]
        },
        onClick: console.log.bind(console),
        tooltip: (d: any) => timeFormat("%B")(d.date),
        onMouseOver: console.log.bind(console),
    };
    const xAccessor = (d: any) => d.date;
    /*const xExtents = [
        xAccessor(last(data)),
        xAccessor(data[data.length - 100])
    ];*/
    console.log("render: ", data)
    const start = xAccessor(last(data));
    const end = xAccessor(data[Math.max(0, data.length - 150)]);
    const xExtents = [start, end];
    return (
        <ChartCanvas height={400}
            ratio={ratio}
            width={width}
            margin={{ left: 50, right: 50, top: 10, bottom: 30 }}
            type={type}
            seriesName="MSFT"
            data={data}
            xAccessor={xAccessor}
            xScale={scaleTime()}
            xExtents={xExtents}>

            <Chart id={1} yExtents={[(d: any) => [d.high, d.low], sma20.accessor()]}>
                <XAxis axisAt="bottom" orient="bottom" ticks={6} />
                <YAxis axisAt="left" orient="left" ticks={5} />
                {/*<CandlestickSeries width={timeIntervalBarWidth(utcDay)} />*/}
                <CandlestickSeries width={getWidthByChartType(chartType)} />
                <LineSeries yAccessor={sma20.accessor()} stroke={sma20.stroke()} />
                <CurrentCoordinate yAccessor={sma20.accessor()} fill={sma20.stroke()} />
                <Annotate with={LabelAnnotation}
                    when={(d: any) => {
                        console.log("annotate: ", moment(d.date))
                        for (let i = 0; i < transactions.length; i++) {
                            const isSame = sameDateByChartType(chartType, moment(d.date), transactions[i].date)
                            if (isSame) {
                                return true
                            }
                        }

                        return false /* some condition */
                    }}
                    usingProps={annotationProps} />
            </Chart>
        </ChartCanvas>
    );

}

export default fitWidth(CandleStickChart)

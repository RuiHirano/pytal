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
//@ts-ignore
import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
//@ts-ignore
import algo from "react-stockcharts/lib/algorithm";
import { OHLCV, ChartType, Indicator, Transaction, SMA } from "./types";

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

    const { type, width, data: initialData, ratio, chartType, indicator, transactions } = props;

    /*const getWidthByChartType = (type: ChartType) => {
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
    }*/

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

    const createSMA = (data: SMA) => {
        return sma()
            .id(0)
            .options({ windowSize: data.window })
            .merge((d: any, c: any) => { d["sma" + data.window] = c; })
            .accessor((d: any) => d["sma" + data.window]);
    }
    const sma20 = sma()
        .id(0)
        .options({ windowSize: 20 })
        .merge((d: any, c: any) => { d.sma20 = c; })
        .accessor((d: any) => d.sma20);

    const sma50 = sma()
        .options({ windowSize: 50, })
        .merge((d: any, c: any) => { d.sma50 = c; }) // Required, if not provided, log a error
        .accessor((d: any) => d.sma50) // Required, if not provided, log an error during calculation
        .stroke("blue"); // Optional

    const buySell = algo()
        .windowSize(2)
        .accumulator(([prev, now]: any) => {
            //console.log("now", now, now.low, now.date)
            const { date } = now;
            for (let i = 0; i < transactions.length; i++) {
                //console.log("now2", now, now.low, now.date, transactions[i].date)
                const transaction = transactions[i]
                const isSame = sameDateByChartType(chartType, moment(date), moment(transaction.date))
                if (isSame) {
                    if (transaction.amount > 0) {
                        return "LONG"
                    } else if (transaction.amount < 0) {
                        return "SHORT"
                    }
                }
            }
        })
        .merge((d: any, c: any) => { d.longShort = c; });

    const defaultAnnotationProps = {
        fontFamily: "Glyphicons Halflings",
        fontSize: 20,
        opacity: 0.8,
        onClick: console.log.bind(console),
    };

    const longAnnotationProps = {
        ...defaultAnnotationProps,
        fill: "#006517",
        text: "\ue093",
        y: ({ yScale, datum }: any) => yScale(datum.low) + 20,
        tooltip: "Go long",
    };

    const shortAnnotationProps = {
        ...defaultAnnotationProps,
        fill: "#E20000",
        text: "\ue094",
        y: ({ yScale, datum }: any) => yScale(datum.high),
        tooltip: "Go short",
    };
    //const xAccessor = (d: any) => d.date;
    /*const xExtents = [
        xAccessor(last(data)),
        xAccessor(data[data.length - 100])
    ];*/
    const calculatedData = buySell(sma20(sma50(initialData)));
    const xScaleProvider = discontinuousTimeScaleProvider
        .inputDateAccessor((d: any) => d.date);
    const {
        data,
        xScale,
        xAccessor,
        displayXAccessor,
    } = xScaleProvider(calculatedData);
    console.log("render: ", initialData, data, sma20.accessor(), sma20.stroke())
    const start = xAccessor(last(data));
    const end = xAccessor(data[Math.max(0, data.length - 150)]);
    const xExtents = [start, end];


    const createIndicatorLayers = () => {
        const layers: any = []
        indicator.sma.forEach((data) => {
            layers.push(
                <LineSeries yAccessor={sma20.accessor()} stroke={sma20.stroke()} />
            )
        })
        return layers
    }
    return (
        <ChartCanvas height={400}
            ratio={ratio}
            width={width}
            margin={{ left: 50, right: 50, top: 10, bottom: 30 }}
            type={type}
            seriesName="MSFT"
            data={data}
            xAccessor={xAccessor}
            displayXAccessor={displayXAccessor}
            xScale={xScale}
            xExtents={xExtents}>

            <Chart id={1} yExtents={[(d: any) => [d.high, d.low], sma20.accessor()]}>
                <XAxis axisAt="bottom" orient="bottom" ticks={6} />
                <YAxis axisAt="left" orient="left" ticks={5} />
                {/*<CandlestickSeries width={timeIntervalBarWidth(utcDay)} />*/}
                <CandlestickSeries />

                <LineSeries yAccessor={sma20.accessor()} stroke={sma20.stroke()} />
                <LineSeries yAccessor={sma50.accessor()} stroke={sma50.stroke()} />
                <CurrentCoordinate yAccessor={sma20.accessor()} fill={sma20.stroke()} />
                <Annotate with={LabelAnnotation} when={(d: any) => d.longShort === "LONG"}
                    usingProps={longAnnotationProps} />
                <Annotate with={LabelAnnotation} when={(d: any) => d.longShort === "SHORT"}
                    usingProps={shortAnnotationProps} />
            </Chart>
        </ChartCanvas>
    );

}

export default fitWidth(CandleStickChart)

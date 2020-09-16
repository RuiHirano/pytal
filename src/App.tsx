import React, { useState, useEffect, useCallback } from 'react';
import logo from './logo.svg';
import './App.css';
//@ts-ignore
import { TypeChooser } from "react-stockcharts/lib/helper";
import Chart from './chart';
import { getData, getM1Data, getM5Data, getM15Data, getH1Data, getH4Data, getTransactionData } from "./utils"
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import IconButton from '@material-ui/core/IconButton';
import PlayArrow from '@material-ui/icons/PlayArrow';
import Stop from '@material-ui/icons/Stop';
import SkipNext from '@material-ui/icons/SkipNext';
import SkipPrevious from '@material-ui/icons/SkipPrevious';
import moment from 'moment'
import { Typography } from '@material-ui/core';
import { Data, ChartType, OHLCV, Indicator } from './types';

// TODO
export const useGetDataSet = () => {
  const [status, setStatus] = useState({ Type: "NONE", Progress: 0, Log: "", Error: "", Loading: false })
  const [data, setData] = useState<Data>(new Data())
  //const files: FileInfo[] = useSelector((state: ReduxState)=> state.App.Files)

  const getDataSet = useCallback(async () => {
    try {
      // Loading開始
      setStatus({ Progress: 0, Log: "", Error: "", Loading: true, Type: "RUNNING" })

      const m5data = await getM5Data()
      const m15data = await getM15Data()
      const h1data = await getH1Data()
      const h4data = await getH4Data()
      const transactions = await getTransactionData()
      const data: Data = new Data()
      console.log("debug: ", m5data, m15data, h1data, h4data, transactions)
      data.setChart(m5data, "m5")
      data.setChart(m15data, "m15")
      data.setChart(h1data, "h1")
      data.setChart(h4data, "h4")
      data.setTransaction(transactions)

      setData(data)
      console.log("data2: ", data)

      // Loading終了
      setStatus((preStatus) => ({ ...preStatus, Progress: 100, Loading: false, Type: "FINISHED" }))

    } catch (err) {
      console.log("error: ", err)
      setStatus((preStatus) => ({ ...preStatus, Progress: 0, Loading: false, Error: err, Type: "RUNNING" }))
    }

  }, [status])

  return { "getDataSet": getDataSet, "dataset": data, "status": status }
}

const App = () => {

  const [data, setData] = useState<Data>(new Data())
  const { getDataSet, dataset, status } = useGetDataSet()
  const [playStatus, setPlayStatus] = useState({ "play": false, "id": undefined, "speed": 1000 })
  const [chartStatus, setChartStatus] = useState<{ type: ChartType }>({ type: "h1" })

  useEffect(() => {
    getDataSet()
  }, [])

  // useRunCommandの終了処理
  useEffect(() => {
    if (status.Type === "FINISHED") {
      console.log("get data")
      setData(dataset)
    }
  }, [status]);

  useEffect(() => {
    if (playStatus.play === true && playStatus.id === undefined) {
      console.log("useEffect")
      const id = setInterval(() => {
        setData((preData: Data) => {
          const tgtChart = preData.Chart[chartStatus.type]
          const tgtdata = tgtChart[tgtChart.length - 1]
          console.log(preData, tgtdata.date, moment(tgtdata.date).add(1, "days").toDate())
          const nextData: Data = preData
          nextData.Chart[chartStatus.type].push({
            date: moment(tgtdata.date).add(1, "days"),
            open: tgtdata.open,
            high: tgtdata.high,
            low: tgtdata.low,
            close: tgtdata.close,
            volume: tgtdata.volume,
          } as OHLCV)
          return nextData
        })
      }, playStatus.speed);
      setPlayStatus((preStatus: any) => {
        return { ...preStatus, id: id, play: true }
      })
    }
  }, [playStatus]);

  const play = () => {
    console.log("play")
    setPlayStatus((preStatus: any) => {
      return { ...preStatus, play: true }
    })
  }

  const stop = () => {
    console.log("stop")
    if (playStatus.id != undefined) {
      clearInterval(playStatus.id)
      setPlayStatus((preStatus: any) => {
        return { ...preStatus, id: undefined, play: false }
      })
    }
  }

  const speedUp = () => {
    console.log("speedup")
    setPlayStatus((preStatus: any) => {
      clearInterval(playStatus.id)
      return { ...preStatus, speed: preStatus.speed / 2, id: undefined }
    })
  }

  const speedDown = () => {
    console.log("speeddown")
    setPlayStatus((preStatus: any) => {
      clearInterval(playStatus.id)
      return { ...preStatus, speed: preStatus.speed * 2, id: undefined }
    })
  }

  if (status.Loading) {
    return <div>Loading...</div>
  }


  return (
    <div>
      <ButtonGroup color="primary" aria-label="outlined primary button group">
        <Button onClick={() => setChartStatus({ ...chartStatus, type: "m5" })}>5M</Button>
        <Button onClick={() => setChartStatus({ ...chartStatus, type: "m15" })}>15M</Button>
        <Button onClick={() => setChartStatus({ ...chartStatus, type: "h1" })}>1H</Button>
        <Button onClick={() => setChartStatus({ ...chartStatus, type: "h4" })}>4H</Button>
        <Button onClick={() => setChartStatus({ ...chartStatus, type: "d1" })}>D</Button>
        <Button onClick={() => setChartStatus({ ...chartStatus, type: "w1" })}>W</Button>
      </ButtonGroup>
      <ButtonGroup color="primary" aria-label="outlined primary button group">
        <IconButton onClick={stop} color="primary" aria-label="upload picture" component="span">
          <Stop />
        </IconButton>
        <IconButton onClick={speedDown} color="primary" aria-label="upload picture" component="span">
          <SkipPrevious />
        </IconButton>
        <IconButton onClick={play} color="primary" aria-label="upload picture" component="span">
          <PlayArrow />
        </IconButton>
        <IconButton onClick={speedUp} color="primary" aria-label="upload picture" component="span">
          <SkipNext />
        </IconButton>
      </ButtonGroup>
      <Typography>{"speed: " + playStatus.speed}</Typography>
      <Typography>{"chartType: " + chartStatus.type}</Typography>
      <TypeChooser>
        {(type: any) => <Chart type={type} data={data.Chart[chartStatus.type]} chartType={chartStatus.type} indicator={new Indicator()} transactions={data.transactions} />}
      </TypeChooser>
    </div>
  );
}

export default App;

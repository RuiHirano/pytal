import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
//@ts-ignore
import { TypeChooser } from "react-stockcharts/lib/helper";
import Chart from './chart';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { Typography } from '@material-ui/core';
import { Data, ChartType, OHLCV, Indicator } from './types';
import { fetchData } from './utils/api';
import { useAsync } from 'react-async-hook';


const App = () => {

  //const [playStatus, setPlayStatus] = useState({ "play": false, "id": undefined, "speed": 1000 })
  const [chartStatus, setChartStatus] = useState<{ type: ChartType }>({ type: "h1" })

  const asyncData = useAsync(fetchData, []);
  useEffect(() => {

  }, [])

  useEffect(() => {
    console.log("recieve message")
    //socket.on("connect", () => console.log("connected!"));
    //socket.on("transactions", (data: any) => console.log("transactions", data));
    //getDataSet()
    //emittest()
  }, [])

  // useRunCommandの終了処理
  /*useEffect(() => {
    if (status.Type === "FINISHED" && status.Progress === 100) {
      console.log("get data", dataset)
      setData(dataset)
    }
  }, [status]);*/

  /*useEffect(() => {
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
  }*/

  console.log("status: ", asyncData)
  if (asyncData.loading) {
    return <div>Loading...</div>
  }

  /*return (
    <div>
      {asyncHero.loading && <div>Loading</div>}
      {asyncHero.error && <div>Error: {asyncHero.error.message}</div>}
      {asyncHero.result && (
        <div>
          <div>Success!</div>
          <div>Name: {asyncHero.result.Chart.h4.length}</div>
        </div>
      )}
    </div>
  )*/


  return (
    <div>
      {asyncData.loading && <div>Loading</div>}
      {asyncData.error && <div>Error: {asyncData.error.message}</div>}
      {asyncData.result && (
        <div>
          <ButtonGroup color="primary" aria-label="outlined primary button group">
            {Object.entries(asyncData?.result?.chart).map(([key, value]) => {

              if (value.length !== 0) {
                switch (key) {
                  case "m1":
                    return (<Button onClick={() => setChartStatus({ ...chartStatus, type: "m1" })}>5M</Button>)
                  case "m5":
                    return (<Button onClick={() => setChartStatus({ ...chartStatus, type: "m5" })}>5M</Button>)
                  case "m15":
                    return (<Button onClick={() => setChartStatus({ ...chartStatus, type: "m15" })}>15M</Button>)
                  case "m15":
                    return (<Button onClick={() => setChartStatus({ ...chartStatus, type: "m30" })}>30M</Button>)
                  case "h1":
                    return (<Button onClick={() => setChartStatus({ ...chartStatus, type: "h1" })}>1H</Button>)
                  case "h4":
                    return (<Button onClick={() => setChartStatus({ ...chartStatus, type: "h4" })}>4H</Button>)
                  case "d1":
                    return (<Button onClick={() => setChartStatus({ ...chartStatus, type: "d1" })}>1D</Button>)
                  case "w1":
                    return (<Button onClick={() => setChartStatus({ ...chartStatus, type: "w1" })}>1W</Button>)
                  default:
                    break;
                }
              }
            })}
          </ButtonGroup>
          {/*<ButtonGroup color="primary" aria-label="outlined primary button group">
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
      </ButtonGroup>*/}
          <Typography>{"chartType: " + chartStatus.type}</Typography>
          <TypeChooser>
            {(type: any) => <Chart type={type} data={asyncData.result?.chart[chartStatus.type]} chartType={chartStatus.type} indicator={new Indicator()} transactions={asyncData.result?.transactions} />}
          </TypeChooser>
        </div>
      )}
    </div>
  );
}

export default App;

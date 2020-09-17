import moment, { Moment } from "moment";
import { v4 as uuid } from 'uuid';

export const mockTransactions = [
    {
        id: uuid(),
        date: moment("2016-03-25"),
        amount: -100,
        price: 420.1,
        value: 40000,
        symbol: "",
    },
    {
        id: uuid(),
        date: moment("2016-03-26"),
        amount: 100,
        price: 420.1,
        value: -40000,
        symbol: "",
    },
    {
        id: uuid(),
        date: moment("2016-03-27"),
        amount: -100,
        price: 420.1,
        value: 40000,
        symbol: "",
    },
    {
        id: uuid(),
        date: moment("2016-03-28"),
        amount: 100,
        price: 420.1,
        value: -40000,
        symbol: "",
    },
    {
        id: uuid(),
        date: moment("2016-03-29"),
        amount: -100,
        price: 420.1,
        value: 40000,
        symbol: "",
    },
]

export const dataset = [
    {
        "datetime": "2005-06-30 21:00:00+00:00",
        "volume": 47521.0,
        "high": 111.790,
        "low": 110.620,
        "open": 110.916,
        "close": 111.790
    },
    {
        "datetime": "2005-07-01 21:00:00+00:00",
        "volume": 1.0,
        "high": 111.790,
        "low": 111.790,
        "open": 111.790,
        "close": 111.790
    },
    {
        "datetime": "2005-07-02 21:00:00+00:00",
        "volume": 588.0,
        "high": 111.745,
        "low": 111.635,
        "open": 111.740,
        "close": 111.665
    },
    {
        "datetime": "2005-07-03 21:00:00+00:00",
        "volume": 37730.0,
        "high": 111.890,
        "low": 111.332,
        "open": 111.665,
        "close": 111.616
    },
    {
        "datetime": "2005-07-04 21:00:00+00:00",
        "volume": 44689.0,
        "high": 112.126,
        "low": 111.450,
        "open": 111.616,
        "close": 111.740
    },
    {
        "datetime": "2005-07-05 21:00:00+00:00",
        "volume": 43839.0,
        "high": 112.288,
        "low": 111.458,
        "open": 111.740,
        "close": 112.188
    },
    {
        "datetime": "2005-07-06 21:00:00+00:00",
        "volume": 48156.0,
        "high": 112.340,
        "low": 111.492,
        "open": 112.188,
        "close": 112.082
    },
    {
        "datetime": "2005-07-07 21:00:00+00:00",
        "volume": 43204.0,
        "high": 112.598,
        "low": 111.788,
        "open": 112.082,
        "close": 112.180
    },
    {
        "datetime": "2005-07-09 21:00:00+00:00",
        "volume": 599.0,
        "high": 112.195,
        "low": 112.125,
        "open": 112.190,
        "close": 112.165
    },
    {
        "datetime": "2005-07-10 21:00:00+00:00",
        "volume": 41028.0,
        "high": 112.260,
        "low": 111.688,
        "open": 112.165,
        "close": 111.808
    },
    {
        "datetime": "2005-07-11 21:00:00+00:00",
        "volume": 47605.0,
        "high": 111.838,
        "low": 110.758,
        "open": 111.818,
        "close": 110.810
    },
    {
        "datetime": "2005-07-12 21:00:00+00:00",
        "volume": 43286.0,
        "high": 112.290,
        "low": 110.800,
        "open": 110.810,
        "close": 111.860
    },
    {
        "datetime": "2005-07-13 21:00:00+00:00",
        "volume": 45661.0,
        "high": 112.378,
        "low": 111.646,
        "open": 111.860,
        "close": 112.358
    },
    {
        "datetime": "2005-07-14 21:00:00+00:00",
        "volume": 43401.0,
        "high": 112.428,
        "low": 111.766,
        "open": 112.358,
        "close": 112.160
    },
    {
        "datetime": "2005-07-15 21:00:00+00:00",
        "volume": 1.0,
        "high": 112.160,
        "low": 112.160,
        "open": 112.160,
        "close": 112.160
    },
    {
        "datetime": "2005-07-16 21:00:00+00:00",
        "volume": 291.0,
        "high": 112.285,
        "low": 112.105,
        "open": 112.130,
        "close": 112.275
    },
    {
        "datetime": "2005-07-17 21:00:00+00:00",
        "volume": 32477.0,
        "high": 112.360,
        "low": 111.518,
        "open": 112.275,
        "close": 111.988
    },
]
# Pytal
Python Trade Analisis UI Library for Backtest, Forex Trade and Stock Trade

## Instration
```
pip install pytal
```

## Usage

### Run monitor server
```
import sys
from pytal.app import run_server

if __name__ == "__main__":
    print("stating...")
    run_server()

```
You can see monitor at http://localhost:8000

### Put Chart Data

```
import sys
from pytal.app import run_server, put_chart_data

if __name__ == "__main__":
    print("stating...")
    run_server()

    data = {
        "m15":[
            {
                "date": "2020-02-11 14:34:00",
                "open": "122.34",
                "high": "122.34",
                "low": "122.46",
                "close": "122.24",
                "volume": "123.34",
            },
        ],
        "h1":[
            {
                "date": "2020-02-11 14:34:00",
                "open": "122.34",
                "high": "122.34",
                "low": "122.46",
                "close": "122.24",
                "volume": "123.34",
            },
        ],

    }
    put_chart_data(data)

```

### Put Transaction Data

```
import sys
from pytal.app import run_server, put_transactions_data

if __name__ == "__main__":
    print("stating...")
    run_server()

    data = [        
        {
            "date": "2020-02-11 14:34:00",
            "amount": "23.44",
            "price": "122.34",
            "value": "-2855.4156",   # - amount * price. if value < 0, it means short position.
            "symbol": "MSFT",
        },
    ]

    put_transactions_data(data)

```

## Using backtrade library
### for Backtrader with pyfolio
```
import backtrader as bt
import backtrader.analyzers as btanalyzers
import pyfolio as pf
from pytal.app import run_server, put_transactions_data, put_chart_data
from pytal.backtrader import chart_converter, transactions_converter

if __name__ == "__main__":
    cerebro = bt.Cerebro()
    cerebro.adddata(data, name='day')
    cerebro.addstrategy(MACrossStrategy)
    cerebro.addanalyzer(btanalyzers.SharpeRatio, _name='mysharpe')
    cerebro.addanalyzer(bt.analyzers.PyFolio, _name='pyfolio')
    result = cerebro.run()
    strat = result[0]

    print('Sharpe Ratio:', strat.analyzers.mysharpe.get_analysis())
    pyfoliozer = strat.analyzers.getbyname('pyfolio')
    returns, positions, transactions, gross_lev = pyfoliozer.get_pf_items()

    run_server()

    # convert chart data
    chart_data = chart_converter(data)

    # convert transactions data
    trs_data = transactions_converter(transactions)

    put_chart_data(chart_data)
    put_transactions_data(trs_data)

```


## Publish to PyPI
```
python setup.py sdist --formats=zip
```

```
twine upload dist/pytal-0.0.6.zip
```

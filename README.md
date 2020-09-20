# Pytal
Python Trade Analisis UI Library for Backtest, Forex Trade and Stock Trade

## Instration
```
pip install pytal
```

## Examples
Here is simple example.
```
from pytal import PytalServer
import pandas as pd

if __name__ == "__main__":
    h1_df = pd.read_csv('./data/usdjpy_1h_sample.csv')
    h4_df = pd.read_csv('./data/usdjpy_4h_sample.csv')
    trans_df = pd.read_csv('./data/transactions.csv')
    mock_data = {
        "h1": h1_df,
        "h4": h4_df
    }
    
    ps = PytalServer()
    ps.add_data(mock_data)
    ps.add_transactions(trans_df)
    ps.run()
```
There are other examples in /examples. 

## Usage

### Run monitor server
```
from pytal import PytalServer

if __name__ == "__main__":
    print("stating...")
    ps = PytalServer()

```
You can see monitor at http://localhost:8000

## Parameter
### PytalServer
| Paramater       | Type                   | Description                                                                                                                                                                                                                                                                                                         |
| --------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| add_data()    | function                    | This is fuction to add chart data (ex. stock, forex). Please input pandas dataframe with column [data, volume, open, high, low, close]      
| add_transactions()    | function                    | This is fuction to add transaction data. Please input pandas dataframe with column [date, amount, price, symbol, value] 
| run()    | function                    | This is fuction to run server. If success, you can see the monitor at http://localhost:8000.

## With backtrade library
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

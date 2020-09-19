import sys
from pytal import PytalServer
import pandas as pd

if __name__ == "__main__":
    h1_df = pd.read_csv('https://cdn.rawgit.com/rrag/react-stockcharts/master/docs/data/bitstamp_xbtusd_1h.csv')
    h4_df = pd.read_csv('https://cdn.rawgit.com/rrag/react-stockcharts/master/docs/data/bitstamp_xbtusd_4h.csv')
    
    mock_data = {
        "h1": h1_df,
        "h4": h4_df
    }
    
    ps = PytalServer()
    ps.add_data(mock_data)
    ps.run()
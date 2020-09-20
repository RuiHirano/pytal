from pytal import PytalServer
import pandas as pd

if __name__ == "__main__":
    h1_df = pd.read_csv('./data/usdjpy_1h_sample.csv')
    h4_df = pd.read_csv('./data/usdjpy_4h_sample.csv')
    trans_df = pd.read_csv('./data/transactions.csv')
    print(h1_df, h4_df, trans_df)
    mock_data = {
        "h1": h1_df,
        "h4": h4_df
    }
    
    ps = PytalServer()
    ps.add_data(mock_data)
    ps.add_transactions(trans_df)
    ps.run()
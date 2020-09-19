# server.py
from flask import Flask, render_template
from flask_cors import CORS
import threading
import time
from flask_socketio import SocketIO, emit, send
import socketio as sioclient
import pandas as pd
import json


class PytalServer():
    def __init__(self, host="0.0.0.0", port=8000):
        self.app = Flask(__name__, static_folder="./monitor/build/static", template_folder="./monitor/build")
        CORS(self.app)
        self.app.config['SECRET_KEY'] = 'secret!'
        self.app.add_url_rule('/', '/', self._index)
        self.app.add_url_rule('/data', '/data', self._get_data)
        self.host = host
        self.port = port
        self.data = {
            "chart":{
                "m1": [], 
                "m5": [], 
                "m15": [], 
                "m30": [], 
                "h1": [], 
                "h4": [], 
                "d1": [], 
                "w1": [], 
            },
            "transactions": []
        }

    def _index(self):
        return render_template("index.html")

    def _get_data(self):
        return json.dumps(self.data)

    def _run_server(self):
        print("[INFO] Running Server at {}:{}".format(self.host, self.port))
        self.app.run(debug=True, host=self.host, port=self.port)

    def run(self):    
        self._run_server()

    def _check_column(self, df, targets=[]):
        for tgt in targets:
            if not tgt in df.columns:
                print("[Error] カラム名に{}がありません".format(tgt))
                return False
        return True

    def add_data(self, data):
        #print("add")
        chart_data = {}
        keys = ["m1", "m5", "m15", "m30", "h1", "h4", "d1", "w1"]
        columns = ["date", "open", "high", "low", "close", "volume"]
        for key in keys:
            if key in data and self._check_column(data[key], columns):
                chart_data[key] = data[key].to_json(orient="records")
            else:
                chart_data[key] = []
        self.data["chart"] = chart_data
        #print(self.data)
        
    def add_transactions(self, transactions):
        columns = ["date", "amount", "price", "value", "symbol"]
        if self._check_column(transactions, columns):
            self.data["transactions"] = transactions.to_json(orient="records")
        
if __name__ == "__main__":
    #run_server()
    h1_df = pd.read_csv('https://cdn.rawgit.com/rrag/react-stockcharts/master/docs/data/bitstamp_xbtusd_1h.csv')
    h4_df = pd.read_csv('https://cdn.rawgit.com/rrag/react-stockcharts/master/docs/data/bitstamp_xbtusd_4h.csv')
    
    mock_data = {
        "h1": h1_df,
        "h4": h4_df
    }
    
    ps = PytalServer()
    ps.add_data(mock_data)
    ps.run()

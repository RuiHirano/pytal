# server.py
from flask import Flask, render_template
import threading
import time
from flask_socketio import SocketIO, emit, send
import socketio as sioclient


sio = sioclient.Client() 

app = Flask(__name__, static_folder="./monitor/build/static", template_folder="./monitor/build")
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*")

@app.route("/")
def index():
    return render_template("index.html")

@socketio.on('transactions')
def send_transactions_to_ui(message):
    print("get message", message)
    message ="this is test message!!!!!!!!"
    emit('transactions', {'data': 'got it!'}, broadcast=True)

def send_transactions(message):
    sio.emit("transactions", message)

def run_client():
    try:
        sio.connect('http://localhost:8000')
        print("success to connect!")
        for i in range(100):
            time.sleep(5)
            send_transactions("testtesttest")
    except:
        run_client()
    
def run_server():
    print("running client...")
    thread = threading.Thread(target=run_client)
    thread.start()
    print("running server...")
    socketio.run(app, host='0.0.0.0', port=8000)


if __name__ == "__main__":
    print("running client...")
    thread = threading.Thread(target=run_client)
    thread.start()
    print("running server...")
    socketio.run(app, host='0.0.0.0', port=8000)

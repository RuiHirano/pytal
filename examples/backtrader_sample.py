

df = dataset['h1'][dataset['h1'].index<"2012-12-30 23:00:00"]
# バックテストの設定
cerebro = bt.Cerebro() # Cerebroエンジンをインスタンス化
cerebro.addstrategy(myStrategy) # ストラテジーを追加
data = btfeed.PandasData(dataname=df) # Cerebro形式にデータを変換
cerebro.adddata(data) # データをCerebroエンジンに追加
cerebro.broker.setcash(10000.0) # 所持金を設定
cerebro.broker.setcommission(commission=0.0005) # 手数料（スプレッド）を0.05%に設定
cerebro.addsizer(bt.sizers.PercentSizer, percents=50) # デフォルト（buy/sellで取引量を設定していない時）の取引量を所持金に対する割合で指定する
startcash = cerebro.broker.getvalue() # 開始時の所持金
cerebro.broker.set_coc(True) # 発注時の終値で約定する

# 解析の設定
import backtrader.analyzers as btanalyzers # バックテストの解析用ライブラリ
cerebro.addanalyzer(btanalyzers.DrawDown, _name='myDrawDown') # ドローダウン
cerebro.addanalyzer(btanalyzers.SQN, _name='mySQN') # SQN
cerebro.addanalyzer(btanalyzers.TradeAnalyzer, _name='myTradeAnalyzer') # トレードの勝敗等の結果
cerebro.addanalyzer(btanalyzers.PyFolio, _name='pyfolio') # pyfolio

thestrats = cerebro.run() # バックテストを実行
thestrat = thestrats[0] # 解析結果の取得

# pyfolio
pyfoliozer = thestrat.analyzers.getbyname('pyfolio')
returns, positions, transactions, gross_lev = pyfoliozer.get_pf_items()
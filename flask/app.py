import os
import importlib
import sys
from flask import Flask, request, jsonify
import mock

webRoot = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'www'))
app = Flask('heatmap',
    static_url_path='',
    static_folder=webRoot)

db = mock.setup(None)

@app.route('/points', methods=['GET'])
def points():
  try:
    south = float(request.args.get('lat0', '0'))
    north = float(request.args.get('lat1', '0'))
    west = float(request.args.get('lng0', '0'))
    east = float(request.args.get('lng1', '0'))
  except ValueError as e:
    return "invalid query value: " + str(e), 400
  if south > north:
    south, north = north, south
  if west > east:
    west, east = east, west
  return jsonify(db.query(south, north, west, east))

@app.route('/', methods=['GET'])
def index():
  return app.send_static_file('index.html')

if __name__ == '__main__':
  if len(sys.argv) > 1:
    db = importlib.import_module(sys.argv[1]).setup(sys.argv[2:])
  app.run()

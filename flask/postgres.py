import psycopg2
from datetime import datetime

QUERY_STR = """
SELECT id as id, latitude as lat, longitude as lng
  FROM points
  WHERE utc_date = '%s' AND utc_hour = %d AND
    lat >= %f AND lat <= %f AND lng >= %f AND lng <= %f
;
"""

class PostgresDB:
  def __init__(self, conn_str):
    self._conn = psycopg2.connect(conn_str)

  def query(self, lat0, lat1, lng0, lng1):
    now = datetime.utcnow()
    cur = self._conn.cursor()
    cur.execute(QUERY_STR % (now.strftime('%Y%m%d'), now.hour, lat0, lat1, lng0, lng1))
    result = map(lambda pt: {'lat': pt[1], 'lng': pt[2], 'count': 1}, cur.fetchall())
    cur.close()
    return result

def setup(argv):
  return PostgresDB(' '.join(argv))

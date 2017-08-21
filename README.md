# Geo HeatMap

## To Launch

Subsititude `YOUR_API_KEY` with Google Map API key.

```sh
npm install
npm run dev
```

## Connect to DB with Python

```sh
pip install -r requirements.txt
python flask/app.py dbdriver args...
```

E.g.

```sh
python flask/app.py postgres host=localhost dbname=geodb user='dbuser' password='dbpass'
```

Point browser to the listening URL.

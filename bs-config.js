var url = require('url');

var mockPts = [
    {lat: 47.4051, lng: -121.5206, count: 23},
    {lat: 47.5123, lng: -122.9543, count: 68},
    {lat: 47.6012, lng: -121.7965, count: 80},
    {lat: 47.6123, lng: -122.8193, count: 23},
    {lat: 47.6432, lng: -122.6745, count: 56},
    {lat: 47.6565, lng: -122.1067, count: 32},
    {lat: 47.7534, lng: -121.9823, count: 17},
    {lat: 47.7934, lng: -122.3579, count: 35},
    {lat: 47.8012, lng: -123.0805, count: 4},
];

module.exports = {
    server: {
        middleware: {
            2: {
                route: "/points",
                handle: function (req, res) {
                    var q = url.parse(req.url, true).query;

                    var bounds = {
                        S: Number.parseFloat(q.lat0) || 0,
                        N: Number.parseFloat(q.lat1) || 0,
                        W: Number.parseFloat(q.lng0) || 0,
                        E: Number.parseFloat(q.lng1) || 0
                    };
                    if (bounds.S > bounds.N) {
                        var t = bounds.N;
                        bounds.N = bounds.S;
                        bounds.S = t;
                    }
                    if (bounds.W > bounds.E) {
                        var t = bounds.E;
                        bounds.E = bounds.W;
                        bounds.W = t;
                    }
                    var pts = mockPts.filter(function (pt) {
                        return pt.lat >= bounds.S && pt.lat <= bounds.N &&
                            pt.lng >= bounds.W && pt.lng <= bounds.E;
                    });
                    res.writeHead(200, {'Content-type': 'application/json'});
                    res.write(JSON.stringify(pts));
                    res.end();
                }
            }
        }
    }
};

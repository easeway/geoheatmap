(function (exports) {
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

    var simLatency = 150;

    function pointsInBounds(bounds, callback, errHandler) {
        var pts = mockPts.filter(function (pt) {
            return pt.lat >= bounds.south && pt.lat <= bounds.north &&
                    pt.lng >= bounds.west && pt.lng <= bounds.east;
        });
        setTimeout(function() {
            callback(pts);
        }, simLatency);
    }

    exports.pointsInBounds = pointsInBounds;
})(window);

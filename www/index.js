(function (exports) {
    'use strict';

    function pointsInBounds(bounds, callback, errHandler) {
        var query="points?lat0=" + bounds.south + "&lat1=" + bounds.north + "&lng0=" + bounds.west + "&lng1=" + bounds.east;
        $.get(query, callback).fail(function (jqXHR, textStatus, err) {
            if (errHandler != null) {
                errHandler(err);
            } else {
                console.error("pointsInBounds API error: " + textStatus + ": " + err);
            }
        });
    }

    var map, heatMap;
    var heatCells = [];
    var gridRows = 8, gridCols = 8, heatLevels = 10;

    function worldCoord(lat, lng) {
        var siny = Math.sin(lat * Math.PI / 180);
        siny = Math.min(Math.max(siny, -0.9999), 0.9999);
        return {
            x: 0.5 + lng / 360,
            y: 0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI)
        };
    }

    function onChange(changing) {
        var classes = document.getElementById('overlay').classList;
        if (changing) {
            classes.add('overlay_pending');
            classes.remove('overlay');
        } else {
            classes.remove('overlay_pending');
            classes.add('overlay');
        }
    }

    function updateCounts(counts) {
        for (var r = 0; r < gridRows; r ++) {
            for (var c = 0; c < gridCols; c ++) {
                var elm = heatCells[r][c];
                var cnt = counts[r][c];
                if (cnt == 0) {
                    elm.innerHTML = "";
                    elm.style.background = 'transparent';
                } else {
                    elm.innerHTML = "<span>"+cnt+"</span>";
                    var heat = Math.floor(cnt / 10);
                    if (heat > heatLevels) {
                        heat = heatLevels;
                    }
                    var red = Math.floor(255 * heat / heatLevels);
                    var green = 255 - red;
                    var blue = (red + green) >> 1;
                    elm.style.background = "rgb(" + red + "," + green + "," + blue + ")";
                }
            }
        }
    }

    function onBoundsChange() {
        var bounds = map.getBounds().toJSON();
        var upper = worldCoord(bounds.north, bounds.west);
        var lower = worldCoord(bounds.south, bounds.east);

        var stepY = (lower.y - upper.y) / gridRows;
        var stepX = (lower.x - upper.x) / gridCols;

        var counts = [];
        for (var r = 0; r < gridRows; r ++) {
            counts[r] = [];
            for (var c = 0; c < gridCols; c ++) {
                counts[r][c] = 0;
            }
        }

        pointsInBounds(bounds, function (pts) {
            heatMap.setData(pts.map(function (pt) {
                var coord = worldCoord(pt.lat, pt.lng);
                var c = Math.floor((coord.x - upper.x) / stepX);
                var r = Math.floor((coord.y - upper.y) / stepY);
                if (r >= 0 && r < gridRows && c >= 0 && c < gridCols) {
                    counts[r][c] += pt.count;
                }

                return {
                  location: new google.maps.LatLng(pt.lat, pt.lng),
                  weight: pt.count
                }
            }));

            updateCounts(counts);
        });
    }

    function initOverlay() {
        var ovl = document.getElementById('overlay');
        for (var r = 0; r < gridRows; r ++) {
            heatCells[r] = [];
            for (var c = 0; c < gridCols; c ++) {
                var elm = document.createElement('div');
                elm.classList.add('heat_cell');
                elm.classList.add('heat_cell_' + r + '_' + c);
                elm.style.width = 100/8 + "%";
                elm.style.height = 100/8 + "%";
                elm.style.left = c*100/8 + "%";
                elm.style.top = r*100/8 + "%";
                heatCells[r][c] = elm;
                ovl.appendChild(elm);
            }
        }
    }

    function initMap() {
        initOverlay();
        var city = {lat: 47.6062, lng: -122.3321};
        map = new google.maps.Map(document.getElementById('map'), {
            center: city,
            minZoom: 4,
            zoom: 10
        });
        heatMap = new google.maps.visualization.HeatmapLayer({
            data: [],
            map: map
        });
        map.addListener('bounds_changed', onBoundsChange);
        map.addListener('dragstart', function() { onChange(true); });
        map.addListener('dragend', function() { onChange(false); });
    }
    exports.initMap = initMap;
})(window);

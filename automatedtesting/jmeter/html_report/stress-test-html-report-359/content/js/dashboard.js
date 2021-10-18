/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9666666666666667, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.99, 500, 1500, "authors POST"], "isController": false}, {"data": [0.99, 500, 1500, "activities DELETE "], "isController": false}, {"data": [1.0, 500, 1500, "users DELETE"], "isController": false}, {"data": [0.985, 500, 1500, "coverPhotos all GET"], "isController": false}, {"data": [1.0, 500, 1500, "coverPhotosCoverPhotosForBook  GET"], "isController": false}, {"data": [0.99, 500, 1500, "authors all GET"], "isController": false}, {"data": [0.99, 500, 1500, "authors DELETE"], "isController": false}, {"data": [1.0, 500, 1500, "users all GET"], "isController": false}, {"data": [0.93, 500, 1500, "books PUT"], "isController": false}, {"data": [0.895, 500, 1500, "books POST"], "isController": false}, {"data": [0.995, 500, 1500, "activities GET"], "isController": false}, {"data": [0.99, 500, 1500, "activities PUT "], "isController": false}, {"data": [0.98, 500, 1500, "authors PUT"], "isController": false}, {"data": [0.97, 500, 1500, "books GET"], "isController": false}, {"data": [0.94, 500, 1500, "books DELETE"], "isController": false}, {"data": [1.0, 500, 1500, "coverPhotos POST"], "isController": false}, {"data": [1.0, 500, 1500, "users PUT"], "isController": false}, {"data": [1.0, 500, 1500, "users POST"], "isController": false}, {"data": [0.99, 500, 1500, "authors GET"], "isController": false}, {"data": [1.0, 500, 1500, "users GET"], "isController": false}, {"data": [0.97, 500, 1500, "activities POST"], "isController": false}, {"data": [1.0, 500, 1500, "coverPhotos GET"], "isController": false}, {"data": [0.99, 500, 1500, "books all GET"], "isController": false}, {"data": [1.0, 500, 1500, "coverPhotos DELETE"], "isController": false}, {"data": [1.0, 500, 1500, "coverPhotos PUT"], "isController": false}, {"data": [0.525, 500, 1500, "activities all GET"], "isController": false}, {"data": [0.98, 500, 1500, "authorsAuthorsForBook GET "], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2700, 0, 0.0, 179.65888888888898, 104, 2442, 117.0, 242.0, 639.7499999999991, 1374.7099999999937, 314.31897555296854, 2115.568839129802, 79.72683534633295], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["authors POST", 100, 0, 0.0, 129.19999999999993, 104, 691, 115.5, 132.0, 154.74999999999994, 690.81, 34.494653328734046, 23.048087702656087, 10.382082183511555], "isController": false}, {"data": ["activities DELETE ", 100, 0, 0.0, 130.83000000000004, 105, 712, 116.0, 140.70000000000002, 161.24999999999983, 711.6899999999998, 35.39823008849557, 20.01521017699115, 7.781388274336282], "isController": false}, {"data": ["users DELETE", 100, 0, 0.0, 115.45000000000005, 104, 155, 115.0, 127.80000000000001, 129.0, 154.7899999999999, 38.12428516965307, 21.556602649637817, 8.19448746664125], "isController": false}, {"data": ["coverPhotos all GET", 100, 0, 0.0, 134.41000000000005, 105, 678, 118.0, 134.8, 142.79999999999995, 677.96, 32.84072249589491, 676.9229782430214, 6.47834564860427], "isController": false}, {"data": ["coverPhotosCoverPhotosForBook  GET", 100, 0, 0.0, 116.00000000000001, 105, 144, 115.0, 126.0, 129.89999999999998, 143.96999999999997, 39.904229848363926, 28.307063048683162, 7.836660764166003], "isController": false}, {"data": ["authors all GET", 100, 0, 0.0, 243.15999999999997, 207, 838, 229.5, 252.9, 256.0, 837.7299999999999, 33.43363423604146, 1527.5654437270143, 6.464706619859578], "isController": false}, {"data": ["authors DELETE", 100, 0, 0.0, 134.09, 104, 710, 119.5, 148.0, 156.74999999999994, 709.6499999999999, 33.795201081446436, 19.10880998648192, 7.329994297059818], "isController": false}, {"data": ["users all GET", 100, 0, 0.0, 113.21000000000001, 104, 129, 113.0, 122.0, 123.94999999999999, 128.95999999999998, 38.98635477582846, 43.85964912280702, 7.462231968810916], "isController": false}, {"data": ["books PUT", 100, 0, 0.0, 208.95000000000005, 104, 823, 120.0, 713.9, 803.1499999999996, 822.98, 32.44646333549643, 24.509120498053214, 12.946899334847503], "isController": false}, {"data": ["books POST", 100, 0, 0.0, 248.70000000000007, 104, 818, 119.5, 752.2000000000002, 790.5999999999997, 817.99, 32.93807641633729, 24.880470808629777, 13.3006783185112], "isController": false}, {"data": ["activities GET", 100, 0, 0.0, 123.83999999999999, 104, 701, 116.0, 127.9, 158.19999999999982, 696.0599999999974, 36.04902667627974, 25.334298395818312, 7.149958318312906], "isController": false}, {"data": ["activities PUT ", 100, 0, 0.0, 133.87, 104, 788, 115.0, 143.40000000000003, 187.74999999999972, 787.81, 35.5998576005696, 24.57572200961196, 11.47261035955856], "isController": false}, {"data": ["authors PUT", 100, 0, 0.0, 142.93000000000004, 104, 757, 115.5, 158.00000000000006, 186.24999999999983, 756.6399999999999, 34.04834865509023, 22.7498829588015, 10.084828268641472], "isController": false}, {"data": ["books GET", 100, 0, 0.0, 171.10999999999996, 113, 743, 137.5, 188.4000000000001, 623.75, 742.6999999999998, 32.95978905735003, 35.70343399802241, 6.376302941661174], "isController": false}, {"data": ["books DELETE", 100, 0, 0.0, 187.70000000000007, 104, 746, 118.0, 681.8, 714.8, 745.91, 32.77613897082924, 18.532602015732547, 7.0449494018354635], "isController": false}, {"data": ["coverPhotos POST", 100, 0, 0.0, 115.53, 104, 206, 115.0, 124.0, 128.0, 205.32999999999964, 39.41663381947182, 30.336180774536857, 15.67427079227434], "isController": false}, {"data": ["users PUT", 100, 0, 0.0, 115.18000000000004, 104, 142, 115.0, 125.0, 131.0, 141.99, 38.38771593090211, 25.61555302303263, 11.148932341650672], "isController": false}, {"data": ["users POST", 100, 0, 0.0, 114.51999999999998, 104, 141, 114.0, 123.0, 128.95, 141.0, 38.56536829926726, 25.73409781141535, 11.234423206710375], "isController": false}, {"data": ["authors GET", 100, 0, 0.0, 131.57999999999998, 105, 738, 117.0, 141.9, 147.89999999999998, 737.8799999999999, 34.94060097833683, 23.827169592942, 6.827748296645702], "isController": false}, {"data": ["users GET", 100, 0, 0.0, 114.21, 104, 136, 113.5, 123.0, 129.95, 135.98, 38.774718883288095, 25.684464666537416, 7.50124200271423], "isController": false}, {"data": ["activities POST", 100, 0, 0.0, 158.96, 105, 815, 117.5, 147.70000000000002, 711.3499999999997, 814.91, 35.842293906810035, 24.74308355734767, 11.512236783154123], "isController": false}, {"data": ["coverPhotos GET", 100, 0, 0.0, 115.2, 104, 138, 114.0, 127.0, 129.95, 137.95999999999998, 40.16064257028113, 28.41051706827309, 8.004674949799195], "isController": false}, {"data": ["books all GET", 100, 0, 0.0, 261.9599999999999, 211, 871, 247.5, 283.8, 306.79999999999995, 870.9499999999999, 32.08213025344883, 3066.819182106192, 6.14072024382419], "isController": false}, {"data": ["coverPhotos DELETE", 100, 0, 0.0, 113.88999999999999, 104, 128, 114.0, 123.9, 125.0, 127.97999999999999, 39.24646781789639, 22.191118033751962, 8.665650755494505], "isController": false}, {"data": ["coverPhotos PUT", 100, 0, 0.0, 115.77999999999999, 104, 142, 115.0, 125.0, 126.94999999999999, 141.91999999999996, 39.682539682539684, 30.540829613095237, 15.667627728174603], "isController": false}, {"data": ["activities all GET", 100, 0, 0.0, 1016.2899999999998, 425, 2442, 691.5, 2188.9, 2419.25, 2441.93, 19.786307874950534, 67.04486081569054, 3.8838358231104073], "isController": false}, {"data": ["authorsAuthorsForBook GET ", 100, 0, 0.0, 144.23999999999995, 105, 745, 117.0, 139.9, 155.5999999999999, 744.91, 35.1123595505618, 29.617823911516854, 6.929890493328652], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2700, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

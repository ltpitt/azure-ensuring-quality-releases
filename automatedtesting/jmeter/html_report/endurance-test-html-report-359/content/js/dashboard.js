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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9997276014065672, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "authors POST"], "isController": false}, {"data": [1.0, 500, 1500, "activities DELETE "], "isController": false}, {"data": [1.0, 500, 1500, "users DELETE"], "isController": false}, {"data": [1.0, 500, 1500, "coverPhotos all GET"], "isController": false}, {"data": [1.0, 500, 1500, "coverPhotosCoverPhotosForBook  GET"], "isController": false}, {"data": [1.0, 500, 1500, "authors all GET"], "isController": false}, {"data": [1.0, 500, 1500, "authors DELETE"], "isController": false}, {"data": [1.0, 500, 1500, "users all GET"], "isController": false}, {"data": [1.0, 500, 1500, "books PUT"], "isController": false}, {"data": [1.0, 500, 1500, "books POST"], "isController": false}, {"data": [1.0, 500, 1500, "activities GET"], "isController": false}, {"data": [1.0, 500, 1500, "activities PUT "], "isController": false}, {"data": [1.0, 500, 1500, "authors PUT"], "isController": false}, {"data": [1.0, 500, 1500, "books GET"], "isController": false}, {"data": [1.0, 500, 1500, "books DELETE"], "isController": false}, {"data": [1.0, 500, 1500, "coverPhotos POST"], "isController": false}, {"data": [1.0, 500, 1500, "users PUT"], "isController": false}, {"data": [1.0, 500, 1500, "users POST"], "isController": false}, {"data": [1.0, 500, 1500, "authors GET"], "isController": false}, {"data": [1.0, 500, 1500, "users GET"], "isController": false}, {"data": [1.0, 500, 1500, "activities POST"], "isController": false}, {"data": [1.0, 500, 1500, "coverPhotos GET"], "isController": false}, {"data": [1.0, 500, 1500, "books all GET"], "isController": false}, {"data": [1.0, 500, 1500, "coverPhotos DELETE"], "isController": false}, {"data": [1.0, 500, 1500, "coverPhotos PUT"], "isController": false}, {"data": [0.9928198433420365, 500, 1500, "activities all GET"], "isController": false}, {"data": [1.0, 500, 1500, "authorsAuthorsForBook GET "], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 20191, 0, 0.0, 135.13926997176986, 103, 771, 115.0, 217.0, 242.0, 469.0, 168.10843664399243, 1142.2084838935282, 42.62102132109286], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["authors POST", 750, 0, 0.0, 113.09733333333324, 103, 141, 113.0, 121.0, 123.0, 126.0, 6.374461358015247, 4.259185997220735, 1.918563467324511], "isController": false}, {"data": ["activities DELETE ", 755, 0, 0.0, 112.99072847682125, 103, 128, 113.0, 121.0, 122.19999999999993, 126.0, 6.36454065719151, 3.5987002348768398, 1.3990760615295128], "isController": false}, {"data": ["users DELETE", 737, 0, 0.0, 113.07055630936232, 103, 160, 112.0, 121.0, 123.0, 127.0, 6.359423941462236, 3.59580709190101, 1.366897626325599], "isController": false}, {"data": ["coverPhotos all GET", 746, 0, 0.0, 114.66085790884723, 104, 160, 114.0, 122.30000000000007, 124.0, 130.0, 6.3726369561689005, 131.35473460337596, 1.2571022120567557], "isController": false}, {"data": ["coverPhotosCoverPhotosForBook  GET", 744, 0, 0.0, 113.6370967741935, 104, 195, 113.0, 122.0, 123.0, 127.54999999999995, 6.373519056307985, 4.521201695321802, 1.251671148047253], "isController": false}, {"data": ["authors all GET", 751, 0, 0.0, 225.3888149134489, 207, 253, 225.0, 241.0, 244.0, 250.0, 6.347301340455383, 297.90661474796735, 1.227310220127115], "isController": false}, {"data": ["authors DELETE", 750, 0, 0.0, 113.13066666666673, 103, 146, 113.0, 121.0, 123.0, 128.49, 6.375328329408965, 3.604799905007608, 1.382773849572003], "isController": false}, {"data": ["users all GET", 739, 0, 0.0, 113.2097428958051, 103, 201, 113.0, 121.0, 123.0, 128.60000000000002, 6.371019190647792, 7.167396589478766, 1.219452891959929], "isController": false}, {"data": ["books PUT", 748, 0, 0.0, 113.30748663101603, 104, 151, 113.0, 121.0, 123.0, 129.0, 6.384595030599964, 4.822705189403963, 2.5475630457420384], "isController": false}, {"data": ["books POST", 748, 0, 0.0, 113.26069518716574, 104, 141, 113.0, 121.0, 123.0, 127.50999999999999, 6.384867522534827, 4.822911020511814, 2.5782310321206636], "isController": false}, {"data": ["activities GET", 761, 0, 0.0, 113.06044678055198, 104, 138, 113.0, 121.0, 122.0, 126.0, 6.390447079372544, 4.4907573120654325, 1.2674794551535051], "isController": false}, {"data": ["activities PUT ", 756, 0, 0.0, 113.25132275132276, 104, 136, 113.0, 121.0, 123.0, 126.0, 6.3623510401939, 4.392123211114758, 2.050350597311991], "isController": false}, {"data": ["authors PUT", 750, 0, 0.0, 113.27866666666668, 104, 144, 113.0, 121.0, 123.0, 127.0, 6.3748948142355655, 4.259475617089818, 1.8881890597242645], "isController": false}, {"data": ["books GET", 749, 0, 0.0, 120.38451268357821, 107, 181, 120.0, 129.0, 131.0, 136.5, 6.37143148797169, 6.9015146238813845, 1.232590743985845], "isController": false}, {"data": ["books DELETE", 748, 0, 0.0, 113.00267379679148, 103, 141, 113.0, 121.0, 122.0, 126.0, 6.385140037730372, 3.610347736177623, 1.3724243098414812], "isController": false}, {"data": ["coverPhotos POST", 739, 0, 0.0, 113.14614343707721, 103, 155, 113.0, 121.0, 123.0, 125.60000000000002, 6.369371854099152, 4.902247123978659, 2.5330157984554917], "isController": false}, {"data": ["users PUT", 737, 0, 0.0, 113.21981004070547, 103, 146, 113.0, 121.0, 123.0, 130.62, 6.358984978300072, 4.243238590281193, 1.8468144273246534], "isController": false}, {"data": ["users POST", 739, 0, 0.0, 113.11907983761841, 103, 131, 113.0, 121.0, 123.0, 127.0, 6.3725574737423045, 4.252290272579894, 1.856358019268579], "isController": false}, {"data": ["authors GET", 752, 0, 0.0, 113.92021276595749, 104, 133, 114.0, 122.0, 123.35000000000002, 127.47000000000003, 6.348187980651534, 4.329037697114614, 1.240498756426274], "isController": false}, {"data": ["users GET", 739, 0, 0.0, 113.01488497970227, 103, 137, 113.0, 121.0, 122.0, 127.0, 6.371733301144153, 4.220628338370078, 1.2326490303368656], "isController": false}, {"data": ["activities POST", 758, 0, 0.0, 113.33509234828482, 103, 139, 113.0, 121.0, 123.0, 127.0, 6.368409997899601, 4.396299359378282, 2.0454605124973746], "isController": false}, {"data": ["coverPhotos GET", 744, 0, 0.0, 113.366935483871, 104, 135, 113.0, 121.0, 123.0, 127.0, 6.373246072401446, 4.508560301701245, 1.2702891571296406], "isController": false}, {"data": ["books all GET", 750, 0, 0.0, 232.61066666666648, 210, 278, 232.0, 249.0, 253.0, 260.0, 6.369264477338157, 608.8385636273598, 1.2191170288655067], "isController": false}, {"data": ["coverPhotos DELETE", 739, 0, 0.0, 113.08660351826785, 103, 131, 113.0, 121.0, 123.0, 126.0, 6.370250327563616, 3.6019286520110683, 1.406548672828598], "isController": false}, {"data": ["coverPhotos PUT", 741, 0, 0.0, 113.2672064777328, 103, 137, 113.0, 121.0, 123.0, 126.0, 6.3480912891508465, 4.8852052153296555, 2.5059008041129807], "isController": false}, {"data": ["activities all GET", 766, 0, 0.0, 454.76240208877255, 418, 771, 453.0, 486.0, 491.65, 503.9900000000001, 6.377646598449716, 21.63534715399602, 1.2518622717660086], "isController": false}, {"data": ["authorsAuthorsForBook GET ", 755, 0, 0.0, 114.02649006622524, 104, 138, 114.0, 122.0, 124.0, 127.43999999999994, 6.36470161773012, 5.293095036375745, 1.2561542792080793], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 20191, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

// Joos Akkerman (11304723)
// MPROG Project (Summer)
// This is the main file of a visualization that visualized the political shifts in the Dutch
// political landscape.

var map_w = 450;
var map_h = 550;
var barWidth = 300;
var barHeight = 40;
var line_w = 550;
var line_h = 280;
var line_start_w = 40;
var line_end_w = 0.95*line_w;
var line_start_h = 20;
var line_end_h = 0.85*line_h;
var pieWidth = 300
var pieHeight = 300
var pieMargin = 40
var pieRadius = Math.min(pieWidth, pieHeight) / 2;
var legendWidth = 900;
var legendHeight = 60;
var legendItemWidth = 100;
var legendItemHeight = 18;
var electionYears = ['1946', '1948', '1952', '1956', '1959', '1963', '1967', '1971',
                     '1972', '1977', '1981', '1982', '1986', '1989', '1994', '1998',
                     '2002', '2003', '2006', '2010', '2012', '2017'];
var partyAbrev = ["VVD", "CDA", "PvdA", "KVP", "ARP", "D66", "SP", "SGP", "PVV", "GL", "CHU", "CU", "PvdD", "50PLUS", "DENK", "FvD", "CPN", "Overig"];
var changeMethod = 'Abs';

var requests = [d3v5.json("json/data.json"), d3v5.json("json/data_NL.json"), d3v5.json("json/data_rile.json")]

Promise.all(requests).then(function(response) {

    let data = response[0]
    let data_NL = response[1]
    let data_riles = response[2]


    // scale properties for line chart and parallel coordinates chart
    lineScales = lineScale(line_start_w, line_end_w, line_start_h, line_end_h);
      xScale = lineScales[0];
      yScaleLine = lineScales[1];
      yScaleRile = lineScales[2];
      colorScale = lineScales[3];

    // draw axes of linechart
    drawAxes(xScale, yScaleLine, "linechart");

    // draw axes of changechart
    drawAxes(xScale, yScaleRile, "changechart")

    // draw map and first change chart
    drawMap(data, data_riles, xScale, yScaleLine, colorScale, yScaleRile);
    drawRileChartAbs(data_riles[0]['Nederland'], 'Nederland', xScale, yScaleRile);
    mapLegend(colorScale);

    // set options for dropdown
    dropDownMunOptions(data, data_riles);

    // draw first line chart and pie chart
    drawLineChart(data_NL[0]['Nederland']);
    drawPieChart(data_NL[0]['Nederland'], 2017);
    partyLegend();
    drawPieChart.updatePie(data_NL[0]['Nederland'], 2017)
    dropDownPieOptions(data_NL[0]['Nederland'], 'Nederland');

    var mun = 'Nederland';

    // update graphs if municipality from menu is selected
    d3v5.select(".dropdownmunoptions").on("change", function() {
      mun = this.value;

      if (mun == "Nederland") {
        // drawLineChart.updateLine(data_NL[0]["Nederland"]);
        drawLineChart(data_NL[0]["Nederland"]);
        dropDownPieOptions(data_NL[0]["Nederland"], "Nederland");
        if (changeMethod == "Abs") {
          drawRileChartAbs(data_riles[0]["Nederland"], "Nederland", xScale, yScaleRile);
        } else {
          drawRileChartRel(data_riles[0], "Nederland", xScale, yScaleRile);
        };
        drawMap.updateText("Nederland");
        drawPieChart.updatePie(data_NL[0]["Nederland"], 2017);
      } else {
        drawLineChart(data[0][mun]);
        dropDownPieOptions(data[0][mun], mun);
        if (changeMethod == "Abs") {
          drawRileChartAbs(data_riles[0][mun], mun, xScale, yScaleRile);
        } else {
          drawRileChartRel(data_riles[0], "Nederland", xScale, yScaleRile);
        };
        drawMap.updateText(mun);
        drawPieChart.updatePie(data[0][mun], 2017);
      }

    });

    // update pie chart if different year is selected
    d3v5.select(".dropdownpieoptions").on("change", function() {
      if (mun == "Nederland") {
        drawPieChart.updatePie(data_NL[0]["Nederland"], this.value);
      } else {
        drawPieChart.updatePie(data[0][mun], this.value);
      }
    })

    d3v5.select(".reset").on("click", function() {
      if (changeMethod == "Abs") {
        d3v5.selectAll(".absline").remove();
        drawRileChartAbs(data_riles[0]["Nederland"], mun, xScale, yScaleRile);
      } else {
        d3v5.selectAll(".relline").remove();
        drawRileChartRel(data_riles[0], mun, xScale, yScaleRile);
      }
    })

    // update left-right line if radio button is changed
    d3v5.selectAll(".relabs").on("change", function() {
      if (this.value == "Relative") {
        drawRileChartRel(data_riles[0], mun, xScale, yScaleRile);
        changeMethod = "Rel"
      } else {
        drawRileChartAbs(data_riles[0]['Nederland'], mun, xScale, yScaleRile);
        changeMethod = "Abs"
      };
    })
});

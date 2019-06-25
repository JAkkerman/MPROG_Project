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

d3v5.json('data.json').then(function(data) {
  d3v5.json('data_rile.json').then(function(data_riles) {
    d3v5.json('data_NL.json').then(function(data_NL) {

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
          drawLineChart(data_NL[0]["Nederland"]);
          dropDownPieOptions(data_NL[0]["Nederland"], "Nederland");
          drawRileChartAbs(data_riles[0]["Nederland"], "Nederland", xScale, yScaleRile);
          drawMap.updateText("Nederland");
          drawPieChart.updatePie(data_NL[0]["Nederland"], 2017);
        } else {
          drawLineChart(data[0][mun]);
          dropDownPieOptions(data[0][mun], mun);
          drawRileChartAbs(data_riles[0][mun], mun, xScale, yScaleRile);
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
          drawRileChartAbs(data_riles[0][mun], mun, xScale, lineScale[2]);
        } else {
          d3v5.selectAll(".relline").remove();
          drawRileChartRel(data_riles[0], mun, xScale, lineScale[2]);
        }
      })

      // update left-right line if radio button is changed
      d3v5.selectAll(".relabs").on("change", function() {
        if (this.value == "Relative") {
          drawRileChartRel(data_riles[0][mun], mun, xScale, lineScale[2]);
          changeMethod = "Rel"
        } else {
          drawRileChartAbs(data_riles[0][mun], mun, xScale, lineScale[2]);
          changeMethod = "Abs"
        };
      })

    });
  });
});


// function drawMap(data, data_riles, linexScale, lineyScale, colorScale, lineScale[2]) {
//
//   d3v5.json("NL_mun_2017.geojson").then(function(mun) {
//
//     drawMap.updateText = updateText;
//
//     var projection = d3v5.geoMercator()
//                          .scale(5500)
//                          .center([0, 52])
//                          .rotate([-5, 0])
//                          .translate([map_w/2, map_h/2]);
//
//     var path = d3v5.geoPath()
//                    .projection(projection);
//
//     let svg = d3v5.select("#map")
//                   .append("svg")
//                   .attr("class", "map")
//                   .attr("width", map_w)
//                   .attr("height", map_h);
//
//     svg.append("text")
//        .attr("id", "regionName")
//        .text("Nederland")
//        .attr("y", "30")
//
//     var tip = d3v5.tip()
//                   .attr('class', 'd3-tip')
//                   .offset([-10, 0])
//                   .html(function(d) {
//                     return "<strong>" + d.properties.Gemeentenaam + "</strong>";
//                   });
//
//     svg.call(tip);
//
//     svg.selectAll("path")
//        .data(mun.features)
//        .enter()
//        .append("path")
//        .attr("class", "municipality")
//        .attr("d", path)
//        .attr("fill", function(d) {
//           if (data_riles[0][d.properties.Gemeentenaam]) {
//             gemeente_data = data_riles[0][d.properties.Gemeentenaam].filter(d => d.year == 2017)
//             return colorScale(gemeente_data[0].value);
//           } else {
//             return "rgb(204, 204, 204)"
//           }
//        })
//        .on("mouseover", tip.show)
//        .on("mouseout", tip.hide)
//        .on("click", function(d) {
//          // updateRegionName(d.properties.Gemeentenaam);
//          drawLineChart(data[0][d.properties.Gemeentenaam]);
//          if (changeMethod == "Abs") {
//            drawRileChartAbs(data_riles[0][d.properties.Gemeentenaam], d.properties.Gemeentenaam, linexScale, lineScale[2]);
//          } else {
//            drawRileChartRel(data_riles[0], d.properties.Gemeentenaam, linexScale, lineScale[2]);
//          }
//          // change values of dropdown piechart
//          dropDownPieOptions(data[0][d.properties.Gemeentenaam], d.properties.Gemeentenaam)
//          drawPieChart.updatePie(data[0][d.properties.Gemeentenaam], 2017)
//          svg.selectAll("#regionName").remove()
//          svg.append("text")
//             .attr("id", "regionName")
//             .text(d.properties.Gemeentenaam)
//             .attr("y", "30")
//        });
//
//        // draw legend
//
//    });
//
//    function updateText(name) {
//      // console.log("yeet");
//      // text = svg.select("#regionName")
//      // text.text(name)
//    };
// };

// function updateRegionName (mun) {
//   /* updates name of selected region */
//
//   d3v5.selectAll("#regionName").remove()
//   d3v5.append("text")
//      .attr("id", "regionName")
//      .text(mun)
//      .attr("y", "30")
// }


// function lineScale(start_w, end_w, start_h, end_h) {
//   /* sets the scale for the axes of the line chart and the rile chart */
//
//   electionYears_int = []
//   electionYears.forEach(function(element) {
//     electionYears_int.push(parseInt(element))
//   })
//
//   // x scale (years)
//   var xScale = d3v5.scaleBand()
//                    .domain(electionYears_int)
//                    .range([line_start_w, line_end_w]);
//
//   // y-axis (percentages)
//   var yScaleLine = d3v5.scaleLinear()
//                        .domain([0, 50])
//                        .range([line_end_h - line_start_h, line_start_h]);
//
//   // y-axis (riles)
//   var yScaleRile = d3v5.scaleLinear()
//                        .domain([-35, 35])
//                        .range([line_end_h - line_start_h, line_start_h]);
//
//   // color scale (left-right)
//   var colorScale = d3v5.scaleLinear()
//                        .domain([-10,10])
//                        .range(["#ff0000", "#00c3ff"]);
//
//   return [xScale, yScaleLine, yScaleRile, colorScale];
// };


// function drawAxes(xScale, yScale, type) {
//   /* draws the axes for both the line chart as the rile chart */
//
//   // make svg for line chart
//   var svg = d3v5.select("#" + type)
//                 .append("svg")
//                 .attr("class", type)
//                 .attr("width", line_w)
//                 .attr("height", line_h);
//
//   // append title x-axis
//   svg.append("text")
//      .attr("x", line_w/2)
//      .attr("y", line_h)
//      .attr("text-anchor", "middle")
//      .text("Jaren")
//
//   // appends properties of the rile chart
//   if (type == "changechart") {
//
//     var xAxis = d3v5.axisBottom(xScale);
//     svg.append("g")
//        .attr("class", "xAxis")
//        .attr("transform", "translate(0, "+ line_end_h +")")
//        .call(xAxis);
//
//      var yAxis = d3v5.axisLeft(yScale);
//      svg.append("g")
//         .attr("class", "yAxis")
//         .attr("transform", "translate("+ line_start_w +", "+ line_start_h +")")
//         .call(yAxis);
//
//     svg.append("line")
//        .style("stroke", "black")
//        .attr("x1", 30)
//        .attr("y1", yScale(0) + line_start_h)
//        .attr("x2", line_end_w)
//        .attr("y2", yScale(0) + line_start_h);
//
//     svg.append("text")
//       .attr("x", line_w/1.5)
//       .attr("y", 80)
//       .attr("text-anchor", "middle")
//       .text("Rechts georiënteerd")
//
//     svg.append("text")
//        .attr("x", line_w/1.5)
//        .attr("y", 200)
//        .attr("text-anchor", "middle")
//        .text("Links georiënteerd")
//
//     svg.append("text")
//        .attr("x", line_w/2)
//        .attr("y", 200)
//        .attr("transform", "rotate(-90, 115 300)")
//        .attr("text-anchor", "middle")
//        .text("<Links ---------- Rechts>")
//   } else { // appends properties of the line chart
//     svg.append("text")
//        .attr("x", line_w/2)
//        .attr("y", 200)
//        .attr("transform", "rotate(-90, 115 300)")
//        .attr("text-anchor", "middle")
//        .text("Percentage Stemmen")
//   };
// };


// function drawLineChart(data) {
// /* draws line chart showing election results over time */
//
//   drawLineChart.updateLine = updateLine;
//
//   axes = updateAxes(data)
//   xScale = axes[0]
//   yScale = axes[1]
//   xAxis = axes[2]
//   yAxis = axes[3]
//
//   svg = d3v5.select(".linechart")
//
//   svg.select(".xAxis").remove();
//   svg.select(".yAxis").remove();
//
//   svg.append("g")
//      .attr("class", "xAxis")
//      .attr("transform", "translate(0, "+ line_end_h +")")
//      .call(xAxis);
//
//   svg.append("g")
//      .attr("class", "yAxis")
//      .attr("transform", "translate("+ line_start_w +", "+ line_start_h +")")
//      .call(yAxis);
//
//   svg.selectAll(".line").remove()
//
//   var linetip = d3v5.tip()
//                     .attr('class', 'd3-tip')
//                     .offset([-50, 0])
//                     .html(function(d) {
//                       return "<strong>" + this.id + "</strong>";
//                     });
//
//   svg.call(linetip);
//
//   // convert data from dict to array
//   var lineData = [], party;
//
//   for (var type in data) {
//       party = {};
//       party.party = type;
//       party.years = data[type];
//       lineData.push(party);
//   }
//
//   var line = d3v5.line()
//                  .x(function(d) {
//                    return xScale(parseInt(d.year));
//                  })
//                  .y(function(d) {
//                    return yScale(d.value) + line_start_h;
//                  });
//
//   lineData.forEach(function(d) {
//     svg.append("path")
//        .attr("class", "line")
//        .attr("id", d.party)
//        .attr("d", line(d.years))
//        .attr("fill", "none")
//        .attr("stroke-width", "2.5px")
//        .attr("stroke", partyColor(d.party))
//        .on("mouseover", linetip.show)
//        .on("mouseout", linetip.hide)
//   })
//
//   function updateAxes(data) {
//     /* creates custom axes for selected region */
//
//     existYears = []
//     max_val = 50;
//
//     // checks which years exist in this municipality
//     data['Partij van de Arbeid (P.v.d.A.)'].forEach(function(e) {
//       existYears.push(parseInt(e.year))
//     })
//
//     // checks the maximum percentage of votes to ammend the y-axis
//     for (party in data) {
//       data[party].forEach(function(e) {
//         if (e.value > max_val) {
//           max_val = e.value
//         }
//       })
//     }
//
//     // make a new x-scale and y-scale for every municipality
//     var xScale = d3v5.scaleBand()
//                      .domain(existYears)
//                      .range([line_start_w, line_end_w]);
//
//     var yScale = d3v5.scaleLinear()
//                      .domain([0, max_val])
//                      .range([line_end_h - line_start_h, line_start_h]);
//
//     var xAxis = d3v5.axisBottom(xScale);
//     var yAxis = d3v5.axisLeft(yScale);
//
//     return [xScale, yScale, xAxis, yAxis]
//   }
//
//   function updateLine(data) {
//     // console.log(data);
//   }
//
// };


// function mapLegend(colorScale) {
// /* Creates a legend showing colors on the map
//    based on http://bl.ocks.org/syntagmatic/e8ccca52559796be775553b467593a9f */
//
// var legendheight = 200,
//     legendwidth = 80,
//     margin = {top: 10, right: 60, bottom: 10, left: 2};
//
// var canvas = d3v5.select("#legendmap")
//                  .style("height", legendheight + "px")
//                  .style("width", legendwidth + "px")
//                  .style("position", "relative")
//                  .append("canvas")
//                  .attr("height", legendheight - margin.top - margin.bottom)
//                  .attr("width", 1)
//                  .style("height", (legendheight - margin.top - margin.bottom) + "px")
//                  .style("width", (legendwidth - margin.left - margin.right) + "px")
//                  .style("border", "1px solid #000")
//                  .style("position", "absolute")
//                  .style("top", (margin.top) + "px")
//                  .style("left", (margin.left) + "px")
//                  .node();
//
//   var ctx = canvas.getContext("2d");
//
//   var legendscale = d3v5.scaleLinear()
//                         .range([1, legendheight - margin.top - margin.bottom])
//                         .domain(colorScale.domain());
//
//   var legendScaleText = d3v5.scaleOrdinal()
//                             .range([1, legendheight - margin.top - margin.bottom])
//                             .domain(["Links", "Rechts"]);
//
//   var image = ctx.createImageData(1, legendheight);
//   d3v5.range(legendheight).forEach(function(i) {
//     var c = d3v5.rgb(colorScale(legendscale.invert(i)));
//     image.data[4*i] = c.r;
//     image.data[4*i + 1] = c.g;
//     image.data[4*i + 2] = c.b;
//     image.data[4*i + 3] = 255;
//   });
//   ctx.putImageData(image, 0, 0);
//
//   var legendaxis = d3v5.axisRight()
//                        .scale(legendScaleText)
//                        .tickSize(6)
//                        .ticks(2);
//
//   var svg = d3v5.select("#legendmap")
//                 .append("svg")
//                 .attr("height", (legendheight) + "px")
//                 .attr("width", (legendwidth) + "px")
//                 .style("position", "absolute")
//                 .style("left", "0px")
//                 .style("top", "0px")
//
//   svg.append("g")
//      .attr("class", "axis")
//      .attr("transform", "translate(" + (legendwidth - margin.left - margin.right + 3) + "," + (margin.top) + ")")
//      .call(legendaxis);
//
// };


// function partyLegend() {
//   /* Creates a legend showing the party colors, used and changed code from https://stackoverflow.com/questions/42009622/how-to-create-a-horizontal-legend */
//
//   var n = partyAbrev.length/2;
//
//   var svg = d3v5.select(".legendparties")
//                 .append("svg")
//                 .attr("id", "legendparties")
//                 .attr("width", legendWidth)
//                 .attr("height", legendHeight);
//
//   var legend = svg.selectAll(".legend")
//                 	.data(partyAbrev)
//                 	.enter()
//                 	.append("g")
//                 	.attr("transform", function(d, i) {
//                     return "translate(" + i%n * legendItemWidth + "," + Math.floor(i/n) * legendItemHeight + ")";
//                   })
//                 	.attr("class","legend");
//
//   var rects = legend.append('rect')
//                   	.attr("width",15)
//                   	.attr("height",15)
//                   	.attr("fill", function(d) {return partyColor(d); });
//
//   var text = legend.append('text')
//                    .attr("x",20)
//                    .attr("y",12)
//                    .text(function(d) {
//                      return d;
//                    });
// };

//
// function drawRileChartAbs(data, mun, xScale, yScale) {
//
//   svg = d3v5.select(".changechart")
//
//   d3v5.selectAll(".relline").remove()
//
//   var line = d3v5.line()
//                  .x(function(d) {
//                    return xScale(parseInt(d.year));
//                  })
//                  .y(function(d) {
//                    return yScale(d.value) + line_start_h;
//                  });
//
//   svg.append("path")
//      .data(data)
//      .attr("class", "absline")
//      .attr("d", line(data))
//      .attr("fill", "none")
//      .attr("stroke-width", function() {
//        if (mun == "Nederland") {
//          return "3px";
//        } else {
//          return "1.5px"
//        }
//      })
//      .attr("stroke", function() {
//        if (mun == "Nederland") {
//          return "#ff0000";
//        } else {
//          return "#1d00ff"
//        }
//      });
//
//   function updateLine(data) {
//     // console.log(data);
//   }
// };
//
//
// function drawRileChartRel(data, mun, xScale, yScale) {
//
//   svg = d3v5.select(".changechart")
//
//   svg.selectAll(".absline").remove()
//
//   var line = d3v5.line()
//                  .x(function(d) {
//                    return xScale(parseInt(d.year));
//                  })
//                  .y(function(d) {
//                    var rile_NL = 0
//                    data['Nederland'].forEach(function(e) {
//                      console.log(e);
//                      console.log("yeet");
//                      if (e.year == d.year) {
//                         rile_NL = e.value
//                      }
//                    })
//                    console.log(d.value - rile_NL);
//                    return yScale(d.value - rile_NL) + line_start_h;
//                  });
//
//   svg.append("path")
//      .data(data[mun])
//      .attr("class", "relline")
//      .attr("d", line(data[mun]))
//      .attr("fill", "none")
//      .attr("stroke-width", function() {
//        if (mun == "Nederland") {
//          return "3px";
//        } else {
//          return "1.5px"
//        }
//      })
//      .attr("stroke", function() {
//        if (mun == "Nederland") {
//          return "#ff0000";
//        } else {
//          return "#1d00ff"
//        }
//      });
//
// };


// function drawPieChart(data, year) {
//   /* draws a pie chart */
//
//     drawPieChart.updatePie = updatePie;
//
//     let svg = d3v5.select("#piechart")
//                   .append("svg")
//                       .attr("width", pieWidth)
//                       .attr("height", pieHeight)
//                       .attr("class", "piechart")
//                   .append("g")
//                       .attr("transform", `translate(${pieWidth / 2}, ${pieHeight / 2})`);
//
//     let pie = d3v5.pie()
//                   .value(function(d) {return d.value;});
//
//     var radius = Math.min(pieWidth, pieHeight) / 2 - pieMargin;
//
//     let arc = d3v5.arc()
//                   .innerRadius(0)
//                   .outerRadius(radius)
//
//     var results = {}
//     for (party in data) {
//       data[party].forEach(function(d) {
//         if (d['year'] == year) {
//           results[party] = d['value']
//         }
//       })
//     };
//
//     var pie_data = pie(d3v5.entries(results));
//
//     let path = svg.selectAll("path")
//                   .data(pie_data)
//
//     var pieTip = d3v5.tip()
//                      .attr('class', 'd3-tip')
//                      .offset([-10, 0])
//                      .html(function(d) {
//                        return "<strong>" + this.id + "</strong>";
//                      });
//
//     svg.call(pieTip);
//
//     path.enter()
//         .append("path")
//         .attr("fill", function(d) {
//           return partyColor(d.data.key);
//         })
//         .attr("class", "piepiece")
//         .attr("id", function(d) {
//           return d.data.key;
//         })
//         .attr("d", arc)
//         .on("mouseover", pieTip.show)
//         .on("mouseout", pieTip.hide)
//         .each(function(d) { this._current = d; });
//
//
//     function updatePie(data, year) {
//
//       var results = {}
//       for (party in data) {
//         data[party].forEach(function(d) {
//           if (d['year'] == year) {
//             results[party] = d['value']
//           }
//         })
//       };
//
//       d3v5.selectAll(".piepiece").data(pie(d3v5.entries(results)))
//           .attr("fill", function(d) {
//             return partyColor(d.data.key);
//           })
//           .attr("class", "piepiece")
//           .attr("id", function(d) {
//             return d.data.key;
//           })
//           .attr("d", arc)
//           .on("mouseover", pieTip.show)
//           .on("mouseout", pieTip.hide)
//           .each(function(d) { this._current = d; });
//
//         path.exit()
//             .remove();
//
//     }
//
// };

// function partyColor(party) {
//   /* sets colors of parties in pie chart and line chart, colors based of actual party colors */
//
//   if (party == "VVD") {
//     return "rgb(24, 62, 249)";
//   } else if (party == "Christen Democratisch Appèl (CDA)" || party == "CDA") {
//     return "rgb(13, 193, 34)";
//   } else if (party == "Partij van de Arbeid (P.v.d.A.)" || party == "PvdA") {
//     return "rgb(255, 17, 17)";
//   } else if (party == "Katholieke Volkspartij (KVP)" || party == "KVP") {
//     return "rgb(191, 0, 95)";
//   } else if (party == "Anti-Revolutionaire Partij" || party == "ARP") {
//     return "rgb(0, 96, 16)";
//   } else if (party == "Democraten 66 (D66)" || party == "D66") {
//     return "rgb(58, 224, 149)";
//   } else if (party == "SP (Socialistische Partij)" || party == "SP") {
//     return "rgb(142, 1, 1)";
//   } else if (party == "Staatkundig Gereformeerde Partij (SGP)" || party == "SGP") {
//     return "rgb(170, 131, 131)";
//   } else if (party == "PVV (Partij voor de Vrijheid)" || party == "PVV") {
//     return "#000000";
//   } else if (party == "GL") {
//     return "rgb(56, 255, 72)";
//   } else if (party == "Christelijk-Historische Unie" || party == "CHU") {
//     return "rgb(145, 191, 80)";
//   } else if (party == "ChristenUnie" || party == "CU") {
//     return "rgb(124, 218, 255)";
//   } else if (party == "Partij voor de Dieren" || party == "PvdD") {
//     return "rgb(29, 140, 84)";
//   } else if (party == "50PLUS") {
//     return "rgb(183, 23, 178)";
//   } else if (party == "DENK") {
//     return "rgb(21, 216, 193)";
//   } else if (party == "Forum voor Democratie" || party == "FvD") {
//     return "rgb(255, 157, 0)";
//   } else if (party == "Communistische Partij van Nederland" || party == "CPN") {
//     return "rgb(193, 17, 17)";
//   } else {
//     return "rgb(193, 193, 193)"
//   }
// };


// function dropDownMunOptions(data, data_riles) {
// /* sets options for drop down menu municipalities */
//
//   d3v5.select(".dropdownmunoptions")
//       .append("option")
//       .attr("value", "Nederland")
//       .text("Nederland")
//       .attr("selected")
//
//   for (var key in data[0]) {
//     d3v5.select(".dropdownmunoptions")
//         .append("option")
//         .attr("value", key)
//         .text(key)
//         .on("click", function() {
//           var mun = d3v5.select(".dropdownmunoptions").node().value
//           drawLineChart.updateLine(mun)
//         })
//   }
// }


// function dropDownPieOptions(data, name) {
// /* sets options for drop down menu pie chart */
//
//   d3v5.selectAll("#pieyear").remove();
//
//   for (var key in data['Partij van de Arbeid (P.v.d.A.)']) {
//
//     year = data['Partij van de Arbeid (P.v.d.A.)'][key]['year']
//
//     d3v5.select(".dropdownpieoptions")
//         .append("option")
//         .attr("id", "pieyear")
//         .attr("name", name)
//         .attr("value", year)
//         .attr("selected", function() {if (year == 2017) {return "selected"}})
//         .text(year)
//
//   }
// }

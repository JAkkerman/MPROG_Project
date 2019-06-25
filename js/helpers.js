// Joos Akkerman (11304723)
// MPROG Project (Summer)
// This file consists of some helper functions used to create the visualization

function lineScale(start_w, end_w, start_h, end_h) {
  /* sets the scale for the axes of the line chart and the rile chart */

  electionYears_int = []
  electionYears.forEach(function(element) {
    electionYears_int.push(parseInt(element))
  })

  // x scale (years)
  var xScale = d3v5.scaleLinear()
                   .domain([1946, 2017])
                   .range([line_start_w, line_end_w]);

  // y-axis (percentages)
  var yScaleLine = d3v5.scaleLinear()
                       .domain([0, 50])
                       .range([line_end_h - line_start_h, line_start_h]);

  // y-axis (riles)
  var yScaleRile = d3v5.scaleLinear()
                       .domain([-35, 35])
                       .range([line_end_h - line_start_h, line_start_h]);

  // color scale (left-right)
  var colorScale = d3v5.scaleLinear()
                       .domain([-10,10])
                       .range(["#ff0000", "#00c3ff"]);

  return [xScale, yScaleLine, yScaleRile, colorScale];
};


function drawAxes(xScale, yScale, type) {
  /* draws the axes for both the line chart as the rile chart */

  // make svg for line chart
  var svg = d3v5.select("#" + type)
                .append("svg")
                .attr("class", type)
                .attr("width", line_w)
                .attr("height", line_h);

  // append title x-axis
  svg.append("text")
     .attr("x", line_w/2)
     .attr("y", line_h)
     .attr("text-anchor", "middle")
     .text("Jaren")

  // appends properties of the rile chart
  if (type == "changechart") {

    var xAxis = d3v5.axisBottom(xScale);
    svg.append("g")
       .attr("class", "xAxis")
       .attr("transform", "translate(0, "+ line_end_h +")")
       .call(xAxis);

     var yAxis = d3v5.axisLeft(yScale);
     svg.append("g")
        .attr("class", "yAxis")
        .attr("transform", "translate("+ line_start_w +", "+ line_start_h +")")
        .call(yAxis);

    svg.append("line")
       .style("stroke", "black")
       .attr("x1", 30)
       .attr("y1", yScale(0) + line_start_h)
       .attr("x2", line_end_w)
       .attr("y2", yScale(0) + line_start_h);

    svg.append("text")
      .attr("x", line_w/1.5)
      .attr("y", 80)
      .attr("text-anchor", "middle")
      .text("Rechts georiënteerd")

    svg.append("text")
       .attr("x", line_w/1.5)
       .attr("y", 200)
       .attr("text-anchor", "middle")
       .text("Links georiënteerd")

    svg.append("text")
       .attr("x", line_w/2)
       .attr("y", 200)
       .attr("transform", "rotate(-90, 115 300)")
       .attr("text-anchor", "middle")
       .text("<Links ---------- Rechts>")
  } else { // appends properties of the line chart
    svg.append("text")
       .attr("x", line_w/2)
       .attr("y", 200)
       .attr("transform", "rotate(-90, 115 300)")
       .attr("text-anchor", "middle")
       .text("Percentage Stemmen")
  };
};


function partyLegend() {
  /* Creates a legend showing the party colors, used and changed code from https://stackoverflow.com/questions/42009622/how-to-create-a-horizontal-legend */

  var n = partyAbrev.length/2;

  var svg = d3v5.select(".legendparties")
                .append("svg")
                .attr("id", "legendparties")
                .attr("width", legendWidth)
                .attr("height", legendHeight);

  var legend = svg.selectAll(".legend")
                	.data(partyAbrev)
                	.enter()
                	.append("g")
                	.attr("transform", function(d, i) {
                    return "translate(" + i%n * legendItemWidth + "," + Math.floor(i/n) * legendItemHeight + ")";
                  })
                	.attr("class","legend");

  var rects = legend.append('rect')
                  	.attr("width",15)
                  	.attr("height",15)
                  	.attr("fill", function(d) {return partyColor(d); });

  var text = legend.append('text')
                   .attr("x",20)
                   .attr("y",12)
                   .text(function(d) {
                     return d;
                   });
};


function partyColor(party) {
  /* sets colors of parties in pie chart and line chart, colors based of actual party colors */

  if (party == "VVD") {
    return "rgb(24, 62, 249)";
  } else if (party == "Christen Democratisch Appèl (CDA)" || party == "CDA") {
    return "rgb(13, 193, 34)";
  } else if (party == "Partij van de Arbeid (P.v.d.A.)" || party == "PvdA") {
    return "rgb(255, 17, 17)";
  } else if (party == "Katholieke Volkspartij (KVP)" || party == "KVP") {
    return "rgb(191, 0, 95)";
  } else if (party == "Anti-Revolutionaire Partij" || party == "ARP") {
    return "rgb(0, 96, 16)";
  } else if (party == "Democraten 66 (D66)" || party == "D66") {
    return "rgb(58, 224, 149)";
  } else if (party == "SP (Socialistische Partij)" || party == "SP") {
    return "rgb(142, 1, 1)";
  } else if (party == "Staatkundig Gereformeerde Partij (SGP)" || party == "SGP") {
    return "rgb(170, 131, 131)";
  } else if (party == "PVV (Partij voor de Vrijheid)" || party == "PVV") {
    return "#000000";
  } else if (party == "GL") {
    return "rgb(56, 255, 72)";
  } else if (party == "Christelijk-Historische Unie" || party == "CHU") {
    return "rgb(145, 191, 80)";
  } else if (party == "ChristenUnie" || party == "CU") {
    return "rgb(124, 218, 255)";
  } else if (party == "Partij voor de Dieren" || party == "PvdD") {
    return "rgb(29, 140, 84)";
  } else if (party == "50PLUS") {
    return "rgb(183, 23, 178)";
  } else if (party == "DENK") {
    return "rgb(21, 216, 193)";
  } else if (party == "Forum voor Democratie" || party == "FvD") {
    return "rgb(255, 157, 0)";
  } else if (party == "Communistische Partij van Nederland" || party == "CPN") {
    return "rgb(193, 17, 17)";
  } else {
    return "rgb(193, 193, 193)"
  }
};

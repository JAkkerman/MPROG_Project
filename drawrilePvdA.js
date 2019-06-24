// Joos Akkerman (11304723)
// MPROG Project (Summer)
// This file visualizes the development of the rile of the PvdA

var line_w = 900;
var line_start_w = 50;
var line_end_w = 0.95*line_w
var line_h = 400;
var line_start_h = 10;
var line_end_h = line_h;

d3v5.json('Data/pvdariles.json').then(function(data) {
  // console.log(data);
  drawLineChart(data);
});


function drawLineChart(data) {
/* draws line chart showing election results over time */

  existYears = []

  data.forEach(function(e) {
    existYears.push(parseInt(e.year))
  })

  // make a new xScale for every municipality
  var xScale = d3v5.scaleBand()
                   .domain(existYears)
                   .range([line_start_w, line_end_w]);

  var yScale = d3v5.scaleLinear()
                   .domain([-50, 5])
                   .range([line_end_h - line_start_h, line_start_h]);

  svg = d3v5.select("#linechart")
            .append("svg")
            .attr("width", line_w)
            .attr("height", 1.1*line_h)
            .attr("margin", "30px auto")

  var xAxis = d3v5.axisBottom(xScale);
  svg.append("g")
     .attr("class", "xAxis")
     .attr("transform", "translate(0, "+ (yScale(0) + line_start_h) +")")
     .call(xAxis);

  var yAxis = d3v5.axisLeft(yScale);
  svg.append("g")
     .attr("class", "yAxis")
     .attr("transform", "translate("+ line_start_w +", "+ line_start_h +")")
     .call(yAxis);

  var line = d3v5.line()
                 .x(function(d) {
                   return xScale(parseInt(d.year));
                 })
                 .y(function(d) {
                   return yScale(d.rile) + line_start_h;
                 });

    svg.append("path")
       .attr("class", "line")
       .attr("id", "PvdA")
       .attr("d", line(data))
       .attr("fill", "none")
       .attr("stroke-width", "2.5px")
       .attr("stroke", "red")

  svg.append("img")
     .attr("src", "Img/Drees")
     .attr("width", "50px")
     .attr("length", "50px")

  svg.append("text")
      .attr("x", line_w/2)
      .attr("y", yScale(0))
      .attr("text-anchor", "middle")
      .text("Jaren")

  svg.append("text")
     .attr("x", line_w/2)
     .attr("y", 200)
     .attr("transform", "rotate(-90, 250, 430)")
     .attr("text-anchor", "middle")
     .text("Rile")

};

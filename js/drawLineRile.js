// Joos Akkerman (11304723)
// MPROG Project (Summer)
// This file visualizes the development of the rile a selected region

function drawRileChartAbs(data, mun, xScale, yScale) {

  svg = d3v5.select(".changechart")

  d3v5.selectAll(".relline").remove()

  var line = d3v5.line()
                 .x(function(d) {
                   return xScale(parseInt(d.year));
                 })
                 .y(function(d) {
                   return yScale(d.value) + line_start_h;
                 });

  svg.append("path")
     .data(data)
     .attr("class", "absline")
     .attr("d", line(data))
     .attr("fill", "none")
     .attr("stroke-width", function() {
       if (mun == "Nederland") {
         return "3px";
       } else {
         return "1.5px"
       }
     })
     .attr("stroke", function() {
       if (mun == "Nederland") {
         return "#ff0000";
       } else {
         return "#1d00ff"
       }
     });

  function updateLine(data) {
    // console.log(data);
  }
};


function drawRileChartRel(data, mun, xScale, yScale) {

  svg = d3v5.select(".changechart")

  svg.selectAll(".absline").remove()

  var line = d3v5.line()
                 .x(function(d) {
                   return xScale(parseInt(d.year));
                 })
                 .y(function(d) {
                   var rile_NL = 0
                   data['Nederland'].forEach(function(e) {
                     console.log(e);
                     console.log("yeet");
                     if (e.year == d.year) {
                        rile_NL = e.value
                     }
                   })
                   console.log(d.value - rile_NL);
                   return yScale(d.value - rile_NL) + line_start_h;
                 });

  svg.append("path")
     .data(data[mun])
     .attr("class", "relline")
     .attr("d", line(data[mun]))
     .attr("fill", "none")
     .attr("stroke-width", function() {
       if (mun == "Nederland") {
         return "3px";
       } else {
         return "1.5px"
       }
     })
     .attr("stroke", function() {
       if (mun == "Nederland") {
         return "#ff0000";
       } else {
         return "#1d00ff"
       }
     });

};

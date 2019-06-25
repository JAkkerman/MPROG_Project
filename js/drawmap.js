function drawMap(data, data_riles, linexScale, lineyScale, colorScale, paryScale) {
  /* draws the municipal map of the Netherlands and adds the colors */

  d3v5.json("NL_mun_2017.geojson").then(function(mun) {

    drawMap.updateText = updateText;

    var projection = d3v5.geoMercator()
                         .scale(5500)
                         .center([0, 52])
                         .rotate([-5, 0])
                         .translate([map_w/2, map_h/2]);

    var path = d3v5.geoPath()
                   .projection(projection);

    let svg = d3v5.select("#map")
                  .append("svg")
                  .attr("class", "map")
                  .attr("width", map_w)
                  .attr("height", map_h);

    svg.append("text")
       .attr("id", "regionName")
       .text("Nederland")
       .attr("y", "30")

    var tip = d3v5.tip()
                  .attr('class', 'd3-tip')
                  .offset([-10, 0])
                  .html(function(d) {
                    return "<strong>" + d.properties.Gemeentenaam + "</strong>";
                  });

    svg.call(tip);

    svg.selectAll("path")
       .data(mun.features)
       .enter()
       .append("path")
       .attr("class", "municipality")
       .attr("d", path)
       .attr("fill", function(d) {
          if (data_riles[0][d.properties.Gemeentenaam]) {
            gemeente_data = data_riles[0][d.properties.Gemeentenaam].filter(d => d.year == 2017)
            return colorScale(gemeente_data[0].value);
          } else {
            return "rgb(204, 204, 204)"
          }
       })
       .on("mouseover", tip.show)
       .on("mouseout", tip.hide)
       .on("click", function(d) {
         // updateRegionName(d.properties.Gemeentenaam);
         drawLineChart(data[0][d.properties.Gemeentenaam], lineyScale);
         console.log(changeMethod);
         if (changeMethod == "Abs") {
           drawRileChartAbs(data_riles[0][d.properties.Gemeentenaam], d.properties.Gemeentenaam, linexScale, paryScale);
         } else {
           drawRileChartRel(data_riles[0], d.properties.Gemeentenaam, linexScale, paryScale);
         }
         // change values of dropdown piechart
         dropDownPieOptions(data[0][d.properties.Gemeentenaam], d.properties.Gemeentenaam)
         drawPieChart.updatePie(data[0][d.properties.Gemeentenaam], 2017)
         svg.selectAll("#regionName").remove()
         svg.append("text")
            .attr("id", "regionName")
            .text(d.properties.Gemeentenaam)
            .attr("y", "30")
       });

       // draw legend

   });

   function updateText(name) {
     // console.log("yeet");
     // text = svg.select("#regionName")
     // text.text(name)
   };
};


function updateRegionName (mun) {
  /* updates name of selected region */

  d3v5.selectAll("#regionName").remove()
  d3v5.append("text")
     .attr("id", "regionName")
     .text(mun)
     .attr("y", "30")
}


function mapLegend(colorScale) {
/* Creates a legend showing colors on the map
   based on http://bl.ocks.org/syntagmatic/e8ccca52559796be775553b467593a9f */

var legendheight = 200,
    legendwidth = 80,
    margin = {top: 10, right: 60, bottom: 10, left: 2};

var canvas = d3v5.select("#legendmap")
                 .style("height", legendheight + "px")
                 .style("width", legendwidth + "px")
                 .style("position", "relative")
                 .append("canvas")
                 .attr("height", legendheight - margin.top - margin.bottom)
                 .attr("width", 1)
                 .style("height", (legendheight - margin.top - margin.bottom) + "px")
                 .style("width", (legendwidth - margin.left - margin.right) + "px")
                 .style("border", "1px solid #000")
                 .style("position", "absolute")
                 .style("top", (margin.top) + "px")
                 .style("left", (margin.left) + "px")
                 .node();

  var ctx = canvas.getContext("2d");

  var legendscale = d3v5.scaleLinear()
                        .range([1, legendheight - margin.top - margin.bottom])
                        .domain(colorScale.domain());

  var legendScaleText = d3v5.scaleOrdinal()
                            .range([1, legendheight - margin.top - margin.bottom])
                            .domain(["Links", "Rechts"]);

  var image = ctx.createImageData(1, legendheight);
  d3v5.range(legendheight).forEach(function(i) {
    var c = d3v5.rgb(colorScale(legendscale.invert(i)));
    image.data[4*i] = c.r;
    image.data[4*i + 1] = c.g;
    image.data[4*i + 2] = c.b;
    image.data[4*i + 3] = 255;
  });
  ctx.putImageData(image, 0, 0);

  var legendaxis = d3v5.axisRight()
                       .scale(legendScaleText)
                       .tickSize(6)
                       .ticks(2);

  var svg = d3v5.select("#legendmap")
                .append("svg")
                .attr("height", (legendheight) + "px")
                .attr("width", (legendwidth) + "px")
                .style("position", "absolute")
                .style("left", "0px")
                .style("top", "0px")

  svg.append("g")
     .attr("class", "axis")
     .attr("transform", "translate(" + (legendwidth - margin.left - margin.right + 3) + "," + (margin.top) + ")")
     .call(legendaxis);

};

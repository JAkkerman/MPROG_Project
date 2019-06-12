// Joos Akkerman (11304723)
// MPROG Project (Summer)
// This file visualizes two graphs that are linked


var map_w = 450;
var map_h = 500;
var line_w = 650;
var line_h = 280;
var line_start_w = 30;
var line_end_w = 0.95*line_w;
var line_start_h = 20;
var line_end_h = 0.9*line_h;
var electionYears = ['1946', '1948', '1952', '1956', '1959', '1963', '1967', '1971',
                     '1972', '1977', '1981', '1981', '1986', '1989', '1994', '1998',
                     '2002', '2003', '2006', '2010', '2012', '2017'];

d3v5.json('data.json').then(function(data){

  console.log(data)

  // draw map
  // drawMap(data);

  // scale properties for line chart
  lineScales = scale(line_start_w, line_end_w, line_start_h, line_end_h);

  // draw first line chart
  d3v5.json('data_NL.json').then(function(data_NL){
    drawLineChart(data_NL, lineScales[0], lineScales[1]);
  })

  // draw first change chart
  // drawChangeChart(data);

});

function drawMap(data) {

  d3v5.json("NL_mun_2017.topojson").then(function(mun) {
  // if (error) throw error;
  console.log(mun);
  var municipalities = topojson.feature(mun, mun.objects.Gemeenten_Bestuurlijke_Grenzen_2017).features

  console.log(municipalities)

  var projection = d3v5.geoMercator()
                       .scale(1)
                       .translate([0,0]);

  var path = d3v5.geoPath()
                 .projection(projection);

  var b = path.bounds(mun),
      s = .95 / Math.max((b[1][0] - b[0][0]) / map_w, (b[1][1] - b[0][1]) / map_h),
      t = [(map_w - s * (b[1][0] + b[0][0])) / 2, (map_h - s * (b[1][1] + b[0][1])) / 2];

      projection.scale(s)
                .translate(t);

  var svg = d3v5.select("#map")
                .append("svg")
                .attr("class", "map")
                .attr("width", map_w)
                .attr("height", map_h);

  svg.selectAll("path")
     .data(municipalities)
     .enter().append("path")
     .attr("class", "municipality")
     .attr("d", path)

   });
};


function scale(start_w, end_w, start_h, end_h) {
  // sets the scale for the x-axis
  var xScale = d3v5.scaleBand()
                   .domain(electionYears)
                   .range([line_start_w, line_end_w]);

  // sets the scale for the y-axis
  var yScale = d3v5.scaleLinear()
                   .domain([0, 60])
                   .range([line_end_h - line_start_h, line_start_h]);

  // var colorScale = d3.scaleThreshold()
  //                    .domain([20000, 30000, 45000, 60000])
  //                    .range(colors);

  return [xScale, yScale];
};


function drawLineChart(data, xScale, yScale) {

  var svg = d3v5.select("#linechart")
                .append("svg")
                .attr("class", "linechart")
                .attr("width", line_w)
                .attr("height", line_h);

  var xAxis = d3v5.axisBottom(xScale);
  var yAxis = d3v5.axisLeft(yScale);

  // draw both axes
  svg.append("g")
     .attr("transform", "translate(0, "+ line_end_h +")")
     .call(xAxis);

  svg.append("g")
     .attr("transform", "translate("+ line_start_w +", "+ line_start_h +")")
     .call(yAxis);

  console.log(data)
  var line = d3v5.line()
                  .x(function(data) {
                    console.log('yeet')
                    console.log(data)
                    return xScale(d.date);
                  })
                  .y(function(d) {
                    return yScale(d.worth);
                  });

  svg.append("path")
      .data(data)
      .enter()
      .attr("d", line);
};

function drawChangeChart(data) {

};

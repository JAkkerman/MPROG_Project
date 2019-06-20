// Joos Akkerman (11304723)
// MPROG Project (Summer)
// This file visualizes two graphs that are linked


var map_w = 450;
var map_h = 700;
var barWidth = 300;
var barHeight = 40;
var line_w = 550;
var line_h = 280;
var line_start_w = 30;
var line_end_w = 0.95*line_w;
var line_start_h = 20;
var line_end_h = 0.9*line_h;
var pieWidth = 300
var pieHeight = 300
var pieMargin = 40
var pieRadius = Math.min(pieWidth, pieHeight) / 2;
var electionYears = ['1946', '1948', '1952', '1956', '1959', '1963', '1967', '1971',
                     '1972', '1977', '1981', '1982', '1986', '1989', '1994', '1998',
                     '2002', '2003', '2006', '2010', '2012', '2017'];

d3v5.json('data.json').then(function(data) {

  // scale properties for line chart and parallel coordinates chart
  lineScales = lineScale(line_start_w, line_end_w, line_start_h, line_end_h);
  parScales = parScale(line_start_w, line_end_w, line_start_h, line_end_h);

  // draw map and first change chart
  d3v5.json('data_rile.json').then(function(data_riles){
      drawMap(data, data_riles, lineScales[0], lineScales[1], lineScales[2], parScales[0], parScales[1]);
      // drawChangeChartAbs(data_riles[0]['Nederland'], parScales[0], parScales[1]);
      drawChangeChartRel(data_riles[0]['Nederland'], data_riles[0]['Nederland'], parScales[0], parScales[1]);
      // set options for dropdown
      dropDownMunOptions(data, data_riles, lineScales, parScales);
  });


  // draw first line chart and pie chart
  d3v5.json('data_NL.json').then(function(data_NL) {
    drawLineChart(data_NL[0]['Nederland'], lineScales[0], lineScales[1]);
    drawPieChart(data_NL[0]['Nederland'], '2017')
    dropDownPieOptions(data_NL[0]['Nederland'])
  })

  // var sel_year = document.getElementById("pieyear")
  //
  // console.log(sel_year);
});


function drawMap(data, data_riles, linexScale, lineyScale, colorScale, parxScale, paryScale) {

  d3v5.json("NL_mun_2017.geojson").then(function(mun) {
  // if (error) throw error;
    // console.log(mun);

    // var municipalities = topojson.feature(mun, mun.objects.Gemeenten_Bestuurlijke_Grenzen_2017).features

    var projection = d3v5.geoMercator()
                         .scale(5500)
                         .center([0, 52])
                         .rotate([-5, 0])
                         .translate([map_w/2, map_h/2]);

    var path = d3v5.geoPath()
                   .projection(projection);

    var svg = d3v5.select("#map")
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
                    // console.log(data_riles[0][d.properties.Gemeentenaam]);
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
         d3v5.selectAll(".linechart").remove();
         d3v5.selectAll(".changechart").remove();
         // d3v5.selectAll(".piechart").remove();
         d3v5.selectAll("#pieyear").remove()
         drawLineChart(data[0][d.properties.Gemeentenaam], linexScale, lineyScale);
         drawChangeChartAbs(data_riles[0][d.properties.Gemeentenaam], parxScale, paryScale);
         dropDownPieOptions(data[0][d.properties.Gemeentenaam])
         drawPieChart(data[0][d.properties.Gemeentenaam], 2017)
         svg.selectAll("#regionName").remove()
         svg.append("text")
            .attr("id", "regionName")
            .text(d.properties.Gemeentenaam)
            .attr("y", "30")
       });

       // draw legend

   });
};


function lineScale(start_w, end_w, start_h, end_h) {
  // sets the scale for the x-axis

  electionYears_int = []
  electionYears.forEach(function(element) {
    electionYears_int.push(parseInt(element))
  })

  var xScale = d3v5.scaleBand()
                   .domain(electionYears_int)
                   .range([line_start_w, line_end_w]);

  // sets the scale for the y-axis
  var yScale = d3v5.scaleLinear()
                   .domain([0, 70])
                   .range([line_end_h - line_start_h, line_start_h]);

  var colorScale = d3v5.scaleLinear()
                       .domain([-15,15])
                       .range(["#ff0000", "#1d00ff"]);

  return [xScale, yScale, colorScale];
};


function parScale(start_w, end_w, start_h, end_h) {
  // Creates scales for the parallel coordinates

  // sets the scale for the vertical axis
  var xScale = d3v5.scaleBand()
                   .domain(electionYears)
                   .range([line_start_w, line_end_w]);

  // sets the scale for the y-axis
  var yScale = d3v5.scaleLinear()
                   .domain([-35, 35])
                   .range([line_end_h - line_start_h, line_start_h]);

  var colorScale = d3v5.scaleLinear()
                       .domain([-25,25])
                       .range(["#ff0000", "#1d00ff"]);

  return [xScale, yScale, colorScale];

}


function drawLineChart(data, xScale, yScale) {

  // console.log(data);

  // make svg for line chart
  var svg = d3v5.select("#linechart")
                .append("svg")
                .attr("class", "linechart")
                .attr("width", line_w)
                .attr("height", line_h);

  var linetip = d3v5.tip()
                    .attr('class', 'd3-tip')
                    .offset([-10, 0])
                    .html(function(d) {
                      return "<strong>" + this.id + "</strong>";
                    });

  svg.call(linetip);

  // create axes
  var xAxis = d3v5.axisBottom(xScale);
  var yAxis = d3v5.axisLeft(yScale);

  // draw both axes
  svg.append("g")
     .attr("transform", "translate(0, "+ line_end_h +")")
     .call(xAxis);

  svg.append("g")
     .attr("transform", "translate("+ line_start_w +", "+ line_start_h +")")
     .call(yAxis);

  // convert data from dict to array
  var lineData = [], party;

  for (var type in data) {
      party = {};
      party.party = type;
      party.years = data[type];
      lineData.push(party);
  }

  var line = d3v5.line()
                 .x(function(d) {
                   return xScale(parseInt(d.year));
                 })
                 .y(function(d) {
                   return yScale(d.value);
                 });

  lineData.forEach(function(d) {
    svg.append("path")
       .attr("id", d.party)
       .attr("d", line(d.years))
       .attr("fill", "none")
       .attr("stroke", partyColor(d.party))
       .on("mouseover", linetip.show)
       .on("mouseout", linetip.hide)
  })

};

function drawChangeChartAbs(data, xScale, yScale) {

  // make svg for line chart
  var svg = d3v5.select("#changechart")
                .append("svg")
                .attr("class", "changechart")
                .attr("width", line_w)
                .attr("height", line_h);

  var line = d3v5.line()
                 .x(function(d) {
                   return xScale(parseInt(d.year));
                 })
                 .y(function(d) {
                   return yScale(d.value);
                 });

  svg.selectAll(".line")
     .data(data)
     .enter().append("path")
     .attr("d", line(data))
     .attr("fill", "none")
     .attr("stroke", "red");

  svg.selectAll(".axis")
     .data(electionYears)
     .enter().append("g")
     .attr("transform", function (d) {
       return "translate(" + xScale(d) + ")";
     })
     .each(function(d) {
       d3v5.select(this).call(d3v5.axisLeft(yScale));
     })
     .append("text")
      .style("text-anchor", "middle")
      .attr("y", -9)
      .text(electionYears)
      .style("fill", "black")

};


function drawChangeChartRel(data, data_NL, xScale, yScale) {

  // make svg for line chart
  var svg = d3v5.select("#changechart")
                .append("svg")
                .attr("class", "changechart")
                .attr("width", line_w)
                .attr("height", line_h);

  var line = d3v5.line()
                 .x(function(d) {
                   return xScale(parseInt(d.year));
                 })
                 .y(function(d) {
                   var rile_NL = 0
                   data_NL.forEach(function(e) {
                     if (e.year == d.year) {
                        rile_NL = e.value
                     }
                   })
                   return yScale(d.value - rile_NL);
                 });

  svg.selectAll(".line")
     .data(data)
     .enter().append("path")
     .attr("d", line(data))
     .attr("fill", "none")
     .attr("stroke", "red");

  svg.selectAll(".axis")
     .data(electionYears)
     .enter().append("g")
     .attr("transform", function (d) {
       return "translate(" + xScale(d) + ")";
     })
     .each(function(d) {
       d3v5.select(this).call(d3v5.axisLeft(yScale));
     })
     .append("text")
      .style("text-anchor", "middle")
      .attr("y", -9)
      .text(electionYears)
      .style("fill", "black")

};


function drawPieChart (data, year) {
  console.log(year);
  d3v5.selectAll(".piechart").remove();
    // d3v5.selectAll(".piepiece").remove();

    var results = {}
    for (party in data) {
          data[party].forEach(function(d) {
            if (d['year'] == year) {
              results[party] = d['value']
            }
          })
    };

    var svg = d3v5.select("#piechart")
                  .append("svg")
                      .attr("width", pieWidth)
                      .attr("height", pieHeight)
                      .attr("class", "piechart")
                  .append("g")
                      .attr("transform", `translate(${pieWidth / 2}, ${pieHeight / 2})`);


    const color = d3v5.scaleOrdinal(["#66c2a5","#fc8d62","#8da0cb",
                                    "#e78ac3","#a6d854","#ffd92f"]);

    var pie = d3v5.pie()
                  .value(function(d) {return d.value;});

    var pie_data = pie(d3v5.entries(results));

    var radius = Math.min(pieWidth, pieHeight) / 2 - pieMargin;

    var pieTip = d3v5.tip()
                     .attr('class', 'd3-tip')
                     .offset([-10, 0])
                     .html(function(d) {
                       return "<strong>" + this.id + "</strong>";
                     });

    svg.call(pieTip);

    var arc = d3v5.arc()
                  .innerRadius(0)
                  .outerRadius(radius)

    var path = svg.selectAll("path")
                  .data(pie_data)
                  .enter()
                  .append("path")
                  .attr("id", function(d) {
                    return d.data.key;
                  })
                  .attr("d", arc)
                  .attr("fill", function(d) {
                    return partyColor(d.data.key);
                  })
                  .on("mouseover", pieTip.show)
                  .on("mouseout", pieTip.hide);

    // svg.selectAll('piepiece')
    //    .data(pie_data)
    //    .enter()
    //    .append('path')
    //    .attr('class', 'piepiece')
    //    .attr('d', d3v5.arc()
    //                   .innerRadius(0)
    //                   .outerRadius(radius))
    //    // .attr('fill', function(d) { console.log(d);return(color(d.data.key)) })
    //    .attr("fill", "rgb(174, 200, 242)")
    //    .attr("stroke", "black")
    //    .style("stroke-width", "2px")
    //    .style("opacity", 0.7);

    // function arcTween(a) {
    //     const i = d3v5.interpolate(this._current, a);
    //     this._current = i(1);
    //     return (t) => arc(i(t));
    // }

    // d3v5.json("data.json", type).then(data => {
    //     d3.selectAll("input")
    //         .on("change", update);

        // function update(val = this.value) {
        //     // Join new data
        //     const path = svg.selectAll("path")
        //         .data(pie(data[val]));
        //
        //     // Update existing arcs
        //     path.transition().duration(200).attrTween("d", arcTween);
        //
        //     // Enter new arcs
        //     path.enter().append("path")
        //         .attr("fill", (d, i) => color(i))
        //         .attr("d", arc)
        //         .attr("stroke", "white")
        //         .attr("stroke-width", "6px")
        //         .each(function(d) { this._current = d; });
        // }

    //     update("apples");
    // });

};

function partyColor(party) {

  if (party == "VVD") {
    return "rgb(24, 62, 249)"
  } else if (party == "CDA") {
    return "rgb(13, 193, 34)"
  } else if (party == "Partij van de Arbeid (P.v.d.A.)") {
    return "rgb(255, 17, 17)"
  } else if (party == "Katholieke Volkspartij (KVP)") {
    return "rgb(191, 0, 95)"
  } else if (party == "Anti-Revolutionaire Partij") {
    return "rgb(0, 96, 16)"
  } else if (party == "Democraten 66 (D66)") {
    return "rgb(58, 224, 149)"
  } else if (party == "SP (Socialistische Partij)") {
    return "rgb(142, 1, 1)"
  } else if (party == "Staatkundig Gereformeerde Partij (SGP)") {
    return "rgb(170, 131, 131)"
  } else if (party == "PVV (Partij voor de Vrijheid)") {
    return "#000000"
  } else if (party == "GL") {
    return "rgb(56, 255, 72)"
  } else if (party == "Christelijk-Historische Unie") {
    return "rgb(145, 191, 80)"
  }
  else {
    return "rgb(193, 193, 193)"
  }
};

function dropDownMun() {
  document.getElementById("dropdownmun").classList.toggle("show");
}

function dropDownMunOptions(data, data_riles, lineScales, parScales) {
    // console.log(data);
    // data[0].forEach(function(d,i){
    for (var key in data[0]) {
      // console.log(key);
      d3v5.select("#dropdownmun")
          .append("a")
          .attr("value", key)
          .text(key)
          // .on("click", function() {
          //   d3v5.selectAll(".linechart").remove();
          //   d3v5.selectAll(".changechart").remove();
          //   d3v5.selectAll(".piechart").remove();
          //   drawLineChart(data[0][key], lineScales[0], lineScales[1]);
          //   drawChangeChartAbs(data_riles[0][key], parScales[0], parScales[1]);
          //   dropDownPieOptions(data[0][key])
          //   drawPieChart(data[0][key], 2017)
            // svg.selectAll("#regionName").remove()
            // svg.append("text")
            //    .attr("id", "regionName")
            //    .text(key)
            //    .attr("y", "30");
          // })
    }
}


function dropDownPie() {
  document.getElementById("dropdownpie").classList.toggle("show");
}

function dropDownPieOptions(data) {
/* sets options for drop down menu pie chart */

  for (var key in data['Partij van de Arbeid (P.v.d.A.)']) {
    // console.log(data['Partij van de Arbeid (P.v.d.A.)'][key]['year']);
    year = data['Partij van de Arbeid (P.v.d.A.)'][key]['year']
    // console.log(year)
    d3v5.select("#dropdownpie")
        .append("a")
        .attr("id", "pieyear")
        .attr("value",year)
        .text(year)
        // .on("click", function() {
        //   console.log(year)
        //   drawPieChart(data, year)
        // })
  }
  // $("#dropdownpie").empty()
  // // I pick the year for P.v.d.A since it has participated in all studied elections
  // // and, unlike the SGP, always gets more than one percent of the vote
  // data["Partij van de Arbeid (P.v.d.A.)"].forEach(function(e) {
  //   $("#dropdownpie").append($('<a value="' + e['year'] + '">' + e['year'] + '</a>'))
  //
  // })

  // if (!event.target.matches('.dropbtn')) {
  //   var dropdowns = document.getElementsByClassName("dropdown-content-year");
  //   var i;
  //   for (i = 0; i < dropdowns.length; i++) {
  //     var openDropdown = dropdowns[i];
  //     if (openDropdown.classList.contains('show')) {
  //       openDropdown.classList.remove('show');
  //     }
  //   }
  // }
}


// function clickMun(mun) {
//   // data = d3v5.json('data.json')
//   // mun = d3v5.select(this)
//   console.log(mun);
//
// };

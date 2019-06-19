// Joos Akkerman (11304723)
// MPROG Project (Summer)
// This file visualizes two graphs that are linked


var map_w = 400;
var map_h = 600;
var line_w = 650;
var line_h = 280;
var line_start_w = 30;
var line_end_w = 0.95*line_w;
var line_start_h = 20;
var line_end_h = 0.9*line_h;
var pieWidth = 300
var pieHeight = 300
var pieRadius = Math.min(pieWidth, pieHeight) / 2;
var electionYears = ['1946', '1948', '1952', '1956', '1959', '1963', '1967', '1971',
                     '1972', '1977', '1981', '1982', '1986', '1989', '1994', '1998',
                     '2002', '2003', '2006', '2010', '2012', '2017'];

d3v5.json('data.json').then(function(data) {

  // scale properties for line chart
  lineScales = lineScale(line_start_w, line_end_w, line_start_h, line_end_h);

  // scale properties for the parallel coordinates chart
  parScales = parScale(line_start_w, line_end_w, line_start_h, line_end_h);

  d3v5.json('data_rile.json').then(function(data_riles){
      // draw map
      drawMap(data, data_riles, lineScales[0], lineScales[1], lineScales[2], parScales[0], parScales[1]);

      // draw first change chart
      drawChangeChart(data_riles[0]['Nederland'], parScales[0], parScales[1]);
      });


  // draw first line chart
  d3v5.json('data_NL.json').then(function(data_NL) {
    // console.log(data_NL[0]['Nederland']);
    drawLineChart(data_NL[0]['Nederland'], lineScales[0], lineScales[1]);
    drawPieChart(data_NL[0]['Nederland'])
  })

});

function drawMap(data, data_riles, linexScale, lineyScale, colorScale, parxScale, paryScale) {

  d3v5.json("NL_mun_2017.geojson").then(function(mun) {
  // if (error) throw error;
    // console.log(mun);

    // var municipalities = topojson.feature(mun, mun.objects.Gemeenten_Bestuurlijke_Grenzen_2017).features

    var projection = d3v5.geoMercator()
                         .scale(5000)
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
         drawLineChart(data[0][d.properties.Gemeentenaam], linexScale, lineyScale);
         drawChangeChart(data_riles[0][d.properties.Gemeentenaam], parxScale, paryScale);
         drawPieChart(data[0][d.properties.Gemeentenaam], 2017)
       });

   });
};


function lineScale(start_w, end_w, start_h, end_h) {

  // int_electionYears = []
  // electionYears.forEach(function(d) {
  //   int_electionYears.push(parseInt(element))
  // })

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
                  // console.log(this.id);
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

  // console.log(lineData);

  var line = d3v5.line()
                 .x(function(d) {
                   // console.log(d.year);
                   // console.log(typeof d.year);
                   // console.log(xScale(d.year));
                   return xScale(parseInt(d.year));
                 })
                 .y(function(d) {
                   // console.log(d.value);
                   // console.log(yScale(d.value));
                   return yScale(d.value);
                 });

  // console.log(lineData);

  lineData.forEach(function(d) {
    svg.append("path")
        // .data(lineData)
        // .enter()
        .attr("id", d.party)
        .attr("d", line(d.years))
        .attr("fill", "none")
        .attr("stroke", "blue")
        .on("mouseover", linetip.show)
        .on("mouseout", linetip.hide)
  })

// // console.log(lineData);
//   lineData.forEach(function(d) {
//     console.log(d.years);
//     svg.append("line")
//        // .data(d).enter()
//        // .append("path")
//        .attr("class", "line")
//        .attr("d", line(d.years))
//        .attr("fill", "none")
//        .attr("stroke", "blue")
//   })

  // svg.selectAll(".line")
  //    .data(lineData)
  //    .enter()
  //    .append("path")
  //    .attr("class", "line")
  //    .attr("d", line(lineData))



  // var party =  d3v5.selectAll(".party")
  //                .data(lineData)
  //                .enter()
  //                .attr("width", function(d) {
  //                  console.log(lineData);
  //                })
  //                .append("path")
  //                .attr("class", "party");

  // console.log(data);
  // parties.selectAll("path")
  //    .attr("class", "line")
  //    .attr("d", function(d) {
  //      console.log(d);
  //      return line(d);
  //    });
};

function drawChangeChart(data, xScale, yScale) {

  // console.log(data);

  // make svg for line chart
  var svg = d3v5.select("#changechart")
                .append("svg")
                .attr("class", "changechart")
                .attr("width", line_w)
                .attr("height", line_h);

  var line = d3v5.line()
                 .x(function(d) {
                   // console.log(d);
                   return xScale(parseInt(d.year));
                 })
                 .y(function(d) {
                   return yScale(d.value);
                 });

  // console.log(data);

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
       // console.log(d);
       d3v5.select(this).call(d3v5.axisLeft(yScale));
     })
     .append("text")
      .style("text-anchor", "middle")
      .attr("y", -9)
      .text(electionYears)
      .style("fill", "black")

};


function drawPieChart (data, year) {
  // console.log("yeaa");
  // console.log(data);

    for (key in data) {
          console.log(key);
          console.log(data[key].filter(d => d.year == 2017));
          return data[key].filter(d => d.year == 2017)
    };

    var svg = d3v5.select("#piechart")
                  .append("svg")
                      .attr("width", width)
                      .attr("height", height)
                  .append("g")
                      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const color = d3v5.scaleOrdinal(["#66c2a5","#fc8d62","#8da0cb",
                                    "#e78ac3","#a6d854","#ffd92f"]);

    const pie = d3v5.pie()
                    .value(d => d.year == 2017)
                    .sort(null);

    const arc = d3v5.arc()
                    .innerRadius(0)
                    .outerRadius(pieRadius);

    // function type(d) {
    //     d.apples = Number(d.apples);
    //     d.oranges = Number(d.oranges);
    //     return d;
    // }

    function arcTween(a) {
        const i = d3v5.interpolate(this._current, a);
        this._current = i(1);
        return (t) => arc(i(t));
    }

    // d3v5.json("data.json", type).then(data => {
    //     d3.selectAll("input")
    //         .on("change", update);
    //
    //     function update(val = this.value) {
    //         // Join new data
    //         const path = svg.selectAll("path")
    //             .data(pie(data[val]));
    //
    //         // Update existing arcs
    //         path.transition().duration(200).attrTween("d", arcTween);
    //
    //         // Enter new arcs
    //         path.enter().append("path")
    //             .attr("fill", (d, i) => color(i))
    //             .attr("d", arc)
    //             .attr("stroke", "white")
    //             .attr("stroke-width", "6px")
    //             .each(function(d) { this._current = d; });
    //     }
    //
    //     update("apples");
    // });

};

function partyColor(party) {

};

/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */

function dropDownMun() {
  d3v5.json('data.json').then(function(data){

    // console.log(data[0]);
    $.each(data[0], function (key, value) {
      $("#dropdownmun").append($('<option>' + key + '</option>').val(value).html(key));
    });

    // $('#dropDownDest').change(function () {
    //     alert($(this).val());
    //     //Code to select image based on selected car id
    // });

  });

//   document.getElementById("dropdownmun").classList.toggle("show");
// }
//
// // Close the dropdown menu if the user clicks outside of it
// window.onclick = function(event) {
//   if (!event.target.matches('.dropbtn')) {
//     var dropdowns = document.getElementsByClassName("dropdown-content");
//     console.log(dropdowns);
//     var i;
//     for (i = 0; i < dropdowns.length; i++) {
//       var openDropdown = dropdowns[i];
//       if (openDropdown.classList.contains('show')) {
//         openDropdown.classList.remove('show');
//       }
//     }
//   }
}

function dropDownPie() {
  document.getElementById("dropdownpie").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

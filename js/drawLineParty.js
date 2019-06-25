// Joos Akkerman (11304723)
// MPROG Project (Summer)
// This file creates a line graph of the percentages parties got over time


function drawLineChart(data) {
/* draws line chart showing election results over time */

  drawLineChart.updateLine = updateLine;

  axes = updateAxes(data)
  let xScale = axes[0]
  let yScale = axes[1]
  xAxis = axes[2]
  yAxis = axes[3]

  let svg = d3v5.select(".linechart")

  svg.select(".xAxis").remove();
  svg.select(".yAxis").remove();

  svg.append("g")
     .attr("class", "xAxis")
     .attr("transform", "translate(0, "+ line_end_h +")")
     .call(xAxis);

  svg.append("g")
     .attr("class", "yAxis")
     .attr("transform", "translate("+ line_start_w +", "+ line_start_h +")")
     .call(yAxis);

  svg.selectAll(".line").remove()

  var linetip = d3v5.tip()
                    .attr('class', 'd3-tip')
                    .offset([-50, 0])
                    .html(function(d) {
                      return "<strong>" + this.id + "</strong>";
                    });

  svg.call(linetip);

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
                   return yScale(d.value) + line_start_h;
                 });

  lineData.forEach(function(d) {
    svg.append("path")
       .attr("class", "line")
       .attr("id", d.party)
       .attr("d", line(d.years))
       .attr("fill", "none")
       .attr("stroke-width", "2.5px")
       .attr("stroke", partyColor(d.party))
       .on("mouseover", linetip.show)
       .on("mouseout", linetip.hide)
  })


  function updateAxes(data) {
    /* creates custom axes for selected region */

    existYears = []
    max_val = 50;

    // checks which years exist in this municipality
    data['Partij van de Arbeid (P.v.d.A.)'].forEach(function(e) {
      existYears.push(parseInt(e.year))
    })

    // checks the maximum percentage of votes to ammend the y-axis
    for (party in data) {
      data[party].forEach(function(e) {
        if (e.value > max_val) {
          max_val = e.value
        }
      })
    }

    // make a new x-scale and y-scale for every municipality
    var xScale = d3v5.scaleLinear()
                     .domain([existYears[0], 2017])
                     .range([line_start_w, line_end_w]);
                     // .tickFormat(d3v5.format("d"));

    var yScale = d3v5.scaleLinear()
                     .domain([0, max_val])
                     .range([line_end_h - line_start_h, line_start_h]);

    var xAxis = d3v5.axisBottom(xScale);
    var yAxis = d3v5.axisLeft(yScale);

    return [xScale, yScale, xAxis, yAxis]
  }


  function updateLine(data) {
    /* updates line chart */

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
                     return yScale(d.value) + line_start_h;
                   });

    var newLines = svg.selectAll(".line")
                      .data(lineData);

    console.log(lineData);

    newLines.enter()
            .append("path")
            .attr("class", "line")
            .merge(newLines)
            .attr("id", d.party)
            .attr("d", line(d.years))
            .attr("fill", "none")
            .attr("stroke-width", "2.5px")
            .attr("stroke", partyColor(d.party));

    newLines.exit().remove();
  }
};


function dropDownMunOptions(data, data_riles) {
/* sets options for drop down menu municipalities */

  d3v5.select(".dropdownmunoptions")
      .append("option")
      .attr("value", "Nederland")
      .text("Nederland")
      .attr("selected")

  for (var key in data[0]) {
    d3v5.select(".dropdownmunoptions")
        .append("option")
        .attr("value", key)
        .text(key)
        .on("click", function() {
          var mun = d3v5.select(".dropdownmunoptions").node().value
          drawLineChart.updateLine(mun)
        })
  }
}

// Joos Akkerman (11304723)
// MPROG Project (Summer)
// This file creates a pie chart of the percentages in one year

function drawPieChart(data, year) {
  /* draws a pie chart */

  drawPieChart.updatePie = updatePie;

  // create svg for pie chart
  let svg = d3v5.select("#piechart")
                .append("svg")
                    .attr("width", pieWidth)
                    .attr("height", pieHeight)
                    .attr("class", "piechart")
                .append("g")
                    .attr("transform", `translate(${pieWidth / 2}, ${pieHeight / 2})`);

  // set properties for pie chart
  let pie = d3v5.pie()
                .value(function(d) {return d.value;});

  var radius = Math.min(pieWidth, pieHeight) / 2 - pieMargin;

  let arc = d3v5.arc()
                .innerRadius(0)
                .outerRadius(radius)

  // restructure data to make drawing chart possible
  var results = {}
  for (party in data) {
    data[party].forEach(function(d) {
      if (d['year'] == year) {
        results[party] = d['value']
      }
    })
  };

  var pie_data = pie(d3v5.entries(results));

  let path = svg.selectAll("path")
                .data(pie_data)

  var pieTip = d3v5.tip()
                   .attr('class', 'd3-tip')
                   .offset([-10, 0])
                   .html(function(d) {
                     return "<strong>" + this.id + "</strong>";
                   });

  svg.call(pieTip);

  // append pie pieces to chart
  path.enter()
      .append("path")
      .attr("fill", function(d) {
        return partyColor(d.data.key);
      })
      .attr("class", "piepiece")
      .attr("id", function(d) {
        return d.data.key;
      })
      .attr("d", arc)
      .on("mouseover", pieTip.show)
      .on("mouseout", pieTip.hide)


    function updatePie(data, year) {
      /* updates pie chart to selected year for selected region */

      // restructure data to make drawing chart possible
      var results = {}
      for (party in data) {
        data[party].forEach(function(d) {
          if (d['year'] == year) {
            results[party] = d['value']
          }
        })
      };

      var pie_data = pie(d3v5.entries(results))

      var piepieces = svg.selectAll(".piepiece")
                         .data(pie_data);

      // append new pie pieces and delete old ones
      piepieces.enter()
               .append("path")
               .attr("class", "piepiece")
               .merge(piepieces)
               .attr("fill", function(d) {
                 return partyColor(d.data.key);
               })
               .attr("id", function(d) {
                 return d.data.key;
               })
               .attr("d", arc);

      piepieces.exit().remove();
    }
};


function dropDownPieOptions(data, name) {
/* sets options for drop down menu pie chart */

  d3v5.selectAll("#pieyear").remove();

  for (var key in data['Partij van de Arbeid (P.v.d.A.)']) {

    year = data['Partij van de Arbeid (P.v.d.A.)'][key]['year']

    d3v5.select(".dropdownpieoptions")
        .append("option")
        .attr("id", "pieyear")
        .attr("name", name)
        .attr("value", year)
        .attr("selected", function() {if (year == 2017) {return "selected"}})
        .text(year)

  }
}

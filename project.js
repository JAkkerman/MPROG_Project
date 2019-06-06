// Joos Akkerman (11304723)
// MPROG Project (Summer)
// This file visualizes two graphs that are linked

d3v5.json('data.json').then(function(data){

  console.log("yeet")

  d3v5.json("NL_mun.json").then(function(error, NL) {
  if (error) return console.error(error);
  console.log(NL);

  });

  // draw map
  // drawMap(data);

});

function drawMap(data) {
  var map = new Datamap({
    element: document.getElementById("map"),
    data: data,
    // fills: {
    //   good: 'rgb(0, 252, 1)',
    //   decent: 'rgb(178, 254, 1)',
    //   acceptable: 'rgb(176, 252, 99)',
    //   not_good: 'rgb(231, 252, 99)',
    //   bad: 'rgb(162, 106, 75)',
    //   defaultFill: '#b0b3b7',
    // },
    geographyConfig: {
      popupTemplate: function(geography, data) {
        // show country name and sustainability value when hovering
        data.forEach(function(element) {
          if (element['YEAR'] == lastYear) {
              value = element['VALUE'];
          }
        })
        // return ["<div class='hoverinfo'>", geography.properties.name,': ', value, "</div>"].join('');
      },
    },
    // done: function(datamap) {
    //     datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
    //       // draw bar chart if user clicks on country
    //       if (typeof(data[geography.id]) != 'undefined') {
    //         d3v5.selectAll("#linechart").remove();
    //         drawBarChart([geography.properties.name, data[geography.id]]);
    //       }
    //     });
    // }
  });
};

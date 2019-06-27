# Report MPROG Project Summer 2019
### Joos Akkerman (11304723)

My visualization shows the shifts in political preferences in the Netherlands, in the period 1947 to 2017. It shows a map of Dutch municipalities, a line chart and pie chart that shows the election result for all municipalities that existed in 2017, and a line chart that shows the development of the political preference of a region over time.

![alt text](https://github.com/JAkkerman/MPROG_Project/blob/master/Img/screen6.jpg)

## Technical Design
The visualization consists of the following components:
* The map: This map shows the municipal map of the Netherland in 2017. The municipalities are hoverable (shows the municipality's name) and clickable (shows electoral data of the municipality). The colors are based on the rile (left-right score) in 2017, where more blue means more right-winged and more red means more left-winged.
* The rile chart: This chart shows the shifts in rile over time. By clicking a new municipality, a new line is drawn. These lines are drawn on the same SVG to allow the user to compare different municipalities. If the chart gets too crowded, the chart has a reset-button to delete all the lines except for the base line for the Netherlands. This chart also allows the user to choose between absolute score (a line chart showing the absolute riles of a municipality over time) and the relative score (a line chart that shows the rile score with the average score for all of the Netherlands deducted. This gives a better image of the developments within a municipality, since it filters out shifts in rile score within the large parties that happen for all of the Netherlands. It also allows the user to see more clearly how municipalities are positioned relative to the rest of the Netherlands.)
* The line chart (parties): This line chart shows for a selected region the results of all parties that, over time, got more than one percent of the vote in the general elections (Tweede Kamerverkiezingen). The lines are hoverable and show the party name belonging to the line. The lines are also colored according to the actual party colors, which can be found in a legend above the chart. The chart has default axes (0 to 50 percent on the y-axis, 1946 to 2017 on the x-axis), but these axes are changed if the data set does not fit them (either a party got more than 50 percent in this municipality, or the municipality has not existed since 1946).
* The pie chart: This chart shows a more detailed overview of the election results in a particular year. Its default year is 2017, but in the menu above you can pick any of the election year the municipality has existed and the pie chart for that particular year will be drawn. The pie pieces show the party name if hovered over, and the colors are the same ones as used for the line chart, thus the legend also covers the pie chart.
Note that the user can navigate between municipalities by either clicking a municipality on the map or by selecting a municipality in the dropdown menu above the line chart.

The visualization is divided in the following files:
* Project.js,
*

File Name | Description
----------|------------
```Project.js```| this is the main file that calls all the functions and relates them to each other.

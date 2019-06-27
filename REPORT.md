# Report MPROG Project Summer 2019
### Joos Akkerman (11304723)

My visualization shows the shifts in political preferences in the Netherlands, in the period 1947 to 2017. It shows a map of Dutch municipalities, a line chart and pie chart that shows the election result for all municipalities that existed in 2017, and a line chart that shows the development of the political preference of a region over time.

![alt text](https://github.com/JAkkerman/MPROG_Project/blob/master/Img/screen6.JPG)

## Technical Design
The visualization consists of the following components:
* The map: This map shows the municipal map of the Netherland in 2017. The municipalities are hoverable (shows the municipality's name) and clickable (shows electoral data of the municipality). The colors are based on the rile (left-right score) in 2017, where more blue means more right-winged and more red means more left-winged.
* The rile chart: This chart shows the shifts in rile over time. By clicking a new municipality, a new line is drawn. These lines are drawn on the same SVG to allow the user to compare different municipalities. If the chart gets too crowded, the chart has a reset-button to delete all the lines except for the base line for the Netherlands. This chart also allows the user to choose between absolute score (a line chart showing the absolute riles of a municipality over time) and the relative score (a line chart that shows the rile score with the average score for all of the Netherlands deducted. This gives a better image of the developments within a municipality, since it filters out shifts in rile score within the large parties that happen for all of the Netherlands. It also allows the user to see more clearly how municipalities are positioned relative to the rest of the Netherlands.)
* The line chart (parties): This line chart shows for a selected region the results of all parties that, over time, got more than one percent of the vote in the general elections (Tweede Kamerverkiezingen). The lines are hoverable and show the party name belonging to the line. The lines are also colored according to the actual party colors, which can be found in a legend above the chart. The chart has default axes (0 to 50 percent on the y-axis, 1946 to 2017 on the x-axis), but these axes are changed if the data set does not fit them (either a party got more than 50 percent in this municipality, or the municipality has not existed since 1946).
* The pie chart: This chart shows a more detailed overview of the election results in a particular year. Its default year is 2017, but in the menu above you can pick any of the election year the municipality has existed and the pie chart for that particular year will be drawn. The pie pieces show the party name if hovered over, and the colors are the same ones as used for the line chart, thus the legend also covers the pie chart.
Note that the user can navigate between municipalities by either clicking a municipality on the map or by selecting a municipality in the dropdown menu above the line chart.

The main JavaScript files are:

File Name | Description
----------|------------
```Project.js```| This is the main file that calls all the functions and relates them to each other.
```drawmap.js```| This file has two main functions. The first one draws the map from a geojson file, and creates the tooltip. It also has a subfunction that changes the little text in left-top corner of the map, showing the selected regions name. The second function is used to make the continuous color legend used to clarify the colors in the map.
```drawLineRile.js```| This file has two functions, one for drawing the line of absolute riles and one for drawing the relative riles.
```drawLinePart.js```| This file draws the line chart showing the results for all parties. The first function initializes the first line chart with data for the whole Netherlands, and has subfunctions to update the lines and update the axes. The second function selects all the names of municipalities that are in the data set, plus the Netherlands, and appends them to the dropdown menu for regions.
```drawpie.js```| This file has two main functions. The first function draws the first pie chart for the whole Netherlands in 2017. It contains an update function used to update the pie chart when a different municipality or different year is selected. The second function is used to update the years in the dropdown menu for the pie chart, since for some municipalities there is not data available for all years.
```helpers.js```| This file contains of some functions that are used by multiple files. The first function calculates the line scales used by the line charts, and calculates the color scale used by the map and the map's legend. The second function draws the axes for both line charts and gives their axes their titles. The third function creates the legend used for the party colors (used by both the line and pie chart). The Fourth function, used by both the line chart, pie chart and their legend, returns a color for each party, such that parties always get the same color.
```drawrilePvdA.js```| This file consists of a simple function that draws the line chart used in the case study.

Other used files are:
* ```convert_NL.py```, ```convert.py```, ```convert_pvda.py```: These files respectively convert the data for the Netherlands, all municipalities and for the PvdA rile scores into workable JSON formats.
* ```index.html```, ```visualization.html```, ```casestudy.html```: These files set up the website.
* ```data.json```, ```data_NL.json```, ```data_rile.json```: These files contain the data for respectively all municipalities (electoral data), the Netherlands (electoral data) and all riles for all regions.

## Challenges during development:
* First of all, the data was harder to amend than anticipated. There was often a discrepancy between the names used in different data sets, and since the data sets were large and numerous, it took a while to get a good python program than could convert the data without mistakes. This meant I had to start later with the visualizations.
* The map did not load for a long time. First of all, finding the correct map was difficult, and then this map was too big, so it had to be shrunk. Once this worked, it took a while to set the colors of the municipalities. 
* The update functions took a while to function, but in the end I managed to get them working for both the pie chart and the line chart.
* The chart I had in mind for the riles turned out to just be another line chart, so I had to create a pie chart. In the end, I think this is actually a good addition and I am glad I added it.

## Defence of the current format
I think the combinations of charts gives a nice insight in the political shifts. The effects are visible, which was my target. I also like the large amount of data that I have incoporated. There is a lot of data available for all municipalities, which gives the visualization a nice depth, especially for those interested in politics. If I had more time, I would focus more on the map. I would for instance try to show water on the map (for instance, the Ijselmeer is now shown as if it is land). I would also try to get maps for every year, and then make a slider so that the user can see the changes in color on the map. Since the municipal map changed so much in the studied period, I could not incorporate this in my visualization due to time constraints.

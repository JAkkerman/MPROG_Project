# MPROG Project - Design Document
*Joos Akkerman(11304723)*

## Data sources
The data sources I will use are:
* the [Kiesraad](https://www.verkiezingsuitslagen.nl/verkiezingen/detail/TK20170315), has electoral data for every municipality. This data is provided in CSV format and should be relatively easy to use.
* the [manifest project](https://manifesto-project.wzb.eu/), which analyses election manifestos and gives it a score on, among other variables, how left-right it is.

The data is provided in a CSV, so I will build a CSV to JSON converter in python (v3 Pandas) to convert the data to a more usable format.

I will transform the data in such a way that you have a dictionary for every year. In this array there are dictionaries for every municipality which contain the electoral data and the Left-Right score for this municipality in this particular year. Additionally, I will make a dictionary in every year with the manifesto scores.

<code>Data = {1960: {municipalities: {Abcoude: {CPN: 3.5%, ... , LR-score: 3.560}, ...}, manifestos: {CPN: -40.00, ...}}...}</code>

## Overview of components

This visualization has multiple components, which will be explained separately:

#### Map of municipalities
This map shows all municipalities. These municipalities can change in color according to the variable that was requested by the user (either largest party of left-right score). The map has three interactive components:
* The user can change the year, which changes the colors on the map. This means that I will not only need electoral data but also preferably a map for every year, since the municipal borders have changed quite drastically over the years.
* The user can click a button to change the map to show either the colors of the largest party (like the example of the Kiesraad) or show the color of the relative position of this municipalities LR-score.

#### Line chart
When you click a municipality, a line chart will be shown containing the percentages the several parties got. When the visualization is first loaded, this will show the data for all of the Netherlands.

#### Shift chart
This chart will show the political position this municipality has over the years. This article on [FiveThirtyEight](https://fivethirtyeight.com/features/americas-electoral-map-is-changing/) has an example. It shows a vertical line in the middle, representing the average score of the Netherlands, and then shows the score of the municipality relative to this average score. This relative distance is represented by the horizontal distance relative to the horizontal middle line. This chart shows the relative position in the Netherlands.
Another chart can be added that takes 0 as the vertical line, meaning it represents the absolute center judged by political scientists. This can be used to show the shifts over time.
These two charts can either be next to each other or can be shifted between using a button.

Apart from the visualization, this project will also contain some other technical components:

#### Scraper/Calculator
This python program will contain the following functions:
* Get data from CSV
* Calculate the weighted score for every municipality and for all of the Netherlands
* Write data to JSON

## API's and plugins

# MPROG eindproject proposal
*Joos Akkerman (11304723)*

## Problem Statement
Current-day politics may be the most tumultuous since the Second World War. Major parties who have governed the Netherlands for half a century are now in decay and other parties are coming up. This development is highly influential to the politics of the Netherlands, which is why I want to create a data visualization that gives more insight in the electoral shifts for different regions in the Netherlands.

## Solution
My data visualization will show electoral data per region (municipality, province, or the whole country) for multiple (general) elections, which will show electoral shifts by comparing different years.

![alt text](https://github.com/JAkkerman/MPROG_Project/blob/master/Img/Proj_proposal1.jpg)

The visualization will include:

#### MVP:
* A map of the Netherlands where you can pick regions (and which will show the largest party in color.)
* A search bar that allows users to search for a region.
* An interface that shows the data for a particular region, which will include:
  * A time series showing the percentage all parties got over the years.
  * A search bar that allows to search for a party and then shows the development of this
    particular party in the region of choice.
  * An overview of the largest party (currently and overall), largest margin and other relevant data.
*  Show the shifts in political preference, so how 'right' of 'left' is the vote in this  region, based on a weighted score of the left and right parties that have gotten votes in this region. This I will show in a graph like the one in the FiveThirtyEight-example.

#### Optional:
* Let the user shift between regions, so not only show the data per municipality but also per province.
* Another option is to let the user use a slider that changes the year, so they can visualize the changes in the political preference of the regions on the map.

## Prerequisites
For this project I will use data from:
* the [Kiesraad](https://www.verkiezingsuitslagen.nl/verkiezingen/detail/TK20170315), which had a large body of electoral data, which shows the percentages parties got for the whole country, per province or per municipality. This data is provided in CSV format and should be relatively easy to use.
* the [manifest project](https://manifesto-project.wzb.eu/), which analyses election manifestos and gives it a score on, among other variables, how left-right it is. This I can use to judge not the shifts, weighted by actual data from that time.

The external components will consist of d3 libraries that can create [maps](https://www.theguardian.com/environment/interactive/2013/may/14/alaska-villages-frontline-global-warming) with interactive electoral data.

Some similar visualizations will include:
* The map used by the [Kiesraad](https://www.verkiezingsuitslagen.nl/verkiezingen/detail/TK20170315). I will use a similar map of Dutch municipalities and fill them with either the color of the largest party in a particular year or the left-right score for a particular year.
* This visualization from [FiveThirtyEight](https://fivethirtyeight.com/features/americas-electoral-map-is-changing/), which shows shifts in the electoral preferences for US districts. Since the US has a more binary political system, it is easier to show shifts in preference (depicted by voter margins for either the Democrats of Republicans) so I would like to make a similar graph but with the weighted score of left-right and/or progressive/conservative.
* This visualization by [Kieskompas](https://www.kieskompas.nl/media/filer_public/5a/9d/5a9d70f7-7ce7-47da-9e71-9676b6d7e61b/landschap_tk.png), which shows the position of parties (and the person who fills in the kieskompas) on a political matrix.

The most difficult problem is that municipal borders have changed quite a lot over the years. This means that especially in rural areas municipalities have merged, and thus the data for individual municipalities is hard to compare over the years. This can be solved by either only presenting data for municipalities that have existed for all the years in the dataset or to merge data to fit the current-day municipalities.

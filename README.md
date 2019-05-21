# MPROG eindproject proposal
*Joos Akkerman (11304723)*

### Problem Statement
Current-day politics may be the most tumultuous since the Second World War. Major parties
who have governed the Netherlands for half a century are now in decay and other parties
are coming up. This development is highly influential to the politics of the Netherlands,
which is why I want to create a data visualization that gives more insight in the electoral
shifts for different regions in the Netherlands

### Solution
My data visualization will show electoral data per region (municipality, province, or the
whole country) for multiple (general) elections, which will show electoral shifts
by comparing different years.


The visualization will include:

##### MVP:
* A map of the Netherlands where you can pick regions (and which will show the largest party in color.)
* A search bar that allows users to search for a region.
* An interface that shows the data for a particular region, which will include:
  * A time series showing the percentage all parties got over the years.
  * A search bar that allows to search for a party and then shows the development of this
    particular party in the region of choice.

##### Optional:
Show the shifts in political preference, so how 'right' of 'left' is the vote in this
region, based on a weighted score of the left and right parties that have gotten
votes in this region. This I will show in a graph like the one in the FiveThirtyEight-example.

If I manage to calculate this 'left/right'-score, I will also create the option for users
to show this on the general map, which means they can see which regions lean left and
right.

### Prerequisites
For this project I will use data from the [Kiesraad](https://www.verkiezingsuitslagen.nl/verkiezingen/detail/TK20170315),
which had a large body of electoral data, which shows the percentages parties
got for the whole country, per province or per municipality. This data is provided in
CSV format and should be relatively easy to use.

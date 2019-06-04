# MPROG Project - Design Document
*Joos Akkerman(11304723)*

## Data sources
The data sources I will use are:
* the [Kiesraad](https://www.verkiezingsuitslagen.nl/verkiezingen/detail/TK20170315), has electoral data for every municipality. This data is provided in CSV format and should be relatively easy to use.
* the [manifest project](https://manifesto-project.wzb.eu/), which analyses election manifestos and gives it a score on, among other variables, how left-right it is.

I will transform the data in such a way that you have a dictionary for every year. In this array there are dictionaries for every municipality which contain the electoral data. Additionally, I will make a dictionary in every year with the manifesto scores.

<code>Data = {1960: {municipalities: {Abcoude: {CPN: 3.5%, ...}, ...}, manifestos: {CPN: -40.00, ...}}...}</code>

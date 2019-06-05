#!/usr/bin/env python
# Name: Joos Akkerman
# Student number: 11304723
"""
This script converts data obtained from a .csv file to JSON format
"""

import json
import numpy as np
import pandas as pd

ELECTION_CSV_2017 = "Data/2017.csv"
ELECTION_CSV = ["Data/1946.csv", "Data/1948.csv", "Data/1952.csv", "Data/1956.csv", "Data/1959.csv",\
                "Data/1963.csv", "Data/1967.csv", "Data/1971.csv", "Data/1972.csv", "Data/1977.csv",\
                "Data/1981.csv", "Data/1982.csv", "Data/1986.csv", "Data/1989.csv", "Data/1994.csv",\
                "Data/1998.csv", "Data/2002.csv", "Data/2003.csv", "Data/2006.csv", "Data/2010.csv",\
                "Data/2012.csv"]
ELECTION_YEARS = ["1946", "1948", "1952", "1956", "1959", "1963", "1967", "1971", "1972", "1977", "1981",\
                  "1982", "1986", "1989", "1994", "1998", "2002", "2003", "2006", "2010", "2012"]
DEFAULT_CAT = ["RegioNaam", "RegioCode", "AmsterdamseCode", "OuderRegioNaam", "OuderRegioCode", "Kiesgerechtigden",\
               "Opkomst", "OngeldigeStemmen", "BlancoStemmen", "GeldigeStemmen"]
# DEFAULT_CAT = ["RegioNaam", "RegioCode", "AmsterdamseCode", "OuderRegioNaam", "OuderRegioCode", "Kiesgerechtigden",\
#               "Opkomst", "OngeldigeStemmen", "BlancoStemmen"]
MANIFESTO_CSV = "ManProj.csv"
OUTPUT_JSON = "data.json"
FIRSTCOLUMN = 1
LASTCOLUMN = 6


def clean(input_2017, input_rest, firstcolumn, lastcolumn):
    """
    Reads the csv file and returns the requested data
    """
    # Data = {Aalsmeer: {1946: {CPN: 3.5%, ... , LR-score: 3.560}, ...}, ...}

    # first write the data for the last election in 2017
    input = pd.read_csv(input_2017, delimiter=';')
    input.fillna(value=0.0, inplace=True)
    print(input)
    municipalities = {}

    for row in range(len(input)):
        if row != 0:
            municipalities[input.loc[row, 'RegioNaam']] = {}

    # write election results to separate dictionary
    parties = []
    for category in list(input):
        if category not in DEFAULT_CAT:
            parties.append(category)

    # add electoral results
    municipalities = percentage(municipalities, 2017, parties, input)

    # add the rest of the election years
    # for year in ELECTION_YEARS:
    #     print(year)
    #     input = pd.read_csv(f"Data/{year}.csv", delimiter=';')
    #     # municipalities = {}
    #     print(input)

        # for row in range(len(input)):
        #     if row != 0:
        #         municipalities[input.loc[row, 'RegioNaam']] = {}

    # calculate left-right score for every municipality
    # municipalities = LRscore(municipalities)

    # Iterate over remaining elections, if a municipality is found that existed in 2017, add electoral data
    municipalities = [municipalities]
    print(municipalities)
    return municipalities


def LRscore(municipalities):
    """
    Calculates the weighted average of political scores
    """

    return municipalities

def percentage(municipalities, year, parties, input):
    """
    Converts the amount of votes to percentages
    """

    for row in range(len(input)):
        if row != 0:
            # check if the municipality existed in 2017
            if input.loc[row, 'RegioNaam'] in municipalities:
                votes = input.loc[row, 'GeldigeStemmen']
                # write the results to a dictionary and append them to the year
                results = {}
                for category in parties:
                    results[category] = ((int(input.loc[row, category]))/votes)*100

                municipalities[input.loc[row, 'RegioNaam']][year] = results
                # print(municipalities[input.loc[row, 'RegioNaam']][year])
                # municipalities[input.loc[row, 'RegioNaam']][year][category] = input.loc[row, category]


    return municipalities

def convert(data, outputJSON):
    """
    Converts selected data to JSON format
    """

    with open(outputJSON, 'w') as output:
        output.write(json.dumps(data))


if __name__ == '__main__':

    # read data from data file
    data = clean(ELECTION_CSV_2017, ELECTION_CSV, FIRSTCOLUMN, LASTCOLUMN)
    # input = pd.read_csv("Data/2017.csv", delimiter=';')
    # print(input)

    # convert data to JSON format
    # convert(data, OUTPUT_JSON)

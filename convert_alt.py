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
ELECTION_YEARS = ["1946", "1948", "1952", "1956", "1959", "1963", "1967", "1971", "1972", "1977", "1981",\
                  "1982", "1986", "1989", "1994", "1998", "2002", "2003", "2006", "2010", "2012"]
DEFAULT_CAT = ["RegioNaam", "RegioCode", "AmsterdamseCode", "OuderRegioNaam", "OuderRegioCode", "Kiesgerechtigden",\
               "Opkomst", "OngeldigeStemmen", "BlancoStemmen", "GeldigeStemmen"]
MANIFESTO_CSV = "Data/ManProj.csv"
OUTPUT_JSON = "data.json"

def clean(input_2017, input_rest):
    """
    Reads the csv file and returns the requested data
    """

    # [{Aalsmeer: {VVD: {1946: 20%, ...}, ...}, ...}]

    # first write the data for the last election in 2017
    input = pd.read_csv(input_2017, delimiter=';')
    input.fillna(value=0.0, inplace=True)
    municipalities = {}

    for row in range(len(input)):
        if row != 0:
            municipalities[input.loc[row, 'RegioNaam']] = {}

    parties = partylist(input)

    # add electoral results
    municipalities = percentage(municipalities, '2017', parties, input)

    # iterate over remaining elections, if a municipality is found that existed in 2017, add electoral data
    for year in ELECTION_YEARS:
        print(year)
        input = pd.read_csv(f"Data/{year}.csv", delimiter=';')
        input.fillna(value=0.0, inplace=True)
        parties = partylist(input)
        municipalities = percentage(municipalities, year, parties, input)

    # clean manifesto data
    manifestos = cleanmanifestos(MANIFESTO_CSV)

    # calculate left-right score for every municipality
    # municipalities = LRscore(municipalities, manifestos)

    municipalities = [municipalities]
    # print(municipalities)
    return municipalities


def cleanmanifestos(input_csv):
    """
    Cleans manifesto data to get rile scores (LR-scores)
    """

    input = pd.read_csv(input_csv, delimiter=',')
    input.fillna(value=0.0, inplace=True)
    manifestos = {}
    for row in range(len(input)):
        if row != 0:
            manifestos[input.loc[row, 'date']] = {}

    for row in range(len(input)):
        if row != 0:
            manifestos[input.loc[row, 'date']][input.loc[row, 'partyname']] = input.loc[row, 'rile']
    print(manifestos)
    return manifestos


def partylist(input):
    """
    Write election results to separate dictionary
    """
    parties = []
    for party in list(input):
        if party not in DEFAULT_CAT:
            parties.append(party)

    return parties

def LRscore(municipalities, manifestos):
    """
    Calculates the weighted average of political scores
    """

    for municipality in municipalities:
        municipalities[municipality]['rile'] = {}
        for party in municipalities[municipality]:
            tot_rile = 0
            tot_votes = 0
            # print(municipalities[municipality])
            for data in municipalities[municipality][party]:
                if party != 'rile':
                    # print(party)
                    # print(data)
                    # calculate the weighted average of riles
                    if party in (municipalities[municipality] and manifestos[int(data['year'])]):
                        tot_votes = tot_votes + data['value']
                        tot_rile = tot_rile + data['value'] * manifestos[int(data['year'])][party]
                        # print(tot_rile)
                        # if data['year'] == '2017':
                            # print(data['year'])
                            # print(tot_rile/tot_votes)

                        municipalities[municipality]['rile'][data['year']] = tot_rile/tot_votes

                        # if data['year'] == '2017':
                            # print(municipalities[municipality]['rile'][data['year']])

    print(municipalities)
    return municipalities

def percentage(municipalities, year, parties, input):
    """
    Converts the amount of votes to percentages
    """
    # print(municipalities)
    for row in range(len(input)):
        if row != 0:
            municipality = input.loc[row, 'RegioNaam']

            # check if the municipality existed in 2017
            if municipality in municipalities:
                # print(municipalities[municipality])
                votes = input.loc[row, 'GeldigeStemmen']

                for party in parties:
                    # print(party)
                    # if party != parties[len(parties) - 1]:
                    value = input.loc[row, party]
                    if type(input.loc[row, party]) == str:
                        print(value)
                        print(year)
                        value = float(value.replace(',', '0'))

                    precentage = (value/votes)*100

                    # add parties that got more than 1 percent of the vote
                    if (value/votes)*100 >= 1:
                        if party == 'GROENLINKS':
                            party = 'GL'
                        # print(municipality)
                        # if party in municipality:
                        # print(municipalities[municipality])
                        if party not in municipalities[municipality]:
                            municipalities[municipality][party] = []
                        municipalities[municipality][party].append({'year': year, 'value': (value/votes)*100})

    return municipalities


def convert(data, outputJSON):
    """
    Converts selected data to JSON format
    """

    with open(outputJSON, 'w') as output:
        output.write(json.dumps(data))


if __name__ == '__main__':

    # read data from data file
    data = clean(ELECTION_CSV_2017, ELECTION_YEARS)

    # convert data to JSON format
    convert(data, OUTPUT_JSON)

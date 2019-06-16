#!/usr/bin/env python
# Name: Joos Akkerman
# Student number: 11304723
"""
This script converts data obtained from a .csv file to JSON format
"""

import json
import numpy as np
import pandas as pd
# import convert

ELECTION_YEARS = ["1946", "1948", "1952", "1956", "1959", "1963", "1967", "1971", "1972", "1977", "1981",\
                  "1982", "1986", "1989", "1994", "1998", "2002", "2003", "2006", "2010", "2012"]
OUTPUT_JSON = "data_NL.json"
MANIFESTO_CSV = "Data/ManProj.csv"
# DEFAULT_CAT = []

def clean(ELECTION_YEARS):
    """
    Reads the csv file and returns the requested data
    """

    results_NL = {}

    # iterate over elections, add results to year dictionary
    for year in ELECTION_YEARS:
        input = pd.read_csv(f"Data_NL/{year}.csv", delimiter=';')
        input.fillna(value=0.0, inplace=True)
        parties = partylist(input)
        results_NL = percentage(results_NL, year, parties, input)
        # results_NL[year] = result_NL

    print(results_NL)

    # clean manifesto data
    # manifestos = cleanmanifestos(MANIFESTO_CSV)

    # calculate left-right score for every municipality
    # results_NL = LRscore(results_NL, manifestos)

    final_results_NL = {}
    final_results_NL["Nederland"] = results_NL

    return [final_results_NL]


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

    return manifestos


def partylist(input):
    """
    Write election results to separate dictionary
    """
    parties = []
    for row in range(len(input)):
        if input.loc[row, 'Partij'] != 0.0:
            parties.append(input.loc[row, 'Partij'])

    return parties

def LRscore(results_NL, manifestos):
    """
    Calculates the weighted average of political scores
    """

    for year in results_NL:
        tot_rile = 0
        tot_votes = 0
        for party in results_NL[year]:
            # calculate the weighted average of riles
            if party in (results_NL[year] and manifestos[int(year)]):
                tot_votes = tot_votes + results_NL[year][party]
                tot_rile = tot_rile + results_NL[year][party] * manifestos[int(year)][party]

        results_NL[year]['rile'] = tot_rile/tot_votes

    return results_NL

def percentage(results_NL, year, parties, input):
    """
    Converts the amount of votes to percentages
    """
    print(year)
    for row in range(len(input)):
        if input.loc[row, 'RegioUitslag'] == 'AantalGeldigeStemmen':
            votes = input.loc[row, 'AantalStemmen']
            break

    for party in parties:
        for row in range(len(input)):
            if input.loc[row, 'Partij'] == party:

                # change party names to make them match
                if party == 'PvdA':
                    party = 'Partij van de Arbeid (P.v.d.A.)'
                elif party == 'PVV':
                    party = 'PVV (Partij voor de Vrijheid)'
                elif party == 'CDA':
                    party = 'Christen Democratisch App\u00e8l (CDA)'
                elif party == 'GROENLINKS':
                    party = 'GL'
                elif party == 'SP':
                    party = 'SP (Socialistische Partij)'
                elif party == 'SGP':
                    party = 'Staatkundig Gereformeerde Partij (SGP)'
                elif party == 'PvdD':
                    party = 'Partij voor de Dieren'
                elif party == 'CU':
                    party = 'ChristenUnie'
                elif party == 'D66':
                    party = 'Democraten 66 (D66)'

                result = input.loc[row, 'AantalStemmen']/votes * 100
                if result > 1:
                    if party not in results_NL:
                        results_NL[party] = []
                    results_NL[party].append({'year': year, 'value': result})

    return results_NL


def convert(data, outputJSON):
    """
    Converts selected data to JSON format
    """

    with open(outputJSON, 'w') as output:
        output.write(json.dumps(data))


if __name__ == '__main__':

    # read data from data file
    data = clean(ELECTION_YEARS)

    # convert data to JSON format
    convert(data, OUTPUT_JSON)

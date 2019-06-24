import pandas as pd
import json

INPUT_CSV = 'ManProj.csv'
OUTPUT_JSON = 'pvdariles.json'

def cleanmanifestos(input_csv):
    """
    Cleans manifesto data to get rile scores (LR-scores)
    """

    input = pd.read_csv(input_csv, delimiter=',')
    input.fillna(value=0.0, inplace=True)
    data = []

    for row in range(len(input)):
        if input.loc[row, 'partyname'] == 'Partij van de Arbeid (P.v.d.A.)':
            year = int(input.loc[row, 'date'])
            rile = input.loc[row, 'rile']
            data.append({'year': year, 'rile': rile})
            # manifestos[input.loc[row, 'date']][input.loc[row, 'partyname']] = input.loc[row, 'rile']

    print(data)
    return data


def convert(data, outputJSON):
    """
    Converts selected data to JSON format
    """

    with open(outputJSON, 'w') as output:
        output.write(json.dumps(data))


if __name__ == '__main__':
    # get data
    data = cleanmanifestos(INPUT_CSV)

    # paste data to json
    convert(data, OUTPUT_JSON)

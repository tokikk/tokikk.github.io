import os
import csv

path_to_csv = './data/syukujitsu.csv'
path_to_api = './api/' 

if __name__ == '__main__':
    csv_file = open(path_to_csv, 'r', encoding='utf-8', errors='', newline='')
    obj = csv.reader(csv_file, delimiter=',', doublequote=True, lineterminator='\r\n', skipinitialspace=True)
    next(obj)
    os.makedirs('./api', exist_ok=True)
    flist = open(f'{path_to_api}holidaylist', 'w', encoding='UTF-8')
    for row in obj:
        nums = str(row[0]).split('/')
        flist.write(f'{nums[0]}{nums[1].zfill(2)}{nums[2].zfill(2)},{row[1]}\n')
        f = open(f'{path_to_api}{nums[0]}{nums[1].zfill(2)}{nums[2].zfill(2)}', 'w', encoding='UTF-8')
        f.write(row[1])
        f.close()
    flist.close()
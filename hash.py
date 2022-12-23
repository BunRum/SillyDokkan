import json
import sys
import xxhash
from os import path
from pathlib import Path
import socket
import glob
hostname = socket.gethostname()
IPAddr = socket.gethostbyname(hostname)

def hash_file2(fpath):
    with open(fpath, 'rb') as file:
        hasher = xxhash.xxh64()
        hasher.update(file.read())
        hex_text = hasher.hexdigest()
        print(int(hex_text, 16))

def hashes(source, tutorial, address):
    currentassetversion = json.load(open("local/versions.json", 'r+'))["asset"]
    hashesjson = {"assets0": []} if tutorial else {"assets": [], "latest_version": currentassetversion}
    for filename in glob.glob(f'{source}/**', recursive=True):
         truefilename = filename.replace("\\", "/")
         if path.isfile(truefilename):
            with open(truefilename, 'rb') as file:
                   hasher = xxhash.xxh64()
                   hasher.update(file.read())
                   hex_text = hasher.hexdigest()
                   DirectLink = truefilename.replace("public/", "")
                   wheretoadd = hashesjson["assets0"] if tutorial else hashesjson["assets"]
                   wheretoadd.append({
                       "url": f"{address}/{DirectLink}",
                       "file_path": truefilename.replace(f"{source}/", ""),
                       "algorithm": "xxhash",
                       "size": Path(truefilename).stat().st_size,
                       "hash": str(int(hex_text, 16))
                   })
    print(json.dumps(hashesjson))

args = json.loads(sys.argv[1])

if args["function"] == 'hash':
    hash_file2(args["filedir"])
elif args["function"] == 'hashes':
    hashes(args["source"], args["tutorial"], args["address"])

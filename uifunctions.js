var stuff = require("./start")
var fs = require("fs")
const path = require('path')
const mkdirp = require('mkdirp')
var sqlite3 = require('@journeyapps/sqlcipher').verbose();
var db = new sqlite3.Database('public/database.db');

var uifunctions = function uifunctions(app) {
    
    app.post("/GenerateCards", (req, res) => {
        console.log("Generating Cards...")
        var options = {
            args: JSON.stringify({ "function": 'GenerateCards' })
        }
    
        PythonShell.run('databasefunctions.py', options, function (err, results) {
            if (err) throw err;
            console.log(results)
            console.log('Generated Cards');
        });
    
        res.send({ message: req.params });
    });

    app.post("/execute", (req, res) => {
        db.run("PRAGMA key='9bf9c6ed9d537c399a6c4513e92ab24717e1a488381e3338593abd923fc8a13b'")
        db.run("PRAGMA cipher_compatibility = 3")
        db.exec(req.body)
    
        parsedData = JSON.parse(fs.readFileSync(path.join("localfiles", "versions.json")))
        parsedData["database"]++
        console.log(parsedData)
        fs.writeFileSync(path.join("localfiles", "versions.json"), JSON.stringify(parsedData, null, 3))
    })

    app.post('/uploadfiles', (req, res, next) => {
        console.log("uploading files")
        const form = formidable({ multiples: true, maxFileSize: 7000 * 1024 * 1024 })
    
        var versionsjson = JSON.parse(fs.readFileSync(path.join("localfiles", "versions.json")))
        versionsjson["asset"] = versionsjson["asset"] + 1
        fs.writeFileSync(path.join("localfiles", "versions.json"), JSON.stringify(versionsjson, null, 3))
        var assetversion = versionsjson["asset"].toString()
        console.log(assetversion)

        mkdirp(path.join("public", "assets", assetversion))
        const send = {
            "assets": [],
            "latest_version": Number(assetversion)
        }
        fs.mkdir(path.join("public", "assets", assetversion), { recursive: true }, () => {
            fs.writeFileSync(path.join("public", "assets", assetversion, "assets.json"), JSON.stringify(send, null, 4))
        })
    
        const hashfileandmove = file => {
            var oldpath = file.filepath
            var newpath = path.join("public", "assets", assetversion, file.originalFilename)
            var parsedpath = path.parse(newpath)
            var newpathDirectory = parsedpath.dir
    
    
            mkdirp(newpathDirectory).then(made => {
                // console.log(made)
                fs.renameSync(oldpath, newpath)
                // console.log(newpath)
                var ChangedPath = newpath.replace(/\\/g, "/")
                // console.log(ChangedPath)
                var formatted = ChangedPath.replace("public", stuff.fulladdress)
                // const regex = [^|]*$
                // console.log(typeof (file))
                var test = ChangedPath.replace("public/assets/", "")
                var pathss = test.substring(test.indexOf("/") + 1);
                // console.log(pathss)
                // console.log(fs.statSync(file).size)
    
                var options = {
                    args: JSON.stringify({ "function": 'hash', "filedir": newpath })
                }
                var hash
                PythonShell.run('hash.py', options, function (err, results) {
                    if (err) throw err;
                    hash = results[0]
                    assetsjson = JSON.parse(fs.readFileSync(path.join("public", "assets", assetversion, "assets.json")))
                    assetsjson.assets.push({
                        "url": formatted,
                        "file_path": pathss,
                        "algorithm": "xxhash",
                        "size": fs.statSync(newpath).size,
                        "hash": hash
                    })
                    // console.log(files.files.indexOf(file), files.files.length - 1)
                    fs.writeFileSync(path.join("public", "assets", assetversion, "assets.json"), JSON.stringify(assetsjson, null, 4))
                    // console.log('Generated Cards');
                });
            })
        }

        form.parse(req, (err, fields, files) => {
            if (err) {
                next(err);
                return;
            }
            if (files.files.originalFilename) {
                hashfileandmove(files.files)
                console.log("successfully uploaded files")
            } else {
                for (var i = 0; i < files.files.length; i++) {
                    hashfileandmove(files.files[i])
                    if (i == files.files.length) {
                        console.log("successfully uploaded files")
                    }
                }
            }
    
        });
    
        // return
    
    
        // }
        // res.send("all good bro")
    })
}

module.exports = {
    uifunctions: uifunctions
}
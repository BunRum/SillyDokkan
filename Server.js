const dayjs = require("dayjs")
const fs = require("fs")
const glob = require("glob")
const Index = require("./start")
const path = require('path')
const { PythonShell } = require("python-shell")


var hashesscript = `
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
         truefilename = filename
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
`

function parsejsonfile(file) {
    var jsonfile = fs.readFileSync(file).toString()
    jsonfile = jsonfile.replaceAll("./", `${Index.fulladdress}/`)
    // getObject(json)
    console.log(jsonfile)
    return JSON.parse(jsonfile)
}

function insert(str, index, value) {
    return str.substr(0, index) + value + str.substr(index);
}

// parsejsonfile("local/resources/home.json")

var ServerStart = function ServerStart(app) {

    var userjson = {
        "user": {
            "id": 0,
            "name": "",
            "is_ondemand": false,
            "rank": 999,
            "exp": 99999999,
            "act": 250,
            "boost_point": 0,
            "act_max": 250,
            "act_at": 1668127304,
            "boost_at": 0,
            "wallpaper_item_id": 0,
            "achievement_id": null,
            "mainpage_card_id": null,
            "mainpage_user_card_id": null,
            "mydata_subpage_visible": true,
            "card_capacity": 7777,
            "total_card_capacity": 7777,
            "friends_capacity": 50,
            "support_item_capacity": 4,
            "is_support_item_capacity_extended": true,
            "battle_energy": {
                "energy": 0,
                "recover_point_with_stone": 1,
                "battle_at": 0,
                "seconds_per_cure": 10800,
                "max_recovery_count": 5,
                "recovered_count": 0
            },
            "zeni": 999999999,
            "gasha_point": 999999,
            "exchange_point": 999999,
            "stone": 77777,
            "tutorial": {
                "progress": 999999,
                "is_finished": true,
                "contents_lv": 500
            },
            "is_potential_releaseable": true,
            "processed_at": 1668735348
        }
    }

    app.get("/ping", (req, res) => {
        res.send({
            "ping_info": {
                "host": "ishin-global.aktsk.com",
                "port": 443,
                "port_str": 443,
                "cf_uri_prefix": "https://cf.ishin-global.com/"
            }
        })
    })

    app.post("/auth/sign_up", (req, res) => {
        console.log(req.body)
        res.send({
            "identifiers": "V1VoSFBHWWNlUTRhdkZmNEFyeDJDdnQ4a0VjckMzZE8xSlUzeHZlSjNLUTlh\nM1NHOVpjTEhyb0c3MWlxRWlRdHQ1SURSUm5QcGlXd0NhMkRoZWRvZ1c9PTp4\ndzBOem5mVU00Q3hVZG5hZVoxbkROPT0=\n", // V1VoSFBHWWNlUTRhdkZmNEFyeDJDdnQ4a0VjckMzZE8xSlUzeHZlSjNLUTlh\nM1NHOVpjTEhyb0c3MWlxRWlRdHQ1SURSUm5QcGlXd0NhMkRoZWRvZ1c9PTp4\ndzBOem5mVU00Q3hVZG5hZVoxbkROPT0=\n
            "user": {
                "name": userjson.user.name,
                "user_id": userjson.user.id
            }
        })
    })

    app.put("/auth/link_codes/:code", (req, res) => {
        console.log(req.params.code)
        res.send({
            "identifiers": "V1VoSFBHWWNlUTRhdkZmNEFyeDJDdnQ4a0VjckMzZE8xSlUzeHZlSjNLUTlh\nM1NHOVpjTEhyb0c3MWlxRWlRdHQ1SURSUm5QcGlXd0NhMkRoZWRvZ1c9PTp4\ndzBOem5mVU00Q3hVZG5hZVoxbkROPT0=\n", // V1VoSFBHWWNlUTRhdkZmNEFyeDJDdnQ4a0VjckMzZE8xSlUzeHZlSjNLUTlh\nM1NHOVpjTEhyb0c3MWlxRWlRdHQ1SURSUm5QcGlXd0NhMkRoZWRvZ1c9PTp4\ndzBOem5mVU00Q3hVZG5hZVoxbkROPT0=\n
            "user": {
                "name": userjson.user.name,
                "user_id": userjson.user.id
            }
        })
    })

    app.post("/auth/link_codes/:code/validate", (req, res) => {
        console.log(req.params.code)
        userjson.user.name = `[Silly] ${req.params.code}`
        res.send({
            "is_platform_difference": false,
            "name": userjson.user.name,
            "rank": userjson.user.rank,
            "user_id": 0
        })
    })

    app.post("/auth/sign_in", (req, res) => {
        res.send({
            "access_token": "bun",
            "token_type": "mac",
            "secret": "g76Hc8z0giY4abXlazVg1+cSnRIhqguRcIRT2RI3+VC0u/sPmb1aLfuCVJOMbYt63OWY4WuWpSaKTbiN90ruWA==", // g76Hc8z0giY4abXlazVg1+cSnRIhqguRcIRT2RI3+VC0u/sPmb1aLfuCVJOMbYt63OWY4WuWpSaKTbiN90ruWA==
            "algorithm": "hmac-sha-256",
            "expires_in": 3600,
            "captcha_result": "success",
            "message": "Verification completed."
        })
    })

    app.get("/user", (req, res) => {
        var currentdate = dayjs().unix()
        // console.log(currentdate)
        userjson.user.processed_at = currentdate
        // var unixcurrentdate = dayjs()
        res.send(userjson)
    });

    app.put("/user", (req, res) => {
        var currentdate = dayjs().unix()
        // console.log(currentdate)
        userjson.user.processed_at = currentdate
        // var unixcurrentdate = dayjs()
        res.send(userjson)
    })

    app.get("/user/succeeds", (req, res) => {
        res.send({
            "external_links": {
                "facebook": "unserved",
                "game_center": "unserved",
                "google": "unserved",
                "apple": "unserved",
                "link_code": "unlinked"
            },
            "updated_at": dayjs().unix()
        })
    })

    app.get("/tutorial/assets", (req, res) => {
        fs.readFile(`public/tutorial/assets.json`, (err, data) => {
            if (err) {
                const options = {
                    args: JSON.stringify({ "function": 'hashes', "source": `public/tutorial`, "tutorial": true, "address": Index.fulladdress })
                }
                console.log("running")
                PythonShell.runString(hashesscript, options, (err, results) => {
                    if (err) throw err;
                    console.log(results)
                    hashesjson = JSON.parse(results[0])
                    fs.writeFileSync(`public/tutorial/assets.json`, JSON.stringify(hashesjson, null, 4))
                    res.send(hashesjson)
                })
            } else {
                console.log("existing tutorial assets json found")
                res.send(JSON.parse(data))
            }
        })
    })

    app.post("/ondemand_assets", (req, res) => {
        // res.send({})
        // console.log(req.body)
        cardtosend = {
            "cards": [],
            "battle_character": [],
            "card_bgs": []
        }
        // res.send({})
        var array
        var pattern = '()'
        if (req.body["card_ids"].includes(",")) {
            array = req.body["card_ids"].split(",")
        } else {
            array = [req.body["card_ids"]]
        }
        array.forEach(num => {
            // if (arr)
            var result = array.indexOf(num)
            if (result == 0) {
                pattern = insert(pattern, 1, `*${num}.cpk|`)
            } else if (result == array.length - 1) {
                pattern = insert(pattern, pattern.lastIndexOf(")"), `*${num}.cpk`)
            } else {
                pattern = insert(pattern, pattern.lastIndexOf("|") + 1, `*${num}.cpk|`)
            }
            if (array.length == 1) {
                pattern = num.toString()
            }
            console.log(num)
        })
        console.log(pattern)
        glob(`public/assets/**/character/**/*${pattern}`, (err, files) => {
            console.log(files)
            files.forEach(file => {
                var downloadurl = file.replace("public", Index.fulladdress)
                var assetpath = file.replace("public/assets/", "").substring(file.replace("public/assets/", "").indexOf("/") + 1);
                PythonShell.runString(hashesscript, { args: JSON.stringify({ "function": 'hash', "filedir": file }) }, function (err, results) {
                    if (err) throw err;
                    hash = results[0]
                    if (assetpath.includes("/card/")) {
                        cardtosend.cards.push({
                            "url": downloadurl,
                            "file_path": assetpath,
                            "algorithm": "xxhash",
                            "size": fs.statSync(file).size,
                            "hash": hash
                        })
                    } else if (assetpath.includes("/card_bg/")) {
                        cardtosend["card_bgs"].push({
                            "url": downloadurl,
                            "file_path": assetpath,
                            "algorithm": "xxhash",
                            "size": fs.statSync(file).size,
                            "hash": hash
                        })
                    }
                    if (files.indexOf(file) == files.length - 1) {
                        console.log(cardtosend)
                        res.send(cardtosend)
                    }
                });
            })
        })
    })

    app.get("/client_assets/database", (req, res) => {
        console.log(req.headers["authorization"])
        var versionsjson = JSON.parse(fs.readFileSync(`local/versions.json`))
        console.log(`${Index.fulladdress}/database.db`)
        res.send({
            "url": `${Index.fulladdress}/database.db`,
            "file_path": "sqlite/current/en/database.db",
            "algorithm": "version",
            "hash": versionsjson["database"],
            "version": versionsjson["database"]
        })
    })

    app.get("/cards", (req, res) => {
        res.send(parsejsonfile("local/cards.json"))
    })


    app.get("/client_assets", (req, res) => {
        var versionsjson = JSON.parse(fs.readFileSync(`local/versions.json`))
        // res.set('Content-Type', 'application/json');

        fs.readFile(`public/assets/${versionsjson["asset"]}/assets.json`, (err, data) => {
            if (err) {
                const options = {
                    args: JSON.stringify({ "function": 'hashes', "source": `public/assets/${versionsjson["asset"]}`, "tutorial": false, "address": Index.fulladdress })
                }
                console.log("running")
                PythonShell.runString(hashesscript, options, (err, results) => {
                    if (err) throw err
                    console.log(results)
                    hashesjson = JSON.parse(results[0])
                    fs.writeFileSync(`public/assets/${versionsjson["asset"]}/assets.json`, JSON.stringify(hashesjson, null, 4))
                    res.send(hashesjson)
                })
            } else {
                console.log("existing assets json exists")
                res.send(JSON.parse(data))
                // res.send(data)
            }
        })

    })

    app.get("/title/banners", (req, res) => {
        res.send(parsejsonfile("local/title/banners.json"))
    })


    app.get("/item_reverse_resolutions/achievements", (req, res) => {
        res.send(JSON.parse(fs.readFileSync(path.join("local", "item_reverse_resolutions", "achievements.json"))))
    })

    app.get("//user/mydata", (req, res) => {
        res.send({
            "id": 0,
            "name": "username",
            "rank": 999,
            "leader": {
                "id": 1593605758,
                "card_id": 1022771,
                "exp": 5000000,
                "skill_lv": 1,
                "awakening_route_id": null,
                "is_favorite": true,
                "is_released_potential": false,
                "released_rate": 0.0,
                "optimal_awakening_step": null,
                "awakenings": [],
                "unlocked_square_statuses": [
                    2,
                    2,
                    2,
                    2
                ],
                "created_at": 1669582597,
                "card_decoration_id": null,
                "exchangeable_item_id": null,
                "potential_parameters": [],
                "equipment_skill_items": [],
                "link_skill_lvs": []
            },
            "achievement_id": null,
            "mainpage_card_id": null,
            "mainpage_user_card_id": null,
            "num_friends": 0,
            "max_friends": 50,
            "score": {
                "total_score": 130,
                "quest_clears": 3,
                "dokkan_awakenings": 1,
                "max_link_skill_lvs": 0,
                "potential_squares": 0
            },
            "dot_character": {
                "id": 1009,
                "point": 11
            },
            "subpage_visible": true,
            "achievement_ids": [
                {
                    "achievement_id": 504,
                    "received_at": 1669537464
                },
                {
                    "achievement_id": 526,
                    "received_at": 1669537448
                }
            ],
            "sortie_character_counts": [
                {
                    "card_unique_info_id": 3,
                    "sortie_count": 1,
                    "last_card_id": 1022771
                },
                {
                    "card_unique_info_id": 35,
                    "sortie_count": 1,
                    "last_card_id": 1001090
                }
            ],
            "quest_cleared_counts": [
                {
                    "area_category": 9000,
                    "cleared_count": 3
                }
            ]
        })
    })

    app.get("/resources/:type", (req, res) => {
        console.log(req.headers["authorization"])
        var type = req.params["type"]
        var requestheaders = req.headers
        var assetversion = requestheaders['x-assetversion']
        var databaseversion = requestheaders['x-databaseversion']
        var versionsjson = JSON.parse(fs.readFileSync(`local/versions.json`))
        console.log(`clients asset version: ${assetversion}`, `clients db version: ${databaseversion}`)
        console.log(`servers asset version: ${versionsjson["asset"]}`, `servers db version: ${versionsjson["database"]}`)
        if (versionsjson["database"] != databaseversion) {
            console.log("download database")
            // res.status = 400
            res.statusCode = 400
            res.send({
                "error": {
                    "code": "client_database/new_version_exists"
                }
            })
            // return true
        } else if (versionsjson["asset"] != assetversion) {
            console.log("download assets")
            // return true
            res.statusCode = 400
            res.send({
                "error": {
                    "code": "client_assets/new_version_exists"
                }
            })
        } else {
            console.log("no need to download new files")
            res.send(parsejsonfile(`local/resources/${type}.json`))
        }
    })

    app.get("/shops/:type/items", (req, res) => {
        var type = req.params["type"]
        if (type == "treasure") {
            res.send({
                "error": "not available yet"
            })
            res.statusCode = 400
        }
        res.send(JSON.parse(fs.readFileSync(`local/shops/${type}/items.json`)))
    })

    app.get("/treasure_items", (req, res) => {
        res.send({
            "user_treasure_items": []
        })
    })

    app.post("/missions/put_forward", (req, res) => {
        res.send({
            "missions": []
        })
    })

    app.get("//missions/mission_board_campaigns/:id", (req, res) => {
        res.send({})
    })

    app.get("/chain_battles", (req, res) => {
        res.send({
            "expire_at": 1668834000
        })
    })

    app.get("/iap_rails/googleplay_products", (req, res) => {
        res.send({
            "products": [],
            "daily_reset_at": dayjs().unix(),
            "expire_at": dayjs().unix(),
            "processed_at": dayjs().unix()
        })
        // res.send(JSON.parse(fs.readFileSync(path.join("local", "iap_rails", "googleplay_products.json"))))
    })

    app.get("/db_stories", (req, res) => {
        res.send({
            "db_stories": []
        })
    })

    app.put("/advertisement/id", (req, res) => {
        console.log(req.body)
        res.send({})
    })

    app.get("/announcements", (req, res) => {
        console.log("single")
        if (req.query["display"] == "home") {
            res.send(JSON.parse(fs.readFileSync(path.join("local", "announcements.json"))))
        }
    })

    app.get("/announcements/:route", (req, res) => {
        var pathez = req.params.route
        console.log(req.query, pathez)


        if (pathez == "notify") {
            res.send({
                "announcement_is_new": true
            })
        } else {

            try {

                file = fs.readFileSync(path.join("local", "annoucements", `${pathez}.json`))
                res.send(JSON.parse(file))
            } catch (err) {
                res.statusCode = 200
                res.send({})
            }
        }

    })

    app.get("/cooperation_campaigns", (req, res) => {
        res.send({
            "expire_at": 1669176000
        })
    })

    app.get("/sd/battle", (req, res) => {
        res.send({
            "id": 1,
            "start_at": 1999999999,
            "end_at": 1999999999,
            "result_end_at": 1999999999,
            "sd_map_id": 1,
            "tutorial": {
                "is_opening_finished": true,
                "progress": 255
            },
            "expires_at": 1999999999
        })
    })
    app.get("/dragonball_sets", (req, res) => {
        res.send({ "dragonball_sets": [] })

    })
    app.get("/special_items", (req, res) => {
        res.send({
            "special_items": []
        })
    })
    app.get("/sd/packs", (req, res) => {
        res.send({ "sd_packs": [] })
    })
    app.get("/joint_campaigns", (req, res) => {
        res.send({
            "expire_at": 1669176000
        })
    })

    app.post("/teams", (req, res) => {
        console.log(req.body)
        currentlead = req.body["user_card_teams"][0]["user_card_ids"][0]

        login = JSON.parse(fs.readFileSync(`local/resources/login.json`))

        login["teams"]["selected_team_num"] = req.body["selected_team_num"]
        login["teams"]["user_card_teams"][Number(req.body["selected_team_num"]) - 1] = req.body["user_card_teams"][0]

        fs.writeFileSync('local/resources/login.json', JSON.stringify(login, null, 4))

        // req.body["selected_team_num"]
        res.send({
            "selected_team_num": req.body["selected_team_num"],
            "user_card_teams": req.body["user_card_teams"],
            "missions": []
        })
    })

    app.get("/user_areas", (req, res) => {
        res.send(JSON.parse(fs.readFileSync(path.join("local", "user_areas.json"))))
    })

    app.get("/events", (req, res) => {
        res.send(parsejsonfile(path.join("local", "events.json")))
    })

    app.get("/quests/:eventid/briefing", (req, res) => {
        var eventid = req.params["eventid"]
        briefingjson = JSON.parse(fs.readFileSync(path.join("local", "quests", "403001", "briefing.json")))
        login = JSON.parse(fs.readFileSync(`local/resources/login.json`))
        console.log(req.query["team_num"])

        for (var i = 0; i < login["cards"].length; i++) {
            if (login["cards"][i]["card_id"] == login["teams"]["user_card_teams"][Number(req.query["team_num"]) - 1]["user_card_ids"][0]) {
                // we found it
                res.send({
                    "supporters": [],
                    "cpu_supporters": [
                        {
                            "id": 1,
                            "name": "Auto detect",
                            "leader": login["cards"][i],
                            "achievement_id": 490,
                            "rank": 999,
                            "is_friend": true,
                            "is_dummy": false,
                            "login_at": 1669538939,
                            "gasha_point": 0,
                            "is_cpu_supporter": true,
                            "is_cooperation_inviter": false
                        }
                    ],
                    "teaming_power_weight": {
                        "attack": 1.2,
                        "defense": 1.5,
                        "hp": 1,
                        "link_skill": 500,
                        "energy": 10000,
                        "skill_lv": 100
                    },
                    "ranking_enabled": true,
                    "last_deck_cards": [],
                    "is_cpu_only": false
                })

            }
        }
    })

    app.post("/quests/:eventid/sugoroku_maps/start", (req, res) => {
        // var userjson = JSON.parse(fs.readFileSync())
        console.log(user)
        res.send({
            "dummy_card_id": 1000780,
            "missions": [],
            "sugoroku": {
                "dice": {
                    "nums": [
                        {
                            "num": 1,
                            "weight": 22
                        },
                        {
                            "num": 2,
                            "weight": 22
                        },
                        {
                            "num": 3,
                            "weight": 22
                        },
                        {
                            "num": 4,
                            "weight": 18
                        },
                        {
                            "num": 5,
                            "weight": 10
                        },
                        {
                            "num": 6,
                            "weight": 8
                        }
                    ]
                },
                "events": {
                    "0": {
                        "content": {
                            "script_id": 2403031
                        },
                        "type": 501
                    },
                    "10": {
                        "content": {
                            "zeni": 1070
                        },
                        "type": 104
                    },
                    "11": {
                        "content": {
                            "rarity": 1
                        },
                        "type": 101
                    },
                    "12": {
                        "content": {
                            "rarity": 1
                        },
                        "type": 101
                    },
                    "14": {
                        "content": {
                            "rarity": 0
                        },
                        "type": 103
                    },
                    "15": {
                        "content": {
                            "rarity": 1
                        },
                        "type": 103
                    },
                    "17": {
                        "content": {
                            "after_script_id": 0,
                            "battle_info": [
                                {
                                    "after_script_id": null,
                                    "background_id": null,
                                    "before_script_id": null,
                                    "bgm_id": null,
                                    "charge_limit": 0,
                                    "charge_limit_script_id": null,
                                    "round_id": 403001232
                                }
                            ],
                            "battle_round_condition_sets": [],
                            "before_script_id": 0,
                            "enemies": [
                                [
                                    {
                                        "additional_drops": [],
                                        "ai_type": 3,
                                        "attack": 4100,
                                        "card_id": 2000671,
                                        "defence": 630,
                                        "drop": {
                                            "item_id": 2000670,
                                            "quantity": 1,
                                            "rarity": 1,
                                            "type": "Card"
                                        },
                                        "enemy_skill_ids": [],
                                        "exp": 1500,
                                        "extra_hp_gauges_count": 0,
                                        "finish_special_inform_hp": 0,
                                        "first_turn": 0,
                                        "hp": 20000,
                                        "is_finish_special_only": false,
                                        "is_necessary_to_defeat": true,
                                        "multi_atk_num": 1,
                                        "turn": 0,
                                        "zeni": 5000
                                    }
                                ]
                            ],
                            "link_skill_lv_up": []
                        },
                        "type": 301
                    },
                    "18": {
                        "content": {
                            "script_id": 2403032
                        },
                        "type": 502
                    },
                    "19": {
                        "content": {
                            "zeni": 1070
                        },
                        "type": 104
                    },
                    "2": {
                        "content": {
                            "zeni": 1070
                        },
                        "type": 104
                    },
                    "20": {
                        "content": {
                            "zeni": 720
                        },
                        "type": 104
                    },
                    "23": {
                        "content": {
                            "damage": 8
                        },
                        "type": 203
                    },
                    "24": {
                        "content": {
                            "desc": "You can only continue on HARD mode.",
                            "image": "obstacle_010.png"
                        },
                        "type": 503
                    },
                    "26": {
                        "content": {
                            "gauge": 1
                        },
                        "type": 107
                    },
                    "27": {
                        "content": {
                            "rarity": 0
                        },
                        "type": 101
                    },
                    "3": {
                        "content": {
                            "zeni": 720
                        },
                        "type": 104
                    },
                    "30": {
                        "content": {
                            "zeni": 1070
                        },
                        "type": 104
                    },
                    "31": {
                        "content": {
                            "zeni": 720
                        },
                        "type": 104
                    },
                    "32": {
                        "content": {
                            "rarity": 0
                        },
                        "type": 101
                    },
                    "33": {
                        "content": {
                            "rarity": 0
                        },
                        "type": 102
                    },
                    "34": {
                        "content": {
                            "damage": 8
                        },
                        "type": 203
                    },
                    "35": {
                        "content": {
                            "zeni": 1070
                        },
                        "type": 104
                    },
                    "36": {
                        "content": {
                            "rarity": 0
                        },
                        "type": 102
                    },
                    "38": {
                        "content": {
                            "zeni": 1070
                        },
                        "type": 104
                    },
                    "39": {
                        "content": {
                            "zeni": 1070
                        },
                        "type": 104
                    },
                    "4": {
                        "content": {
                            "zeni": 720
                        },
                        "type": 104
                    },
                    "40": {
                        "content": {
                            "rarity": 0
                        },
                        "type": 101
                    },
                    "42": {
                        "content": {
                            "gauge": 1
                        },
                        "type": 107
                    },
                    "5": {
                        "content": {
                            "zeni": 1070
                        },
                        "type": 104
                    },
                    "6": {
                        "content": {
                            "desc": "You can only continue on NORMAL mode.",
                            "image": "obstacle_010.png"
                        },
                        "type": 503
                    },
                    "7": {
                        "content": {
                            "rarity": 0
                        },
                        "type": 102
                    },
                    "8": {
                        "content": {
                            "gauge": 3
                        },
                        "type": 107
                    },
                    "9": {
                        "content": {
                            "zeni": 720
                        },
                        "type": 104
                    }
                },
                "first_focus_step": 18,
                "map": "403_001"
            },
            "token": "fHdRCKzPJ7fIeTZXI01y9g==",
            "user": userjson
        })
    })

}
module.exports = {
    ServerStart: ServerStart
}
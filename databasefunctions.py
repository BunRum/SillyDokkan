import sqlite3 
import json
import sys
import os
# function to add to JSON

con = sqlite3.connect("public/database.db")
c = con.cursor()
c.execute("PRAGMA key='9bf9c6ed9d537c399a6c4513e92ab24717e1a488381e3338593abd923fc8a13b'")
c.execute("PRAGMA cipher_compatibility = 3")
loginjson = "local/resources/login.json"

def write_json(new_data, filename, inside, method):
    if method == 'overwrite':
        with open(filename, 'r', encoding='utf-8') as f:
          my_list = json.load(f)

        # 👇️ [{'id': 1, 'name': 'Alice'}, {'id': 2, 'name': 'Bob'}, {'id': 3, 'name': 'Carl'}]
          my_list[inside] = new_data


        with open(filename, 'w', encoding='utf-8') as f:
            f.write(json.dumps(my_list, indent=2))
    elif method == 'append':
        with open(filename, 'r+') as file:
            # First we load existing data into a dict.
            file_data = json.load(file)
            # Join new_data with file_data inside, inside variable
            print(type(new_data), type(file_data[inside]))
            if type(file_data[inside]) is list:
                file_data[inside] = file_data[inside] + new_data
            else:
              file_data[inside].update(new_data)
            # Sets file's current position at offset.
            file.seek(0)
            # convert back to json.
            json.dump(file_data, file, indent=4)

def GenerateCards():
    print("hjajja")
    cur = con.cursor()
    cardsSql = cur.execute("""
    SELECT json_group_array( 
        json_object(
        'id', id, 
        'link_skill1_id', link_skill1_id,
        'link_skill2_id', link_skill2_id,
        'link_skill3_id', link_skill3_id,
        'link_skill4_id', link_skill4_id,
        'link_skill5_id', link_skill5_id,
        'link_skill6_id', link_skill6_id,
        'link_skill7_id', link_skill7_id,
        'updated_at', updated_at,
        'created_at', created_at,
        'rarity', rarity,
        'True_skill_lv', True_skill_lv,
		'True_lv', True_lv,
		'optimal_awakening_step', optimal_awakening_step,
        'potential_board_id', potential_board_id,
        'card_deco_id', card_deco_id
        )
    )
    FROM (SELECT cards.id, cards.link_skill1_id, cards.link_skill2_id, cards.link_skill3_id, cards.link_skill4_id, cards.link_skill5_id, cards.link_skill6_id, cards.link_skill7_id, strftime('%s', cards.updated_at) as updated_at, strftime('%s', cards.created_at) as created_at, cards.rarity, cards.skill_lv_max, cards.optimal_awakening_grow_type, cards.potential_board_id, card_exps.exp_total,
    CASE 
        WHEN cards.optimal_awakening_grow_type IS NULL THEN cards.skill_lv_max
    	 ELSE (SELECT optimal_awakening_growths.skill_lv_max FROM optimal_awakening_growths WHERE optimal_awakening_growths.optimal_awakening_grow_type = cards.optimal_awakening_grow_type ORDER BY optimal_awakening_growths.step DESC LIMIT 1)
    END AS True_skill_lv,
	CASE 
        WHEN cards.optimal_awakening_grow_type IS NULL THEN cards.lv_max
    	 ELSE (SELECT optimal_awakening_growths.lv_max FROM optimal_awakening_growths WHERE optimal_awakening_growths.optimal_awakening_grow_type = cards.optimal_awakening_grow_type ORDER BY optimal_awakening_growths.step DESC LIMIT 1)
    END AS True_lv,
    CASE
    	WHEN cards.rarity != 4 THEN NULL
    	ELSE (SELECT card_decorations.id FROM card_decorations WHERE card_decorations.card_id == (cards.leader_skill_set_id || '1'))
    END as card_deco_id,
	CASE 
        WHEN cards.optimal_awakening_grow_type IS NULL THEN null
    	 ELSE (SELECT optimal_awakening_growths.step FROM optimal_awakening_growths WHERE optimal_awakening_growths.optimal_awakening_grow_type = cards.optimal_awakening_grow_type ORDER BY optimal_awakening_growths.step DESC LIMIT 1)
    END AS optimal_awakening_step
    FROM cards JOIN card_exps ON cards.exp_type == card_exps.exp_type WHERE (cards.id LIKE '1%' OR cards.id LIKE '4%') AND (cards.id LIKE '%1') AND (card_exps.lv == cards.lv_max) ORDER BY cards.id ASC)
    """)
    cards = json.loads(cardsSql.fetchone()[0])
    # cards.sort()
    current_cards = []
    cardsjson = []
    cardidupdates = {}
    for v in json.load(open(loginjson, 'r+'))['cards']:
        current_cards.append(v['card_id'])
    for v in cards:
        if not v["id"] in current_cards and v["potential_board_id"]:
            # v.sort()
            potenialboards = cur.execute(f"""
            select total from (SELECT
            	potential_boards.id AS 'potential_board_id',
            	potential_events.type,
            	SUM(potential_events.additional_value) AS 'total'
            FROM
            	potential_boards
            LEFT JOIN
            	potential_squares ON (potential_squares.potential_board_id = potential_boards.id)
            LEFT JOIN
            	potential_events ON (potential_events.id = potential_squares.event_id)
            GROUP BY
            	potential_events.type,
            	potential_squares.potential_board_id
            HAVING
            	potential_events.type NOT IN ("PotentialEvent::Select", "PotentialEvent::Skill")
            ORDER BY
            	potential_boards.id ASC,
            	potential_events.type ASC)
            WHERE potential_board_id = {v["potential_board_id"]}
            """).fetchall()
            cardjson = {
                "id": v["id"],
                "card_id": v["id"],
                "exp": 30000000,
                "skill_lv": v["True_skill_lv"],
                "is_favorite": True,
                "awakening_route_id": None,
                "is_released_potential": True,
                "released_rate": 100.0,
                "optimal_awakening_step": v["optimal_awakening_step"],
                "card_decoration_id": v["card_deco_id"],
                "exchangeable_item_id": None,
                "awakenings": [],
                "unlocked_square_statuses": [0, 0, 0, 0],
                "updated_at": int(v["updated_at"]),
                "created_at": int(v["created_at"]),
                "potential_parameters": [
                    {
                        "parameter_type": "Atk",
                        "parameter_id": None,
                        "total_value": potenialboards[0][0]
                    },
                    {
                        "parameter_type": "Defense",
                        "parameter_id": None,
                        "total_value": potenialboards[1][0]
                    },
                    {
                        "parameter_type": "Hp",
                        "parameter_id": None,
                        "total_value": potenialboards[2][0]
                    },
                    {
                        "parameter_type": "Skill",
                        "parameter_id": 1,
                        "total_value": 11
                    },
                    {
                        "parameter_type": "Skill",
                        "parameter_id": 2,
                        "total_value": 15
                    },
                    {
                        "parameter_type": "Skill",
                        "parameter_id": 3,
                        "total_value": 0
                    },
                    {
                        "parameter_type": "Skill",
                        "parameter_id": 4,
                        "total_value": 10
                    },
                    {
                        "parameter_type": "Skill",
                        "parameter_id": 5,
                        "total_value": 10
                    },
                    {
                        "parameter_type": "Skill",
                        "parameter_id": 6,
                        "total_value": 15
                    },
                    {
                        "parameter_type": "Skill",
                        "parameter_id": 7,
                        "total_value": 15
                    }
                ],
                "equipment_skill_items": [],
                "link_skill_lvs": []
            }
            for v in [v["link_skill1_id"], v["link_skill2_id"], v["link_skill3_id"], v["link_skill4_id"], v["link_skill5_id"], v["link_skill6_id"], v["link_skill7_id"]]:
                if v:
                    cardjson['link_skill_lvs'].append({
                        "id": v,
                        "skill_lv": 10
                    })
            # print(potenialboardsSql.fetchall(), type(potenialboardsSql.fetchall()))
            # potentialboards = json.loads(potenialboardsSql.fetchall()[0])

            # print(potentialboards)
            cardsjson.append(cardjson)
            cardidupdates.update({cardjson["card_id"] : cardjson["updated_at"]})
    # pri
    write_json(cardsjson, loginjson, "cards", "append")
    write_json(cardidupdates, loginjson, "user_card_id_updates", "append")
    all_cards = json.load(open(loginjson, 'r+'))['cards']
    print(f"cards: {len(all_cards)}")

def test(howmany):
    print("test", howmany)


def DefaultCardBox():
    DefaultLogin = json.load(
        open("local/resources/loginog.json", 'r+'))
    # DefaultLogin['cards']
    write_json(DefaultLogin['cards'], loginjson, "cards", "overwrite")
    write_json(DefaultLogin['user_card_id_updates'], loginjson, "user_card_id_updates", "overwrite")

def Execute(sql: str):
    # result = " ".join(line.strip() for line in sql.splitlines())
    print(sql)
    c.executescript(sql)

    # result = r" ".join(line.strip() for line in sql.splitlines()).replace("\t", "").replace("'", '"')
    # print(repr(result))
    # result = c.execute(repr(result))
    # print


# Execute("gogogogogog \n rreworeworewrwe")

args = json.loads(sys.argv[1])
# print(args)
# print(json)

if args["function"] == 'GenerateCards':
    GenerateCards()
if args["function"] == 'test':
    test(args["howmany"])
if args["function"] == 'DefaultCardBox':
    DefaultCardBox()
if args["function"] == 'Execute':
    Execute(args["sql"])

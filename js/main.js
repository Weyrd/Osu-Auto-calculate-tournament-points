var TOKEN = "5c63917f55fbab478d3c69217b2493916d48c52e";
var apiResult = {}

var MULTIPLICATOR_T1 = 1
var MULTIPLICATOR_T2 = 1
var MULTIPLICATOR_T3 = 1
var nmmap = 0
var lobbyVAR = ""

var redRoll = 0
var blueRoll = 0
var redNamVar,
  blueRedVar,
  pointBlueVar,
  pointRedVar,
  MPLINKVAR, VARWARMUP = 0;

//
function getMatch(id, reset) {
  if (isNaN(parseInt(id))) {
    alert("Merci de coller un match link valide");
    return;
  } else {
    $.ajax({
      method: 'POST',
      url: "https://osu.ppy.sh/api/get_match?mp=" + id + "&k=" + TOKEN,
      success: function(result) {
        apiResult["referee"] = $("#reffereName").val()

        construcTab(result, reset)

      }
    })
  }
}

function get_user_name(id) {
  var username = ""
  urlRequest = "https://osu.ppy.sh/api/get_user?k=" + TOKEN + "&u=" + id
  $.ajax({
    method: 'POST',
    async: false,
    url: urlRequest,
    success: function(result) {
      username = result[0]["username"]
    }
  })
  return username

}

function gat_data_map(id) {
  var dataMap = []
  urlRequest = "https://osu.ppy.sh/api/get_beatmaps?b=" + id + "&k=" + TOKEN,
    $.ajax({
      method: 'POST',
      async: false,
      url: urlRequest,
      success: function(result) {
        title = result[0]["title"]
        imageUrl = "https://assets.ppy.sh/beatmaps/" + result[0]["beatmapset_id"] + "/covers/cover.jpg"
        dataMap.push(title)
        dataMap.push(imageUrl)
      }
    })
  return dataMap

}

function numberWithSpaces(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function chekMods(mods, numberMap, last) {
  /*MODS :
  None           = 0,
  NoFail         = 1,
  Easy           = 2,
  TouchDevice    = 4,
  Hidden         = 8,
  HardRock       = 16,
  SuddenDeath    = 32,
  DoubleTime     = 64*/

  switch (mods) {
    case 0:
      mod = "NM"
      if (last == mod) {
        numberMap += 1
      } else {
        numberMap = 1
      }
      last = "NM"
      break;
    case 1:
      mod = "NM"
      if (last == mod) {
        numberMap += 1
      } else {
        numberMap = 1
      }
      last = "NM"
      break;
    case 8:
    case 9:
      mod = "HD"
      if (last == mod) {
        numberMap += 1
      } else {
        numberMap = 1
      }
      last = "HD"
      break;
    case 16:
    case 17:
      mod = "HR"
      if (last == mod) {
        numberMap += 1
      } else {
        numberMap = 1
      }
      last = "HR"
      break;
    case 64:
    case 65:
      mod = "DT"
      if (last == mod) {
        numberMap += 1
      } else {
        numberMap = 1
      }
      last = "DT"
      break;
    default:
      mod = "wtf"
      if (last == mod) {
        numberMap += 1
      } else {
        numberMap = 1
      }
      last = "wtf"

  }
  return [mod, last, numberMap]
}

function tab1v1Qualif(maps, resets) {
  matchResultHEAD = "<thead><tr><td>id</td><td>Mappool</td><td>Cover</td>"
  for (var i = 0; i < maps[0]["scores"].length; i++) {
    user_id = maps[0]["scores"][i]["user_id"]
    username = get_user_name(user_id)
    if (username.length > 8) {
      username = username.substring(0, 7) + ".."
    }
    matchResultHEAD += '<td>' + username + '</td>';
  }
  matchResultHEAD += "</tr></thead>"


  matchResult = ""
  numberMap = 1
  last = "ALO"
  for (var i = 0; i < maps.length; i++) {
    map_data = gat_data_map(maps[i]["beatmap_id"])
    scores = maps[i]["scores"]

    matchResult += '<tr>';
    matchResult += '<td>' + i + '</td>';
    chehModsData = chekMods(parseInt(maps[i]["mods"]), numberMap, last)
    mod = chehModsData[0]
    last = chehModsData[1]
    numberMap = chehModsData[2]

    matchResult += '<td style="width : 1%;">' + mod + " " + numberMap + '</td>';
    matchResult += '<td ><img  class="cover" src="' + map_data[1] + '" alt=""> ' + map_data[0] + '</td>';
    for (var j = 0; j < scores.length; j++) {
      score = parseInt(scores[j]["score"])
      matchResult += '<td>' + numberWithSpaces(score) + '</td>';
    }

    matchResult += '</tr>';
  }
  if (resets) {
    reset()
  }
  return matchResultHEAD + matchResult
}

function tabMatch(maps, name, resets) {
  point_red = 0
  point_blue = 0

  blue_name = name.match(/(?<=: \()(.*)(?=\) vs)/g) //("(?<=: \()(.*)(?=\) vs)")
  red_name = name.match(/(?<=vs \()(.*)(?=\))/g)
  lobby = $("#lobbysel").val()
  if (lobby == "") {
    alert("please select a lobby")
  }

  if (blue_name.length > 8) {
    blue_name = blue_name.substring(0, 7) + ".."
  }
  if (red_name.length > 8) {
    red_name = red_name.substring(0, 7) + ".."
  }
  matchResultHEAD = "<thead><tr><td>id</td><td>Mappool</td><td>Cover</td>"
  matchResultHEAD += "<td>" + blue_name + " (Blue)</td><td>" + red_name + " (Red)</td><td>Ecart</td></tr></thead>"


  matchResult = ""
  numberMap = 1
  last = "ALO"
  mapRO = team["mappools"][team["lobby"][lobby]["mappool"]]

  VARWARMUP = 0
  for (var i = 0; i < maps.length; i++) {
    map_data = gat_data_map(maps[i]["beatmap_id"])
    scores = maps[i]["scores"]

    blue_score = 0
    red_score = 0



    matchResult += '<tr>';
    matchResult += '<td style="width : 1px;">' + i + '</td>';
    chehModsData = chekMods(parseInt(maps[i]["mods"]), numberMap, last)
    mod = "" //chehModsData[0]
    last = chehModsData[1]
    numberMap = chehModsData[2]

    for (const [key, value] of Object.entries(mapRO)) {
      if (maps[i]["beatmap_id"] == value) {
        mod = key
      }
    }
    if (mod == "") {
      mod = "warmup"
      VARWARMUP += 1
    }

    matchResult += '<td style="width : 1%;">' + mod + '</td>';
    matchResult += '<td style="width:27%;"><img  class="cover" src="' + map_data[1] + '" alt=""> ' + map_data[0] + '</td>';

    team1 = team["teams"][team["lobby"][lobby]["1"]]
    team2 = team["teams"][team["lobby"][lobby]["2"]]

    for (var j = 0; j < scores.length; j++) {
      if (scores[j]["team"] == 1) {
        score = 0
        if (scores[j]["user_id"] == team1["t1"]["userid"]) {
          score = parseInt((scores[j]["score"]) * team1["t1"]["multiplicator"])
        } else if (scores[j]["user_id"] == team1["t2"]["userid"]) {
          score = parseInt((scores[j]["score"]) * team1["t2"]["multiplicator"])
        } else if (scores[j]["user_id"] == team1["t3"]["userid"]) {
          score = parseInt((scores[j]["score"]) * team1["t3"]["multiplicator"])
        }

        blue_score += score
      } else if (scores[j]["team"] == 2) {
        score = 0
        if (scores[j]["user_id"] == team2["t1"]["userid"]) {
          score = parseInt((scores[j]["score"]) * team1["t1"]["multiplicator"])
        } else if (scores[j]["user_id"] == team2["t2"]["userid"]) {
          score = parseInt((scores[j]["score"]) * team1["t2"]["multiplicator"])
        } else if (scores[j]["user_id"] == team2["t3"]["userid"]) {
          score = parseInt((scores[j]["score"]) * team1["t3"]["multiplicator"])
        }
        red_score += score

      }
    }
    ecart = 0
    if (blue_score > red_score) {
      if (i >= VARWARMUP) {
        point_blue += 1
      }
      ecart = blue_score - red_score
      blue_score = "<p style='color:green'>" + numberWithSpaces(blue_score) + "</p>" //////////////////////////////////////////////////"])//////////////////////////////////////////////////
      red_score = "<p style='color:red'>" + numberWithSpaces(red_score) + "</p>" //////////////////////////////////////////////////"])//////////////////////////////////////////////////
    } else {
      if (i >= VARWARMUP) {
        point_red += 1
      }
      ecart = red_score - blue_score
      red_score = "<p style='color:green'>" + numberWithSpaces(red_score) + "</p>"
      blue_score = "<p style='color:red'>" + numberWithSpaces(blue_score) + "</p>"
    }
    matchResult += '<td>' + blue_score + '</td>';
    matchResult += '<td>' + red_score + '</td>';
    matchResult += '<td>' + numberWithSpaces(ecart) + '</td>';

    matchResult += '</tr>';
  }
  redNamVar = red_name
  blueRedVar = blue_name
  pointBlueVar = point_blue
  pointRedVar = point_red

  mvp = "\"" + red_name + "\" " + point_red + "-" + point_blue + " \"" + blue_name + "\". </br>Au tour de "

  if (nmmap % 2 == 0) {
    if ($("#reverse")[0].checked) {
      mvp += blue_name
    } else {
      mvp += red_name
    }
  } else {
    if ($("#reverse")[0].checked) {
      mvp += red_name
    } else {
      mvp += blue_name
    }
  }
  mvp += ' de pick'
  $("#mvp").html(mvp)

  if (resets) {
    reset()
  }
  discord()
  return matchResultHEAD + matchResult
}


function construcTab(jsonMatch, resets) {
  name = jsonMatch["match"]["name"]
  maps = jsonMatch["games"]
  for (var i = 0; i < parseInt($("#warmupNumber").val()); i++) {
    //maps.shift()
  }


  // 1 = blue, 2 = red
  if (maps[0]["team_type"] == 0) {
    console.log("qualif");
    if ("qualif 1v1" == "" || true) {
      console.log("1v1");
      $("#matchTab").html(tab1v1Qualif(maps, resets))
    } else if ("qualif team" == "") {
      console.log("team");
      $("#matchTab").html(tabTeamQualif(maps, resets))
    }
  } else if (maps[0]["team_type"] == 2) {
    console.log("match");
    $("#matchTab").html(tabMatch(maps, name, resets))
  }
}


function createCommandTab(lobby) {
  lobbbyVAR = lobby;
  //lobby = "H31"
  tabHEAD = "<thead><tr><td>Commandes :</td></tr></thead>"


  team1 = team["lobby"][lobby]["1"]

  team2 = team["lobby"][lobby]["2"]


  tabHEAD += "</tr><td>!mp make LRAPO2: (" + team1 + ") vs (" + team2 + ")</td></tr>"
  tabHEAD += "<tr><td>!mp set 2 3 16</td></tr>"
  tabHEAD += "<tr><td>!mp invite " + team["teams"][team1]["captain"] + " (Important  : team bleu) </td></tr>"
  tabHEAD += "<tr><td>!mp invite " + team["teams"][team2]["captain"] + " (Important  : team red)</td></tr>"
  tabHEAD += "<tr><td>!mp host " + team["teams"][team1]["captain"] + "</td></tr>"
  tabHEAD += "<tr><td>!mp host " + team["teams"][team2]["captain"] + "</td></tr>"
  tabHEAD += "<tr><td>!mp clearhost</td></tr>"

  $("#commandsTab").html(tabHEAD)

  tab2HEAD = "<thead><tr><td>Mods :</td><td>Check</td><td>Copy/paste :</td></tr></thead>"
  mappool = team["mappools"][team["lobby"][lobby]["mappool"]]

  for (var map in mappool) {
    tab2HEAD += "<tr><td>" + map + '</td><td><input type="checkbox" class="form-check-input exampleCheck1" id=""></td>'

    tab2HEAD += "<td>"
    mod = map.substring(0, 2)
    if (mod == "NM") {
      tab2HEAD += "!mp mods NF</br>"
    } else if (mod == "NM") {
      tab2HEAD += "!mp mods NF</br>"
    } else if (mod == "HD") {
      tab2HEAD += "!mp mods HD NF</br>"
    } else if (mod == "HR") {
      tab2HEAD += "!mp mods NF HR</br>"
    } else if (mod == "DT") {
      tab2HEAD += "!mp mods NF DT</br>"
    } else {
      tab2HEAD += "!mp mods Freemod</br>"
    }

    tab2HEAD += "!mp map " + mappool[map] + " 0</td></tr>"
  }

  $("#mappoolTab").html(tab2HEAD)
  $(".exampleCheck1").click(function() {
    nmmap += 1

    mvp = "\"" + redNamVar + "\" " + pointRedVar + "-" + pointBlueVar + " \"" + blueRedVar + "\". </br>Au tour de "

    if (nmmap % 2 == 0) {
      if ($("#reverse")[0].checked) {
        mvp += blueRedVar
      } else {
        mvp += redNamVar
      }
    } else {
      if ($("#reverse")[0].checked) {
        mvp += redNamVar
      } else {
        mvp += blueRedVar
      }
    }
    mvp += ' de pick'
    $("#mvp").html(mvp)
  });
}


function createlobbylit() {
  alllobby = "<option value=\"\">Select a lobby</option>"
  for (var lobby in team["lobby"]) {
    alllobby += "<option value=\"" + lobby + "\">" + lobby + "</option>"
  }

  $("#lobbysel").html(alllobby)
}

$(document).ready(function() {
  createlobbylit()



  $("#lobbysel").change(function() {
    createCommandTab($("#lobbysel").val())
  });

  $("#RollRedTeam").change(function() {
    redRoll = $("#RollRedTeam").val()
  });

  $("#RollBlueTeam").change(function() {
    blueRoll = $("#RollBlueTeam").val()

  });
  $("#reverse").change(function() {
    mvp = "\"" + redNamVar + "\" " + pointRedVar + "-" + pointBlueVar + " \"" + blueRedVar + "\". </br>Au tour de "

    if (nmmap % 2 == 0) {
      if ($("#reverse")[0].checked) {
        mvp += blueRedVar
      } else {
        mvp += redNamVar
      }
    } else {
      if ($("#reverse")[0].checked) {
        mvp += redNamVar
      } else {
        mvp += blueRedVar
      }
    }
    mvp += ' de pick'
    $("#mvp").html(mvp)
  });



  $('#mpLink').on('paste', function() {
    var element = this;
    setTimeout(() => {
      var text = $(element).val();
      MPLINKVAR = text
      id = text.split("/")
      id = id[id.length - 1]
      getMatch(id)

    }, 100);
    setInterval(function() {
      var text = $(element).val();
      id = text.split("/")
      id = id[id.length - 1]

      getMatch(id, false)
    }, 10000);
  });
})

function reset() {
  var table = $('#matchTab').DataTable().destroy();

  table
    .clear()
    .draw();
}

function discord() {
  msg = "Remplacez les mots 'MAP_BAN' et 'NUMBER' par les bonnes valeurs à la main : </br>"
  msg += "</br>**RO16 - " + lobby + "**"
  msg += "</br>" + team["lobby"][lobby]["1"] + " | " + pointBlueVar + "-" + pointRedVar + " | " + team["lobby"][lobby]["2"]
  msg += "</br>"
  msg += "</br>**Bans :**"
  msg += "</br>**" + team["lobby"][lobby]["1"] + "** : MAP_BAN `(roll NUMBER)`"
  msg += "</br>**" + team["lobby"][lobby]["2"] + "** : MAP_BAN `(roll NUMBER)`"
  msg += "</br>MP Link : " + MPLINKVAR + ""
  msg += "<br><a href='https://discord.com/channels/773969942479503381/951601812572606525' target='_blank'>Dans ce channel</a>"
  $("#discord").html(msg)
}



var team = {
  "teams": {
    "Personne n'a d'idée en fait.": {
      "captain": "Numero_Zer0e",
      "t1": {
        "userid": 7630971,
        "username": "VROUM CV VITE",
        "multiplicator": 0.6
      },
      "t2": {
        "userid": 13607925,
        "username": "Matroc",
        "multiplicator": 0.8
      },
      "t3": {
        "userid": 13352562,
        "username": "Numero_Zer0e",
        "multiplicator": 1
      },
    },
    "TeamB": {
      "captain": "[Kaichou]",
      "t1": {
        "userid": 4141918,
        "username": "thundur",
        "multiplicator": 0.6
      },
      "t2": {
        "userid": 7898584,
        "username": "[Kaichou]",
        "multiplicator": 0.8
      },
      "t3": {
        "userid": 14951633,
        "username": "LouisD",
        "multiplicator": 1
      },
    },
    "Souci de Compétence": {
      "captain": "Crynless",
      "t1": {
        "userid": 8236827,
        "username": "Fumatsu",
        "multiplicator": 0.6
      },
      "t2": {
        "userid": 11395097,
        "username": "Kurumy",
        "multiplicator": 0.8
      },
      "t3": {
        "userid": 5850031,
        "username": "Crynless",
        "multiplicator": 1
      },
    },
    "Speed Abusers": {
      "captain": "Fuki",
      "t1": {
        "userid": 3674590,
        "username": "Sukiye",
        "multiplicator": 0.65
      },
      "t2": {
        "userid": 6567341,
        "username": "Fuki",
        "multiplicator": 0.8
      },
      "t3": {
        "userid": 9209071,
        "username": "Isillios",
        "multiplicator": 1
      },
    },
    "Team E": {
      "captain": "XeKr",
      "t1": {
        "userid": 7640581,
        "username": "Lexonox",
        "multiplicator": 0.65
      },
      "t2": {
        "userid": 11559857,
        "username": "Youlix",
        "multiplicator": 0.8
      },
      "t3": {
        "userid": 9358042,
        "username": "XeKr",
        "multiplicator": 1
      },
    },
    "AR 8 enjoyer": {
      "captain": "WesomePizza",
      "t1": {
        "userid": 10304774,
        "username": "Ilmay",
        "multiplicator": 0.7
      },
      "t2": {
        "userid": 16417954,
        "username": "WesomePizza",
        "multiplicator": 0.8
      },
      "t3": {
        "userid": 14394351,
        "username": "I4MTRUE",
        "multiplicator": 1
      },
    },
    "FlasTEH Fanclub": {
      "captain": "Hyuras",
      "t1": {
        "userid": 13579528,
        "username": "Hyuras",
        "multiplicator": 0.7
      },
      "t2": {
        "userid": 11934951,
        "username": "Osu Prop",
        "multiplicator": 0.8
      },
      "t3": {
        "userid": 11189164,
        "username": "Ryshult",
        "multiplicator": 1
      },
    },
    "4zVibe": {
      "captain": "Not Airwam",
      "t1": {
        "userid": 14309415,
        "username": "submissive",
        "multiplicator": 0.7
      },
      "t2": {
        "userid": 6402779,
        "username": "Flamiror",
        "multiplicator": 0.8
      },
      "t3": {
        "userid": 17442279,
        "username": "Not Airwam",
        "multiplicator": 1
      },
    },
    "gift issue": {
      "captain": "NeoBurgerYT",
      "t1": {
        "userid": 8769136,
        "username": "Takamin",
        "multiplicator": 0.7
      },
      "t2": {
        "userid": 12138133,
        "username": "NeoBurgerYT",
        "multiplicator": 0.8
      },
      "t3": {
        "userid": 12176990,
        "username": "Panzers",
        "multiplicator": 1
      },
    },
    "Le J c'est le S": {
      "captain": "Warex",
      "t1": {
        "userid": 10819779,
        "username": "Warex",
        "multiplicator": 0.7
      },
      "t2": {
        "userid": 9282017,
        "username": "Forw3n",
        "multiplicator": 0.8
      },
      "t3": {
        "userid": 7020512,
        "username": "Kayuzo",
        "multiplicator": 1
      },
    },
    "Mouseesport et le T3": {
      "captain": "Jaroda2000",
      "t1": {
        "userid": 4784772,
        "username": "]- Cloud -[",
        "multiplicator": 0.7
      },
      "t2": {
        "userid": 14335827,
        "username": "Gifted",
        "multiplicator": 0.8
      },
      "t3": {
        "userid": 7622802,
        "username": "Jaroda2000",
        "multiplicator": 1
      },
    },
    "Hot Wheels Acceleracers": {
      "captain": "JeeeeeeeeeeeeeJ",
      "t1": {
        "userid": 4869346,
        "username": "Afmun",
        "multiplicator": 0.7
      },
      "t2": {
        "userid": 8831121,
        "username": "JeeeeeeeeeeeeeJ",
        "multiplicator": 0.8
      },
      "t3": {
        "userid": 14363130,
        "username": "Shydio",
        "multiplicator": 1
      },
    },
    "Atsukotrobo": {
      "captain": "Foussilin",
      "t1": {
        "userid": 11934348,
        "username": "Foussilin",
        "multiplicator": 0.7
      },
      "t2": {
        "userid": 12674517,
        "username": "Fayar",
        "multiplicator": 0.8
      },
      "t3": {
        "userid": 27590609,
        "username": "Yusahira",
        "multiplicator": 1
      },
    },
    "Super Seducers": {
      "captain": "Tig",
      "t1": {
        "userid": 13935409,
        "username": "BioTyC",
        "multiplicator": 0.7
      },
      "t2": {
        "userid": 6745742,
        "username": "Tig",
        "multiplicator": 0.8
      },
      "t3": {
        "userid": 9652467,
        "username": "LeDes",
        "multiplicator": 1
      },
    },
    "Aujourd'hui on Vaz": {
      "captain": "BProd",
      "t1": {
        "userid": 11345747,
        "username": "BProd",
        "multiplicator": 0.65
      },
      "t2": {
        "userid": 3723612,
        "username": "Rulue",
        "multiplicator": 0.8
      },
      "t3": {
        "userid": 1522146,
        "username": "Aidown",
        "multiplicator": 1
      },
    },
    "TeamP": {
      "captain": "-raizen-",
      "t1": {
        "userid": 3872987,
        "username": "-raizen-",
        "multiplicator": 0.65
      },
      "t2": {
        "userid": 13682992,
        "username": "lachevre",
        "multiplicator": 0.8
      },
      "t3": {
        "userid": 4715753,
        "username": "Tarkhen",
        "multiplicator": 1
      },
    },

  },

  "lobby": {
    "RO16_1": {
      "1": "Personne n'a d'idée en fait.",
      "2": "TeamP",
      "mappool": "RO16"
    },
    "RO16_2": {
      "1": "4zVibe",
      "2": "gift issue",
      "mappool": "RO16"
    },
    "RO16_3": {
      "1": "Speed Abusers",
      "2": "Atsukotrobo",
      "mappool": "RO16"
    },
    "RO16_4": {
      "1": "Team E",
      "2": "Hot Wheels Acceleracers",
      "mappool": "RO16"
    },
    "RO16_5": {
      "1": "TeamB",
      "2": "Aujourd'hui on Vaz",
      "mappool": "RO16"
    },
    "RO16_6": {
      "1": "FlasTEH Fanclub",
      "2": "Le J c'est le S",
      "mappool": "RO16"
    },
    "RO16_7": {
      "1": "Souci de Compétence",
      "2": "Super Seducers",
      "mappool": "RO16"
    },
    "RO16_8": {
      "1": "AR 8 enjoyer",
      "2": "Mouseesport et le T3",
      "mappool": "RO16"
    }

  },
  "mappools": {
    "RO16": {
      "NM1": 2742359,
      "NM2": 3373876,
      "NM3": 2835894,
      "NM4": 2154177,
      "NM5": 2613061,
      "HD1": 3264577,
      "HD2": 52741,
      "HD3": 1515987,
      "HR1": 2297631,
      "HR2": 3356278,
      "HR3": 3029745,
      "DT1": 1939016,
      "DT2": 1860373,
      "DT3": 45076,
      "TB3": 351752,
      "TB3": 2608893,
      "TB3": 2224209
    }
  }
}
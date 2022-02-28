var TOKEN = "5c63917f55fbab478d3c69217b2493916d48c52e";
var apiResult = {}
// 
function  getMatch(id, reset){
  if(isNaN(parseInt(id))){
    alert("Merci de coller un match link valide");
    return;
  }
  if($("#reffereName").val()  != ""){
    alert("Merci de mettre un nom de ref")
    return;
  }
  else {
  $.ajax({
      method: 'POST',
      url: "https://osu.ppy.sh/api/get_match?mp=" + id + "&k=" + TOKEN,
      success: function(result) {
        apiResult["referee"] =  $("#reffereName").val()
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
        if(last == mod){
          numberMap += 1
        }
        else {
          numberMap = 1
        }
        last = "NM"
        break;
      case 1:
        mod = "NM"
        if(last == mod){
          numberMap += 1
        }
        else {
          numberMap = 1
        }
        last = "NM"
        break;
      case 8:
      case 9:
        mod = "HD"
        if(last == mod){
          numberMap += 1
        }
        else {
          numberMap = 1
        }
        last = "HD"
        break;
      case 16:
      case 17:
        mod = "HR"
        if(last == mod){
          numberMap += 1
        }
        else {
          numberMap = 1
        }
        last = "HR"
        break;
      case 64:
      case 65:
        mod = "DT"
        if(last == mod){
          numberMap += 1
        }
        else {
          numberMap = 1
        }
        last = "DT"
        break;
      default:
        mod = "wtf"
        if(last == mod){
          numberMap += 1
        }
        else {
          numberMap = 1
        }
        last = "wtf"

    }
    return [mod, last, numberMap]
}

function tab1v1Qualif(maps){
  matchResultHEAD = "<thead><tr><td>id</td><td>Mappool</td><td>Cover</td>"
  for (var i = 0; i < maps[0]["scores"].length; i++) {
    user_id = maps[0]["scores"][i]["user_id"]
    username = get_user_name(user_id)
    if(username.length>8){
      username = username.substring(0,7) + ".."
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
    matchResult += '<td>' +  i + '</td>';
    chehModsData = chekMods(parseInt(maps[i]["mods"]), numberMap, last)
    mod = chehModsData[0]
    last = chehModsData[1]
    numberMap = chehModsData[2]

        matchResult += '<td style="width : 1%;">' +  mod + " " + numberMap + '</td>';
    matchResult += '<td ><img  class="cover" src="' + map_data[1] +  '" alt=""> ' + map_data[0] + '</td>';
    for (var j = 0; j < scores.length; j++) {
      score = parseInt(scores[j]["score"])
      matchResult += '<td>' +  numberWithSpaces(score) + '</td>';
    }

    matchResult += '</tr>';
  }
if(resets){
    reset()
  }
  return matchResultHEAD + matchResult
}

function tabMatch(maps, name, resets) {
  point_red = 0
  point_blue = 0

  blue_name = name.match(/(?<=: \()(.*)(?=\) vs)/g)//("(?<=: \()(.*)(?=\) vs)")
  red_name = name.match(/(?<=vs \()(.*)(?=\))/g)

  if(blue_name.length>8){
    blue_name = blue_name.substring(0,7) + ".."
  }
  if(red_name.length>8){
    red_name = red_name.substring(0,7) + ".."
  }
  matchResultHEAD = "<thead><tr><td>id</td><td>Mappool</td><td>Cover</td>"
  matchResultHEAD += "<td>" + blue_name + " (Blue)</td><td>"+ red_name + " (Red)</td><td>Ecart</td></tr></thead>"


  matchResult = ""
  numberMap = 1
  last = "ALO"
  for (var i = 0; i < maps.length; i++) {
    map_data = gat_data_map(maps[i]["beatmap_id"])
    scores = maps[i]["scores"]

    blue_score = 0
    red_score = 0

    matchResult += '<tr>';
    matchResult += '<td style="width : 1px;">' +  i + '</td>';
    chehModsData = chekMods(parseInt(maps[i]["mods"]), numberMap, last)
    mod = chehModsData[0]
    last = chehModsData[1]
    numberMap = chehModsData[2]

    matchResult += '<td style="width : 1%;">' +  mod + '</td>';
    matchResult += '<td style="width:27%;"><img  class="cover" src="' + map_data[1] +  '" alt=""> ' + map_data[0] + '</td>';
    for (var j = 0; j < scores.length; j++) {
      if(scores[j]["team"] == 1){
        score = parseInt(scores[j]["score"])//////////////////////////////////////////////////"])//////////////////////////////////////////////////
        blue_score += score
      }
      else if (scores[j]["team"] == 2) {
        score = parseInt(scores[j]["score"])//////////////////////////////////////////////////"])//////////////////////////////////////////////////
        red_score += score

      }
    }
    ecart = 0
    if(blue_score>red_score){
      point_blue +=1
      ecart = blue_score-red_score
      blue_score = "<p style='color:green'>" + numberWithSpaces(blue_score) + "</p>"//////////////////////////////////////////////////"])//////////////////////////////////////////////////
      red_score = "<p style='color:red'>" + numberWithSpaces(red_score) + "</p>"//////////////////////////////////////////////////"])//////////////////////////////////////////////////
    }
    else{
      point_red +=1
      ecart = red_score-blue_score
        red_score = "<p style='color:green'>" + numberWithSpaces(red_score) + "</p>"
        blue_score = "<p style='color:red'>" + numberWithSpaces(blue_score) + "</p>"
    }
    matchResult += '<td>' +  blue_score + '</td>';
    matchResult += '<td>' +  red_score + '</td>';
    matchResult += '<td>' +   numberWithSpaces(ecart) + '</td>';

    matchResult += '</tr>';
  }

  if(point_red>point_blue){
    $("#mvp").html("\"" + red_name + "\" " + point_red + "-" + point_blue + " \"" + blue_name + "\" ")
  }
  else{
    $("#mvp").html("\"" + blue_name + "\" " + point_blue + "-" + point_red + " \"" + red_name + "\" ")
  }
  if(resets){
    reset()
  }
  return matchResultHEAD + matchResult
}


function construcTab(jsonMatch, resets) {
  name = jsonMatch["match"]["name"]
  maps = jsonMatch["games"]
  for (var i = 0; i <  parseInt($("#warmupNumber").val()); i++) {
    maps.shift()
  }
  for (var i = 0; i <  parseInt($("#forFunNumber").val()); i++) {
    maps.pop()
  }

  
  // 1 = blue, 2 = red
  if(maps[0]["team_type"] == 0){
    console.log("qualif");
    if("qualif 1v1" == "" || true){
      console.log("1v1");
      $("#matchTab").html(tab1v1Qualif(maps, resets))
    }

    else if("qualif team" == ""){
      console.log("team");
      $("#matchTab").html(tabTeamQualif(maps, resets))
    }
  }


  else if (maps[0]["team_type"] == 2) {
    console.log("match");
$("#matchTab").html(tabMatch(maps, name, resets))
  }
  datatables_beautify("#matchTab")
}


$(document).ready(function () {

  $('#mpLink').on('paste', function () {
        var element = this;
        setTimeout(() => {
          var text = $(element).val();
            id = text.split("/")
            id = id[id.length-1]
              getMatch(id)
        }, 100);
        setInterval(function() {
            var text = $(element).val();
            id = text.split("/")
            id = id[id.length-1]
              
              getMatch(id, true)
        }, 20000);
    });
})

function reset(){
  var table = $('#matchTab').DataTable().destroy();
 
table
    .clear()
    .draw();
  }

function datatables_beautify(name) {
  $("#matchTab").DataTable({
    aLengthMenu: [
        [25, 50, 100, 200, -1],
        [25, 50, 100, 200, "All"]
    ],
    iDisplayLength: -1
      /*"retrieve": true,
      "responsive": true,
      "deferRender": true,

      /*"columnDefs": [
        {"orderable": false,
          "targets": []},

        {"searchable": false,
          "targets": []},

        {'visible': true,
          "targets": [1,2,3,4]},

        {"targets":[0],
        "visible": false },

        /*{"targets":[0,3],
        "className": "mobile" }

      ],*/
  });//fin databale
}
// https://osu.ppy.sh/api/get_user?k=" + TOKEN + "&u=7820468
// https://a.ppy.sh/7820468

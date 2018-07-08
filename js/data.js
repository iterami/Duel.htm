'use strict';

function duel(){
    if(!can_duel){
        return;
    }

    can_duel = false;
    let healths = [
      players[0]['health-current'],
      players[1]['health-current'],
    ];
    let manas = [
      players[0]['mana-current'],
      players[1]['mana-current'],
    ];
    let output = '<ul><li>Player 0 goes first!';
    let turn_counter = 0;

    while(healths[0] > 0
      && healths[1] > 0
      && turn_counter < 100){
        for(let player in players){
            if(core_random_integer() < players[player]['health-regen%']
              && healths[player] < players[player]['health']){
                healths[player] = Math.min(
                  players[player]['health'],
                  healths[player] + 1
                );

                output += '<li>Player '
                  + player
                  + ' regenerated 1 health. '
                  + healths[player]
                  + '/'
                  + players[player]['health'];
            }

            if(healths[player] <= 0){
                output += '<li>Player '
                  + player
                  + ' lost the duel.'

                continue;
            }

            if(core_random_integer() < players[player]['mana-regen%']
              && manas[player] < players[player]['mana']){
                manas[player] = Math.min(
                  players[player]['mana'],
                  manas[player] + 1
                );

                output += '<li>Player '
                  + player
                  + ' replenished 1 mana. '
                  + manas[player]
                  + '/'
                  + players[player]['mana'];
            }

            if(core_random_integer() <= players[player]['hit%']
              && core_random_integer() >= players[1 - player]['dodge%']){
                let damage = Math.max(0, players[player]['damage'] - players[1 - player]['defense']);

                healths[1 - player] -= damage;

                output += '<li>Player '
                  + player
                  + ' hits Player '
                  + (1 - player)
                  + ' for '
                  + damage
                  + ' damage. '
                  + healths[1 - player]
                  + '/'
                  + players[1 - player]['health'];

                if(players[1 - player]['reflect'] > 0){
                    damage = Math.max(0, players[1 - player]['reflect'] - players[1 - player]['defense']);

                    healths[player] -= damage;

                    output += '<li>Player '
                      + (1 - player)
                      + ' reflects '
                      + damage
                      + ' damage to Player '
                      + player
                      + '. '
                      + healths[player]
                      + '/'
                      + players[player]['health'];
                }

            }else{
                output += '<li>Player '
                  + player
                  + ' missed.';
            }
        }

        turn_counter += 1;
    }

    if(turn_counter > 99){
        output += '<li>Tie!';
    }

    output += '</ul>';

    document.getElementById('duel').innerHTML = output;
}

function load(){
    let imported = window.prompt(
      'Input JSON for both players:',
      ''
    );
    if(imported == null
      || imported.length === 0){
        return;
    }
    players = JSON.parse(imported);

    setmode(0);
}

function reset(skip){
    if(!skip
      && !window.confirm('Reset?')){
        return;
    }

    for(let player in players){
        for(let stat in stats){
            players[player][stat] = stats[stat];
        }
    }

    setmode(0);
}

function save(){
    window.prompt(
      'Save this String:',
      JSON.stringify(players)
    );
}

function setmode(newmode){
    core_mode = newmode;

    let output = '';

    if(core_mode > 0){
        for(let player in players){
            for(let stat in stats){
                players[player][stat] = Number.parseInt(
                  document.getElementById(player + '-' + stat).value,
                  10
                );
            }
        }

        can_duel = true;

        output += '<a onclick=setmode(0)>Edit Players</a>'
          + ' | <a onclick=save()>Save</a>'
          + '<br><div class=inline>Player 0<ul>';

        for(let stat in stats){
            output += '<li><input readonly value='
              + players[0][stat]
              + '> '
              + stat;
        }

        output += '</ul></div><div class=inline>Player 1<ul>';

        for(let stat in stats){
            output += '<li><input readonly value='
              + players[1][stat]
              + '> '
              + stat;
        }

        output += '</ul></div><br><div id=duel><a onclick=duel()>Duel</a></div>';

    }else{
        output += '<a onclick=setmode(1)>Duel</a><br><div class=inline>Player 0<ul>';

        for(let stat in stats){
            output += '<li><input id="0-'
              + stat
              + '" value='
              + players[0][stat]
              + '> '
              + stat;
        }

        output += '</ul></div><div class=inline>Player 1<ul>';

        for(let stat in stats){
            output += '<li><input id="1-'
              + stat
              + '" value='
              + players[1][stat]
              + '> '
              + stat;
        }

        output += '</ul></div><br><a onclick=reset(false)>Reset</a>'
          + ' | <a onclick=load()>Load</a>';
    }

    document.getElementById('wrap').innerHTML = output;
}
'use strict';

function duel(){
    const lifes = [
      players[0]['life-current'],
      players[1]['life-current'],
    ];
    const manas = [
      players[0]['mana-current'],
      players[1]['mana-current'],
    ];
    let output = '<ul><li>' + players[0]['id'] + ' goes first!';
    let turn_counter = 0;

    while(lifes[0] > 0
      && lifes[1] > 0
      && turn_counter < 100){
        for(const player in players){
            if(core_random_integer() < players[player]['life-regen%']
              && lifes[player] < players[player]['life']){
                lifes[player] = Math.min(
                  players[player]['life'],
                  lifes[player] + 1
                );

                output += '<li>'
                  + players[player]['id']
                  + ' regenerated 1 life. '
                  + lifes[player]
                  + '/'
                  + players[player]['life'];
            }

            if(lifes[player] <= 0){
                output += '<li>' + players[player]['id'] + ' lost the duel.'

                continue;
            }

            if(core_random_integer() < players[player]['mana-regen%']
              && manas[player] < players[player]['mana']){
                manas[player] = Math.min(
                  players[player]['mana'],
                  manas[player] + 1
                );

                output += '<li>'
                  + players[player]['id']
                  + ' replenished 1 mana. '
                  + manas[player]
                  + '/'
                  + players[player]['mana'];
            }

            if(core_random_integer() <= players[player]['hit%']
              && core_random_integer() >= players[1 - player]['dodge%']){
                let damage = Math.max(0, players[player]['damage'] - players[1 - player]['defense']);

                lifes[1 - player] -= damage;

                output += '<li>'
                  + players[player]['id']
                  + ' hits '
                  + players[1 - player]['id']
                  + ' for '
                  + damage
                  + ' damage. '
                  + lifes[1 - player]
                  + '/'
                  + players[1 - player]['life'];

                if(players[1 - player]['reflect'] > 0){
                    damage = Math.max(0, players[1 - player]['reflect'] - players[1 - player]['defense']);

                    lifes[player] -= damage;

                    output += '<li>'
                      + players[1 - player]['id']
                      + ' reflects '
                      + damage
                      + ' damage to '
                      + players[player]['id']
                      + '. '
                      + lifes[player]
                      + '/'
                      + players[player]['life'];
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
    const imported = globalThis.prompt(
      'Input JSON for both players:',
      ''
    );
    if(imported === null
      || imported.length === 0){
        return;
    }
    players = JSON.parse(imported);

    setmode(0);
}

function repo_escape(){
    if(core_mode > 0){
        setmode(0);
    }
}

function repo_init(){
    core_repo_init({
      'globals': {
        'players': [
          {},
          {},
        ],
        'stats': {
          'damage': 1,
          'defense': 0,
          'dodge%': 0,
          'hit%': 100,
          'life': 10,
          'life-current': 10,
          'life-regen%': 0,
          'mana': 5,
          'mana-current': 5,
          'mana-regen%': 0,
          'reflect': 0,
        },
      },
      'keybinds': {
        'Enter': {
          'todo': function(){
              if(core_mode > 0){
                  duel();

              }else{
                  setmode(1);
              }
          },
        },
      },
      'title': 'Duel.htm',
    });

    reset(true);
    setmode(0);
}

function reset(skip){
    if(!skip
      && !globalThis.confirm('Reset both players?')){
        return;
    }

    for(const player in players){
        players[player]['id'] = 'Player ' + player;

        for(const stat in stats){
            players[player][stat] = stats[stat];
        }
    }

    setmode(0);
}

function save(){
    globalThis.prompt(
      'Save this String:',
      JSON.stringify(players)
    );
}

function setmode(newmode){
    core_mode = newmode;

    let output = '';

    if(core_mode > 0){
        for(const player in players){
            players[player]['id'] = document.getElementById(player + '-id').value;

            for(const stat in stats){
                players[player][stat] = Number.parseInt(
                  document.getElementById(player + '-' + stat).value,
                  10
                );
            }
        }

        output += '<button onclick=setmode(0) type=button>Edit Players</button>'
          + '<button onclick=duel() type=button>Start Duel</button>'
          + '<br><div class=inline><ul><li><input readonly type=text value="'
            + players[0]['id']
            + '">';

        for(const stat in stats){
            output += '<li><input readonly type=text value='
              + players[0][stat]
              + '> '
              + stat;
        }

        output += '</ul></div><div class=inline><ul><li><input readonly type=text value="'
          + players[1]['id']
          + '">';

        for(const stat in stats){
            output += '<li><input readonly type=text value='
              + players[1][stat]
              + '> '
              + stat;
        }

        output += '</ul></div><div id=duel></div>';

    }else{
        output += '<button onclick=reset(false) type=button>Reset</button>'
          + '<button onclick=save() type=button>Save</button>'
          + '<button onclick=load() type=button>Load</button>'
          + '<button onclick=setmode(1) type=button>Duel</button><br><div class=inline><ul><li><input id=0-id type=text value="'
            + players[0]['id']
            + '">';

        for(const stat in stats){
            output += '<li><input id="0-'
              + stat
              + '" value='
              + players[0][stat]
              + ' step=any type=number> '
              + stat;
        }

        output += '</ul></div><div class=inline><ul><li><input id=1-id type=text value="'
          + players[1]['id']
          + '">';

        for(const stat in stats){
            output += '<li><input id="1-'
              + stat
              + '" value='
              + players[1][stat]
              + ' step=any type=number> '
              + stat;
        }

        output += '</ul></div>';
    }

    document.getElementById('wrap').innerHTML = output;
}

'use strict';

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
          'health': 10,
          'health-current': 10,
          'health-regen%': 0,
          'hit%': 100,
          'mana': 5,
          'mana-current': 5,
          'mana-regen%': 0,
          'reflect': 0,
        },
      },
      'keybinds': {
        13: {
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

    core_html({
      'parent': document.body,
      'properties': {
        'id': 'wrap',
      },
    });

    reset(true);
    setmode(0);
}

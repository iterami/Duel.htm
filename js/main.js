'use strict';

function repo_escape(){
    if(core_mode > 0){
        setmode(0);
    }
}

function repo_init(){
    core_repo_init({
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

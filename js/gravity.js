var app={
    inicio: function(){
      ANCHO_SPRITE = 50;
      dificultad = 0;
      velocidadX = 0;
      velocidadY = 0;
      puntuacion = 0;
      
      alto  = document.documentElement.clientHeight;
      ancho = document.documentElement.clientWidth;
      
      //app.vigilaSensores();
      app.iniciaJuego();
    },
  
    iniciaJuego: function(){

      var estados = { preload: preload, create: create, update: update, render: render };
      var game = new Phaser.Game(ancho, alto, Phaser.CANVAS, 'phaser',estados);
      var aSprites;
      var fondo;
      var objeto;
      
      function preload() {
        game.load.audio('death', 'assets/death.wav');
        game.load.image('background', 'assets/fondo.jpg');
        game.load.image('burbuja', 'assets/burbuja.png');
        game.load.image('piedra', 'assets/piedra.png');
        game.load.image('gema', 'assets/gema.png');
        game.load.image('cazamariposas', 'assets/cazamariposas.gif')

        aSprites = [['burbuja',0.1, 0], ['piedra', 0.2, 250], ['gema', 0.3, 100]];

        game.input.addMoveCallback.TOUCH_OVERRIDES_MOUSE;
      }
  
      function create() {

        //  The scrolling starfield background
        fondo = game.add.tileSprite(0, 0, ancho, alto, 'background');
        fondo.moveDown();

        cazamariposas = game.add.sprite((ancho-100)/2, alto-120, 'cazamariposas');

        death = game.add.audio('death');

        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        //  Set the world (global) gravity
        game.physics.arcade.gravity.y = 75;

        var ale = app.numeroAleatorioHasta(3);
        objeto = game.add.sprite(app.inicioX(), -40, aSprites[ale][0]);

        game.physics.enable( objeto, Phaser.Physics.ARCADE);

        objeto.checkWorldBounds = true;
        objeto.body.gravity.y = aSprites[ale][2];
        objeto.events.onOutOfBounds.add(objetoOut, this);
      }
  
      function update(){
          //  Scroll the background
          fondo.tilePosition.x -= 0.4;
          if (game.input.pointer1.isDown) {
            cazamariposas.x = game.input.pointer1.x-50;
          }
      }

      function render() {
          game.debug.inputInfo(32, 32);
      }

      function objetoOut(sprite) {
        sprite.destroy();
        death.play();

        var ale = app.numeroAleatorioHasta(3);
        objeto = game.add.sprite(app.inicioX(), -40, aSprites[ale][0]);

        game.physics.enable( objeto, Phaser.Physics.ARCADE);
        
        objeto.checkWorldBounds = true;
        objeto.body.gravity.y = aSprites[ale][2];
        objeto.events.onOutOfBounds.add(objetoOut, this);

        cazamariposas.bringToTop();
      }

      function moveCazamariposas() {
        game.physics.arcade.moveToPointer(cazamariposas, 100);
      }
  
    },
  
    decrementaPuntuacion: function(){
      puntuacion = puntuacion-1;
      scoreText.text = puntuacion;
    },
  
    incrementaPuntuacion1: function(){
      puntuacion = puntuacion+1;
      scoreText.text = puntuacion;
  
      objetivo.body.x = app.inicioX();
      objetivo.body.y = app.inicioY();
  
      if (puntuacion > 0){
        dificultad = dificultad + 1;
      }
    },
  
    incrementaPuntuacion10: function(){
      puntuacion = puntuacion+10;
      scoreText.text = puntuacion;
  
      objetivo10.body.x = app.inicioX();
      objetivo10.body.y = app.inicioY();
  
      if (puntuacion > 0){
        dificultad = dificultad + 2;
      }
    },
  
    inicioX: function(){
      return app.numeroAleatorioHasta(ancho - ANCHO_SPRITE );
    },
  
    numeroAleatorioHasta: function(limite){
      return Math.floor(Math.random() * limite);
    }
  
  };
  
  if ('addEventListener' in document) {
      document.addEventListener('deviceready', function() {
          app.inicio();
      }, false);
  }
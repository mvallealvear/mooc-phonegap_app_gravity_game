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

      var estados = { preload: preload, create: create, update: update };
      var game = new Phaser.Game(ancho, alto, Phaser.CANVAS, 'phaser',estados);
      var aSprites;
      var fondo;
      var objeto;
      
      function preload() {
        game.load.image('background', 'assets/fondo.jpg');
        game.load.image('burbuja', 'assets/burbuja.png');
        game.load.image('piedra', 'assets/piedra.png');
        game.load.image('gema', 'assets/gema.png');

        aSprites = [['burbuja',0.1, 0], ['piedra', 0.2, 250], ['gema', 0.3, 100]];
      }
  
      function create() {

        //  The scrolling starfield background
        fondo = game.add.tileSprite(0, 0, ancho, alto, 'background');
        fondo.moveDown();
        
        game.stage.backgroundColor = '#fff';

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
      }

      function objetoOut(sprite) {
        //  Move the alien to the top of the screen again
        sprite.destroy();

        var ale = app.numeroAleatorioHasta(3);
        objeto = game.add.sprite(app.inicioX(), -40, aSprites[ale][0]);

        game.physics.enable( objeto, Phaser.Physics.ARCADE);
        
        objeto.checkWorldBounds = true;
        objeto.body.gravity.y = aSprites[ale][2];
        objeto.events.onOutOfBounds.add(objetoOut, this);
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
  
    inicioY: function(){
      return app.numeroAleatorioHasta(alto - ANCHO_SPRITE );
    },
  
    numeroAleatorioHasta: function(limite){
      return Math.floor(Math.random() * limite);
    },
  
    vigilaSensores: function(){
      
      function onError() {
          console.log('onError!');
      }
  
      function onSuccess(datosAceleracion){
        app.detectaAgitacion(datosAceleracion);
        app.registraDireccion(datosAceleracion);
      }
  
      navigator.accelerometer.watchAcceleration(onSuccess, onError,{ frequency: 10 });
    },
  
    detectaAgitacion: function(datosAceleracion){
      var agitacionX = datosAceleracion.x > 10;
      var agitacionY = datosAceleracion.y > 10;
  
      if (agitacionX || agitacionY){
        setTimeout(app.recomienza, 1000);
      }
    },
  
    recomienza: function(){
      document.location.reload(true);
    },
  
    registraDireccion: function(datosAceleracion){
      velocidadX = datosAceleracion.x ;
      velocidadY = datosAceleracion.y ;
    }
  
  };
  
  if ('addEventListener' in document) {
      document.addEventListener('deviceready', function() {
          app.inicio();
      }, false);
  }
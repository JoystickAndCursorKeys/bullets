class GameLevel {

  constructor(game) {
    this.game = game;
    this.endFlag = false;
    this.endType = undefined;
    this.PI180 = (Math.PI / 180);


  }

  ended() {
    return this.endFlag;
  }

  getEndType() {
    return this.endType;
  }

  init() {

    this.width = this.game.width;
    this.height = this.game.height;

    this.endFlag = false;
    this.endType = undefined;

    this.left = false;
    this.right = false;
    this.up = false;
    this.down = false;

    this.lastDirection = null;

    this.playerDamage = 25;
    this.playerDamageIncrease = 20;

    this.spriteTypes = [];
    var st = this.spriteTypes;

    st['player'] = {
      type: 'player',
      health: undefined,
      size: undefined,
      colliding: true,
      next: null,
      bound: 'wrap',
      image: this.game.res_running0,
      anim: {
        play: false, speed: 0
      }
    };

    st['enemy1'] = {
      type: 'enemy',
      health: undefined,
      size: undefined,
      colliding: true,
      next: null,
      bound: 'wrap',
      image: this.game.res_running1,
      anim: {
        play: false, speed: 0
      }
    };

    st['enemy2'] = {
      type: 'enemy',
      health: undefined,
      size: undefined,
      colliding: true,
      next: null,
      bound: 'wrap',
      image: this.game.res_running2,
      anim: {
        play: false, speed: 0
      }
    };

    st['enemy3'] = {
      type: 'enemy',
      health: undefined,
      size: undefined,
      colliding: true,
      next: null,
      bound: 'wrap',
      image: this.game.res_running3,
      anim: {
        play: false, speed: 0
      }
    };

    st['enemy4'] = {
      type: 'enemy',
      health: undefined,
      size: undefined,
      colliding: true,
      next: null,
      bound: 'wrap',
      image: this.game.res_running4,
      anim: {
        play: false, speed: 0
      }
    };


    st['shadow'] = {
      type: 'shadow',
      health: undefined,
      size: undefined,
      colliding: false,
      next: null,
      bound: 'wrap',
      image: this.game.res_running_shadow,
      anim: {
        play: false, speed: 0
      }
    };

    st['bullet'] = {
      type: 'bullet',
      health: undefined,
      size: undefined,
      colliding: true,
      next: null,
      bound: 'disappear',
      image: this.game.res_bullet,
      anim: null
    };

    st['parachute'] = {
      type: 'parachute',
      health: undefined,
      size: undefined,
      colliding: false,
      next: null,
      bound: 'disappear',
      image: this.game.res_parachute,
      anim: null
    };

    st['parachutelanded'] = {
      type: 'parachute-landed',
      health: undefined,
      size: undefined,
      colliding: false,
      next: null,
      bound: 'disappear',
      image: this.game.res_parachute_landed,
      anim: null
    };

    st['parachuteshadow'] = {
      type: 'parachute',
      health: undefined,
      size: undefined,
      colliding: false,
      next: null,
      bound: 'disappear',
      image: this.game.res_parachuteshadow,
      anim: null
    };

    st['heliframe'] = {
      type: 'helicopter',
      health: undefined,
      size: undefined,
      colliding: false,
      next: null,
      bound: 'disappear',
      image: this.game.res_heliframe,
      anim: null
    };

    st['heliframeshadow'] = {
      type: 'helicopter',
      health: undefined,
      size: undefined,
      colliding: false,
      next: null,
      bound: 'disappear',
      image: this.game.res_heliframeshadow,
      anim: null
    };

    st['heliblades'] = {
      type: 'helicopter',
      health: undefined,
      size: undefined,
      colliding: false,
      next: null,
      bound: 'disappear',
      image: this.game.res_heliblades,
      anim: null
    };

    st['enemybullet'] = {
      type: 'enemybullet',
      health: undefined,
      size: undefined,
      colliding: true,
      next: null,
      bound: 'disappear',
      image: this.game.res_bullet,
      anim: null
    };

    this.frontsprites = new SpriteMover();
    this.sprites = new SpriteMover();
    this.shadows = new SpriteMover();


    this.panic = 0;

    for (var i = 0; i < 1; i++) {
      var ex = (Math.random() * this.width);
      var ey = (Math.random() * this.height);

      var spritenr = Math.floor(Math.random() * 4) + 1;
      console.log(spritenr);
      var enemy = this.addSprite('enemy' + spritenr, ex, ey, .1, .1, this.sprites);
      var enemyShadow = this.addSprite('shadow', 10 + ex, 10 + ey, .1, .1, this.shadows);
      enemyShadow.linkPos(enemy, 10, 10);
      enemyShadow.linkAnim(enemy);

      enemy.getData().targetX = this.width/2;
      enemy.getData().targetY = this.height/2;
      enemy.getData().targetClock = 100;
    }


    this.updateLists();

    var levelMod = (this.lCounter) % 4;

    console.log( this.game.width );
    console.log( this.game.height );
    var blockImg = new BlockImage( this.game.width, this.game.height );
    this.res_ground  = blockImg;
    this.res_ground_ctx   = blockImg.getContext();
    this.res_ground_cvs   = blockImg.getCanvas();

    var gh = this.game.res_ground_tiles.gridh;
    var gw = this.game.res_ground_tiles.gridw;
    var cols = Math.ceil( this.width / gw );
    var rows = Math.ceil( this.height / gh );
    for( var c=0; c<cols; c++) {
      for( var r=0; r<rows; r++) {
        this.game.res_ground_tiles.drawTile(
            this.res_ground_ctx,
            c *gw,
            r *gh,
            0
        );
      }
    }

  }


  updateLists() {
    this.enemies = this.sprites.getSprites("enemy");
  }


  playerInit() {

    console.log("playerInit");

    this.playerDamage = 0;
    this.input = {
      left: false,
      right: false,
      up: false,
      down: false,
      fire: false,
      end: false
    };

    this.lastDirection = 'right';
    this.iAngle = 0;
    this.speed = 0;
    this.endFlag = false;




  }

  playSound(snd) {
    snd.pause();
    snd.currentTime = 0;
    snd.play();
  }

  stopSound(snd) {
    snd.pause();
  }


  directionToIAngleTravel(left, right, up, down) {
    var aUp = 0;
    var aRight = 4;
    var aLeft = 12;
    var aDown = 8;
    var aUpRight = 2;
    var aDownRight = 6;
    var aDownLeft = 10;
    var aUpLeft = 14;
    var travel = 0;
    var iAngle = 0;

    travel = 0;
    if (right) {
      iAngle = aRight;

      if (up) {
        iAngle = aUpRight;
      } else if (down) {
        iAngle = aDownRight;
      }
      travel = 1;
    } else if (left) {
      iAngle = aLeft;

      if (up) {
        iAngle = aUpLeft;
      } else if (down) {
        iAngle = aDownLeft;
      }
      travel = 1;
    } else if (up) {
      iAngle = aUp;
      travel = 1;
    } else if (down) {
      iAngle = aDown;
      travel = 1;
    }

    return [iAngle, travel];
  }


  playHandleInput() {

    var input = this.input;
    var dx = 0;
    var dy = 0;
    var walkSpeed = 5;


    //console.log( "handleInput");
    if (input.end) {
      this.endFlag = true;
      this.endType = 'interupted';
      this.game.lives = 0;
      console.log("endFlag!");
      return;
    }

    this.lastSpeed = this.speed;
    this.lastiAngle = this.iAngle;

    if (input.left || input.right || input.up || input.down) {
      var at = this.directionToIAngleTravel(input.left, input.right, input.up, input.down);
      this.iAngle = at[0];
      this.speed = at[1] * walkSpeed;
    } else {
      this.speed = 0;
    }

    if (this.speed != 0) {
      if (this.lastSpeed != this.speed || this.lastiAngle != this.iAngle) {
        this.player.setFrameRange(this.iAngle * 4, (this.iAngle * 4) + 3);
        this.player.setCycleFrameRate(.2);
        this.player.playAnim();
      }
    } else {
      this.player.setFrame(this.iAngle * 4);
    }


    if (input.fire) {

      console.log("fire!!" + this.lastDirection);

      var bullet = this.addSprite('bullet', this.player.x, this.player.y, -1, -1, this.sprites);

      var rad = this.iAngleToRad(this.iAngle);
      var dx = Math.sin(rad) * 10;
      var dy = Math.cos(rad) * 10;
      bullet.addXY(dx, dy);
      bullet.setDXDY(dx, dy);

      this.game.res_audioShoot.volume = 1;
      this.playSound(this.game.res_audioShoot);

    }
  }


  /*
  the "cutscene" for when a level is completed
  */

  completedScene() {
    this.nextLevelCounter = 250;
    this.endFlag = false;

  }

  completedSceneHandle(evt) {
    this.playHandle(evt);
  }


  completedSceneRun() {

    this.playHandleInput();
    this.input.fire = false;


    this.playRunProcessor();

    this.nextLevelCounter--;
    if (this.nextLevelCounter > 0) {
      return false;
    }

    return "next";
  }

  completedSceneRender(context) {
    this.playRender(context);

    var shortCounter = Math.ceil(this.nextLevelCounter / 10);
    var str = 'WARP IN: ' + shortCounter;
    var x = this.game.res_font2.centerX(str, this.width);
    this.game.res_font2.drawString(context, x, 250, str);

  }

  /*
  the "cutscene" for when a player starts
  */

  startScene( statelett ) {

    if( statelett == 'INIT' ) {
      this.endFlag = false;

      this.heli = this.addSprite('heliframe',
          0, 100,
          5, 0,
          this.sprites);

      this.heli = this.addSprite('heliframeshadow',
          150, 250,
          5, 0,
          this.shadows);

      this.heliblades = this.addSprite('heliblades',
          70, 100,
          5, 0,
          this.frontsprites);

      this.heliblades.setRotateIncrease(1);
      this.parachute = null;

    }

  }

  startSceneRun() {


    this.playRunProcessor2(false);

    if( !this.heli.active ) {
        return "next";
    }

    if( !this.parachute ) {
      if( this.heli.x>300) {
        this.parachute = this.addSprite('parachute',
            this.heli.x-50, this.heli.y-50,
            2, 2,
            this.sprites);

        this.parachute.setScaleFactor(.995);
        this.parachute.setRotateIncrease(.01);

        this.parachuteshadow = this.addSprite('parachuteshadow',
            0, 0,
            0, 0,
            this.shadows);

        this.parachuteshadow.linkPos(this.parachute, 150, 150);
        this.parachuteshadow.setLinkXoYoFactor(0.98);


      }
    }
    else  {
      if( this.parachute != "done") {
      if( this.parachute.effects.scale < .5 ) {
        var player = this.addSprite('player',
            this.parachute.x, this.parachute.y,
              .1, .1, this.sprites);


        this.player = player;

        var shadow = this.addSprite('shadow', 10 + this.width / 2, 10 + this.height / 2, .1, .1, this.shadows);
        this.shadow = shadow;
        shadow.linkPos(player, 10, 10);
        shadow.linkAnim(player);

        this.player.setFrame(this.iAngle);
        this.player.resetEffects();

        this.shadow.setFrame(this.iAngle);
        this.shadow.resetEffects();



        //this.landed = this.addSprite('parachutelanded',
        //    this.parachute.x, this.parachute.y,
        //      .1, .1, this.sprites);


        //this.landed.draw( this.res_ground_ctx );
        //this.landed.deactivate();
        this.parachute.setFadeFactor(.98);
        //this.parachute.setDXDY(0,0);
        this.parachute.adjustScaleFactor(1.01);
        //this.parachute.deactivate();
        this.parachuteshadow.deactivate();
        this.parachute = "done";




        return "next";
      }
      else { //parachute still in the air
        //this.parachuteshadow.factorLinkXoYo(.98);
      }
      }
    }


    return false;

  }

  startSceneRender(context) {
    this.playRender(context);

  }



  /*
  the "cutscene" for when a player dies
  */
  dieScene() {

    this.dieCounter = 75;
    this.endFlag = false;

    //this.player.setFadeFactor(.991);
    //this.player.setScaleFactor( .91 );

    this.playSound(this.game.audioDestroy);

    var xoff;
    var yoff;
    var dx;
    var dy;

    for (var i = 0; i < 10; i++) {

      xoff = (Math.random() * 50) - 25;
      yoff = (Math.random() * 50) - 25;
      dx = xoff / 5;
      dy = yoff / 5;

      var explosion =
        this.addSprite('explosion',
          Math.round(this.player.x + xoff),
          Math.round(this.player.y + yoff), -1, -1);

      explosion.addXY(dx * 2, dy * 2);
      explosion.setDXDY(dx, dy);
      explosion.setFadeFactor(.98);

    }

    xoff = 0;
    yoff = 0;
    dx = 0;
    dy = 0;

    var explosion =
      this.addSprite('scatter',
        Math.round(this.player.x + xoff),
        Math.round(this.player.y + yoff), -1, -1);

    //explosion.addXY( dx*2, dy*2);
    explosion.setDXDY(dx, dy);
    explosion.setFadeFactor(.97);
    explosion.setScaleFactor(1.01);

  }

  dieSceneRender(context) {
    this.playRender(context);
  }


  dieSceneRun() {
    /*
        this.dieCounter --;
        if( this.dieCounter<=0) {
          return 'next';
        }

        this.iAngle+=4;
        if( this.iAngle >89) { this.iAngle = 0; }
        this.player.setFrame( this.iAngle );

        var rad = this.degrees_to_radians( this.iAngle * 4);
        this.speed *= .9;
        var dx = Math.sin( rad ) * this.speed;
        var dy = Math.cos( rad ) * this.speed;
        this.player.setDXDY( dx, dy );

        this.sprites.move();
        this.sprites.animate();

        return false;
        */
  }


  /* Run Level */
  playHandle(evt) {

    var input = this.input;
    input.fire = false;
    input.end = false;

    if (evt.type == 'keyup' && evt.key == 'Escape') {
      input.end = true;
    } else if (evt.type == 'keyup' && evt.key == 'z') {
      input.fire = true;
    } else if (evt.type == 'keyup' && evt.key == ' ') {
      input.fire = true;
    }

    if (evt.type == 'keydown' && evt.key == 'ArrowLeft') {
      input.left = true;
    } else if (evt.type == 'keyup' && evt.key == 'ArrowLeft') {
      input.left = false;
    }

    if (evt.type == 'keydown' && evt.key == 'ArrowRight') {
      input.right = true;
    } else if (evt.type == 'keyup' && evt.key == 'ArrowRight') {
      input.right = false;
    }

    if (evt.type == 'keydown' && evt.key == 'ArrowDown') {
      input.down = true;
    } else if (evt.type == 'keyup' && evt.key == 'ArrowDown') {
      input.down = false;
    }

    if (evt.type == 'keydown' && evt.key == 'ArrowUp') {
      input.up = true;
    } else if (evt.type == 'keyup' && evt.key == 'ArrowUp') {
      input.up = false;
    }

  }

  play(action, data) {
    if (action == "INIT") {
      console.log("play.init");
    }
  }

  playRun() {

    if (this.ended()) {
      //this.endType = this.level.getEndType();
      return this.endType;
    }

    this.playHandleInput();
    this.input.fire = false;

    this.playRunProcessor();

    return false;
  }


  playRender(context) {
    this.render(context);
  }


  playRunProcessor() {
    this.playRunProcessor2(true);
  }



  degrees_to_radians(degrees) {
    var pi = Math.PI;
    return degrees * (pi / 180);
  }


  iAngleToRad(ia) {

    return (180 - (ia * 22.5)) * this.PI180;

  }

  playRunProcessor2(normal) {

    var rad = this.iAngleToRad(this.iAngle);
    var dx = Math.sin(rad) * this.speed;
    var dy = Math.cos(rad) * this.speed;

    if( this.player ) {


    this.player.setDXDY(dx, dy);

    var input = this.input;
    if (!(input.left || input.right || input.up || input.down)) {
      this.speed *= .9;
      var dx = Math.sin(rad) * this.speed;
      var dy = Math.cos(rad) * this.speed;
      this.player.setDXDY(dx, dy);

    }

    var arr = this.enemies;
    var i;
    for (i = 0; i < arr.length; i = i + 1) {
      var sprite = arr[i];
      var fire = false;

      var targetX, targetY;
      sprite.targetClock--;
      if (sprite.targetClock > 0) {
        targetX = sprite.getData().targetX;
        targetY = sprite.getData().targetY;
      } else {
        sprite.targetClock = 100 + (Math.random() * 100);
        sprite.getData().targetX = this.player.x + ((Math.random() * 400) - 200);
        sprite.getData().targetY = this.player.y + ((Math.random() * 400) - 200);
        targetX = sprite.getData().targetX;
        targetY = sprite.getData().targetY;

        console.log("change direction!!" + this.lastDirection);

      }


      var newdx = (targetX - sprite.x);
      var newdy = (targetY - sprite.y);

      var old_dxdy = sprite.getDXDY();

      if (Math.abs(newdx) < 10) {
        newdx = 0;
      } else if (newdx < 0) {
        newdx = -1;
      } else if (newdx > 0) {
        newdx = 1;
      }

      if (Math.abs(newdy) < 10) {
        newdy = 0;
      } else if (newdy < 0) {
        newdy = -1;
      } else if (newdy > 0) {
        newdy = 1;
      }

      var at = this.directionToIAngleTravel(newdx < 0, newdx > 0, newdy < 0, newdy > 0);
      var iAngle = at[0];
      var travel = at[1];


      if ((Math.random() * 5000 > 4900) && travel) {
        fire = true;
        fire = false;
      }
      if (fire) {
        var bullet = this.addSprite('enemybullet', sprite.x, sprite.y, 0, 0, this.sprites );

        console.log("enemy fire "+ newdx + "," +newdy);
        bullet.addXY(newdx * 10, newdy * 10);
        bullet.setDXDY(newdx * 5, newdy * 5);

        this.game.res_audioShoot2.volume = .2;
        this.playSound(this.game.res_audioShoot2);
      }


      var speed = .2 + (1 * (this.panic));


      if (travel > 0 && (old_dxdy[0] != (newdx * speed) || old_dxdy[1] != (newdy * speed))) {

        sprite.setFrameRange(iAngle * 4, (iAngle * 4) + 3);
        sprite.setCycleFrameRate(.2);
        sprite.playAnim();

      }


      sprite.setDXDY(newdx * speed, newdy * speed);
    }

    }
    this.sprites.move();
    this.frontsprites.move();
    this.shadows.move();

    if (normal) {

      this.collide();
    }
    this.sprites.animate();
    this.frontsprites.animate();
    this.shadows.animate();

  }

  collide() {

    var c = this.sprites.detectColissions();
    if (c.length > 0) {

      for (var i = 0; i < c.length; i++) {

        var collision = this.sortCollistion(c[i]);

        var a = collision[0];
        var b = collision[1];

        if (a.type == 'bullet' && b.type == 'enemy') {
          console.log("boom!!" + this.lastDirection);

          var shadowArr = this.shadows.getLinkedSprites( b );
          var shadow = shadowArr[ 0 ];
          var skullcvs = this.game.res_skull_cvs;
          var bgctx = this.game.res_ground_plaindirt_ctx;

          var xy=b.getXY();
          bgctx.drawImage(
            skullcvs,
            (xy[0]  )- (skullcvs.width/2),
            (xy[1]  )- (skullcvs.height/2)
          );

          b.deactivate();
          shadow.deactivate();
          this.updateLists();

          this.game.score += a.data.score;

          if( !this.panic ) {
            this.panic=1;
          }
          else {
            this.panic = this.panic + .1;
          }

          this.playSound(this.game.res_audioEnemyHit);


        }
        if (a.type == 'enemybullet' && b.type == 'player') {
          console.log("boom!!" + this.lastDirection);

          //var shadowArr = this.shadows.getLinkedSprites( b );
          //var shadow = shadowArr[ 0 ];

          //this.player.deactivate();
          //this.shadow.deactivate();

          //todo player dead, stop controls, etc..
        }

      }
    }
  }

  countSprites(type) {
    return this.sprites.countSprites(type);
  }

  sortCollistion(c) {
    var a, b;
    a = c[0];
    b = c[1];

    if (a.type > b.type) {
      return [b, a];
    }

    return [a, b];
  }

  playSound(snd) {
    snd.pause();
    //var x = snd.playbackRate;
    //snd.playbackRate = .25;
    snd.currentTime = 0;
    snd.play();
  }


  drawBar(context, y) {

    var w = this.game.res_bar1.width;
    var x = Math.round((this.width / 2) - (w / 2));

    var w1 = Math.round((this.playerDamage / 100) * w);
    var w2 = w - w1;

    context.drawImage(this.game.res_bar1, x, y);
    context.drawImage(this.game.res_bar2, w1, 0, w2, this.game.res_bar2.height, x + w1, y, w2, this.game.res_bar2.height);

  }



  render(context) {


    context.drawImage(
      this.res_ground_cvs,
      0, 0,
      this.width, this.height
    );

    this.shadows.render(context);
    this.sprites.render(context);
    this.frontsprites.render(context);

  }

  addSprite(id, x, y, dx, dy, sprites) {

    var def = this.spriteTypes[id];

    var sprite = new Sprite(def.image, x, y);
    sprite.setType(def.type);
    sprite.setColliding(def.colliding);

    var animSpeed = null;
    if (def.anim != null) {
      animSpeed = def.anim.speed;
    }

    sprite.setData({
      animSpeed: animSpeed,
      health: def.health,
      size: def.size,
      next: def.next,
      score: def.score,
      subType1: def.subtype1,
      subType2: def.subtype2
    });

    sprites.addSprite(sprite);

    sprite.activate();
    sprite.setDXDY(dx, dy);

    var img = sprite.spriteImage;
    if (def.bound != null) {

      sprite.setBoundary(-img.w, -img.h, this.width + img.w, this.height + img.h);

      if (def.bound == 'wrap') {
        sprite.setBoundaryActionWrap();
      } else if (def.bound == 'disappear') {
        sprite.setBoundaryActionDisappear();
      }

    }

    if (def.anim != null) {
      if (def.anim.play) {
        sprite.setFrameRange(def.anim.range[0], def.anim.range[1]);
        sprite.setCycleFrameRate(def.anim.speed);
        sprite.playAnim();
      } else {
        sprite.setFrameRange(0, 0);
        sprite.setCycleFrameRate(0);
        sprite.pauseAnim();
      }
    }

    return sprite;
  }


}

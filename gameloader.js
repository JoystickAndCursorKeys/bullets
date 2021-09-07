class GameLoader {

  constructor ( game, level ) {
    this.game = game;
    this.level = level;
    this.data = [];


    this.collisBoxRes = {
      xGranularity: 8,
      yGranularity: 8
    }
  }


  /* Resources */

  gameGetResources() {

    var pictures = [];
    var id;
    var bgColor, bgColor1, bgColor2, bgColor3, bgColor4, bgColor5;

    bgColor = {r:253, g:67, b:251};
    bgColor1 = {r:234, g:93, b:236};
    bgColor2 = {r:225, g:25, b:255};
    bgColor3 = {r:217, g:215, b:178};
    bgColor4 = {r:236, g:93, b:187};
    bgColor5 = {r:49, g:231, b:43};

    bgColor = {r:253, g:67, b:251};
    id = 'res_running0';
    pictures[ id ]= 'res/anim/' + id.substring(4) + '.bmp';
    this.data[ id ]={  type: 'spriteanim',   w:40, h:40, bg: bgColor };

    bgColor = {r:234, g:93, b:236};
    id = 'res_running1';
    pictures[ id ]= 'res/anim/' + id.substring(4) + '.bmp';
    this.data[ id ]={  type: 'spriteanim',   w:40, h:40, bg: bgColor };

    bgColor = { r:236, g:93, b:220};
    id = 'res_running2';
    pictures[ id ]= 'res/anim/' + id.substring(4) + '.bmp';
    this.data[ id ]={  type: 'spriteanim',   w:40, h:40, bg: bgColor };

    bgColor = {r:217, g:215, b:178};
    id = 'res_running3';
    pictures[ id ]= 'res/anim/' + id.substring(4) + '.bmp';
    this.data[ id ]={  type: 'spriteanim',   w:40, h:40, bg: bgColor };

    bgColor = {r:236, g:93, b:187};
    id = 'res_running4';
    pictures[ id ]= 'res/anim/' + id.substring(4) + '.bmp';
    this.data[ id ]={  type: 'spriteanim',   w:40, h:40, bg: bgColor4 };


    bgColor = {r:253, g:67, b:251};
    id = 'res_running_shadow';
    pictures[ id ]= 'res/anim/' + id.substring(4) + '.bmp';
    this.data[ id ]={  type: 'spriteanim',   w:40, h:40, bg: bgColor };

    id='res_bullet';
    pictures[id]= 'res/gfx/' + id.substring(4) + '.bmp';
    this.data[ id ]={ type: 'spriteimage',  bg: bgColor2 };

    id='res_skull';
    pictures[id]= 'res/gfx/skull.png';
    this.data[ id ]={ type: 'spriteimage', bg: bgColor5 };

    id='res_ground_tiles';
    pictures[id]= 'res/gfx/tiles/tiles.png';
    this.data[ id ]={ type: 'tiles', w:256, h:256, bg: null };

    //id='res_ground_plaindirt';
    //pictures[id]= 'res/gfx/ground-plaindirt.png';
    //this.data[ id ]={ type: 'background-scale' };

    id='res_font1';
    pictures[id]= 'res/font/sunset_medium1_36x45.png';
    this.data[ id ]= { type: 'font',  w:36, h:45, bg: {r:0, g:0, b:0} };

    id='res_font2';
    pictures[id]= 'res/font/neon1_small_15x15.png';
    this.data[ id ]={ type: 'font',  w:15, h:15, bg: {r:0, g:0, b:0} };

    id='res_font3';
    pictures[id]= 'res/font/greendawn_medium1_36x45.png';
    this.data[ id ]={ type: 'font',  w:36, h:45, bg: {r:0, g:0, b:0} };


    var audio = [];
    audio['shoot'] = 'res/sfx/cannon4.wav';
    audio['shoot2'] = 'res/sfx/cannon4.wav';
    audio['enemyhit'] = 'res/sfx/hit-arg3.wav';

    return {  imgSrcArray: pictures, audioSrcArray: audio } ;


  }

  levelGetResources() {
    var pictures = [];
//    pictures['bg1.level']= "res/img/bg/bg1.png";

    return { imgSrcArray: pictures };
  }

  handleDynamicLoadedResources( loadedResources ) {
    var imgarr = loadedResources.imgArray;

    var pic;
    var rd;

    for (const id in imgarr) {
        console.log(`imgArray::${id}: ${imgarr[id]}`);


        pic = imgarr[ id ];
        rd = this.data[ id ];

        if( rd.type == 'spriteanim' ) {

          this.game[id] = new SpriteAnim( pic , rd.w, rd.h, rd.bg,
              this.collisBoxRes
            );
        }
        else if( rd.type == 'spriteimage' ) {


          var si = new SpriteImage( pic , rd.bg,
              this.collisBoxRes );

          this.game[id]   = si;
          this.game[id + "_cvs"]   = si.getCanvas();

        }
        else if( rd.type == 'font' ) {

          this.game[id]   = new BlockFont(
              pic,
              rd.w, rd.h, rd.bg
            );
        }
        else if( rd.type == 'tiles' ) {
          this.game[id]   = new Tiles(
              pic,
              rd.w, rd.h, rd.bg
            );
        }
        else if( rd.type == 'background-scale' ) {

          var blockImg = new BlockImage( pic );
          blockImg.pixelResize( this.game.width, this.game.height );
          this.game[id]   = blockImg;
          this.game[id + "_ctx"]   = blockImg.getContext();
          this.game[id + "_cvs"]   = blockImg.getCanvas();

        }
    }
  }

  signalResourcesLoaded( loadedResources, stateName  ) {
    console.log( "game/level loaded now state:" + stateName);

    var imgarr = loadedResources.imgArray;

    if( stateName == 'load' ) {

      this.handleDynamicLoadedResources(  loadedResources );

      this.game.res_audioShoot = loadedResources.audioArray['shoot'];
      this.game.res_audioShoot2 = loadedResources.audioArray['shoot2'];
      this.game.res_audioEnemyHit = loadedResources.audioArray['enemyhit'];

    }
    if( stateName == 'loadLevel' ) {
/*      this.level.bg1  = loadedResources.imgArray['bg1.level'];
      this.level.bg2  = loadedResources.imgArray['bg2.level'];
      this.level.bg3  = loadedResources.imgArray['bg3.level'];
      this.level.bg4  = loadedResources.imgArray['bg4.level'];
*/
    }
  }


}

enchant();


window.onload = function(){
  var winSize = [960,640];
  var game = new Core(winSize[0],winSize[1]);
  var gameOverOnce = 0;
  game.fps = 60;
  game.preload("ball.png","block.png","board.png");

  var ball,player;
  var blocks = [];
  var socket = io();

  var shotBlocks = 0;
  // var maxBlocks = 4;
  var maxBlocks = 2*2*20;
  var remainBlocks = maxBlocks;

  var deads = 0;
  var clears = 0;

  var blockX = 47;
  var blockY = 55;

  game.onload = function(){

    var time_label = new Label();
    time_label.color = '#fff';
    time_label.x = 20;
    time_label.y = 620;
    time_label.addEventListener(enchant.Event.ENTER_FRAME, function(){
      this.text = hhmmss();
    });
    game.rootScene.addChild(time_label);

    var blocksLabel = new Label();
    blocksLabel.color = '#fff';
    blocksLabel.x = 100;
    blocksLabel.y = 620;
    blocksLabel.addEventListener(enchant.Event.ENTER_FRAME, function(){
      this.text = 'Blocks: '+shotBlocks+'/'+maxBlocks;
    });
    game.rootScene.addChild(blocksLabel);

    var deadsLabel = new Label();
    deadsLabel.color = '#fff';
    deadsLabel.x = 250;
    deadsLabel.y = 620;
    deadsLabel.addEventListener(enchant.Event.ENTER_FRAME, function(){
      this.text = 'Deads: '+ deads;
    });
    game.rootScene.addChild(deadsLabel);

    var clearsLabel = new Label();
    clearsLabel.color = '#fff';
    clearsLabel.x = 370;
    clearsLabel.y = 620;
    clearsLabel.addEventListener(enchant.Event.ENTER_FRAME, function(){
      this.text = 'Clears: '+ clears;
    });
    game.rootScene.addChild(clearsLabel);

    var Ball = enchant.Class.create(enchant.Sprite, {
      initialize: function(x, y) {
        enchant.Sprite.call(this, 6, 6);
        this.x = x;
        this.y = y;
        this.vel = [3,3];
        this.scale(1,1);
        this.image = game.assets['ball.png'];
        game.rootScene.addChild(this);
        this.addEventListener('enterframe', function() {
          this.move();
          this.collision();

        });
      },
      move:function(){
        this.x += this.vel[0];
        this.y += this.vel[1];
      },

      //当たり判定
      collision:function(){
        if(this.intersect(player)) {
          this.vel[1] *= -1;
        }

        if(this.x < 0 || this.x > winSize[0]){
          this.vel[0] *= -1;
        }

        if(this.y < 0){
          this.vel[1] *= -1;
        }

        if(this.y > winSize[1]){
          game.rootScene.removeChild(this);
          deads++;
          restart();
          if (remainBlocks == 0) {
            refresh();
          }
        }

        for(var i = 0; i<blocks.length;i++){
          if(this.intersect(blocks[i])) {
            game.rootScene.removeChild(blocks[i]);
            delete(blocks[i]);
            this.vel[1] *= -1;
            shotBlocks++;
            remainBlocks--;
            if (remainBlocks == 0) {
              clears++;
            }
          }
        }

      }

    });

    var Player = enchant.Class.create(enchant.Sprite, {
      initialize: function(x, y) {
        enchant.Sprite.call(this,240, 8);
        this.x = x;
        this.y = y;
        this.speed = 8;
        this.vel = [1,1];
        this.scale(1,1);
        this.image = game.assets['board.png'];
        game.rootScene.addChild(this);
        this.addEventListener('enterframe', function() {
          if (game.input.right) {
            this.x += this.speed;
          }
          if (game.input.left) {
            this.x -= this.speed;
          }
        });
      }

    });

    var Block = enchant.Class.create(enchant.Sprite, {
      initialize: function(x, y) {
        enchant.Sprite.call(this,76, 24);
        this.x = x;
        this.y = y;
        this.scale(1,1);
        this.image = game.assets['block.png'];
        game.rootScene.addChild(this);
      }

    });

    player = new Player(500,600);
    ball = new Ball(620,590);

    makeBlocks();

    function restart() {
      ball = new Ball(player.x+120,592);
    }

    function refresh() {
      makeBlocks();
      shotBlocks = 0;
      remainBlocks = maxBlocks;
    }

    function makeBlocks(){
      for(var x=0;x<12;x++){
        for(var y=0;y<10;y++){
          // for(var x=0;x<47;x++){
          //   for(var y=0;y<55;y++){
          if (((x%6)!=5)&&((y%5)!=4)){
            var block = new Block(x*85 + 26,y*30 + 14);
            blocks.push(block);
          }
        }
      }
    }

    socket.on('x', function(x){
      player.x = Number(x);
      console.log(x);
    });
  };
  game.start();
};

var toDoubleDigits = function(num) {
  num += "";
  if (num.length === 1) {
    num = "0" + num;
  }
 return num;
};

var hhmmss = function() {
  var date = new Date();
  var hh = toDoubleDigits(date.getHours());
  var mm = toDoubleDigits(date.getMinutes());
  var ss = toDoubleDigits(date.getSeconds());
  return  hh + ':' + mm + ':' + ss;
};

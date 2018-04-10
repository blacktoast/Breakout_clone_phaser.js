
var mainState = {
   preload: function() {
     game.stage.backgroundColor ='#1d1c1c'
     game.load.image('paddle', 'assets/paddle.png');
     game.load.image('brick', 'assets/brick.png');
     game.load.image('ball', 'assets/ball.png');



   },

   create: function() {
       // 풀리시스템을 시작한다(충돌과 이동등을 위해서)
       game.physics.startSystem(Phaser.Physics.ARCADE);
       //모든객체들을 물리엔진에 추가한다. ->그렇다면 flappybird를 만들떄는 각각객체만 넣엇을까.

       game.world.enableBody = true;
       this.score=0;
       this.life=3;
       this.label_Score = game.add.text(20, 20, "score: "+this.score,
        { font: "30px Arial", fill: "#ffffff" });
      this.label_life = game.add.text(280, 20, "life: "+this.life,
         { font: "15px Arial", fill: "#ffffff" });


       // 오른쪽 왼쪽 방향키를 눌렀을때 반응하게 객체를 만들어 설정한다.
       this.left = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
       this.right = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

       // 패들의 위치를 설정한다.
       this.paddle = game.add.sprite(260, 400, 'paddle');

       // 공이 페들에 부딫혔을떄 움직이지않게 하기위해서 설정 ->
       //모든 객체가 물리엔진에 포함되었기때문에 패들은 물러나지 않게 해야한다.
       this.paddle.body.immovable = true;


       // 벽돌들을 담을 그룹을 만든다.
       this.bricks = game.add.group();

       // 25개의 벽돌을 생성한다 (5 columns and 5 lines)
       for (var i = 0; i < 5; i++) {
         for (var j = 0; j < 5; j++) {
           // Create the brick at the correct position
           var brick = game.add.sprite(135+i*65, 55+j*35, 'brick');



           // 볼이 벽돌에 부딫혔을대 벽돌이 밀려나지않게 설정한다.
           brick.body.immovable = true;

           //만든 벽돌을 그룹에 추가한다.
           this.bricks.add(brick);
         }
       }
       // Add the ball
       this.ball = game.add.sprite(200, 300, 'ball');

       //볼이 움직이는 속도를 설정한다.
       this.ball.body.velocity.x = 200;
       this.ball.body.velocity.y = 200;

       // 볼이 다른곳이 칠때 튀어 나오게한다
       this.ball.body.bounce.setTo(1); //setTo는 어떤일을 하는걸까? 숫자가 작을수록
       //튕겨나오는 속도가 적고,클수로 빨라지는것같다 그리고 가속도 붙는느낌이 든다.
       //
       this.ball.body.collideWorldBounds = true;

   },

   update: function() {
     // 왼쪽 오른쪽 키를 눌렀을떄 패들을 움직이게한다.
     if (this.left.isDown) this.paddle.body.velocity.x = -300;
     else if (this.right.isDown) this.paddle.body.velocity.x = 300;

     // 아무런 키를 누르지않았을때는 움직임이 없게한다.
     else this.paddle.body.velocity.x = 0;

     //패들과 공이 부딫히는것을 구현한다.
     game.physics.arcade.collide(this.paddle, this.ball);

     //공과 벽돌이 부딫혔을때 hjt함수를 호출하게 한다.
     game.physics.arcade.collide(this.ball, this.bricks, this.hit, null, this);

     // 공이 패들보다 아래로 떨어지면 게임을 다시 시작한다.
     if (this.ball.y > this.paddle.y){
       this.life=this.life-1;

       if(this.life==0)
        game.state.start('main');

       this.resetball();
     };

   },

   resetball(){
     this.label_life.text="life: "+this.life;

     this.ball.reset(this.paddle.x-100,250);
     this.ball.body.velocity.x = 200;
     this.ball.body.velocity.y = 200;
   },

   hit: function(ball, brick) {
     this.score+=1;
     this.label_Score.text="score: "+this.score;
     brick.kill();
},
};

// Initialize the game and start our state
var game = new Phaser.Game(600, 450);
game.state.add('main', mainState);
game.state.start('main');

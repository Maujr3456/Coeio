const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

var engine;
var world;

var ground;
var rope, rope2, rope3;
var fruit;
var link, link2, link3;
var fruit_image, backg, bunny_img;
var bunny;
var button, button2, button3;
var idle, eating, sad;
var eatSound, sadSound, airSound, cutSound, backSound;
var balloon, mute;
var w,h;

function preload(){
  eatSound = loadSound("sounds/eating_sound.mp3");
  sadSound = loadSound("sounds/sad.wav");
  airSound = loadSound("sounds/air.wav");
  cutSound = loadSound("sounds/rope_cut.mp3");
  backSound = loadSound("sounds/sound1.mp3");


  backg = loadImage("images/background.png");
  fruit_image = loadImage("images/melon.png");
  bunny_img = loadImage("images/Rabbit-01.png");
  idle = loadAnimation("images/blink_1.png", "images/blink_2.png", "images/blink_3.png","images/blink_2.png");
  sad = loadAnimation("images/sad_1.png", "images/sad_2.png", "images/sad_3.png")
  eating = loadAnimation("images/eat_0.png", "images/eat_2.png", "images/eat_3.png", "images/eat_4.png");

  eating.looping = false;
  sad.looping = false;
  backSound.looping = true;
  
}

function setup() 
{
  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if(isMobile){
    w = displayWidth;
    h = displayHeight;
    createCanvas(w,h);
  }else{
    createCanvas(500,700)
  }
  engine = Engine.create();
  world = engine.world;
 
  rectMode(CENTER);
  ellipseMode(RADIUS);
  imageMode(CENTER);
  textSize(50);

  backSound.play();
  backSound.setVolume(0.2)
  ground = new Ground(250,690,500,20);

  rope = new Rope(7, {x:250, y:30});
  rope2 = new Rope(8, {x:50, y:30});
  rope3 = new Rope(5, {x:390, y:200});

  bunny = createSprite(400, 600, 100,100);
  balloon = createImg("images/balloon.png")
  balloon.size(150,100);
  balloon.position(10, 200);
  balloon.mouseClicked(air);

  mute = createImg("images/mute.png")
  mute.size(50,50);
  mute.position(440,20);
  mute.mouseClicked(mutar);


  idle.frameDelay = 15;
  eating.frameDelay = 15;


  bunny.addAnimation ("idle", idle);
  bunny.addAnimation("eating", eating);
  bunny.addAnimation("sad",sad);
  bunny.scale = 0.3;


  button = createImg("images/cut_button.png");
  button.size(50,50)
  button.position(225, 25)
  button.mouseClicked(drop);

  button2 = createImg("images/cut_button.png");
  button2.size(50,50)
  button2.position(50, 25)
  button2.mouseClicked(drop2);

  button3 = createImg("images/cut_button.png");
  button3.size(50,50)
  button3.position(390,200)
  button3.mouseClicked(drop3);

  fruit_options ={
    density:0.001
  }
  
  fruit = Bodies.circle(250,300, 15, fruit_options);
  Composite.add(rope.body, fruit);
  link = new Link(rope, fruit);
  link2 = new Link(rope2, fruit);
  link3 = new Link(rope3, fruit);
}

function draw() 
{
  background(51);
  Engine.update(engine);

  ground.show();
  image(backg, width / 2, height / 2, 500, 700);
  rope.show();
  rope2.show();
  rope3.show();
  if(fruit !=null){
    image(fruit_image,fruit.position.x, fruit.position.y, 60,60);
  }
  

  if(fruit != null && fruit.position.y >= 650){
    bunny.changeAnimation("sad");
    sadSound.play();
    fruit = null;
  }

  if(collide(fruit, bunny) == true){
    bunny.changeAnimation("eating");
    eatSound.play();
  }
  drawSprites();
   
}

function drop(){
  rope.break();
  link.cut();
  link = null;
  cutSound.play();
}

function drop2(){
  rope2.break();
  link2.cut();
  link2 = null;
  cutSound.play();
}

function drop3(){
  rope3.break();
  link3.cut();
  link3 = null;
  cutSound.play();
}

function collide(body, sprite){
  if (body!=null){
    var distance = dist(body.position.x, body.position.y, sprite.position.x,sprite.position.y);
    if(distance <= 80){
      World.remove(world, body);
      fruit = null;
      return true;

    }
    else{
      return false;
    }
  }

}



function air(){
  Body.applyForce(fruit, {x:0, y:0}, {x:0.01,y:0});
  airSound.play();
}

function mutar(){
  if(backSound.isPlaying()){
    backSound.pause();
  }
  else{
    backSound.play();
  }
}
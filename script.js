//Canvas settings
let canvasW = 800;
let canvasH = 600;

//Creates the player
let player;
player = new bird();

//Creates the pipes
let pipes = [];
for(i = 0, x = 0; i < 10; i++){
	pipes[i] = new pipe();
	pipes[i].x += x;

	x += getRandomInt(250, 400);
}

//Creates the end screen object
let endScreen;
endScreen = new endScreenObj();

function setup(){
	createCanvas(canvasW, canvasH);
}

function draw(){
	background(220);

	//draws the player
	player.draw();

	//Draws the pipes
	for(i = 0; i < pipes.length; i++){
		pipes[i].draw();
	}

	//Draws the points
	fill("#fff");
	rect(canvasW - 60, 10, 50, 50);
	fill(0);
	textSize(20);
	textAlign("center");
	text(player.points, canvasW - 35, 42);

	//Draws the end screen if the player dies
	if(!player.jumpeable){
		endScreen.draw();
	}

	//deletes and adds new pipes to the array
	if(pipes[0].x < -pipes[0].w){
		pipes.shift();
		pipes[pipes.length] = new pipe();
		pipes[pipes.length-1].x = pipes[pipes.length-2].x + getRandomInt(250, 400);
	}
}

//The main player object
function bird(){
	this.size = 10;
	this.x = 80;
	this.y = 100;
	this.momentum = 0;
	this.downForce = 5;
	this.jumpeable = true;
	this.points = 0;
	this.color = "#75ff47";

	this.draw = function(){
		//Draws a rectangle
		fill(this.color);
		rect(this.x, this.y, this.size * 2, this.size);

		//Keeps pushing the player down (simmulating gravity)
		if(this.momentum > 0){
			this.y -= this.momentum;
			this.momentum -= 1.5;
		}
		if(this.downForce < 15 && this.jumpeable){
			this.downForce += 0.5;
		}
		this.y += this.downForce;

		//If the player hits the ground, it stops all the pipes and calls the endScreen function
		if(this.y >= canvasH - this.size){
			this.downForce = 0;
			this.jumpeable = false;
			stopPipes();
		}
	}
}

//The pipe objects
function pipe(){
	this.passed = false;
	this.speed = 3;
	this.gap = 200;
	this.x = canvasW;
	this.w = 50;
	
	//Top pipe
	this.y1 = 0;
	this.h1 = getRandomInt(50, 430);

	//Bottom pipe
	this.y2 = this.h1 + this.gap;
	this.h2 = canvasH - this.h1 - this.gap;

	this.draw = function(){
		fill("#75ff47");
		rect(this.x, this.y1, this.w, this.h1); //Top pipe
		rect(this.x, this.y2, this.w, this.h2); //Bottom pipe

		//Continuously pushes the pipes towards the player
		this.x -= this.speed;

		//Checks to see if the player hit a pipe
		if(player.x + player.size*2 >= this.x && player.x < this.x + this.w && player.jumpeable){

			if(!this.passed){
				player.points++;
				this.passed = true;
			}

			if(player.y < this.h1 || player.y + player.size > this.y2){
				//If it did hit a pipe, it will stop both the player and the pipes
				player.jumpeable = false;
				player.momentum = 0;
				player.downForce = 10;
				stopPipes();
			}
		}
	}
}

//For when the player hits a pipe
function stopPipes(){
	for(i = 0; i < pipes.length; i++){
		pipes[i].speed = 0;
	}
}

//Draws the end screen text
function endScreenObj(){
	this.w = 400;
	this.h = 200;

	this.x = canvasW / 2 - this.w / 2;
	this.y = canvasH / 2 - this.h / 2;

	this.draw = function(){
		fill(180);
		rect(this.x, this.y, this.w, this.h);

		push();
		strokeWeight(5);
		fill(0);
		textSize(30);
		textAlign("center");
		text(player.points, this.x + 200, this.y + 50);
		text("Game Over \n Press 'R' to restart", this.x + 200, this.y + 100);
		pop();
	}
}

function resetGame(){
	//Resets the player and score
	player.jumpeable = true;
	player.y = 50;
	player.points = 0;

	//Deletes all the pipes and creates new ones
	pipes.splice(0, pipes.length);

	for(i = 0, x = 0; i < 10; i++){
		pipes[i] = new pipe();
		pipes[i].x += x;

		x += getRandomInt(250, 400);
	}
}

function keyPressed(){
	//Makes the player jump
	if (keyCode == 32 && player.jumpeable) {
		player.momentum = 20;
		player.downForce = 0;
	}

	//When the player is dead and the user presses "R", the game restarts
	if(keyCode == 82 && !player.jumpeable){
		resetGame();
	}
}

//Gets a random integer value (p5js's random() function wasn't working so I had to use this quickfix)
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
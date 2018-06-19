var c = document.getElementById("c");
c.width = window.innerWidth;
c.height = window.innerHeight;
var ctx = c.getContext("2d");

var test = document.getElementById("test");
var body = document.getElementById("body");
var scorecard = document.getElementById("scorecard");
var bg = document.getElementById("bg");

var left = false, right = false;

var cx = window.innerWidth / 2;
var cy = window.innerHeight / 2;
ctx.translate(cx,cy);

var colors = ["rgb(0,0,255)", "rgb(204,134,20)", 
			  "rgb(255,201,64)", "rgb(111,61,153)",
			  "rgb(121,20,204)"];

var paddle;
var ball;

newgame();

function animateframe(){
	ctx.clearRect(-cx, -cy, c.width, c.height);

	paddle.update(left, right);

	if(ball.update(paddle))
		requestAnimationFrame(function() { animateframe(); });
	else
		endgame();

}

function newgame(){
	scorecard.innerHTML = "";
	bg.style.pointerEvents = "none";
	paddle = new Paddle(Math.PI/4, Math.min(window.innerWidth*.4, window.innerHeight*.4), .1, ctx);
	ball = new Ball(paddle.radius/15, paddle.radius/40, bg, colors, ctx);
	animateframe();
}

function endgame(){
	ctx.clearRect(-cx, -cy, c.width, c.height);
	scorecard.innerHTML = paddle.score;
	bg.style.pointerEvents = "auto";
}

function Paddle(width, radius, speed, ctx){
	this.theta = Math.PI/2;
	this.width = width;
	this.radius = radius;
	this.score = 0;

	this.update = function(left, right){
		if(left){
			this.theta += speed;
			if(this.theta > Math.PI) 
				this.theta -= Math.PI*2;
		}
		if(right){
			this.theta -= speed;
			if(this.theta < -Math.PI) 
				this.theta += Math.PI*2
		}

		ctx.lineWidth = this.radius/5;
		ctx.beginPath();
		ctx.arc(0, 0, this.radius + this.radius/10, this.theta - width/2, this.theta + width/2);
		ctx.stroke();
	}
}

function Ball(radius, speed, bg, colors, ctx){
	this.dist = 0;
	this.theta = Math.PI/2;
	this.speed = speed;
	this.tspeed = 0;
	this.radius = radius;
	this.lastcolor = 0;

	this.update = function(paddle){
		this.dist += this.speed;
		this.theta += this.tspeed;

		if(Math.abs(this.dist) + this.radius > paddle.radius &&
			Math.min(Math.abs(paddle.theta - this.theta), Math.abs((paddle.theta + Math.PI*2) % (Math.PI*2) - (this.theta + Math.PI*2) % (Math.PI*2))) < paddle.width/2){
		   	this.dist = -Math.sign(this.speed)*(paddle.radius - this.radius);
		   	this.theta = this.theta > 0 ? this.theta - Math.PI : this.theta + Math.PI;
		   	this.tspeed = Math.random()*.1 - .05;
		   	paddle.score++;

		   	var cind = Math.floor(Math.random()*(colors.length - 1));
		   	cind = cind >= this.lastcolor ? cind + 1 : cind;
		   	bg.style.background = colors[cind];
		   	this.lastcolor = cind;
		}
		else if (this.dist > paddle.radius){
			return false;
		}

		var linelen = paddle.radius;
		ctx.lineWidth = this.radius*1.4;
		ctx.beginPath();
		ctx.moveTo(Math.cos(this.theta)*linelen, Math.sin(this.theta)*linelen);
		ctx.lineTo(-Math.cos(this.theta)*linelen, -Math.sin(this.theta)*linelen);
		ctx.stroke();

		ctx.lineWidth = this.radius;
		ctx.beginPath();
		ctx.arc(Math.cos(this.theta)*this.dist, Math.sin(this.theta)*this.dist, this.radius/2, 0, Math.PI*2);
		ctx.stroke();

	 	return true;
	}	
}

body.onkeydown = function(e){
	switch(e.keyCode){
		case 37:
			left = true;
			break;
		case 39:
			right = true;
			break;
		}
}

body.onkeyup = function(e){
	switch(e.keyCode){
		case 37:
			left = false;
			break;
		case 39:
			right = false;
			break;
		}
}

bg.onmouseup = function(){
	newgame();
}

bg.onmouseenter = function(){
	bg.style.opacity = .9;
}

bg.onmouseleave = function(){
	bg.style.opacity = 1;
}

function resize(){
	ctx.translate(-cx,-cy);

	cx = window.innerWidth / 2;
	cy = window.innerHeight / 2;

	c.width = window.innerWidth;
	c.height = window.innerHeight;

	ctx.translate(cx,cy);

	paddle.radius = Math.min(window.innerWidth*.4, window.innerHeight*.4);
	ball.radius = paddle.radius/15;
	ball.speed = paddle.radius/40;
}

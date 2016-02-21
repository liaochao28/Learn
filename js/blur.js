/****
 *======================
 *模拟微信红包照片模糊效果
 * create 2016/02/21
****/



var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight;
/*var canvasWidth = 1024;
var canvasHeight = 600;*/

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

canvas.width = canvasWidth;
canvas.height = canvasHeight;

var image = new Image();
image.src = "../resource/wx_photo.jpg";

var leftMargin = 0, topMargin = 0;
var radius = 50;
var clippingRegion = {
	x: 400,
	y: 200,
	r: radius
};

//show动画定时器
var showTimer = null;
//reset动画定时器
var resetTimer = null;

image.onload = function() {

	$(".blur-box").css("width", canvasWidth+"px");
	$(".blur-box").css("height", canvasHeight+"px");

	$(".blur-box img").css("width", image.width+"px");
	$(".blur-box img").css("height", image.height+"px");

	leftMargin = (image.width - canvasWidth)/2;
	topMargin = (image.height - canvasHeight)/2;

	$(".blur-box img").css("left", String(-leftMargin)+"px");
	$(".blur-box img").css("top", String(-topMargin)+"px");

	initCanvas();
};

function initCanvas() {

	var theleft = leftMargin < 0 ? -leftMargin : 0;
	var thetop = topMargin < 0 ? -topMargin : 0;

	clippingRegion = {
		x: Math.random() * (canvas.width - 2*radius - 2*theleft) + radius + theleft,
		y: Math.random() * (canvas.height - 2*radius - 2*thetop) + radius + thetop,
		r: radius
	};
	//console.log(clippingRegion);
	//draw(image , clippingRegion);
	clearInterval(resetTimer);
	clippingRegion.r = 0;
	resetTimer = setInterval( function(){
		clippingRegion.r += 5;
		if(clippingRegion.r > radius ){
			clippingRegion.r = radius;
			clearInterval(resetTimer);
			//console.log("reset停止");
		}
		draw(image , clippingRegion);
	}, 30 );
};

function setClippingRegion( clippingRegion ) {
	context.beginPath();
	context.arc(clippingRegion.x, clippingRegion.y ,clippingRegion.r, 0, Math.PI*2, false);
	context.clip();
};

function draw(image , clippingRegion) {
	context.clearRect(0, 0, canvas.width, canvas.height);

	context.save();
	setClippingRegion( clippingRegion );
	context.drawImage(
		image, 
		Math.max(leftMargin,0), Math.max(topMargin,0),
		Math.min(canvas.width, image.width), Math.min(canvas.height, image.height),
		leftMargin < 0 ? -leftMargin : 0, topMargin < 0 ? -topMargin : 0, 
		Math.min(canvas.width, image.width), Math.min(canvas.height, image.height)
	);
	context.restore();
};

function reset() {
	clearInterval(showTimer);
	initCanvas();
}

function show() {
	clearInterval(showTimer);
	showTimer = setInterval( function(){
		//console.log("0");
		clippingRegion.r += 20;
		if(clippingRegion.r > Math.max(canvas.height , canvas.width)*2 ){
			clearInterval(showTimer);
		}
		draw(image, clippingRegion);
	}, 30 );
	clippingRegion.r = radius;
}

canvas.addEventListener("touchstart", function(e){
	e.preventDefault();
});
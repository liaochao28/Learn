// handwriting.js


var canvasWidth = Math.min(600 , $(window).width() - 20);
var canvasHeight = canvasWidth;
var isMouseDown = false;
var lastLoc = {x:0,y:0};
var lastTimestamp = 0;
var lastLineWith = -1;

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

canvas.width = canvasWidth;
canvas.height = canvasHeight

$("#clear_btn").click(function(e){
	context.clearRect(0,0,canvas.width,canvas.height);
	drawGrid();
});

$(".control").css("width", canvasWidth+"px");
drawGrid();

function beginStroke(point){
	isMouseDown = true;
	lastLoc = windowToCanvas(point.x, point.y);
	lastTimestamp = new Date().getTime();
};

function endStroke(){
	isMouseDown = false;
};

function moveStroke(point){
	var curLoc = windowToCanvas(point.x, point.y);
	var curTimestamp = new Date().getTime()
	var s = getDistance(lastLoc, curLoc);
	var t = curTimestamp - lastTimestamp;

	//console.log(s+","+t);
	var lineWidth = getLineWidth(s , t);
	//console.log(lineWidth);
	//draw;
	context.beginPath();
	context.moveTo(lastLoc.x,lastLoc.y);
	context.lineTo(curLoc.x,curLoc.y);

	context.strokeStyle = "black";
	context.lineWidth = lineWidth;

	context.lineCap = "round";
	context.lineJoin = "round";
	context.stroke();

	lastLoc = curLoc;
	lastTimestamp = curTimestamp;
	lastLineWith = lineWidth;
};

canvas.onmousedown = function(e){
	e.preventDefault();
	beginStroke( {x: e.clientX, y:e.clientY} );
};
canvas.onmouseup = function(e){
	e.preventDefault();
	endStroke()
};
canvas.onmouseout = function(e){
	e.preventDefault();
	endStroke();
};
canvas.onmousemove = function(e){
	e.preventDefault();
	if(isMouseDown){
		moveStroke( {x: e.clientX, y: e.clientY} );
	};
};

canvas.addEventListener("touchstart", function(e){
	e.preventDefault();
	touch = e.touches[0];
	beginStroke( {x: touch.pageX, y: touch.pageY} );
});
canvas.addEventListener("touchmove", function(e){
	e.preventDefault();
	if(isMouseDown){
		touch = e.touches[0];
		moveStroke( {x: touch.pageX, y: touch.pageY} );
	};
});
canvas.addEventListener("touchend", function(e){
	e.preventDefault();
	endStroke();
});

//获取线条宽度
var maxLingeWidth = 20;
var minLingeWidth = 1;
var maxStrokeV = 10;
var minStrokeV = 0.1;
function getLineWidth(s , t){
	var v = s/t;
	if(t == 0){
		v = 0;
	}
	var resultLineWidth;
	if (v <= minStrokeV){
		resultLineWidth = maxLingeWidth;
	}else if(v >= maxStrokeV){
		resultLineWidth = minLingeWidth;
	}else{
		resultLineWidth = maxLingeWidth - (v - minStrokeV)/(maxStrokeV-minStrokeV)*(maxLingeWidth - minLingeWidth);
	}

	//console.log(lastLineWith == -1);
	//console.log(resultLineWidth);
	if(lastLineWith == -1){
		return resultLineWidth;
	}
	return (lastLineWith*2/3) + (resultLineWidth*1/3);
};

//获取两点间的距离
function getDistance(point1, point2){
	return Math.sqrt((point1.x - point2.x) * (point1.x - point2.x) + (point1.y - point2.y) * (point1.y - point2.y) );
};

//屏幕坐标转换为canvas坐标
function windowToCanvas(x,y){
	//canvas.getBoundingClientRect() 获取canvas对象盒子相关信息，其中包含了canvas盒子的left、top值
	var bbox = canvas.getBoundingClientRect();
	return {
		x: Math.round(x - bbox.left),
		y: Math.round(y - bbox.top)
	}
}

//绘制米字格
function drawGrid(){
	context.save();
	context.strokeStyle = "rgb(230,11,9)";

	context.beginPath();
	context.moveTo(3,3);
	context.lineTo(canvasWidth-3, 3);
	context.lineTo(canvasWidth-3, canvasHeight-3);
	context.lineTo(3, canvasWidth-3);
	context.closePath();

	context.lineWidth = 6;
	context.stroke();

	context.beginPath();
	context.moveTo(3, 3);
	context.lineTo(canvasWidth-3, canvasHeight-3);

	context.moveTo(canvasWidth-3, 3);
	context.lineTo(3, canvasHeight-3);

	context.moveTo(canvasWidth/2, 3);
	context.lineTo(canvasWidth/2, canvasHeight-3);

	context.moveTo(3, canvasHeight/2);
	context.lineTo(canvasWidth-3, canvasHeight/2);

	context.lineWidth = 1;

	context.stroke();
	context.restore();
};


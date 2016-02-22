// scratchcard.js

var canvasWidth = $(window).width();
var canvasHeight = $(window).height();

var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

//刮痕的粗细
var lineWidth = 50;

//使用画线方法时 上个点
var lastLoc = {x: 0, y: 0};

var isMouseDown = false;

canvas.width = canvasWidth;
canvas.height = canvasHeight


context.beginPath();
context.fillStyle = "#999";
context.fillRect(0, 0, canvasWidth, canvasHeight);
context.closePath();

//设置canvas图形组合方式
//图形组合方式设置为重叠部分不做绘画
context.globalCompositeOperation="destination-out";


canvas.addEventListener("touchstart", function(e){
	e.preventDefault();
	beginStroke( {x: e.clientX, y:e.clientY} );

	//console.log("touchstart");
});

canvas.addEventListener('touchmove', function(e){
	e.preventDefault();
	//console.log("touchmove");
	if( isMouseDown ){
		var touch = e.touches[0];

		/*context.beginPath();
		context.fillStyle = "#f00";
		context.lineWidth = lineWidth;
		//context.arc(touch.pageX, touch.pageY, lineWidth, 0, Math.PI*2);
		context.moveTo();
		context.fill();
		context.closePath();*/
		
		moveStroke( {x: touch.pageX, y: touch.pageY} );
	}
	
});

canvas.addEventListener('touchend', function(e){
	e.preventDefault();

	endStroke();

	//监听刮除的面积 超过70%则显示全部图片
	var num = 0;
	var datas = context.getImageData(0, 0, canvasWidth, canvasHeight);
	for (var i = 0; i < datas.data.length; i++) {
		if (datas.data[i] == 0) {
			num++;
		};
	};
	if (num >= datas.data.length * 0.7) {
		context.fillRect(0, 0, canvasWidth, canvasHeight);
	};
});


function beginStroke(point){
	isMouseDown = true;
	lastLoc = windowToCanvas(point.x, point.y);
};

function endStroke(){
	isMouseDown = false;
};

function moveStroke(point){
	var curLoc = windowToCanvas(point.x, point.y);

	//draw;
	context.beginPath();
	context.moveTo(lastLoc.x,lastLoc.y);
	context.lineTo(curLoc.x,curLoc.y);

	context.strokeStyle = "black";
	context.lineWidth = lineWidth;
	//console.log(lineWidth);
	context.lineCap = "round";
	context.lineJoin = "round";
	context.stroke();

	lastLoc = curLoc;
};

//将相对于文档坐标转换为相对于canvas坐标
function windowToCanvas( x , y ) {
	var bbox = canvas.getBoundingClientRect();
	return {
		x: x - bbox.left,
		y: y - bbox.top
	}
};

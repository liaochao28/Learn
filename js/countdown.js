
var wHeight = document.body.clientHeight || document.documentElement.clientHeight;
var wWidth = document.body.clientWidth || document.documentElement.clientWidth;
var Margin_Left = Math.round(wWidth/10);
var Margin_Top = Math.round(wHeight/5);
var Radius = Math.round(wWidth * 4/5 /108) - 1;

var curShowTimeSeconds = 0;

//用于倒计时模式
var endTime = new Date();
endTime.setTime(endTime.getTime() + 3600*1000);

var balls = [];
var colors = ["#33b5e5", "#0099cc", "#aa66cc", "#9933cc", "#99cc00", "#669900", "#ffbb33", "#ff8800", "#ff4444", "#cc0000"];

window.onload = function(){

	var canvas = document.getElementById("canvas");

	//js空设置canvas宽高
	canvas.width = wWidth;
	canvas.height = wHeight;

	var context = canvas.getContext("2d");

	curShowTimeSeconds = getCurrentShowTimeSeconds();

	setInterval(function(){
		render(context);
		update();

	},50);

	//render(context);

};

function update(){
	var nextShowTimeSeconds = getCurrentShowTimeSeconds();

	var nextHours = parseInt(nextShowTimeSeconds/3600);
	var nextMinutes = parseInt((nextShowTimeSeconds - nextHours*3600)/60);
	var nextSeconds = nextShowTimeSeconds % 60;

	var curHours = parseInt(curShowTimeSeconds/3600);
	var curMinutes = parseInt((curShowTimeSeconds - curHours*3600)/60);
	var curSeconds = curShowTimeSeconds % 60;

	if(nextShowTimeSeconds !== curShowTimeSeconds){
		if(parseInt(curHours !== nextHours)){
			addBalls(Margin_Left, Margin_Top, parseInt(curHours/10));
		}
		if(parseInt(curHours%10) !== parseInt(nextHours%10)){
			addBalls(Margin_Left + 15*(Radius+1), Margin_Top, parseInt(curHours%10));
		}

		if(parseInt(curMinutes/10) !== parseInt(nextMinutes/10)){
			addBalls(Margin_Left + 39*(Radius+1), Margin_Top, parseInt(curMinutes/10));
		}
		if(parseInt(curMinutes%10) !== parseInt(nextMinutes%10)){
			addBalls(Margin_Left + 54*(Radius+1), Margin_Top, parseInt(curMinutes%10));
		}

		if(parseInt(curSeconds%10) !== parseInt(nextSeconds%10)){
			addBalls(Margin_Left + 78*(Radius+1), Margin_Top, parseInt(curSeconds/10));
		}
		if(parseInt(curSeconds%10) !== parseInt(nextSeconds%10)){
			addBalls(Margin_Left + 93*(Radius+1), Margin_Top, parseInt(nextSeconds%10));
		}

		curShowTimeSeconds = nextShowTimeSeconds;

	}

	updateBalls();

	//console.log(balls.length);
	
};

function updateBalls() {
		for(var i = 0; i < balls.length; i++) {
			balls[i].x += balls[i].vx;
			balls[i].y += balls[i].vy;
			balls[i].vy += balls[i].g;

			if(balls[i].y >= wHeight - Radius){
				balls[i].y = wHeight - Radius;
				balls[i].vy = - balls[i].vy * 0.7;
			};
		};

		var cnt =0;
		for(var i = 0; i < balls.length; i++){
			if(balls[i].x + Radius > 0 && balls[i].x - Radius < wWidth){
				balls[cnt++] = balls[i];
			};
		};	
		while( balls.length > Math.min(650,cnt) ){
			balls.pop();
		};
		//console.log(balls.length)
	};

function addBalls(x,y,num){
	for(var i = 0; i < digit[num].length; i++){
		for(var j = 0; j < digit[num][i].length; j++){
			if(digit[num][i][j] == 1){
				var aBall = {
					x:x+j*2*(Radius+1)+(Radius+1),
					y:y+i*2*(Radius+1)+(Radius+1),
					g:1.5+Math.random(),
					vx:Math.pow(-1, Math.ceil( Math.random()*1000 ))*4,	//Math.pow(x,y) : 取x的y次方；
					vy:-5,
					color:colors[ Math.floor(Math.random() * colors.length) ]
				};
				balls.push(aBall);
			}
		}
	}
};

function getCurrentShowTimeSeconds(){
	var curTime = new Date();

	//倒计时模式
/*	var ret = endTime.getTime() - curTime.getTime();
	ret = Math.round(ret/1000);
	return ret >= 0 ? ret : 0;*/

	//时钟模式
	var ret = curTime.getHours() * 3600 + curTime.getMinutes() * 60 + curTime.getSeconds();
	return ret;
};

function render(cxt) {

	cxt.clearRect(0,0,wWidth,wHeight);

	var hours = parseInt(curShowTimeSeconds/3600);
	var minutes = parseInt((curShowTimeSeconds - hours*3600)/60);
	var seconds = curShowTimeSeconds % 60;



	renderDigit(Margin_Left, Margin_Top, parseInt(hours/10), cxt);
	renderDigit(Margin_Left + 15*(Radius+1), Margin_Top, parseInt(hours%10), cxt);
	renderDigit(Margin_Left + 30*(Radius+1), Margin_Top, 10, cxt);

	renderDigit(Margin_Left + 39*(Radius+1), Margin_Top, parseInt(minutes/10), cxt);
	renderDigit(Margin_Left + 54*(Radius+1), Margin_Top, parseInt(minutes%10), cxt);
	renderDigit(Margin_Left + 69*(Radius+1), Margin_Top, 10, cxt);

	renderDigit(Margin_Left + 78*(Radius+1), Margin_Top, parseInt(seconds/10), cxt);
	renderDigit(Margin_Left + 93*(Radius+1), Margin_Top, parseInt(seconds%10), cxt);

	for(var i = 0; i < balls.length; i++){
		cxt.fillStyle = balls[i].color;
		cxt.beginPath();
		cxt.arc(balls[i].x, balls[i].y, Radius, 0 , 2*Math.PI, true);
		cxt.closePath();
		cxt.fill();
	};
}

function renderDigit(x, y, num, cxt) {
	cxt.fillStyle = "rgb(0,102,153)";

	for(var i = 0; i < digit[num].length; i++){
		for(var j = 0; j < digit[num][i].length; j++){
			if(digit[num][i][j] == 1){
				cxt.beginPath();
				cxt.arc( x+j*2*(Radius+1)+(Radius+1) , y+i*2*(Radius+1)+(Radius+1) , Radius , 0 , 2*Math.PI);
				cxt.closePath();
				cxt.fill();

			}
		}
	}
};
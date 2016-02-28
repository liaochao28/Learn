/**
 * 旋转木马图片轮播插件JS
 * create on 2016/02/28
 * liaochao28
**/


;(function($){		//加":"是为了防止前面的代码没有闭合而报错

//alert($)

var Carousel = function(poster){

	var self = this;
	//保存单个旋转木马对象（避免下次用到需再次保存）
	this.poster = poster;
	this.posterItemMain = poster.find("ul.poster-list");
	this.nextBtn = poster.find("div.poster-right-btn");
	this.prevBtn = poster.find("div.poster-left-btn");
	this.posterItems = poster.find("li")
	this.posterFirstItem = this.posterItems.first();		//第一帧
	this.posterLastItem = this.posterItems.last();			//最后一帧
	this.flag = true;

	//默认配置参数
	this.setting = {
		"width":800,				//幻灯片的宽
		"height":272,				//幻灯片的高
		"posterWidth":480,			//第一帧的宽
		"posterHeight":272,			//第一帧的高
		"scale":0.9,				//每一阶级的缩放比例
		"autoPlay":true,			//自动播放
		"delay":5000,				//自动播放时间
		"speed":500,				//动画切换的速度
		"verticalAlign":"middle"	//默认有middle top bottom
	}
	//$.extend(obj1,obj2)  在此处为合并对象，相同属性被覆盖，不同属性被追加
	$.extend(this.setting,this.getSetting());
	
	//设置配置参数值
	this.setSettingValue();

	//设置每张图片的位置
	this.setPosterPos();

	//next按钮点击事件
	this.nextBtn.click(function(){
		if(self.flag){
			self.flag = false;
			self.carouselRotate("left");			
		}
	});

	//prev按钮点击事件
	this.prevBtn.click(function(){
		if(self.flag){
			self.flag = false;
			self.carouselRotate("right");		
		}
	});

	//是否自动播放
	if(this.setting.autoPlay){
		this.autoPlay();
		this.poster.hover(function(){
			clearInterval(self.timer);
		},function(){
			self.autoPlay();
		})
	}
};

//Casourel对象原型 用于一些基础的方法 行为;
Carousel.prototype = {

	//自动播放
	autoPlay:function(){
		var self = this;
		this.timer = window.setInterval(function(){
			self.nextBtn.click();
		},self.setting.delay)
	},

	//旋转函数
	carouselRotate:function(dir){
		var _this_ = this;
		var zIndexArr = [];
		if(dir === "left"){
			//alert("left");
			this.posterItems.each(function(){
				var self = $(this),
					prev = self.prev().get(0)?self.prev():_this_.posterLastItem,
					width = prev.width(),
					height = prev.height(),
					zIndex = prev.css("zIndex"),
					opacity = prev.css("opacity"),
					top = prev.css("top"),
					left = prev.css("left");
					zIndexArr.push(zIndex);
				self.animate({
					width : width,
					height : height,
					zIndex : zIndex,
					opacity : opacity,
					left : left,
					top : top
				},_this_.setting.speed,function(){
					_this_.flag = true;
				});
			});
			this.posterItems.each(function(i){
				$(this).css("zIndex",zIndexArr[i]);
			});
		}else if(dir === "right"){
			//alert("right");
			this.posterItems.each(function(){
				var self = $(this),
					next = self.next().get(0)?self.next():_this_.posterFirstItem,
					width = next.width(),
					height = next.height(),
					zIndex = next.css("zIndex"),
					opacity = next.css("opacity"),
					top = next.css("top"),
					left = next.css("left");
					zIndexArr.push(zIndex);

				self.animate({
					width : width,
					height : height,
					zIndex : zIndex,
					opacity : opacity,
					left : left,
					top : top
				}, _this_.setting.speed, function(){
					_this_.flag = true;
				});
			});
			$(this).posterItems.each(function(i){
				this.css("zIndex",zIndexArr[i]);
			});
		}
	},

	//设置剩余广告位置
	setPosterPos:function(){
		var self = this;
		var sliceItems 	= this.posterItems.slice(1),
			sliceSize 	= sliceItems.size()/2,
			rightSlice 	= sliceItems.slice(0,sliceSize),
			level		= Math.floor(this.posterItems.size()/2),

			leftSlice = sliceItems.slice(sliceSize)

		var rw = this.setting.posterWidth,
			rh = this.setting.posterHeight,
			gap = ((this.setting.width - this.setting.posterWidth)/2)/level;

		var firstLeft = (this.setting.width-this.setting.posterWidth)/2;
		var fixOffsetLeft = firstLeft + rw;

		//设置右边帧的位置关系
		rightSlice.each(function(i){
			level--;
			rw = rw * self.setting.scale;
			rh = rh * self.setting.scale;
			var j =i;
			$(this).css({
				zIndex:level,
				width:rw,
				height:rh,
				opacity:1/(++j),
				left:fixOffsetLeft + (++i)*gap - rw,
				top:self.setVerticalAlign(rh)
			});
		});	
		//设置左边的位置关系
		var lw = rightSlice.last().width(),
			lh = rightSlice.last().height(),
			oloop = Math.floor(this.posterItems.size()/2);
		leftSlice.each(function(i){
			$(this).css({
				zIndex:level,
				width:lw,
				height:lh,
				opacity:1/oloop,
				left:i*gap,
				//top:(self.setting.height - lh)/2
				top:self.setVerticalAlign(lh)
			});
			lw = lw/self.setting.scale;
			lh = lh/self.setting.scale;
			oloop--;
		})
	},

	//设置垂直排列对齐
	setVerticalAlign:function(height){
		var verticalType = this.setting.verticalAlign,
			top = 0;
			if(verticalType === "middle"){
				top = (this.setting.height - height)/2;
			}else if(verticalType === "top"){
				top = 0;
			}else if(verticalType === "bottom"){
				top = this.setting.height - height;
			}else{
				top = (this.setting.height - height)/2;
			}
		return top;
	},

	//设置配置参数去控制基本宽高
	setSettingValue:function(){
		this.poster.css({
			width:this.setting.width,
			height:this.setting.height
		});
		this.posterItemMain.css({
			width:this.setting.width,
			height:this.setting.height			
		});
		//计算上下按钮的宽度
		var w = (this.setting.width - this.setting.posterWidth)/2;
		this.nextBtn.css({
			width:w,
			height:this.setting.height,
			zIndex:Math.ceil(this.posterItems.size()/2)
		});
		this.prevBtn.css({
			width:w,
			height:this.setting.height,
			zIndex:Math.ceil(this.posterItems.size()/2)
		});
		this.posterFirstItem.css({
			width:this.setting.posterWidth,
			height:this.setting.posterHeight,
			left:w,
			zIndex:Math.floor(this.posterItems.size()/2)
		});
	},

	//获取人工配置参数(首先需要获取对象节点[此处由对象保存传递])
	getSetting:function(){
		var setting = this.poster.attr("data-setting");
		//将获取到的配置字符串转化为json格式:parseJSON() [注意字符串格式要正确]
		if(setting && setting != ""){
			return $.parseJSON(setting);
		}else{
			return {};
		}
		return setting;
	}
};

//Carousel 的初始化方法（可以直接初始化一个集合,避免多个对象的多次new）
Carousel.init = function(posters){
	var _this_ = this;
	posters.each(function(){		//$.each(function(i,item)) i 为索引 item为每个元素
		new _this_($(this));		//这里_this_为posters的集合 $(this) 为传递一个jquery对象
	});
}

window["Carousel"] = Carousel;		//此闭包中Carousel为局部对象 在此吃注册为windows全局对象 可在外部访问

})(jQuery);
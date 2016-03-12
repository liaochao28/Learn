
;(function(){

    function $(select){
        return document.querySelectorAll(select);
    }

    var UpLoader = function(input){
        var self = this;
        this.input = input;
        this.inputBtn = this.input.parentNode;
        this.form = $("form")[0];
        this.submitBtn = $("input[type=\"button\"]")[0];

        this.setting = {
            hasChoicedImg: [],
            beAllowedImgType: ["jpg","png","jpeg","gif","bmp","tiff","psd"],
            size: 3,     //默认限制大小为3MB，未实现自定义size单位
            //previewImgBox: ".img-box"       //默认显示如兰图片的容器(选择器)
        };

        //extend(obj1,obj2)  在此处为合并对象，相同属性被覆盖，不同属性被追加
        //合并配置项
        this.setting = this.extend(this.setting,this.getSetting());
        //console.log(this.setting)

        this.addEvent(self.input,"change",function(){
            if(this.value){
                //console.log(this.value);
                if (!self.is_Imgtype(this.value)) {
                    alert("上传图片格式不正确");
                    return false;
                };
                
                if(!self.is_size(self.input)){
                    alert("请上传小于3M的图片");
                    return false;
                }
                self.render();
                var img = $(".img-box img:last-child")[0];

                self.setting.hasChoicedImg.push(this.value);
                self.createUrl(self.input,img);
                console.log(self.setting.hasChoicedImg)
            }
        })

        this.submitBtn.onclick = function(){
            alert(self.setting.hasChoicedImg);
        }

    };

    UpLoader.prototype = {
        addEvent: function(object,type,handler){
            if(window.addEventListener){

                object.addEventListener(type,handler,false)
            }else if(window.attachEvent){

                object.attachEvent("on" + type,handler)
            }else{
                object["on" + type] = handler;
            }
        },
        //判断是否是在IE浏览器或opera
        is_IE: function(){
            var yesOrNo = /msie/i.test(navigator.userAgent) && !window.opera;
            return yesOrNo;
        },
        //限制上传文件的大小
        is_size: function(target){
            var that = this;
            var fileSize = 0;
            if (that.isIE && !target.files) {    // IE浏览器
                var filePath = target.value; // 获得上传文件的绝对路径
                /**
                 * ActiveXObject 对象为IE和Opera所兼容的JS对象
                 * 用法：
                 *     var newObj = new ActiveXObject( servername.typename[, location])
                 *     其中newObj是必选项。返回 ActiveXObject对象 的变量名。
                 *     servername是必选项。提供该对象的应用程序的名称。
                 *     typename是必选项。要创建的对象的类型或类。
                 *     location是可选项。创建该对象的网络服务器的名称。
                 *
                 *     Scripting.FileSystemObject 为 IIS 内置组件，用于操作磁盘、文件夹或文本文件，
                 *     其中返回的 newObj 方法和属性非常的多
                 *     如：var file = newObj.CreateTextFile("C:\test.txt", true) 第二个参表示目标文件存在时是否覆盖
                 *     file.Write("写入内容");    file.Close();
                 **/
                var fileSystem = new ActiveXObject("Scripting.FileSystemObject");
                // GetFile(path) 方法从磁盘获取一个文件并返回。
                var file = fileSystem.GetFile(filePath);
                if (!file) { return false; }
                fileSize = file.Size;    // 文件大小，单位：b
            }
            else {    // 非IE浏览器
                fileSize = target.files[0].size;
            }
            var size = fileSize / (1024*1024) ;//单位为MB
            if (size <= that.setting.size) {
                return true;
            } else {
                return false;
            }
        },
        //限制上传文件的类型（后缀）
        is_Imgtype: function(value){
            var that = this;
            photoExt = value.substr((value.lastIndexOf(".")) + 1).toLowerCase();//获得文件后缀名
            //console.log(that.setting.beAllowedImgType.indexOf(photoExt));
            if(that.setting.beAllowedImgType.indexOf(photoExt) >= 0){
                return true;
            }
        },
        //这里不怎么需要
        //判断是否在微信端
        is_weixin: function(){
            var regex_match = /(micromessenger)/i;
            var u = navigator.userAgent;
            if (null == u) {
                return true;
            }
            var result = regex_match.exec(u);
            if (null == result) {
                return false
            } else {
                return true
            }
        },
        //创建上传文件本地浏览地址
        createUrl: function(inputName, imgName){
            if (inputName.files && inputName.files[0]) {
                //imgObjPreview.src = docObj.files[0].getAsDataURL();
                //imgObjPreview.src = window.URL.createObjectURL(docObj.files[0]);
                if (window.navigator.userAgent.indexOf("Chrome") >= 1 || window.navigator.userAgent.indexOf("Safari") >= 1) {
                    imgName.src = window.webkitURL.createObjectURL(inputName.files[0]);
                }
                else {
                    imgName.src = window.URL.createObjectURL(inputName.files[0]);
                }
                console.log(window.URL.createObjectURL(inputName.files[0]))
            }
            else {
                //IE下，使用滤镜 
                inputName.select();
                inputName.blur(); //新添加加的
                var imgSrc = document.selection.createRange().text;
                //var localImagId = document.getElementById("localImg" + (idindex - 1));//根据li的id
                var localImagId = imgName.parentNode("li");
                try {
                    localImagId.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
                    localImagId.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = imgSrc;
                }
                catch (e) {
                    alert("你浏览器不行啦...");
                    return false;
                }
                imgName.style.display = 'none';
                document.selection.empty();
            }
        },
        //添加一张图片
        render: function(){
            var imgBox;
            if($(".img-box").length <= 0){
                //alert("不存在:" + $(".img-box").length)
                imgBox = document.createElement("div");
                document.getElementsByTagName("body")[0].appendChild(imgBox);
            }else{
                imgBox = $(".img-box")[0];
            }
            var img = document.createElement("img");
            imgBox.className = "img-box";
            imgBox.appendChild(img);  
        },
        //合并对象（默认配置和自定义配置）
        extend: function(objectOld, objectNew){
            for(prop in objectNew){
                objectOld[prop] = objectNew[prop];
            }
            return objectOld;
        },
        getSetting: function(){
            //这里的getAttribute需要做兼容处理
            // TODO

            var setting = this.input.getAttribute("data-setting");
            if(setting && setting != ""){
                return JSON.parse(setting);
            }else{
                return {};
            }
        }
    };

    UpLoader.init = function (inputs){
        var _this_ = this;
        for(var i = 0; i < inputs.length; i++){
            new _this_(inputs[i]);
        }
    };

    window.UpLoader = UpLoader;
})();



/**判断上传图片类型**/
/*function is_Imgtype(obj) {
    photoExt = obj.value.substr(obj.value.lastIndexOf(".")).toLowerCase();//获得文件后缀名
    if (photoExt == ".jpg" || photoExt == ".png" || photoExt == ".jpeg" || photoExt == ".bmp" || photoExt == ".gif" || photoExt == ".tiff" || photoExt == ".psd") {
        return true;
    }
}*/

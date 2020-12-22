/**
 * mouseUrl 控制鼠标的url
 * srcUrl 控制屏幕的url
 */
var dScreen = function(mouseUrl,srcUrl){
	var mouse = mouseUrl;
	var src = srcUrl;
	this.lockMouse = function(){
		$.post(mouse,{"comm":"1"},function(r){
			if(r != undefined && r.error != ""){
				//alert(r.error);
			}
		});
	},
	this.unLockMouse = function(){
		$.post(mouse,{"comm":"2"},function(r){
			if(r != undefined && r.error != ""){
				//alert(r.error);
			}			
		});
	},
	this.singleScr = function(){
		$.post(src,{"comm":"3"},function(r){
			if(r != undefined && r.error != ""){
				alert(r.error);
			}
		});
		//启用窗口锁定
		/*$.post(mouse,{"comm":"4"},function(r){
			if(r != undefined && r.error != ""){
				alert(r.error);
			}
		});*/
	},
	this.doubleScr = function(){
		$.post(src,{"comm":"1"},function(r){
			if(r != undefined && r.error != ""){
				alert(r.error);
			}
		});
	},
	this.shortcutScr = function(){
		$.post(src,{"comm":"2"},function(r){
			if(r != undefined && r.error != ""){
				alert(r.error);
			}
		});
		//禁用窗口锁定
		/*$.post(mouse,{"comm":"4"},function(r){
			if(r != undefined && r.error != ""){
				alert(r.error);
			}
		});*/
	}
}
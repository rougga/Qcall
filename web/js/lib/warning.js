/**
 *	预警信息，需要使用jquery
 */
var war = function(url,action,actionUrl,param){
	this.refreshWar = function(){
		$.post(url,param || {},function(d){
			if(d != undefined && d instanceof Object){
				var mes = "";
				$.each(d,function(i){
					//把最大的sort_id(第一条数据)保存到cookies
					if(i == 0) {
						$.cookie(this["receiveUser"]+"_warning_sort_id" + param.type, this["sortId"],{expires:1});
						param.sortId = this["sortId"];
					}
					mes += "<div style='font-size:12px;'>"+(i+1)+". "+this["warningText"]+"</div><hr/>";
					if(i == d.length-1){
						mes += "<span id='viewMore' style='display:block;float:right;cursor:pointer;text-decoration:underline;'>查看更多</span>";
					}
				});
				if(mes != ""){
					var MSG1 = new CLASS_MSN_MESSAGE("warningInfo",520,270,"","用户预警消息",mes,"_blank",function(){action.call(this,actionUrl,"预警消息")});  
					MSG1.show(); 
				}
				//播放提示音
			}
		});
	}
}



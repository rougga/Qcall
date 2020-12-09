/**
 * 评价器列表， {ocx控件objce id : '评价器类名', ....}
 */
var evaluations = {
		'raymonpjq':'RaymonEval',
		'dongxypjq':'DongxyEval' ,
        'usingpjq':'UsingEval',
        'shanglingpjq':'Shanglingpjq',
        //'ytpjq4key':'YTPJQEval',
		'dongxypjq4key' : "DongxyEval4Key"
}

/*
 * -1	无评价
 * 0	其它
 * 1	业务不熟
 * 2	时间太长
 * 3	态度不好
 * 4	基本满意
 * 5	非常满意
 */
//没有点击评价器时的默认评价结果
var default_eval = -1;

/*
 * 评价器列表[ { id :ocx控件objce ,classname :'评价器类名'}, ....]
var evaluations = [{'id':'raymonpjq','classname':'RaymonEval'},{'id':'dongxypjq','classname':'dongxypjq'}];
*/

/**
 * 返回评价器实例 
 * @param cookiesName cookies名称  evalFac
 * @param set	cookies值(objId)对应的评价器类 { 'raymonpjq':'RaymonEval'} 数组
 * @returns 
 */
var getEvaluation = function(cookiesName){
	//从cookies读取评价器厂商
	var facCk = $.cookie(cookiesName);
	//alert(facCk);
	if(facCk == null || facCk == ""){ //第一次，cookies的值为空
		return obj = findEvalFacAndSetCookies(cookiesName);
	}
	var classname = evaluations[facCk];
	var evalObj;
	if(classname != null && classname != ""){
		var s = "new "+classname +"('" + facCk + "')";
        //alert(s);
		evalObj = eval(s);
		if(evalObj.setReady()!=1){
			return findEvalFacAndSetCookies(cookiesName);
		}else{
			return evalObj;
		}
	}else{
		return findEvalFacAndSetCookies(cookiesName);
	}
}

/**
 * 根据后台设置的评价器厂商获取驱动
 */
var getEvaluationByToolFac = function(toolFac){
	var classname = evaluations[toolFac];
	if(classname != null && classname != ""){
		var s = "new "+classname +"('" + toolFac + "')";
		var evalObj = eval(s);
		return evalObj;
	} else {
		return null;
	}
}

/**
 * 判断是哪个厂商的硬件评价器,将厂商类型设置到cookies
 * @returns
 */
function findEvalFacAndSetCookies(cookiesName){
	//逐个判断评价器是哪个厂商
	for(var att in evaluations){
		var objId = att;
		var classname = evaluations[att];
		var s = "new " + classname + "('" + objId + "')";
//        alert(s);
		var tempObj = eval("(" + s + ")");
		if(tempObj != null && tempObj.setReady() == 1){
			$.cookie(cookiesName,att,{expires:7});
//			alert("设cookies为:" + att);
			return tempObj;
		}
	}
	
	return null;
}

/**
 * Raymon评价器
 * @param objId
 * @returns
 */
var RaymonEval = function(objId){
	this.setReady = function(){
		try{
			if(document.getElementById(objId).setReady()){
				return 1;
			}else{
				return -1;
			}
		}catch(e){
			return -1;
		}
	}
	this.welcome = function(){
		try{
			document.getElementById(objId).start();
		}catch(e){}
	}
	this.receive = function(time,callback){
		$(document).mask($.i18n.prop('server.waiting.evaluation'));
		var timeRemain = time;
		var key;
		try{
			document.getElementById(objId).getKey(time);
		}catch(e){}
		var evalRet = default_eval;
		switch(key){
			case 1: evalRet = 5;break;//"非常满意\n";break;
			case 2: evalRet = 4;break;//"基本满意\n";break;
			case 3: evalRet = 3;break;//"态度不好\n";break;
			case 4: evalRet = 2;break;//"时间太长\n";break;
			case 5: evalRet = 1;break;//"业务不熟\n";break;
			case 6: evalRet = 0;break;//"其它\n";break;
			default: evalRet = default_eval;//"超时或出错\n";
		}
		$(document).unmask();
		callback(evalRet);
	}
	this.setStars = function(star){
		try{
			document.getElementById(objId).sendStars(star);
		}catch(e){}
	}
} 

/**
 * 东岘源评价器(6键)/圆形的那款4键评价器也是这个驱动.(1-满意,2-流程繁琐(时间太长),3-态度不好,4-业务不熟)
 * @param objId
 * @returns
 */
var DongxyEval = function(objId){
	this.setReady = function(){
		try{
			if(document.getElementById(objId).setReady()==1){
				return 1;
			}else{
				return -1;
			}
		}catch(e){
			return -1;
		}
	}
	/**
	 * 欢迎光临
	 */
	this.welcome = function(){
		try{
			document.getElementById(objId).welcome();
		}catch(e){}
	}
	/**
	 * 超时时间
	 * @param time 超时时间
	 * @param tid 票号
	 * @param callback回调函数
	 */
	this.receive = function(time,callback){
		$(document).mask($.i18n.prop('server.waiting.evaluation'));
		var ret;
		try{
			document.getElementById(objId).getKey();
		} catch(e) {}
		try{
			document.getElementById(objId).apprise();
		}catch(e){}
		if(ret == 0){
			$(document).unmask();
			return default_eval;
		}
		//15秒完成评价
		var secCount = 0;
		var presult = -1;
		this.autoAdd = function(){
			secCount = secCount+1;
			//alert(presult + "---" +secCount);
			try{
				presult = document.getElementById(objId).getKey();
			}catch(e){}
			if(presult > 0 || secCount >= time){
				clearInterval(timer);
				if(presult <= 0){
					//alert("评价超时");
					presult = -1;
				}else{
					try{
						document.getElementById(objId).thanks();
					}catch(e){}
				}
				//评价结果
				var evalRet = default_eval;
				//判断是否为4键
				if ("4" == evalLevel) {
					switch(presult){
						case 1: evalRet = 4;break;//"基本满意\n";break;
						case 2: evalRet = 2;break;//"时间太长\n";break;
						case 3: evalRet = 3;break;//"态度不好\n";break;
						case 4: evalRet = 1;break;//"业务不熟\n";break;
						default: evalRet = default_eval;//"超时或出错\n";
					}
				} else {
					switch(presult){
						case 1: evalRet = 5;break;//"非常满意\n";break;
						case 2: evalRet = 4;break;//"基本满意\n";break;
						case 3: evalRet = 3;break;//"态度不好\n";break;
						case 4: evalRet = 2;break;//"时间太长\n";break;
						case 5: evalRet = 1;break;//"业务不熟\n";break;
						case 6: evalRet = 0;break;//"其它\n";break;
						default: evalRet = default_eval;//
					}
				}
				$(document).unmask();
				callback(evalRet);
			}
		}
		var timer = setInterval(this.autoAdd, 1000);
	}
	this.setStars = function(star){
		try{
			document.getElementById(objId).setStars(star);
		}catch(e){}
	}
}

/**
 * 尚凌评价器(6键)驱动.
 * @param objId
 * @returns
 */
var Shanglingpjq = function(objId){
	this.setReady = function(){
		try{
			if(document.getElementById(objId).setReady()==1){
				return 1;
			}else{
				return -1;
			}
		}catch(e){
			return -1;
		}
	}
	/**
	 * 欢迎光临
	 */
	this.welcome = function(){
		try{
			document.getElementById(objId).welcome();
		}catch(e){}
	}
	/**
	 * 超时时间
	 * @param time 超时时间
	 * @param tid 票号
	 * @param callback回调函数
	 */
	this.receive = function(time,callback){
		$(document).mask($.i18n.prop('server.waiting.evaluation'));
		var presult = -1;
		try{
			presult = document.getElementById(objId).appriseKeys(timeoutSec);
			if (presult > 0) {
				document.getElementById(objId).thanks();
			}
		}catch(e){}
		//评价结果
		var evalRet = default_eval;
		switch(presult){
			case 1: evalRet = 5;break;//"非常满意\n";break;
			case 2: evalRet = 4;break;//"基本满意\n";break;
			case 3: evalRet = 3;break;//"态度不好\n";break;
			case 4: evalRet = 2;break;//"时间太长\n";break;
			case 5: evalRet = 1;break;//"业务不熟\n";break;
			case 6: evalRet = 0;break;//"其它\n";break;
			default: evalRet = default_eval;//
		}
		$(document).unmask();
		callback(evalRet);
	}
	this.setStars = function(star){
		try{
			document.getElementById(objId).sendStars(star);
		}catch(e){}
	}
}

/**
 * 东岘源评价器(4按键),只有云浮在使用
 * @param objId
 * @returns
 */
var DongxyEval4Key = function(objId){
	this.setReady = function(){
		try{
			if(true){
				return 1;
			}else{
				return -1;
			}
		}catch(e){
			return -1;
		}
	}
	/**
	 * 欢迎光临
	 */
	this.welcome = function(){
		try{
			document.getElementById(objId).object.VGREET=1;
		}catch(e){}
	}
	this.setStars = function(star){
		try{
			document.getElementById(objId).object.STAR = star;
		}catch(e){}
	}
	/**
	 * 超时时间
	 * @param time 超时时间
	 * @param tid 票号
	 * @param callback回调函数
	 */
	this.receive = function(time,callback){
		$(document).mask($.i18n.prop('server.waiting.evaluation'));
		try{
			document.getElementById(objId).object.Markscore = 0;
			document.getElementById(objId).object.VMARK=1;
			}catch(e){}
		//15秒完成评价
		var secCount = 0;
		var presult = -1;
		this.autoAdd = function(){
			secCount = secCount+1;
			try{
				presult =  document.getElementById(objId).object.Markscore;
			}catch(e){}
			//已评价或评价超时
			if((presult > 0)|| secCount >= time){
				clearInterval(timer);
				if(presult <= 0){
					//alert("评价超时");
					presult = -1;
				}else{
					try{
						document.getElementById(objId).object.ENDMARK=1;
					}catch(e){}
				}
				//评价结果
				var evalRet = default_eval;
				switch(presult){
					case 1: evalRet = 4;break;//"按键一(从左数起) 满意\n";break;
					case 2: evalRet = 3;break;//"按键二 \n";break;
					case 3: evalRet = 2;break;//"按键三 \n";break; //其他
					case 4: evalRet = 1;break;//"按键四\n";break; //不满意
					//case 5: evalRet = 0;break;//"业务不熟\n";break;
					//case 6: evalRet = 0;break;//"其它\n";break;
					default: evalRet = default_eval;//
				}
				$(document).unmask();
				callback(evalRet);
			}
		}
		var timer = setInterval(this.autoAdd, 1000);
	}
}

/**
 * 优胜US-52 6键评价器
 * @param objId
 * @returns
 */
var UsingEval = function(objId){
    this.setReady = function(){
        try{
            //自动获取并设置评价器使用的COM端口
            var comPort = "COM" + document.getElementById(objId).GetEvaCom();
            //alert("初始化,可用串口为:" + comPort);
            if(document.getElementById(objId).setCom(comPort) > 0){
                return 1;
            }else{
            	//alert("评价器故障,设置可用串口失败");
                return -1;
            }
        }catch(e){
            return -1;
        }
    }
    this.welcome = function(){
        try{
            document.getElementById(objId).EvaPlease(3,0,0);
        }catch(e){}
    }
    this.receive = function(time,callback){
        $(document).mask($.i18n.prop('server.waiting.evaluation'));
        var timeRemain = time;
        var key;
        try{
            if(document.getElementById(objId).EvaPlease(0,0,0) > 0){
                key = document.getElementById(objId).GetEvaResult(time);
            }
        }catch(e){}
        var evalRet = default_eval;
        switch(key){
            case 1: evalRet = 5;break;//"非常满意\n";break;
            case 2: evalRet = 4;break;//"基本满意\n";break;
            case 3: evalRet = 3;break;//"态度不好\n";break;
            case 4: evalRet = 2;break;//"时间太长\n";break;
            case 5: evalRet = 1;break;//"业务不熟\n";break;
            case 6: evalRet = 0;break;//"其它\n";break;
            default: evalRet = default_eval;//"超时或出错\n";
        }
        $(document).unmask();
        callback(evalRet);
    }
    this.setStars = function(star){
        try{
        	this.setReady();
            document.getElementById(objId).EvaPlease(5,star,0);
        }catch(e){}
    }
}

/**
 * 永泰 4键评价器
 * @param objId
 * @returns
 */
var YTPJQEval = function(objId){
	
}
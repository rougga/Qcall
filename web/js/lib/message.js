var cur_mes_win;
//消息构造
function CLASS_MSN_MESSAGE(id,width,height,caption,title,message,target,action){  
    this.id     = id;  
    this.title  = title;  
    this.caption= caption;  
    this.message= message;  
    this.target = target;  
    this.action = action;  
    this.width    = width?width:270;  
    this.height = height?height:120;  
    this.timeout= 1000;  
    this.speed    = 1;
    this.step    = 3; 
    this.right    = screen.width -1;  
    this.bottom = screen.height - 40;
    this.left    = this.right - this.width;
    this.top    = this.bottom - this.height; 
    this.timer    = 0; 
    this.pause    = false;
    this.close    = false;
    this.autoHide    = true;
}

//设置显示超时时间
CLASS_MSN_MESSAGE.prototype.setTimeOut = function(s) {
	this.timeout = s;
}

//隐藏消息方法 
CLASS_MSN_MESSAGE.prototype.hide = function(){  
    if(this.onunload())
    {  
      var offset  = this.height>this.bottom-this.top?this.height:this.bottom-this.top; 
      var me  = this;  
      if(this.timer>0)
      {   
        window.clearInterval(me.timer);  
      }  
      var fun = function()
      {  
          if(me.pause==false||me.close)
          {
          var x  = me.left; 
          var y  = 0; 
          var width = me.width; 
          var height = 0; 
          if(me.offset>0)
          { 
            height = me.offset; 
          } 
          y  = me.bottom - height; 
          if(y>=me.bottom)
          { 
            window.clearInterval(me.timer);  
            me.Pop.hide();
              cur_mes_win = null;
          } 
          else
          { 
            me.offset = me.offset - me.step;  
          } 
          me.Pop.show(x,y,width,height);    
        }             
      }  
    this.timer = window.setInterval(fun,this.speed)      
      }  
}
//消息卸载事件，可以重写
CLASS_MSN_MESSAGE.prototype.onunload = function()
{  
    return true;  
}  
//消息命令事件，要实现自己的连接，请重写它
CLASS_MSN_MESSAGE.prototype.oncommand = function()
{  
    this.close = true;
    this.action.call(this);
    this.hide();  
}  
//消息显示方法
CLASS_MSN_MESSAGE.prototype.show = function()
{
    var oPopup;
    try {
        if (cur_mes_win != null) {
            cur_mes_win.close = true;
            cur_mes_win.hide();
        }
    oPopup = window.createPopup(); //IE5.5+
    }catch(e){
        return;
    }
    this.Pop = oPopup;
    var w = this.width;  
    var h = this.height;
    /*
    var str  = " <div style='width:"+w+"px;HEIGHT: " + h + "px;border:1px solid #bdd7f2;' > "
    str += "<div style='width:"+w+"px;background-color:#f3f7f9;'><img src='script/client/message/tc_03.jpg' /><a href='#' id='btSysClose'><img src='script/client/message/tc_04.jpg' alt='' width='28' height='25' border='0'/></a></div> "
	str += "<div style='font-size:12px; color:#2f4f5f; padding:10px; line-height:20px;height:"+h+"px'> "
	str +=this.message + "</div> "
	str += "</div> " 
	*/
    var str = "";
	str += '<div style="border:1px solid #D1E3F6;">';
	str +=	'<table border="0" cellspacing="0" cellpadding="0" style="width:100%;"><tr style="background-color: #D1E3F6;"><td style="padding:5px;">'
	str +=	'<span style="font-size: 14px;font-weight: bold;color: #0B2B5F;">'+this.title+'</span>'
	str +=	'</td><td style="width:50px;padding:5px;">'
	str +=	'<span id="btSysClose" style="font-size: 14px;float:right;cursor:pointer;color: red;">close</span>'
	str +='</td></tr></table>';
	str += '<div style="padding:10px;font-size:14px; color:#2f4f5f;height:'+(h - 20)+'px;">';
	str += this.message;
	str += '</div>'
	/*str +=   '<table width="100%" border="0" cellspacing="10" cellpadding="0">';
	str +=     '<tr>';
	str +=       '<td height="62px" style="font-size:14px; color:#2f4f5f; padding:10px; padding-top:0;vertical-align: top;">';
	str += this.message;
	str +=       '</td>';
	str +=     '</tr>';
	str +=   '</table>';
	str +=     '<table width="100%" border="0" cellspacing="0" cellpadding="0">';
	str +=       '<tr>';
	str +=         '<td style="background-color:#F9FAFB;border-top-width:1px;border-top-style:solid;border-top-color:#EAF1F5;padding:3px 8px;"><table border="0" align="right" cellpadding="0" cellspacing="0">';
	str +=           '<tr>';
	str +=             '<td><a href="javascript:void(0);" id="btSysClose" style="float:right;"><img src="./btn_01.gif" width="24" height="24" border="0"/></a></td>';
	str +=           '</tr>';
	str +=         '</table></td>';
	str +=      '</tr>';
	str +=     '</table>';*/
	str += '</div>';
    
    oPopup.document.body.innerHTML = str; 
    this.offset  = 0;
    var me  = this;
    oPopup.document.body.onmouseover = function(){me.pause=true;}
    oPopup.document.body.onmouseout = function(){me.pause=false;}
    var fun = function()
    {
      var x  = me.left;
      var y  = 0;
      var width    = me.width;
      var height    = me.height;
      if(me.offset>me.height)
      {
        height = me.height;
      }
      else
      {
        height = me.offset;
      }
      y  = me.bottom - me.offset;
      if(y<=me.top)
      {
        me.timeout--;
        if(me.timeout==0)
        {
          window.clearInterval(me.timer);
          if(me.autoHide)
          {
            me.hide();
          }
        }
      }
      else
      {
        me.offset = me.offset + me.step;
      }
      me.Pop.show(x,y,width,height);
    }
    this.timer = window.setInterval(fun,this.speed)
    var btClose = oPopup.document.getElementById("btSysClose");
    btClose.onclick = function()
    {  
      me.close = true;
      me.hide();  
    }  
    
    var btCommand = oPopup.document.getElementById("viewMore");  
    if(btCommand != null){
    	btCommand.onclick = function()
	    {  
	      me.oncommand();  
	    } 
    }
    cur_mes_win = this;
}  
//设置速度方法 
CLASS_MSN_MESSAGE.prototype.speed = function(s){ 
    var t = 10; 
    try { 
        t = praseInt(s); 
    } catch(e){} 
    this.speed = t; 
} 
//设置步长方法 
CLASS_MSN_MESSAGE.prototype.step = function(s){ 
    var t = 1; 
    try { 
        t = praseInt(s); 
    } catch(e){} 
    this.step = t; 
}
//调用函数 
CLASS_MSN_MESSAGE.prototype.rect = function(left,right,top,bottom){ 
    try { 
        this.left        = left    !=null?left:this.right-this.width; 
        this.right        = right    !=null?right:this.left +this.width; 
        this.bottom        = bottom!=null?(bottom>screen.height?screen.height:bottom):screen.height;
        this.top        = top    !=null?top:this.bottom - this.height; 
    } catch(e){} 
} 

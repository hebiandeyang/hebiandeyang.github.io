// START OF Advanced SmartSource Data Collector TAG
// Copyright (c) 1996-2007 WebTrends Inc. All rights reserved.
// V8.0d
// $DateTime: 2007/02/14 15:39:59 $
var gService = false;
var gTimeZone = 8;
// Code section for Enable First-Party Cookie Tracking
function dcsCookie(){
	if (typeof(dcsOther)=="function"){
		dcsOther();
	}
	else if (typeof(dcsPlugin)=="function"){
		dcsPlugin();
	}
	else if (typeof(dcsFPC)=="function"){
		dcsFPC(gTimeZone);
	}
}
function dcsGetCookie(name){
	var pos=document.cookie.indexOf(name+"=");
	if (pos!=-1){
		var start=pos+name.length+1;
		var end=document.cookie.indexOf(";",start);
		if (end==-1){
			end=document.cookie.length;
		}
		return unescape(document.cookie.substring(start,end));
	}
	return null;
}
function dcsGetCrumb(name,crumb){
	var aCookie=dcsGetCookie(name).split(":");
	for (var i=0;i<aCookie.length;i++){
		var aCrumb=aCookie[i].split("=");
		if (crumb==aCrumb[0]){
			return aCrumb[1];
		}
	}
	return null;
}
function dcsGetIdCrumb(name,crumb){
	var cookie=dcsGetCookie(name);
	var id=cookie.substring(0,cookie.indexOf(":lv="));
	var aCrumb=id.split("=");
	for (var i=0;i<aCrumb.length;i++){
		if (crumb==aCrumb[0]){
			return aCrumb[1];
		}
	}
	return null;
}
function dcsFPC(offset){
	if (typeof(offset)=="undefined"){
		return;
	}
	if (document.cookie.indexOf("WTLOPTOUT=")!=-1){
		return;
	}
	var name=gFpc;
	var dCur=new Date();
	var adj=(dCur.getTimezoneOffset()*60000)+(offset*3600000);
	dCur.setTime(dCur.getTime()+adj);
	var dExp=new Date(dCur.getTime()+315360000000);
	var dSes=new Date(dCur.getTime());
	WT.co_f=WT.vt_sid=WT.vt_f=WT.vt_f_a=WT.vt_f_s=WT.vt_f_d=WT.vt_f_tlh=WT.vt_f_tlv="";
	if (document.cookie.indexOf(name+"=")==-1){
		if ((typeof(gWtId)!="undefined")&&(gWtId!="")){
			WT.co_f=gWtId;
		}
		else if ((typeof(gTempWtId)!="undefined")&&(gTempWtId!="")){
			WT.co_f=gTempWtId;
			WT.vt_f="1";
		}
		else{
			WT.co_f="2";
			var cur=dCur.getTime().toString();
			for (var i=2;i<=(32-cur.length);i++){
				WT.co_f+=Math.floor(Math.random()*16.0).toString(16);
			}
			WT.co_f+=cur;
			WT.vt_f="1";
		}
		if (typeof(gWtAccountRollup)=="undefined"){
			WT.vt_f_a="1";
		}
		WT.vt_f_s=WT.vt_f_d="1";
		WT.vt_f_tlh=WT.vt_f_tlv="0";
	}
	else{
		var id=dcsGetIdCrumb(name,"id");
		var lv=parseInt(dcsGetCrumb(name,"lv"));
		var ss=parseInt(dcsGetCrumb(name,"ss"));
		if ((id==null)||(id=="null")||isNaN(lv)||isNaN(ss)){
			return;
		}
		WT.co_f=id;
		var dLst=new Date(lv);
		WT.vt_f_tlh=Math.floor((dLst.getTime()-adj)/1000);
		dSes.setTime(ss);
		if ((dCur.getTime()>(dLst.getTime()+1800000))||(dCur.getTime()>(dSes.getTime()+28800000))){
			WT.vt_f_tlv=Math.floor((dSes.getTime()-adj)/1000);
			dSes.setTime(dCur.getTime());
			WT.vt_f_s="1";
		}
		if ((dCur.getDay()!=dLst.getDay())||(dCur.getMonth()!=dLst.getMonth())||(dCur.getYear()!=dLst.getYear())){
			WT.vt_f_d="1";
		}
	}
	WT.co_f=escape(WT.co_f);
	WT.vt_sid=WT.co_f+"."+(dSes.getTime()-adj);
	var expiry="; expires="+dExp.toGMTString();
	document.cookie=name+"="+"id="+WT.co_f+":lv="+dCur.getTime().toString()+":ss="+dSes.getTime().toString()+expiry+"; path=/"+(((typeof(gFpcDom)!="undefined")&&(gFpcDom!=""))?("; domain="+gFpcDom):(""));
	if (document.cookie.indexOf(name+"=")==-1){
		WT.co_f=WT.vt_sid=WT.vt_f_s=WT.vt_f_d=WT.vt_f_tlh=WT.vt_f_tlv="";
		WT.vt_f=WT.vt_f_a="2";
	}
}

// Add dcsOther() here if using existing first-party cookie, or dcsPlugin() here if using WT Cookie Plugin

// Code section for Set the First-Party Cookie domain
//var gFpcDom=".webtrends.com";

// Code section for Enable Event Tracking
function dcsParseSvl(sv){
	sv=sv.split(" ").join("");
	sv=sv.split("\t").join("");
	sv=sv.split("\n").join("");
	var pos=sv.toUpperCase().indexOf("WT.SVL=");
	if (pos!=-1){
		var start=pos+8;
		var end=sv.indexOf('"',start);
		if (end==-1){
			end=sv.indexOf("'",start);
			if (end==-1){
				end=sv.length;
			}
		}
		return sv.substring(start,end);
	}
	return "";
}
function dcsIsOnsite(host){
	var doms="cnr.cn";
    var aDoms=doms.split(',');
    for (var i=0;i<aDoms.length;i++){
		if (host.indexOf(aDoms[i])!=-1){
		       return 1;
		}
    }
    return 0;
}
function dcsIsHttp(e){
	return (e.href&&e.protocol&&(e.protocol.indexOf("http")!=-1))?true:false;
}
function dcsTypeMatch(path, typelist){
	var type=path.substring(path.lastIndexOf(".")+1,path.length);
	var types=typelist.split(",");
	for (var i=0;i<types.length;i++){
		if (type==types[i]){
			return true;
		}
	}
	return false;
}
function dcsEvt(evt,tag){
	var e=evt.target||evt.srcElement;
	while (e.tagName&&(e.tagName!=tag)){
		e=e.parentElement||e.parentNode;
	}
	return e;
}
function dcsBind(event,func){
	if ((typeof(window[func])=="function")&&document.body){
		if (document.body.addEventListener){
			document.body.addEventListener(event, window[func], true);
		}
		else if(document.body.attachEvent){
			document.body.attachEvent("on"+event, window[func]);
		}
	}
}
function dcsET(){
	var e=(navigator.appVersion.indexOf("MSIE")!=-1)?"click":"mousedown";
	dcsBind(e,"dcsDownload");
	dcsBind(e,"dcsDynamic");
	dcsBind(e,"dcsFormButton");
	dcsBind(e,"dcsOffsite");
	dcsBind(e,"dcsAnchor");
	dcsBind("mousedown","dcsRightClick");
}
	
function dcsMultiTrack(){
	if (arguments.length%2==0){
		for (var i=0;i<arguments.length;i+=2){
			if (arguments[i].indexOf('WT.')==0){
				WT[arguments[i].substring(3)]=arguments[i+1];
			}
			else if (arguments[i].indexOf('DCS.')==0){
				DCS[arguments[i].substring(4)]=arguments[i+1];
			}
			else if (arguments[i].indexOf('DCSext.')==0){
				DCSext[arguments[i].substring(7)]=arguments[i+1];
			}
		}
		var dCurrent=new Date();
		DCS.dcsdat=dCurrent.getTime();
		dcsFunc("dcsCookie");
		WT.ti=gI18n?dcsEscape(dcsEncode(WT.ti),I18NRE):WT.ti;
		//dcsPrintVariables();		//测试时请打开
		dcsTag();
	}
}

// Add event handlers here
// Code section for Track clicks to download links.
function dcsDownload(evt){
	evt=evt||(window.event||"");
	if (evt&&((typeof(evt.which)!="number")||(evt.which==1))){
		var e=dcsEvt(evt,"A");
		if (e.hostname&&dcsIsOnsite(e.hostname)){
			var types="jpg";
			if (dcsTypeMatch(e.pathname,types)){
				var qry=e.search?e.search.substring(e.search.indexOf("?")+1,e.search.length):"";
				if (qry.toUpperCase().indexOf("WT.SVL=")==-1){
					WT.svl=dcsParseSvl(e.name?e.name.toString():(e.onclick?e.onclick.toString():""));
				}
				var path=e.pathname?((e.pathname.indexOf("/")!=0)?"/"+e.pathname:e.pathname):"/";
				dcsMultiTrack("DCS.dcssip",e.hostname,"DCS.dcsuri",path,"DCS.dcsqry",e.search||"","WT.ti","Download:"+(e.innerHTML||""),"WT.dl","1");
				DCS.dcssip=DCS.dcsuri=DCS.dcsqry=WT.ti=WT.svl=WT.dl="";
			}
		}
	}
}


function dcsAdv(){
	dcsFunc("dcsET");
	dcsFunc("dcsCookie");
	dcsFunc("dcsAdSearch");
	dcsFunc("dcsTP");
}
// END OF Advanced SmartSource Data Collector TAG

// START OF Basic SmartSource Data Collector TAG
// Copyright (c) 1996-2007 WebTrends Inc. All rights reserved.
// V8.0
// $DateTime: 2007/02/14 15:39:59 $
var gImages=new Array;
var gIndex=0;
var DCS=new Object();
var WT=new Object();
var DCSext=new Object();
var gQP=new Array();
var gI18n=true;
if (window.RegExp){
	var RE={"%09":/\t/g,"%20":/ /g,"%23":/\#/g,"%26":/\&/g,"%2B":/\+/g,"%3F":/\?/g,"%5C":/\\/g,"%22":/\"/g,"%7F":/\x7F/g,"%A0":/\xA0/g};
	var I18NRE={"%25":/\%/g};
}

// Add customizations here

function dcsVar(){
	var dCurrent=new Date();
	WT.tz=dCurrent.getTimezoneOffset()/60*-1;
	if (WT.tz==0){
		WT.tz="0";
	}
	WT.bh=dCurrent.getHours();
	WT.ul=navigator.appName=="Netscape"?navigator.language:navigator.userLanguage;
	if (typeof(screen)=="object"){
		WT.cd=navigator.appName=="Netscape"?screen.pixelDepth:screen.colorDepth;
		WT.sr=screen.width+"x"+screen.height;
	}
	if (typeof(navigator.javaEnabled())=="boolean"){
		WT.jo=navigator.javaEnabled()?"Yes":"No";
	}
	if (document.title){
// 去除标题中标签
		var tempti = "";
		var intag = false;
		for (var i = 0; i < document.title.length; i++) {
			if (intag == false) {
				if (document.title.charAt(i) == '<') {
					intag = true;
				} else {
					tempti += document.title.charAt(i);
				}
			} else {
				if (document.title.charAt(i) == '>') {
					intag = false;
				} 
			}
		}
		WT.ti=gI18n?dcsEscape(dcsEncode(tempti),I18NRE):tempti;
//		WT.ti=gI18n?dcsEscape(dcsEncode(document.title),I18NRE):document.title;
	}
	WT.js="Yes";
	WT.jv=dcsJV();
	if (document.body&&document.body.addBehavior){
		document.body.addBehavior("#default#clientCaps");
		WT.ct=document.body.connectionType||"unknown";
		document.body.addBehavior("#default#homePage");
		WT.hp=document.body.isHomePage(location.href)?"1":"0";
	}
	else{
		WT.ct="unknown";
	}
	if (parseInt(navigator.appVersion)>3){
		if ((navigator.appName=="Microsoft Internet Explorer")&&document.body){
			WT.bs=document.body.offsetWidth+"x"+document.body.offsetHeight;
		}
		else if (navigator.appName=="Netscape"){
			WT.bs=window.innerWidth+"x"+window.innerHeight;
		}
	}
	WT.fi="No";
	if (window.ActiveXObject){
		for(var i=10;i>0;i--){
			try{
				var flash = new ActiveXObject("ShockwaveFlash.ShockwaveFlash."+i);
				WT.fi="Yes";
				WT.fv=i+".0";
				break;
			}
			catch(e){
			}
		}
	}
	else if (navigator.plugins&&navigator.plugins.length){
		for (var i=0;i<navigator.plugins.length;i++){
			if (navigator.plugins[i].name.indexOf('Shockwave Flash')!=-1){
				WT.fi="Yes";
				WT.fv=navigator.plugins[i].description.split(" ")[2];
				break;
			}
		}
	}
	if (gI18n){
		WT.em=(typeof(encodeURIComponent)=="function")?"uri":"esc";
		if (typeof(document.defaultCharset)=="string"){
			WT.le=document.defaultCharset;
		} 
		else if (typeof(document.characterSet)=="string"){
			WT.le=document.characterSet;
		}
	}
	WT.tv="8.0.2";
//	WT.sp="@@SPLITVALUE@@";
	DCS.dcsdat=dCurrent.getTime();
	DCS.dcssip=window.location.hostname;
	DCS.dcsuri=window.location.pathname;
	if (window.location.search){
		DCS.dcsqry=window.location.search;
		if (gQP.length>0){
			for (var i=0;i<gQP.length;i++){
				var pos=DCS.dcsqry.indexOf(gQP[i]);
				if (pos!=-1){
					var front=DCS.dcsqry.substring(0,pos);
					var end=DCS.dcsqry.substring(pos+gQP[i].length,DCS.dcsqry.length);
					DCS.dcsqry=front+end;
				}
			}
		}
	}
	if ((window.document.referrer!="")&&(window.document.referrer!="-")){
		if (!(navigator.appName=="Microsoft Internet Explorer"&&parseInt(navigator.appVersion)<4)){
			DCS.dcsref=gI18n?dcsEscape(window.document.referrer, I18NRE):window.document.referrer;
		}
	}
}

function dcsA(N,V){
	return "&"+N+"="+dcsEscape(V, RE);
}

function dcsEscape(S, REL){
	if (typeof(REL)!="undefined"){
		var retStr = new String(S);
		for (var R in REL){
			retStr = retStr.replace(REL[R],R);
		}
		return retStr;
	}
	else{
		return escape(S);
	}
}

function dcsEncode(S){
	return (typeof(encodeURIComponent)=="function")?encodeURIComponent(S):escape(S);
}

function dcsCreateImage(dcsSrc){
	if (document.images){
		gImages[gIndex]=new Image;
		gImages[gIndex].src=dcsSrc;
		gIndex++;
	}
	else{
		document.write('<IMG ALT="" BORDER="0" NAME="DCSIMG" WIDTH="1" HEIGHT="1" SRC="'+dcsSrc+'">');
	}
}

function dcsMeta(){
	var elems;
	if (document.all){
		elems=document.all.tags("meta");
	}
	else if (document.documentElement){
		elems=document.getElementsByTagName("meta");
	}
	if (typeof(elems)!="undefined"){
		var length=elems.length;
		for (var i=0;i<length;i++){
			var name=elems.item(i).name;
			var content=elems.item(i).content;
			var equiv=elems.item(i).httpEquiv;
			if (name.length>0){
				if (name.indexOf("WT.")==0){
					var encode=false;
					if (gI18n){
						var params=["mc_id","oss","ti","cg_n"];
						for (var j=0;j<params.length;j++){
							if (name.indexOf("WT."+params[j])==0){
								encode=true;
								break;
							}
						}
					}
					WT[name.substring(3)]=encode?dcsEscape(dcsEncode(content),I18NRE):content;
				}
				else if (name.indexOf("DCSext.")==0){
					DCSext[name.substring(7)]=content;
				}
				else if (name.indexOf("DCS.")==0){
					DCS[name.substring(4)]=(gI18n&&(name.indexOf("DCS.dcsref")==0))?dcsEscape(content,I18NRE):content;
				}
			}
			else if (gI18n&&(equiv=="Content-Type")){
				var pos=content.toLowerCase().indexOf("charset=");
				if (pos!=-1){
					WT.mle=content.substring(pos+8);
				}
			}
		}
	}
}

function dcsTag(){
	if (document.cookie.indexOf("WTLOPTOUT=")!=-1){
		return;
	}
	var P="http"+(window.location.protocol.indexOf('https:')==0?'s':'')+"://"+gDomain+(gDcsId==""?'':'/'+gDcsId)+"/dcs.gif?";
	for (var N in DCS){
		if (DCS[N]) {
			P+=dcsA(N,DCS[N]);
		}
	}
	var keys=["co_f","vt_sid","vt_f_tlv"];
	for (var i=0;i<keys.length;i++){
		var key=keys[i];
		if (WT[key]){
			P+=dcsA("WT."+key,WT[key]);
			delete WT[key];
		}
	}
	for (N in WT){
		if (WT[N]) {
			P+=dcsA("WT."+N,WT[N]);
		}
	}
	for (N in DCSext){
		if (DCSext[N]) {
			P+=dcsA(N,DCSext[N]);
		}
	}
	if (P.length>2048&&navigator.userAgent.indexOf('MSIE')>=0){
		P=P.substring(0,2040)+"&WT.tu=1";
	}
	dcsCreateImage(P);
}

function dcsPrintVariables()
{
	var tagVariables="\nDomain = "+gDomain;
	tagVariables+="\nDCSId = "+gDcsId;
	for (N in DCS){
		tagVariables+="\nDCS."+N+" = "+DCS[N];
	}
	for (N in WT){
		tagVariables+="\nWT."+N+" = "+WT[N];
	}
	for (N in DCSext){
		tagVariables+="\nDCSext."+N+" = "+DCSext[N];
	}
	window.alert(tagVariables);
}

function dcsJV(){
	var agt=navigator.userAgent.toLowerCase();
	var major=parseInt(navigator.appVersion);
	var mac=(agt.indexOf("mac")!=-1);
	var ff=(agt.indexOf("firefox")!=-1);
	var ff0=(agt.indexOf("firefox/0.")!=-1);
	var ff10=(agt.indexOf("firefox/1.0")!=-1);
	var ff15=(agt.indexOf("firefox/1.5")!=-1);
	var ff2up=(ff&&!ff0&&!ff10&!ff15);
	var nn=(!ff&&(agt.indexOf("mozilla")!=-1)&&(agt.indexOf("compatible")==-1));
	var nn4=(nn&&(major==4));
	var nn6up=(nn&&(major>=5));
	var ie=((agt.indexOf("msie")!=-1)&&(agt.indexOf("opera")==-1));
	var ie4=(ie&&(major==4)&&(agt.indexOf("msie 4")!=-1));
	var ie5up=(ie&&!ie4);
	var op=(agt.indexOf("opera")!=-1);
	var op5=(agt.indexOf("opera 5")!=-1||agt.indexOf("opera/5")!=-1);
	var op6=(agt.indexOf("opera 6")!=-1||agt.indexOf("opera/6")!=-1);
	var op7up=(op&&!op5&&!op6);
	var jv="1.1";
	if (ff2up){
		jv="1.7";
	}
	else if (ff15){
		jv="1.6";
	}
	else if (ff0||ff10||nn6up||op7up){
		jv="1.5";
	}
	else if ((mac&&ie5up)||op6){
		jv="1.4";
	}
	else if (ie5up||nn4||op5){
		jv="1.3";
	}
	else if (ie4){
		jv="1.2";
	}
	return jv;
}

function dcsFunc(func){
	if (typeof(window[func])=="function"){
		window[func]();
	}
}

dcsVar();
dcsMeta();
dcsFunc("dcsAdv");
dcsTag();

// 开始音视频部分统计
var gMediaDomain="sdcm.cnr.cn";
gDomain = gMediaDomain;
var gMediaDcsId = "dcscduu5s00000clg0o5ips1f_8t9p";
gDcsId = gMediaDcsId;

var wtMediaPlayerStateArr = new Array();
wtMediaPlayerStateArr[0] = "INIT";
wtMediaPlayerStateArr[1] = "STOP";
wtMediaPlayerStateArr[2] = "PAUSE";
wtMediaPlayerStateArr[3] = "PLAY";
wtMediaPlayerStateArr[4] = "FORWARD";
wtMediaPlayerStateArr[5] = "REVERSE";
wtMediaPlayerStateArr[6] = "BUFFER";
wtMediaPlayerStateArr[7] = "WAIT";
wtMediaPlayerStateArr[8] = "COMPLETE";
wtMediaPlayerStateArr[9] = "PREPARE";
wtMediaPlayerStateArr[10] = "READY";
wtMediaPlayerStateArr[11] = "RECONNECT";

var wtMediaPlayerStateNameArr = new Array();
wtMediaPlayerStateNameArr[0] = "初始";
wtMediaPlayerStateNameArr[1] = "停止";
wtMediaPlayerStateNameArr[2] = "暂停";
wtMediaPlayerStateNameArr[3] = "播放";
wtMediaPlayerStateNameArr[4] = "前进";
wtMediaPlayerStateNameArr[5] = "后退";
wtMediaPlayerStateNameArr[6] = "缓冲";
wtMediaPlayerStateNameArr[7] = "等待";
wtMediaPlayerStateNameArr[8] = "结束";
wtMediaPlayerStateNameArr[9] = "准备";
wtMediaPlayerStateNameArr[10] = "就绪";
wtMediaPlayerStateNameArr[11] = "重连";

var wtMediaPlayerObjectId = "WMPlayer";

var wtMediaPlayerLastState = -1;

var wtCurrentSysId = "";

var WT_VALID_PLAY_MINITES_YPSJ = 1;	//音频世界有效播放时间设为1分钟
var WT_VALID_PLAY_MINITES_ZB = 1;	//直播有效播放时间设为1分钟
var WT_VALID_PLAY_MINITES_DB = 1;	//点播有效播放时间设为1分钟
var WT_VALID_PLAY_MINITES_XWNQ = 1;	//新闻内嵌有效播放时间设为1分钟

var wtValidPlayMiniutes = 1;	//默认有效播放时间设为1分钟

var wtMediaPlayMunites = 0;

WT["cnr_page_url"] = "http://" + window.location.hostname + window.location.pathname;
// WT["cnr_page_title"] = WT.ti;

function wtSetMediaType(media_type) {
	WT["cnr_media_type"] = media_type;
	if (media_type == "ypsj") {
		wtSetValidPlayMiniutes(WT_VALID_PLAY_MINITES_YPSJ);
	} else if (media_type == "zb") {
		wtSetValidPlayMiniutes(WT_VALID_PLAY_MINITES_ZB);
	} else if (media_type == "db") {
		wtSetValidPlayMiniutes(WT_VALID_PLAY_MINITES_DB);
	} else if (media_type == "xwnq") {
		wtSetValidPlayMiniutes(WT_VALID_PLAY_MINITES_XWNQ);
	} 
}

function wtSetMediaPlayerObject(oid) {
	wtMediaPlayerObjectId = oid;
	wtCheckMediaPlayerState();
	setInterval("wtCheckMediaPlayerState()", 1000);
}

function wtBeginNewMediaByXwnq(editor) {
	delete WT["cnr_editor"];
	wtSetMediaType("xwnq");
	WT["cnr_editor"] = gI18n?dcsEscape(dcsEncode(editor),I18NRE):editor;
	wtBeginNewMediaAction();
}

function wtSetValidPlayMiniutes(mins) {
	wtValidPlayMiniutes = mins;
}

function wtBeginNewMedia(media_id, media_type) {
	delete WT["cnr_media_id"];
	delete WT["cnr_media_type"];
	wtSetMediaType(media_type.toLowerCase());
	WT["cnr_media_id"] = media_id;
	wtBeginNewMediaAction();
}

function wtBeginNewMediaAction() {
	wtCurrentSysId = new Date().getTime();
	wtPlayMunites = 0;
	wtTrackMediaPlay('begin', '/BeginNewMedia', 'BeginNewMedia', '1', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0');
	setTimeout("wtMediaPlay(" + wtCurrentSysId + ", 1)", 1000 * 60);
}

function wtMediaPlay(sysid, mins) {
	var play_valid = '0';
	var play_1m = '0';
	var play_3m = '0';
	var play_5m = '0';
	var play_8m = '0';
	var play_10m = '0';
	var play_20m = '0';
	var play_30m = '0';
	var play_60m = '0';
	if (sysid == wtCurrentSysId) {
		wtPlayMunites = wtPlayMunites + mins;
		if (wtPlayMunites == wtValidPlayMiniutes) {
			play_valid = '1';
		} 
		if (wtPlayMunites == 1) {
			play_1m = '1';
		} else if (wtPlayMunites == 3) {
			play_3m = '1';
		} else if (wtPlayMunites == 5) {
			play_5m = '1';
		} else if (wtPlayMunites == 8) {
			play_8m = '1';
		} else if (wtPlayMunites == 10) {
			play_10m = '1';
		} else if (wtPlayMunites == 20) {
			play_20m = '1';
		} else if (wtPlayMunites == 30) {
			play_30m = '1';
		} else if (wtPlayMunites == 60) {
			play_60m = '1';
		}
		wtTrackMediaPlay('play', '/MediaPlay', 'MediaPlay', '0', play_valid, mins, play_1m, play_3m, play_5m, play_8m, play_10m, play_20m, play_30m, play_60m);
		setTimeout("wtMediaPlay(" + wtCurrentSysId + ", 1)", 1000 * 60);
	} else {
//		alert("Media has been changed!");
	}
}

function wtTrackMediaPlay(event_type, uri, ti, play_begin, play_valid, play_mins, play_1m, play_3m, play_5m, play_8m, play_10m, play_20m, play_30m, play_60m) {
	dcsMultiTrack('WT.cnr_event_type', event_type, 'DCS.dcsuri', uri, 'WT.ti', ti, 
		'WT.cnr_play_begin', play_begin, 'WT.cnr_play_valid', play_valid, 'WT.cnr_play_mins', play_mins, 
		'WT.cnr_play_1m', play_1m, 'WT.cnr_play_3m', play_3m, 'WT.cnr_play_5m', play_5m, 'WT.cnr_play_8m', play_8m, 
		'WT.cnr_play_10m', play_10m, 'WT.cnr_play_20m', play_20m, 'WT.cnr_play_30m', play_30m, 'WT.cnr_play_60m', play_60m);
	delete WT["cnr_play_begin"];
	delete WT["cnr_play_valid"];
	delete WT["cnr_play_mins"];
	delete WT["cnr_play_1m"];
	delete WT["cnr_play_3m"];
	delete WT["cnr_play_5m"];
	delete WT["cnr_play_8m"];
	delete WT["cnr_play_10m"];
	delete WT["cnr_play_20m"];
	delete WT["cnr_play_30m"];
	delete WT["cnr_play_60m"];
}

function wtCheckMediaPlayerState() {
	if (typeof(eval(wtMediaPlayerObjectId)) == "object") {
		var curSt = eval(wtMediaPlayerObjectId).playState;
		if (curSt != wtMediaPlayerLastState) {
			wtTrackMediaPlayerState(curSt);
			wtMediaPlayerLastState = curSt;
		}			
	}
}

function wtTrackMediaPlayerState(st) {
	dcsMultiTrack('WT.cnr_event_type', 'state', 'DCS.dcsuri', '/MediaPlayerStateChange_'+st+"_"+wtMediaPlayerStateArr[st], 'WT.ti', "MediaStateChange - "+wtMediaPlayerStateNameArr[st]);
}

//结束音视频部分统计

// END OF Basic SmartSource Data Collector TAG
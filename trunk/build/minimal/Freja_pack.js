if(typeof (dojo)!="undefined"){
dojo.provide("Freja");
}
if(typeof (Freja)=="undefined"){
Freja={};
}
Freja.NAME="Freja";
Freja.VERSION="2.1.2";
Freja.__repr__=function(){
return "["+this.NAME+" "+this.VERSION+"]";
};
Freja.toString=function(){
return this.__repr__();
};
Freja.Class={};
Freja.Class.extend=function(_1,_2){
var _3=function(){
};
_3.prototype=_2.prototype;
_1.prototype=new _3();
_1.prototype.constructor=_1;
_1.prototype.superconstructor=_2;
_1.prototype.supertype=_2.prototype;
};
if(typeof (Freja)=="undefined"){
Freja={};
}
Freja._aux={};
Freja._aux.bind=function(_4,_5){
if(typeof (_4)=="string"){
_4=_5[_4];
}
var _6=null;
if(typeof (_4.im_func)=="function"){
_6=_4.im_func;
}else{
_6=_4;
}
_4=function(){
return _4.im_func.apply(_4.im_self,arguments);
};
_4.im_func=_6;
_4.im_self=_5;
return _4;
};
Freja._aux.formContents=function(_7){
if(!_7){
_7=document;
}
var _8=[];
var _9=[];
var _a=_7.getElementsByTagName("INPUT");
for(var i=0;i<_a.length;++i){
var _c=_a[i];
if(_c.name){
if(_c.type=="radio"||_c.type=="checkbox"){
if(_c.checked){
_8.push(_c.name);
_9.push(_c.value);
}else{
_8.push(_c.name);
_9.push("");
}
}else{
_8.push(_c.name);
_9.push(_c.value);
}
}
}
var _d=_7.getElementsByTagName("TEXTAREA");
for(var i=0;i<_d.length;++i){
var _c=_d[i];
if(_c.name){
_8.push(_c.name);
_9.push(_c.value);
}
}
var _e=_7.getElementsByTagName("SELECT");
for(var i=0;i<_e.length;++i){
var _c=_e[i];
if(_c.name){
if(_c.selectedIndex>=0){
var _f=_c.options[_c.selectedIndex];
_8.push(_c.name);
_9.push((_f.value)?_f.value:"");
}
}
}
return [_8,_9];
};
Freja._aux.getElement=function(id){
if(typeof (id)=="object"){
return id;
}else{
return document.getElementById(id);
}
};
Freja._aux.connect=function(src,_12,fnc){
if(!src){
return;
}
if(src.addEventListener){
var _14=function(e){
var evt={stop:function(){
if(e.cancelable){
e.preventDefault();
}
e.stopPropagation();
}};
fnc(evt);
};
src.addEventListener(_12.replace(/^(on)/,""),_14,false);
}else{
if(src.attachEvent){
var _14=function(){
var e=window.event;
var evt={stop:function(){
e.cancelBubble=true;
e.returnValue=false;
}};
fnc(evt);
};
src.attachEvent(_12,_14);
}
}
if(!src._signals){
src._signals=[];
}
if(!src._signals[_12]){
src._signals[_12]=[];
}
src._signals[_12].push(fnc);
};
Freja._aux.signal=function(src,_1a){
try{
if(src._signals&&src._signals[_1a]){
var _1b=src._signals[_1a];
var _1c=[];
for(var i=2;i<arguments.length;i++){
_1c.push(arguments[i]);
}
for(var i=0;i<_1b.length;i++){
try{
_1b[i].apply(src,_1c);
}
catch(e){
}
}
}
}
catch(e){
}
};
Freja._aux.createDeferred=function(){
return new Freja._aux.Deferred();
};
Freja._aux.openXMLHttpRequest=function(_1e,url,_20,_21,_22){
var req=new XMLHttpRequest();
if(_21&&_22){
req.open(_1e,url,_20,_21,_22);
}else{
req.open(_1e,url,_20);
}
if(_1e=="POST"||_1e=="PUT"){
req.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
}
req.setRequestHeader("X-Requested-With","XMLHttpRequest");
return req;
};
Freja._aux.sendXMLHttpRequest=function(req,_25){
var d=Freja._aux.createDeferred();
var _27=false;
req.onreadystatechange=function(){
if(req.readyState==4&&!_27){
if(req.status==0||req.status==200||req.status==201||req.status==304){
d.callback(req);
}else{
d.errback(req);
}
_27=true;
}
};
if(!_25){
_25="";
}
req.send(_25);
return d;
};
Freja._aux.xmlize=Sarissa.xmlize;
Freja._aux.serializeXML=function(_28){
if(_28.xml){
return _28.xml;
}
return (new XMLSerializer()).serializeToString(_28);
};
Freja._aux.loadXML=function(_29){
return (new DOMParser()).parseFromString(_29,"text/xml");
};
Freja._aux.transformXSL=function(xml,xsl,_2c){
var _2d=new XSLTProcessor();
_2d.importStylesheet(xsl);
if(_2c){
for(var _2e in _2c){
_2d.setParameter("",_2e,_2c[_2e]);
}
}
return _2d.transformToFragment(xml,window.document);
};
Freja._aux.cloneXMLDocument=function(_2f){
var _30=null;
try{
_30=_2f.cloneNode(true);
}
catch(e){
}
if(!_30){
if(document.implementation&&document.implementation.createDocument){
_30=document.implementation.createDocument("",_2f.documentElement.nodeName,null);
var _31=_30.importNode(_2f.documentElement.cloneNode(true),true);
try{
_30.appendChild(_31);
}
catch(e){
var _32=_30.documentElement;
for(var i=_31.childNodes.length;i>=0;i--){
_32.insertBefore(_31.childNodes[i],_32.firstChild);
}
for(var i=0;i<_2f.documentElement.attributes.length;i++){
var _34=_2f.documentElement.attributes.item(i).name;
var _35=_2f.documentElement.attributes.item(i).value;
_30.documentElement.setAttribute(_34,_35);
}
}
}
}
return _30;
};
Freja._aux.hasSupportForXSLT=function(){
return (typeof (XSLTProcessor)!="undefined");
};
Freja._aux.createQueryEngine=function(){
if(Sarissa.IS_ENABLED_SELECT_NODES){
return new Freja.QueryEngine.XPath();
}else{
return new Freja.QueryEngine.SimplePath();
}
};
Freja._aux.Deferred=function(){
this._good=[];
this._bad=[];
this._pending=null;
};
Freja._aux.Deferred.prototype.callback=function(){
if(this._good.length==0){
this._pending=[this.callback,arguments];
return;
}
for(var i=0;i<this._good.length;i++){
this._good[i].apply(window,arguments);
}
this._good=[];
};
Freja._aux.Deferred.prototype.errback=function(){
if(this._bad.length==0){
this._pending=[this.errback,arguments];
return;
}
for(var i=0;i<this._bad.length;i++){
this._bad[i].apply(window,arguments);
}
this._bad=[];
};
Freja._aux.Deferred.prototype.addCallbacks=function(_38,_39){
if(_38){
this._good[this._good.length]=_38;
}
if(_39){
this._bad[this._bad.length]=_39;
}
if(this._pending){
this._pending[0].apply(this,this._pending[1]);
}
};
Freja._aux.Deferred.prototype.addCallback=function(_3a){
this.addCallbacks(_3a);
};
Freja._aux.Deferred.prototype.addErrback=function(_3b){
this.addCallbacks(null,_3b);
};
Freja._aux.importNode=function(_3c,_3d,_3e){
if(typeof _3e=="undefined"){
_3e=true;
}
if(_3c.importNode){
return _3c.importNode(_3d,_3e);
}else{
return _3d.cloneNode(_3e);
}
};
function Sarissa(){
}
Sarissa.VERSION="0.9.9.4";
Sarissa.PARSED_OK="Document contains no parsing errors";
Sarissa.PARSED_EMPTY="Document is empty";
Sarissa.PARSED_UNKNOWN_ERROR="Not well-formed or other error";
Sarissa.IS_ENABLED_TRANSFORM_NODE=false;
Sarissa.REMOTE_CALL_FLAG="gr.abiss.sarissa.REMOTE_CALL_FLAG";
Sarissa._lastUniqueSuffix=0;
Sarissa._getUniqueSuffix=function(){
return Sarissa._lastUniqueSuffix++;
};
Sarissa._SARISSA_IEPREFIX4XSLPARAM="";
Sarissa._SARISSA_HAS_DOM_IMPLEMENTATION=document.implementation&&true;
Sarissa._SARISSA_HAS_DOM_CREATE_DOCUMENT=Sarissa._SARISSA_HAS_DOM_IMPLEMENTATION&&document.implementation.createDocument;
Sarissa._SARISSA_HAS_DOM_FEATURE=Sarissa._SARISSA_HAS_DOM_IMPLEMENTATION&&document.implementation.hasFeature;
Sarissa._SARISSA_IS_MOZ=Sarissa._SARISSA_HAS_DOM_CREATE_DOCUMENT&&Sarissa._SARISSA_HAS_DOM_FEATURE;
Sarissa._SARISSA_IS_SAFARI=navigator.userAgent.toLowerCase().indexOf("safari")!=-1||navigator.userAgent.toLowerCase().indexOf("konqueror")!=-1;
Sarissa._SARISSA_IS_SAFARI_OLD=Sarissa._SARISSA_IS_SAFARI&&(parseInt((navigator.userAgent.match(/AppleWebKit\/(\d+)/)||{})[1],10)<420);
Sarissa._SARISSA_IS_IE=document.all&&window.ActiveXObject&&navigator.userAgent.toLowerCase().indexOf("msie")>-1&&navigator.userAgent.toLowerCase().indexOf("opera")==-1;
Sarissa._SARISSA_IS_OPERA=navigator.userAgent.toLowerCase().indexOf("opera")!=-1;
if(!window.Node||!Node.ELEMENT_NODE){
Node={ELEMENT_NODE:1,ATTRIBUTE_NODE:2,TEXT_NODE:3,CDATA_SECTION_NODE:4,ENTITY_REFERENCE_NODE:5,ENTITY_NODE:6,PROCESSING_INSTRUCTION_NODE:7,COMMENT_NODE:8,DOCUMENT_NODE:9,DOCUMENT_TYPE_NODE:10,DOCUMENT_FRAGMENT_NODE:11,NOTATION_NODE:12};
}
if(Sarissa._SARISSA_IS_SAFARI_OLD){
HTMLHtmlElement=document.createElement("html").constructor;
Node=HTMLElement={};
HTMLElement.prototype=HTMLHtmlElement.__proto__.__proto__;
HTMLDocument=Document=document.constructor;
var x=new DOMParser();
XMLDocument=x.constructor;
Element=x.parseFromString("<Single />","text/xml").documentElement.constructor;
x=null;
}
if(typeof XMLDocument=="undefined"&&typeof Document!="undefined"){
XMLDocument=Document;
}
if(Sarissa._SARISSA_IS_IE){
Sarissa._SARISSA_IEPREFIX4XSLPARAM="xsl:";
var _SARISSA_DOM_PROGID="";
var _SARISSA_XMLHTTP_PROGID="";
var _SARISSA_DOM_XMLWRITER="";
Sarissa.pickRecentProgID=function(_3f){
var _40=false,e;
var _41;
for(var i=0;i<_3f.length&&!_40;i++){
try{
var _43=new ActiveXObject(_3f[i]);
_41=_3f[i];
_40=true;
}
catch(objException){
e=objException;
}
}
if(!_40){
throw "Could not retrieve a valid progID of Class: "+_3f[_3f.length-1]+". (original exception: "+e+")";
}
_3f=null;
return _41;
};
_SARISSA_DOM_PROGID=null;
_SARISSA_THREADEDDOM_PROGID=null;
_SARISSA_XSLTEMPLATE_PROGID=null;
_SARISSA_XMLHTTP_PROGID=null;
XMLHttpRequest=function(){
if(!_SARISSA_XMLHTTP_PROGID){
_SARISSA_XMLHTTP_PROGID=Sarissa.pickRecentProgID(["Msxml2.XMLHTTP.6.0","MSXML2.XMLHTTP.3.0","MSXML2.XMLHTTP","Microsoft.XMLHTTP"]);
}
return new ActiveXObject(_SARISSA_XMLHTTP_PROGID);
};
Sarissa.getDomDocument=function(_44,_45){
if(!_SARISSA_DOM_PROGID){
_SARISSA_DOM_PROGID=Sarissa.pickRecentProgID(["Msxml2.DOMDocument.6.0","Msxml2.DOMDocument.3.0","MSXML2.DOMDocument","MSXML.DOMDocument","Microsoft.XMLDOM"]);
}
var _46=new ActiveXObject(_SARISSA_DOM_PROGID);
if(_45){
var _47="";
if(_44){
if(_45.indexOf(":")>1){
_47=_45.substring(0,_45.indexOf(":"));
_45=_45.substring(_45.indexOf(":")+1);
}else{
_47="a"+Sarissa._getUniqueSuffix();
}
}
if(_44){
_46.loadXML("<"+_47+":"+_45+" xmlns:"+_47+"=\""+_44+"\""+" />");
}else{
_46.loadXML("<"+_45+" />");
}
}
return _46;
};
Sarissa.getParseErrorText=function(_48){
var _49=Sarissa.PARSED_OK;
if(_48&&_48.parseError&&_48.parseError.errorCode&&_48.parseError.errorCode!=0){
_49="XML Parsing Error: "+_48.parseError.reason+"\nLocation: "+_48.parseError.url+"\nLine Number "+_48.parseError.line+", Column "+_48.parseError.linepos+":\n"+_48.parseError.srcText+"\n";
for(var i=0;i<_48.parseError.linepos;i++){
_49+="-";
}
_49+="^\n";
}else{
if(_48.documentElement===null){
_49=Sarissa.PARSED_EMPTY;
}
}
return _49;
};
Sarissa.setXpathNamespaces=function(_4b,_4c){
_4b.setProperty("SelectionLanguage","XPath");
_4b.setProperty("SelectionNamespaces",_4c);
};
XSLTProcessor=function(){
if(!_SARISSA_XSLTEMPLATE_PROGID){
_SARISSA_XSLTEMPLATE_PROGID=Sarissa.pickRecentProgID(["Msxml2.XSLTemplate.6.0","MSXML2.XSLTemplate.3.0"]);
}
this.template=new ActiveXObject(_SARISSA_XSLTEMPLATE_PROGID);
this.processor=null;
};
XSLTProcessor.prototype.importStylesheet=function(_4d){
if(!_SARISSA_THREADEDDOM_PROGID){
_SARISSA_THREADEDDOM_PROGID=Sarissa.pickRecentProgID(["MSXML2.FreeThreadedDOMDocument.6.0","MSXML2.FreeThreadedDOMDocument.3.0"]);
}
_4d.setProperty("SelectionLanguage","XPath");
_4d.setProperty("SelectionNamespaces","xmlns:xsl='http://www.w3.org/1999/XSL/Transform'");
var _4e=new ActiveXObject(_SARISSA_THREADEDDOM_PROGID);
try{
_4e.resolveExternals=true;
_4e.setProperty("AllowDocumentFunction",true);
}
catch(e){
}
if(_4d.url&&_4d.selectSingleNode("//xsl:*[local-name() = 'import' or local-name() = 'include']")!=null){
_4e.async=false;
_4e.load(_4d.url);
}else{
_4e.loadXML(_4d.xml);
}
_4e.setProperty("SelectionNamespaces","xmlns:xsl='http://www.w3.org/1999/XSL/Transform'");
var _4f=_4e.selectSingleNode("//xsl:output");
if(_4f){
this.outputMethod=_4f.getAttribute("method");
}else{
delete this.outputMethod;
}
this.template.stylesheet=_4e;
this.processor=this.template.createProcessor();
this.paramsSet=[];
};
XSLTProcessor.prototype.transformToDocument=function(_50){
var _51;
if(_SARISSA_THREADEDDOM_PROGID){
this.processor.input=_50;
_51=new ActiveXObject(_SARISSA_DOM_PROGID);
this.processor.output=_51;
this.processor.transform();
return _51;
}else{
if(!_SARISSA_DOM_XMLWRITER){
_SARISSA_DOM_XMLWRITER=Sarissa.pickRecentProgID(["Msxml2.MXXMLWriter.6.0","Msxml2.MXXMLWriter.3.0","MSXML2.MXXMLWriter","MSXML.MXXMLWriter","Microsoft.XMLDOM"]);
}
this.processor.input=_50;
_51=new ActiveXObject(_SARISSA_DOM_XMLWRITER);
this.processor.output=_51;
this.processor.transform();
var _52=new ActiveXObject(_SARISSA_DOM_PROGID);
_52.loadXML(_51.output+"");
return _52;
}
};
XSLTProcessor.prototype.transformToFragment=function(_53,_54){
this.processor.input=_53;
this.processor.transform();
var s=this.processor.output;
var f=_54.createDocumentFragment();
var _57;
if(this.outputMethod=="text"){
f.appendChild(_54.createTextNode(s));
}else{
if(_54.body&&_54.body.innerHTML){
_57=_54.createElement("div");
_57.innerHTML=s;
while(_57.hasChildNodes()){
f.appendChild(_57.firstChild);
}
}else{
var _58=new ActiveXObject(_SARISSA_DOM_PROGID);
if(s.substring(0,5)=="<?xml"){
s=s.substring(s.indexOf("?>")+2);
}
var xml="".concat("<my>",s,"</my>");
_58.loadXML(xml);
_57=_58.documentElement;
while(_57.hasChildNodes()){
f.appendChild(_57.firstChild);
}
}
}
return f;
};
XSLTProcessor.prototype.setParameter=function(_5a,_5b,_5c){
_5c=_5c?_5c:"";
if(_5a){
this.processor.addParameter(_5b,_5c,_5a);
}else{
this.processor.addParameter(_5b,_5c);
}
_5a=""+(_5a||"");
if(!this.paramsSet[_5a]){
this.paramsSet[_5a]=[];
}
this.paramsSet[_5a][_5b]=_5c;
};
XSLTProcessor.prototype.getParameter=function(_5d,_5e){
_5d=""+(_5d||"");
if(this.paramsSet[_5d]&&this.paramsSet[_5d][_5e]){
return this.paramsSet[_5d][_5e];
}else{
return null;
}
};
XSLTProcessor.prototype.clearParameters=function(){
for(var _5f in this.paramsSet){
for(var _60 in this.paramsSet[_5f]){
if(_5f!=""){
this.processor.addParameter(_60,"",_5f);
}else{
this.processor.addParameter(_60,"");
}
}
}
this.paramsSet=[];
};
}else{
if(Sarissa._SARISSA_HAS_DOM_CREATE_DOCUMENT){
Sarissa.__handleLoad__=function(_61){
Sarissa.__setReadyState__(_61,4);
};
_sarissa_XMLDocument_onload=function(){
Sarissa.__handleLoad__(this);
};
Sarissa.__setReadyState__=function(_62,_63){
_62.readyState=_63;
_62.readystate=_63;
if(_62.onreadystatechange!=null&&typeof _62.onreadystatechange=="function"){
_62.onreadystatechange();
}
};
Sarissa.getDomDocument=function(_64,_65){
var _66=document.implementation.createDocument(_64?_64:null,_65?_65:null,null);
if(!_66.onreadystatechange){
_66.onreadystatechange=null;
}
if(!_66.readyState){
_66.readyState=0;
}
_66.addEventListener("load",_sarissa_XMLDocument_onload,false);
return _66;
};
if(window.XMLDocument){
}else{
if(Sarissa._SARISSA_HAS_DOM_FEATURE&&window.Document&&!Document.prototype.load&&document.implementation.hasFeature("LS","3.0")){
Sarissa.getDomDocument=function(_67,_68){
var _69=document.implementation.createDocument(_67?_67:null,_68?_68:null,null);
return _69;
};
}else{
Sarissa.getDomDocument=function(_6a,_6b){
var _6c=document.implementation.createDocument(_6a?_6a:null,_6b?_6b:null,null);
if(_6c&&(_6a||_6b)&&!_6c.documentElement){
_6c.appendChild(_6c.createElementNS(_6a,_6b));
}
return _6c;
};
}
}
}
}
if(!window.DOMParser){
if(Sarissa._SARISSA_IS_SAFARI){
DOMParser=function(){
};
DOMParser.prototype.parseFromString=function(_6d,_6e){
var _6f=new XMLHttpRequest();
_6f.open("GET","data:text/xml;charset=utf-8,"+encodeURIComponent(_6d),false);
_6f.send(null);
return _6f.responseXML;
};
}else{
if(Sarissa.getDomDocument&&Sarissa.getDomDocument()&&Sarissa.getDomDocument(null,"bar").xml){
DOMParser=function(){
};
DOMParser.prototype.parseFromString=function(_70,_71){
var doc=Sarissa.getDomDocument();
doc.loadXML(_70);
return doc;
};
}
}
}
if((typeof (document.importNode)=="undefined")&&Sarissa._SARISSA_IS_IE){
try{
document.importNode=function(_73,_74){
var tmp;
if(_73.nodeName=="#text"){
return document.createTextNode(_73.data);
}else{
if(_73.nodeName=="tbody"||_73.nodeName=="tr"){
tmp=document.createElement("table");
}else{
if(_73.nodeName=="td"){
tmp=document.createElement("tr");
}else{
if(_73.nodeName=="option"){
tmp=document.createElement("select");
}else{
tmp=document.createElement("div");
}
}
}
if(_74){
tmp.innerHTML=_73.xml?_73.xml:_73.outerHTML;
}else{
tmp.innerHTML=_73.xml?_73.cloneNode(false).xml:_73.cloneNode(false).outerHTML;
}
return tmp.getElementsByTagName("*")[0];
}
};
}
catch(e){
}
}
if(!Sarissa.getParseErrorText){
Sarissa.getParseErrorText=function(_76){
var _77=Sarissa.PARSED_OK;
if((!_76)||(!_76.documentElement)){
_77=Sarissa.PARSED_EMPTY;
}else{
if(_76.documentElement.tagName=="parsererror"){
_77=_76.documentElement.firstChild.data;
_77+="\n"+_76.documentElement.firstChild.nextSibling.firstChild.data;
}else{
if(_76.getElementsByTagName("parsererror").length>0){
var _78=_76.getElementsByTagName("parsererror")[0];
_77=Sarissa.getText(_78,true)+"\n";
}else{
if(_76.parseError&&_76.parseError.errorCode!=0){
_77=Sarissa.PARSED_UNKNOWN_ERROR;
}
}
}
}
return _77;
};
}
Sarissa.getText=function(_79,_7a){
var s="";
var _7c=_79.childNodes;
for(var i=0;i<_7c.length;i++){
var _7e=_7c[i];
var _7f=_7e.nodeType;
if(_7f==Node.TEXT_NODE||_7f==Node.CDATA_SECTION_NODE){
s+=_7e.data;
}else{
if(_7a===true&&(_7f==Node.ELEMENT_NODE||_7f==Node.DOCUMENT_NODE||_7f==Node.DOCUMENT_FRAGMENT_NODE)){
s+=Sarissa.getText(_7e,true);
}
}
}
return s;
};
if(!window.XMLSerializer&&Sarissa.getDomDocument&&Sarissa.getDomDocument("","foo",null).xml){
XMLSerializer=function(){
};
XMLSerializer.prototype.serializeToString=function(_80){
return _80.xml;
};
}
Sarissa.stripTags=function(s){
return s?s.replace(/<[^>]+>/g,""):s;
};
Sarissa.clearChildNodes=function(_82){
while(_82.firstChild){
_82.removeChild(_82.firstChild);
}
};
Sarissa.copyChildNodes=function(_83,_84,_85){
if(Sarissa._SARISSA_IS_SAFARI&&_84.nodeType==Node.DOCUMENT_NODE){
_84=_84.documentElement;
}
if((!_83)||(!_84)){
throw "Both source and destination nodes must be provided";
}
if(!_85){
Sarissa.clearChildNodes(_84);
}
var _86=_84.nodeType==Node.DOCUMENT_NODE?_84:_84.ownerDocument;
var _87=_83.childNodes;
var i;
if(typeof (_86.importNode)!="undefined"){
for(i=0;i<_87.length;i++){
_84.appendChild(_86.importNode(_87[i],true));
}
}else{
for(i=0;i<_87.length;i++){
_84.appendChild(_87[i].cloneNode(true));
}
}
};
Sarissa.moveChildNodes=function(_89,_8a,_8b){
if((!_89)||(!_8a)){
throw "Both source and destination nodes must be provided";
}
if(!_8b){
Sarissa.clearChildNodes(_8a);
}
var _8c=_89.childNodes;
if(_89.ownerDocument==_8a.ownerDocument){
while(_89.firstChild){
_8a.appendChild(_89.firstChild);
}
}else{
var _8d=_8a.nodeType==Node.DOCUMENT_NODE?_8a:_8a.ownerDocument;
var i;
if(typeof (_8d.importNode)!="undefined"){
for(i=0;i<_8c.length;i++){
_8a.appendChild(_8d.importNode(_8c[i],true));
}
}else{
for(i=0;i<_8c.length;i++){
_8a.appendChild(_8c[i].cloneNode(true));
}
}
Sarissa.clearChildNodes(_89);
}
};
Sarissa.xmlize=function(_8f,_90,_91){
_91=_91?_91:"";
var s=_91+"<"+_90+">";
var _93=false;
if(!(_8f instanceof Object)||_8f instanceof Number||_8f instanceof String||_8f instanceof Boolean||_8f instanceof Date){
s+=Sarissa.escape(""+_8f);
_93=true;
}else{
s+="\n";
var _94=_8f instanceof Array;
for(var _95 in _8f){
s+=Sarissa.xmlize(_8f[_95],(_94?"array-item key=\""+_95+"\"":_95),_91+"   ");
}
s+=_91;
}
return (s+=(_90.indexOf(" ")!=-1?"</array-item>\n":"</"+_90+">\n"));
};
Sarissa.escape=function(_96){
return _96.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;");
};
Sarissa.unescape=function(_97){
return _97.replace(/&apos;/g,"'").replace(/&quot;/g,"\"").replace(/&gt;/g,">").replace(/&lt;/g,"<").replace(/&amp;/g,"&");
};
Sarissa.updateCursor=function(_98,_99){
if(_98&&_98.style&&_98.style.cursor!=undefined){
_98.style.cursor=_99;
}
};
Sarissa.updateContentFromURI=function(_9a,_9b,_9c,_9d,_9e){
try{
Sarissa.updateCursor(_9b,"wait");
var _9f=new XMLHttpRequest();
_9f.open("GET",_9a,true);
_9f.onreadystatechange=function(){
if(_9f.readyState==4){
try{
var _a0=_9f.responseXML;
if(_a0&&Sarissa.getParseErrorText(_a0)==Sarissa.PARSED_OK){
Sarissa.updateContentFromNode(_9f.responseXML,_9b,_9c);
if(_9d){
_9d(_9a,_9b);
}
}else{
throw Sarissa.getParseErrorText(_a0);
}
}
catch(e){
if(_9d){
_9d(_9a,_9b,e);
}else{
throw e;
}
}
}
};
if(_9e){
var _a1="Sat, 1 Jan 2000 00:00:00 GMT";
_9f.setRequestHeader("If-Modified-Since",_a1);
}
_9f.send("");
}
catch(e){
Sarissa.updateCursor(_9b,"auto");
if(_9d){
_9d(_9a,_9b,e);
}else{
throw e;
}
}
};
Sarissa.updateContentFromNode=function(_a2,_a3,_a4){
try{
Sarissa.updateCursor(_a3,"wait");
Sarissa.clearChildNodes(_a3);
var _a5=_a2.nodeType==Node.DOCUMENT_NODE?_a2:_a2.ownerDocument;
if(_a5.parseError&&_a5.parseError.errorCode!=0){
var pre=document.createElement("pre");
pre.appendChild(document.createTextNode(Sarissa.getParseErrorText(_a5)));
_a3.appendChild(pre);
}else{
if(_a4){
_a2=_a4.transformToDocument(_a2);
}
if(_a3.tagName.toLowerCase()=="textarea"||_a3.tagName.toLowerCase()=="input"){
_a3.value=new XMLSerializer().serializeToString(_a2);
}else{
try{
_a3.appendChild(_a3.ownerDocument.importNode(_a2,true));
}
catch(e){
_a3.innerHTML=new XMLSerializer().serializeToString(_a2);
}
}
}
}
catch(e){
throw e;
}
finally{
Sarissa.updateCursor(_a3,"auto");
}
};
Sarissa.formToQueryString=function(_a7){
var qs="";
for(var i=0;i<_a7.elements.length;i++){
var _aa=_a7.elements[i];
var _ab=_aa.getAttribute("name")?_aa.getAttribute("name"):_aa.getAttribute("id");
if(_ab&&((!_aa.disabled)||_aa.type=="hidden")){
switch(_aa.type){
case "hidden":
case "text":
case "textarea":
case "password":
qs+=_ab+"="+encodeURIComponent(_aa.value)+"&";
break;
case "select-one":
qs+=_ab+"="+encodeURIComponent(_aa.options[_aa.selectedIndex].value)+"&";
break;
case "select-multiple":
for(var j=0;j<_aa.length;j++){
var _ad=_aa.options[j];
if(_ad.selected===true){
qs+=_ab+"[]"+"="+encodeURIComponent(_ad.value)+"&";
}
}
break;
case "checkbox":
case "radio":
if(_aa.checked){
qs+=_ab+"="+encodeURIComponent(_aa.value)+"&";
}
break;
}
}
}
return qs.substr(0,qs.length-1);
};
Sarissa.updateContentFromForm=function(_ae,_af,_b0,_b1){
try{
Sarissa.updateCursor(_af,"wait");
var _b2=Sarissa.formToQueryString(_ae)+"&"+Sarissa.REMOTE_CALL_FLAG+"=true";
var _b3=new XMLHttpRequest();
var _b4=_ae.getAttribute("method")&&_ae.getAttribute("method").toLowerCase()=="get";
if(_b4){
_b3.open("GET",_ae.getAttribute("action")+"?"+_b2,true);
}else{
_b3.open("POST",_ae.getAttribute("action"),true);
_b3.setRequestHeader("Content-type","application/x-www-form-urlencoded");
_b3.setRequestHeader("Content-length",_b2.length);
_b3.setRequestHeader("Connection","close");
}
_b3.onreadystatechange=function(){
try{
if(_b3.readyState==4){
var _b5=_b3.responseXML;
if(_b5&&Sarissa.getParseErrorText(_b5)==Sarissa.PARSED_OK){
Sarissa.updateContentFromNode(_b3.responseXML,_af,_b0);
if(_b1){
_b1(_ae,_af);
}
}else{
throw Sarissa.getParseErrorText(_b5);
}
}
}
catch(e){
if(_b1){
_b1(_ae,_af,e);
}else{
throw e;
}
}
};
_b3.send(_b4?"":_b2);
}
catch(e){
Sarissa.updateCursor(_af,"auto");
if(_b1){
_b1(_ae,_af,e);
}else{
throw e;
}
}
return false;
};
Sarissa.FUNCTION_NAME_REGEXP=new RegExp("");
Sarissa.getFunctionName=function(_b6,_b7){
var _b8;
if(!_b8){
if(_b7){
_b8="SarissaAnonymous"+Sarissa._getUniqueSuffix();
window[_b8]=_b6;
}else{
_b8=null;
}
}
if(_b8){
window[_b8]=_b6;
}
return _b8;
};
Sarissa.setRemoteJsonCallback=function(url,_ba,_bb){
if(!_bb){
_bb="callback";
}
var _bc=Sarissa.getFunctionName(_ba,true);
var id="sarissa_json_script_id_"+Sarissa._getUniqueSuffix();
var _be=document.getElementsByTagName("head")[0];
var _bf=document.createElement("script");
_bf.type="text/javascript";
_bf.id=id;
_bf.onload=function(){
};
if(url.indexOf("?")!=-1){
url+=("&"+_bb+"="+_bc);
}else{
url+=("?"+_bb+"="+_bc);
}
_bf.src=url;
_be.appendChild(_bf);
return id;
};
Freja.QueryEngine=function(){
};
Freja.QueryEngine.prototype.getElementById=function(_c0,id){
var _c2=_c0.getElementsByTagName("*");
for(var i=0;i<_c2.length;i++){
if(_c2[i].getAttribute("id")==id){
return _c2[i];
}
}
};
Freja.QueryEngine.prototype.get=function(_c4,_c5){
var _c6=this._find(_c4,_c5);
if(!_c6){
throw new Error("Can't evaluate expression "+_c5);
}
switch(_c6.nodeType){
case 1:
if(_c6.firstChild&&(_c6.firstChild.nodeType==3||_c6.firstChild.nodeType==4)){
return _c6.firstChild.nodeValue;
}
break;
case 2:
return _c6.nodeValue;
break;
case 3:
case 4:
return _c6.nodeValue;
break;
}
return null;
};
Freja.QueryEngine.prototype.set=function(_c7,_c8,_c9){
var _ca=this._find(_c7,_c8);
if(!_ca){
var _cb=_c8.substr(_c8.lastIndexOf("/")+1);
if(_cb.charAt(0)=="@"){
var _cc=_c8.substring(0,_c8.lastIndexOf("/"));
var _cd=this._find(_c7,_cc);
if(_cd){
_cd.setAttribute(_cb.substr(1),_c9);
return;
}
}
throw new Error("Can't evaluate expression "+_c8);
}
switch(_ca.nodeType){
case 1:
if(_ca.firstChild&&(_ca.firstChild.nodeType==3||_ca.firstChild.nodeType==4)){
_ca.firstChild.nodeValue=_c9;
}else{
if(_c9!=""){
_ca.appendChild(_c7.createTextNode(_c9));
}
}
break;
case 2:
_ca.nodeValue=_c9;
break;
case 3:
case 4:
_ca.nodeValue=_c9;
break;
}
return;
};
Freja.QueryEngine.XPath=function(){
};
Freja.Class.extend(Freja.QueryEngine.XPath,Freja.QueryEngine);
Freja.QueryEngine.XPath.prototype._find=function(_ce,_cf){
var _d0=_ce.selectSingleNode(_cf);
return _d0;
};
Freja.QueryEngine.SimplePath=function(){
};
Freja.Class.extend(Freja.QueryEngine.SimplePath,Freja.QueryEngine);
Freja.QueryEngine.SimplePath.prototype._find=function(_d1,_d2){
if(!_d2.match(/^[\d\w\/@\[\]=_\-']*$/)){
throw new Error("SimplePath can't evaluate expression: "+_d2);
}
var _d3=_d2.split("/");
var _d4=_d1;
var _d5=new RegExp("^@([\\d\\w]*)");
var _d6=new RegExp("^([@\\d\\w]*)\\[([\\d]*)\\]$");
var _d7=new RegExp("^([\\d\\w]+)\\[@([@\\d\\w]+)=['\"]{1}(.*)['\"]{1}\\]$");
var _d8=null;
var _d9=0;
for(var i=0;i<_d3.length;++i){
var _db=_d3[i];
var _dc=_d7.exec(_db);
if(_dc){
if(i>0&&_d3[i-1]==""){
var cn=_d4.getElementsByTagName(_dc[1]);
}else{
var cn=_d4.childNodes;
}
for(var j=0,l=cn.length;j<l;j++){
if(cn[j].nodeType==1&&cn[j].tagName==_dc[1]&&cn[j].getAttribute(_dc[2])==_dc[3]){
_d4=cn[j];
break;
}
}
if(j==l){
throw new Error("SimplePath can't evaluate expression "+_db);
}
}else{
_d9=_d6.exec(_db);
if(_d9){
_db=_d9[1];
_d9=_d9[2]-1;
}else{
_d9=0;
}
if(_db!=""){
_d8=_d5.exec(_db);
if(_d8){
_d4=_d4.getAttributeNode(_d8[1]);
}else{
_d4=_d4.getElementsByTagName(_db).item(_d9);
}
}
}
}
if(_d4&&_d4.firstChild&&_d4.firstChild.nodeType==3){
return _d4.firstChild;
}
if(_d4&&_d4.firstChild&&_d4.firstChild.nodeType==4){
return _d4.firstChild;
}
if(!_d4){
throw new Error("SimplePath can't evaluate expression "+_d2);
}
return _d4;
};
Freja.Model=function(url,_e0){
this.url=url;
this.ready=false;
this.document=null;
this._query=_e0;
};
Freja.Model.prototype.getElementById=function(id){
if(this.document){
return this._query.getElementById(this.document,id);
}
return null;
};
Freja.Model.prototype.get=function(_e2){
if(this.document){
return this._query.get(this.document,_e2);
}
return null;
};
Freja.Model.prototype.set=function(_e3,_e4){
if(this.document){
return this._query.set(this.document,_e3,_e4);
}
return null;
};
Freja.Model.prototype.updateFrom=function(_e5){
var _e6=_e5.getValues();
for(var i=0;i<_e6[0].length;++i){
if(_e6[0][i].lastIndexOf("/")!=-1){
try{
this.set(_e6[0][i],_e6[1][i]);
}
catch(x){
}
}
}
};
Freja.Model.prototype.save=function(){
var url=this.url;
var _e9=/^(file:\/\/.*\/)([^\/]*)$/.exec(window.location.href);
if(_e9){
url=_e9[1]+url;
}
var d=Freja._aux.createDeferred();
var req=Freja.AssetManager.openXMLHttpRequest("POST",url);
try{
Freja._aux.sendXMLHttpRequest(req,Freja._aux.serializeXML(this.document)).addCallbacks(Freja._aux.bind(d.callback,d),Freja._aux.bind(d.errback,d));
}
catch(ex){
d.errback(ex);
}
return d;
};
Freja.Model.prototype.remove=function(){
var url=this.url;
var _ed=/^(file:\/\/.*\/)([^\/]*)$/.exec(window.location.href);
if(_ed){
url=_ed[1]+url;
}
var req=Freja.AssetManager.openXMLHttpRequest("DELETE",url);
return Freja._aux.sendXMLHttpRequest(req);
};
Freja.Model.prototype.reload=function(url){
if(url){
for(var i=0;i<Freja.AssetManager.models.length;i++){
if(Freja.AssetManager.models[i].url==this.url){
Freja.AssetManager.models[i].url=url;
}
}
this.url=url;
}
this.ready=false;
var _f1=Freja._aux.bind(function(_f2){
this.document=_f2;
this.ready=true;
Freja._aux.signal(this,"onload");
},this);
var d=Freja.AssetManager.loadAsset(this.url,true);
d.addCallbacks(_f1,Freja.AssetManager.onerror);
return d;
};
Freja.Model.DataSource=function(_f4,_f5){
this.createURL=_f4;
this.indexURL=_f5;
};
Freja.Model.DataSource.prototype.select=function(){
return getModel(this.indexURL);
};
Freja.Model.DataSource.prototype.create=function(_f6){
var url=this.createURL;
var _f8=/^(file:\/\/.*\/)([^\/]*)$/.exec(window.location.href);
if(_f8){
url=_f8[1]+url;
}
var req=Freja.AssetManager.openXMLHttpRequest("PUT",url);
var _fa={};
for(var i=0,len=_f6[0].length;i<len;++i){
_fa[_f6[0][i]]=_f6[1][i];
}
return Freja._aux.sendXMLHttpRequest(req,Freja._aux.xmlize(_fa,"record"));
};
Freja.View=function(url,_fd){
this.url=url;
this.ready=false;
this.document=null;
this._renderer=_fd;
this._destination=null;
this.behaviors=[];
this.placeholder=null;
Freja._aux.connect(this,"onrendercomplete",Freja._aux.bind(this._connectBehavior,this));
};
Freja.View.prototype.render=function(_fe,_ff,_100){
if(typeof (_ff)=="undefined"){
_ff=this.placeholder;
}
if(typeof (_100)=="undefined"){
_100=this.xslParameters;
}
var _101=function(_102,view,_104,_105){
this.model=_102;
this.view=view;
this.deferred=_104;
this.xslParameters=_105;
};
_101.prototype.trigger=function(){
try{
if(!this.view.ready){
Freja._aux.connect(this.view,"onload",Freja._aux.bind(this.trigger,this));
return;
}
if(typeof (this.model)=="object"&&this.model instanceof Freja.Model&&!this.model.ready){
Freja._aux.connect(this.model,"onload",Freja._aux.bind(this.trigger,this));
return;
}
var _106;
if(typeof (this.model)=="undefined"){
_106={document:Freja._aux.loadXML("<?xml version='1.0' ?><dummy/>")};
}else{
if(this.model instanceof Freja.Model){
_106=this.model;
}else{
_106={document:Freja._aux.loadXML("<?xml version='1.0' ?>\n"+Freja._aux.xmlize(this.model,"item"))};
}
}
var _107=this.view._renderer.transform(_106,this.view,this.xslParameters);
_107.addCallback(Freja._aux.bind(function(html){
if(typeof html=="string"){
this._destination.innerHTML=html;
}else{
this._destination.innerHTML="";
this._destination.appendChild(html);
}
},this.view));
_107.addCallback(Freja._aux.bind(function(){
Freja._aux.signal(this,"onrendercomplete",this._destination);
},this.view));
_107.addCallback(Freja._aux.bind(function(){
this.deferred.callback();
},this));
_107.addErrback(Freja._aux.bind(function(ex){
this.deferred.errback(ex);
},this));
}
catch(ex){
this.deferred.errback(ex);
}
};
var d=Freja._aux.createDeferred();
try{
if(typeof (_ff)=="object"){
this._destination=_ff;
}else{
this._destination=document.getElementById(_ff);
}
this._destination.innerHTML=Freja.AssetManager.THROBBER_HTML;
var h=new _101(_fe,this,d,_100);
h.trigger();
}
catch(ex){
d.errback(ex);
}
return d;
};
Freja.View.prototype._connectBehavior=function(_10c){
try{
var _10d=function(node,_10f,_110){
Freja._aux.connect(node,_10f,Freja._aux.bind(function(e){
var _112=false;
try{
_112=_110(this);
}
catch(ex){
throw new Error("An error ocurred in user handler.\n"+ex.message);
}
finally{
if(!_112){
e.stop();
}
}
},node));
};
var _113=function(node,_115){
for(var i=0,c=node.childNodes,l=c.length;i<l;++i){
var _117=c[i];
if(_117.nodeType==1){
if(_117.className){
var _118=_117.className.split(" ");
for(var j=0;j<_118.length;j++){
var _11a=_115[_118[j]];
if(_11a){
for(var _11b in _11a){
if(_11b=="init"){
_11a.init(_117);
}else{
_10d(_117,_11b,_11a[_11b]);
}
}
}
}
}
_113(_117,_115);
}
}
};
for(var ids in this.behaviors){
_113(_10c,this.behaviors);
break;
}
}
catch(ex){
alert(ex.message);
}
};
Freja.View.prototype.getValues=function(){
return Freja._aux.formContents(this._destination);
};
Freja.View.Renderer=function(){
};
Freja.View.Renderer.XSLTransformer=function(){
};
Freja.Class.extend(Freja.View.Renderer.XSLTransformer,Freja.View.Renderer);
Freja.View.Renderer.XSLTransformer.prototype.transform=function(_11d,view,_11f){
var d=Freja._aux.createDeferred();
try{
var html=Freja._aux.transformXSL(_11d.document,view.document,_11f);
if(!html){
d.errback(new Error("XSL Transformation error."));
}else{
d.callback(html);
}
}
catch(ex){
d.errback(ex);
}
return d;
};
Freja.View.Renderer.RemoteXSLTransformer=function(url){
this.url=url;
};
Freja.Class.extend(Freja.View.Renderer.RemoteXSLTransformer,Freja.View.Renderer);
Freja.View.Renderer.RemoteXSLTransformer.prototype.transform=function(_123,view,_125){
var d=Freja._aux.createDeferred();
var _127=view.url;
var _128="xslFile="+encodeURIComponent(_127)+"&xmlData="+encodeURIComponent(Freja._aux.serializeXML(_123.document));
var _129="";
for(var _12a in _125){
_129+=encodeURIComponent(_12a+","+_125[_12a]);
}
if(_129.length>0){
_128=_128+"&xslParam="+_129;
}
var req=Freja.AssetManager.openXMLHttpRequest("POST",Freja.AssetManager.XSLT_SERVICE_URL);
req.onreadystatechange=function(){
if(req.readyState==4){
if(req.status==200){
d.callback(req.responseText);
}else{
d.errback(req.responseText);
}
}
};
req.send(_128);
return d;
};
Freja.UndoHistory=function(){
this.cache=[];
this.maxLength=5;
this._position=0;
this._undoSteps=0;
};
Freja.UndoHistory.prototype.add=function(_12c){
var _12d=this._position%this.maxLength;
var _12e=_12c.document;
this.cache[_12d]={};
this.cache[_12d].model=_12c;
this.cache[_12d].document=Freja._aux.cloneXMLDocument(_12e);
if(!this.cache[_12d].document){
throw new Error("Couldn't add to history.");
}else{
this._position++;
var _12f=_12d;
while(this._undoSteps>0){
_12f=(_12f+1)%this.maxLength;
this.cache[_12f]={};
this._undoSteps--;
}
return _12d;
}
};
Freja.UndoHistory.prototype.undo=function(_130){
if(this._undoSteps<this.cache.length){
this._undoSteps++;
this._position--;
if(this._position<0){
this._position=this.maxLength-1;
}
var _131=this.cache[this._position].model;
if(this.cache[this._position].document){
_131.document=this.cache[this._position].document;
}else{
throw new Error("The model's DOMDocument wasn't properly copied into the history");
}
if(typeof (_130)!="undefined"&&_130>1){
this.undo(_130-1);
}
}else{
throw new Error("Nothing to undo");
}
};
Freja.UndoHistory.prototype.redo=function(){
if(this._undoSteps>0){
this._undoSteps--;
this._position=(this._position+1)%this.maxLength;
var _132=this.cache[this._position].model;
_132.document=this.cache[this._position].document;
}else{
throw new Error("Nothing to redo");
}
};
Freja.UndoHistory.prototype.removeLast=function(){
this._position--;
if(this._position<0){
this._position=this.maxLength-1;
}
this.cache[this._position]={};
this._undoSteps=0;
};
Freja.AssetManager={models:[],views:[],_username:null,_password:null};
Freja.AssetManager.HTTP_REQUEST_TYPE="async";
Freja.AssetManager.HTTP_METHOD_TUNNEL="Http-Method-Equivalent";
Freja.AssetManager.XSLT_SERVICE_URL="srvc-xslt.php";
Freja.AssetManager.THROBBER_HTML="<span style='color:white;background:firebrick'>Loading ...</span>";
Freja.AssetManager.createRenderer=function(){
if(Freja._aux.hasSupportForXSLT()){
return new Freja.View.Renderer.XSLTransformer();
}else{
return new Freja.View.Renderer.RemoteXSLTransformer(this.XSLT_SERVICE_URL);
}
};
Freja.AssetManager.clearCache=function(){
this.models=[];
this.views=[];
};
Freja.AssetManager.getModel=function(url){
for(var i=0;i<this.models.length;i++){
if(this.models[i].url==url){
return this.models[i];
}
}
var m=new Freja.Model(url,Freja._aux.createQueryEngine());
var _136=Freja._aux.bind(function(_137){
this.document=_137;
this.ready=true;
Freja._aux.signal(this,"onload");
},m);
this.loadAsset(url,true).addCallbacks(_136,Freja.AssetManager.onerror);
this.models.push(m);
return m;
};
Freja.AssetManager.getView=function(url){
for(var i=0;i<this.views.length;i++){
if(this.views[i].url==url){
return this.views[i];
}
}
var v=new Freja.View(url,this.createRenderer());
var _13b=Freja._aux.bind(function(_13c){
this.document=_13c;
this.ready=true;
Freja._aux.signal(this,"onload");
},v);
this.loadAsset(url,false).addCallbacks(_13b,Freja.AssetManager.onerror);
this.views.push(v);
return v;
};
Freja.AssetManager.openXMLHttpRequest=function(_13d,url){
var _13f=null;
if(Freja.AssetManager.HTTP_METHOD_TUNNEL&&_13d!="GET"&&_13d!="POST"){
_13f=_13d;
_13d="POST";
}
var req=Freja._aux.openXMLHttpRequest(_13d,url,Freja.AssetManager.HTTP_REQUEST_TYPE=="async",Freja.AssetManager._username,Freja.AssetManager._password);
if(_13f){
req.setRequestHeader(Freja.AssetManager.HTTP_METHOD_TUNNEL,_13f);
}
return req;
};
Freja.AssetManager.setCredentials=function(_141,_142){
this._username=_141;
this._password=_142;
};
Freja.AssetManager.loadAsset=function(url,_144){
var _145=/^(file:\/\/.*\/)([^\/]*)$/.exec(window.location.href);
if(_145){
url=_145[1]+url;
}
var d=Freja._aux.createDeferred();
var _147=function(_148){
try{
if(_148.responseText==""){
throw new Error("Empty response.");
}
if(_148.responseXML.xml==""){
var _149=Freja._aux.loadXML(_148.responseText);
}else{
var _149=_148.responseXML;
}
}
catch(ex){
d.errback(ex);
}
if(Freja.AssetManager.HTTP_REQUEST_TYPE=="async"&&window.document.all){
setTimeout(function(){
d.callback(_149);
},1);
}else{
d.callback(_149);
}
};
try{
if(_144&&Freja.AssetManager.HTTP_METHOD_TUNNEL){
var req=Freja._aux.openXMLHttpRequest("POST",url,Freja.AssetManager.HTTP_REQUEST_TYPE=="async",Freja.AssetManager._username,Freja.AssetManager._password);
req.setRequestHeader(Freja.AssetManager.HTTP_METHOD_TUNNEL,"GET");
req.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
}else{
var req=Freja._aux.openXMLHttpRequest("GET",url,Freja.AssetManager.HTTP_REQUEST_TYPE=="async",Freja.AssetManager._username,Freja.AssetManager._password);
}
var comm=Freja._aux.sendXMLHttpRequest(req);
if(Freja.AssetManager.HTTP_REQUEST_TYPE=="async"){
comm.addCallbacks(_147,function(req){
d.errback(new Error("Request failed:"+req.status));
});
}else{
if(req.status==0||req.status==200||req.status==201||req.status==304){
_147(req);
}else{
d.errback(new Error("Request failed:"+req.status));
}
}
}
catch(ex){
d.errback(ex);
}
return d;
};
Freja.AssetManager.onerror=function(ex){
alert("Freja.AssetManager.onerror\n"+ex.message);
};
window.getModel=Freja._aux.bind("getModel",Freja.AssetManager);
window.getView=Freja._aux.bind("getView",Freja.AssetManager);


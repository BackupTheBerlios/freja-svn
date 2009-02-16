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
if(Sarissa._SARISSA_HAS_DOM_FEATURE&&document.implementation.hasFeature("XPath","3.0")){
SarissaNodeList=function(i){
this.length=i;
};
SarissaNodeList.prototype=[];
SarissaNodeList.prototype.constructor=Array;
SarissaNodeList.prototype.item=function(i){
return (i<0||i>=this.length)?null:this[i];
};
SarissaNodeList.prototype.expr="";
if(window.XMLDocument&&(!XMLDocument.prototype.setProperty)){
XMLDocument.prototype.setProperty=function(x,y){
};
}
Sarissa.setXpathNamespaces=function(_c4,_c5){
_c4._sarissa_useCustomResolver=true;
var _c6=_c5.indexOf(" ")>-1?_c5.split(" "):[_c5];
_c4._sarissa_xpathNamespaces=[];
for(var i=0;i<_c6.length;i++){
var ns=_c6[i];
var _c9=ns.indexOf(":");
var _ca=ns.indexOf("=");
if(_c9>0&&_ca>_c9+1){
var _cb=ns.substring(_c9+1,_ca);
var uri=ns.substring(_ca+2,ns.length-1);
_c4._sarissa_xpathNamespaces[_cb]=uri;
}else{
throw "Bad format on namespace declaration(s) given";
}
}
};
XMLDocument.prototype._sarissa_useCustomResolver=false;
XMLDocument.prototype._sarissa_xpathNamespaces=[];
XMLDocument.prototype.selectNodes=function(_cd,_ce,_cf){
var _d0=this;
var _d1;
if(this._sarissa_useCustomResolver){
_d1=function(_d2){
var s=_d0._sarissa_xpathNamespaces[_d2];
if(s){
return s;
}else{
throw "No namespace URI found for prefix: '"+_d2+"'";
}
};
}else{
_d1=this.createNSResolver(this.documentElement);
}
var _d4=null;
if(!_cf){
var _d5=this.evaluate(_cd,(_ce?_ce:this),_d1,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);
var _d6=new SarissaNodeList(_d5.snapshotLength);
_d6.expr=_cd;
for(var i=0;i<_d6.length;i++){
_d6[i]=_d5.snapshotItem(i);
}
_d4=_d6;
}else{
_d4=this.evaluate(_cd,(_ce?_ce:this),_d1,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
}
return _d4;
};
Element.prototype.selectNodes=function(_d8){
var doc=this.ownerDocument;
if(doc.selectNodes){
return doc.selectNodes(_d8,this);
}else{
throw "Method selectNodes is only supported by XML Elements";
}
};
XMLDocument.prototype.selectSingleNode=function(_da,_db){
var ctx=_db?_db:null;
return this.selectNodes(_da,ctx,true);
};
Element.prototype.selectSingleNode=function(_dd){
var doc=this.ownerDocument;
if(doc.selectSingleNode){
return doc.selectSingleNode(_dd,this);
}else{
throw "Method selectNodes is only supported by XML Elements";
}
};
Sarissa.IS_ENABLED_SELECT_NODES=true;
}
Freja.QueryEngine=function(){
};
Freja.QueryEngine.prototype.getElementById=function(_df,id){
var _e1=_df.getElementsByTagName("*");
for(var i=0;i<_e1.length;i++){
if(_e1[i].getAttribute("id")==id){
return _e1[i];
}
}
};
Freja.QueryEngine.prototype.get=function(_e3,_e4){
var _e5=this._find(_e3,_e4);
if(!_e5){
throw new Error("Can't evaluate expression "+_e4);
}
switch(_e5.nodeType){
case 1:
if(_e5.firstChild&&(_e5.firstChild.nodeType==3||_e5.firstChild.nodeType==4)){
return _e5.firstChild.nodeValue;
}
break;
case 2:
return _e5.nodeValue;
break;
case 3:
case 4:
return _e5.nodeValue;
break;
}
return null;
};
Freja.QueryEngine.prototype.set=function(_e6,_e7,_e8){
var _e9=this._find(_e6,_e7);
if(!_e9){
var _ea=_e7.substr(_e7.lastIndexOf("/")+1);
if(_ea.charAt(0)=="@"){
var _eb=_e7.substring(0,_e7.lastIndexOf("/"));
var _ec=this._find(_e6,_eb);
if(_ec){
_ec.setAttribute(_ea.substr(1),_e8);
return;
}
}
throw new Error("Can't evaluate expression "+_e7);
}
switch(_e9.nodeType){
case 1:
if(_e9.firstChild&&(_e9.firstChild.nodeType==3||_e9.firstChild.nodeType==4)){
_e9.firstChild.nodeValue=_e8;
}else{
if(_e8!=""){
_e9.appendChild(_e6.createTextNode(_e8));
}
}
break;
case 2:
_e9.nodeValue=_e8;
break;
case 3:
case 4:
_e9.nodeValue=_e8;
break;
}
return;
};
Freja.QueryEngine.XPath=function(){
};
Freja.Class.extend(Freja.QueryEngine.XPath,Freja.QueryEngine);
Freja.QueryEngine.XPath.prototype._find=function(_ed,_ee){
var _ef=_ed.selectSingleNode(_ee);
return _ef;
};
Freja.QueryEngine.SimplePath=function(){
};
Freja.Class.extend(Freja.QueryEngine.SimplePath,Freja.QueryEngine);
Freja.QueryEngine.SimplePath.prototype._find=function(_f0,_f1){
if(!_f1.match(/^[\d\w\/@\[\]=_\-']*$/)){
throw new Error("SimplePath can't evaluate expression: "+_f1);
}
var _f2=_f1.split("/");
var _f3=_f0;
var _f4=new RegExp("^@([\\d\\w]*)");
var _f5=new RegExp("^([@\\d\\w]*)\\[([\\d]*)\\]$");
var _f6=new RegExp("^([\\d\\w]+)\\[@([@\\d\\w]+)=['\"]{1}(.*)['\"]{1}\\]$");
var _f7=null;
var _f8=0;
for(var i=0;i<_f2.length;++i){
var _fa=_f2[i];
var _fb=_f6.exec(_fa);
if(_fb){
if(i>0&&_f2[i-1]==""){
var cn=_f3.getElementsByTagName(_fb[1]);
}else{
var cn=_f3.childNodes;
}
for(var j=0,l=cn.length;j<l;j++){
if(cn[j].nodeType==1&&cn[j].tagName==_fb[1]&&cn[j].getAttribute(_fb[2])==_fb[3]){
_f3=cn[j];
break;
}
}
if(j==l){
throw new Error("SimplePath can't evaluate expression "+_fa);
}
}else{
_f8=_f5.exec(_fa);
if(_f8){
_fa=_f8[1];
_f8=_f8[2]-1;
}else{
_f8=0;
}
if(_fa!=""){
_f7=_f4.exec(_fa);
if(_f7){
_f3=_f3.getAttributeNode(_f7[1]);
}else{
_f3=_f3.getElementsByTagName(_fa).item(_f8);
}
}
}
}
if(_f3&&_f3.firstChild&&_f3.firstChild.nodeType==3){
return _f3.firstChild;
}
if(_f3&&_f3.firstChild&&_f3.firstChild.nodeType==4){
return _f3.firstChild;
}
if(!_f3){
throw new Error("SimplePath can't evaluate expression "+_f1);
}
return _f3;
};
Freja.Model=function(url,_ff){
this.url=url;
this.ready=false;
this.document=null;
this._query=_ff;
};
Freja.Model.prototype.getElementById=function(id){
if(this.document){
return this._query.getElementById(this.document,id);
}
return null;
};
Freja.Model.prototype.get=function(_101){
if(this.document){
return this._query.get(this.document,_101);
}
return null;
};
Freja.Model.prototype.set=function(_102,_103){
if(this.document){
return this._query.set(this.document,_102,_103);
}
return null;
};
Freja.Model.prototype.updateFrom=function(view){
var _105=view.getValues();
for(var i=0;i<_105[0].length;++i){
if(_105[0][i].lastIndexOf("/")!=-1){
try{
this.set(_105[0][i],_105[1][i]);
}
catch(x){
}
}
}
};
Freja.Model.prototype.save=function(){
var url=this.url;
var _108=/^(file:\/\/.*\/)([^\/]*)$/.exec(window.location.href);
if(_108){
url=_108[1]+url;
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
var _10c=/^(file:\/\/.*\/)([^\/]*)$/.exec(window.location.href);
if(_10c){
url=_10c[1]+url;
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
var _110=Freja._aux.bind(function(_111){
this.document=_111;
this.ready=true;
Freja._aux.signal(this,"onload");
},this);
var d=Freja.AssetManager.loadAsset(this.url,true);
d.addCallbacks(_110,Freja.AssetManager.onerror);
return d;
};
Freja.Model.DataSource=function(_113,_114){
this.createURL=_113;
this.indexURL=_114;
};
Freja.Model.DataSource.prototype.select=function(){
return getModel(this.indexURL);
};
Freja.Model.DataSource.prototype.create=function(_115){
var url=this.createURL;
var _117=/^(file:\/\/.*\/)([^\/]*)$/.exec(window.location.href);
if(_117){
url=_117[1]+url;
}
var req=Freja.AssetManager.openXMLHttpRequest("PUT",url);
var _119={};
for(var i=0,len=_115[0].length;i<len;++i){
_119[_115[0][i]]=_115[1][i];
}
return Freja._aux.sendXMLHttpRequest(req,Freja._aux.xmlize(_119,"record"));
};
Freja.View=function(url,_11c){
this.url=url;
this.ready=false;
this.document=null;
this._renderer=_11c;
this._destination=null;
this.behaviors=[];
this.placeholder=null;
Freja._aux.connect(this,"onrendercomplete",Freja._aux.bind(this._connectBehavior,this));
};
Freja.View.prototype.render=function(_11d,_11e,_11f){
if(typeof (_11e)=="undefined"){
_11e=this.placeholder;
}
if(typeof (_11f)=="undefined"){
_11f=this.xslParameters;
}
var _120=function(_121,view,_123,_124){
this.model=_121;
this.view=view;
this.deferred=_123;
this.xslParameters=_124;
};
_120.prototype.trigger=function(){
try{
if(!this.view.ready){
Freja._aux.connect(this.view,"onload",Freja._aux.bind(this.trigger,this));
return;
}
if(typeof (this.model)=="object"&&this.model instanceof Freja.Model&&!this.model.ready){
Freja._aux.connect(this.model,"onload",Freja._aux.bind(this.trigger,this));
return;
}
var _125;
if(typeof (this.model)=="undefined"){
_125={document:Freja._aux.loadXML("<?xml version='1.0' ?><dummy/>")};
}else{
if(this.model instanceof Freja.Model){
_125=this.model;
}else{
_125={document:Freja._aux.loadXML("<?xml version='1.0' ?>\n"+Freja._aux.xmlize(this.model,"item"))};
}
}
var _126=this.view._renderer.transform(_125,this.view,this.xslParameters);
_126.addCallback(Freja._aux.bind(function(html){
if(typeof html=="string"){
this._destination.innerHTML=html;
}else{
this._destination.innerHTML="";
this._destination.appendChild(html);
}
},this.view));
_126.addCallback(Freja._aux.bind(function(){
Freja._aux.signal(this,"onrendercomplete",this._destination);
},this.view));
_126.addCallback(Freja._aux.bind(function(){
this.deferred.callback();
},this));
_126.addErrback(Freja._aux.bind(function(ex){
this.deferred.errback(ex);
},this));
}
catch(ex){
this.deferred.errback(ex);
}
};
var d=Freja._aux.createDeferred();
try{
if(typeof (_11e)=="object"){
this._destination=_11e;
}else{
this._destination=document.getElementById(_11e);
}
this._destination.innerHTML=Freja.AssetManager.THROBBER_HTML;
var h=new _120(_11d,this,d,_11f);
h.trigger();
}
catch(ex){
d.errback(ex);
}
return d;
};
Freja.View.prototype._connectBehavior=function(_12b){
try{
var _12c=function(node,_12e,_12f){
Freja._aux.connect(node,_12e,Freja._aux.bind(function(e){
var _131=false;
try{
_131=_12f(this);
}
catch(ex){
throw new Error("An error ocurred in user handler.\n"+ex.message);
}
finally{
if(!_131){
e.stop();
}
}
},node));
};
var _132=function(node,_134){
for(var i=0,c=node.childNodes,l=c.length;i<l;++i){
var _136=c[i];
if(_136.nodeType==1){
if(_136.className){
var _137=_136.className.split(" ");
for(var j=0;j<_137.length;j++){
var _139=_134[_137[j]];
if(_139){
for(var _13a in _139){
if(_13a=="init"){
_139.init(_136);
}else{
_12c(_136,_13a,_139[_13a]);
}
}
}
}
}
_132(_136,_134);
}
}
};
for(var ids in this.behaviors){
_132(_12b,this.behaviors);
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
Freja.View.Renderer.XSLTransformer.prototype.transform=function(_13c,view,_13e){
var d=Freja._aux.createDeferred();
try{
var html=Freja._aux.transformXSL(_13c.document,view.document,_13e);
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
Freja.View.Renderer.RemoteXSLTransformer.prototype.transform=function(_142,view,_144){
var d=Freja._aux.createDeferred();
var _146=view.url;
var _147="xslFile="+encodeURIComponent(_146)+"&xmlData="+encodeURIComponent(Freja._aux.serializeXML(_142.document));
var _148="";
for(var _149 in _144){
_148+=encodeURIComponent(_149+","+_144[_149]);
}
if(_148.length>0){
_147=_147+"&xslParam="+_148;
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
req.send(_147);
return d;
};
Freja.UndoHistory=function(){
this.cache=[];
this.maxLength=5;
this._position=0;
this._undoSteps=0;
};
Freja.UndoHistory.prototype.add=function(_14b){
var _14c=this._position%this.maxLength;
var _14d=_14b.document;
this.cache[_14c]={};
this.cache[_14c].model=_14b;
this.cache[_14c].document=Freja._aux.cloneXMLDocument(_14d);
if(!this.cache[_14c].document){
throw new Error("Couldn't add to history.");
}else{
this._position++;
var _14e=_14c;
while(this._undoSteps>0){
_14e=(_14e+1)%this.maxLength;
this.cache[_14e]={};
this._undoSteps--;
}
return _14c;
}
};
Freja.UndoHistory.prototype.undo=function(_14f){
if(this._undoSteps<this.cache.length){
this._undoSteps++;
this._position--;
if(this._position<0){
this._position=this.maxLength-1;
}
var _150=this.cache[this._position].model;
if(this.cache[this._position].document){
_150.document=this.cache[this._position].document;
}else{
throw new Error("The model's DOMDocument wasn't properly copied into the history");
}
if(typeof (_14f)!="undefined"&&_14f>1){
this.undo(_14f-1);
}
}else{
throw new Error("Nothing to undo");
}
};
Freja.UndoHistory.prototype.redo=function(){
if(this._undoSteps>0){
this._undoSteps--;
this._position=(this._position+1)%this.maxLength;
var _151=this.cache[this._position].model;
_151.document=this.cache[this._position].document;
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
var _155=Freja._aux.bind(function(_156){
this.document=_156;
this.ready=true;
Freja._aux.signal(this,"onload");
},m);
this.loadAsset(url,true).addCallbacks(_155,Freja.AssetManager.onerror);
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
var _15a=Freja._aux.bind(function(_15b){
this.document=_15b;
this.ready=true;
Freja._aux.signal(this,"onload");
},v);
this.loadAsset(url,false).addCallbacks(_15a,Freja.AssetManager.onerror);
this.views.push(v);
return v;
};
Freja.AssetManager.openXMLHttpRequest=function(_15c,url){
var _15e=null;
if(Freja.AssetManager.HTTP_METHOD_TUNNEL&&_15c!="GET"&&_15c!="POST"){
_15e=_15c;
_15c="POST";
}
var req=Freja._aux.openXMLHttpRequest(_15c,url,Freja.AssetManager.HTTP_REQUEST_TYPE=="async",Freja.AssetManager._username,Freja.AssetManager._password);
if(_15e){
req.setRequestHeader(Freja.AssetManager.HTTP_METHOD_TUNNEL,_15e);
}
return req;
};
Freja.AssetManager.setCredentials=function(_160,_161){
this._username=_160;
this._password=_161;
};
Freja.AssetManager.loadAsset=function(url,_163){
var _164=/^(file:\/\/.*\/)([^\/]*)$/.exec(window.location.href);
if(_164){
url=_164[1]+url;
}
var d=Freja._aux.createDeferred();
var _166=function(_167){
try{
if(_167.responseText==""){
throw new Error("Empty response.");
}
if(_167.responseXML.xml==""){
var _168=Freja._aux.loadXML(_167.responseText);
}else{
var _168=_167.responseXML;
}
}
catch(ex){
d.errback(ex);
}
if(Freja.AssetManager.HTTP_REQUEST_TYPE=="async"&&window.document.all){
setTimeout(function(){
d.callback(_168);
},1);
}else{
d.callback(_168);
}
};
try{
if(_163&&Freja.AssetManager.HTTP_METHOD_TUNNEL){
var req=Freja._aux.openXMLHttpRequest("POST",url,Freja.AssetManager.HTTP_REQUEST_TYPE=="async",Freja.AssetManager._username,Freja.AssetManager._password);
req.setRequestHeader(Freja.AssetManager.HTTP_METHOD_TUNNEL,"GET");
req.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
}else{
var req=Freja._aux.openXMLHttpRequest("GET",url,Freja.AssetManager.HTTP_REQUEST_TYPE=="async",Freja.AssetManager._username,Freja.AssetManager._password);
}
var comm=Freja._aux.sendXMLHttpRequest(req);
if(Freja.AssetManager.HTTP_REQUEST_TYPE=="async"){
comm.addCallbacks(_166,function(req){
d.errback(new Error("Request failed:"+req.status));
});
}else{
if(req.status==0||req.status==200||req.status==201||req.status==304){
_166(req);
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


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
if(typeof (dojo)!="undefined"){
dojo.require("MochiKit.Base");
dojo.require("MochiKit.Signal");
dojo.require("MochiKit.Async");
dojo.require("Sarissa");
}
if(typeof (JSAN)!="undefined"){
JSAN.use("MochiKit.Base",[]);
JSAN.use("MochiKit.Signal",[]);
JSAN.use("MochiKit.Async",[]);
JSAN.use("Sarissa",[]);
}
try{
if(typeof (MochiKit.Base)=="undefined"){
throw "";
}
if(typeof (MochiKit.Signal)=="undefined"){
throw "";
}
if(typeof (MochiKit.Async)=="undefined"){
throw "";
}
if(typeof (Sarissa)=="undefined"){
throw "";
}
}
catch(e){
throw new Error("Freja depends on MochiKit.Base, MochiKit.Signal, MochiKit.Async and Sarissa!");
}
if(typeof (Freja)=="undefined"){
Freja={};
}
Freja._aux={};
Freja._aux.bind=MochiKit.Base.bind;
Freja._aux.formContents=function(_4){
if(!_4){
_4=document;
}
var _5=[];
var _6=[];
var _7=_4.getElementsByTagName("INPUT");
for(var i=0;i<_7.length;++i){
var _9=_7[i];
if(_9.name){
if(_9.type=="radio"||_9.type=="checkbox"){
if(_9.checked){
_5.push(_9.name);
_6.push(_9.value);
}else{
_5.push(_9.name);
_6.push("");
}
}else{
_5.push(_9.name);
_6.push(_9.value);
}
}
}
var _a=_4.getElementsByTagName("TEXTAREA");
for(var i=0;i<_a.length;++i){
var _9=_a[i];
if(_9.name){
_5.push(_9.name);
_6.push(_9.value);
}
}
var _b=_4.getElementsByTagName("SELECT");
for(var i=0;i<_b.length;++i){
var _9=_b[i];
if(_9.name){
if(_9.selectedIndex>=0){
var _c=_9.options[_9.selectedIndex];
_5.push(_9.name);
_6.push((_c.value)?_c.value:"");
}
}
}
return [_5,_6];
};
Freja._aux.getElement=MochiKit.DOM.getElement;
Freja._aux.connect=MochiKit.Signal.connect;
Freja._aux.signal=MochiKit.Signal.signal;
Freja._aux.createDeferred=function(){
return new MochiKit.Async.Deferred();
};
Freja._aux.openXMLHttpRequest=function(_d,_e,_f,_10,_11){
var req=new XMLHttpRequest();
if(_10&&_11){
req.open(_d,_e,_f,_10,_11);
}else{
req.open(_d,_e,_f);
}
if(_d=="POST"||_d=="PUT"){
req.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
}
req.setRequestHeader("X-Requested-With","XMLHttpRequest");
return req;
};
Freja._aux.sendXMLHttpRequest=MochiKit.Async.sendXMLHttpRequest;
Freja._aux.xmlize=Sarissa.xmlize;
Freja._aux.serializeXML=function(_13){
if(_13.xml){
return _13.xml;
}
return (new XMLSerializer()).serializeToString(_13);
};
Freja._aux.loadXML=function(_14){
return (new DOMParser()).parseFromString(_14,"text/xml");
};
Freja._aux.transformXSL=function(xml,xsl,_17){
var _18=new XSLTProcessor();
_18.importStylesheet(xsl);
if(_17){
for(var _19 in _17){
_18.setParameter("",_19,_17[_19]);
}
}
return _18.transformToFragment(xml,window.document);
};
Freja._aux.cloneXMLDocument=function(_1a){
var _1b=null;
try{
_1b=_1a.cloneNode(true);
}
catch(e){
}
if(!_1b){
if(document.implementation&&document.implementation.createDocument){
_1b=document.implementation.createDocument("",_1a.documentElement.nodeName,null);
var _1c=_1b.importNode(_1a.documentElement.cloneNode(true),true);
try{
_1b.appendChild(_1c);
}
catch(e){
var _1d=_1b.documentElement;
for(var i=_1c.childNodes.length-1;i>=0;i--){
_1d.insertBefore(_1c.childNodes[i],_1d.firstChild);
}
for(var i=0;i<_1a.documentElement.attributes.length;i++){
var _1f=_1a.documentElement.attributes.item(i).name;
var _20=_1a.documentElement.attributes.item(i).value;
_1b.documentElement.setAttribute(_1f,_20);
}
}
}
}
return _1b;
};
Freja._aux.hasSupportForXSLT=function(){
return (typeof (XSLTProcessor)!="undefined");
};
Freja._aux.createQueryEngine=function(){
if(Sarissa._SARISSA_IS_IE||Sarissa.IS_ENABLED_SELECT_NODES){
return new Freja.QueryEngine.XPath();
}else{
return new Freja.QueryEngine.SimplePath();
}
};
Freja._aux.importNode=function(_21,_22,_23){
if(typeof _23=="undefined"){
_23=true;
}
if(_21.importNode){
return _21.importNode(_22,_23);
}else{
return _22.cloneNode(_23);
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
Sarissa.pickRecentProgID=function(_24){
var _25=false,e;
var _26;
for(var i=0;i<_24.length&&!_25;i++){
try{
var _28=new ActiveXObject(_24[i]);
_26=_24[i];
_25=true;
}
catch(objException){
e=objException;
}
}
if(!_25){
throw "Could not retrieve a valid progID of Class: "+_24[_24.length-1]+". (original exception: "+e+")";
}
_24=null;
return _26;
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
Sarissa.getDomDocument=function(_29,_2a){
if(!_SARISSA_DOM_PROGID){
_SARISSA_DOM_PROGID=Sarissa.pickRecentProgID(["Msxml2.DOMDocument.6.0","Msxml2.DOMDocument.3.0","MSXML2.DOMDocument","MSXML.DOMDocument","Microsoft.XMLDOM"]);
}
var _2b=new ActiveXObject(_SARISSA_DOM_PROGID);
if(_2a){
var _2c="";
if(_29){
if(_2a.indexOf(":")>1){
_2c=_2a.substring(0,_2a.indexOf(":"));
_2a=_2a.substring(_2a.indexOf(":")+1);
}else{
_2c="a"+Sarissa._getUniqueSuffix();
}
}
if(_29){
_2b.loadXML("<"+_2c+":"+_2a+" xmlns:"+_2c+"=\""+_29+"\""+" />");
}else{
_2b.loadXML("<"+_2a+" />");
}
}
return _2b;
};
Sarissa.getParseErrorText=function(_2d){
var _2e=Sarissa.PARSED_OK;
if(_2d&&_2d.parseError&&_2d.parseError.errorCode&&_2d.parseError.errorCode!=0){
_2e="XML Parsing Error: "+_2d.parseError.reason+"\nLocation: "+_2d.parseError.url+"\nLine Number "+_2d.parseError.line+", Column "+_2d.parseError.linepos+":\n"+_2d.parseError.srcText+"\n";
for(var i=0;i<_2d.parseError.linepos;i++){
_2e+="-";
}
_2e+="^\n";
}else{
if(_2d.documentElement===null){
_2e=Sarissa.PARSED_EMPTY;
}
}
return _2e;
};
Sarissa.setXpathNamespaces=function(_30,_31){
_30.setProperty("SelectionLanguage","XPath");
_30.setProperty("SelectionNamespaces",_31);
};
XSLTProcessor=function(){
if(!_SARISSA_XSLTEMPLATE_PROGID){
_SARISSA_XSLTEMPLATE_PROGID=Sarissa.pickRecentProgID(["Msxml2.XSLTemplate.6.0","MSXML2.XSLTemplate.3.0"]);
}
this.template=new ActiveXObject(_SARISSA_XSLTEMPLATE_PROGID);
this.processor=null;
};
XSLTProcessor.prototype.importStylesheet=function(_32){
if(!_SARISSA_THREADEDDOM_PROGID){
_SARISSA_THREADEDDOM_PROGID=Sarissa.pickRecentProgID(["MSXML2.FreeThreadedDOMDocument.6.0","MSXML2.FreeThreadedDOMDocument.3.0"]);
}
_32.setProperty("SelectionLanguage","XPath");
_32.setProperty("SelectionNamespaces","xmlns:xsl='http://www.w3.org/1999/XSL/Transform'");
var _33=new ActiveXObject(_SARISSA_THREADEDDOM_PROGID);
try{
_33.resolveExternals=true;
_33.setProperty("AllowDocumentFunction",true);
}
catch(e){
}
if(_32.url&&_32.selectSingleNode("//xsl:*[local-name() = 'import' or local-name() = 'include']")!=null){
_33.async=false;
_33.load(_32.url);
}else{
_33.loadXML(_32.xml);
}
_33.setProperty("SelectionNamespaces","xmlns:xsl='http://www.w3.org/1999/XSL/Transform'");
var _34=_33.selectSingleNode("//xsl:output");
if(_34){
this.outputMethod=_34.getAttribute("method");
}else{
delete this.outputMethod;
}
this.template.stylesheet=_33;
this.processor=this.template.createProcessor();
this.paramsSet=[];
};
XSLTProcessor.prototype.transformToDocument=function(_35){
var _36;
if(_SARISSA_THREADEDDOM_PROGID){
this.processor.input=_35;
_36=new ActiveXObject(_SARISSA_DOM_PROGID);
this.processor.output=_36;
this.processor.transform();
return _36;
}else{
if(!_SARISSA_DOM_XMLWRITER){
_SARISSA_DOM_XMLWRITER=Sarissa.pickRecentProgID(["Msxml2.MXXMLWriter.6.0","Msxml2.MXXMLWriter.3.0","MSXML2.MXXMLWriter","MSXML.MXXMLWriter","Microsoft.XMLDOM"]);
}
this.processor.input=_35;
_36=new ActiveXObject(_SARISSA_DOM_XMLWRITER);
this.processor.output=_36;
this.processor.transform();
var _37=new ActiveXObject(_SARISSA_DOM_PROGID);
_37.loadXML(_36.output+"");
return _37;
}
};
XSLTProcessor.prototype.transformToFragment=function(_38,_39){
this.processor.input=_38;
this.processor.transform();
var s=this.processor.output;
var f=_39.createDocumentFragment();
var _3c;
if(this.outputMethod=="text"){
f.appendChild(_39.createTextNode(s));
}else{
if(_39.body&&_39.body.innerHTML){
_3c=_39.createElement("div");
_3c.innerHTML=s;
while(_3c.hasChildNodes()){
f.appendChild(_3c.firstChild);
}
}else{
var _3d=new ActiveXObject(_SARISSA_DOM_PROGID);
if(s.substring(0,5)=="<?xml"){
s=s.substring(s.indexOf("?>")+2);
}
var xml="".concat("<my>",s,"</my>");
_3d.loadXML(xml);
_3c=_3d.documentElement;
while(_3c.hasChildNodes()){
f.appendChild(_3c.firstChild);
}
}
}
return f;
};
XSLTProcessor.prototype.setParameter=function(_3f,_40,_41){
_41=_41?_41:"";
if(_3f){
this.processor.addParameter(_40,_41,_3f);
}else{
this.processor.addParameter(_40,_41);
}
_3f=""+(_3f||"");
if(!this.paramsSet[_3f]){
this.paramsSet[_3f]=[];
}
this.paramsSet[_3f][_40]=_41;
};
XSLTProcessor.prototype.getParameter=function(_42,_43){
_42=""+(_42||"");
if(this.paramsSet[_42]&&this.paramsSet[_42][_43]){
return this.paramsSet[_42][_43];
}else{
return null;
}
};
XSLTProcessor.prototype.clearParameters=function(){
for(var _44 in this.paramsSet){
for(var _45 in this.paramsSet[_44]){
if(_44!=""){
this.processor.addParameter(_45,"",_44);
}else{
this.processor.addParameter(_45,"");
}
}
}
this.paramsSet=[];
};
}else{
if(Sarissa._SARISSA_HAS_DOM_CREATE_DOCUMENT){
Sarissa.__handleLoad__=function(_46){
Sarissa.__setReadyState__(_46,4);
};
_sarissa_XMLDocument_onload=function(){
Sarissa.__handleLoad__(this);
};
Sarissa.__setReadyState__=function(_47,_48){
_47.readyState=_48;
_47.readystate=_48;
if(_47.onreadystatechange!=null&&typeof _47.onreadystatechange=="function"){
_47.onreadystatechange();
}
};
Sarissa.getDomDocument=function(_49,_4a){
var _4b=document.implementation.createDocument(_49?_49:null,_4a?_4a:null,null);
if(!_4b.onreadystatechange){
_4b.onreadystatechange=null;
}
if(!_4b.readyState){
_4b.readyState=0;
}
_4b.addEventListener("load",_sarissa_XMLDocument_onload,false);
return _4b;
};
if(window.XMLDocument){
}else{
if(Sarissa._SARISSA_HAS_DOM_FEATURE&&window.Document&&!Document.prototype.load&&document.implementation.hasFeature("LS","3.0")){
Sarissa.getDomDocument=function(_4c,_4d){
var _4e=document.implementation.createDocument(_4c?_4c:null,_4d?_4d:null,null);
return _4e;
};
}else{
Sarissa.getDomDocument=function(_4f,_50){
var _51=document.implementation.createDocument(_4f?_4f:null,_50?_50:null,null);
if(_51&&(_4f||_50)&&!_51.documentElement){
_51.appendChild(_51.createElementNS(_4f,_50));
}
return _51;
};
}
}
}
}
if(!window.DOMParser){
if(Sarissa._SARISSA_IS_SAFARI){
DOMParser=function(){
};
DOMParser.prototype.parseFromString=function(_52,_53){
var _54=new XMLHttpRequest();
_54.open("GET","data:text/xml;charset=utf-8,"+encodeURIComponent(_52),false);
_54.send(null);
return _54.responseXML;
};
}else{
if(Sarissa.getDomDocument&&Sarissa.getDomDocument()&&Sarissa.getDomDocument(null,"bar").xml){
DOMParser=function(){
};
DOMParser.prototype.parseFromString=function(_55,_56){
var doc=Sarissa.getDomDocument();
doc.loadXML(_55);
return doc;
};
}
}
}
if((typeof (document.importNode)=="undefined")&&Sarissa._SARISSA_IS_IE){
try{
document.importNode=function(_58,_59){
var tmp;
if(_58.nodeName=="#text"){
return document.createTextNode(_58.data);
}else{
if(_58.nodeName=="tbody"||_58.nodeName=="tr"){
tmp=document.createElement("table");
}else{
if(_58.nodeName=="td"){
tmp=document.createElement("tr");
}else{
if(_58.nodeName=="option"){
tmp=document.createElement("select");
}else{
tmp=document.createElement("div");
}
}
}
if(_59){
tmp.innerHTML=_58.xml?_58.xml:_58.outerHTML;
}else{
tmp.innerHTML=_58.xml?_58.cloneNode(false).xml:_58.cloneNode(false).outerHTML;
}
return tmp.getElementsByTagName("*")[0];
}
};
}
catch(e){
}
}
if(!Sarissa.getParseErrorText){
Sarissa.getParseErrorText=function(_5b){
var _5c=Sarissa.PARSED_OK;
if((!_5b)||(!_5b.documentElement)){
_5c=Sarissa.PARSED_EMPTY;
}else{
if(_5b.documentElement.tagName=="parsererror"){
_5c=_5b.documentElement.firstChild.data;
_5c+="\n"+_5b.documentElement.firstChild.nextSibling.firstChild.data;
}else{
if(_5b.getElementsByTagName("parsererror").length>0){
var _5d=_5b.getElementsByTagName("parsererror")[0];
_5c=Sarissa.getText(_5d,true)+"\n";
}else{
if(_5b.parseError&&_5b.parseError.errorCode!=0){
_5c=Sarissa.PARSED_UNKNOWN_ERROR;
}
}
}
}
return _5c;
};
}
Sarissa.getText=function(_5e,_5f){
var s="";
var _61=_5e.childNodes;
for(var i=0;i<_61.length;i++){
var _63=_61[i];
var _64=_63.nodeType;
if(_64==Node.TEXT_NODE||_64==Node.CDATA_SECTION_NODE){
s+=_63.data;
}else{
if(_5f===true&&(_64==Node.ELEMENT_NODE||_64==Node.DOCUMENT_NODE||_64==Node.DOCUMENT_FRAGMENT_NODE)){
s+=Sarissa.getText(_63,true);
}
}
}
return s;
};
if(!window.XMLSerializer&&Sarissa.getDomDocument&&Sarissa.getDomDocument("","foo",null).xml){
XMLSerializer=function(){
};
XMLSerializer.prototype.serializeToString=function(_65){
return _65.xml;
};
}
Sarissa.stripTags=function(s){
return s?s.replace(/<[^>]+>/g,""):s;
};
Sarissa.clearChildNodes=function(_67){
while(_67.firstChild){
_67.removeChild(_67.firstChild);
}
};
Sarissa.copyChildNodes=function(_68,_69,_6a){
if(Sarissa._SARISSA_IS_SAFARI&&_69.nodeType==Node.DOCUMENT_NODE){
_69=_69.documentElement;
}
if((!_68)||(!_69)){
throw "Both source and destination nodes must be provided";
}
if(!_6a){
Sarissa.clearChildNodes(_69);
}
var _6b=_69.nodeType==Node.DOCUMENT_NODE?_69:_69.ownerDocument;
var _6c=_68.childNodes;
var i;
if(typeof (_6b.importNode)!="undefined"){
for(i=0;i<_6c.length;i++){
_69.appendChild(_6b.importNode(_6c[i],true));
}
}else{
for(i=0;i<_6c.length;i++){
_69.appendChild(_6c[i].cloneNode(true));
}
}
};
Sarissa.moveChildNodes=function(_6e,_6f,_70){
if((!_6e)||(!_6f)){
throw "Both source and destination nodes must be provided";
}
if(!_70){
Sarissa.clearChildNodes(_6f);
}
var _71=_6e.childNodes;
if(_6e.ownerDocument==_6f.ownerDocument){
while(_6e.firstChild){
_6f.appendChild(_6e.firstChild);
}
}else{
var _72=_6f.nodeType==Node.DOCUMENT_NODE?_6f:_6f.ownerDocument;
var i;
if(typeof (_72.importNode)!="undefined"){
for(i=0;i<_71.length;i++){
_6f.appendChild(_72.importNode(_71[i],true));
}
}else{
for(i=0;i<_71.length;i++){
_6f.appendChild(_71[i].cloneNode(true));
}
}
Sarissa.clearChildNodes(_6e);
}
};
Sarissa.xmlize=function(_74,_75,_76){
_76=_76?_76:"";
var s=_76+"<"+_75+">";
var _78=false;
if(!(_74 instanceof Object)||_74 instanceof Number||_74 instanceof String||_74 instanceof Boolean||_74 instanceof Date){
s+=Sarissa.escape(""+_74);
_78=true;
}else{
s+="\n";
var _79=_74 instanceof Array;
for(var _7a in _74){
s+=Sarissa.xmlize(_74[_7a],(_79?"array-item key=\""+_7a+"\"":_7a),_76+"   ");
}
s+=_76;
}
return (s+=(_75.indexOf(" ")!=-1?"</array-item>\n":"</"+_75+">\n"));
};
Sarissa.escape=function(_7b){
return _7b.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;");
};
Sarissa.unescape=function(_7c){
return _7c.replace(/&apos;/g,"'").replace(/&quot;/g,"\"").replace(/&gt;/g,">").replace(/&lt;/g,"<").replace(/&amp;/g,"&");
};
Sarissa.updateCursor=function(_7d,_7e){
if(_7d&&_7d.style&&_7d.style.cursor!=undefined){
_7d.style.cursor=_7e;
}
};
Sarissa.updateContentFromURI=function(_7f,_80,_81,_82,_83){
try{
Sarissa.updateCursor(_80,"wait");
var _84=new XMLHttpRequest();
_84.open("GET",_7f,true);
_84.onreadystatechange=function(){
if(_84.readyState==4){
try{
var _85=_84.responseXML;
if(_85&&Sarissa.getParseErrorText(_85)==Sarissa.PARSED_OK){
Sarissa.updateContentFromNode(_84.responseXML,_80,_81);
if(_82){
_82(_7f,_80);
}
}else{
throw Sarissa.getParseErrorText(_85);
}
}
catch(e){
if(_82){
_82(_7f,_80,e);
}else{
throw e;
}
}
}
};
if(_83){
var _86="Sat, 1 Jan 2000 00:00:00 GMT";
_84.setRequestHeader("If-Modified-Since",_86);
}
_84.send("");
}
catch(e){
Sarissa.updateCursor(_80,"auto");
if(_82){
_82(_7f,_80,e);
}else{
throw e;
}
}
};
Sarissa.updateContentFromNode=function(_87,_88,_89){
try{
Sarissa.updateCursor(_88,"wait");
Sarissa.clearChildNodes(_88);
var _8a=_87.nodeType==Node.DOCUMENT_NODE?_87:_87.ownerDocument;
if(_8a.parseError&&_8a.parseError.errorCode!=0){
var pre=document.createElement("pre");
pre.appendChild(document.createTextNode(Sarissa.getParseErrorText(_8a)));
_88.appendChild(pre);
}else{
if(_89){
_87=_89.transformToDocument(_87);
}
if(_88.tagName.toLowerCase()=="textarea"||_88.tagName.toLowerCase()=="input"){
_88.value=new XMLSerializer().serializeToString(_87);
}else{
try{
_88.appendChild(_88.ownerDocument.importNode(_87,true));
}
catch(e){
_88.innerHTML=new XMLSerializer().serializeToString(_87);
}
}
}
}
catch(e){
throw e;
}
finally{
Sarissa.updateCursor(_88,"auto");
}
};
Sarissa.formToQueryString=function(_8c){
var qs="";
for(var i=0;i<_8c.elements.length;i++){
var _8f=_8c.elements[i];
var _90=_8f.getAttribute("name")?_8f.getAttribute("name"):_8f.getAttribute("id");
if(_90&&((!_8f.disabled)||_8f.type=="hidden")){
switch(_8f.type){
case "hidden":
case "text":
case "textarea":
case "password":
qs+=_90+"="+encodeURIComponent(_8f.value)+"&";
break;
case "select-one":
qs+=_90+"="+encodeURIComponent(_8f.options[_8f.selectedIndex].value)+"&";
break;
case "select-multiple":
for(var j=0;j<_8f.length;j++){
var _92=_8f.options[j];
if(_92.selected===true){
qs+=_90+"[]"+"="+encodeURIComponent(_92.value)+"&";
}
}
break;
case "checkbox":
case "radio":
if(_8f.checked){
qs+=_90+"="+encodeURIComponent(_8f.value)+"&";
}
break;
}
}
}
return qs.substr(0,qs.length-1);
};
Sarissa.updateContentFromForm=function(_93,_94,_95,_96){
try{
Sarissa.updateCursor(_94,"wait");
var _97=Sarissa.formToQueryString(_93)+"&"+Sarissa.REMOTE_CALL_FLAG+"=true";
var _98=new XMLHttpRequest();
var _99=_93.getAttribute("method")&&_93.getAttribute("method").toLowerCase()=="get";
if(_99){
_98.open("GET",_93.getAttribute("action")+"?"+_97,true);
}else{
_98.open("POST",_93.getAttribute("action"),true);
_98.setRequestHeader("Content-type","application/x-www-form-urlencoded");
_98.setRequestHeader("Content-length",_97.length);
_98.setRequestHeader("Connection","close");
}
_98.onreadystatechange=function(){
try{
if(_98.readyState==4){
var _9a=_98.responseXML;
if(_9a&&Sarissa.getParseErrorText(_9a)==Sarissa.PARSED_OK){
Sarissa.updateContentFromNode(_98.responseXML,_94,_95);
if(_96){
_96(_93,_94);
}
}else{
throw Sarissa.getParseErrorText(_9a);
}
}
}
catch(e){
if(_96){
_96(_93,_94,e);
}else{
throw e;
}
}
};
_98.send(_99?"":_97);
}
catch(e){
Sarissa.updateCursor(_94,"auto");
if(_96){
_96(_93,_94,e);
}else{
throw e;
}
}
return false;
};
Sarissa.FUNCTION_NAME_REGEXP=new RegExp("");
Sarissa.getFunctionName=function(_9b,_9c){
var _9d;
if(!_9d){
if(_9c){
_9d="SarissaAnonymous"+Sarissa._getUniqueSuffix();
window[_9d]=_9b;
}else{
_9d=null;
}
}
if(_9d){
window[_9d]=_9b;
}
return _9d;
};
Sarissa.setRemoteJsonCallback=function(url,_9f,_a0){
if(!_a0){
_a0="callback";
}
var _a1=Sarissa.getFunctionName(_9f,true);
var id="sarissa_json_script_id_"+Sarissa._getUniqueSuffix();
var _a3=document.getElementsByTagName("head")[0];
var _a4=document.createElement("script");
_a4.type="text/javascript";
_a4.id=id;
_a4.onload=function(){
};
if(url.indexOf("?")!=-1){
url+=("&"+_a0+"="+_a1);
}else{
url+=("?"+_a0+"="+_a1);
}
_a4.src=url;
_a3.appendChild(_a4);
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
Sarissa.setXpathNamespaces=function(_a9,_aa){
_a9._sarissa_useCustomResolver=true;
var _ab=_aa.indexOf(" ")>-1?_aa.split(" "):[_aa];
_a9._sarissa_xpathNamespaces=[];
for(var i=0;i<_ab.length;i++){
var ns=_ab[i];
var _ae=ns.indexOf(":");
var _af=ns.indexOf("=");
if(_ae>0&&_af>_ae+1){
var _b0=ns.substring(_ae+1,_af);
var uri=ns.substring(_af+2,ns.length-1);
_a9._sarissa_xpathNamespaces[_b0]=uri;
}else{
throw "Bad format on namespace declaration(s) given";
}
}
};
XMLDocument.prototype._sarissa_useCustomResolver=false;
XMLDocument.prototype._sarissa_xpathNamespaces=[];
XMLDocument.prototype.selectNodes=function(_b2,_b3,_b4){
var _b5=this;
var _b6;
if(this._sarissa_useCustomResolver){
_b6=function(_b7){
var s=_b5._sarissa_xpathNamespaces[_b7];
if(s){
return s;
}else{
throw "No namespace URI found for prefix: '"+_b7+"'";
}
};
}else{
_b6=this.createNSResolver(this.documentElement);
}
var _b9=null;
if(!_b4){
var _ba=this.evaluate(_b2,(_b3?_b3:this),_b6,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);
var _bb=new SarissaNodeList(_ba.snapshotLength);
_bb.expr=_b2;
for(var i=0;i<_bb.length;i++){
_bb[i]=_ba.snapshotItem(i);
}
_b9=_bb;
}else{
_b9=this.evaluate(_b2,(_b3?_b3:this),_b6,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
}
return _b9;
};
Element.prototype.selectNodes=function(_bd){
var doc=this.ownerDocument;
if(doc.selectNodes){
return doc.selectNodes(_bd,this);
}else{
throw "Method selectNodes is only supported by XML Elements";
}
};
XMLDocument.prototype.selectSingleNode=function(_bf,_c0){
var ctx=_c0?_c0:null;
return this.selectNodes(_bf,ctx,true);
};
Element.prototype.selectSingleNode=function(_c2){
var doc=this.ownerDocument;
if(doc.selectSingleNode){
return doc.selectSingleNode(_c2,this);
}else{
throw "Method selectNodes is only supported by XML Elements";
}
};
Sarissa.IS_ENABLED_SELECT_NODES=true;
}
Freja.QueryEngine=function(){
};
Freja.QueryEngine.prototype.getElementById=function(_c4,id){
var _c6=_c4.getElementsByTagName("*");
for(var i=0;i<_c6.length;i++){
if(_c6[i].getAttribute("id")==id){
return _c6[i];
}
}
};
Freja.QueryEngine.prototype.get=function(_c8,_c9){
var _ca=this._find(_c8,_c9);
if(!_ca){
throw new Error("Can't evaluate expression "+_c9);
}
switch(_ca.nodeType){
case 1:
if(_ca.firstChild&&(_ca.firstChild.nodeType==3||_ca.firstChild.nodeType==4)){
return _ca.firstChild.nodeValue;
}
break;
case 2:
return _ca.nodeValue;
break;
case 3:
case 4:
return _ca.nodeValue;
break;
}
return null;
};
Freja.QueryEngine.prototype.set=function(_cb,_cc,_cd){
var _ce=this._find(_cb,_cc);
if(!_ce){
var _cf=_cc.substr(_cc.lastIndexOf("/")+1);
if(_cf.charAt(0)=="@"){
var _d0=_cc.substring(0,_cc.lastIndexOf("/"));
var _d1=this._find(_cb,_d0);
if(_d1){
_d1.setAttribute(_cf.substr(1),_cd);
return;
}
}
throw new Error("Can't evaluate expression "+_cc);
}
switch(_ce.nodeType){
case 1:
if(_ce.firstChild&&(_ce.firstChild.nodeType==3||_ce.firstChild.nodeType==4)){
_ce.firstChild.nodeValue=_cd;
}else{
if(_cd!=""){
_ce.appendChild(_cb.createTextNode(_cd));
}
}
break;
case 2:
_ce.nodeValue=_cd;
break;
case 3:
case 4:
_ce.nodeValue=_cd;
break;
}
return;
};
Freja.QueryEngine.XPath=function(){
};
Freja.Class.extend(Freja.QueryEngine.XPath,Freja.QueryEngine);
Freja.QueryEngine.XPath.prototype._find=function(_d2,_d3){
var _d4=_d2.selectSingleNode(_d3);
return _d4;
};
Freja.QueryEngine.SimplePath=function(){
};
Freja.Class.extend(Freja.QueryEngine.SimplePath,Freja.QueryEngine);
Freja.QueryEngine.SimplePath.prototype._find=function(_d5,_d6){
if(!_d6.match(/^[\d\w\/@\[\]=_\-']*$/)){
throw new Error("SimplePath can't evaluate expression: "+_d6);
}
var _d7=_d6.split("/");
var _d8=_d5;
var _d9=new RegExp("^@([\\d\\w]*)");
var _da=new RegExp("^([@\\d\\w]*)\\[([\\d]*)\\]$");
var _db=new RegExp("^([\\d\\w]+)\\[@([@\\d\\w]+)=['\"]{1}(.*)['\"]{1}\\]$");
var _dc=null;
var _dd=0;
for(var i=0;i<_d7.length;++i){
var _df=_d7[i];
var _e0=_db.exec(_df);
if(_e0){
if(i>0&&_d7[i-1]==""){
var cn=_d8.getElementsByTagName(_e0[1]);
}else{
var cn=_d8.childNodes;
}
for(var j=0,l=cn.length;j<l;j++){
if(cn[j].nodeType==1&&cn[j].tagName==_e0[1]&&cn[j].getAttribute(_e0[2])==_e0[3]){
_d8=cn[j];
break;
}
}
if(j==l){
throw new Error("SimplePath can't evaluate expression "+_df);
}
}else{
_dd=_da.exec(_df);
if(_dd){
_df=_dd[1];
_dd=_dd[2]-1;
}else{
_dd=0;
}
if(_df!=""){
_dc=_d9.exec(_df);
if(_dc){
_d8=_d8.getAttributeNode(_dc[1]);
}else{
_d8=_d8.getElementsByTagName(_df).item(_dd);
}
}
}
}
if(_d8&&_d8.firstChild&&_d8.firstChild.nodeType==3){
return _d8.firstChild;
}
if(_d8&&_d8.firstChild&&_d8.firstChild.nodeType==4){
return _d8.firstChild;
}
if(!_d8){
throw new Error("SimplePath can't evaluate expression "+_d6);
}
return _d8;
};
Freja.Model=function(url,_e4){
this.url=url;
this.ready=false;
this.document=null;
this._query=_e4;
};
Freja.Model.prototype.getElementById=function(id){
if(this.document){
return this._query.getElementById(this.document,id);
}
return null;
};
Freja.Model.prototype.get=function(_e6){
if(this.document){
return this._query.get(this.document,_e6);
}
return null;
};
Freja.Model.prototype.set=function(_e7,_e8){
if(this.document){
return this._query.set(this.document,_e7,_e8);
}
return null;
};
Freja.Model.prototype.updateFrom=function(_e9){
var _ea=_e9.getValues();
for(var i=0;i<_ea[0].length;++i){
if(_ea[0][i].lastIndexOf("/")!=-1){
try{
this.set(_ea[0][i],_ea[1][i]);
}
catch(x){
}
}
}
};
Freja.Model.prototype.save=function(){
var url=this.url;
var _ed=/^(file:\/\/.*\/)([^\/]*)$/.exec(window.location.href);
if(_ed){
url=_ed[1]+url;
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
var _f1=/^(file:\/\/.*\/)([^\/]*)$/.exec(window.location.href);
if(_f1){
url=_f1[1]+url;
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
var _f5=Freja._aux.bind(function(_f6){
this.document=_f6;
this.ready=true;
Freja._aux.signal(this,"onload");
},this);
var d=Freja.AssetManager.loadAsset(this.url,true);
d.addCallbacks(_f5,Freja.AssetManager.onerror);
return d;
};
Freja.Model.DataSource=function(_f8,_f9){
this.createURL=_f8;
this.indexURL=_f9;
};
Freja.Model.DataSource.prototype.select=function(){
return getModel(this.indexURL);
};
Freja.Model.DataSource.prototype.create=function(_fa){
var url=this.createURL;
var _fc=/^(file:\/\/.*\/)([^\/]*)$/.exec(window.location.href);
if(_fc){
url=_fc[1]+url;
}
var req=Freja.AssetManager.openXMLHttpRequest("PUT",url);
var _fe={};
for(var i=0,len=_fa[0].length;i<len;++i){
_fe[_fa[0][i]]=_fa[1][i];
}
return Freja._aux.sendXMLHttpRequest(req,Freja._aux.xmlize(_fe,"record"));
};
Freja.View=function(url,_101){
this.url=url;
this.ready=false;
this.document=null;
this._renderer=_101;
this._destination=null;
this.behaviors=[];
this.placeholder=null;
Freja._aux.connect(this,"onrendercomplete",Freja._aux.bind(this._connectBehavior,this));
};
Freja.View.prototype.render=function(_102,_103,_104){
if(typeof (_103)=="undefined"){
_103=this.placeholder;
}
if(typeof (_104)=="undefined"){
_104=this.xslParameters;
}
var _105=function(_106,view,_108,_109){
this.model=_106;
this.view=view;
this.deferred=_108;
this.xslParameters=_109;
};
_105.prototype.trigger=function(){
try{
if(!this.view.ready){
Freja._aux.connect(this.view,"onload",Freja._aux.bind(this.trigger,this));
return;
}
if(typeof (this.model)=="object"&&this.model instanceof Freja.Model&&!this.model.ready){
Freja._aux.connect(this.model,"onload",Freja._aux.bind(this.trigger,this));
return;
}
var _10a;
if(typeof (this.model)=="undefined"){
_10a={document:Freja._aux.loadXML("<?xml version='1.0' ?><dummy/>")};
}else{
if(this.model instanceof Freja.Model){
_10a=this.model;
}else{
_10a={document:Freja._aux.loadXML("<?xml version='1.0' ?>\n"+Freja._aux.xmlize(this.model,"item"))};
}
}
var _10b=this.view._renderer.transform(_10a,this.view,this.xslParameters);
_10b.addCallback(Freja._aux.bind(function(html){
if(typeof html=="string"){
this._destination.innerHTML=html;
}else{
this._destination.innerHTML="";
this._destination.appendChild(html);
}
},this.view));
_10b.addCallback(Freja._aux.bind(function(){
Freja._aux.signal(this,"onrendercomplete",this._destination);
},this.view));
_10b.addCallback(Freja._aux.bind(function(){
this.deferred.callback();
},this));
_10b.addErrback(Freja._aux.bind(function(ex){
this.deferred.errback(ex);
},this));
}
catch(ex){
this.deferred.errback(ex);
}
};
var d=Freja._aux.createDeferred();
try{
if(typeof (_103)=="object"){
this._destination=_103;
}else{
this._destination=document.getElementById(_103);
}
this._destination.innerHTML=Freja.AssetManager.THROBBER_HTML;
var h=new _105(_102,this,d,_104);
h.trigger();
}
catch(ex){
d.errback(ex);
}
return d;
};
Freja.View.prototype._connectBehavior=function(_110){
try{
var _111=function(node,_113,_114){
Freja._aux.connect(node,_113,Freja._aux.bind(function(e){
var _116=false;
try{
_116=_114(this);
}
catch(ex){
throw new Error("An error ocurred in user handler.\n"+ex.message);
}
finally{
if(!_116){
e.stop();
}
}
},node));
};
var _117=function(node,_119){
for(var i=0,c=node.childNodes,l=c.length;i<l;++i){
var _11b=c[i];
if(_11b.nodeType==1){
if(_11b.className){
var _11c=_11b.className.split(" ");
for(var j=0;j<_11c.length;j++){
var _11e=_119[_11c[j]];
if(_11e){
for(var _11f in _11e){
if(_11f=="init"){
_11e.init(_11b);
}else{
_111(_11b,_11f,_11e[_11f]);
}
}
}
}
}
_117(_11b,_119);
}
}
};
for(var ids in this.behaviors){
_117(_110,this.behaviors);
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
Freja.View.Renderer.XSLTransformer.prototype.transform=function(_121,view,_123){
var d=Freja._aux.createDeferred();
try{
var html=Freja._aux.transformXSL(_121.document,view.document,_123);
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
Freja.View.Renderer.RemoteXSLTransformer.prototype.transform=function(_127,view,_129){
var d=Freja._aux.createDeferred();
var _12b=view.url;
var _12c="xslFile="+encodeURIComponent(_12b)+"&xmlData="+encodeURIComponent(Freja._aux.serializeXML(_127.document));
var _12d="";
for(var _12e in _129){
_12d+=encodeURIComponent(_12e+","+_129[_12e]);
}
if(_12d.length>0){
_12c=_12c+"&xslParam="+_12d;
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
req.send(_12c);
return d;
};
Freja.UndoHistory=function(){
this.cache=[];
this.maxLength=5;
this._position=0;
this._undoSteps=0;
};
Freja.UndoHistory.prototype.add=function(_130){
var _131=this._position%this.maxLength;
var _132=_130.document;
this.cache[_131]={};
this.cache[_131].model=_130;
this.cache[_131].document=Freja._aux.cloneXMLDocument(_132);
if(!this.cache[_131].document){
throw new Error("Couldn't add to history.");
}else{
this._position++;
var _133=_131;
while(this._undoSteps>0){
_133=(_133+1)%this.maxLength;
this.cache[_133]={};
this._undoSteps--;
}
return _131;
}
};
Freja.UndoHistory.prototype.undo=function(_134){
if(this._undoSteps<this.cache.length){
this._undoSteps++;
this._position--;
if(this._position<0){
this._position=this.maxLength-1;
}
var _135=this.cache[this._position].model;
if(this.cache[this._position].document){
_135.document=this.cache[this._position].document;
}else{
throw new Error("The model's DOMDocument wasn't properly copied into the history");
}
if(typeof (_134)!="undefined"&&_134>1){
this.undo(_134-1);
}
}else{
throw new Error("Nothing to undo");
}
};
Freja.UndoHistory.prototype.redo=function(){
if(this._undoSteps>0){
this._undoSteps--;
this._position=(this._position+1)%this.maxLength;
var _136=this.cache[this._position].model;
_136.document=this.cache[this._position].document;
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
var _13a=Freja._aux.bind(function(_13b){
this.document=_13b;
this.ready=true;
Freja._aux.signal(this,"onload");
},m);
this.loadAsset(url,true).addCallbacks(_13a,Freja.AssetManager.onerror);
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
var _13f=Freja._aux.bind(function(_140){
this.document=_140;
this.ready=true;
Freja._aux.signal(this,"onload");
},v);
this.loadAsset(url,false).addCallbacks(_13f,Freja.AssetManager.onerror);
this.views.push(v);
return v;
};
Freja.AssetManager.openXMLHttpRequest=function(_141,url){
var _143=null;
if(Freja.AssetManager.HTTP_METHOD_TUNNEL&&_141!="GET"&&_141!="POST"){
_143=_141;
_141="POST";
}
var req=Freja._aux.openXMLHttpRequest(_141,url,Freja.AssetManager.HTTP_REQUEST_TYPE=="async",Freja.AssetManager._username,Freja.AssetManager._password);
if(_143){
req.setRequestHeader(Freja.AssetManager.HTTP_METHOD_TUNNEL,_143);
}
return req;
};
Freja.AssetManager.setCredentials=function(_145,_146){
this._username=_145;
this._password=_146;
};
Freja.AssetManager.loadAsset=function(url,_148){
var _149=/^(file:\/\/.*\/)([^\/]*)$/.exec(window.location.href);
if(_149){
url=_149[1]+url;
}
var d=Freja._aux.createDeferred();
var _14b=function(_14c){
try{
if(_14c.responseText==""){
throw new Error("Empty response.");
}
if(_14c.responseXML.xml==""){
var _14d=Freja._aux.loadXML(_14c.responseText);
}else{
var _14d=_14c.responseXML;
}
}
catch(ex){
d.errback(ex);
}
if(Freja.AssetManager.HTTP_REQUEST_TYPE=="async"&&window.document.all){
setTimeout(function(){
d.callback(_14d);
},1);
}else{
d.callback(_14d);
}
};
try{
if(_148&&Freja.AssetManager.HTTP_METHOD_TUNNEL){
var req=Freja._aux.openXMLHttpRequest("POST",url,Freja.AssetManager.HTTP_REQUEST_TYPE=="async",Freja.AssetManager._username,Freja.AssetManager._password);
req.setRequestHeader(Freja.AssetManager.HTTP_METHOD_TUNNEL,"GET");
req.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
}else{
var req=Freja._aux.openXMLHttpRequest("GET",url,Freja.AssetManager.HTTP_REQUEST_TYPE=="async",Freja.AssetManager._username,Freja.AssetManager._password);
}
var comm=Freja._aux.sendXMLHttpRequest(req);
if(Freja.AssetManager.HTTP_REQUEST_TYPE=="async"){
comm.addCallbacks(_14b,function(req){
d.errback(new Error("Request failed:"+req.status));
});
}else{
if(req.status==0||req.status==200||req.status==201||req.status==304){
_14b(req);
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


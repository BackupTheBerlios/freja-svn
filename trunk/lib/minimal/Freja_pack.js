if(typeof (dojo)!="undefined"){
dojo.provide("Freja");
}
if(typeof (Freja)=="undefined"){
Freja={};
}
Freja.NAME="Freja";
Freja.VERSION="2.1";
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
function Sarissa(){
}
Sarissa.PARSED_OK="Document contains no parsing errors";
Sarissa.PARSED_EMPTY="Document is empty";
Sarissa.PARSED_UNKNOWN_ERROR="Not well-formed or other error";
var _sarissa_iNsCounter=0;
var _SARISSA_IEPREFIX4XSLPARAM="";
var _SARISSA_HAS_DOM_IMPLEMENTATION=document.implementation&&true;
var _SARISSA_HAS_DOM_CREATE_DOCUMENT=_SARISSA_HAS_DOM_IMPLEMENTATION&&document.implementation.createDocument;
var _SARISSA_HAS_DOM_FEATURE=_SARISSA_HAS_DOM_IMPLEMENTATION&&document.implementation.hasFeature;
var _SARISSA_IS_MOZ=_SARISSA_HAS_DOM_CREATE_DOCUMENT&&_SARISSA_HAS_DOM_FEATURE;
var _SARISSA_IS_SAFARI=(navigator.userAgent&&navigator.vendor&&(navigator.userAgent.toLowerCase().indexOf("applewebkit")!=-1||navigator.vendor.indexOf("Apple")!=-1));
var _SARISSA_IS_IE=document.all&&window.ActiveXObject&&navigator.userAgent.toLowerCase().indexOf("msie")>-1&&navigator.userAgent.toLowerCase().indexOf("opera")==-1;
if(!window.Node||!Node.ELEMENT_NODE){
Node={ELEMENT_NODE:1,ATTRIBUTE_NODE:2,TEXT_NODE:3,CDATA_SECTION_NODE:4,ENTITY_REFERENCE_NODE:5,ENTITY_NODE:6,PROCESSING_INSTRUCTION_NODE:7,COMMENT_NODE:8,DOCUMENT_NODE:9,DOCUMENT_TYPE_NODE:10,DOCUMENT_FRAGMENT_NODE:11,NOTATION_NODE:12};
}
if(typeof XMLDocument=="undefined"&&typeof Document!="undefined"){
XMLDocument=Document;
}
if(_SARISSA_IS_IE){
_SARISSA_IEPREFIX4XSLPARAM="xsl:";
var _SARISSA_DOM_PROGID="";
var _SARISSA_XMLHTTP_PROGID="";
var _SARISSA_DOM_XMLWRITER="";
Sarissa.pickRecentProgID=function(_4){
var _5=false;
for(var i=0;i<_4.length&&!_5;i++){
try{
var _7=new ActiveXObject(_4[i]);
o2Store=_4[i];
_5=true;
}
catch(objException){
}
}
if(!_5){
throw "Could not retreive a valid progID of Class: "+_4[_4.length-1]+". (original exception: "+e+")";
}
_4=null;
return o2Store;
};
_SARISSA_DOM_PROGID=null;
_SARISSA_THREADEDDOM_PROGID=null;
_SARISSA_XSLTEMPLATE_PROGID=null;
_SARISSA_XMLHTTP_PROGID=null;
if(!window.XMLHttpRequest){
XMLHttpRequest=function(){
if(!_SARISSA_XMLHTTP_PROGID){
_SARISSA_XMLHTTP_PROGID=Sarissa.pickRecentProgID(["Msxml2.XMLHTTP.6.0","MSXML2.XMLHTTP.3.0","MSXML2.XMLHTTP","Microsoft.XMLHTTP"]);
}
return new ActiveXObject(_SARISSA_XMLHTTP_PROGID);
};
}
Sarissa.getDomDocument=function(_8,_9){
if(!_SARISSA_DOM_PROGID){
_SARISSA_DOM_PROGID=Sarissa.pickRecentProgID(["Msxml2.DOMDocument.6.0","Msxml2.DOMDocument.3.0","MSXML2.DOMDocument","MSXML.DOMDocument","Microsoft.XMLDOM"]);
}
var _a=new ActiveXObject(_SARISSA_DOM_PROGID);
if(_9){
var _b="";
if(_8){
if(_9.indexOf(":")>1){
_b=_9.substring(0,_9.indexOf(":"));
_9=_9.substring(_9.indexOf(":")+1);
}else{
_b="a"+(_sarissa_iNsCounter++);
}
}
if(_8){
_a.loadXML("<"+_b+":"+_9+" xmlns:"+_b+"=\""+_8+"\""+" />");
}else{
_a.loadXML("<"+_9+" />");
}
}
return _a;
};
Sarissa.getParseErrorText=function(_c){
var _d=Sarissa.PARSED_OK;
if(_c.parseError.errorCode!=0){
_d="XML Parsing Error: "+_c.parseError.reason+"\nLocation: "+_c.parseError.url+"\nLine Number "+_c.parseError.line+", Column "+_c.parseError.linepos+":\n"+_c.parseError.srcText+"\n";
for(var i=0;i<_c.parseError.linepos;i++){
_d+="-";
}
_d+="^\n";
}else{
if(_c.documentElement==null){
_d=Sarissa.PARSED_EMPTY;
}
}
return _d;
};
Sarissa.setXpathNamespaces=function(_f,_10){
_f.setProperty("SelectionLanguage","XPath");
_f.setProperty("SelectionNamespaces",_10);
};
XSLTProcessor=function(){
if(!_SARISSA_XSLTEMPLATE_PROGID){
_SARISSA_XSLTEMPLATE_PROGID=Sarissa.pickRecentProgID(["Msxml2.XSLTemplate.6.0","MSXML2.XSLTemplate.3.0"]);
}
this.template=new ActiveXObject(_SARISSA_XSLTEMPLATE_PROGID);
this.processor=null;
};
XSLTProcessor.prototype.importStylesheet=function(_11){
if(!_SARISSA_THREADEDDOM_PROGID){
_SARISSA_THREADEDDOM_PROGID=Sarissa.pickRecentProgID(["MSXML2.FreeThreadedDOMDocument.6.0","MSXML2.FreeThreadedDOMDocument.3.0"]);
}
_11.setProperty("SelectionLanguage","XPath");
_11.setProperty("SelectionNamespaces","xmlns:xsl='http://www.w3.org/1999/XSL/Transform'");
var _12=new ActiveXObject(_SARISSA_THREADEDDOM_PROGID);
if(_11.url&&_11.selectSingleNode("//xsl:*[local-name() = 'import' or local-name() = 'include']")!=null){
_12.async=false;
if(_SARISSA_THREADEDDOM_PROGID=="MSXML2.FreeThreadedDOMDocument.6.0"){
_12.setProperty("AllowDocumentFunction",true);
_12.resolveExternals=true;
}
_12.load(_11.url);
}else{
_12.loadXML(_11.xml);
}
_12.setProperty("SelectionNamespaces","xmlns:xsl='http://www.w3.org/1999/XSL/Transform'");
var _13=_12.selectSingleNode("//xsl:output");
this.outputMethod=_13?_13.getAttribute("method"):"html";
this.template.stylesheet=_12;
this.processor=this.template.createProcessor();
this.paramsSet=new Array();
};
XSLTProcessor.prototype.transformToDocument=function(_14){
if(_SARISSA_THREADEDDOM_PROGID){
this.processor.input=_14;
var _15=new ActiveXObject(_SARISSA_DOM_PROGID);
this.processor.output=_15;
this.processor.transform();
return _15;
}else{
if(!_SARISSA_DOM_XMLWRITER){
_SARISSA_DOM_XMLWRITER=Sarissa.pickRecentProgID(["Msxml2.MXXMLWriter.6.0","Msxml2.MXXMLWriter.3.0","MSXML2.MXXMLWriter","MSXML.MXXMLWriter","Microsoft.XMLDOM"]);
}
this.processor.input=_14;
var _15=new ActiveXObject(_SARISSA_DOM_XMLWRITER);
this.processor.output=_15;
this.processor.transform();
var _16=new ActiveXObject(_SARISSA_DOM_PROGID);
_16.loadXML(_15.output+"");
return _16;
}
};
XSLTProcessor.prototype.transformToFragment=function(_17,_18){
this.processor.input=_17;
this.processor.transform();
var s=this.processor.output;
var f=_18.createDocumentFragment();
if(this.outputMethod=="text"){
f.appendChild(_18.createTextNode(s));
}else{
if(_18.body&&_18.body.innerHTML){
var _1b=_18.createElement("div");
_1b.innerHTML=s;
while(_1b.hasChildNodes()){
f.appendChild(_1b.firstChild);
}
}else{
var _1c=new ActiveXObject(_SARISSA_DOM_PROGID);
if(s.substring(0,5)=="<?xml"){
s=s.substring(s.indexOf("?>")+2);
}
var xml="".concat("<my>",s,"</my>");
_1c.loadXML(xml);
var _1b=_1c.documentElement;
while(_1b.hasChildNodes()){
f.appendChild(_1b.firstChild);
}
}
}
return f;
};
XSLTProcessor.prototype.setParameter=function(_1e,_1f,_20){
if(_1e){
this.processor.addParameter(_1f,_20,_1e);
}else{
this.processor.addParameter(_1f,_20);
}
if(!this.paramsSet[""+_1e]){
this.paramsSet[""+_1e]=new Array();
}
this.paramsSet[""+_1e][_1f]=_20;
};
XSLTProcessor.prototype.getParameter=function(_21,_22){
_21=_21||"";
if(this.paramsSet[_21]&&this.paramsSet[_21][_22]){
return this.paramsSet[_21][_22];
}else{
return null;
}
};
XSLTProcessor.prototype.clearParameters=function(){
for(var _23 in this.paramsSet){
for(var _24 in this.paramsSet[_23]){
if(_23){
this.processor.addParameter(_24,null,_23);
}else{
this.processor.addParameter(_24,null);
}
}
}
this.paramsSet=new Array();
};
}else{
if(_SARISSA_HAS_DOM_CREATE_DOCUMENT){
Sarissa.__handleLoad__=function(_25){
Sarissa.__setReadyState__(_25,4);
};
_sarissa_XMLDocument_onload=function(){
Sarissa.__handleLoad__(this);
};
Sarissa.__setReadyState__=function(_26,_27){
_26.readyState=_27;
_26.readystate=_27;
if(_26.onreadystatechange!=null&&typeof _26.onreadystatechange=="function"){
_26.onreadystatechange();
}
};
Sarissa.getDomDocument=function(_28,_29){
var _2a=document.implementation.createDocument(_28?_28:null,_29?_29:null,null);
if(!_2a.onreadystatechange){
_2a.onreadystatechange=null;
}
if(!_2a.readyState){
_2a.readyState=0;
}
_2a.addEventListener("load",_sarissa_XMLDocument_onload,false);
return _2a;
};
if(window.XMLDocument){
}else{
if(_SARISSA_HAS_DOM_FEATURE&&window.Document&&!Document.prototype.load&&document.implementation.hasFeature("LS","3.0")){
Sarissa.getDomDocument=function(_2b,_2c){
var _2d=document.implementation.createDocument(_2b?_2b:null,_2c?_2c:null,null);
return _2d;
};
}else{
Sarissa.getDomDocument=function(_2e,_2f){
var _30=document.implementation.createDocument(_2e?_2e:null,_2f?_2f:null,null);
if(_30&&(_2e||_2f)&&!_30.documentElement){
_30.appendChild(_30.createElementNS(_2e,_2f));
}
return _30;
};
}
}
}
}
if(!window.DOMParser){
if(_SARISSA_IS_SAFARI){
DOMParser=function(){
};
DOMParser.prototype.parseFromString=function(_31,_32){
var _33=new XMLHttpRequest();
_33.open("GET","data:text/xml;charset=utf-8,"+encodeURIComponent(_31),false);
_33.send(null);
return _33.responseXML;
};
}else{
if(Sarissa.getDomDocument&&Sarissa.getDomDocument()&&Sarissa.getDomDocument(null,"bar").xml){
DOMParser=function(){
};
DOMParser.prototype.parseFromString=function(_34,_35){
var doc=Sarissa.getDomDocument();
doc.loadXML(_34);
return doc;
};
}
}
}
if((typeof (document.importNode)=="undefined")&&_SARISSA_IS_IE){
try{
document.importNode=function(_37,_38){
var tmp;
if(_37.nodeName=="tbody"||_37.nodeName=="tr"){
tmp=document.createElement("table");
}else{
if(_37.nodeName=="td"){
tmp=document.createElement("tr");
}else{
if(_37.nodeName=="option"){
tmp=document.createElement("select");
}else{
tmp=document.createElement("div");
}
}
}
if(_38){
tmp.innerHTML=_37.xml?_37.xml:_37.outerHTML;
}else{
tmp.innerHTML=_37.xml?_37.cloneNode(false).xml:_37.cloneNode(false).outerHTML;
}
return tmp.getElementsByTagName("*")[0];
};
}
catch(e){
}
}
if(!Sarissa.getParseErrorText){
Sarissa.getParseErrorText=function(_3a){
var _3b=Sarissa.PARSED_OK;
if(!_3a.documentElement){
_3b=Sarissa.PARSED_EMPTY;
}else{
if(_3a.documentElement.tagName=="parsererror"){
_3b=_3a.documentElement.firstChild.data;
_3b+="\n"+_3a.documentElement.firstChild.nextSibling.firstChild.data;
}else{
if(_3a.getElementsByTagName("parsererror").length>0){
var _3c=_3a.getElementsByTagName("parsererror")[0];
_3b=Sarissa.getText(_3c,true)+"\n";
}else{
if(_3a.parseError&&_3a.parseError.errorCode!=0){
_3b=Sarissa.PARSED_UNKNOWN_ERROR;
}
}
}
}
return _3b;
};
}
Sarissa.getText=function(_3d,_3e){
var s="";
var _40=_3d.childNodes;
for(var i=0;i<_40.length;i++){
var _42=_40[i];
var _43=_42.nodeType;
if(_43==Node.TEXT_NODE||_43==Node.CDATA_SECTION_NODE){
s+=_42.data;
}else{
if(_3e==true&&(_43==Node.ELEMENT_NODE||_43==Node.DOCUMENT_NODE||_43==Node.DOCUMENT_FRAGMENT_NODE)){
s+=Sarissa.getText(_42,true);
}
}
}
return s;
};
if(!window.XMLSerializer&&Sarissa.getDomDocument&&Sarissa.getDomDocument("","foo",null).xml){
XMLSerializer=function(){
};
XMLSerializer.prototype.serializeToString=function(_44){
return _44.xml;
};
}
Sarissa.stripTags=function(s){
return s.replace(/<[^>]+>/g,"");
};
Sarissa.clearChildNodes=function(_46){
while(_46.firstChild){
_46.removeChild(_46.firstChild);
}
};
Sarissa.copyChildNodes=function(_47,_48,_49){
if((!_47)||(!_48)){
throw "Both source and destination nodes must be provided";
}
if(!_49){
Sarissa.clearChildNodes(_48);
}
var _4a=_48.nodeType==Node.DOCUMENT_NODE?_48:_48.ownerDocument;
var _4b=_47.childNodes;
if(typeof (_4a.importNode)!="undefined"){
for(var i=0;i<_4b.length;i++){
_48.appendChild(_4a.importNode(_4b[i],true));
}
}else{
for(var i=0;i<_4b.length;i++){
_48.appendChild(_4b[i].cloneNode(true));
}
}
};
Sarissa.moveChildNodes=function(_4d,_4e,_4f){
if((!_4d)||(!_4e)){
throw "Both source and destination nodes must be provided";
}
if(!_4f){
Sarissa.clearChildNodes(_4e);
}
var _50=_4d.childNodes;
if(_4d.ownerDocument==_4e.ownerDocument){
while(_4d.firstChild){
_4e.appendChild(_4d.firstChild);
}
}else{
var _51=_4e.nodeType==Node.DOCUMENT_NODE?_4e:_4e.ownerDocument;
if(typeof (_51.importNode)!="undefined"){
for(var i=0;i<_50.length;i++){
_4e.appendChild(_51.importNode(_50[i],true));
}
}else{
for(var i=0;i<_50.length;i++){
_4e.appendChild(_50[i].cloneNode(true));
}
}
Sarissa.clearChildNodes(_4d);
}
};
Sarissa.xmlize=function(_53,_54,_55){
_55=_55?_55:"";
var s=_55+"<"+_54+">";
var _57=false;
if(!(_53 instanceof Object)||_53 instanceof Number||_53 instanceof String||_53 instanceof Boolean||_53 instanceof Date){
s+=Sarissa.escape(""+_53);
_57=true;
}else{
s+="\n";
var _58="";
var _59=_53 instanceof Array;
for(var _5a in _53){
s+=Sarissa.xmlize(_53[_5a],(_59?"array-item key=\""+_5a+"\"":_5a),_55+"   ");
}
s+=_55;
}
return s+=(_54.indexOf(" ")!=-1?"</array-item>\n":"</"+_54+">\n");
};
Sarissa.escape=function(_5b){
return _5b.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;");
};
Sarissa.unescape=function(_5c){
return _5c.replace(/&apos;/g,"'").replace(/&quot;/g,"\"").replace(/&gt;/g,">").replace(/&lt;/g,"<").replace(/&amp;/g,"&");
};
if(_SARISSA_HAS_DOM_FEATURE&&document.implementation.hasFeature("XPath","3.0")){
function SarissaNodeList(i){
this.length=i;
}
SarissaNodeList.prototype=new Array(0);
SarissaNodeList.prototype.constructor=Array;
SarissaNodeList.prototype.item=function(i){
return (i<0||i>=this.length)?null:this[i];
};
SarissaNodeList.prototype.expr="";
if(window.XMLDocument&&(!XMLDocument.prototype.setProperty)){
XMLDocument.prototype.setProperty=function(x,y){
};
}
Sarissa.setXpathNamespaces=function(_61,_62){
_61._sarissa_useCustomResolver=true;
var _63=_62.indexOf(" ")>-1?_62.split(" "):new Array(_62);
_61._sarissa_xpathNamespaces=new Array(_63.length);
for(var i=0;i<_63.length;i++){
var ns=_63[i];
var _66=ns.indexOf(":");
var _67=ns.indexOf("=");
if(_66>0&&_67>_66+1){
var _68=ns.substring(_66+1,_67);
var uri=ns.substring(_67+2,ns.length-1);
_61._sarissa_xpathNamespaces[_68]=uri;
}else{
throw "Bad format on namespace declaration(s) given";
}
}
};
XMLDocument.prototype._sarissa_useCustomResolver=false;
XMLDocument.prototype._sarissa_xpathNamespaces=new Array();
XMLDocument.prototype.selectNodes=function(_6a,_6b,_6c){
var _6d=this;
var _6e=this._sarissa_useCustomResolver?function(_6f){
var s=_6d._sarissa_xpathNamespaces[_6f];
if(s){
return s;
}else{
throw "No namespace URI found for prefix: '"+_6f+"'";
}
}:this.createNSResolver(this.documentElement);
var _71=null;
if(!_6c){
var _72=this.evaluate(_6a,(_6b?_6b:this),_6e,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);
var _73=new SarissaNodeList(_72.snapshotLength);
_73.expr=_6a;
for(var i=0;i<_73.length;i++){
_73[i]=_72.snapshotItem(i);
}
_71=_73;
}else{
_71=_72=this.evaluate(_6a,(_6b?_6b:this),_6e,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
}
return _71;
};
Element.prototype.selectNodes=function(_75){
var doc=this.ownerDocument;
if(doc.selectNodes){
return doc.selectNodes(_75,this);
}else{
throw "Method selectNodes is only supported by XML Elements";
}
};
XMLDocument.prototype.selectSingleNode=function(_77,_78){
var ctx=_78?_78:null;
return this.selectNodes(_77,ctx,true);
};
Element.prototype.selectSingleNode=function(_7a){
var doc=this.ownerDocument;
if(doc.selectSingleNode){
return doc.selectSingleNode(_7a,this);
}else{
throw "Method selectNodes is only supported by XML Elements";
}
};
Sarissa.IS_ENABLED_SELECT_NODES=true;
}
if(_SARISSA_IS_IE){
Sarissa.IS_ENABLED_SELECT_NODES=true;
}
if(typeof (Freja)=="undefined"){
Freja={};
}
Freja._aux={};
Freja._aux.bind=function(_7c,_7d){
if(typeof (_7c)=="string"){
_7c=_7d[_7c];
}
var _7e=null;
if(typeof (_7c.im_func)=="function"){
_7e=_7c.im_func;
}else{
_7e=_7c;
}
_7c=function(){
return _7c.im_func.apply(_7c.im_self,arguments);
};
_7c.im_func=_7e;
_7c.im_self=_7d;
return _7c;
};
Freja._aux.formContents=function(_7f){
if(!_7f){
_7f=document;
}
var _80=[];
var _81=[];
var _82=_7f.getElementsByTagName("INPUT");
for(var i=0;i<_82.length;++i){
var _84=_82[i];
if(_84.name){
if(_84.type=="radio"||_84.type=="checkbox"){
if(_84.checked){
_80.push(_84.name);
_81.push(_84.value);
}else{
_80.push(_84.name);
_81.push("");
}
}else{
_80.push(_84.name);
_81.push(_84.value);
}
}
}
var _85=_7f.getElementsByTagName("TEXTAREA");
for(var i=0;i<_85.length;++i){
var _84=_85[i];
if(_84.name){
_80.push(_84.name);
_81.push(_84.value);
}
}
var _86=_7f.getElementsByTagName("SELECT");
for(var i=0;i<_86.length;++i){
var _84=_86[i];
if(_84.name){
if(_84.selectedIndex>=0){
var opt=_84.options[_84.selectedIndex];
_80.push(_84.name);
_81.push((opt.value)?opt.value:"");
}
}
}
return [_80,_81];
};
Freja._aux.getElement=function(id){
if(typeof (id)=="object"){
return id;
}else{
return document.getElementById(id);
}
};
Freja._aux.connect=function(src,_8a,fnc){
if(!src){
return;
}
if(src.addEventListener){
var _8c=function(e){
var evt={stop:function(){
if(e.cancelable){
e.preventDefault();
}
e.stopPropagation();
}};
fnc(evt);
};
src.addEventListener(_8a.replace(/^(on)/,""),_8c,false);
}else{
if(src.attachEvent){
var _8c=function(){
var e=window.event;
var evt={stop:function(){
e.cancelBubble=true;
e.returnValue=false;
}};
fnc(evt);
};
src.attachEvent(_8a,_8c);
}
}
if(!src._signals){
src._signals=[];
}
if(!src._signals[_8a]){
src._signals[_8a]=[];
}
for(var _91=0;_91<src._signals[_8a].length;_91++){
if(src._signals[_8a][_91].toString()==fnc.toString()){
return;
}
}
src._signals[_8a].push(fnc);
};
Freja._aux.signal=function(src,_93){
try{
var _94=src._signals[_93];
var _95=[];
for(var i=2;i<arguments.length;i++){
_95.push(arguments[i]);
}
for(var i=0;i<_94.length;i++){
try{
_94[i].apply(src,_95);
}
catch(e){
}
}
}
catch(e){
}
};
Freja._aux.createDeferred=function(){
return new Freja._aux.Deferred();
};
Freja._aux.openXMLHttpRequest=function(_97,url,_99,_9a,_9b){
var req=new XMLHttpRequest();
if(_9a&&_9b){
req.open(_97,url,_99,_9a,_9b);
}else{
req.open(_97,url,_99);
}
if(_97=="POST"||_97=="PUT"){
req.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
}
req.setRequestHeader("X-Requested-With","XMLHttpRequest");
return req;
};
Freja._aux.sendXMLHttpRequest=function(req,_9e){
var d=Freja._aux.createDeferred();
var _a0=false;
req.onreadystatechange=function(){
if(req.readyState==4&&!_a0){
if(req.status==0||req.status==200||req.status==201||req.status==304){
d.callback(req);
}else{
d.errback(req);
}
_a0=true;
}
};
if(!_9e){
_9e="";
}
req.send(_9e);
return d;
};
Freja._aux.xmlize=Sarissa.xmlize;
Freja._aux.serializeXML=function(_a1){
if(_a1.xml){
return _a1.xml;
}
return (new XMLSerializer()).serializeToString(_a1);
};
Freja._aux.loadXML=function(_a2){
return (new DOMParser()).parseFromString(_a2,"text/xml");
};
Freja._aux.transformXSL=function(xml,xsl,_a5){
var _a6=new XSLTProcessor();
_a6.importStylesheet(xsl);
if(_a5){
for(var _a7 in _a5){
_a6.setParameter("",_a7,_a5[_a7]);
}
}
return _a6.transformToFragment(xml,window.document);
};
Freja._aux.cloneXMLDocument=function(_a8){
var _a9=null;
try{
_a9=_a8.cloneNode(true);
}
catch(e){
}
if(!_a9){
if(document.implementation&&document.implementation.createDocument){
_a9=document.implementation.createDocument("",_a8.documentElement.nodeName,null);
var _aa=_a9.importNode(_a8.documentElement.cloneNode(true),true);
try{
_a9.appendChild(_aa);
}
catch(e){
var _ab=_a9.documentElement;
for(var i=_aa.childNodes.length;i>=0;i--){
_ab.insertBefore(_aa.childNodes[i],_ab.firstChild);
}
for(var i=0;i<_a8.documentElement.attributes.length;i++){
var _ad=_a8.documentElement.attributes.item(i).name;
var _ae=_a8.documentElement.attributes.item(i).value;
_a9.documentElement.setAttribute(_ad,_ae);
}
}
}
}
return _a9;
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
Freja._aux.Deferred.prototype.addCallbacks=function(_b1,_b2){
if(_b1){
this._good[this._good.length]=_b1;
}
if(_b2){
this._bad[this._bad.length]=_b2;
}
if(this._pending){
this._pending[0].apply(this,this._pending[1]);
}
};
Freja._aux.Deferred.prototype.addCallback=function(_b3){
this.addCallbacks(_b3);
};
Freja._aux.Deferred.prototype.addErrback=function(_b4){
this.addCallbacks(null,_b4);
};
Freja._aux.importNode=function(_b5,_b6,_b7){
if(typeof _b7=="undefined"){
_b7=true;
}
if(_b5.importNode){
return _b5.importNode(_b6,_b7);
}else{
return _b6.cloneNode(_b7);
}
};
Freja.QueryEngine=function(){
};
Freja.QueryEngine.prototype.getElementById=function(_b8,id){
var _ba=_b8.getElementsByTagName("*");
for(var i=0;i<_ba.length;i++){
if(_ba[i].getAttribute("id")==id){
return _ba[i];
}
}
};
Freja.QueryEngine.prototype.get=function(_bc,_bd){
var _be=this._find(_bc,_bd);
if(!_be){
throw new Error("Can't evaluate expression "+_bd);
}
switch(_be.nodeType){
case 1:
if(_be.firstChild&&(_be.firstChild.nodeType==3||_be.firstChild.nodeType==4)){
return _be.firstChild.nodeValue;
}
break;
case 2:
return _be.nodeValue;
break;
case 3:
case 4:
return _be.nodeValue;
break;
}
return null;
};
Freja.QueryEngine.prototype.set=function(_bf,_c0,_c1){
var _c2=this._find(_bf,_c0);
if(!_c2){
var _c3=_c0.substr(_c0.lastIndexOf("/")+1);
if(_c3.charAt(0)=="@"){
var _c4=_c0.substring(0,_c0.lastIndexOf("/"));
var _c5=this._find(_bf,_c4);
if(_c5){
_c5.setAttribute(_c3.substr(1),_c1);
return;
}
}
throw new Error("Can't evaluate expression "+_c0);
}
switch(_c2.nodeType){
case 1:
if(_c2.firstChild&&(_c2.firstChild.nodeType==3||_c2.firstChild.nodeType==4)){
_c2.firstChild.nodeValue=_c1;
}else{
if(_c1!=""){
_c2.appendChild(_bf.createTextNode(_c1));
}
}
break;
case 2:
_c2.nodeValue=_c1;
break;
case 3:
case 4:
_c2.nodeValue=_c1;
break;
}
return;
};
Freja.QueryEngine.XPath=function(){
};
Freja.Class.extend(Freja.QueryEngine.XPath,Freja.QueryEngine);
Freja.QueryEngine.XPath.prototype._find=function(_c6,_c7){
var _c8=_c6.selectSingleNode(_c7);
return _c8;
};
Freja.QueryEngine.SimplePath=function(){
};
Freja.Class.extend(Freja.QueryEngine.SimplePath,Freja.QueryEngine);
Freja.QueryEngine.SimplePath.prototype._find=function(_c9,_ca){
if(!_ca.match(/^[\d\w\/@\[\]=_\-']*$/)){
throw new Error("Can't evaluate expression "+_ca);
}
var _cb=_ca.split("/");
var _cc=_c9;
var _cd=new RegExp("^@([\\d\\w]*)");
var _ce=new RegExp("^([@\\d\\w]*)\\[([\\d]*)\\]$");
var _cf=new RegExp("^([\\d\\w]+)\\[@([@\\d\\w]+)=['\"]{1}(.*)['\"]{1}\\]$");
var _d0=null;
var _d1=0;
for(var i=0;i<_cb.length;++i){
var _d3=_cb[i];
var _d4=_cf.exec(_d3);
if(_d4){
if(i>0&&_cb[i-1]==""){
var cn=_cc.getElementsByTagName(_d4[1]);
}else{
var cn=_cc.childNodes;
}
for(var j=0,l=cn.length;j<l;j++){
if(cn[j].nodeType==1&&cn[j].tagName==_d4[1]&&cn[j].getAttribute(_d4[2])==_d4[3]){
_cc=cn[j];
break;
}
}
if(j==l){
throw new Error("Can't evaluate expression "+_d3);
}
}else{
_d1=_ce.exec(_d3);
if(_d1){
_d3=_d1[1];
_d1=_d1[2]-1;
}else{
_d1=0;
}
if(_d3!=""){
_d0=_cd.exec(_d3);
if(_d0){
_cc=_cc.getAttributeNode(_d0[1]);
}else{
_cc=_cc.getElementsByTagName(_d3).item(_d1);
}
}
}
}
if(_cc&&_cc.firstChild&&_cc.firstChild.nodeType==3){
return _cc.firstChild;
}
if(_cc&&_cc.firstChild&&_cc.firstChild.nodeType==4){
return _cc.firstChild;
}
if(!_cc){
throw new Error("Can't evaluate expression "+_ca);
}
return _cc;
};
Freja.Model=function(url,_d8){
this.url=url;
this.ready=false;
this.document=null;
this._query=_d8;
};
Freja.Model.prototype.getElementById=function(id){
if(this.document){
return this._query.getElementById(this.document,id);
}
return null;
};
Freja.Model.prototype.get=function(_da){
if(this.document){
return this._query.get(this.document,_da);
}
return null;
};
Freja.Model.prototype.set=function(_db,_dc){
if(this.document){
return this._query.set(this.document,_db,_dc);
}
return null;
};
Freja.Model.prototype.updateFrom=function(_dd){
var _de=_dd.getValues();
for(var i=0;i<_de[0].length;++i){
if(_de[0][i].lastIndexOf("/")!=-1){
this.set(_de[0][i],_de[1][i]);
}
}
};
Freja.Model.prototype.save=function(){
var url=this.url;
var _e1=/^(file:\/\/.*\/)([^\/]*)$/.exec(window.location.href);
if(_e1){
url=_e1[1]+url;
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
var _e5=/^(file:\/\/.*\/)([^\/]*)$/.exec(window.location.href);
if(_e5){
url=_e5[1]+url;
}
var req=Freja.AssetManager.openXMLHttpRequest("DELETE",url);
return Freja._aux.sendXMLHttpRequest(req);
};
Freja.Model.prototype.reload=function(){
this.ready=false;
var _e7=Freja._aux.bind(function(_e8){
this.document=_e8;
this.ready=true;
Freja._aux.signal(this,"onload");
},this);
var d=Freja.AssetManager.loadAsset(this.url,true);
d.addCallbacks(_e7,Freja.AssetManager.onerror);
return d;
};
Freja.Model.DataSource=function(_ea,_eb){
this.createURL=_ea;
this.indexURL=_eb;
};
Freja.Model.DataSource.prototype.select=function(){
return getModel(this.indexURL);
};
Freja.Model.DataSource.prototype.create=function(_ec){
var url=this.createURL;
var _ee=/^(file:\/\/.*\/)([^\/]*)$/.exec(window.location.href);
if(_ee){
url=_ee[1]+url;
}
var req=Freja.AssetManager.openXMLHttpRequest("PUT",url);
var _f0={};
for(var i=0,len=_ec[0].length;i<len;++i){
_f0[_ec[0][i]]=_ec[1][i];
}
return Freja._aux.sendXMLHttpRequest(req,Freja._aux.xmlize(_f0,"record"));
};
Freja.View=function(url,_f3){
this.url=url;
this.ready=false;
this.document=null;
this._renderer=_f3;
this._destination=null;
this.behaviors=[];
this.placeholder=null;
Freja._aux.connect(this,"onrendercomplete",Freja._aux.bind(this._connectBehavior,this));
};
Freja.View.prototype.render=function(_f4,_f5,_f6){
if(typeof (_f5)=="undefined"){
_f5=this.placeholder;
}
if(typeof (_f6)=="undefined"){
_f6=this.xslParameters;
}
var _f7=function(_f8,_f9,_fa,_fb){
this.model=_f8;
this.view=_f9;
this.deferred=_fa;
this.xslParameters=_fb;
};
_f7.prototype.trigger=function(){
try{
if(!this.view.ready){
Freja._aux.connect(this.view,"onload",Freja._aux.bind(this.trigger,this));
return;
}
if(typeof (this.model)=="object"&&this.model instanceof Freja.Model&&!this.model.ready){
Freja._aux.connect(this.model,"onload",Freja._aux.bind(this.trigger,this));
return;
}
var _fc;
if(typeof (this.model)=="undefined"){
_fc={document:Freja._aux.loadXML("<?xml version='1.0' ?><dummy/>")};
}else{
if(this.model instanceof Freja.Model){
_fc=this.model;
}else{
_fc={document:Freja._aux.loadXML("<?xml version='1.0' ?>\n"+Freja._aux.xmlize(this.model,"item"))};
}
}
var _fd=this.view._renderer.transform(_fc,this.view,this.xslParameters);
_fd.addCallback(Freja._aux.bind(function(_fe){
if(typeof _fe=="string"){
this._destination.innerHTML=_fe;
}else{
this._destination.innerHTML="";
this._destination.appendChild(_fe);
}
},this.view));
_fd.addCallback(Freja._aux.bind(function(){
Freja._aux.signal(this,"onrendercomplete",this._destination);
},this.view));
_fd.addCallback(this.deferred.callback);
_fd.addErrback(this.deferred.errback);
}
catch(ex){
this.deferred.errback(ex);
}
};
var d=Freja._aux.createDeferred();
try{
if(typeof (_f5)=="object"){
this._destination=_f5;
}else{
this._destination=document.getElementById(_f5);
}
this._destination.innerHTML=Freja.AssetManager.THROBBER_HTML;
var h=new _f7(_f4,this,d,_f6);
h.trigger();
}
catch(ex){
d.errback(ex);
}
return d;
};
Freja.View.prototype._connectBehavior=function(_101){
try{
var _102=function(node,_104,_105){
Freja._aux.connect(node,_104,Freja._aux.bind(function(e){
var _107=false;
try{
_107=_105(this);
}
catch(ex){
throw new Error("An error ocurred in user handler.\n"+ex.message);
}
finally{
if(!_107){
e.stop();
}
}
},node));
};
var _108=function(node,_10a){
for(var i=0,c=node.childNodes,l=c.length;i<l;++i){
var _10c=c[i];
if(_10c.nodeType==1){
if(_10c.className){
var _10d=_10c.className.split(" ");
for(var j=0;j<_10d.length;j++){
var _10f=_10a[_10d[j]];
if(_10f){
for(var _110 in _10f){
if(_110=="init"){
_10f.init(_10c);
}else{
_102(_10c,_110,_10f[_110]);
}
}
}
}
}
_108(_10c,_10a);
}
}
};
for(var ids in this.behaviors){
_108(_101,this.behaviors);
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
Freja.View.Renderer.XSLTransformer.prototype.transform=function(_112,view,_114){
var d=Freja._aux.createDeferred();
try{
var html=Freja._aux.transformXSL(_112.document,view.document,_114);
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
Freja.View.Renderer.RemoteXSLTransformer.prototype.transform=function(_118,view,_11a){
var d=Freja._aux.createDeferred();
var _11c=view.url;
var _11d="xslFile="+encodeURIComponent(_11c)+"&xmlData="+encodeURIComponent(Freja._aux.serializeXML(_118.document));
var _11e="";
for(var _11f in _11a){
_11e+=encodeURIComponent(_11f+","+_11a[_11f]);
}
if(_11e.length>0){
_11d=_11d+"&xslParam="+_11e;
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
req.send(_11d);
return d;
};
Freja.UndoHistory=function(){
this.cache=[];
this.maxLength=5;
this._position=0;
this._undoSteps=0;
};
Freja.UndoHistory.prototype.add=function(_121){
var _122=this._position%this.maxLength;
var _123=_121.document;
this.cache[_122]={};
this.cache[_122].model=_121;
this.cache[_122].document=Freja._aux.cloneXMLDocument(_123);
if(!this.cache[_122].document){
throw new Error("Couldn't add to history.");
}else{
this._position++;
var _124=_122;
while(this._undoSteps>0){
_124=(_124+1)%this.maxLength;
this.cache[_124]={};
this._undoSteps--;
}
return _122;
}
};
Freja.UndoHistory.prototype.undo=function(_125){
if(this._undoSteps<this.cache.length){
this._undoSteps++;
this._position--;
if(this._position<0){
this._position=this.maxLength-1;
}
var _126=this.cache[this._position].model;
if(this.cache[this._position].document){
_126.document=this.cache[this._position].document;
}else{
throw new Error("The model's DOMDocument wasn't properly copied into the history");
}
if(typeof (_125)!="undefined"&&_125>1){
this.undo(_125-1);
}
}else{
throw new Error("Nothing to undo");
}
};
Freja.UndoHistory.prototype.redo=function(){
if(this._undoSteps>0){
this._undoSteps--;
this._position=(this._position+1)%this.maxLength;
var _127=this.cache[this._position].model;
_127.document=this.cache[this._position].document;
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
var _12b=Freja._aux.bind(function(_12c){
this.document=_12c;
this.ready=true;
Freja._aux.signal(this,"onload");
},m);
this.loadAsset(url,true).addCallbacks(_12b,Freja.AssetManager.onerror);
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
var _130=Freja._aux.bind(function(_131){
this.document=_131;
this.ready=true;
Freja._aux.signal(this,"onload");
},v);
this.loadAsset(url,false).addCallbacks(_130,Freja.AssetManager.onerror);
this.views.push(v);
return v;
};
Freja.AssetManager.openXMLHttpRequest=function(_132,url){
var _134=null;
if(Freja.AssetManager.HTTP_METHOD_TUNNEL&&_132!="GET"&&_132!="POST"){
_134=_132;
_132="POST";
}
var req=Freja._aux.openXMLHttpRequest(_132,url,Freja.AssetManager.HTTP_REQUEST_TYPE=="async",Freja.AssetManager._username,Freja.AssetManager._password);
if(_134){
req.setRequestHeader(Freja.AssetManager.HTTP_METHOD_TUNNEL,_134);
}
return req;
};
Freja.AssetManager.setCredentials=function(_136,_137){
this._username=_136;
this._password=_137;
};
Freja.AssetManager.loadAsset=function(url,_139){
var _13a=/^(file:\/\/.*\/)([^\/]*)$/.exec(window.location.href);
if(_13a){
url=_13a[1]+url;
}
var d=Freja._aux.createDeferred();
var _13c=function(_13d){
try{
if(_13d.responseText==""){
throw new Error("Empty response.");
}
if(_13d.responseXML.xml==""){
var _13e=Freja._aux.loadXML(_13d.responseText);
}else{
var _13e=_13d.responseXML;
}
}
catch(ex){
d.errback(ex);
}
if(window.document.all){
setTimeout(function(){
d.callback(_13e);
},1);
}else{
d.callback(_13e);
}
};
try{
if(_139&&Freja.AssetManager.HTTP_METHOD_TUNNEL){
var req=Freja._aux.openXMLHttpRequest("POST",url,Freja.AssetManager.HTTP_REQUEST_TYPE=="async",Freja.AssetManager._username,Freja.AssetManager._password);
req.setRequestHeader(Freja.AssetManager.HTTP_METHOD_TUNNEL,"GET");
req.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
}else{
var req=Freja._aux.openXMLHttpRequest("GET",url,Freja.AssetManager.HTTP_REQUEST_TYPE=="async",Freja.AssetManager._username,Freja.AssetManager._password);
}
var comm=Freja._aux.sendXMLHttpRequest(req);
if(Freja.AssetManager.HTTP_REQUEST_TYPE=="async"){
comm.addCallbacks(_13c,function(req){
d.errback(new Error("Request failed:"+req.status));
});
}else{
if(req.status==0||req.status==200||req.status==201||req.status==304){
_13c(req);
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


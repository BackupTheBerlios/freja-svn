if(typeof (dojo)!="undefined"){
dojo.provide("Freja");
}
if(typeof (Freja)=="undefined"){
Freja={};
}
Freja.NAME="Freja";
Freja.VERSION="2.1.1";
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
src._signals[_8a].push(fnc);
};
Freja._aux.signal=function(src,_92){
try{
if(src._signals&&src._signals[_92]){
var _93=src._signals[_92];
var _94=[];
for(var i=2;i<arguments.length;i++){
_94.push(arguments[i]);
}
for(var i=0;i<_93.length;i++){
try{
_93[i].apply(src,_94);
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
Freja._aux.openXMLHttpRequest=function(_96,url,_98,_99,_9a){
var req=new XMLHttpRequest();
if(_99&&_9a){
req.open(_96,url,_98,_99,_9a);
}else{
req.open(_96,url,_98);
}
if(_96=="POST"||_96=="PUT"){
req.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
}
req.setRequestHeader("X-Requested-With","XMLHttpRequest");
return req;
};
Freja._aux.sendXMLHttpRequest=function(req,_9d){
var d=Freja._aux.createDeferred();
var _9f=false;
req.onreadystatechange=function(){
if(req.readyState==4&&!_9f){
if(req.status==0||req.status==200||req.status==201||req.status==304){
d.callback(req);
}else{
d.errback(req);
}
_9f=true;
}
};
if(!_9d){
_9d="";
}
req.send(_9d);
return d;
};
Freja._aux.xmlize=Sarissa.xmlize;
Freja._aux.serializeXML=function(_a0){
if(_a0.xml){
return _a0.xml;
}
return (new XMLSerializer()).serializeToString(_a0);
};
Freja._aux.loadXML=function(_a1){
return (new DOMParser()).parseFromString(_a1,"text/xml");
};
Freja._aux.transformXSL=function(xml,xsl,_a4){
var _a5=new XSLTProcessor();
_a5.importStylesheet(xsl);
if(_a4){
for(var _a6 in _a4){
_a5.setParameter("",_a6,_a4[_a6]);
}
}
return _a5.transformToFragment(xml,window.document);
};
Freja._aux.cloneXMLDocument=function(_a7){
var _a8=null;
try{
_a8=_a7.cloneNode(true);
}
catch(e){
}
if(!_a8){
if(document.implementation&&document.implementation.createDocument){
_a8=document.implementation.createDocument("",_a7.documentElement.nodeName,null);
var _a9=_a8.importNode(_a7.documentElement.cloneNode(true),true);
try{
_a8.appendChild(_a9);
}
catch(e){
var _aa=_a8.documentElement;
for(var i=_a9.childNodes.length;i>=0;i--){
_aa.insertBefore(_a9.childNodes[i],_aa.firstChild);
}
for(var i=0;i<_a7.documentElement.attributes.length;i++){
var _ac=_a7.documentElement.attributes.item(i).name;
var _ad=_a7.documentElement.attributes.item(i).value;
_a8.documentElement.setAttribute(_ac,_ad);
}
}
}
}
return _a8;
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
Freja._aux.Deferred.prototype.addCallbacks=function(_b0,_b1){
if(_b0){
this._good[this._good.length]=_b0;
}
if(_b1){
this._bad[this._bad.length]=_b1;
}
if(this._pending){
this._pending[0].apply(this,this._pending[1]);
}
};
Freja._aux.Deferred.prototype.addCallback=function(_b2){
this.addCallbacks(_b2);
};
Freja._aux.Deferred.prototype.addErrback=function(_b3){
this.addCallbacks(null,_b3);
};
Freja._aux.importNode=function(_b4,_b5,_b6){
if(typeof _b6=="undefined"){
_b6=true;
}
if(_b4.importNode){
return _b4.importNode(_b5,_b6);
}else{
return _b5.cloneNode(_b6);
}
};
Freja.QueryEngine=function(){
};
Freja.QueryEngine.prototype.getElementById=function(_b7,id){
var _b9=_b7.getElementsByTagName("*");
for(var i=0;i<_b9.length;i++){
if(_b9[i].getAttribute("id")==id){
return _b9[i];
}
}
};
Freja.QueryEngine.prototype.get=function(_bb,_bc){
var _bd=this._find(_bb,_bc);
if(!_bd){
throw new Error("Can't evaluate expression "+_bc);
}
switch(_bd.nodeType){
case 1:
if(_bd.firstChild&&(_bd.firstChild.nodeType==3||_bd.firstChild.nodeType==4)){
return _bd.firstChild.nodeValue;
}
break;
case 2:
return _bd.nodeValue;
break;
case 3:
case 4:
return _bd.nodeValue;
break;
}
return null;
};
Freja.QueryEngine.prototype.set=function(_be,_bf,_c0){
var _c1=this._find(_be,_bf);
if(!_c1){
var _c2=_bf.substr(_bf.lastIndexOf("/")+1);
if(_c2.charAt(0)=="@"){
var _c3=_bf.substring(0,_bf.lastIndexOf("/"));
var _c4=this._find(_be,_c3);
if(_c4){
_c4.setAttribute(_c2.substr(1),_c0);
return;
}
}
throw new Error("Can't evaluate expression "+_bf);
}
switch(_c1.nodeType){
case 1:
if(_c1.firstChild&&(_c1.firstChild.nodeType==3||_c1.firstChild.nodeType==4)){
_c1.firstChild.nodeValue=_c0;
}else{
if(_c0!=""){
_c1.appendChild(_be.createTextNode(_c0));
}
}
break;
case 2:
_c1.nodeValue=_c0;
break;
case 3:
case 4:
_c1.nodeValue=_c0;
break;
}
return;
};
Freja.QueryEngine.XPath=function(){
};
Freja.Class.extend(Freja.QueryEngine.XPath,Freja.QueryEngine);
Freja.QueryEngine.XPath.prototype._find=function(_c5,_c6){
var _c7=_c5.selectSingleNode(_c6);
return _c7;
};
Freja.QueryEngine.SimplePath=function(){
};
Freja.Class.extend(Freja.QueryEngine.SimplePath,Freja.QueryEngine);
Freja.QueryEngine.SimplePath.prototype._find=function(_c8,_c9){
if(!_c9.match(/^[\d\w\/@\[\]=_\-']*$/)){
throw new Error("Can't evaluate expression "+_c9);
}
var _ca=_c9.split("/");
var _cb=_c8;
var _cc=new RegExp("^@([\\d\\w]*)");
var _cd=new RegExp("^([@\\d\\w]*)\\[([\\d]*)\\]$");
var _ce=new RegExp("^([\\d\\w]+)\\[@([@\\d\\w]+)=['\"]{1}(.*)['\"]{1}\\]$");
var _cf=null;
var _d0=0;
for(var i=0;i<_ca.length;++i){
var _d2=_ca[i];
var _d3=_ce.exec(_d2);
if(_d3){
if(i>0&&_ca[i-1]==""){
var cn=_cb.getElementsByTagName(_d3[1]);
}else{
var cn=_cb.childNodes;
}
for(var j=0,l=cn.length;j<l;j++){
if(cn[j].nodeType==1&&cn[j].tagName==_d3[1]&&cn[j].getAttribute(_d3[2])==_d3[3]){
_cb=cn[j];
break;
}
}
if(j==l){
throw new Error("Can't evaluate expression "+_d2);
}
}else{
_d0=_cd.exec(_d2);
if(_d0){
_d2=_d0[1];
_d0=_d0[2]-1;
}else{
_d0=0;
}
if(_d2!=""){
_cf=_cc.exec(_d2);
if(_cf){
_cb=_cb.getAttributeNode(_cf[1]);
}else{
_cb=_cb.getElementsByTagName(_d2).item(_d0);
}
}
}
}
if(_cb&&_cb.firstChild&&_cb.firstChild.nodeType==3){
return _cb.firstChild;
}
if(_cb&&_cb.firstChild&&_cb.firstChild.nodeType==4){
return _cb.firstChild;
}
if(!_cb){
throw new Error("Can't evaluate expression "+_c9);
}
return _cb;
};
Freja.Model=function(url,_d7){
this.url=url;
this.ready=false;
this.document=null;
this._query=_d7;
};
Freja.Model.prototype.getElementById=function(id){
if(this.document){
return this._query.getElementById(this.document,id);
}
return null;
};
Freja.Model.prototype.get=function(_d9){
if(this.document){
return this._query.get(this.document,_d9);
}
return null;
};
Freja.Model.prototype.set=function(_da,_db){
if(this.document){
return this._query.set(this.document,_da,_db);
}
return null;
};
Freja.Model.prototype.updateFrom=function(_dc){
var _dd=_dc.getValues();
for(var i=0;i<_dd[0].length;++i){
if(_dd[0][i].lastIndexOf("/")!=-1){
try{
this.set(_dd[0][i],_dd[1][i]);
}
catch(x){
}
}
}
};
Freja.Model.prototype.save=function(){
var url=this.url;
var _e0=/^(file:\/\/.*\/)([^\/]*)$/.exec(window.location.href);
if(_e0){
url=_e0[1]+url;
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
var _e4=/^(file:\/\/.*\/)([^\/]*)$/.exec(window.location.href);
if(_e4){
url=_e4[1]+url;
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
var _e8=Freja._aux.bind(function(_e9){
this.document=_e9;
this.ready=true;
Freja._aux.signal(this,"onload");
},this);
var d=Freja.AssetManager.loadAsset(this.url,true);
d.addCallbacks(_e8,Freja.AssetManager.onerror);
return d;
};
Freja.Model.DataSource=function(_eb,_ec){
this.createURL=_eb;
this.indexURL=_ec;
};
Freja.Model.DataSource.prototype.select=function(){
return getModel(this.indexURL);
};
Freja.Model.DataSource.prototype.create=function(_ed){
var url=this.createURL;
var _ef=/^(file:\/\/.*\/)([^\/]*)$/.exec(window.location.href);
if(_ef){
url=_ef[1]+url;
}
var req=Freja.AssetManager.openXMLHttpRequest("PUT",url);
var _f1={};
for(var i=0,len=_ed[0].length;i<len;++i){
_f1[_ed[0][i]]=_ed[1][i];
}
return Freja._aux.sendXMLHttpRequest(req,Freja._aux.xmlize(_f1,"record"));
};
Freja.View=function(url,_f4){
this.url=url;
this.ready=false;
this.document=null;
this._renderer=_f4;
this._destination=null;
this.behaviors=[];
this.placeholder=null;
Freja._aux.connect(this,"onrendercomplete",Freja._aux.bind(this._connectBehavior,this));
};
Freja.View.prototype.render=function(_f5,_f6,_f7){
if(typeof (_f6)=="undefined"){
_f6=this.placeholder;
}
if(typeof (_f7)=="undefined"){
_f7=this.xslParameters;
}
var _f8=function(_f9,_fa,_fb,_fc){
this.model=_f9;
this.view=_fa;
this.deferred=_fb;
this.xslParameters=_fc;
};
_f8.prototype.trigger=function(){
try{
if(!this.view.ready){
Freja._aux.connect(this.view,"onload",Freja._aux.bind(this.trigger,this));
return;
}
if(typeof (this.model)=="object"&&this.model instanceof Freja.Model&&!this.model.ready){
Freja._aux.connect(this.model,"onload",Freja._aux.bind(this.trigger,this));
return;
}
var _fd;
if(typeof (this.model)=="undefined"){
_fd={document:Freja._aux.loadXML("<?xml version='1.0' ?><dummy/>")};
}else{
if(this.model instanceof Freja.Model){
_fd=this.model;
}else{
_fd={document:Freja._aux.loadXML("<?xml version='1.0' ?>\n"+Freja._aux.xmlize(this.model,"item"))};
}
}
var _fe=this.view._renderer.transform(_fd,this.view,this.xslParameters);
_fe.addCallback(Freja._aux.bind(function(_ff){
if(typeof _ff=="string"){
this._destination.innerHTML=_ff;
}else{
this._destination.innerHTML="";
this._destination.appendChild(_ff);
}
},this.view));
_fe.addCallback(Freja._aux.bind(function(){
Freja._aux.signal(this,"onrendercomplete",this._destination);
},this.view));
_fe.addCallback(Freja._aux.bind(function(){
this.deferred.callback();
},this));
_fe.addErrback(Freja._aux.bind(function(ex){
this.deferred.errback(ex);
},this));
}
catch(ex){
this.deferred.errback(ex);
}
};
var d=Freja._aux.createDeferred();
try{
if(typeof (_f6)=="object"){
this._destination=_f6;
}else{
this._destination=document.getElementById(_f6);
}
this._destination.innerHTML=Freja.AssetManager.THROBBER_HTML;
var h=new _f8(_f5,this,d,_f7);
h.trigger();
}
catch(ex){
d.errback(ex);
}
return d;
};
Freja.View.prototype._connectBehavior=function(_103){
try{
var _104=function(node,_106,_107){
Freja._aux.connect(node,_106,Freja._aux.bind(function(e){
var _109=false;
try{
_109=_107(this);
}
catch(ex){
throw new Error("An error ocurred in user handler.\n"+ex.message);
}
finally{
if(!_109){
e.stop();
}
}
},node));
};
var _10a=function(node,_10c){
for(var i=0,c=node.childNodes,l=c.length;i<l;++i){
var _10e=c[i];
if(_10e.nodeType==1){
if(_10e.className){
var _10f=_10e.className.split(" ");
for(var j=0;j<_10f.length;j++){
var _111=_10c[_10f[j]];
if(_111){
for(var _112 in _111){
if(_112=="init"){
_111.init(_10e);
}else{
_104(_10e,_112,_111[_112]);
}
}
}
}
}
_10a(_10e,_10c);
}
}
};
for(var ids in this.behaviors){
_10a(_103,this.behaviors);
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
Freja.View.Renderer.XSLTransformer.prototype.transform=function(_114,view,_116){
var d=Freja._aux.createDeferred();
try{
var html=Freja._aux.transformXSL(_114.document,view.document,_116);
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
Freja.View.Renderer.RemoteXSLTransformer.prototype.transform=function(_11a,view,_11c){
var d=Freja._aux.createDeferred();
var _11e=view.url;
var _11f="xslFile="+encodeURIComponent(_11e)+"&xmlData="+encodeURIComponent(Freja._aux.serializeXML(_11a.document));
var _120="";
for(var _121 in _11c){
_120+=encodeURIComponent(_121+","+_11c[_121]);
}
if(_120.length>0){
_11f=_11f+"&xslParam="+_120;
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
req.send(_11f);
return d;
};
Freja.UndoHistory=function(){
this.cache=[];
this.maxLength=5;
this._position=0;
this._undoSteps=0;
};
Freja.UndoHistory.prototype.add=function(_123){
var _124=this._position%this.maxLength;
var _125=_123.document;
this.cache[_124]={};
this.cache[_124].model=_123;
this.cache[_124].document=Freja._aux.cloneXMLDocument(_125);
if(!this.cache[_124].document){
throw new Error("Couldn't add to history.");
}else{
this._position++;
var _126=_124;
while(this._undoSteps>0){
_126=(_126+1)%this.maxLength;
this.cache[_126]={};
this._undoSteps--;
}
return _124;
}
};
Freja.UndoHistory.prototype.undo=function(_127){
if(this._undoSteps<this.cache.length){
this._undoSteps++;
this._position--;
if(this._position<0){
this._position=this.maxLength-1;
}
var _128=this.cache[this._position].model;
if(this.cache[this._position].document){
_128.document=this.cache[this._position].document;
}else{
throw new Error("The model's DOMDocument wasn't properly copied into the history");
}
if(typeof (_127)!="undefined"&&_127>1){
this.undo(_127-1);
}
}else{
throw new Error("Nothing to undo");
}
};
Freja.UndoHistory.prototype.redo=function(){
if(this._undoSteps>0){
this._undoSteps--;
this._position=(this._position+1)%this.maxLength;
var _129=this.cache[this._position].model;
_129.document=this.cache[this._position].document;
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
var _12d=Freja._aux.bind(function(_12e){
this.document=_12e;
this.ready=true;
Freja._aux.signal(this,"onload");
},m);
this.loadAsset(url,true).addCallbacks(_12d,Freja.AssetManager.onerror);
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
var _132=Freja._aux.bind(function(_133){
this.document=_133;
this.ready=true;
Freja._aux.signal(this,"onload");
},v);
this.loadAsset(url,false).addCallbacks(_132,Freja.AssetManager.onerror);
this.views.push(v);
return v;
};
Freja.AssetManager.openXMLHttpRequest=function(_134,url){
var _136=null;
if(Freja.AssetManager.HTTP_METHOD_TUNNEL&&_134!="GET"&&_134!="POST"){
_136=_134;
_134="POST";
}
var req=Freja._aux.openXMLHttpRequest(_134,url,Freja.AssetManager.HTTP_REQUEST_TYPE=="async",Freja.AssetManager._username,Freja.AssetManager._password);
if(_136){
req.setRequestHeader(Freja.AssetManager.HTTP_METHOD_TUNNEL,_136);
}
return req;
};
Freja.AssetManager.setCredentials=function(_138,_139){
this._username=_138;
this._password=_139;
};
Freja.AssetManager.loadAsset=function(url,_13b){
var _13c=/^(file:\/\/.*\/)([^\/]*)$/.exec(window.location.href);
if(_13c){
url=_13c[1]+url;
}
var d=Freja._aux.createDeferred();
var _13e=function(_13f){
try{
if(_13f.responseText==""){
throw new Error("Empty response.");
}
if(_13f.responseXML.xml==""){
var _140=Freja._aux.loadXML(_13f.responseText);
}else{
var _140=_13f.responseXML;
}
}
catch(ex){
d.errback(ex);
}
if(window.document.all){
setTimeout(function(){
d.callback(_140);
},1);
}else{
d.callback(_140);
}
};
try{
if(_13b&&Freja.AssetManager.HTTP_METHOD_TUNNEL){
var req=Freja._aux.openXMLHttpRequest("POST",url,Freja.AssetManager.HTTP_REQUEST_TYPE=="async",Freja.AssetManager._username,Freja.AssetManager._password);
req.setRequestHeader(Freja.AssetManager.HTTP_METHOD_TUNNEL,"GET");
req.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
}else{
var req=Freja._aux.openXMLHttpRequest("GET",url,Freja.AssetManager.HTTP_REQUEST_TYPE=="async",Freja.AssetManager._username,Freja.AssetManager._password);
}
var comm=Freja._aux.sendXMLHttpRequest(req);
if(Freja.AssetManager.HTTP_REQUEST_TYPE=="async"){
comm.addCallbacks(_13e,function(req){
d.errback(new Error("Request failed:"+req.status));
});
}else{
if(req.status==0||req.status==200||req.status==201||req.status==304){
_13e(req);
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


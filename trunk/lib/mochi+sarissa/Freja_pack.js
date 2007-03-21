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
if(Sarissa.IS_ENABLED_SELECT_NODES){
return new Freja.QueryEngine.XPath();
}else{
return new Freja.QueryEngine.SimplePath();
}
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
Sarissa.setXpathNamespaces=function(_25,_26){
_25._sarissa_useCustomResolver=true;
var _27=_26.indexOf(" ")>-1?_26.split(" "):new Array(_26);
_25._sarissa_xpathNamespaces=new Array(_27.length);
for(var i=0;i<_27.length;i++){
var ns=_27[i];
var _2a=ns.indexOf(":");
var _2b=ns.indexOf("=");
if(_2a>0&&_2b>_2a+1){
var _2c=ns.substring(_2a+1,_2b);
var uri=ns.substring(_2b+2,ns.length-1);
_25._sarissa_xpathNamespaces[_2c]=uri;
}else{
throw "Bad format on namespace declaration(s) given";
}
}
};
XMLDocument.prototype._sarissa_useCustomResolver=false;
XMLDocument.prototype._sarissa_xpathNamespaces=new Array();
XMLDocument.prototype.selectNodes=function(_2e,_2f,_30){
var _31=this;
var _32=this._sarissa_useCustomResolver?function(_33){
var s=_31._sarissa_xpathNamespaces[_33];
if(s){
return s;
}else{
throw "No namespace URI found for prefix: '"+_33+"'";
}
}:this.createNSResolver(this.documentElement);
var _35=null;
if(!_30){
var _36=this.evaluate(_2e,(_2f?_2f:this),_32,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);
var _37=new SarissaNodeList(_36.snapshotLength);
_37.expr=_2e;
for(var i=0;i<_37.length;i++){
_37[i]=_36.snapshotItem(i);
}
_35=_37;
}else{
_35=_36=this.evaluate(_2e,(_2f?_2f:this),_32,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
}
return _35;
};
Element.prototype.selectNodes=function(_39){
var doc=this.ownerDocument;
if(doc.selectNodes){
return doc.selectNodes(_39,this);
}else{
throw "Method selectNodes is only supported by XML Elements";
}
};
XMLDocument.prototype.selectSingleNode=function(_3b,_3c){
var ctx=_3c?_3c:null;
return this.selectNodes(_3b,ctx,true);
};
Element.prototype.selectSingleNode=function(_3e){
var doc=this.ownerDocument;
if(doc.selectSingleNode){
return doc.selectSingleNode(_3e,this);
}else{
throw "Method selectNodes is only supported by XML Elements";
}
};
Sarissa.IS_ENABLED_SELECT_NODES=true;
}
if(_SARISSA_IS_IE){
Sarissa.IS_ENABLED_SELECT_NODES=true;
}
Freja.QueryEngine=function(){
};
Freja.QueryEngine.prototype.getElementById=function(_40,id){
var _42=_40.getElementsByTagName("*");
for(var i=0;i<_42.length;i++){
if(_42[i].getAttribute("id")==id){
return _42[i];
}
}
};
Freja.QueryEngine.prototype.get=function(_44,_45){
var _46=this._find(_44,_45);
if(!_46){
throw new Error("Can't evaluate expression "+_45);
}
switch(_46.nodeType){
case 1:
if(_46.firstChild&&(_46.firstChild.nodeType==3||_46.firstChild.nodeType==4)){
return _46.firstChild.nodeValue;
}
break;
case 2:
return _46.nodeValue;
break;
case 3:
case 4:
return _46.nodeValue;
break;
}
return null;
};
Freja.QueryEngine.prototype.set=function(_47,_48,_49){
var _4a=this._find(_47,_48);
if(!_4a){
var _4b=_48.substr(_48.lastIndexOf("/")+1);
if(_4b.charAt(0)=="@"){
var _4c=_48.substring(0,_48.lastIndexOf("/"));
var _4d=this._find(_47,_4c);
if(_4d){
_4d.setAttribute(_4b.substr(1),_49);
return;
}
}
throw new Error("Can't evaluate expression "+_48);
}
switch(_4a.nodeType){
case 1:
if(_4a.firstChild&&(_4a.firstChild.nodeType==3||_4a.firstChild.nodeType==4)){
_4a.firstChild.nodeValue=_49;
}else{
if(_49!=""){
_4a.appendChild(_47.createTextNode(_49));
}
}
break;
case 2:
_4a.nodeValue=_49;
break;
case 3:
case 4:
_4a.nodeValue=_49;
break;
}
return;
};
Freja.QueryEngine.XPath=function(){
};
Freja.Class.extend(Freja.QueryEngine.XPath,Freja.QueryEngine);
Freja.QueryEngine.XPath.prototype._find=function(_4e,_4f){
var _50=_4e.selectSingleNode(_4f);
return _50;
};
Freja.QueryEngine.SimplePath=function(){
};
Freja.Class.extend(Freja.QueryEngine.SimplePath,Freja.QueryEngine);
Freja.QueryEngine.SimplePath.prototype._find=function(_51,_52){
if(!_52.match(/^[\d\w\/@\[\]=_\-']*$/)){
throw new Error("Can't evaluate expression "+_52);
}
var _53=_52.split("/");
var _54=_51;
var _55=new RegExp("^@([\\d\\w]*)");
var _56=new RegExp("^([@\\d\\w]*)\\[([\\d]*)\\]$");
var _57=new RegExp("^([\\d\\w]+)\\[@([@\\d\\w]+)=['\"]{1}(.*)['\"]{1}\\]$");
var _58=null;
var _59=0;
for(var i=0;i<_53.length;++i){
var _5b=_53[i];
var _5c=_57.exec(_5b);
if(_5c){
if(i>0&&_53[i-1]==""){
var cn=_54.getElementsByTagName(_5c[1]);
}else{
var cn=_54.childNodes;
}
for(var j=0,l=cn.length;j<l;j++){
if(cn[j].nodeType==1&&cn[j].tagName==_5c[1]&&cn[j].getAttribute(_5c[2])==_5c[3]){
_54=cn[j];
break;
}
}
if(j==l){
throw new Error("Can't evaluate expression "+_5b);
}
}else{
_59=_56.exec(_5b);
if(_59){
_5b=_59[1];
_59=_59[2]-1;
}else{
_59=0;
}
if(_5b!=""){
_58=_55.exec(_5b);
if(_58){
_54=_54.getAttributeNode(_58[1]);
}else{
_54=_54.getElementsByTagName(_5b).item(_59);
}
}
}
}
if(_54&&_54.firstChild&&_54.firstChild.nodeType==3){
return _54.firstChild;
}
if(_54&&_54.firstChild&&_54.firstChild.nodeType==4){
return _54.firstChild;
}
if(!_54){
throw new Error("Can't evaluate expression "+_52);
}
return _54;
};
Freja.Model=function(url,_60){
this.url=url;
this.ready=false;
this.document=null;
this._query=_60;
};
Freja.Model.prototype.getElementById=function(id){
if(this.document){
return this._query.getElementById(this.document,id);
}
return null;
};
Freja.Model.prototype.get=function(_62){
if(this.document){
return this._query.get(this.document,_62);
}
return null;
};
Freja.Model.prototype.set=function(_63,_64){
if(this.document){
return this._query.set(this.document,_63,_64);
}
return null;
};
Freja.Model.prototype.updateFrom=function(_65){
var _66=_65.getValues();
for(var i=0;i<_66[0].length;++i){
if(_66[0][i].lastIndexOf("/")!=-1){
this.set(_66[0][i],_66[1][i]);
}
}
};
Freja.Model.prototype.save=function(){
var url=this.url;
var _69=/^(file:\/\/.*\/)([^\/]*)$/.exec(window.location.href);
if(_69){
url=_69[1]+url;
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
var _6d=/^(file:\/\/.*\/)([^\/]*)$/.exec(window.location.href);
if(_6d){
url=_6d[1]+url;
}
var req=Freja.AssetManager.openXMLHttpRequest("DELETE",url);
return Freja._aux.sendXMLHttpRequest(req);
};
Freja.Model.prototype.reload=function(){
this.ready=false;
var _6f=Freja._aux.bind(function(_70){
this.document=_70;
this.ready=true;
Freja._aux.signal(this,"onload");
},this);
var d=Freja.AssetManager.loadAsset(this.url,true);
d.addCallbacks(_6f,Freja.AssetManager.onerror);
return d;
};
Freja.Model.DataSource=function(_72,_73){
this.createURL=_72;
this.indexURL=_73;
};
Freja.Model.DataSource.prototype.select=function(){
return getModel(this.indexURL);
};
Freja.Model.DataSource.prototype.create=function(_74){
var url=this.createURL;
var _76=/^(file:\/\/.*\/)([^\/]*)$/.exec(window.location.href);
if(_76){
url=_76[1]+url;
}
var req=Freja.AssetManager.openXMLHttpRequest("PUT",url);
var _78={};
for(var i=0,len=_74[0].length;i<len;++i){
_78[_74[0][i]]=_74[1][i];
}
return Freja._aux.sendXMLHttpRequest(req,Freja._aux.xmlize(_78,"record"));
};
Freja.View=function(url,_7b){
this.url=url;
this.ready=false;
this.document=null;
this._renderer=_7b;
this._destination=null;
this.behaviors=[];
this.placeholder=null;
Freja._aux.connect(this,"onrendercomplete",Freja._aux.bind(this._connectBehavior,this));
};
Freja.View.prototype.render=function(_7c,_7d,_7e){
if(typeof (_7d)=="undefined"){
_7d=this.placeholder;
}
if(typeof (_7e)=="undefined"){
_7e=this.xslParameters;
}
var _7f=function(_80,_81,_82,_83){
this.model=_80;
this.view=_81;
this.deferred=_82;
this.xslParameters=_83;
};
_7f.prototype.trigger=function(){
try{
if(!this.view.ready){
Freja._aux.connect(this.view,"onload",Freja._aux.bind(this.trigger,this));
return;
}
if(typeof (this.model)=="object"&&this.model instanceof Freja.Model&&!this.model.ready){
Freja._aux.connect(this.model,"onload",Freja._aux.bind(this.trigger,this));
return;
}
var _84;
if(typeof (this.model)=="undefined"){
_84={document:Freja._aux.loadXML("<?xml version='1.0' ?><dummy/>")};
}else{
if(this.model instanceof Freja.Model){
_84=this.model;
}else{
_84={document:Freja._aux.loadXML("<?xml version='1.0' ?>\n"+Freja._aux.xmlize(this.model,"item"))};
}
}
var _85=this.view._renderer.transform(_84,this.view,this.xslParameters);
_85.addCallback(Freja._aux.bind(function(_86){
if(typeof _86=="string"){
this._destination.innerHTML=_86;
}else{
this._destination.innerHTML="";
this._destination.appendChild(_86);
}
},this.view));
_85.addCallback(Freja._aux.bind(function(){
Freja._aux.signal(this,"onrendercomplete",this._destination);
},this.view));
_85.addCallback(this.deferred.callback);
_85.addErrback(this.deferred.errback);
}
catch(ex){
this.deferred.errback(ex);
}
};
var d=Freja._aux.createDeferred();
try{
if(typeof (_7d)=="object"){
this._destination=_7d;
}else{
this._destination=document.getElementById(_7d);
}
this._destination.innerHTML=Freja.AssetManager.THROBBER_HTML;
var h=new _7f(_7c,this,d,_7e);
h.trigger();
}
catch(ex){
d.errback(ex);
}
return d;
};
Freja.View.prototype._connectBehavior=function(_89){
try{
var _8a=function(_8b,_8c,_8d){
Freja._aux.connect(_8b,_8c,Freja._aux.bind(function(e){
var _8f=false;
try{
_8f=_8d(this);
}
catch(ex){
throw new Error("An error ocurred in user handler.\n"+ex.message);
}
finally{
if(!_8f){
e.stop();
}
}
},_8b));
};
var _90=function(_91,_92){
for(var i=0,c=_91.childNodes,l=c.length;i<l;++i){
var _94=c[i];
if(_94.nodeType==1){
if(_94.className){
var _95=_94.className.split(" ");
for(var j=0;j<_95.length;j++){
var _97=_92[_95[j]];
if(_97){
for(var _98 in _97){
if(_98=="init"){
_97.init(_94);
}else{
_8a(_94,_98,_97[_98]);
}
}
}
}
}
_90(_94,_92);
}
}
};
for(var ids in this.behaviors){
_90(_89,this.behaviors);
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
Freja.View.Renderer.XSLTransformer.prototype.transform=function(_9a,_9b,_9c){
var d=Freja._aux.createDeferred();
try{
var _9e=Freja._aux.transformXSL(_9a.document,_9b.document,_9c);
if(!_9e){
d.errback(new Error("XSL Transformation error."));
}else{
d.callback(_9e);
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
Freja.View.Renderer.RemoteXSLTransformer.prototype.transform=function(_a0,_a1,_a2){
var d=Freja._aux.createDeferred();
var _a4=_a1.url;
var _a5="xslFile="+encodeURIComponent(_a4)+"&xmlData="+encodeURIComponent(Freja._aux.serializeXML(_a0.document));
var _a6="";
for(var _a7 in _a2){
_a6+=encodeURIComponent(_a7+","+_a2[_a7]);
}
if(_a6.length>0){
_a5=_a5+"&xslParam="+_a6;
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
req.send(_a5);
return d;
};
Freja.UndoHistory=function(){
this.cache=[];
this.maxLength=5;
this._position=0;
this._undoSteps=0;
};
Freja.UndoHistory.prototype.add=function(_a9){
var _aa=this._position%this.maxLength;
var _ab=_a9.document;
this.cache[_aa]={};
this.cache[_aa].model=_a9;
this.cache[_aa].document=Freja._aux.cloneXMLDocument(_ab);
if(!this.cache[_aa].document){
throw new Error("Couldn't add to history.");
}else{
this._position++;
var _ac=_aa;
while(this._undoSteps>0){
_ac=(_ac+1)%this.maxLength;
this.cache[_ac]={};
this._undoSteps--;
}
return _aa;
}
};
Freja.UndoHistory.prototype.undo=function(_ad){
if(this._undoSteps<this.cache.length){
this._undoSteps++;
this._position--;
if(this._position<0){
this._position=this.maxLength-1;
}
var _ae=this.cache[this._position].model;
if(this.cache[this._position].document){
_ae.document=this.cache[this._position].document;
}else{
throw new Error("The model's DOMDocument wasn't properly copied into the history");
}
if(typeof (_ad)!="undefined"&&_ad>1){
this.undo(_ad-1);
}
}else{
throw new Error("Nothing to undo");
}
};
Freja.UndoHistory.prototype.redo=function(){
if(this._undoSteps>0){
this._undoSteps--;
this._position=(this._position+1)%this.maxLength;
var _af=this.cache[this._position].model;
_af.document=this.cache[this._position].document;
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
var _b3=Freja._aux.bind(function(_b4){
this.document=_b4;
this.ready=true;
Freja._aux.signal(this,"onload");
},m);
this.loadAsset(url,true).addCallbacks(_b3,Freja.AssetManager.onerror);
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
var _b8=Freja._aux.bind(function(_b9){
this.document=_b9;
this.ready=true;
Freja._aux.signal(this,"onload");
},v);
this.loadAsset(url,false).addCallbacks(_b8,Freja.AssetManager.onerror);
this.views.push(v);
return v;
};
Freja.AssetManager.openXMLHttpRequest=function(_ba,url){
var _bc=null;
if(Freja.AssetManager.HTTP_METHOD_TUNNEL&&_ba!="GET"&&_ba!="POST"){
_bc=_ba;
_ba="POST";
}
var req=Freja._aux.openXMLHttpRequest(_ba,url,Freja.AssetManager.HTTP_REQUEST_TYPE=="async",Freja.AssetManager._username,Freja.AssetManager._password);
if(_bc){
req.setRequestHeader(Freja.AssetManager.HTTP_METHOD_TUNNEL,_bc);
}
return req;
};
Freja.AssetManager.setCredentials=function(_be,_bf){
this._username=_be;
this._password=_bf;
};
Freja.AssetManager.loadAsset=function(url,_c1){
var _c2=/^(file:\/\/.*\/)([^\/]*)$/.exec(window.location.href);
if(_c2){
url=_c2[1]+url;
}
var d=Freja._aux.createDeferred();
var _c4=function(_c5){
try{
if(_c5.responseText==""){
throw new Error("Empty response.");
}
if(_c5.responseXML.xml==""){
var _c6=Freja._aux.loadXML(_c5.responseText);
}else{
var _c6=_c5.responseXML;
}
}
catch(ex){
d.errback(ex);
}
if(window.document.all){
setTimeout(function(){
d.callback(_c6);
},1);
}else{
d.callback(_c6);
}
};
try{
if(_c1&&Freja.AssetManager.HTTP_METHOD_TUNNEL){
var req=Freja._aux.openXMLHttpRequest("POST",url,Freja.AssetManager.HTTP_REQUEST_TYPE=="async",Freja.AssetManager._username,Freja.AssetManager._password);
req.setRequestHeader(Freja.AssetManager.HTTP_METHOD_TUNNEL,"GET");
req.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
}else{
var req=Freja._aux.openXMLHttpRequest("GET",url,Freja.AssetManager.HTTP_REQUEST_TYPE=="async",Freja.AssetManager._username,Freja.AssetManager._password);
}
var _c8=Freja._aux.sendXMLHttpRequest(req);
if(Freja.AssetManager.HTTP_REQUEST_TYPE=="async"){
_c8.addCallbacks(_c4,function(req){
d.errback(new Error("Request failed:"+req.status));
});
}else{
if(req.status==0||req.status==200||req.status==201||req.status==304){
_c4(req);
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


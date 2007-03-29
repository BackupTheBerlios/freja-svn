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
Sarissa.setXpathNamespaces=function(_28,_29){
_28._sarissa_useCustomResolver=true;
var _2a=_29.indexOf(" ")>-1?_29.split(" "):new Array(_29);
_28._sarissa_xpathNamespaces=new Array(_2a.length);
for(var i=0;i<_2a.length;i++){
var ns=_2a[i];
var _2d=ns.indexOf(":");
var _2e=ns.indexOf("=");
if(_2d>0&&_2e>_2d+1){
var _2f=ns.substring(_2d+1,_2e);
var uri=ns.substring(_2e+2,ns.length-1);
_28._sarissa_xpathNamespaces[_2f]=uri;
}else{
throw "Bad format on namespace declaration(s) given";
}
}
};
XMLDocument.prototype._sarissa_useCustomResolver=false;
XMLDocument.prototype._sarissa_xpathNamespaces=new Array();
XMLDocument.prototype.selectNodes=function(_31,_32,_33){
var _34=this;
var _35=this._sarissa_useCustomResolver?function(_36){
var s=_34._sarissa_xpathNamespaces[_36];
if(s){
return s;
}else{
throw "No namespace URI found for prefix: '"+_36+"'";
}
}:this.createNSResolver(this.documentElement);
var _38=null;
if(!_33){
var _39=this.evaluate(_31,(_32?_32:this),_35,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);
var _3a=new SarissaNodeList(_39.snapshotLength);
_3a.expr=_31;
for(var i=0;i<_3a.length;i++){
_3a[i]=_39.snapshotItem(i);
}
_38=_3a;
}else{
_38=_39=this.evaluate(_31,(_32?_32:this),_35,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
}
return _38;
};
Element.prototype.selectNodes=function(_3c){
var doc=this.ownerDocument;
if(doc.selectNodes){
return doc.selectNodes(_3c,this);
}else{
throw "Method selectNodes is only supported by XML Elements";
}
};
XMLDocument.prototype.selectSingleNode=function(_3e,_3f){
var ctx=_3f?_3f:null;
return this.selectNodes(_3e,ctx,true);
};
Element.prototype.selectSingleNode=function(_41){
var doc=this.ownerDocument;
if(doc.selectSingleNode){
return doc.selectSingleNode(_41,this);
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
Freja.QueryEngine.prototype.getElementById=function(_43,id){
var _45=_43.getElementsByTagName("*");
for(var i=0;i<_45.length;i++){
if(_45[i].getAttribute("id")==id){
return _45[i];
}
}
};
Freja.QueryEngine.prototype.get=function(_47,_48){
var _49=this._find(_47,_48);
if(!_49){
throw new Error("Can't evaluate expression "+_48);
}
switch(_49.nodeType){
case 1:
if(_49.firstChild&&(_49.firstChild.nodeType==3||_49.firstChild.nodeType==4)){
return _49.firstChild.nodeValue;
}
break;
case 2:
return _49.nodeValue;
break;
case 3:
case 4:
return _49.nodeValue;
break;
}
return null;
};
Freja.QueryEngine.prototype.set=function(_4a,_4b,_4c){
var _4d=this._find(_4a,_4b);
if(!_4d){
var _4e=_4b.substr(_4b.lastIndexOf("/")+1);
if(_4e.charAt(0)=="@"){
var _4f=_4b.substring(0,_4b.lastIndexOf("/"));
var _50=this._find(_4a,_4f);
if(_50){
_50.setAttribute(_4e.substr(1),_4c);
return;
}
}
throw new Error("Can't evaluate expression "+_4b);
}
switch(_4d.nodeType){
case 1:
if(_4d.firstChild&&(_4d.firstChild.nodeType==3||_4d.firstChild.nodeType==4)){
_4d.firstChild.nodeValue=_4c;
}else{
if(_4c!=""){
_4d.appendChild(_4a.createTextNode(_4c));
}
}
break;
case 2:
_4d.nodeValue=_4c;
break;
case 3:
case 4:
_4d.nodeValue=_4c;
break;
}
return;
};
Freja.QueryEngine.XPath=function(){
};
Freja.Class.extend(Freja.QueryEngine.XPath,Freja.QueryEngine);
Freja.QueryEngine.XPath.prototype._find=function(_51,_52){
var _53=_51.selectSingleNode(_52);
return _53;
};
Freja.QueryEngine.SimplePath=function(){
};
Freja.Class.extend(Freja.QueryEngine.SimplePath,Freja.QueryEngine);
Freja.QueryEngine.SimplePath.prototype._find=function(_54,_55){
if(!_55.match(/^[\d\w\/@\[\]=_\-']*$/)){
throw new Error("Can't evaluate expression "+_55);
}
var _56=_55.split("/");
var _57=_54;
var _58=new RegExp("^@([\\d\\w]*)");
var _59=new RegExp("^([@\\d\\w]*)\\[([\\d]*)\\]$");
var _5a=new RegExp("^([\\d\\w]+)\\[@([@\\d\\w]+)=['\"]{1}(.*)['\"]{1}\\]$");
var _5b=null;
var _5c=0;
for(var i=0;i<_56.length;++i){
var _5e=_56[i];
var _5f=_5a.exec(_5e);
if(_5f){
if(i>0&&_56[i-1]==""){
var cn=_57.getElementsByTagName(_5f[1]);
}else{
var cn=_57.childNodes;
}
for(var j=0,l=cn.length;j<l;j++){
if(cn[j].nodeType==1&&cn[j].tagName==_5f[1]&&cn[j].getAttribute(_5f[2])==_5f[3]){
_57=cn[j];
break;
}
}
if(j==l){
throw new Error("Can't evaluate expression "+_5e);
}
}else{
_5c=_59.exec(_5e);
if(_5c){
_5e=_5c[1];
_5c=_5c[2]-1;
}else{
_5c=0;
}
if(_5e!=""){
_5b=_58.exec(_5e);
if(_5b){
_57=_57.getAttributeNode(_5b[1]);
}else{
_57=_57.getElementsByTagName(_5e).item(_5c);
}
}
}
}
if(_57&&_57.firstChild&&_57.firstChild.nodeType==3){
return _57.firstChild;
}
if(_57&&_57.firstChild&&_57.firstChild.nodeType==4){
return _57.firstChild;
}
if(!_57){
throw new Error("Can't evaluate expression "+_55);
}
return _57;
};
Freja.Model=function(url,_63){
this.url=url;
this.ready=false;
this.document=null;
this._query=_63;
};
Freja.Model.prototype.getElementById=function(id){
if(this.document){
return this._query.getElementById(this.document,id);
}
return null;
};
Freja.Model.prototype.get=function(_65){
if(this.document){
return this._query.get(this.document,_65);
}
return null;
};
Freja.Model.prototype.set=function(_66,_67){
if(this.document){
return this._query.set(this.document,_66,_67);
}
return null;
};
Freja.Model.prototype.updateFrom=function(_68){
var _69=_68.getValues();
for(var i=0;i<_69[0].length;++i){
if(_69[0][i].lastIndexOf("/")!=-1){
try{
this.set(_69[0][i],_69[1][i]);
}
catch(x){
}
}
}
};
Freja.Model.prototype.save=function(){
var url=this.url;
var _6c=/^(file:\/\/.*\/)([^\/]*)$/.exec(window.location.href);
if(_6c){
url=_6c[1]+url;
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
var _70=/^(file:\/\/.*\/)([^\/]*)$/.exec(window.location.href);
if(_70){
url=_70[1]+url;
}
var req=Freja.AssetManager.openXMLHttpRequest("DELETE",url);
return Freja._aux.sendXMLHttpRequest(req);
};
Freja.Model.prototype.reload=function(){
this.ready=false;
var _72=Freja._aux.bind(function(_73){
this.document=_73;
this.ready=true;
Freja._aux.signal(this,"onload");
},this);
var d=Freja.AssetManager.loadAsset(this.url,true);
d.addCallbacks(_72,Freja.AssetManager.onerror);
return d;
};
Freja.Model.DataSource=function(_75,_76){
this.createURL=_75;
this.indexURL=_76;
};
Freja.Model.DataSource.prototype.select=function(){
return getModel(this.indexURL);
};
Freja.Model.DataSource.prototype.create=function(_77){
var url=this.createURL;
var _79=/^(file:\/\/.*\/)([^\/]*)$/.exec(window.location.href);
if(_79){
url=_79[1]+url;
}
var req=Freja.AssetManager.openXMLHttpRequest("PUT",url);
var _7b={};
for(var i=0,len=_77[0].length;i<len;++i){
_7b[_77[0][i]]=_77[1][i];
}
return Freja._aux.sendXMLHttpRequest(req,Freja._aux.xmlize(_7b,"record"));
};
Freja.View=function(url,_7e){
this.url=url;
this.ready=false;
this.document=null;
this._renderer=_7e;
this._destination=null;
this.behaviors=[];
this.placeholder=null;
Freja._aux.connect(this,"onrendercomplete",Freja._aux.bind(this._connectBehavior,this));
};
Freja.View.prototype.render=function(_7f,_80,_81){
if(typeof (_80)=="undefined"){
_80=this.placeholder;
}
if(typeof (_81)=="undefined"){
_81=this.xslParameters;
}
var _82=function(_83,_84,_85,_86){
this.model=_83;
this.view=_84;
this.deferred=_85;
this.xslParameters=_86;
};
_82.prototype.trigger=function(){
try{
if(!this.view.ready){
Freja._aux.connect(this.view,"onload",Freja._aux.bind(this.trigger,this));
return;
}
if(typeof (this.model)=="object"&&this.model instanceof Freja.Model&&!this.model.ready){
Freja._aux.connect(this.model,"onload",Freja._aux.bind(this.trigger,this));
return;
}
var _87;
if(typeof (this.model)=="undefined"){
_87={document:Freja._aux.loadXML("<?xml version='1.0' ?><dummy/>")};
}else{
if(this.model instanceof Freja.Model){
_87=this.model;
}else{
_87={document:Freja._aux.loadXML("<?xml version='1.0' ?>\n"+Freja._aux.xmlize(this.model,"item"))};
}
}
var _88=this.view._renderer.transform(_87,this.view,this.xslParameters);
_88.addCallback(Freja._aux.bind(function(_89){
if(typeof _89=="string"){
this._destination.innerHTML=_89;
}else{
this._destination.innerHTML="";
this._destination.appendChild(_89);
}
},this.view));
_88.addCallback(Freja._aux.bind(function(){
Freja._aux.signal(this,"onrendercomplete",this._destination);
},this.view));
_88.addCallback(Freja._aux.bind(function(){
this.deferred.callback();
},this));
_88.addErrback(Freja._aux.bind(function(ex){
this.deferred.errback(ex);
},this));
}
catch(ex){
this.deferred.errback(ex);
}
};
var d=Freja._aux.createDeferred();
try{
if(typeof (_80)=="object"){
this._destination=_80;
}else{
this._destination=document.getElementById(_80);
}
this._destination.innerHTML=Freja.AssetManager.THROBBER_HTML;
var h=new _82(_7f,this,d,_81);
h.trigger();
}
catch(ex){
d.errback(ex);
}
return d;
};
Freja.View.prototype._connectBehavior=function(_8d){
try{
var _8e=function(_8f,_90,_91){
Freja._aux.connect(_8f,_90,Freja._aux.bind(function(e){
var _93=false;
try{
_93=_91(this);
}
catch(ex){
throw new Error("An error ocurred in user handler.\n"+ex.message);
}
finally{
if(!_93){
e.stop();
}
}
},_8f));
};
var _94=function(_95,_96){
for(var i=0,c=_95.childNodes,l=c.length;i<l;++i){
var _98=c[i];
if(_98.nodeType==1){
if(_98.className){
var _99=_98.className.split(" ");
for(var j=0;j<_99.length;j++){
var _9b=_96[_99[j]];
if(_9b){
for(var _9c in _9b){
if(_9c=="init"){
_9b.init(_98);
}else{
_8e(_98,_9c,_9b[_9c]);
}
}
}
}
}
_94(_98,_96);
}
}
};
for(var ids in this.behaviors){
_94(_8d,this.behaviors);
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
Freja.View.Renderer.XSLTransformer.prototype.transform=function(_9e,_9f,_a0){
var d=Freja._aux.createDeferred();
try{
var _a2=Freja._aux.transformXSL(_9e.document,_9f.document,_a0);
if(!_a2){
d.errback(new Error("XSL Transformation error."));
}else{
d.callback(_a2);
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
Freja.View.Renderer.RemoteXSLTransformer.prototype.transform=function(_a4,_a5,_a6){
var d=Freja._aux.createDeferred();
var _a8=_a5.url;
var _a9="xslFile="+encodeURIComponent(_a8)+"&xmlData="+encodeURIComponent(Freja._aux.serializeXML(_a4.document));
var _aa="";
for(var _ab in _a6){
_aa+=encodeURIComponent(_ab+","+_a6[_ab]);
}
if(_aa.length>0){
_a9=_a9+"&xslParam="+_aa;
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
req.send(_a9);
return d;
};
Freja.UndoHistory=function(){
this.cache=[];
this.maxLength=5;
this._position=0;
this._undoSteps=0;
};
Freja.UndoHistory.prototype.add=function(_ad){
var _ae=this._position%this.maxLength;
var _af=_ad.document;
this.cache[_ae]={};
this.cache[_ae].model=_ad;
this.cache[_ae].document=Freja._aux.cloneXMLDocument(_af);
if(!this.cache[_ae].document){
throw new Error("Couldn't add to history.");
}else{
this._position++;
var _b0=_ae;
while(this._undoSteps>0){
_b0=(_b0+1)%this.maxLength;
this.cache[_b0]={};
this._undoSteps--;
}
return _ae;
}
};
Freja.UndoHistory.prototype.undo=function(_b1){
if(this._undoSteps<this.cache.length){
this._undoSteps++;
this._position--;
if(this._position<0){
this._position=this.maxLength-1;
}
var _b2=this.cache[this._position].model;
if(this.cache[this._position].document){
_b2.document=this.cache[this._position].document;
}else{
throw new Error("The model's DOMDocument wasn't properly copied into the history");
}
if(typeof (_b1)!="undefined"&&_b1>1){
this.undo(_b1-1);
}
}else{
throw new Error("Nothing to undo");
}
};
Freja.UndoHistory.prototype.redo=function(){
if(this._undoSteps>0){
this._undoSteps--;
this._position=(this._position+1)%this.maxLength;
var _b3=this.cache[this._position].model;
_b3.document=this.cache[this._position].document;
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
var _b7=Freja._aux.bind(function(_b8){
this.document=_b8;
this.ready=true;
Freja._aux.signal(this,"onload");
},m);
this.loadAsset(url,true).addCallbacks(_b7,Freja.AssetManager.onerror);
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
var _bc=Freja._aux.bind(function(_bd){
this.document=_bd;
this.ready=true;
Freja._aux.signal(this,"onload");
},v);
this.loadAsset(url,false).addCallbacks(_bc,Freja.AssetManager.onerror);
this.views.push(v);
return v;
};
Freja.AssetManager.openXMLHttpRequest=function(_be,url){
var _c0=null;
if(Freja.AssetManager.HTTP_METHOD_TUNNEL&&_be!="GET"&&_be!="POST"){
_c0=_be;
_be="POST";
}
var req=Freja._aux.openXMLHttpRequest(_be,url,Freja.AssetManager.HTTP_REQUEST_TYPE=="async",Freja.AssetManager._username,Freja.AssetManager._password);
if(_c0){
req.setRequestHeader(Freja.AssetManager.HTTP_METHOD_TUNNEL,_c0);
}
return req;
};
Freja.AssetManager.setCredentials=function(_c2,_c3){
this._username=_c2;
this._password=_c3;
};
Freja.AssetManager.loadAsset=function(url,_c5){
var _c6=/^(file:\/\/.*\/)([^\/]*)$/.exec(window.location.href);
if(_c6){
url=_c6[1]+url;
}
var d=Freja._aux.createDeferred();
var _c8=function(_c9){
try{
if(_c9.responseText==""){
throw new Error("Empty response.");
}
if(_c9.responseXML.xml==""){
var _ca=Freja._aux.loadXML(_c9.responseText);
}else{
var _ca=_c9.responseXML;
}
}
catch(ex){
d.errback(ex);
}
if(window.document.all){
setTimeout(function(){
d.callback(_ca);
},1);
}else{
d.callback(_ca);
}
};
try{
if(_c5&&Freja.AssetManager.HTTP_METHOD_TUNNEL){
var req=Freja._aux.openXMLHttpRequest("POST",url,Freja.AssetManager.HTTP_REQUEST_TYPE=="async",Freja.AssetManager._username,Freja.AssetManager._password);
req.setRequestHeader(Freja.AssetManager.HTTP_METHOD_TUNNEL,"GET");
req.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
}else{
var req=Freja._aux.openXMLHttpRequest("GET",url,Freja.AssetManager.HTTP_REQUEST_TYPE=="async",Freja.AssetManager._username,Freja.AssetManager._password);
}
var _cc=Freja._aux.sendXMLHttpRequest(req);
if(Freja.AssetManager.HTTP_REQUEST_TYPE=="async"){
_cc.addCallbacks(_c8,function(req){
d.errback(new Error("Request failed:"+req.status));
});
}else{
if(req.status==0||req.status==200||req.status==201||req.status==304){
_c8(req);
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


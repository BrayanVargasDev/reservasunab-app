import{$ as ho,A as ro,C as _,D as kn,E as oo,F as A,G as I,H as io,I as so,J as Nt,K as k,L as Ee,M as Yn,N as lo,O as ao,P as co,Q as Pt,R as uo,S as fo,T as qt,U as go,V as nn,W as En,X as Mn,Y as Xn,_ as Tn,a as Wn,b as Qn,c as z,d as Yr,e as N,f as B,g as M,h as Xr,i as Dt,j as et,k as ft,l as U,m as Zr,n as Jr,o as be,p as xe,q as p,r as j,s as J,u as qe,v as eo,w as to,x as K,y as no,z as Sn}from"./chunk-YS4SZ7MI.js";import{a as X,b as pe,f as tn,j as Re,k as Qr}from"./chunk-LVXXLD6S.js";var Ns=!Ee,Us=Ns&&!!ro,vo=()=>{},Gs=e=>e!=null,Vs=e=>e.filter(Gs);function Hs(e){return(...n)=>{for(let t of e)t&&t(...n)}}var E=e=>typeof e=="function"&&!e.length?e():e,rr=e=>Array.isArray(e)?e:e?[e]:[];function js(e,...n){return typeof e=="function"?e(...n):e}var Ws=Us?e=>Zr()?U(e):e:U;function Qs(e,n,t,r){let o=e.length,s=n.length,l=0;if(!s){for(;l<o;l++)t(e[l]);return}if(!o){for(;l<s;l++)r(n[l]);return}for(;l<s&&n[l]===e[l];l++);let a,i;n=n.slice(l),e=e.slice(l);for(a of n)e.includes(a)||r(a);for(i of e)n.includes(i)||t(i)}function Ys(e){let[n,t]=z(),r=e?.throw?(g,f)=>{throw t(g instanceof Error?g:new Error(f)),g}:(g,f)=>{t(g instanceof Error?g:new Error(f))},o=e?.api?Array.isArray(e.api)?e.api:[e.api]:[globalThis.localStorage].filter(Boolean),s=e?.prefix?`${e.prefix}.`:"",l=new Map,a=new Proxy({},{get(g,f){let h=l.get(f);h||(h=z(void 0,{equals:!1}),l.set(f,h)),h[0]();let v=o.reduce((y,m)=>{if(y!==null||!m)return y;try{return m.getItem(`${s}${f}`)}catch(b){return r(b,`Error reading ${s}${f} from ${m.name}`),null}},null);return v!==null&&e?.deserializer?e.deserializer(v,f,e.options):v}}),i=(g,f,h)=>{let v=e?.serializer?e.serializer(f,g,h??e.options):f,y=`${s}${g}`;o.forEach(b=>{try{b.getItem(y)!==v&&b.setItem(y,v)}catch(x){r(x,`Error setting ${s}${g} to ${v} in ${b.name}`)}});let m=l.get(g);m&&m[1]()},c=g=>o.forEach(f=>{try{f.removeItem(`${s}${g}`)}catch(h){r(h,`Error removing ${s}${g} from ${f.name}`)}}),d=()=>o.forEach(g=>{try{g.clear()}catch(f){r(f,`Error clearing ${g.name}`)}}),u=()=>{let g={},f=(h,v)=>{if(!g.hasOwnProperty(h)){let y=v&&e?.deserializer?e.deserializer(v,h,e.options):v;y&&(g[h]=y)}};return o.forEach(h=>{if(typeof h.getAll=="function"){let v;try{v=h.getAll()}catch(y){r(y,`Error getting all values from in ${h.name}`)}for(let y of v)f(y,v[y])}else{let v=0,y;try{for(;y=h.key(v++);)g.hasOwnProperty(y)||f(y,h.getItem(y))}catch(m){r(m,`Error getting all values from ${h.name}`)}}}),g};return e?.sync!==!1&&ft(()=>{let g=f=>{let h=!1;o.forEach(v=>{try{v!==f.storageArea&&f.key&&f.newValue!==v.getItem(f.key)&&(f.newValue?v.setItem(f.key,f.newValue):v.removeItem(f.key),h=!0)}catch(y){r(y,`Error synching api ${v.name} from storage event (${f.key}=${f.newValue})`)}}),h&&f.key&&l.get(f.key)?.[1]()};"addEventListener"in globalThis?(globalThis.addEventListener("storage",g),U(()=>globalThis.removeEventListener("storage",g))):(o.forEach(f=>f.addEventListener?.("storage",g)),U(()=>o.forEach(f=>f.removeEventListener?.("storage",g))))}),[a,i,{clear:d,error:n,remove:c,toJSON:u}]}var ff=Ys,Xs=e=>(typeof e.clear=="function"||(e.clear=()=>{let n;for(;n=e.key(0);)e.removeItem(n)}),e),po=e=>{if(!e)return"";let n="";for(let t in e){if(!e.hasOwnProperty(t))continue;let r=e[t];n+=r instanceof Date?`; ${t}=${r.toUTCString()}`:typeof r=="boolean"?`; ${t}`:`; ${t}=${r}`}return n},Ke=Xs({_cookies:[globalThis.document,"cookie"],getItem:e=>Ke._cookies[0][Ke._cookies[1]].match("(^|;)\\s*"+e+"\\s*=\\s*([^;]+)")?.pop()??null,setItem:(e,n,t)=>{let r=Ke.getItem(e);Ke._cookies[0][Ke._cookies[1]]=`${e}=${n}${po(t)}`;let o=Object.assign(new Event("storage"),{key:e,oldValue:r,newValue:n,url:globalThis.document.URL,storageArea:Ke});window.dispatchEvent(o)},removeItem:e=>{Ke._cookies[0][Ke._cookies[1]]=`${e}=deleted${po({expires:new Date(0)})}`},key:e=>{let n=null,t=0;return Ke._cookies[0][Ke._cookies[1]].replace(/(?:^|;)\s*(.+?)\s*=\s*[^;]+/g,(r,o)=>(!n&&o&&t++===e&&(n=o),"")),n},get length(){let e=0;return Ke._cookies[0][Ke._cookies[1]].replace(/(?:^|;)\s*.+?\s*=\s*[^;]+/g,n=>(e+=n?1:0,"")),e}}),Zs=1024,Lt=796,hr=700,Js="bottom-right",or="bottom",gf="system",el=!1,ci=500,tl=500,ui=500,nl=Object.keys(En)[0],yo=1,rl=Object.keys(Mn)[0],ol=be({client:void 0,onlineManager:void 0,queryFlavor:"",version:"",shadowDOMTarget:void 0});function R(){return xe(ol)}var di=be(void 0),hf=e=>{let[n,t]=z(null),r=()=>{let l=n();l!=null&&(l.close(),t(null))},o=(l,a)=>{if(n()!=null)return;let i=window.open("","TSQD-Devtools-Panel",`width=${l},height=${a},popup`);if(!i)throw new Error("Failed to open popup. Please allow popups for this site to view the devtools in picture-in-picture mode.");i.document.head.innerHTML="",i.document.body.innerHTML="",oo(i.document),i.document.title="TanStack Query Devtools",i.document.body.style.margin="0",i.addEventListener("pagehide",()=>{e.setLocalStore("pip_open","false"),t(null)}),[...(R().shadowDOMTarget||document).styleSheets].forEach(c=>{try{let d=[...c.cssRules].map(h=>h.cssText).join(""),u=document.createElement("style"),g=c.ownerNode,f="";g&&"id"in g&&(f=g.id),f&&u.setAttribute("id",f),u.textContent=d,i.document.head.appendChild(u)}catch{let u=document.createElement("link");if(c.href==null)return;u.rel="stylesheet",u.type=c.type,u.media=c.media.toString(),u.href=c.href,i.document.head.appendChild(u)}}),kn(["focusin","focusout","pointermove","keydown","pointerdown","pointerup","click","mousedown","input"],i.document),e.setLocalStore("pip_open","true"),t(i)};B(()=>{(e.localStore.pip_open??"false")==="true"&&!e.disabled&&o(Number(window.innerWidth),Number(e.localStore.height||tl))}),B(()=>{let l=(R().shadowDOMTarget||document).querySelector("#_goober"),a=n();if(l&&a){let i=new MutationObserver(()=>{let c=(R().shadowDOMTarget||a.document).querySelector("#_goober");c&&(c.textContent=l.textContent)});i.observe(l,{childList:!0,subtree:!0,characterDataOldValue:!0}),U(()=>{i.disconnect()})}});let s=M(()=>({pipWindow:n(),requestPipWindow:o,closePipWindow:r,disabled:e.disabled??!1}));return p(di.Provider,{value:s,get children(){return e.children}})},vr=()=>M(()=>{let n=xe(di);if(!n)throw new Error("usePiPWindow must be used within a PiPProvider");return n()}),il=be(()=>"dark");function $e(){return xe(il)}var fi={\u00C0:"A",\u00C1:"A",\u00C2:"A",\u00C3:"A",\u00C4:"A",\u00C5:"A",\u1EA4:"A",\u1EAE:"A",\u1EB2:"A",\u1EB4:"A",\u1EB6:"A",\u00C6:"AE",\u1EA6:"A",\u1EB0:"A",\u0202:"A",\u00C7:"C",\u1E08:"C",\u00C8:"E",\u00C9:"E",\u00CA:"E",\u00CB:"E",\u1EBE:"E",\u1E16:"E",\u1EC0:"E",\u1E14:"E",\u1E1C:"E",\u0206:"E",\u00CC:"I",\u00CD:"I",\u00CE:"I",\u00CF:"I",\u1E2E:"I",\u020A:"I",\u00D0:"D",\u00D1:"N",\u00D2:"O",\u00D3:"O",\u00D4:"O",\u00D5:"O",\u00D6:"O",\u00D8:"O",\u1ED0:"O",\u1E4C:"O",\u1E52:"O",\u020E:"O",\u00D9:"U",\u00DA:"U",\u00DB:"U",\u00DC:"U",\u00DD:"Y",\u00E0:"a",\u00E1:"a",\u00E2:"a",\u00E3:"a",\u00E4:"a",\u00E5:"a",\u1EA5:"a",\u1EAF:"a",\u1EB3:"a",\u1EB5:"a",\u1EB7:"a",\u00E6:"ae",\u1EA7:"a",\u1EB1:"a",\u0203:"a",\u00E7:"c",\u1E09:"c",\u00E8:"e",\u00E9:"e",\u00EA:"e",\u00EB:"e",\u1EBF:"e",\u1E17:"e",\u1EC1:"e",\u1E15:"e",\u1E1D:"e",\u0207:"e",\u00EC:"i",\u00ED:"i",\u00EE:"i",\u00EF:"i",\u1E2F:"i",\u020B:"i",\u00F0:"d",\u00F1:"n",\u00F2:"o",\u00F3:"o",\u00F4:"o",\u00F5:"o",\u00F6:"o",\u00F8:"o",\u1ED1:"o",\u1E4D:"o",\u1E53:"o",\u020F:"o",\u00F9:"u",\u00FA:"u",\u00FB:"u",\u00FC:"u",\u00FD:"y",\u00FF:"y",\u0100:"A",\u0101:"a",\u0102:"A",\u0103:"a",\u0104:"A",\u0105:"a",\u0106:"C",\u0107:"c",\u0108:"C",\u0109:"c",\u010A:"C",\u010B:"c",\u010C:"C",\u010D:"c",C\u0306:"C",c\u0306:"c",\u010E:"D",\u010F:"d",\u0110:"D",\u0111:"d",\u0112:"E",\u0113:"e",\u0114:"E",\u0115:"e",\u0116:"E",\u0117:"e",\u0118:"E",\u0119:"e",\u011A:"E",\u011B:"e",\u011C:"G",\u01F4:"G",\u011D:"g",\u01F5:"g",\u011E:"G",\u011F:"g",\u0120:"G",\u0121:"g",\u0122:"G",\u0123:"g",\u0124:"H",\u0125:"h",\u0126:"H",\u0127:"h",\u1E2A:"H",\u1E2B:"h",\u0128:"I",\u0129:"i",\u012A:"I",\u012B:"i",\u012C:"I",\u012D:"i",\u012E:"I",\u012F:"i",\u0130:"I",\u0131:"i",\u0132:"IJ",\u0133:"ij",\u0134:"J",\u0135:"j",\u0136:"K",\u0137:"k",\u1E30:"K",\u1E31:"k",K\u0306:"K",k\u0306:"k",\u0139:"L",\u013A:"l",\u013B:"L",\u013C:"l",\u013D:"L",\u013E:"l",\u013F:"L",\u0140:"l",\u0141:"l",\u0142:"l",\u1E3E:"M",\u1E3F:"m",M\u0306:"M",m\u0306:"m",\u0143:"N",\u0144:"n",\u0145:"N",\u0146:"n",\u0147:"N",\u0148:"n",\u0149:"n",N\u0306:"N",n\u0306:"n",\u014C:"O",\u014D:"o",\u014E:"O",\u014F:"o",\u0150:"O",\u0151:"o",\u0152:"OE",\u0153:"oe",P\u0306:"P",p\u0306:"p",\u0154:"R",\u0155:"r",\u0156:"R",\u0157:"r",\u0158:"R",\u0159:"r",R\u0306:"R",r\u0306:"r",\u0212:"R",\u0213:"r",\u015A:"S",\u015B:"s",\u015C:"S",\u015D:"s",\u015E:"S",\u0218:"S",\u0219:"s",\u015F:"s",\u0160:"S",\u0161:"s",\u0162:"T",\u0163:"t",\u021B:"t",\u021A:"T",\u0164:"T",\u0165:"t",\u0166:"T",\u0167:"t",T\u0306:"T",t\u0306:"t",\u0168:"U",\u0169:"u",\u016A:"U",\u016B:"u",\u016C:"U",\u016D:"u",\u016E:"U",\u016F:"u",\u0170:"U",\u0171:"u",\u0172:"U",\u0173:"u",\u0216:"U",\u0217:"u",V\u0306:"V",v\u0306:"v",\u0174:"W",\u0175:"w",\u1E82:"W",\u1E83:"w",X\u0306:"X",x\u0306:"x",\u0176:"Y",\u0177:"y",\u0178:"Y",Y\u0306:"Y",y\u0306:"y",\u0179:"Z",\u017A:"z",\u017B:"Z",\u017C:"z",\u017D:"Z",\u017E:"z",\u017F:"s",\u0192:"f",\u01A0:"O",\u01A1:"o",\u01AF:"U",\u01B0:"u",\u01CD:"A",\u01CE:"a",\u01CF:"I",\u01D0:"i",\u01D1:"O",\u01D2:"o",\u01D3:"U",\u01D4:"u",\u01D5:"U",\u01D6:"u",\u01D7:"U",\u01D8:"u",\u01D9:"U",\u01DA:"u",\u01DB:"U",\u01DC:"u",\u1EE8:"U",\u1EE9:"u",\u1E78:"U",\u1E79:"u",\u01FA:"A",\u01FB:"a",\u01FC:"AE",\u01FD:"ae",\u01FE:"O",\u01FF:"o",\u00DE:"TH",\u00FE:"th",\u1E54:"P",\u1E55:"p",\u1E64:"S",\u1E65:"s",X\u0301:"X",x\u0301:"x",\u0403:"\u0413",\u0453:"\u0433",\u040C:"\u041A",\u045C:"\u043A",A\u030B:"A",a\u030B:"a",E\u030B:"E",e\u030B:"e",I\u030B:"I",i\u030B:"i",\u01F8:"N",\u01F9:"n",\u1ED2:"O",\u1ED3:"o",\u1E50:"O",\u1E51:"o",\u1EEA:"U",\u1EEB:"u",\u1E80:"W",\u1E81:"w",\u1EF2:"Y",\u1EF3:"y",\u0200:"A",\u0201:"a",\u0204:"E",\u0205:"e",\u0208:"I",\u0209:"i",\u020C:"O",\u020D:"o",\u0210:"R",\u0211:"r",\u0214:"U",\u0215:"u",B\u030C:"B",b\u030C:"b",\u010C\u0323:"C",\u010D\u0323:"c",\u00CA\u030C:"E",\u00EA\u030C:"e",F\u030C:"F",f\u030C:"f",\u01E6:"G",\u01E7:"g",\u021E:"H",\u021F:"h",J\u030C:"J",\u01F0:"j",\u01E8:"K",\u01E9:"k",M\u030C:"M",m\u030C:"m",P\u030C:"P",p\u030C:"p",Q\u030C:"Q",q\u030C:"q",\u0158\u0329:"R",\u0159\u0329:"r",\u1E66:"S",\u1E67:"s",V\u030C:"V",v\u030C:"v",W\u030C:"W",w\u030C:"w",X\u030C:"X",x\u030C:"x",Y\u030C:"Y",y\u030C:"y",A\u0327:"A",a\u0327:"a",B\u0327:"B",b\u0327:"b",\u1E10:"D",\u1E11:"d",\u0228:"E",\u0229:"e",\u0190\u0327:"E",\u025B\u0327:"e",\u1E28:"H",\u1E29:"h",I\u0327:"I",i\u0327:"i",\u0197\u0327:"I",\u0268\u0327:"i",M\u0327:"M",m\u0327:"m",O\u0327:"O",o\u0327:"o",Q\u0327:"Q",q\u0327:"q",U\u0327:"U",u\u0327:"u",X\u0327:"X",x\u0327:"x",Z\u0327:"Z",z\u0327:"z"},sl=Object.keys(fi).join("|"),ll=new RegExp(sl,"g");function al(e){return e.replace(ll,n=>fi[n])}var Pe={CASE_SENSITIVE_EQUAL:7,EQUAL:6,STARTS_WITH:5,WORD_STARTS_WITH:4,CONTAINS:3,ACRONYM:2,MATCHES:1,NO_MATCH:0};function mo(e,n,t){var r;if(t=t||{},t.threshold=(r=t.threshold)!=null?r:Pe.MATCHES,!t.accessors){let l=bo(e,n,t);return{rankedValue:e,rank:l,accessorIndex:-1,accessorThreshold:t.threshold,passed:l>=t.threshold}}let o=fl(e,t.accessors),s={rankedValue:e,rank:Pe.NO_MATCH,accessorIndex:-1,accessorThreshold:t.threshold,passed:!1};for(let l=0;l<o.length;l++){let a=o[l],i=bo(a.itemValue,n,t),{minRanking:c,maxRanking:d,threshold:u=t.threshold}=a.attributes;i<c&&i>=Pe.MATCHES?i=c:i>d&&(i=d),i=Math.min(i,d),i>=u&&i>s.rank&&(s.rank=i,s.passed=!0,s.accessorIndex=l,s.accessorThreshold=u,s.rankedValue=a.itemValue)}return s}function bo(e,n,t){return e=xo(e,t),n=xo(n,t),n.length>e.length?Pe.NO_MATCH:e===n?Pe.CASE_SENSITIVE_EQUAL:(e=e.toLowerCase(),n=n.toLowerCase(),e===n?Pe.EQUAL:e.startsWith(n)?Pe.STARTS_WITH:e.includes(` ${n}`)?Pe.WORD_STARTS_WITH:e.includes(n)?Pe.CONTAINS:n.length===1?Pe.NO_MATCH:cl(e).includes(n)?Pe.ACRONYM:ul(e,n))}function cl(e){let n="";return e.split(" ").forEach(r=>{r.split("-").forEach(s=>{n+=s.substr(0,1)})}),n}function ul(e,n){let t=0,r=0;function o(i,c,d){for(let u=d,g=c.length;u<g;u++)if(c[u]===i)return t+=1,u+1;return-1}function s(i){let c=1/i,d=t/n.length;return Pe.MATCHES+d*c}let l=o(n[0],e,0);if(l<0)return Pe.NO_MATCH;r=l;for(let i=1,c=n.length;i<c;i++){let d=n[i];if(r=o(d,e,r),!(r>-1))return Pe.NO_MATCH}let a=r-l;return s(a)}function xo(e,n){let{keepDiacritics:t}=n;return e=`${e}`,t||(e=al(e)),e}function dl(e,n){let t=n;typeof n=="object"&&(t=n.accessor);let r=t(e);return r==null?[]:Array.isArray(r)?r:[String(r)]}function fl(e,n){let t=[];for(let r=0,o=n.length;r<o;r++){let s=n[r],l=gl(s),a=dl(e,s);for(let i=0,c=a.length;i<c;i++)t.push({itemValue:a[i],attributes:l})}return t}var wo={maxRanking:1/0,minRanking:-1/0};function gl(e){return typeof e=="function"?wo:X(X({},wo),e)}var hl={data:""},vl=e=>typeof window=="object"?((e?e.querySelector("#_goober"):window._goober)||Object.assign((e||document.head).appendChild(document.createElement("style")),{innerHTML:" ",id:"_goober"})).firstChild:e||hl,pl=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,yl=/\/\*[^]*?\*\/|  +/g,$o=/\n+/g,Ot=(e,n)=>{let t="",r="",o="";for(let s in e){let l=e[s];s[0]=="@"?s[1]=="i"?t=s+" "+l+";":r+=s[1]=="f"?Ot(l,s):s+"{"+Ot(l,s[1]=="k"?"":n)+"}":typeof l=="object"?r+=Ot(l,n?n.replace(/([^,])+/g,a=>s.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,i=>/&/.test(i)?i.replace(/&/g,a):a?a+" "+i:i)):s):l!=null&&(s=/^--/.test(s)?s:s.replace(/[A-Z]/g,"-$&").toLowerCase(),o+=Ot.p?Ot.p(s,l):s+":"+l+";")}return t+(n&&o?n+"{"+o+"}":o)+r},gt={},gi=e=>{if(typeof e=="object"){let n="";for(let t in e)n+=t+gi(e[t]);return n}return e},ml=(e,n,t,r,o)=>{let s=gi(e),l=gt[s]||(gt[s]=(i=>{let c=0,d=11;for(;c<i.length;)d=101*d+i.charCodeAt(c++)>>>0;return"go"+d})(s));if(!gt[l]){let i=s!==e?e:(c=>{let d,u,g=[{}];for(;d=pl.exec(c.replace(yl,""));)d[4]?g.shift():d[3]?(u=d[3].replace($o," ").trim(),g.unshift(g[0][u]=g[0][u]||{})):g[0][d[1]]=d[2].replace($o," ").trim();return g[0]})(e);gt[l]=Ot(o?{["@keyframes "+l]:i}:i,t?"":"."+l)}let a=t&&gt.g?gt.g:null;return t&&(gt.g=gt[l]),((i,c,d,u)=>{u?c.data=c.data.replace(u,i):c.data.indexOf(i)===-1&&(c.data=d?i+c.data:c.data+i)})(gt[l],n,r,a),l},bl=(e,n,t)=>e.reduce((r,o,s)=>{let l=n[s];if(l&&l.call){let a=l(t),i=a&&a.props&&a.props.className||/^go/.test(a)&&a;l=i?"."+i:a&&typeof a=="object"?a.props?"":Ot(a,""):a===!1?"":a}return r+o+(l??"")},"");function W(e){let n=this||{},t=e.call?e(n.p):e;return ml(t.unshift?t.raw?bl(t,[].slice.call(arguments,1),n.p):t.reduce((r,o)=>Object.assign(r,o&&o.call?o(n.p):o),{}):t,vl(n.target),n.g,n.o,n.k)}W.bind({g:1});W.bind({k:1});function hi(e){var n,t,r="";if(typeof e=="string"||typeof e=="number")r+=e;else if(typeof e=="object")if(Array.isArray(e)){var o=e.length;for(n=0;n<o;n++)e[n]&&(t=hi(e[n]))&&(r&&(r+=" "),r+=t)}else for(t in e)e[t]&&(r&&(r+=" "),r+=t);return r}function L(){for(var e,n,t=0,r="",o=arguments.length;t<o;t++)(e=arguments[t])&&(n=hi(e))&&(r&&(r+=" "),r+=n);return r}function xl(e,n){let t=Dt(e);if(Ee){let u=t.slice();return()=>u}let{onChange:r}=n,o=new Set(n.appear?void 0:t),s=new WeakSet,[l,a]=z([],{equals:!1}),[i]=Jr(),c=u=>{a(g=>(g.push.apply(g,u),g));for(let g of u)s.delete(g)},d=(u,g,f)=>u.splice(f,0,g);return M(u=>{let g=l(),f=e();if(f[Wn],Dt(i))return i(),u;if(g.length){let h=u.filter(v=>!g.includes(v));return g.length=0,r({list:h,added:[],removed:[],unchanged:h,finishRemoved:c}),h}return Dt(()=>{let h=new Set(f),v=f.slice(),y=[],m=[],b=[];for(let w of f)(o.has(w)?b:y).push(w);let x=!y.length;for(let w=0;w<u.length;w++){let $=u[w];h.has($)||(s.has($)||(m.push($),s.add($)),d(v,$,w)),x&&$!==v[w]&&(x=!1)}return!m.length&&x?u:(r({list:v,added:y,removed:m,unchanged:b,finishRemoved:c}),o=h,v)})},n.appear?[]:t.slice())}function De(...e){return Hs(e)}var Co=Ee?e=>e!=null&&typeof e=="object"&&"t"in e:e=>e instanceof Element;function ir(e,n){if(n(e))return e;if(typeof e=="function"&&!e.length)return ir(e(),n);if(Array.isArray(e)){let t=[];for(let r of e){let o=ir(r,n);o&&(Array.isArray(o)?t.push.apply(t,o):t.push(o))}return t.length?t:null}return null}function wl(e,n=Co,t=Co){let r=M(e),o=M(()=>ir(r(),Ee?t:n));return o.toArray=()=>{let s=o();return Array.isArray(s)?s:s?[s]:[]},o}function $l(e){return M(()=>{let n=e.name||"s";return{enterActive:(e.enterActiveClass||n+"-enter-active").split(" "),enter:(e.enterClass||n+"-enter").split(" "),enterTo:(e.enterToClass||n+"-enter-to").split(" "),exitActive:(e.exitActiveClass||n+"-exit-active").split(" "),exit:(e.exitClass||n+"-exit").split(" "),exitTo:(e.exitToClass||n+"-exit-to").split(" "),move:(e.moveClass||n+"-move").split(" ")}})}function vi(e){requestAnimationFrame(()=>requestAnimationFrame(e))}function Cl(e,n,t,r){let{onBeforeEnter:o,onEnter:s,onAfterEnter:l}=n;o?.(t),t.classList.add(...e.enter),t.classList.add(...e.enterActive),queueMicrotask(()=>{if(!t.parentNode)return r?.();s?.(t,()=>a())}),vi(()=>{t.classList.remove(...e.enter),t.classList.add(...e.enterTo),(!s||s.length<2)&&(t.addEventListener("transitionend",a),t.addEventListener("animationend",a))});function a(i){(!i||i.target===t)&&(t.removeEventListener("transitionend",a),t.removeEventListener("animationend",a),t.classList.remove(...e.enterActive),t.classList.remove(...e.enterTo),l?.(t))}}function Sl(e,n,t,r){let{onBeforeExit:o,onExit:s,onAfterExit:l}=n;if(!t.parentNode)return r?.();o?.(t),t.classList.add(...e.exit),t.classList.add(...e.exitActive),s?.(t,()=>a()),vi(()=>{t.classList.remove(...e.exit),t.classList.add(...e.exitTo),(!s||s.length<2)&&(t.addEventListener("transitionend",a),t.addEventListener("animationend",a))});function a(i){(!i||i.target===t)&&(r?.(),t.removeEventListener("transitionend",a),t.removeEventListener("animationend",a),t.classList.remove(...e.exitActive),t.classList.remove(...e.exitTo),l?.(t))}}var So=e=>{let n=$l(e);return xl(wl(()=>e.children).toArray,{appear:e.appear,onChange({added:t,removed:r,finishRemoved:o,list:s}){let l=n();for(let i of t)Cl(l,e,i);let a=[];for(let i of s)i.isConnected&&(i instanceof HTMLElement||i instanceof SVGElement)&&a.push({el:i,rect:i.getBoundingClientRect()});queueMicrotask(()=>{let i=[];for(let{el:c,rect:d}of a)if(c.isConnected){let u=c.getBoundingClientRect(),g=d.left-u.left,f=d.top-u.top;(g||f)&&(c.style.transform=`translate(${g}px, ${f}px)`,c.style.transitionDuration="0s",i.push(c))}document.body.offsetHeight;for(let c of i){let d=function(u){(u.target===c||/transform$/.test(u.propertyName))&&(c.removeEventListener("transitionend",d),c.classList.remove(...l.move))};c.classList.add(...l.move),c.style.transform=c.style.transitionDuration="",c.addEventListener("transitionend",d)}});for(let i of r)Sl(l,e,i,()=>o([i]))}})},Zn=Symbol("fallback");function ko(e){for(let n of e)n.dispose()}function kl(e,n,t,r={}){if(Ee){let l=e(),a=[];if(l&&l.length)for(let i=0,c=l.length;i<c;i++)a.push(t(()=>l[i],()=>i));else r.fallback&&(a=[r.fallback()]);return()=>a}let o=new Map;return U(()=>ko(o.values())),()=>{let l=e()||[];return l[Wn],Dt(()=>{if(!l.length)return ko(o.values()),o.clear(),r.fallback?[Qn(u=>(o.set(Zn,{dispose:u}),r.fallback()))]:[];let a=new Array(l.length),i=o.get(Zn);if(!o.size||i){i?.dispose(),o.delete(Zn);for(let d=0;d<l.length;d++){let u=l[d],g=n(u,d);s(a,u,d,g)}return a}let c=new Set(o.keys());for(let d=0;d<l.length;d++){let u=l[d],g=n(u,d);c.delete(g);let f=o.get(g);f?(a[d]=f.mapped,f.setIndex?.(d),f.setItem(()=>u)):s(a,u,d,g)}for(let d of c)o.get(d)?.dispose(),o.delete(d);return a})};function s(l,a,i,c){Qn(d=>{let[u,g]=z(a),f={setItem:g,dispose:d};if(t.length>1){let[h,v]=z(i);f.setIndex=v,f.mapped=t(u,h)}else f.mapped=t(u);o.set(c,f),l[i]=f.mapped})}}function Pn(e){let{by:n}=e;return M(kl(()=>e.each,typeof n=="function"?n:t=>t[n],e.children,"fallback"in e?{fallback:()=>e.fallback}:void 0))}function El(e,n,t,r){return e.addEventListener(n,t,r),Ws(e.removeEventListener.bind(e,n,t,r))}function Ml(e,n,t,r){if(Ee)return;let o=()=>{rr(E(e)).forEach(s=>{s&&rr(E(n)).forEach(l=>El(s,l,t,r))})};typeof e=="function"?B(o):N(o)}function Tl(e,n){if(Ee)return{observe:vo,unobserve:vo};let t=new ResizeObserver(e);return U(t.disconnect.bind(t)),{observe:r=>t.observe(r,n),unobserve:t.unobserve.bind(t)}}function pi(e,n,t){if(Ee)return;let r=new WeakMap,{observe:o,unobserve:s}=Tl(l=>{for(let a of l){let{contentRect:i,target:c}=a,d=Math.round(i.width),u=Math.round(i.height),g=r.get(c);(!g||g.width!==d||g.height!==u)&&(n(i,c,a),r.set(c,{width:d,height:u}))}},t);B(l=>{let a=Vs(rr(E(e)));return Qs(a,l,o,s),a},[])}var Al=/((?:--)?(?:\w+-?)+)\s*:\s*([^;]*)/g;function Eo(e){let n={},t;for(;t=Al.exec(e);)n[t[1]]=t[2];return n}function Rn(e,n){if(typeof e=="string"){if(typeof n=="string")return`${e};${n}`;e=Eo(e)}else typeof n=="string"&&(n=Eo(n));return X(X({},e),n)}function Il(e,n,t=-1){return t in e?[...e.slice(0,t),n,...e.slice(t)]:[...e,n]}function sr(e,n){let t=[...e],r=t.indexOf(n);return r!==-1&&t.splice(r,1),t}function Dl(e){return typeof e=="number"}function Ut(e){return Object.prototype.toString.call(e)==="[object String]"}function Pl(e){return typeof e=="function"}function vn(e){return n=>`${e()}-${n}`}function Ue(e,n){return e?e===n||e.contains(n):!1}function an(e,n=!1){let{activeElement:t}=rt(e);if(!t?.nodeName)return null;if(yi(t)&&t.contentDocument)return an(t.contentDocument.body,n);if(n){let r=t.getAttribute("aria-activedescendant");if(r){let o=rt(t).getElementById(r);if(o)return o}}return t}function ql(e){return rt(e).defaultView||window}function rt(e){return e?e.ownerDocument||e:document}function yi(e){return e.tagName==="IFRAME"}var pr=(e=>(e.Escape="Escape",e.Enter="Enter",e.Tab="Tab",e.Space=" ",e.ArrowDown="ArrowDown",e.ArrowLeft="ArrowLeft",e.ArrowRight="ArrowRight",e.ArrowUp="ArrowUp",e.End="End",e.Home="Home",e.PageDown="PageDown",e.PageUp="PageUp",e))(pr||{});function yr(e){return typeof window<"u"&&window.navigator!=null?e.test(window.navigator.userAgentData?.platform||window.navigator.platform):!1}function Kn(){return yr(/^Mac/i)}function Ol(){return yr(/^iPhone/i)}function Ll(){return yr(/^iPad/i)||Kn()&&navigator.maxTouchPoints>1}function Fl(){return Ol()||Ll()}function _l(){return Kn()||Fl()}function ce(e,n){return n&&(Pl(n)?n(e):n[0](n[1],e)),e?.defaultPrevented}function we(e){return n=>{for(let t of e)ce(n,t)}}function zl(e){return Kn()?e.metaKey&&!e.ctrlKey:e.ctrlKey&&!e.metaKey}function Te(e){if(e)if(Rl())e.focus({preventScroll:!0});else{let n=Kl(e);e.focus(),Bl(n)}}var An=null;function Rl(){if(An==null){An=!1;try{document.createElement("div").focus({get preventScroll(){return An=!0,!0}})}catch{}}return An}function Kl(e){let n=e.parentNode,t=[],r=document.scrollingElement||document.documentElement;for(;n instanceof HTMLElement&&n!==r;)(n.offsetHeight<n.scrollHeight||n.offsetWidth<n.scrollWidth)&&t.push({element:n,scrollTop:n.scrollTop,scrollLeft:n.scrollLeft}),n=n.parentNode;return r instanceof HTMLElement&&t.push({element:r,scrollTop:r.scrollTop,scrollLeft:r.scrollLeft}),t}function Bl(e){for(let{element:n,scrollTop:t,scrollLeft:r}of e)n.scrollTop=t,n.scrollLeft=r}var mi=["input:not([type='hidden']):not([disabled])","select:not([disabled])","textarea:not([disabled])","button:not([disabled])","a[href]","area[href]","[tabindex]","iframe","object","embed","audio[controls]","video[controls]","[contenteditable]:not([contenteditable='false'])"],Nl=[...mi,'[tabindex]:not([tabindex="-1"]):not([disabled])'],mr=mi.join(":not([hidden]),")+",[tabindex]:not([disabled]):not([hidden])",Ul=Nl.join(':not([hidden]):not([tabindex="-1"]),');function bi(e,n){let r=Array.from(e.querySelectorAll(mr)).filter(Mo);return n&&Mo(e)&&r.unshift(e),r.forEach((o,s)=>{if(yi(o)&&o.contentDocument){let l=o.contentDocument.body,a=bi(l,!1);r.splice(s,1,...a)}}),r}function Mo(e){return xi(e)&&!Gl(e)}function xi(e){return e.matches(mr)&&br(e)}function Gl(e){return parseInt(e.getAttribute("tabindex")||"0",10)<0}function br(e,n){return e.nodeName!=="#comment"&&Vl(e)&&Hl(e,n)&&(!e.parentElement||br(e.parentElement,e))}function Vl(e){if(!(e instanceof HTMLElement)&&!(e instanceof SVGElement))return!1;let{display:n,visibility:t}=e.style,r=n!=="none"&&t!=="hidden"&&t!=="collapse";if(r){if(!e.ownerDocument.defaultView)return r;let{getComputedStyle:o}=e.ownerDocument.defaultView,{display:s,visibility:l}=o(e);r=s!=="none"&&l!=="hidden"&&l!=="collapse"}return r}function Hl(e,n){return!e.hasAttribute("hidden")&&(e.nodeName==="DETAILS"&&n&&n.nodeName!=="SUMMARY"?e.hasAttribute("open"):!0)}function jl(e,n,t){let r=n?.tabbable?Ul:mr,o=document.createTreeWalker(e,NodeFilter.SHOW_ELEMENT,{acceptNode(s){return n?.from?.contains(s)?NodeFilter.FILTER_REJECT:s.matches(r)&&br(s)&&(!n?.accept||n.accept(s))?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP}});return n?.from&&(o.currentNode=n.from),o}function To(e){for(;e&&!Wl(e);)e=e.parentElement;return e||document.scrollingElement||document.documentElement}function Wl(e){let n=window.getComputedStyle(e);return/(auto|scroll)/.test(n.overflow+n.overflowX+n.overflowY)}function Ql(){}function Yl(e,n){let[t,r]=e,o=!1,s=n.length;for(let l=s,a=0,i=l-1;a<l;i=a++){let[c,d]=n[a],[u,g]=n[i],[,f]=n[i===0?l-1:i-1]||[0,0],h=(d-g)*(t-c)-(c-u)*(r-d);if(g<d){if(r>=g&&r<d){if(h===0)return!0;h>0&&(r===g?r>f&&(o=!o):o=!o)}}else if(d<g){if(r>d&&r<=g){if(h===0)return!0;h<0&&(r===g?r<f&&(o=!o):o=!o)}}else if(r==d&&(t>=u&&t<=c||t>=c&&t<=u))return!0}return o}function Q(e,n){return j(e,n)}var rn=new Map,Ao=new Set;function Io(){if(typeof window>"u")return;let e=t=>{if(!t.target)return;let r=rn.get(t.target);r||(r=new Set,rn.set(t.target,r),t.target.addEventListener("transitioncancel",n)),r.add(t.propertyName)},n=t=>{if(!t.target)return;let r=rn.get(t.target);if(r&&(r.delete(t.propertyName),r.size===0&&(t.target.removeEventListener("transitioncancel",n),rn.delete(t.target)),rn.size===0)){for(let o of Ao)o();Ao.clear()}};document.body.addEventListener("transitionrun",e),document.body.addEventListener("transitionend",n)}typeof document<"u"&&(document.readyState!=="loading"?Io():document.addEventListener("DOMContentLoaded",Io));function lr(e,n){let t=Do(e,n,"left"),r=Do(e,n,"top"),o=n.offsetWidth,s=n.offsetHeight,l=e.scrollLeft,a=e.scrollTop,i=l+e.offsetWidth,c=a+e.offsetHeight;t<=l?l=t:t+o>i&&(l+=t+o-i),r<=a?a=r:r+s>c&&(a+=r+s-c),e.scrollLeft=l,e.scrollTop=a}function Do(e,n,t){let r=t==="left"?"offsetLeft":"offsetTop",o=0;for(;n.offsetParent&&(o+=n[r],n.offsetParent!==e);){if(n.offsetParent.contains(e)){o-=e[r];break}n=n.offsetParent}return o}function Xl(e,n){if(document.contains(e)){let t=document.scrollingElement||document.documentElement;if(window.getComputedStyle(t).overflow==="hidden"){let o=To(e);for(;e&&o&&e!==t&&o!==t;)lr(o,e),e=o,o=To(e)}else{let{left:o,top:s}=e.getBoundingClientRect();e?.scrollIntoView?.({block:"nearest"});let{left:l,top:a}=e.getBoundingClientRect();(Math.abs(o-l)>1||Math.abs(s-a)>1)&&e.scrollIntoView?.({block:"nearest"})}}}var wi={border:"0",clip:"rect(0 0 0 0)","clip-path":"inset(50%)",height:"1px",margin:"0 -1px -1px 0",overflow:"hidden",padding:"0",position:"absolute",width:"1px","white-space":"nowrap"};function Ge(e){return n=>(e(n),()=>e(void 0))}function Bn(e,n){let[t,r]=z(Po(n?.()));return B(()=>{r(e()?.tagName.toLowerCase()||Po(n?.()))}),t}function Po(e){return Ut(e)?e:void 0}function ue(e){let[n,t]=J(e,["as"]);if(!n.as)throw new Error("[kobalte]: Polymorphic is missing the required `as` prop.");return p(lo,j(t,{get component(){return n.as}}))}var Zl=["id","name","validationState","required","disabled","readOnly"];function Jl(e){let n=`form-control-${qe()}`,t=Q({id:n},e),[r,o]=z(),[s,l]=z(),[a,i]=z(),[c,d]=z(),u=(v,y,m)=>{let b=m!=null||r()!=null;return[m,r(),b&&y!=null?v:void 0].filter(Boolean).join(" ")||void 0},g=v=>[a(),c(),v].filter(Boolean).join(" ")||void 0,f=M(()=>({"data-valid":E(t.validationState)==="valid"?"":void 0,"data-invalid":E(t.validationState)==="invalid"?"":void 0,"data-required":E(t.required)?"":void 0,"data-disabled":E(t.disabled)?"":void 0,"data-readonly":E(t.readOnly)?"":void 0}));return{formControlContext:{name:()=>E(t.name)??E(t.id),dataset:f,validationState:()=>E(t.validationState),isRequired:()=>E(t.required),isDisabled:()=>E(t.disabled),isReadOnly:()=>E(t.readOnly),labelId:r,fieldId:s,descriptionId:a,errorMessageId:c,getAriaLabelledBy:u,getAriaDescribedBy:g,generateId:vn(()=>E(t.id)),registerLabel:Ge(o),registerField:Ge(l),registerDescription:Ge(i),registerErrorMessage:Ge(d)}}}var $i=be();function pn(){let e=xe($i);if(e===void 0)throw new Error("[kobalte]: `useFormControlContext` must be used within a `FormControlContext.Provider` component");return e}function Ci(e){let n=pn(),t=Q({id:n.generateId("description")},e);return B(()=>U(n.registerDescription(t.id))),p(ue,j({as:"div"},()=>n.dataset(),t))}function Si(e){let n=pn(),t=Q({id:n.generateId("error-message")},e),[r,o]=J(t,["forceMount"]),s=()=>n.validationState()==="invalid";return B(()=>{s()&&U(n.registerErrorMessage(o.id))}),p(K,{get when(){return r.forceMount||s()},get children(){return p(ue,j({as:"div"},()=>n.dataset(),o))}})}function ea(e){let n,t=pn(),r=Q({id:t.generateId("label")},e),[o,s]=J(r,["ref"]),l=Bn(()=>n,()=>"label");return B(()=>U(t.registerLabel(s.id))),p(ue,j({as:"label",ref(a){let i=De(c=>n=c,o.ref);typeof i=="function"&&i(a)},get for(){return M(()=>l()==="label")()?t.fieldId():void 0}},()=>t.dataset(),s))}function ta(e,n){B(et(e,t=>{if(t==null)return;let r=na(t);r!=null&&(r.addEventListener("reset",n,{passive:!0}),U(()=>{r.removeEventListener("reset",n)}))}))}function na(e){return ra(e)?e.form:e.closest("form")}function ra(e){return e.matches("textarea, input, select, button")}function yn(e){let[n,t]=z(e.defaultValue?.()),r=M(()=>e.value?.()!==void 0),o=M(()=>r()?e.value?.():n());return[o,l=>{Dt(()=>{let a=js(l,o());return Object.is(a,o())||(r()||t(a),e.onChange?.(a)),a})}]}function ki(e){let[n,t]=yn(e);return[()=>n()??!1,t]}function oa(e){let[n,t]=yn(e);return[()=>n()??[],t]}function ia(e={}){let[n,t]=ki({value:()=>E(e.isSelected),defaultValue:()=>!!E(e.defaultIsSelected),onChange:s=>e.onSelectedChange?.(s)});return{isSelected:n,setIsSelected:s=>{!E(e.isReadOnly)&&!E(e.isDisabled)&&t(s)},toggle:()=>{!E(e.isReadOnly)&&!E(e.isDisabled)&&t(!n())}}}var sa=Object.defineProperty,Nn=(e,n)=>{for(var t in n)sa(e,t,{get:n[t],enumerable:!0})},Ei=be();function Mi(){return xe(Ei)}function la(){let e=Mi();if(e===void 0)throw new Error("[kobalte]: `useDomCollectionContext` must be used within a `DomCollectionProvider` component");return e}function Ti(e,n){return!!(n.compareDocumentPosition(e)&Node.DOCUMENT_POSITION_PRECEDING)}function aa(e,n){let t=n.ref();if(!t)return-1;let r=e.length;if(!r)return-1;for(;r--;){let o=e[r]?.ref();if(o&&Ti(o,t))return r+1}return 0}function ca(e){let n=e.map((r,o)=>[o,r]),t=!1;return n.sort(([r,o],[s,l])=>{let a=o.ref(),i=l.ref();return a===i||!a||!i?0:Ti(a,i)?(r>s&&(t=!0),-1):(r<s&&(t=!0),1)}),t?n.map(([r,o])=>o):e}function Ai(e,n){let t=ca(e);e!==t&&n(t)}function ua(e){let n=e[0],t=e[e.length-1]?.ref(),r=n?.ref()?.parentElement;for(;r;){if(t&&r.contains(t))return r;r=r.parentElement}return rt(r).body}function da(e,n){B(()=>{let t=setTimeout(()=>{Ai(e(),n)});U(()=>clearTimeout(t))})}function fa(e,n){if(typeof IntersectionObserver!="function"){da(e,n);return}let t=[];B(()=>{let r=()=>{let l=!!t.length;t=e(),l&&Ai(e(),n)},o=ua(e()),s=new IntersectionObserver(r,{root:o});for(let l of e()){let a=l.ref();a&&s.observe(a)}U(()=>s.disconnect())})}function ga(e={}){let[n,t]=oa({value:()=>E(e.items),onChange:s=>e.onItemsChange?.(s)});fa(n,t);let r=s=>(t(l=>{let a=aa(l,s);return Il(l,s,a)}),()=>{t(l=>{let a=l.filter(i=>i.ref()!==s.ref());return l.length===a.length?l:a})});return{DomCollectionProvider:s=>p(Ei.Provider,{value:{registerItem:r},get children(){return s.children}})}}function ha(e){let n=la(),t=Q({shouldRegisterItem:!0},e);B(()=>{if(!t.shouldRegisterItem)return;let r=n.registerItem(t.getItem());U(r)})}function Ii(e){let n=e.startIndex??0,t=e.startLevel??0,r=[],o=i=>{if(i==null)return"";let c=e.getKey??"key",d=Ut(c)?i[c]:c(i);return d!=null?String(d):""},s=i=>{if(i==null)return"";let c=e.getTextValue??"textValue",d=Ut(c)?i[c]:c(i);return d!=null?String(d):""},l=i=>{if(i==null)return!1;let c=e.getDisabled??"disabled";return(Ut(c)?i[c]:c(i))??!1},a=i=>{if(i!=null)return Ut(e.getSectionChildren)?i[e.getSectionChildren]:e.getSectionChildren?.(i)};for(let i of e.dataSource){if(Ut(i)||Dl(i)){r.push({type:"item",rawValue:i,key:String(i),textValue:String(i),disabled:l(i),level:t,index:n}),n++;continue}if(a(i)!=null){r.push({type:"section",rawValue:i,key:"",textValue:"",disabled:!1,level:t,index:n}),n++;let c=a(i)??[];if(c.length>0){let d=Ii({dataSource:c,getKey:e.getKey,getTextValue:e.getTextValue,getDisabled:e.getDisabled,getSectionChildren:e.getSectionChildren,startIndex:n,startLevel:t+1});r.push(...d),n+=d.length}}else r.push({type:"item",rawValue:i,key:o(i),textValue:s(i),disabled:l(i),level:t,index:n}),n++}return r}function va(e,n=[]){return M(()=>{let t=Ii({dataSource:E(e.dataSource),getKey:E(e.getKey),getTextValue:E(e.getTextValue),getDisabled:E(e.getDisabled),getSectionChildren:E(e.getSectionChildren)});for(let r=0;r<n.length;r++)n[r]();return e.factory(t)})}var pa=new Set(["Avst","Arab","Armi","Syrc","Samr","Mand","Thaa","Mend","Nkoo","Adlm","Rohg","Hebr"]),ya=new Set(["ae","ar","arc","bcc","bqi","ckb","dv","fa","glk","he","ku","mzn","nqo","pnb","ps","sd","ug","ur","yi"]);function ma(e){if(Intl.Locale){let t=new Intl.Locale(e).maximize().script??"";return pa.has(t)}let n=e.split("-")[0];return ya.has(n)}function ba(e){return ma(e)?"rtl":"ltr"}function Di(){let e=typeof navigator<"u"&&(navigator.language||navigator.userLanguage)||"en-US";return{locale:e,direction:ba(e)}}var ar=Di(),cn=new Set;function qo(){ar=Di();for(let e of cn)e(ar)}function xa(){let e={locale:"en-US",direction:"ltr"},[n,t]=z(ar),r=M(()=>Ee?e:n());return ft(()=>{cn.size===0&&window.addEventListener("languagechange",qo),cn.add(t),U(()=>{cn.delete(t),cn.size===0&&window.removeEventListener("languagechange",qo)})}),{locale:()=>r().locale,direction:()=>r().direction}}var wa=be();function Mt(){let e=xa();return xe(wa)||e}var Jn=new Map;function $a(e){let{locale:n}=Mt(),t=M(()=>n()+(e?Object.entries(e).sort((r,o)=>r[0]<o[0]?-1:1).join():""));return M(()=>{let r=t(),o;return Jn.has(r)&&(o=Jn.get(r)),o||(o=new Intl.Collator(n(),e),Jn.set(r,o)),o})}var ht=class Pi extends Set{anchorKey;currentKey;constructor(n,t,r){super(n),n instanceof Pi?(this.anchorKey=t||n.anchorKey,this.currentKey=r||n.currentKey):(this.anchorKey=t,this.currentKey=r)}};function Ca(e){let[n,t]=yn(e);return[()=>n()??new ht,t]}function qi(e){return _l()?e.altKey:e.ctrlKey}function Gt(e){return Kn()?e.metaKey:e.ctrlKey}function Oo(e){return new ht(e)}function Sa(e,n){if(e.size!==n.size)return!1;for(let t of e)if(!n.has(t))return!1;return!0}function ka(e){let n=Q({selectionMode:"none",selectionBehavior:"toggle"},e),[t,r]=z(!1),[o,s]=z(),l=M(()=>{let v=E(n.selectedKeys);return v!=null?Oo(v):v}),a=M(()=>{let v=E(n.defaultSelectedKeys);return v!=null?Oo(v):new ht}),[i,c]=Ca({value:l,defaultValue:a,onChange:v=>n.onSelectionChange?.(v)}),[d,u]=z(E(n.selectionBehavior)),g=()=>E(n.selectionMode),f=()=>E(n.disallowEmptySelection)??!1,h=v=>{(E(n.allowDuplicateSelectionEvents)||!Sa(v,i()))&&c(v)};return B(()=>{let v=i();E(n.selectionBehavior)==="replace"&&d()==="toggle"&&typeof v=="object"&&v.size===0&&u("replace")}),B(()=>{u(E(n.selectionBehavior)??"toggle")}),{selectionMode:g,disallowEmptySelection:f,selectionBehavior:d,setSelectionBehavior:u,isFocused:t,setFocused:r,focusedKey:o,setFocusedKey:s,selectedKeys:i,setSelectedKeys:h}}function Ea(e){let[n,t]=z(""),[r,o]=z(-1);return{typeSelectHandlers:{onKeyDown:l=>{if(E(e.isDisabled))return;let a=E(e.keyboardDelegate),i=E(e.selectionManager);if(!a.getKeyForSearch)return;let c=Ma(l.key);if(!c||l.ctrlKey||l.metaKey)return;c===" "&&n().trim().length>0&&(l.preventDefault(),l.stopPropagation());let d=t(g=>g+c),u=a.getKeyForSearch(d,i.focusedKey())??a.getKeyForSearch(d);u==null&&Ta(d)&&(d=d[0],u=a.getKeyForSearch(d,i.focusedKey())??a.getKeyForSearch(d)),u!=null&&(i.setFocusedKey(u),e.onTypeSelect?.(u)),clearTimeout(r()),o(window.setTimeout(()=>t(""),500))}}}}function Ma(e){return e.length===1||!/^[A-Z]/i.test(e)?e:""}function Ta(e){return e.split("").every(n=>n===e[0])}function Aa(e,n,t){let o=j({selectOnFocus:()=>E(e.selectionManager).selectionBehavior()==="replace"},e),s=()=>n(),{direction:l}=Mt(),a={top:0,left:0};Ml(()=>E(o.isVirtualized)?void 0:s(),"scroll",()=>{let y=s();y&&(a={top:y.scrollTop,left:y.scrollLeft})});let{typeSelectHandlers:i}=Ea({isDisabled:()=>E(o.disallowTypeAhead),keyboardDelegate:()=>E(o.keyboardDelegate),selectionManager:()=>E(o.selectionManager)}),c=()=>E(o.orientation)??"vertical",d=y=>{ce(y,i.onKeyDown),y.altKey&&y.key==="Tab"&&y.preventDefault();let m=n();if(!m?.contains(y.target))return;let b=E(o.selectionManager),x=E(o.selectOnFocus),w=P=>{P!=null&&(b.setFocusedKey(P),y.shiftKey&&b.selectionMode()==="multiple"?b.extendSelection(P):x&&!qi(y)&&b.replaceSelection(P))},$=E(o.keyboardDelegate),F=E(o.shouldFocusWrap),D=b.focusedKey();switch(y.key){case(c()==="vertical"?"ArrowDown":"ArrowRight"):{if($.getKeyBelow){y.preventDefault();let P;D!=null?P=$.getKeyBelow(D):P=$.getFirstKey?.(),P==null&&F&&(P=$.getFirstKey?.(D)),w(P)}break}case(c()==="vertical"?"ArrowUp":"ArrowLeft"):{if($.getKeyAbove){y.preventDefault();let P;D!=null?P=$.getKeyAbove(D):P=$.getLastKey?.(),P==null&&F&&(P=$.getLastKey?.(D)),w(P)}break}case(c()==="vertical"?"ArrowLeft":"ArrowUp"):{if($.getKeyLeftOf){y.preventDefault();let P=l()==="rtl",C;D!=null?C=$.getKeyLeftOf(D):C=P?$.getFirstKey?.():$.getLastKey?.(),w(C)}break}case(c()==="vertical"?"ArrowRight":"ArrowDown"):{if($.getKeyRightOf){y.preventDefault();let P=l()==="rtl",C;D!=null?C=$.getKeyRightOf(D):C=P?$.getLastKey?.():$.getFirstKey?.(),w(C)}break}case"Home":if($.getFirstKey){y.preventDefault();let P=$.getFirstKey(D,Gt(y));P!=null&&(b.setFocusedKey(P),Gt(y)&&y.shiftKey&&b.selectionMode()==="multiple"?b.extendSelection(P):x&&b.replaceSelection(P))}break;case"End":if($.getLastKey){y.preventDefault();let P=$.getLastKey(D,Gt(y));P!=null&&(b.setFocusedKey(P),Gt(y)&&y.shiftKey&&b.selectionMode()==="multiple"?b.extendSelection(P):x&&b.replaceSelection(P))}break;case"PageDown":if($.getKeyPageBelow&&D!=null){y.preventDefault();let P=$.getKeyPageBelow(D);w(P)}break;case"PageUp":if($.getKeyPageAbove&&D!=null){y.preventDefault();let P=$.getKeyPageAbove(D);w(P)}break;case"a":Gt(y)&&b.selectionMode()==="multiple"&&E(o.disallowSelectAll)!==!0&&(y.preventDefault(),b.selectAll());break;case"Escape":y.defaultPrevented||(y.preventDefault(),E(o.disallowEmptySelection)||b.clearSelection());break;case"Tab":if(!E(o.allowsTabNavigation)){if(y.shiftKey)m.focus();else{let P=jl(m,{tabbable:!0}),C,O;do O=P.lastChild(),O&&(C=O);while(O);C&&!C.contains(document.activeElement)&&Te(C)}break}}},u=y=>{let m=E(o.selectionManager),b=E(o.keyboardDelegate),x=E(o.selectOnFocus);if(m.isFocused()){y.currentTarget.contains(y.target)||m.setFocused(!1);return}if(y.currentTarget.contains(y.target)){if(m.setFocused(!0),m.focusedKey()==null){let w=F=>{F!=null&&(m.setFocusedKey(F),x&&m.replaceSelection(F))},$=y.relatedTarget;$&&y.currentTarget.compareDocumentPosition($)&Node.DOCUMENT_POSITION_FOLLOWING?w(m.lastSelectedKey()??b.getLastKey?.()):w(m.firstSelectedKey()??b.getFirstKey?.())}else if(!E(o.isVirtualized)){let w=s();if(w){w.scrollTop=a.top,w.scrollLeft=a.left;let $=w.querySelector(`[data-key="${m.focusedKey()}"]`);$&&(Te($),lr(w,$))}}}},g=y=>{let m=E(o.selectionManager);y.currentTarget.contains(y.relatedTarget)||m.setFocused(!1)},f=y=>{s()===y.target&&y.preventDefault()},h=()=>{let y=E(o.autoFocus);if(!y)return;let m=E(o.selectionManager),b=E(o.keyboardDelegate),x;y==="first"&&(x=b.getFirstKey?.()),y==="last"&&(x=b.getLastKey?.());let w=m.selectedKeys();w.size&&(x=w.values().next().value),m.setFocused(!0),m.setFocusedKey(x);let $=n();$&&x==null&&!E(o.shouldUseVirtualFocus)&&Te($)};return ft(()=>{o.deferAutoFocus?setTimeout(h,0):h()}),B(et([s,()=>E(o.isVirtualized),()=>E(o.selectionManager).focusedKey()],y=>{let[m,b,x]=y;if(b)x&&o.scrollToKey?.(x);else if(x&&m){let w=m.querySelector(`[data-key="${x}"]`);w&&lr(m,w)}})),{tabIndex:M(()=>{if(!E(o.shouldUseVirtualFocus))return E(o.selectionManager).focusedKey()==null?0:-1}),onKeyDown:d,onMouseDown:f,onFocusIn:u,onFocusOut:g}}function Oi(e,n){let t=()=>E(e.selectionManager),r=()=>E(e.key),o=()=>E(e.shouldUseVirtualFocus),s=b=>{t().selectionMode()!=="none"&&(t().selectionMode()==="single"?t().isSelected(r())&&!t().disallowEmptySelection()?t().toggleSelection(r()):t().replaceSelection(r()):b?.shiftKey?t().extendSelection(r()):t().selectionBehavior()==="toggle"||Gt(b)||"pointerType"in b&&b.pointerType==="touch"?t().toggleSelection(r()):t().replaceSelection(r()))},l=()=>t().isSelected(r()),a=()=>E(e.disabled)||t().isDisabled(r()),i=()=>!a()&&t().canSelectItem(r()),c=null,d=b=>{i()&&(c=b.pointerType,b.pointerType==="mouse"&&b.button===0&&!E(e.shouldSelectOnPressUp)&&s(b))},u=b=>{i()&&b.pointerType==="mouse"&&b.button===0&&E(e.shouldSelectOnPressUp)&&E(e.allowsDifferentPressOrigin)&&s(b)},g=b=>{i()&&(E(e.shouldSelectOnPressUp)&&!E(e.allowsDifferentPressOrigin)||c!=="mouse")&&s(b)},f=b=>{!i()||!["Enter"," "].includes(b.key)||(qi(b)?t().toggleSelection(r()):s(b))},h=b=>{a()&&b.preventDefault()},v=b=>{let x=n();o()||a()||!x||b.target===x&&t().setFocusedKey(r())},y=M(()=>{if(!(o()||a()))return r()===t().focusedKey()?0:-1}),m=M(()=>E(e.virtualized)?void 0:r());return B(et([n,r,o,()=>t().focusedKey(),()=>t().isFocused()],([b,x,w,$,F])=>{b&&x===$&&F&&!w&&document.activeElement!==b&&(e.focus?e.focus():Te(b))})),{isSelected:l,isDisabled:a,allowsSelection:i,tabIndex:y,dataKey:m,onPointerDown:d,onPointerUp:u,onClick:g,onKeyDown:f,onMouseDown:h,onFocus:v}}var Ia=class{collection;state;constructor(e,n){this.collection=e,this.state=n}selectionMode(){return this.state.selectionMode()}disallowEmptySelection(){return this.state.disallowEmptySelection()}selectionBehavior(){return this.state.selectionBehavior()}setSelectionBehavior(e){this.state.setSelectionBehavior(e)}isFocused(){return this.state.isFocused()}setFocused(e){this.state.setFocused(e)}focusedKey(){return this.state.focusedKey()}setFocusedKey(e){(e==null||this.collection().getItem(e))&&this.state.setFocusedKey(e)}selectedKeys(){return this.state.selectedKeys()}isSelected(e){if(this.state.selectionMode()==="none")return!1;let n=this.getKey(e);return n==null?!1:this.state.selectedKeys().has(n)}isEmpty(){return this.state.selectedKeys().size===0}isSelectAll(){if(this.isEmpty())return!1;let e=this.state.selectedKeys();return this.getAllSelectableKeys().every(n=>e.has(n))}firstSelectedKey(){let e;for(let n of this.state.selectedKeys()){let t=this.collection().getItem(n),r=t?.index!=null&&e?.index!=null&&t.index<e.index;(!e||r)&&(e=t)}return e?.key}lastSelectedKey(){let e;for(let n of this.state.selectedKeys()){let t=this.collection().getItem(n),r=t?.index!=null&&e?.index!=null&&t.index>e.index;(!e||r)&&(e=t)}return e?.key}extendSelection(e){if(this.selectionMode()==="none")return;if(this.selectionMode()==="single"){this.replaceSelection(e);return}let n=this.getKey(e);if(n==null)return;let t=this.state.selectedKeys(),r=t.anchorKey||n,o=new ht(t,r,n);for(let s of this.getKeyRange(r,t.currentKey||n))o.delete(s);for(let s of this.getKeyRange(n,r))this.canSelectItem(s)&&o.add(s);this.state.setSelectedKeys(o)}getKeyRange(e,n){let t=this.collection().getItem(e),r=this.collection().getItem(n);return t&&r?t.index!=null&&r.index!=null&&t.index<=r.index?this.getKeyRangeInternal(e,n):this.getKeyRangeInternal(n,e):[]}getKeyRangeInternal(e,n){let t=[],r=e;for(;r!=null;){let o=this.collection().getItem(r);if(o&&o.type==="item"&&t.push(r),r===n)return t;r=this.collection().getKeyAfter(r)}return[]}getKey(e){let n=this.collection().getItem(e);return n?!n||n.type!=="item"?null:n.key:e}toggleSelection(e){if(this.selectionMode()==="none")return;if(this.selectionMode()==="single"&&!this.isSelected(e)){this.replaceSelection(e);return}let n=this.getKey(e);if(n==null)return;let t=new ht(this.state.selectedKeys());t.has(n)?t.delete(n):this.canSelectItem(n)&&(t.add(n),t.anchorKey=n,t.currentKey=n),!(this.disallowEmptySelection()&&t.size===0)&&this.state.setSelectedKeys(t)}replaceSelection(e){if(this.selectionMode()==="none")return;let n=this.getKey(e);if(n==null)return;let t=this.canSelectItem(n)?new ht([n],n,n):new ht;this.state.setSelectedKeys(t)}setSelectedKeys(e){if(this.selectionMode()==="none")return;let n=new ht;for(let t of e){let r=this.getKey(t);if(r!=null&&(n.add(r),this.selectionMode()==="single"))break}this.state.setSelectedKeys(n)}selectAll(){this.selectionMode()==="multiple"&&this.state.setSelectedKeys(new Set(this.getAllSelectableKeys()))}clearSelection(){let e=this.state.selectedKeys();!this.disallowEmptySelection()&&e.size>0&&this.state.setSelectedKeys(new ht)}toggleSelectAll(){this.isSelectAll()?this.clearSelection():this.selectAll()}select(e,n){this.selectionMode()!=="none"&&(this.selectionMode()==="single"?this.isSelected(e)&&!this.disallowEmptySelection()?this.toggleSelection(e):this.replaceSelection(e):this.selectionBehavior()==="toggle"||n&&n.pointerType==="touch"?this.toggleSelection(e):this.replaceSelection(e))}isSelectionEqual(e){if(e===this.state.selectedKeys())return!0;let n=this.selectedKeys();if(e.size!==n.size)return!1;for(let t of e)if(!n.has(t))return!1;for(let t of n)if(!e.has(t))return!1;return!0}canSelectItem(e){if(this.state.selectionMode()==="none")return!1;let n=this.collection().getItem(e);return n!=null&&!n.disabled}isDisabled(e){let n=this.collection().getItem(e);return!n||n.disabled}getAllSelectableKeys(){let e=[];return(t=>{for(;t!=null;){if(this.canSelectItem(t)){let r=this.collection().getItem(t);if(!r)continue;r.type==="item"&&e.push(t)}t=this.collection().getKeyAfter(t)}})(this.collection().getFirstKey()),e}},Lo=class{keyMap=new Map;iterable;firstKey;lastKey;constructor(e){this.iterable=e;for(let r of e)this.keyMap.set(r.key,r);if(this.keyMap.size===0)return;let n,t=0;for(let[r,o]of this.keyMap)n?(n.nextKey=r,o.prevKey=n.key):(this.firstKey=r,o.prevKey=void 0),o.type==="item"&&(o.index=t++),n=o,n.nextKey=void 0;this.lastKey=n.key}*[Symbol.iterator](){yield*Qr(this.iterable)}getSize(){return this.keyMap.size}getKeys(){return this.keyMap.keys()}getKeyBefore(e){return this.keyMap.get(e)?.prevKey}getKeyAfter(e){return this.keyMap.get(e)?.nextKey}getFirstKey(){return this.firstKey}getLastKey(){return this.lastKey}getItem(e){return this.keyMap.get(e)}at(e){let n=[...this.getKeys()];return this.getItem(n[e])}};function Da(e){let n=ka(e),r=va({dataSource:()=>E(e.dataSource),getKey:()=>E(e.getKey),getTextValue:()=>E(e.getTextValue),getDisabled:()=>E(e.getDisabled),getSectionChildren:()=>E(e.getSectionChildren),factory:s=>e.filter?new Lo(e.filter(s)):new Lo(s)},[()=>e.filter]),o=new Ia(r,n);return Yr(()=>{let s=n.focusedKey();s!=null&&!r().getItem(s)&&n.setFocusedKey(void 0)}),{collection:r,selectionManager:()=>o}}var Me=e=>typeof e=="function"?e():e,Pa=e=>{let n=M(()=>{let l=Me(e.element);if(l)return getComputedStyle(l)}),t=()=>n()?.animationName??"none",[r,o]=z(Me(e.show)?"present":"hidden"),s="none";return B(l=>{let a=Me(e.show);return Dt(()=>{if(l===a)return a;let i=s,c=t();a?o("present"):c==="none"||n()?.display==="none"?o("hidden"):o(l===!0&&i!==c?"hiding":"hidden")}),a}),B(()=>{let l=Me(e.element);if(!l)return;let a=c=>{c.target===l&&(s=t())},i=c=>{let u=t().includes(c.animationName);c.target===l&&u&&r()==="hiding"&&o("hidden")};l.addEventListener("animationstart",a),l.addEventListener("animationcancel",i),l.addEventListener("animationend",i),U(()=>{l.removeEventListener("animationstart",a),l.removeEventListener("animationcancel",i),l.removeEventListener("animationend",i)})}),{present:()=>r()==="present"||r()==="hiding",state:r}},qa=Pa,Li=qa,qn="data-kb-top-layer",Fi,cr=!1,pt=[];function dn(e){return pt.findIndex(n=>n.node===e)}function Oa(e){return pt[dn(e)]}function La(e){return pt[pt.length-1].node===e}function _i(){return pt.filter(e=>e.isPointerBlocking)}function Fa(){return[..._i()].slice(-1)[0]}function xr(){return _i().length>0}function zi(e){let n=dn(Fa()?.node);return dn(e)<n}function _a(e){pt.push(e)}function za(e){let n=dn(e);n<0||pt.splice(n,1)}function Ra(){for(let{node:e}of pt)e.style.pointerEvents=zi(e)?"none":"auto"}function Ka(e){if(xr()&&!cr){let n=rt(e);Fi=document.body.style.pointerEvents,n.body.style.pointerEvents="none",cr=!0}}function Ba(e){if(xr())return;let n=rt(e);n.body.style.pointerEvents=Fi,n.body.style.length===0&&n.body.removeAttribute("style"),cr=!1}var Oe={layers:pt,isTopMostLayer:La,hasPointerBlockingLayer:xr,isBelowPointerBlockingLayer:zi,addLayer:_a,removeLayer:za,indexOf:dn,find:Oa,assignPointerEventToLayers:Ra,disableBodyPointerEvents:Ka,restoreBodyPointerEvents:Ba},Na={};Nn(Na,{Button:()=>Va,Root:()=>wr});var Ua=["button","color","file","image","reset","submit"];function Ga(e){let n=e.tagName.toLowerCase();return n==="button"?!0:n==="input"&&e.type?Ua.indexOf(e.type)!==-1:!1}function wr(e){let n,t=Q({type:"button"},e),[r,o]=J(t,["ref","type","disabled"]),s=Bn(()=>n,()=>"button"),l=M(()=>{let c=s();return c==null?!1:Ga({tagName:c,type:r.type})}),a=M(()=>s()==="input"),i=M(()=>s()==="a"&&n?.getAttribute("href")!=null);return p(ue,j({as:"button",ref(c){let d=De(u=>n=u,r.ref);typeof d=="function"&&d(c)},get type(){return l()||a()?r.type:void 0},get role(){return!l()&&!i()?"button":void 0},get tabIndex(){return!l()&&!i()&&!r.disabled?0:void 0},get disabled(){return l()||a()?r.disabled:void 0},get"aria-disabled"(){return!l()&&!a()&&r.disabled?!0:void 0},get"data-disabled"(){return r.disabled?"":void 0}},o))}var Va=wr,Ha=["top","right","bottom","left"],nt=Math.min,Fe=Math.max,On=Math.round,In=Math.floor,St=e=>({x:e,y:e}),ja={left:"right",right:"left",bottom:"top",top:"bottom"},Wa={start:"end",end:"start"};function ur(e,n,t){return Fe(e,nt(n,t))}function zt(e,n){return typeof e=="function"?e(n):e}function kt(e){return e.split("-")[0]}function jt(e){return e.split("-")[1]}function Ri(e){return e==="x"?"y":"x"}function $r(e){return e==="y"?"height":"width"}function Ft(e){return["top","bottom"].includes(kt(e))?"y":"x"}function Cr(e){return Ri(Ft(e))}function Qa(e,n,t){t===void 0&&(t=!1);let r=jt(e),o=Cr(e),s=$r(o),l=o==="x"?r===(t?"end":"start")?"right":"left":r==="start"?"bottom":"top";return n.reference[s]>n.floating[s]&&(l=Ln(l)),[l,Ln(l)]}function Ya(e){let n=Ln(e);return[dr(e),n,dr(n)]}function dr(e){return e.replace(/start|end/g,n=>Wa[n])}function Xa(e,n,t){let r=["left","right"],o=["right","left"],s=["top","bottom"],l=["bottom","top"];switch(e){case"top":case"bottom":return t?n?o:r:n?r:o;case"left":case"right":return n?s:l;default:return[]}}function Za(e,n,t,r){let o=jt(e),s=Xa(kt(e),t==="start",r);return o&&(s=s.map(l=>l+"-"+o),n&&(s=s.concat(s.map(dr)))),s}function Ln(e){return e.replace(/left|right|bottom|top/g,n=>ja[n])}function Ja(e){return X({top:0,right:0,bottom:0,left:0},e)}function Ki(e){return typeof e!="number"?Ja(e):{top:e,right:e,bottom:e,left:e}}function Fn(e){let{x:n,y:t,width:r,height:o}=e;return{width:r,height:o,top:t,left:n,right:n+r,bottom:t+o,x:n,y:t}}function Fo(e,n,t){let{reference:r,floating:o}=e,s=Ft(n),l=Cr(n),a=$r(l),i=kt(n),c=s==="y",d=r.x+r.width/2-o.width/2,u=r.y+r.height/2-o.height/2,g=r[a]/2-o[a]/2,f;switch(i){case"top":f={x:d,y:r.y-o.height};break;case"bottom":f={x:d,y:r.y+r.height};break;case"right":f={x:r.x+r.width,y:u};break;case"left":f={x:r.x-o.width,y:u};break;default:f={x:r.x,y:r.y}}switch(jt(n)){case"start":f[l]-=g*(t&&c?-1:1);break;case"end":f[l]+=g*(t&&c?-1:1);break}return f}var ec=(e,n,t)=>Re(null,null,function*(){let{placement:r="bottom",strategy:o="absolute",middleware:s=[],platform:l}=t,a=s.filter(Boolean),i=yield l.isRTL==null?void 0:l.isRTL(n),c=yield l.getElementRects({reference:e,floating:n,strategy:o}),{x:d,y:u}=Fo(c,r,i),g=r,f={},h=0;for(let v=0;v<a.length;v++){let{name:y,fn:m}=a[v],{x:b,y:x,data:w,reset:$}=yield m({x:d,y:u,initialPlacement:r,placement:g,strategy:o,middlewareData:f,rects:c,platform:l,elements:{reference:e,floating:n}});d=b??d,u=x??u,f=pe(X({},f),{[y]:X(X({},f[y]),w)}),$&&h<=50&&(h++,typeof $=="object"&&($.placement&&(g=$.placement),$.rects&&(c=$.rects===!0?yield l.getElementRects({reference:e,floating:n,strategy:o}):$.rects),{x:d,y:u}=Fo(c,g,i)),v=-1)}return{x:d,y:u,placement:g,strategy:o,middlewareData:f}});function fn(e,n){return Re(this,null,function*(){var t;n===void 0&&(n={});let{x:r,y:o,platform:s,rects:l,elements:a,strategy:i}=e,{boundary:c="clippingAncestors",rootBoundary:d="viewport",elementContext:u="floating",altBoundary:g=!1,padding:f=0}=zt(n,e),h=Ki(f),y=a[g?u==="floating"?"reference":"floating":u],m=Fn(yield s.getClippingRect({element:(t=yield s.isElement==null?void 0:s.isElement(y))==null||t?y:y.contextElement||(yield s.getDocumentElement==null?void 0:s.getDocumentElement(a.floating)),boundary:c,rootBoundary:d,strategy:i})),b=u==="floating"?{x:r,y:o,width:l.floating.width,height:l.floating.height}:l.reference,x=yield s.getOffsetParent==null?void 0:s.getOffsetParent(a.floating),w=(yield s.isElement==null?void 0:s.isElement(x))?(yield s.getScale==null?void 0:s.getScale(x))||{x:1,y:1}:{x:1,y:1},$=Fn(s.convertOffsetParentRelativeRectToViewportRelativeRect?yield s.convertOffsetParentRelativeRectToViewportRelativeRect({elements:a,rect:b,offsetParent:x,strategy:i}):b);return{top:(m.top-$.top+h.top)/w.y,bottom:($.bottom-m.bottom+h.bottom)/w.y,left:(m.left-$.left+h.left)/w.x,right:($.right-m.right+h.right)/w.x}})}var tc=e=>({name:"arrow",options:e,fn(t){return Re(this,null,function*(){let{x:r,y:o,placement:s,rects:l,platform:a,elements:i,middlewareData:c}=t,{element:d,padding:u=0}=zt(e,t)||{};if(d==null)return{};let g=Ki(u),f={x:r,y:o},h=Cr(s),v=$r(h),y=yield a.getDimensions(d),m=h==="y",b=m?"top":"left",x=m?"bottom":"right",w=m?"clientHeight":"clientWidth",$=l.reference[v]+l.reference[h]-f[h]-l.floating[v],F=f[h]-l.reference[h],D=yield a.getOffsetParent==null?void 0:a.getOffsetParent(d),P=D?D[w]:0;(!P||!(yield a.isElement==null?void 0:a.isElement(D)))&&(P=i.floating[w]||l.floating[v]);let C=$/2-F/2,O=P/2-y[v]/2-1,V=nt(g[b],O),G=nt(g[x],O),Y=V,Ce=P-y[v]-G,te=P/2-y[v]/2+C,ne=ur(Y,te,Ce),ge=!c.arrow&&jt(s)!=null&&te!==ne&&l.reference[v]/2-(te<Y?V:G)-y[v]/2<0,oe=ge?te<Y?te-Y:te-Ce:0;return{[h]:f[h]+oe,data:X({[h]:ne,centerOffset:te-ne-oe},ge&&{alignmentOffset:oe}),reset:ge}})}}),nc=function(e){return e===void 0&&(e={}),{name:"flip",options:e,fn(t){return Re(this,null,function*(){var r,o;let{placement:s,middlewareData:l,rects:a,initialPlacement:i,platform:c,elements:d}=t,te=zt(e,t),{mainAxis:u=!0,crossAxis:g=!0,fallbackPlacements:f,fallbackStrategy:h="bestFit",fallbackAxisSideDirection:v="none",flipAlignment:y=!0}=te,m=tn(te,["mainAxis","crossAxis","fallbackPlacements","fallbackStrategy","fallbackAxisSideDirection","flipAlignment"]);if((r=l.arrow)!=null&&r.alignmentOffset)return{};let b=kt(s),x=Ft(i),w=kt(i)===i,$=yield c.isRTL==null?void 0:c.isRTL(d.floating),F=f||(w||!y?[Ln(i)]:Ya(i)),D=v!=="none";!f&&D&&F.push(...Za(i,y,v,$));let P=[i,...F],C=yield fn(t,m),O=[],V=((o=l.flip)==null?void 0:o.overflows)||[];if(u&&O.push(C[b]),g){let ne=Qa(s,a,$);O.push(C[ne[0]],C[ne[1]])}if(V=[...V,{placement:s,overflows:O}],!O.every(ne=>ne<=0)){var G,Y;let ne=(((G=l.flip)==null?void 0:G.index)||0)+1,ge=P[ne];if(ge)return{data:{index:ne,overflows:V},reset:{placement:ge}};let oe=(Y=V.filter(he=>he.overflows[0]<=0).sort((he,ie)=>he.overflows[1]-ie.overflows[1])[0])==null?void 0:Y.placement;if(!oe)switch(h){case"bestFit":{var Ce;let he=(Ce=V.filter(ie=>{if(D){let de=Ft(ie.placement);return de===x||de==="y"}return!0}).map(ie=>[ie.placement,ie.overflows.filter(de=>de>0).reduce((de,fe)=>de+fe,0)]).sort((ie,de)=>ie[1]-de[1])[0])==null?void 0:Ce[0];he&&(oe=he);break}case"initialPlacement":oe=i;break}if(s!==oe)return{reset:{placement:oe}}}return{}})}}};function _o(e,n){return{top:e.top-n.height,right:e.right-n.width,bottom:e.bottom-n.height,left:e.left-n.width}}function zo(e){return Ha.some(n=>e[n]>=0)}var rc=function(e){return e===void 0&&(e={}),{name:"hide",options:e,fn(t){return Re(this,null,function*(){let{rects:r}=t,l=zt(e,t),{strategy:o="referenceHidden"}=l,s=tn(l,["strategy"]);switch(o){case"referenceHidden":{let a=yield fn(t,pe(X({},s),{elementContext:"reference"})),i=_o(a,r.reference);return{data:{referenceHiddenOffsets:i,referenceHidden:zo(i)}}}case"escaped":{let a=yield fn(t,pe(X({},s),{altBoundary:!0})),i=_o(a,r.floating);return{data:{escapedOffsets:i,escaped:zo(i)}}}default:return{}}})}}};function oc(e,n){return Re(this,null,function*(){let{placement:t,platform:r,elements:o}=e,s=yield r.isRTL==null?void 0:r.isRTL(o.floating),l=kt(t),a=jt(t),i=Ft(t)==="y",c=["left","top"].includes(l)?-1:1,d=s&&i?-1:1,u=zt(n,e),{mainAxis:g,crossAxis:f,alignmentAxis:h}=typeof u=="number"?{mainAxis:u,crossAxis:0,alignmentAxis:null}:X({mainAxis:0,crossAxis:0,alignmentAxis:null},u);return a&&typeof h=="number"&&(f=a==="end"?h*-1:h),i?{x:f*d,y:g*c}:{x:g*c,y:f*d}})}var ic=function(e){return e===void 0&&(e=0),{name:"offset",options:e,fn(t){return Re(this,null,function*(){var r,o;let{x:s,y:l,placement:a,middlewareData:i}=t,c=yield oc(t,e);return a===((r=i.offset)==null?void 0:r.placement)&&(o=i.arrow)!=null&&o.alignmentOffset?{}:{x:s+c.x,y:l+c.y,data:pe(X({},c),{placement:a})}})}}},sc=function(e){return e===void 0&&(e={}),{name:"shift",options:e,fn(t){return Re(this,null,function*(){let{x:r,y:o,placement:s}=t,m=zt(e,t),{mainAxis:l=!0,crossAxis:a=!1,limiter:i={fn:b=>{let{x,y:w}=b;return{x,y:w}}}}=m,c=tn(m,["mainAxis","crossAxis","limiter"]),d={x:r,y:o},u=yield fn(t,c),g=Ft(kt(s)),f=Ri(g),h=d[f],v=d[g];if(l){let b=f==="y"?"top":"left",x=f==="y"?"bottom":"right",w=h+u[b],$=h-u[x];h=ur(w,h,$)}if(a){let b=g==="y"?"top":"left",x=g==="y"?"bottom":"right",w=v+u[b],$=v-u[x];v=ur(w,v,$)}let y=i.fn(pe(X({},t),{[f]:h,[g]:v}));return pe(X({},y),{data:{x:y.x-r,y:y.y-o}})})}}},lc=function(e){return e===void 0&&(e={}),{name:"size",options:e,fn(t){return Re(this,null,function*(){let{placement:r,rects:o,platform:s,elements:l}=t,C=zt(e,t),{apply:a=()=>{}}=C,i=tn(C,["apply"]),c=yield fn(t,i),d=kt(r),u=jt(r),g=Ft(r)==="y",{width:f,height:h}=o.floating,v,y;d==="top"||d==="bottom"?(v=d,y=u===((yield s.isRTL==null?void 0:s.isRTL(l.floating))?"start":"end")?"left":"right"):(y=d,v=u==="end"?"top":"bottom");let m=h-c.top-c.bottom,b=f-c.left-c.right,x=nt(h-c[v],m),w=nt(f-c[y],b),$=!t.middlewareData.shift,F=x,D=w;if(g?D=u||$?nt(w,b):b:F=u||$?nt(x,m):m,$&&!u){let O=Fe(c.left,0),V=Fe(c.right,0),G=Fe(c.top,0),Y=Fe(c.bottom,0);g?D=f-2*(O!==0||V!==0?O+V:Fe(c.left,c.right)):F=h-2*(G!==0||Y!==0?G+Y:Fe(c.top,c.bottom))}yield a(pe(X({},t),{availableWidth:D,availableHeight:F}));let P=yield s.getDimensions(l.floating);return f!==P.width||h!==P.height?{reset:{rects:!0}}:{}})}}};function Wt(e){return Bi(e)?(e.nodeName||"").toLowerCase():"#document"}function _e(e){var n;return(e==null||(n=e.ownerDocument)==null?void 0:n.defaultView)||window}function yt(e){var n;return(n=(Bi(e)?e.ownerDocument:e.document)||window.document)==null?void 0:n.documentElement}function Bi(e){return e instanceof Node||e instanceof _e(e).Node}function Xe(e){return e instanceof Element||e instanceof _e(e).Element}function ot(e){return e instanceof HTMLElement||e instanceof _e(e).HTMLElement}function Ro(e){return typeof ShadowRoot>"u"?!1:e instanceof ShadowRoot||e instanceof _e(e).ShadowRoot}function mn(e){let{overflow:n,overflowX:t,overflowY:r,display:o}=Ze(e);return/auto|scroll|overlay|hidden|clip/.test(n+r+t)&&!["inline","contents"].includes(o)}function ac(e){return["table","td","th"].includes(Wt(e))}function Un(e){return[":popover-open",":modal"].some(n=>{try{return e.matches(n)}catch{return!1}})}function Sr(e){let n=kr(),t=Xe(e)?Ze(e):e;return t.transform!=="none"||t.perspective!=="none"||(t.containerType?t.containerType!=="normal":!1)||!n&&(t.backdropFilter?t.backdropFilter!=="none":!1)||!n&&(t.filter?t.filter!=="none":!1)||["transform","perspective","filter"].some(r=>(t.willChange||"").includes(r))||["paint","layout","strict","content"].some(r=>(t.contain||"").includes(r))}function cc(e){let n=Et(e);for(;ot(n)&&!Ht(n);){if(Sr(n))return n;if(Un(n))return null;n=Et(n)}return null}function kr(){return typeof CSS>"u"||!CSS.supports?!1:CSS.supports("-webkit-backdrop-filter","none")}function Ht(e){return["html","body","#document"].includes(Wt(e))}function Ze(e){return _e(e).getComputedStyle(e)}function Gn(e){return Xe(e)?{scrollLeft:e.scrollLeft,scrollTop:e.scrollTop}:{scrollLeft:e.scrollX,scrollTop:e.scrollY}}function Et(e){if(Wt(e)==="html")return e;let n=e.assignedSlot||e.parentNode||Ro(e)&&e.host||yt(e);return Ro(n)?n.host:n}function Ni(e){let n=Et(e);return Ht(n)?e.ownerDocument?e.ownerDocument.body:e.body:ot(n)&&mn(n)?n:Ni(n)}function gn(e,n,t){var r;n===void 0&&(n=[]),t===void 0&&(t=!0);let o=Ni(e),s=o===((r=e.ownerDocument)==null?void 0:r.body),l=_e(o);return s?n.concat(l,l.visualViewport||[],mn(o)?o:[],l.frameElement&&t?gn(l.frameElement):[]):n.concat(o,gn(o,[],t))}function Ui(e){let n=Ze(e),t=parseFloat(n.width)||0,r=parseFloat(n.height)||0,o=ot(e),s=o?e.offsetWidth:t,l=o?e.offsetHeight:r,a=On(t)!==s||On(r)!==l;return a&&(t=s,r=l),{width:t,height:r,$:a}}function Er(e){return Xe(e)?e:e.contextElement}function Vt(e){let n=Er(e);if(!ot(n))return St(1);let t=n.getBoundingClientRect(),{width:r,height:o,$:s}=Ui(n),l=(s?On(t.width):t.width)/r,a=(s?On(t.height):t.height)/o;return(!l||!Number.isFinite(l))&&(l=1),(!a||!Number.isFinite(a))&&(a=1),{x:l,y:a}}var uc=St(0);function Gi(e){let n=_e(e);return!kr()||!n.visualViewport?uc:{x:n.visualViewport.offsetLeft,y:n.visualViewport.offsetTop}}function dc(e,n,t){return n===void 0&&(n=!1),!t||n&&t!==_e(e)?!1:n}function _t(e,n,t,r){n===void 0&&(n=!1),t===void 0&&(t=!1);let o=e.getBoundingClientRect(),s=Er(e),l=St(1);n&&(r?Xe(r)&&(l=Vt(r)):l=Vt(e));let a=dc(s,t,r)?Gi(s):St(0),i=(o.left+a.x)/l.x,c=(o.top+a.y)/l.y,d=o.width/l.x,u=o.height/l.y;if(s){let g=_e(s),f=r&&Xe(r)?_e(r):r,h=g,v=h.frameElement;for(;v&&r&&f!==h;){let y=Vt(v),m=v.getBoundingClientRect(),b=Ze(v),x=m.left+(v.clientLeft+parseFloat(b.paddingLeft))*y.x,w=m.top+(v.clientTop+parseFloat(b.paddingTop))*y.y;i*=y.x,c*=y.y,d*=y.x,u*=y.y,i+=x,c+=w,h=_e(v),v=h.frameElement}}return Fn({width:d,height:u,x:i,y:c})}function fc(e){let{elements:n,rect:t,offsetParent:r,strategy:o}=e,s=o==="fixed",l=yt(r),a=n?Un(n.floating):!1;if(r===l||a&&s)return t;let i={scrollLeft:0,scrollTop:0},c=St(1),d=St(0),u=ot(r);if((u||!u&&!s)&&((Wt(r)!=="body"||mn(l))&&(i=Gn(r)),ot(r))){let g=_t(r);c=Vt(r),d.x=g.x+r.clientLeft,d.y=g.y+r.clientTop}return{width:t.width*c.x,height:t.height*c.y,x:t.x*c.x-i.scrollLeft*c.x+d.x,y:t.y*c.y-i.scrollTop*c.y+d.y}}function gc(e){return Array.from(e.getClientRects())}function Vi(e){return _t(yt(e)).left+Gn(e).scrollLeft}function hc(e){let n=yt(e),t=Gn(e),r=e.ownerDocument.body,o=Fe(n.scrollWidth,n.clientWidth,r.scrollWidth,r.clientWidth),s=Fe(n.scrollHeight,n.clientHeight,r.scrollHeight,r.clientHeight),l=-t.scrollLeft+Vi(e),a=-t.scrollTop;return Ze(r).direction==="rtl"&&(l+=Fe(n.clientWidth,r.clientWidth)-o),{width:o,height:s,x:l,y:a}}function vc(e,n){let t=_e(e),r=yt(e),o=t.visualViewport,s=r.clientWidth,l=r.clientHeight,a=0,i=0;if(o){s=o.width,l=o.height;let c=kr();(!c||c&&n==="fixed")&&(a=o.offsetLeft,i=o.offsetTop)}return{width:s,height:l,x:a,y:i}}function pc(e,n){let t=_t(e,!0,n==="fixed"),r=t.top+e.clientTop,o=t.left+e.clientLeft,s=ot(e)?Vt(e):St(1),l=e.clientWidth*s.x,a=e.clientHeight*s.y,i=o*s.x,c=r*s.y;return{width:l,height:a,x:i,y:c}}function Ko(e,n,t){let r;if(n==="viewport")r=vc(e,t);else if(n==="document")r=hc(yt(e));else if(Xe(n))r=pc(n,t);else{let o=Gi(e);r=pe(X({},n),{x:n.x-o.x,y:n.y-o.y})}return Fn(r)}function Hi(e,n){let t=Et(e);return t===n||!Xe(t)||Ht(t)?!1:Ze(t).position==="fixed"||Hi(t,n)}function yc(e,n){let t=n.get(e);if(t)return t;let r=gn(e,[],!1).filter(a=>Xe(a)&&Wt(a)!=="body"),o=null,s=Ze(e).position==="fixed",l=s?Et(e):e;for(;Xe(l)&&!Ht(l);){let a=Ze(l),i=Sr(l);!i&&a.position==="fixed"&&(o=null),(s?!i&&!o:!i&&a.position==="static"&&!!o&&["absolute","fixed"].includes(o.position)||mn(l)&&!i&&Hi(e,l))?r=r.filter(d=>d!==l):o=a,l=Et(l)}return n.set(e,r),r}function mc(e){let{element:n,boundary:t,rootBoundary:r,strategy:o}=e,l=[...t==="clippingAncestors"?Un(n)?[]:yc(n,this._c):[].concat(t),r],a=l[0],i=l.reduce((c,d)=>{let u=Ko(n,d,o);return c.top=Fe(u.top,c.top),c.right=nt(u.right,c.right),c.bottom=nt(u.bottom,c.bottom),c.left=Fe(u.left,c.left),c},Ko(n,a,o));return{width:i.right-i.left,height:i.bottom-i.top,x:i.left,y:i.top}}function bc(e){let{width:n,height:t}=Ui(e);return{width:n,height:t}}function xc(e,n,t){let r=ot(n),o=yt(n),s=t==="fixed",l=_t(e,!0,s,n),a={scrollLeft:0,scrollTop:0},i=St(0);if(r||!r&&!s)if((Wt(n)!=="body"||mn(o))&&(a=Gn(n)),r){let u=_t(n,!0,s,n);i.x=u.x+n.clientLeft,i.y=u.y+n.clientTop}else o&&(i.x=Vi(o));let c=l.left+a.scrollLeft-i.x,d=l.top+a.scrollTop-i.y;return{x:c,y:d,width:l.width,height:l.height}}function er(e){return Ze(e).position==="static"}function Bo(e,n){return!ot(e)||Ze(e).position==="fixed"?null:n?n(e):e.offsetParent}function ji(e,n){let t=_e(e);if(Un(e))return t;if(!ot(e)){let o=Et(e);for(;o&&!Ht(o);){if(Xe(o)&&!er(o))return o;o=Et(o)}return t}let r=Bo(e,n);for(;r&&ac(r)&&er(r);)r=Bo(r,n);return r&&Ht(r)&&er(r)&&!Sr(r)?t:r||cc(e)||t}var wc=function(e){return Re(this,null,function*(){let n=this.getOffsetParent||ji,t=this.getDimensions,r=yield t(e.floating);return{reference:xc(e.reference,yield n(e.floating),e.strategy),floating:{x:0,y:0,width:r.width,height:r.height}}})};function $c(e){return Ze(e).direction==="rtl"}var Wi={convertOffsetParentRelativeRectToViewportRelativeRect:fc,getDocumentElement:yt,getClippingRect:mc,getOffsetParent:ji,getElementRects:wc,getClientRects:gc,getDimensions:bc,getScale:Vt,isElement:Xe,isRTL:$c};function Cc(e,n){let t=null,r,o=yt(e);function s(){var a;clearTimeout(r),(a=t)==null||a.disconnect(),t=null}function l(a,i){a===void 0&&(a=!1),i===void 0&&(i=1),s();let{left:c,top:d,width:u,height:g}=e.getBoundingClientRect();if(a||n(),!u||!g)return;let f=In(d),h=In(o.clientWidth-(c+u)),v=In(o.clientHeight-(d+g)),y=In(c),b={rootMargin:-f+"px "+-h+"px "+-v+"px "+-y+"px",threshold:Fe(0,nt(1,i))||1},x=!0;function w($){let F=$[0].intersectionRatio;if(F!==i){if(!x)return l();F?l(!1,F):r=setTimeout(()=>{l(!1,1e-7)},1e3)}x=!1}try{t=new IntersectionObserver(w,pe(X({},b),{root:o.ownerDocument}))}catch{t=new IntersectionObserver(w,b)}t.observe(e)}return l(!0),s}function Sc(e,n,t,r){r===void 0&&(r={});let{ancestorScroll:o=!0,ancestorResize:s=!0,elementResize:l=typeof ResizeObserver=="function",layoutShift:a=typeof IntersectionObserver=="function",animationFrame:i=!1}=r,c=Er(e),d=o||s?[...c?gn(c):[],...gn(n)]:[];d.forEach(m=>{o&&m.addEventListener("scroll",t,{passive:!0}),s&&m.addEventListener("resize",t)});let u=c&&a?Cc(c,t):null,g=-1,f=null;l&&(f=new ResizeObserver(m=>{let[b]=m;b&&b.target===c&&f&&(f.unobserve(n),cancelAnimationFrame(g),g=requestAnimationFrame(()=>{var x;(x=f)==null||x.observe(n)})),t()}),c&&!i&&f.observe(c),f.observe(n));let h,v=i?_t(e):null;i&&y();function y(){let m=_t(e);v&&(m.x!==v.x||m.y!==v.y||m.width!==v.width||m.height!==v.height)&&t(),v=m,h=requestAnimationFrame(y)}return t(),()=>{var m;d.forEach(b=>{o&&b.removeEventListener("scroll",t),s&&b.removeEventListener("resize",t)}),u?.(),(m=f)==null||m.disconnect(),f=null,i&&cancelAnimationFrame(h)}}var kc=ic,Ec=sc,Mc=nc,Tc=lc,Ac=rc,Ic=tc,Dc=(e,n,t)=>{let r=new Map,o=X({platform:Wi},t),s=pe(X({},o.platform),{_c:r});return ec(e,n,pe(X({},o),{platform:s}))},Mr=be();function Tr(){let e=xe(Mr);if(e===void 0)throw new Error("[kobalte]: `usePopperContext` must be used within a `Popper` component");return e}var Pc=_('<svg display="block" viewBox="0 0 30 30" style="transform:scale(1.02)"><g><path fill="none" d="M23,27.8c1.1,1.2,3.4,2.2,5,2.2h2H0h2c1.7,0,3.9-1,5-2.2l6.6-7.2c0.7-0.8,2-0.8,2.7,0L23,27.8L23,27.8z"></path><path stroke="none" d="M23,27.8c1.1,1.2,3.4,2.2,5,2.2h2H0h2c1.7,0,3.9-1,5-2.2l6.6-7.2c0.7-0.8,2-0.8,2.7,0L23,27.8L23,27.8z">'),fr=30,No=fr/2,qc={top:180,right:-90,bottom:0,left:90};function Ar(e){let n=Tr(),t=Q({size:fr},e),[r,o]=J(t,["ref","style","size"]),s=()=>n.currentPlacement().split("-")[0],l=Oc(n.contentRef),a=()=>l()?.getPropertyValue("background-color")||"none",i=()=>l()?.getPropertyValue(`border-${s()}-color`)||"none",c=()=>l()?.getPropertyValue(`border-${s()}-width`)||"0px",d=()=>Number.parseInt(c())*2*(fr/r.size),u=()=>`rotate(${qc[s()]} ${No} ${No}) translate(0 2)`;return p(ue,j({as:"div",ref(g){let f=De(n.setArrowRef,r.ref);typeof f=="function"&&f(g)},"aria-hidden":"true",get style(){return Rn({position:"absolute","font-size":`${r.size}px`,width:"1em",height:"1em","pointer-events":"none",fill:a(),stroke:i(),"stroke-width":d()},r.style)}},o,{get children(){let g=Pc(),f=g.firstChild;return N(()=>A(f,"transform",u())),g}}))}function Oc(e){let[n,t]=z();return B(()=>{let r=e();r&&t(ql(r).getComputedStyle(r))}),n}function Lc(e){let n=Tr(),[t,r]=J(e,["ref","style"]);return p(ue,j({as:"div",ref(o){let s=De(n.setPositionerRef,t.ref);typeof s=="function"&&s(o)},"data-popper-positioner":"",get style(){return Rn({position:"absolute",top:0,left:0,"min-width":"max-content"},t.style)}},r))}function Uo(e){let{x:n=0,y:t=0,width:r=0,height:o=0}=e??{};if(typeof DOMRect=="function")return new DOMRect(n,t,r,o);let s={x:n,y:t,width:r,height:o,top:t,right:n+r,bottom:t+o,left:n};return pe(X({},s),{toJSON:()=>s})}function Fc(e,n){return{contextElement:e,getBoundingClientRect:()=>{let r=n(e);return r?Uo(r):e?e.getBoundingClientRect():Uo()}}}function _c(e){return/^(?:top|bottom|left|right)(?:-(?:start|end))?$/.test(e)}var zc={top:"bottom",right:"left",bottom:"top",left:"right"};function Rc(e,n){let[t,r]=e.split("-"),o=zc[t];return r?t==="left"||t==="right"?`${o} ${r==="start"?"top":"bottom"}`:r==="start"?`${o} ${n==="rtl"?"right":"left"}`:`${o} ${n==="rtl"?"left":"right"}`:`${o} center`}function Kc(e){let n=Q({getAnchorRect:g=>g?.getBoundingClientRect(),placement:"bottom",gutter:0,shift:0,flip:!0,slide:!0,overlap:!1,sameWidth:!1,fitViewport:!1,hideWhenDetached:!1,detachedPadding:0,arrowPadding:4,overflowPadding:8},e),[t,r]=z(),[o,s]=z(),[l,a]=z(n.placement),i=()=>Fc(n.anchorRef?.(),n.getAnchorRect),{direction:c}=Mt();function d(){return Re(this,null,function*(){let g=i(),f=t(),h=o();if(!g||!f)return;let v=(h?.clientHeight||0)/2,y=typeof n.gutter=="number"?n.gutter+v:n.gutter??v;f.style.setProperty("--kb-popper-content-overflow-padding",`${n.overflowPadding}px`),g.getBoundingClientRect();let m=[kc(({placement:F})=>{let D=!!F.split("-")[1];return{mainAxis:y,crossAxis:D?void 0:n.shift,alignmentAxis:n.shift}})];if(n.flip!==!1){let F=typeof n.flip=="string"?n.flip.split(" "):void 0;if(F!==void 0&&!F.every(_c))throw new Error("`flip` expects a spaced-delimited list of placements");m.push(Mc({padding:n.overflowPadding,fallbackPlacements:F}))}(n.slide||n.overlap)&&m.push(Ec({mainAxis:n.slide,crossAxis:n.overlap,padding:n.overflowPadding})),m.push(Tc({padding:n.overflowPadding,apply({availableWidth:F,availableHeight:D,rects:P}){let C=Math.round(P.reference.width);F=Math.floor(F),D=Math.floor(D),f.style.setProperty("--kb-popper-anchor-width",`${C}px`),f.style.setProperty("--kb-popper-content-available-width",`${F}px`),f.style.setProperty("--kb-popper-content-available-height",`${D}px`),n.sameWidth&&(f.style.width=`${C}px`),n.fitViewport&&(f.style.maxWidth=`${F}px`,f.style.maxHeight=`${D}px`)}})),n.hideWhenDetached&&m.push(Ac({padding:n.detachedPadding})),h&&m.push(Ic({element:h,padding:n.arrowPadding}));let b=yield Dc(g,f,{placement:n.placement,strategy:"absolute",middleware:m,platform:pe(X({},Wi),{isRTL:()=>c()==="rtl"})});if(a(b.placement),n.onCurrentPlacementChange?.(b.placement),!f)return;f.style.setProperty("--kb-popper-content-transform-origin",Rc(b.placement,c()));let x=Math.round(b.x),w=Math.round(b.y),$;if(n.hideWhenDetached&&($=b.middlewareData.hide?.referenceHidden?"hidden":"visible"),Object.assign(f.style,{top:"0",left:"0",transform:`translate3d(${x}px, ${w}px, 0)`,visibility:$}),h&&b.middlewareData.arrow){let{x:F,y:D}=b.middlewareData.arrow,P=b.placement.split("-")[0];Object.assign(h.style,{left:F!=null?`${F}px`:"",top:D!=null?`${D}px`:"",[P]:"100%"})}})}B(()=>{let g=i(),f=t();if(!g||!f)return;let h=Sc(g,f,d,{elementResize:typeof ResizeObserver=="function"});U(h)}),B(()=>{let g=t(),f=n.contentRef?.();!g||!f||queueMicrotask(()=>{g.style.zIndex=getComputedStyle(f).zIndex})});let u={currentPlacement:l,contentRef:()=>n.contentRef?.(),setPositionerRef:r,setArrowRef:s};return p(Mr.Provider,{value:u,get children(){return n.children}})}var Qi=Object.assign(Kc,{Arrow:Ar,Context:Mr,usePopperContext:Tr,Positioner:Lc});function Bc(e){let n=t=>{t.key===pr.Escape&&e.onEscapeKeyDown?.(t)};B(()=>{if(Ee||E(e.isDisabled))return;let t=e.ownerDocument?.()??rt();t.addEventListener("keydown",n),U(()=>{t.removeEventListener("keydown",n)})})}var Go="interactOutside.pointerDownOutside",Vo="interactOutside.focusOutside";function Nc(e,n){let t,r=Ql,o=()=>rt(n()),s=u=>e.onPointerDownOutside?.(u),l=u=>e.onFocusOutside?.(u),a=u=>e.onInteractOutside?.(u),i=u=>{let g=u.target;return!(g instanceof HTMLElement)||g.closest(`[${qn}]`)||!Ue(o(),g)||Ue(n(),g)?!1:!e.shouldExcludeElement?.(g)},c=u=>{function g(){let f=n(),h=u.target;if(!f||!h||!i(u))return;let v=we([s,a]);h.addEventListener(Go,v,{once:!0});let y=new CustomEvent(Go,{bubbles:!1,cancelable:!0,detail:{originalEvent:u,isContextMenu:u.button===2||zl(u)&&u.button===0}});h.dispatchEvent(y)}u.pointerType==="touch"?(o().removeEventListener("click",g),r=g,o().addEventListener("click",g,{once:!0})):g()},d=u=>{let g=n(),f=u.target;if(!g||!f||!i(u))return;let h=we([l,a]);f.addEventListener(Vo,h,{once:!0});let v=new CustomEvent(Vo,{bubbles:!1,cancelable:!0,detail:{originalEvent:u,isContextMenu:!1}});f.dispatchEvent(v)};B(()=>{Ee||E(e.isDisabled)||(t=window.setTimeout(()=>{o().addEventListener("pointerdown",c,!0)},0),o().addEventListener("focusin",d,!0),U(()=>{window.clearTimeout(t),o().removeEventListener("click",r),o().removeEventListener("pointerdown",c,!0),o().removeEventListener("focusin",d,!0)}))})}var Yi=be();function Uc(){return xe(Yi)}function Gc(e){let n,t=Uc(),[r,o]=J(e,["ref","disableOutsidePointerEvents","excludedElements","onEscapeKeyDown","onPointerDownOutside","onFocusOutside","onInteractOutside","onDismiss","bypassTopMostLayerCheck"]),s=new Set([]),l=u=>{s.add(u);let g=t?.registerNestedLayer(u);return()=>{s.delete(u),g?.()}};Nc({shouldExcludeElement:u=>n?r.excludedElements?.some(g=>Ue(g(),u))||[...s].some(g=>Ue(g,u)):!1,onPointerDownOutside:u=>{!n||Oe.isBelowPointerBlockingLayer(n)||!r.bypassTopMostLayerCheck&&!Oe.isTopMostLayer(n)||(r.onPointerDownOutside?.(u),r.onInteractOutside?.(u),u.defaultPrevented||r.onDismiss?.())},onFocusOutside:u=>{r.onFocusOutside?.(u),r.onInteractOutside?.(u),u.defaultPrevented||r.onDismiss?.()}},()=>n),Bc({ownerDocument:()=>rt(n),onEscapeKeyDown:u=>{!n||!Oe.isTopMostLayer(n)||(r.onEscapeKeyDown?.(u),!u.defaultPrevented&&r.onDismiss&&(u.preventDefault(),r.onDismiss()))}}),ft(()=>{if(!n)return;Oe.addLayer({node:n,isPointerBlocking:r.disableOutsidePointerEvents,dismiss:r.onDismiss});let u=t?.registerNestedLayer(n);Oe.assignPointerEventToLayers(),Oe.disableBodyPointerEvents(n),U(()=>{n&&(Oe.removeLayer(n),u?.(),Oe.assignPointerEventToLayers(),Oe.restoreBodyPointerEvents(n))})}),B(et([()=>n,()=>r.disableOutsidePointerEvents],([u,g])=>{if(!u)return;let f=Oe.find(u);f&&f.isPointerBlocking!==g&&(f.isPointerBlocking=g,Oe.assignPointerEventToLayers()),g&&Oe.disableBodyPointerEvents(u),U(()=>{Oe.restoreBodyPointerEvents(u)})},{defer:!0}));let d={registerNestedLayer:l};return p(Yi.Provider,{value:d,get children(){return p(ue,j({as:"div",ref(u){let g=De(f=>n=f,r.ref);typeof g=="function"&&g(u)}},o))}})}function Xi(e={}){let[n,t]=ki({value:()=>E(e.open),defaultValue:()=>!!E(e.defaultOpen),onChange:l=>e.onOpenChange?.(l)}),r=()=>{t(!0)},o=()=>{t(!1)};return{isOpen:n,setIsOpen:t,open:r,close:o,toggle:()=>{n()?o():r()}}}var Ne={};Nn(Ne,{Description:()=>Ci,ErrorMessage:()=>Si,Item:()=>ts,ItemControl:()=>ns,ItemDescription:()=>rs,ItemIndicator:()=>os,ItemInput:()=>is,ItemLabel:()=>ss,Label:()=>ls,RadioGroup:()=>Vc,Root:()=>as});var Zi=be();function Ji(){let e=xe(Zi);if(e===void 0)throw new Error("[kobalte]: `useRadioGroupContext` must be used within a `RadioGroup` component");return e}var es=be();function bn(){let e=xe(es);if(e===void 0)throw new Error("[kobalte]: `useRadioGroupItemContext` must be used within a `RadioGroup.Item` component");return e}function ts(e){let n=pn(),t=Ji(),r=`${n.generateId("item")}-${qe()}`,o=Q({id:r},e),[s,l]=J(o,["value","disabled","onPointerDown"]),[a,i]=z(),[c,d]=z(),[u,g]=z(),[f,h]=z(),[v,y]=z(!1),m=M(()=>t.isSelectedValue(s.value)),b=M(()=>s.disabled||n.isDisabled()||!1),x=F=>{ce(F,s.onPointerDown),v()&&F.preventDefault()},w=M(()=>pe(X({},n.dataset()),{"data-disabled":b()?"":void 0,"data-checked":m()?"":void 0})),$={value:()=>s.value,dataset:w,isSelected:m,isDisabled:b,inputId:a,labelId:c,descriptionId:u,inputRef:f,select:()=>t.setSelectedValue(s.value),generateId:vn(()=>l.id),registerInput:Ge(i),registerLabel:Ge(d),registerDescription:Ge(g),setIsFocused:y,setInputRef:h};return p(es.Provider,{value:$,get children(){return p(ue,j({as:"div",role:"group",onPointerDown:x},w,l))}})}function ns(e){let n=bn(),t=Q({id:n.generateId("control")},e),[r,o]=J(t,["onClick","onKeyDown"]);return p(ue,j({as:"div",onClick:a=>{ce(a,r.onClick),n.select(),n.inputRef()?.focus()},onKeyDown:a=>{ce(a,r.onKeyDown),a.key===pr.Space&&(n.select(),n.inputRef()?.focus())}},()=>n.dataset(),o))}function rs(e){let n=bn(),t=Q({id:n.generateId("description")},e);return B(()=>U(n.registerDescription(t.id))),p(ue,j({as:"div"},()=>n.dataset(),t))}function os(e){let n=bn(),t=Q({id:n.generateId("indicator")},e),[r,o]=J(t,["ref","forceMount"]),[s,l]=z(),{present:a}=Li({show:()=>r.forceMount||n.isSelected(),element:()=>s()??null});return p(K,{get when(){return a()},get children(){return p(ue,j({as:"div",ref(i){let c=De(l,r.ref);typeof c=="function"&&c(i)}},()=>n.dataset(),o))}})}function is(e){let n=pn(),t=Ji(),r=bn(),o=Q({id:r.generateId("input")},e),[s,l]=J(o,["ref","style","aria-labelledby","aria-describedby","onChange","onFocus","onBlur"]),a=()=>[s["aria-labelledby"],r.labelId(),s["aria-labelledby"]!=null&&l["aria-label"]!=null?l.id:void 0].filter(Boolean).join(" ")||void 0,i=()=>[s["aria-describedby"],r.descriptionId(),t.ariaDescribedBy()].filter(Boolean).join(" ")||void 0,[c,d]=z(!1),u=h=>{if(ce(h,s.onChange),h.stopPropagation(),!c()){t.setSelectedValue(r.value());let v=h.target;v.checked=r.isSelected()}d(!1)},g=h=>{ce(h,s.onFocus),r.setIsFocused(!0)},f=h=>{ce(h,s.onBlur),r.setIsFocused(!1)};return B(et([()=>r.isSelected(),()=>r.value()],h=>{if(!h[0]&&h[1]===r.value())return;d(!0);let v=r.inputRef();v?.dispatchEvent(new Event("input",{bubbles:!0,cancelable:!0})),v?.dispatchEvent(new Event("change",{bubbles:!0,cancelable:!0}))},{defer:!0})),B(()=>U(r.registerInput(l.id))),p(ue,j({as:"input",ref(h){let v=De(r.setInputRef,s.ref);typeof v=="function"&&v(h)},type:"radio",get name(){return n.name()},get value(){return r.value()},get checked(){return r.isSelected()},get required(){return n.isRequired()},get disabled(){return r.isDisabled()},get readonly(){return n.isReadOnly()},get style(){return Rn(X({},wi),s.style)},get"aria-labelledby"(){return a()},get"aria-describedby"(){return i()},onChange:u,onFocus:g,onBlur:f},()=>r.dataset(),l))}function ss(e){let n=bn(),t=Q({id:n.generateId("label")},e);return B(()=>U(n.registerLabel(t.id))),p(ue,j({as:"label",get for(){return n.inputId()}},()=>n.dataset(),t))}function ls(e){return p(ea,j({as:"span"},e))}function as(e){let n,t=`radiogroup-${qe()}`,r=Q({id:t,orientation:"vertical"},e),[o,s,l]=J(r,["ref","value","defaultValue","onChange","orientation","aria-labelledby","aria-describedby"],Zl),[a,i]=yn({value:()=>o.value,defaultValue:()=>o.defaultValue,onChange:h=>o.onChange?.(h)}),{formControlContext:c}=Jl(s);ta(()=>n,()=>i(o.defaultValue??""));let d=()=>c.getAriaLabelledBy(E(s.id),l["aria-label"],o["aria-labelledby"]),u=()=>c.getAriaDescribedBy(o["aria-describedby"]),g=h=>h===a(),f={ariaDescribedBy:u,isSelectedValue:g,setSelectedValue:h=>{if(!(c.isReadOnly()||c.isDisabled())&&(i(h),n))for(let v of n.querySelectorAll("[type='radio']")){let y=v;y.checked=g(y.value)}}};return p($i.Provider,{value:c,get children(){return p(Zi.Provider,{value:f,get children(){return p(ue,j({as:"div",ref(h){let v=De(y=>n=y,o.ref);typeof v=="function"&&v(h)},role:"radiogroup",get id(){return E(s.id)},get"aria-invalid"(){return c.validationState()==="invalid"||void 0},get"aria-required"(){return c.isRequired()||void 0},get"aria-disabled"(){return c.isDisabled()||void 0},get"aria-readonly"(){return c.isReadOnly()||void 0},get"aria-orientation"(){return o.orientation},get"aria-labelledby"(){return d()},get"aria-describedby"(){return u()}},()=>c.dataset(),l))}})}})}var Vc=Object.assign(as,{Description:Ci,ErrorMessage:Si,Item:ts,ItemControl:ns,ItemDescription:rs,ItemIndicator:os,ItemInput:is,ItemLabel:ss,Label:ls}),Hc=class{collection;ref;collator;constructor(e,n,t){this.collection=e,this.ref=n,this.collator=t}getKeyBelow(e){let n=this.collection().getKeyAfter(e);for(;n!=null;){let t=this.collection().getItem(n);if(t&&t.type==="item"&&!t.disabled)return n;n=this.collection().getKeyAfter(n)}}getKeyAbove(e){let n=this.collection().getKeyBefore(e);for(;n!=null;){let t=this.collection().getItem(n);if(t&&t.type==="item"&&!t.disabled)return n;n=this.collection().getKeyBefore(n)}}getFirstKey(){let e=this.collection().getFirstKey();for(;e!=null;){let n=this.collection().getItem(e);if(n&&n.type==="item"&&!n.disabled)return e;e=this.collection().getKeyAfter(e)}}getLastKey(){let e=this.collection().getLastKey();for(;e!=null;){let n=this.collection().getItem(e);if(n&&n.type==="item"&&!n.disabled)return e;e=this.collection().getKeyBefore(e)}}getItem(e){return this.ref?.()?.querySelector(`[data-key="${e}"]`)??null}getKeyPageAbove(e){let n=this.ref?.(),t=this.getItem(e);if(!n||!t)return;let r=Math.max(0,t.offsetTop+t.offsetHeight-n.offsetHeight),o=e;for(;o&&t&&t.offsetTop>r;)o=this.getKeyAbove(o),t=o!=null?this.getItem(o):null;return o}getKeyPageBelow(e){let n=this.ref?.(),t=this.getItem(e);if(!n||!t)return;let r=Math.min(n.scrollHeight,t.offsetTop-t.offsetHeight+n.offsetHeight),o=e;for(;o&&t&&t.offsetTop<r;)o=this.getKeyBelow(o),t=o!=null?this.getItem(o):null;return o}getKeyForSearch(e,n){let t=this.collator?.();if(!t)return;let r=n!=null?this.getKeyBelow(n):this.getFirstKey();for(;r!=null;){let o=this.collection().getItem(r);if(o){let s=o.textValue.slice(0,e.length);if(o.textValue&&t.compare(s,e)===0)return r}r=this.getKeyBelow(r)}}};function jc(e,n,t){let r=$a({usage:"search",sensitivity:"base"}),o=M(()=>{let s=E(e.keyboardDelegate);return s||new Hc(e.collection,n,r)});return Aa({selectionManager:()=>E(e.selectionManager),keyboardDelegate:o,autoFocus:()=>E(e.autoFocus),deferAutoFocus:()=>E(e.deferAutoFocus),shouldFocusWrap:()=>E(e.shouldFocusWrap),disallowEmptySelection:()=>E(e.disallowEmptySelection),selectOnFocus:()=>E(e.selectOnFocus),disallowTypeAhead:()=>E(e.disallowTypeAhead),shouldUseVirtualFocus:()=>E(e.shouldUseVirtualFocus),allowsTabNavigation:()=>E(e.allowsTabNavigation),isVirtualized:()=>E(e.isVirtualized),scrollToKey:s=>E(e.scrollToKey)?.(s),orientation:()=>E(e.orientation)},n)}var tr="focusScope.autoFocusOnMount",nr="focusScope.autoFocusOnUnmount",Ho={bubbles:!1,cancelable:!0},jo={stack:[],active(){return this.stack[0]},add(e){e!==this.active()&&this.active()?.pause(),this.stack=sr(this.stack,e),this.stack.unshift(e)},remove(e){this.stack=sr(this.stack,e),this.active()?.resume()}};function Wc(e,n){let[t,r]=z(!1),o={pause(){r(!0)},resume(){r(!1)}},s=null,l=h=>e.onMountAutoFocus?.(h),a=h=>e.onUnmountAutoFocus?.(h),i=()=>rt(n()),c=()=>{let h=i().createElement("span");return h.setAttribute("data-focus-trap",""),h.tabIndex=0,Object.assign(h.style,wi),h},d=()=>{let h=n();return h?bi(h,!0).filter(v=>!v.hasAttribute("data-focus-trap")):[]},u=()=>{let h=d();return h.length>0?h[0]:null},g=()=>{let h=d();return h.length>0?h[h.length-1]:null},f=()=>{let h=n();if(!h)return!1;let v=an(h);return!v||Ue(h,v)?!1:xi(v)};B(()=>{if(Ee)return;let h=n();if(!h)return;jo.add(o);let v=an(h);if(!Ue(h,v)){let m=new CustomEvent(tr,Ho);h.addEventListener(tr,l),h.dispatchEvent(m),m.defaultPrevented||setTimeout(()=>{Te(u()),an(h)===v&&Te(h)},0)}U(()=>{h.removeEventListener(tr,l),setTimeout(()=>{let m=new CustomEvent(nr,Ho);f()&&m.preventDefault(),h.addEventListener(nr,a),h.dispatchEvent(m),m.defaultPrevented||Te(v??i().body),h.removeEventListener(nr,a),jo.remove(o)},0)})}),B(()=>{if(Ee)return;let h=n();if(!h||!E(e.trapFocus)||t())return;let v=m=>{let b=m.target;b?.closest(`[${qn}]`)||(Ue(h,b)?s=b:Te(s))},y=m=>{let x=m.relatedTarget??an(h);x?.closest(`[${qn}]`)||Ue(h,x)||Te(s)};i().addEventListener("focusin",v),i().addEventListener("focusout",y),U(()=>{i().removeEventListener("focusin",v),i().removeEventListener("focusout",y)})}),B(()=>{if(Ee)return;let h=n();if(!h||!E(e.trapFocus)||t())return;let v=c();h.insertAdjacentElement("afterbegin",v);let y=c();h.insertAdjacentElement("beforeend",y);function m(x){let w=u(),$=g();x.relatedTarget===w?Te($):Te(w)}v.addEventListener("focusin",m),y.addEventListener("focusin",m);let b=new MutationObserver(x=>{for(let w of x)w.previousSibling===y&&(y.remove(),h.insertAdjacentElement("beforeend",y)),w.nextSibling===v&&(v.remove(),h.insertAdjacentElement("afterbegin",v))});b.observe(h,{childList:!0,subtree:!1}),U(()=>{v.removeEventListener("focusin",m),y.removeEventListener("focusin",m),v.remove(),y.remove(),b.disconnect()})})}var Qc="data-live-announcer";function Yc(e){B(()=>{E(e.isDisabled)||U(Xc(E(e.targets),E(e.root)))})}var on=new WeakMap,Be=[];function Xc(e,n=document.body){let t=new Set(e),r=new Set,o=i=>{for(let g of i.querySelectorAll(`[${Qc}], [${qn}]`))t.add(g);let c=g=>{if(t.has(g)||g.parentElement&&r.has(g.parentElement)&&g.parentElement.getAttribute("role")!=="row")return NodeFilter.FILTER_REJECT;for(let f of t)if(g.contains(f))return NodeFilter.FILTER_SKIP;return NodeFilter.FILTER_ACCEPT},d=document.createTreeWalker(i,NodeFilter.SHOW_ELEMENT,{acceptNode:c}),u=c(i);if(u===NodeFilter.FILTER_ACCEPT&&s(i),u!==NodeFilter.FILTER_REJECT){let g=d.nextNode();for(;g!=null;)s(g),g=d.nextNode()}},s=i=>{let c=on.get(i)??0;i.getAttribute("aria-hidden")==="true"&&c===0||(c===0&&i.setAttribute("aria-hidden","true"),r.add(i),on.set(i,c+1))};Be.length&&Be[Be.length-1].disconnect(),o(n);let l=new MutationObserver(i=>{for(let c of i)if(!(c.type!=="childList"||c.addedNodes.length===0)&&![...t,...r].some(d=>d.contains(c.target))){for(let d of c.removedNodes)d instanceof Element&&(t.delete(d),r.delete(d));for(let d of c.addedNodes)(d instanceof HTMLElement||d instanceof SVGElement)&&(d.dataset.liveAnnouncer==="true"||d.dataset.reactAriaTopLayer==="true")?t.add(d):d instanceof Element&&o(d)}});l.observe(n,{childList:!0,subtree:!0});let a={observe(){l.observe(n,{childList:!0,subtree:!0})},disconnect(){l.disconnect()}};return Be.push(a),()=>{l.disconnect();for(let i of r){let c=on.get(i);if(c==null)return;c===1?(i.removeAttribute("aria-hidden"),on.delete(i)):on.set(i,c-1)}a===Be[Be.length-1]?(Be.pop(),Be.length&&Be[Be.length-1].observe()):Be.splice(Be.indexOf(a),1)}}var Dn=new Map,Zc=e=>{B(()=>{let n=Me(e.style)??{},t=Me(e.properties)??[],r={};for(let s in n)r[s]=e.element.style[s];let o=Dn.get(e.key);o?o.activeCount++:Dn.set(e.key,{activeCount:1,originalStyles:r,properties:t.map(s=>s.key)}),Object.assign(e.element.style,e.style);for(let s of t)e.element.style.setProperty(s.key,s.value);U(()=>{let s=Dn.get(e.key);if(s){if(s.activeCount!==1){s.activeCount--;return}Dn.delete(e.key);for(let[l,a]of Object.entries(s.originalStyles))e.element.style[l]=a;for(let l of s.properties)e.element.style.removeProperty(l);e.element.style.length===0&&e.element.removeAttribute("style"),e.cleanup?.()}})})},Wo=Zc,Jc=(e,n)=>{switch(n){case"x":return[e.clientWidth,e.scrollLeft,e.scrollWidth];case"y":return[e.clientHeight,e.scrollTop,e.scrollHeight]}},eu=(e,n)=>{let t=getComputedStyle(e),r=n==="x"?t.overflowX:t.overflowY;return r==="auto"||r==="scroll"||e.tagName==="HTML"&&r==="visible"},tu=(e,n,t)=>{let r=n==="x"&&window.getComputedStyle(e).direction==="rtl"?-1:1,o=e,s=0,l=0,a=!1;do{let[i,c,d]=Jc(o,n),u=d-i-r*c;(c!==0||u!==0)&&eu(o,n)&&(s+=u,l+=c),o===(t??document.documentElement)?a=!0:o=o._$host??o.parentElement}while(o&&!a);return[s,l]},[Qo,Yo]=z([]),nu=e=>Qo().indexOf(e)===Qo().length-1,ru=e=>{let n=j({element:null,enabled:!0,hideScrollbar:!0,preventScrollbarShift:!0,preventScrollbarShiftMode:"padding",restoreScrollPosition:!0,allowPinchZoom:!1},e),t=qe(),r=[0,0],o=null,s=null;B(()=>{Me(n.enabled)&&(Yo(c=>[...c,t]),U(()=>{Yo(c=>c.filter(d=>d!==t))}))}),B(()=>{if(!Me(n.enabled)||!Me(n.hideScrollbar))return;let{body:c}=document,d=window.innerWidth-c.offsetWidth;if(Me(n.preventScrollbarShift)){let u={overflow:"hidden"},g=[];d>0&&(Me(n.preventScrollbarShiftMode)==="padding"?u.paddingRight=`calc(${window.getComputedStyle(c).paddingRight} + ${d}px)`:u.marginRight=`calc(${window.getComputedStyle(c).marginRight} + ${d}px)`,g.push({key:"--scrollbar-width",value:`${d}px`}));let f=window.scrollY,h=window.scrollX;Wo({key:"prevent-scroll",element:c,style:u,properties:g,cleanup:()=>{Me(n.restoreScrollPosition)&&d>0&&window.scrollTo(h,f)}})}else Wo({key:"prevent-scroll",element:c,style:{overflow:"hidden"}})}),B(()=>{!nu(t)||!Me(n.enabled)||(document.addEventListener("wheel",a,{passive:!1}),document.addEventListener("touchstart",l,{passive:!1}),document.addEventListener("touchmove",i,{passive:!1}),U(()=>{document.removeEventListener("wheel",a),document.removeEventListener("touchstart",l),document.removeEventListener("touchmove",i)}))});let l=c=>{r=Xo(c),o=null,s=null},a=c=>{let d=c.target,u=Me(n.element),g=ou(c),f=Math.abs(g[0])>Math.abs(g[1])?"x":"y",h=f==="x"?g[0]:g[1],v=Zo(d,f,h,u),y;u&&gr(u,d)?y=!v:y=!0,y&&c.cancelable&&c.preventDefault()},i=c=>{let d=Me(n.element),u=c.target,g;if(c.touches.length===2)g=!Me(n.allowPinchZoom);else{if(o==null||s===null){let f=Xo(c).map((v,y)=>r[y]-v),h=Math.abs(f[0])>Math.abs(f[1])?"x":"y";o=h,s=h==="x"?f[0]:f[1]}if(u.type==="range")g=!1;else{let f=Zo(u,o,s,d);d&&gr(d,u)?g=!f:g=!0}}g&&c.cancelable&&c.preventDefault()}},ou=e=>[e.deltaX,e.deltaY],Xo=e=>e.changedTouches[0]?[e.changedTouches[0].clientX,e.changedTouches[0].clientY]:[0,0],Zo=(e,n,t,r)=>{let o=r!==null&&gr(r,e),[s,l]=tu(e,n,o?r:void 0);return!(t>0&&Math.abs(s)<=1||t<0&&Math.abs(l)<1)},gr=(e,n)=>{if(e.contains(n))return!0;let t=n;for(;t;){if(t===e)return!0;t=t._$host??t.parentElement}return!1},iu=ru,su=iu,cs=be();function us(){return xe(cs)}function mt(){let e=us();if(e===void 0)throw new Error("[kobalte]: `useMenuContext` must be used within a `Menu` component");return e}var ds=be();function Ir(){let e=xe(ds);if(e===void 0)throw new Error("[kobalte]: `useMenuItemContext` must be used within a `Menu.Item` component");return e}var fs=be();function it(){let e=xe(fs);if(e===void 0)throw new Error("[kobalte]: `useMenuRootContext` must be used within a `MenuRoot` component");return e}function Dr(e){let n,t=it(),r=mt(),o=Q({id:t.generateId(`item-${qe()}`)},e),[s,l]=J(o,["ref","textValue","disabled","closeOnSelect","checked","indeterminate","onSelect","onPointerMove","onPointerLeave","onPointerDown","onPointerUp","onClick","onKeyDown","onMouseDown","onFocus"]),[a,i]=z(),[c,d]=z(),[u,g]=z(),f=()=>r.listState().selectionManager(),h=()=>l.id,v=()=>f().focusedKey()===h(),y=()=>{s.onSelect?.(),s.closeOnSelect&&setTimeout(()=>{r.close(!0)})};ha({getItem:()=>({ref:()=>n,type:"item",key:h(),textValue:s.textValue??u()?.textContent??n?.textContent??"",disabled:s.disabled??!1})});let m=Oi({key:h,selectionManager:f,shouldSelectOnPressUp:!0,allowsDifferentPressOrigin:!0,disabled:()=>s.disabled},()=>n),b=C=>{ce(C,s.onPointerMove),C.pointerType==="mouse"&&(s.disabled?r.onItemLeave(C):(r.onItemEnter(C),C.defaultPrevented||(Te(C.currentTarget),r.listState().selectionManager().setFocused(!0),r.listState().selectionManager().setFocusedKey(h()))))},x=C=>{ce(C,s.onPointerLeave),C.pointerType==="mouse"&&r.onItemLeave(C)},w=C=>{ce(C,s.onPointerUp),!s.disabled&&C.button===0&&y()},$=C=>{if(ce(C,s.onKeyDown),!C.repeat&&!s.disabled)switch(C.key){case"Enter":case" ":y();break}},F=M(()=>{if(s.indeterminate)return"mixed";if(s.checked!=null)return s.checked}),D=M(()=>({"data-indeterminate":s.indeterminate?"":void 0,"data-checked":s.checked&&!s.indeterminate?"":void 0,"data-disabled":s.disabled?"":void 0,"data-highlighted":v()?"":void 0})),P={isChecked:()=>s.checked,dataset:D,setLabelRef:g,generateId:vn(()=>l.id),registerLabel:Ge(i),registerDescription:Ge(d)};return p(ds.Provider,{value:P,get children(){return p(ue,j({as:"div",ref(C){let O=De(V=>n=V,s.ref);typeof O=="function"&&O(C)},get tabIndex(){return m.tabIndex()},get"aria-checked"(){return F()},get"aria-disabled"(){return s.disabled},get"aria-labelledby"(){return a()},get"aria-describedby"(){return c()},get"data-key"(){return m.dataKey()},get onPointerDown(){return we([s.onPointerDown,m.onPointerDown])},get onPointerUp(){return we([w,m.onPointerUp])},get onClick(){return we([s.onClick,m.onClick])},get onKeyDown(){return we([$,m.onKeyDown])},get onMouseDown(){return we([s.onMouseDown,m.onMouseDown])},get onFocus(){return we([s.onFocus,m.onFocus])},onPointerMove:b,onPointerLeave:x},D,l))}})}function gs(e){let n=Q({closeOnSelect:!1},e),[t,r]=J(n,["checked","defaultChecked","onChange","onSelect"]),o=ia({isSelected:()=>t.checked,defaultIsSelected:()=>t.defaultChecked,onSelectedChange:l=>t.onChange?.(l),isDisabled:()=>r.disabled});return p(Dr,j({role:"menuitemcheckbox",get checked(){return o.isSelected()},onSelect:()=>{t.onSelect?.(),o.toggle()}},r))}var lu=be();function Vn(){return xe(lu)}var hn={next:(e,n)=>e==="ltr"?n==="horizontal"?"ArrowRight":"ArrowDown":n==="horizontal"?"ArrowLeft":"ArrowUp",previous:(e,n)=>hn.next(e==="ltr"?"rtl":"ltr",n)},Jo={first:e=>e==="horizontal"?"ArrowDown":"ArrowRight",last:e=>e==="horizontal"?"ArrowUp":"ArrowLeft"};function hs(e){let n=it(),t=mt(),r=Vn(),{direction:o}=Mt(),s=Q({id:n.generateId("trigger")},e),[l,a]=J(s,["ref","id","disabled","onPointerDown","onClick","onKeyDown","onMouseOver","onFocus"]),i=()=>n.value();r!==void 0&&(i=()=>n.value()??l.id,r.lastValue()===void 0&&r.setLastValue(i));let c=Bn(()=>t.triggerRef(),()=>"button"),d=M(()=>c()==="a"&&t.triggerRef()?.getAttribute("href")!=null);B(et(()=>r?.value(),m=>{d()&&m===i()&&t.triggerRef()?.focus()}));let u=()=>{r!==void 0?t.isOpen()?r.value()===i()&&r.closeMenu():(r.autoFocusMenu()||r.setAutoFocusMenu(!0),t.open(!1)):t.toggle(!0)},g=m=>{ce(m,l.onPointerDown),m.currentTarget.dataset.pointerType=m.pointerType,!l.disabled&&m.pointerType!=="touch"&&m.button===0&&u()},f=m=>{ce(m,l.onClick),l.disabled||m.currentTarget.dataset.pointerType==="touch"&&u()},h=m=>{if(ce(m,l.onKeyDown),!l.disabled){if(d())switch(m.key){case"Enter":case" ":return}switch(m.key){case"Enter":case" ":case Jo.first(n.orientation()):m.stopPropagation(),m.preventDefault(),Xl(m.currentTarget),t.open("first"),r?.setAutoFocusMenu(!0),r?.setValue(i);break;case Jo.last(n.orientation()):m.stopPropagation(),m.preventDefault(),t.open("last");break;case hn.next(o(),n.orientation()):if(r===void 0)break;m.stopPropagation(),m.preventDefault(),r.nextMenu();break;case hn.previous(o(),n.orientation()):if(r===void 0)break;m.stopPropagation(),m.preventDefault(),r.previousMenu();break}}},v=m=>{ce(m,l.onMouseOver),t.triggerRef()?.dataset.pointerType!=="touch"&&!l.disabled&&r!==void 0&&r.value()!==void 0&&r.setValue(i)},y=m=>{ce(m,l.onFocus),r!==void 0&&m.currentTarget.dataset.pointerType!=="touch"&&r.setValue(i)};return B(()=>U(t.registerTriggerId(l.id))),p(wr,j({ref(m){let b=De(t.setTriggerRef,l.ref);typeof b=="function"&&b(m)},get"data-kb-menu-value-trigger"(){return n.value()},get id(){return l.id},get disabled(){return l.disabled},"aria-haspopup":"true",get"aria-expanded"(){return t.isOpen()},get"aria-controls"(){return M(()=>!!t.isOpen())()?t.contentId():void 0},get"data-highlighted"(){return i()!==void 0&&r?.value()===i()?!0:void 0},get tabIndex(){return r!==void 0?r.value()===i()||r.lastValue()===i()?0:-1:void 0},onPointerDown:g,onMouseOver:v,onClick:f,onKeyDown:h,onFocus:y,role:r!==void 0?"menuitem":void 0},()=>t.dataset(),a))}var au=be();function vs(){return xe(au)}function ps(e){let n,t=it(),r=mt(),o=Vn(),s=vs(),{direction:l}=Mt(),a=Q({id:t.generateId(`content-${qe()}`)},e),[i,c]=J(a,["ref","id","style","onOpenAutoFocus","onCloseAutoFocus","onEscapeKeyDown","onFocusOutside","onPointerEnter","onPointerMove","onKeyDown","onMouseDown","onFocusIn","onFocusOut"]),d=0,u=()=>r.parentMenuContext()==null&&o===void 0&&t.isModal(),g=jc({selectionManager:r.listState().selectionManager,collection:r.listState().collection,autoFocus:r.autoFocus,deferAutoFocus:!0,shouldFocusWrap:!0,disallowTypeAhead:()=>!r.listState().selectionManager().isFocused(),orientation:()=>t.orientation()==="horizontal"?"vertical":"horizontal"},()=>n);Wc({trapFocus:()=>u()&&r.isOpen(),onMountAutoFocus:x=>{o===void 0&&i.onOpenAutoFocus?.(x)},onUnmountAutoFocus:i.onCloseAutoFocus},()=>n);let f=x=>{if(Ue(x.currentTarget,x.target)&&(x.key==="Tab"&&r.isOpen()&&x.preventDefault(),o!==void 0&&x.currentTarget.getAttribute("aria-haspopup")!=="true"))switch(x.key){case hn.next(l(),t.orientation()):x.stopPropagation(),x.preventDefault(),r.close(!0),o.setAutoFocusMenu(!0),o.nextMenu();break;case hn.previous(l(),t.orientation()):if(x.currentTarget.hasAttribute("data-closed"))break;x.stopPropagation(),x.preventDefault(),r.close(!0),o.setAutoFocusMenu(!0),o.previousMenu();break}},h=x=>{i.onEscapeKeyDown?.(x),o?.setAutoFocusMenu(!1),r.close(!0)},v=x=>{i.onFocusOutside?.(x),t.isModal()&&x.preventDefault()},y=x=>{ce(x,i.onPointerEnter),r.isOpen()&&(r.parentMenuContext()?.listState().selectionManager().setFocused(!1),r.parentMenuContext()?.listState().selectionManager().setFocusedKey(void 0))},m=x=>{if(ce(x,i.onPointerMove),x.pointerType!=="mouse")return;let w=x.target,$=d!==x.clientX;Ue(x.currentTarget,w)&&$&&(r.setPointerDir(x.clientX>d?"right":"left"),d=x.clientX)};B(()=>U(r.registerContentId(i.id)));let b={ref:De(x=>{r.setContentRef(x),n=x},i.ref),role:"menu",get id(){return i.id},get tabIndex(){return g.tabIndex()},get"aria-labelledby"(){return r.triggerId()},onKeyDown:we([i.onKeyDown,g.onKeyDown,f]),onMouseDown:we([i.onMouseDown,g.onMouseDown]),onFocusIn:we([i.onFocusIn,g.onFocusIn]),onFocusOut:we([i.onFocusOut,g.onFocusOut]),onPointerEnter:y,onPointerMove:m,get"data-orientation"(){return t.orientation()}};return p(K,{get when(){return r.contentPresent()},get children(){return p(K,{get when(){return s===void 0||r.parentMenuContext()!=null},get fallback(){return p(ue,j({as:"div"},()=>r.dataset(),b,c))},get children(){return p(Qi.Positioner,{get children(){return p(Gc,j({get disableOutsidePointerEvents(){return M(()=>!!u())()&&r.isOpen()},get excludedElements(){return[r.triggerRef]},bypassTopMostLayerCheck:!0,get style(){return Rn({"--kb-menu-content-transform-origin":"var(--kb-popper-content-transform-origin)",position:"relative"},i.style)},onEscapeKeyDown:h,onFocusOutside:v,get onDismiss(){return r.close}},()=>r.dataset(),b,c))}})}})}})}function cu(e){let n,t=it(),r=mt(),[o,s]=J(e,["ref"]);return su({element:()=>n??null,enabled:()=>r.contentPresent()&&t.preventScroll()}),p(ps,j({ref(l){let a=De(i=>{n=i},o.ref);typeof a=="function"&&a(l)}},s))}var ys=be();function uu(){let e=xe(ys);if(e===void 0)throw new Error("[kobalte]: `useMenuGroupContext` must be used within a `Menu.Group` component");return e}function Pr(e){let n=it(),t=Q({id:n.generateId(`group-${qe()}`)},e),[r,o]=z(),s={generateId:vn(()=>t.id),registerLabelId:Ge(o)};return p(ys.Provider,{value:s,get children(){return p(ue,j({as:"div",role:"group",get"aria-labelledby"(){return r()}},t))}})}function ms(e){let n=uu(),t=Q({id:n.generateId("label")},e),[r,o]=J(t,["id"]);return B(()=>U(n.registerLabelId(r.id))),p(ue,j({as:"span",get id(){return r.id},"aria-hidden":"true"},o))}function bs(e){let n=mt(),t=Q({children:"\u25BC"},e);return p(ue,j({as:"span","aria-hidden":"true"},()=>n.dataset(),t))}function xs(e){return p(Dr,j({role:"menuitem",closeOnSelect:!0},e))}function ws(e){let n=Ir(),t=Q({id:n.generateId("description")},e),[r,o]=J(t,["id"]);return B(()=>U(n.registerDescription(r.id))),p(ue,j({as:"div",get id(){return r.id}},()=>n.dataset(),o))}function $s(e){let n=Ir(),t=Q({id:n.generateId("indicator")},e),[r,o]=J(t,["forceMount"]);return p(K,{get when(){return r.forceMount||n.isChecked()},get children(){return p(ue,j({as:"div"},()=>n.dataset(),o))}})}function Cs(e){let n=Ir(),t=Q({id:n.generateId("label")},e),[r,o]=J(t,["ref","id"]);return B(()=>U(n.registerLabel(r.id))),p(ue,j({as:"div",ref(s){let l=De(n.setLabelRef,r.ref);typeof l=="function"&&l(s)},get id(){return r.id}},()=>n.dataset(),o))}function Ss(e){let n=mt();return p(K,{get when(){return n.contentPresent()},get children(){return p(Yn,e)}})}var ks=be();function du(){let e=xe(ks);if(e===void 0)throw new Error("[kobalte]: `useMenuRadioGroupContext` must be used within a `Menu.RadioGroup` component");return e}function Es(e){let t=it().generateId(`radiogroup-${qe()}`),r=Q({id:t},e),[o,s]=J(r,["value","defaultValue","onChange","disabled"]),[l,a]=yn({value:()=>o.value,defaultValue:()=>o.defaultValue,onChange:c=>o.onChange?.(c)}),i={isDisabled:()=>o.disabled,isSelectedValue:c=>c===l(),setSelectedValue:a};return p(ks.Provider,{value:i,get children(){return p(Pr,s)}})}function Ms(e){let n=du(),t=Q({closeOnSelect:!1},e),[r,o]=J(t,["value","onSelect"]);return p(Dr,j({role:"menuitemradio",get checked(){return n.isSelectedValue(r.value)},onSelect:()=>{r.onSelect?.(),n.setSelectedValue(r.value)}},o))}function fu(e,n,t){let r=e.split("-")[0],o=t.getBoundingClientRect(),s=[],l=n.clientX,a=n.clientY;switch(r){case"top":s.push([l,a+5]),s.push([o.left,o.bottom]),s.push([o.left,o.top]),s.push([o.right,o.top]),s.push([o.right,o.bottom]);break;case"right":s.push([l-5,a]),s.push([o.left,o.top]),s.push([o.right,o.top]),s.push([o.right,o.bottom]),s.push([o.left,o.bottom]);break;case"bottom":s.push([l,a-5]),s.push([o.right,o.top]),s.push([o.right,o.bottom]),s.push([o.left,o.bottom]),s.push([o.left,o.top]);break;case"left":s.push([l+5,a]),s.push([o.right,o.bottom]),s.push([o.left,o.bottom]),s.push([o.left,o.top]),s.push([o.right,o.top]);break}return s}function gu(e,n){return n?Yl([e.clientX,e.clientY],n):!1}function Ts(e){let n=it(),t=Mi(),r=us(),o=Vn(),s=vs(),l=Q({placement:n.orientation()==="horizontal"?"bottom-start":"right-start"},e),[a,i]=J(l,["open","defaultOpen","onOpenChange"]),c=0,d=null,u="right",[g,f]=z(),[h,v]=z(),[y,m]=z(),[b,x]=z(),[w,$]=z(!0),[F,D]=z(i.placement),[P,C]=z([]),[O,V]=z([]),{DomCollectionProvider:G}=ga({items:O,onItemsChange:V}),Y=Xi({open:()=>a.open,defaultOpen:()=>a.defaultOpen,onOpenChange:H=>a.onOpenChange?.(H)}),{present:Ce}=Li({show:()=>n.forceMount()||Y.isOpen(),element:()=>b()??null}),te=Da({selectionMode:"none",dataSource:O}),ne=H=>{$(H),Y.open()},ge=(H=!1)=>{Y.close(),H&&r&&r.close(!0)},oe=H=>{$(H),Y.toggle()},he=()=>{let H=b();H&&(Te(H),te.selectionManager().setFocused(!0),te.selectionManager().setFocusedKey(void 0))},ie=()=>{s!=null?setTimeout(()=>he()):he()},de=H=>{C(ke=>[...ke,H]);let je=r?.registerNestedMenu(H);return()=>{C(ke=>sr(ke,H)),je?.()}},fe=H=>u===d?.side&&gu(H,d?.area),Ae=H=>{fe(H)&&H.preventDefault()},T=H=>{fe(H)||ie()},ve=H=>{fe(H)&&H.preventDefault()};Yc({isDisabled:()=>!(r==null&&Y.isOpen()&&n.isModal()),targets:()=>[b(),...P()].filter(Boolean)}),B(()=>{let H=b();if(!H||!r)return;let je=r.registerNestedMenu(H);U(()=>{je()})}),B(()=>{r===void 0&&o?.registerMenu(n.value(),[b(),...P()])}),B(()=>{r!==void 0||o===void 0||(o.value()===n.value()?(y()?.focus(),o.autoFocusMenu()&&ne(!0)):ge())}),B(()=>{r!==void 0||o===void 0||Y.isOpen()&&o.setValue(n.value())}),U(()=>{r===void 0&&o?.unregisterMenu(n.value())});let bt={dataset:M(()=>({"data-expanded":Y.isOpen()?"":void 0,"data-closed":Y.isOpen()?void 0:""})),isOpen:Y.isOpen,contentPresent:Ce,nestedMenus:P,currentPlacement:F,pointerGraceTimeoutId:()=>c,autoFocus:w,listState:()=>te,parentMenuContext:()=>r,triggerRef:y,contentRef:b,triggerId:g,contentId:h,setTriggerRef:m,setContentRef:x,open:ne,close:ge,toggle:oe,focusContent:ie,onItemEnter:Ae,onItemLeave:T,onTriggerLeave:ve,setPointerDir:H=>u=H,setPointerGraceTimeoutId:H=>c=H,setPointerGraceIntent:H=>d=H,registerNestedMenu:de,registerItemToParentDomCollection:t?.registerItem,registerTriggerId:Ge(f),registerContentId:Ge(v)};return p(G,{get children(){return p(cs.Provider,{value:bt,get children(){return p(K,{when:s===void 0,get fallback(){return i.children},get children(){return p(Qi,j({anchorRef:y,contentRef:b,onCurrentPlacementChange:D},i))}})}})}})}function As(e){let{direction:n}=Mt();return p(Ts,j({get placement(){return n()==="rtl"?"left-start":"right-start"},flip:!0},e))}var hu={close:(e,n)=>e==="ltr"?[n==="horizontal"?"ArrowLeft":"ArrowUp"]:[n==="horizontal"?"ArrowRight":"ArrowDown"]};function Is(e){let n=mt(),t=it(),[r,o]=J(e,["onFocusOutside","onKeyDown"]),{direction:s}=Mt();return p(ps,j({onOpenAutoFocus:d=>{d.preventDefault()},onCloseAutoFocus:d=>{d.preventDefault()},onFocusOutside:d=>{r.onFocusOutside?.(d);let u=d.target;Ue(n.triggerRef(),u)||n.close()},onKeyDown:d=>{ce(d,r.onKeyDown);let u=Ue(d.currentTarget,d.target),g=hu.close(s(),t.orientation()).includes(d.key),f=n.parentMenuContext()!=null;u&&g&&f&&(n.close(),Te(n.triggerRef()))}},o))}var ei=["Enter"," "],vu={open:(e,n)=>e==="ltr"?[...ei,n==="horizontal"?"ArrowRight":"ArrowDown"]:[...ei,n==="horizontal"?"ArrowLeft":"ArrowUp"]};function Ds(e){let n,t=it(),r=mt(),o=Q({id:t.generateId(`sub-trigger-${qe()}`)},e),[s,l]=J(o,["ref","id","textValue","disabled","onPointerMove","onPointerLeave","onPointerDown","onPointerUp","onClick","onKeyDown","onMouseDown","onFocus"]),a=null,i=()=>{Ee||(a&&window.clearTimeout(a),a=null)},{direction:c}=Mt(),d=()=>s.id,u=()=>{let x=r.parentMenuContext();if(x==null)throw new Error("[kobalte]: `Menu.SubTrigger` must be used within a `Menu.Sub` component");return x.listState().selectionManager()},g=()=>r.listState().collection(),f=()=>u().focusedKey()===d(),h=Oi({key:d,selectionManager:u,shouldSelectOnPressUp:!0,allowsDifferentPressOrigin:!0,disabled:()=>s.disabled},()=>n),v=x=>{ce(x,s.onClick),!r.isOpen()&&!s.disabled&&r.open(!0)},y=x=>{if(ce(x,s.onPointerMove),x.pointerType!=="mouse")return;let w=r.parentMenuContext();if(w?.onItemEnter(x),!x.defaultPrevented){if(s.disabled){w?.onItemLeave(x);return}!r.isOpen()&&!a&&(r.parentMenuContext()?.setPointerGraceIntent(null),a=window.setTimeout(()=>{r.open(!1),i()},100)),w?.onItemEnter(x),x.defaultPrevented||(r.listState().selectionManager().isFocused()&&(r.listState().selectionManager().setFocused(!1),r.listState().selectionManager().setFocusedKey(void 0)),Te(x.currentTarget),w?.listState().selectionManager().setFocused(!0),w?.listState().selectionManager().setFocusedKey(d()))}},m=x=>{if(ce(x,s.onPointerLeave),x.pointerType!=="mouse")return;i();let w=r.parentMenuContext(),$=r.contentRef();if($){w?.setPointerGraceIntent({area:fu(r.currentPlacement(),x,$),side:r.currentPlacement().split("-")[0]}),window.clearTimeout(w?.pointerGraceTimeoutId());let F=window.setTimeout(()=>{w?.setPointerGraceIntent(null)},300);w?.setPointerGraceTimeoutId(F)}else{if(w?.onTriggerLeave(x),x.defaultPrevented)return;w?.setPointerGraceIntent(null)}w?.onItemLeave(x)},b=x=>{ce(x,s.onKeyDown),!x.repeat&&(s.disabled||vu.open(c(),t.orientation()).includes(x.key)&&(x.stopPropagation(),x.preventDefault(),u().setFocused(!1),u().setFocusedKey(void 0),r.isOpen()||r.open("first"),r.focusContent(),r.listState().selectionManager().setFocused(!0),r.listState().selectionManager().setFocusedKey(g().getFirstKey())))};return B(()=>{if(r.registerItemToParentDomCollection==null)throw new Error("[kobalte]: `Menu.SubTrigger` must be used within a `Menu.Sub` component");let x=r.registerItemToParentDomCollection({ref:()=>n,type:"item",key:d(),textValue:s.textValue??n?.textContent??"",disabled:s.disabled??!1});U(x)}),B(et(()=>r.parentMenuContext()?.pointerGraceTimeoutId(),x=>{U(()=>{window.clearTimeout(x),r.parentMenuContext()?.setPointerGraceIntent(null)})})),B(()=>U(r.registerTriggerId(s.id))),U(()=>{i()}),p(ue,j({as:"div",ref(x){let w=De($=>{r.setTriggerRef($),n=$},s.ref);typeof w=="function"&&w(x)},get id(){return s.id},role:"menuitem",get tabIndex(){return h.tabIndex()},"aria-haspopup":"true",get"aria-expanded"(){return r.isOpen()},get"aria-controls"(){return M(()=>!!r.isOpen())()?r.contentId():void 0},get"aria-disabled"(){return s.disabled},get"data-key"(){return h.dataKey()},get"data-highlighted"(){return f()?"":void 0},get"data-disabled"(){return s.disabled?"":void 0},get onPointerDown(){return we([s.onPointerDown,h.onPointerDown])},get onPointerUp(){return we([s.onPointerUp,h.onPointerUp])},get onClick(){return we([v,h.onClick])},get onKeyDown(){return we([b,h.onKeyDown])},get onMouseDown(){return we([s.onMouseDown,h.onMouseDown])},get onFocus(){return we([s.onFocus,h.onFocus])},onPointerMove:y,onPointerLeave:m},()=>r.dataset(),l))}function pu(e){let n=Vn(),t=`menu-${qe()}`,r=Q({id:t,modal:!0},e),[o,s]=J(r,["id","modal","preventScroll","forceMount","open","defaultOpen","onOpenChange","value","orientation"]),l=Xi({open:()=>o.open,defaultOpen:()=>o.defaultOpen,onOpenChange:i=>o.onOpenChange?.(i)}),a={isModal:()=>o.modal??!0,preventScroll:()=>o.preventScroll??a.isModal(),forceMount:()=>o.forceMount??!1,generateId:vn(()=>o.id),value:()=>o.value,orientation:()=>o.orientation??n?.orientation()??"horizontal"};return p(fs.Provider,{value:a,get children(){return p(Ts,j({get open(){return l.isOpen()},get onOpenChange(){return l.setIsOpen}},s))}})}var yu={};Nn(yu,{Root:()=>Hn,Separator:()=>mu});function Hn(e){let n,t=Q({orientation:"horizontal"},e),[r,o]=J(t,["ref","orientation"]),s=Bn(()=>n,()=>"hr");return p(ue,j({as:"hr",ref(l){let a=De(i=>n=i,r.ref);typeof a=="function"&&a(l)},get role(){return s()!=="hr"?"separator":void 0},get"aria-orientation"(){return r.orientation==="vertical"?"vertical":void 0},get"data-orientation"(){return r.orientation}},o))}var mu=Hn,ye={};Nn(ye,{Arrow:()=>Ar,CheckboxItem:()=>gs,Content:()=>Ps,DropdownMenu:()=>bu,Group:()=>Pr,GroupLabel:()=>ms,Icon:()=>bs,Item:()=>xs,ItemDescription:()=>ws,ItemIndicator:()=>$s,ItemLabel:()=>Cs,Portal:()=>Ss,RadioGroup:()=>Es,RadioItem:()=>Ms,Root:()=>qs,Separator:()=>Hn,Sub:()=>As,SubContent:()=>Is,SubTrigger:()=>Ds,Trigger:()=>hs});function Ps(e){let n=it(),t=mt(),[r,o]=J(e,["onCloseAutoFocus","onInteractOutside"]),s=!1;return p(cu,j({onCloseAutoFocus:i=>{r.onCloseAutoFocus?.(i),s||Te(t.triggerRef()),s=!1,i.preventDefault()},onInteractOutside:i=>{r.onInteractOutside?.(i),(!n.isModal()||i.detail.isContextMenu)&&(s=!0)}},o))}function qs(e){let n=`dropdownmenu-${qe()}`,t=Q({id:n},e);return p(pu,t)}var bu=Object.assign(qs,{Arrow:Ar,CheckboxItem:gs,Content:Ps,Group:Pr,GroupLabel:ms,Icon:bs,Item:xs,ItemDescription:ws,ItemIndicator:$s,ItemLabel:Cs,Portal:Ss,RadioGroup:Es,RadioItem:Ms,Separator:Hn,Sub:As,SubContent:Is,SubTrigger:Ds,Trigger:hs}),S={colors:{inherit:"inherit",current:"currentColor",transparent:"transparent",black:"#000000",white:"#ffffff",neutral:{50:"#f9fafb",100:"#f2f4f7",200:"#eaecf0",300:"#d0d5dd",400:"#98a2b3",500:"#667085",600:"#475467",700:"#344054",800:"#1d2939",900:"#101828"},darkGray:{50:"#525c7a",100:"#49536e",200:"#414962",300:"#394056",400:"#313749",500:"#292e3d",600:"#212530",700:"#191c24",800:"#111318",900:"#0b0d10"},gray:{50:"#f9fafb",100:"#f2f4f7",200:"#eaecf0",300:"#d0d5dd",400:"#98a2b3",500:"#667085",600:"#475467",700:"#344054",800:"#1d2939",900:"#101828"},blue:{25:"#F5FAFF",50:"#EFF8FF",100:"#D1E9FF",200:"#B2DDFF",300:"#84CAFF",400:"#53B1FD",500:"#2E90FA",600:"#1570EF",700:"#175CD3",800:"#1849A9",900:"#194185"},green:{25:"#F6FEF9",50:"#ECFDF3",100:"#D1FADF",200:"#A6F4C5",300:"#6CE9A6",400:"#32D583",500:"#12B76A",600:"#039855",700:"#027A48",800:"#05603A",900:"#054F31"},red:{50:"#fef2f2",100:"#fee2e2",200:"#fecaca",300:"#fca5a5",400:"#f87171",500:"#ef4444",600:"#dc2626",700:"#b91c1c",800:"#991b1b",900:"#7f1d1d",950:"#450a0a"},yellow:{25:"#FFFCF5",50:"#FFFAEB",100:"#FEF0C7",200:"#FEDF89",300:"#FEC84B",400:"#FDB022",500:"#F79009",600:"#DC6803",700:"#B54708",800:"#93370D",900:"#7A2E0E"},purple:{25:"#FAFAFF",50:"#F4F3FF",100:"#EBE9FE",200:"#D9D6FE",300:"#BDB4FE",400:"#9B8AFB",500:"#7A5AF8",600:"#6938EF",700:"#5925DC",800:"#4A1FB8",900:"#3E1C96"},teal:{25:"#F6FEFC",50:"#F0FDF9",100:"#CCFBEF",200:"#99F6E0",300:"#5FE9D0",400:"#2ED3B7",500:"#15B79E",600:"#0E9384",700:"#107569",800:"#125D56",900:"#134E48"},pink:{25:"#fdf2f8",50:"#fce7f3",100:"#fbcfe8",200:"#f9a8d4",300:"#f472b6",400:"#ec4899",500:"#db2777",600:"#be185d",700:"#9d174d",800:"#831843",900:"#500724"},cyan:{25:"#ecfeff",50:"#cffafe",100:"#a5f3fc",200:"#67e8f9",300:"#22d3ee",400:"#06b6d4",500:"#0891b2",600:"#0e7490",700:"#155e75",800:"#164e63",900:"#083344"}},alpha:{100:"ff",90:"e5",80:"cc",70:"b3",60:"99",50:"80",40:"66",30:"4d",20:"33",10:"1a",0:"00"},font:{size:{"2xs":"calc(var(--tsqd-font-size) * 0.625)",xs:"calc(var(--tsqd-font-size) * 0.75)",sm:"calc(var(--tsqd-font-size) * 0.875)",md:"var(--tsqd-font-size)",lg:"calc(var(--tsqd-font-size) * 1.125)",xl:"calc(var(--tsqd-font-size) * 1.25)","2xl":"calc(var(--tsqd-font-size) * 1.5)","3xl":"calc(var(--tsqd-font-size) * 1.875)","4xl":"calc(var(--tsqd-font-size) * 2.25)","5xl":"calc(var(--tsqd-font-size) * 3)","6xl":"calc(var(--tsqd-font-size) * 3.75)","7xl":"calc(var(--tsqd-font-size) * 4.5)","8xl":"calc(var(--tsqd-font-size) * 6)","9xl":"calc(var(--tsqd-font-size) * 8)"},lineHeight:{xs:"calc(var(--tsqd-font-size) * 1)",sm:"calc(var(--tsqd-font-size) * 1.25)",md:"calc(var(--tsqd-font-size) * 1.5)",lg:"calc(var(--tsqd-font-size) * 1.75)",xl:"calc(var(--tsqd-font-size) * 2)","2xl":"calc(var(--tsqd-font-size) * 2.25)","3xl":"calc(var(--tsqd-font-size) * 2.5)","4xl":"calc(var(--tsqd-font-size) * 2.75)","5xl":"calc(var(--tsqd-font-size) * 3)","6xl":"calc(var(--tsqd-font-size) * 3.25)","7xl":"calc(var(--tsqd-font-size) * 3.5)","8xl":"calc(var(--tsqd-font-size) * 3.75)","9xl":"calc(var(--tsqd-font-size) * 4)"},weight:{thin:"100",extralight:"200",light:"300",normal:"400",medium:"500",semibold:"600",bold:"700",extrabold:"800",black:"900"}},breakpoints:{xs:"320px",sm:"640px",md:"768px",lg:"1024px",xl:"1280px","2xl":"1536px"},border:{radius:{none:"0px",xs:"calc(var(--tsqd-font-size) * 0.125)",sm:"calc(var(--tsqd-font-size) * 0.25)",md:"calc(var(--tsqd-font-size) * 0.375)",lg:"calc(var(--tsqd-font-size) * 0.5)",xl:"calc(var(--tsqd-font-size) * 0.75)","2xl":"calc(var(--tsqd-font-size) * 1)","3xl":"calc(var(--tsqd-font-size) * 1.5)",full:"9999px"}},size:{0:"0px",.25:"calc(var(--tsqd-font-size) * 0.0625)",.5:"calc(var(--tsqd-font-size) * 0.125)",1:"calc(var(--tsqd-font-size) * 0.25)",1.5:"calc(var(--tsqd-font-size) * 0.375)",2:"calc(var(--tsqd-font-size) * 0.5)",2.5:"calc(var(--tsqd-font-size) * 0.625)",3:"calc(var(--tsqd-font-size) * 0.75)",3.5:"calc(var(--tsqd-font-size) * 0.875)",4:"calc(var(--tsqd-font-size) * 1)",4.5:"calc(var(--tsqd-font-size) * 1.125)",5:"calc(var(--tsqd-font-size) * 1.25)",5.5:"calc(var(--tsqd-font-size) * 1.375)",6:"calc(var(--tsqd-font-size) * 1.5)",6.5:"calc(var(--tsqd-font-size) * 1.625)",7:"calc(var(--tsqd-font-size) * 1.75)",8:"calc(var(--tsqd-font-size) * 2)",9:"calc(var(--tsqd-font-size) * 2.25)",10:"calc(var(--tsqd-font-size) * 2.5)",11:"calc(var(--tsqd-font-size) * 2.75)",12:"calc(var(--tsqd-font-size) * 3)",14:"calc(var(--tsqd-font-size) * 3.5)",16:"calc(var(--tsqd-font-size) * 4)",20:"calc(var(--tsqd-font-size) * 5)",24:"calc(var(--tsqd-font-size) * 6)",28:"calc(var(--tsqd-font-size) * 7)",32:"calc(var(--tsqd-font-size) * 8)",36:"calc(var(--tsqd-font-size) * 9)",40:"calc(var(--tsqd-font-size) * 10)",44:"calc(var(--tsqd-font-size) * 11)",48:"calc(var(--tsqd-font-size) * 12)",52:"calc(var(--tsqd-font-size) * 13)",56:"calc(var(--tsqd-font-size) * 14)",60:"calc(var(--tsqd-font-size) * 15)",64:"calc(var(--tsqd-font-size) * 16)",72:"calc(var(--tsqd-font-size) * 18)",80:"calc(var(--tsqd-font-size) * 20)",96:"calc(var(--tsqd-font-size) * 24)"},shadow:{xs:(e="rgb(0 0 0 / 0.1)")=>"0 1px 2px 0 rgb(0 0 0 / 0.05)",sm:(e="rgb(0 0 0 / 0.1)")=>`0 1px 3px 0 ${e}, 0 1px 2px -1px ${e}`,md:(e="rgb(0 0 0 / 0.1)")=>`0 4px 6px -1px ${e}, 0 2px 4px -2px ${e}`,lg:(e="rgb(0 0 0 / 0.1)")=>`0 10px 15px -3px ${e}, 0 4px 6px -4px ${e}`,xl:(e="rgb(0 0 0 / 0.1)")=>`0 20px 25px -5px ${e}, 0 8px 10px -6px ${e}`,"2xl":(e="rgb(0 0 0 / 0.25)")=>`0 25px 50px -12px ${e}`,inner:(e="rgb(0 0 0 / 0.05)")=>`inset 0 2px 4px 0 ${e}`,none:()=>"none"},zIndices:{hide:-1,auto:"auto",base:0,docked:10,dropdown:1e3,sticky:1100,banner:1200,overlay:1300,modal:1400,popover:1500,skipLink:1600,toast:1700,tooltip:1800}},xu=_('<svg width=14 height=14 viewBox="0 0 14 14"fill=none xmlns=http://www.w3.org/2000/svg><path d="M13 13L9.00007 9M10.3333 5.66667C10.3333 8.244 8.244 10.3333 5.66667 10.3333C3.08934 10.3333 1 8.244 1 5.66667C1 3.08934 3.08934 1 5.66667 1C8.244 1 10.3333 3.08934 10.3333 5.66667Z"stroke=currentColor stroke-width=1.66667 stroke-linecap=round stroke-linejoin=round>'),wu=_('<svg width=24 height=24 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M9 3H15M3 6H21M19 6L18.2987 16.5193C18.1935 18.0975 18.1409 18.8867 17.8 19.485C17.4999 20.0118 17.0472 20.4353 16.5017 20.6997C15.882 21 15.0911 21 13.5093 21H10.4907C8.90891 21 8.11803 21 7.49834 20.6997C6.95276 20.4353 6.50009 20.0118 6.19998 19.485C5.85911 18.8867 5.8065 18.0975 5.70129 16.5193L5 6M10 10.5V15.5M14 10.5V15.5"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>'),$u=_('<svg width=10 height=6 viewBox="0 0 10 6"fill=none xmlns=http://www.w3.org/2000/svg><path d="M1 1L5 5L9 1"stroke=currentColor stroke-width=1.66667 stroke-linecap=round stroke-linejoin=round>'),Cu=_('<svg width=12 height=12 viewBox="0 0 16 16"fill=none xmlns=http://www.w3.org/2000/svg><path d="M8 13.3333V2.66667M8 2.66667L4 6.66667M8 2.66667L12 6.66667"stroke=currentColor stroke-width=1.66667 stroke-linecap=round stroke-linejoin=round>'),qr=_('<svg width=12 height=12 viewBox="0 0 16 16"fill=none xmlns=http://www.w3.org/2000/svg><path d="M8 2.66667V13.3333M8 13.3333L4 9.33333M8 13.3333L12 9.33333"stroke=currentColor stroke-width=1.66667 stroke-linecap=round stroke-linejoin=round>'),Su=_('<svg viewBox="0 0 24 24"height=12 width=12 fill=none xmlns=http://www.w3.org/2000/svg><path d="M12 2v2m0 16v2M4 12H2m4.314-5.686L4.9 4.9m12.786 1.414L19.1 4.9M6.314 17.69 4.9 19.104m12.786-1.414 1.414 1.414M22 12h-2m-3 0a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>'),ku=_('<svg viewBox="0 0 24 24"height=12 width=12 fill=none xmlns=http://www.w3.org/2000/svg><path d="M22 15.844a10.424 10.424 0 0 1-4.306.925c-5.779 0-10.463-4.684-10.463-10.462 0-1.536.33-2.994.925-4.307A10.464 10.464 0 0 0 2 11.538C2 17.316 6.684 22 12.462 22c4.243 0 7.896-2.526 9.538-6.156Z"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>'),Eu=_('<svg viewBox="0 0 24 24"height=12 width=12 fill=none xmlns=http://www.w3.org/2000/svg><path d="M8 21h8m-4-4v4m-5.2-4h10.4c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.311-1.311C22 14.72 22 13.88 22 12.2V7.8c0-1.68 0-2.52-.327-3.162a3 3 0 0 0-1.311-1.311C19.72 3 18.88 3 17.2 3H6.8c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C2 5.28 2 6.12 2 7.8v4.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311C4.28 17 5.12 17 6.8 17Z"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>'),Mu=_('<svg stroke=currentColor fill=currentColor stroke-width=0 viewBox="0 0 24 24"height=1em width=1em xmlns=http://www.w3.org/2000/svg><path fill=none d="M0 0h24v24H0z"></path><path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3a4.237 4.237 0 00-6 0zm-4-4l2 2a7.074 7.074 0 0110 0l2-2C15.14 9.14 8.87 9.14 5 13z">'),Tu=_('<svg stroke-width=0 viewBox="0 0 24 24"height=1em width=1em xmlns=http://www.w3.org/2000/svg><path fill=none d="M24 .01c0-.01 0-.01 0 0L0 0v24h24V.01zM0 0h24v24H0V0zm0 0h24v24H0V0z"></path><path d="M22.99 9C19.15 5.16 13.8 3.76 8.84 4.78l2.52 2.52c3.47-.17 6.99 1.05 9.63 3.7l2-2zm-4 4a9.793 9.793 0 00-4.49-2.56l3.53 3.53.96-.97zM2 3.05L5.07 6.1C3.6 6.82 2.22 7.78 1 9l1.99 2c1.24-1.24 2.67-2.16 4.2-2.77l2.24 2.24A9.684 9.684 0 005 13v.01L6.99 15a7.042 7.042 0 014.92-2.06L18.98 20l1.27-1.26L3.29 1.79 2 3.05zM9 17l3 3 3-3a4.237 4.237 0 00-6 0z">'),Au=_('<svg width=24 height=24 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M9.3951 19.3711L9.97955 20.6856C10.1533 21.0768 10.4368 21.4093 10.7958 21.6426C11.1547 21.8759 11.5737 22.0001 12.0018 22C12.4299 22.0001 12.8488 21.8759 13.2078 21.6426C13.5667 21.4093 13.8503 21.0768 14.024 20.6856L14.6084 19.3711C14.8165 18.9047 15.1664 18.5159 15.6084 18.26C16.0532 18.0034 16.5678 17.8941 17.0784 17.9478L18.5084 18.1C18.9341 18.145 19.3637 18.0656 19.7451 17.8713C20.1265 17.6771 20.4434 17.3763 20.6573 17.0056C20.8715 16.635 20.9735 16.2103 20.9511 15.7829C20.9286 15.3555 20.7825 14.9438 20.5307 14.5978L19.684 13.4344C19.3825 13.0171 19.2214 12.5148 19.224 12C19.2239 11.4866 19.3865 10.9864 19.6884 10.5711L20.5351 9.40778C20.787 9.06175 20.933 8.65007 20.9555 8.22267C20.978 7.79528 20.8759 7.37054 20.6618 7C20.4479 6.62923 20.131 6.32849 19.7496 6.13423C19.3681 5.93997 18.9386 5.86053 18.5129 5.90556L17.0829 6.05778C16.5722 6.11141 16.0577 6.00212 15.6129 5.74556C15.17 5.48825 14.82 5.09736 14.6129 4.62889L14.024 3.31444C13.8503 2.92317 13.5667 2.59072 13.2078 2.3574C12.8488 2.12408 12.4299 1.99993 12.0018 2C11.5737 1.99993 11.1547 2.12408 10.7958 2.3574C10.4368 2.59072 10.1533 2.92317 9.97955 3.31444L9.3951 4.62889C9.18803 5.09736 8.83798 5.48825 8.3951 5.74556C7.95032 6.00212 7.43577 6.11141 6.9251 6.05778L5.49066 5.90556C5.06499 5.86053 4.6354 5.93997 4.25397 6.13423C3.87255 6.32849 3.55567 6.62923 3.34177 7C3.12759 7.37054 3.02555 7.79528 3.04804 8.22267C3.07052 8.65007 3.21656 9.06175 3.46844 9.40778L4.3151 10.5711C4.61704 10.9864 4.77964 11.4866 4.77955 12C4.77964 12.5134 4.61704 13.0137 4.3151 13.4289L3.46844 14.5922C3.21656 14.9382 3.07052 15.3499 3.04804 15.7773C3.02555 16.2047 3.12759 16.6295 3.34177 17C3.55589 17.3706 3.8728 17.6712 4.25417 17.8654C4.63554 18.0596 5.06502 18.1392 5.49066 18.0944L6.92066 17.9422C7.43133 17.8886 7.94587 17.9979 8.39066 18.2544C8.83519 18.511 9.18687 18.902 9.3951 19.3711Z"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round></path><path d="M12 15C13.6568 15 15 13.6569 15 12C15 10.3431 13.6568 9 12 9C10.3431 9 8.99998 10.3431 8.99998 12C8.99998 13.6569 10.3431 15 12 15Z"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>'),Iu=_('<svg width=24 height=24 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M16 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V8M11.5 12.5L17 7M17 7H12M17 7V12M6.2 21H8.8C9.9201 21 10.4802 21 10.908 20.782C11.2843 20.5903 11.5903 20.2843 11.782 19.908C12 19.4802 12 18.9201 12 17.8V15.2C12 14.0799 12 13.5198 11.782 13.092C11.5903 12.7157 11.2843 12.4097 10.908 12.218C10.4802 12 9.92011 12 8.8 12H6.2C5.0799 12 4.51984 12 4.09202 12.218C3.71569 12.4097 3.40973 12.7157 3.21799 13.092C3 13.5198 3 14.0799 3 15.2V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.07989 21 6.2 21Z"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>'),Du=_('<svg width=24 height=24 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path class=copier d="M8 8V5.2C8 4.0799 8 3.51984 8.21799 3.09202C8.40973 2.71569 8.71569 2.40973 9.09202 2.21799C9.51984 2 10.0799 2 11.2 2H18.8C19.9201 2 20.4802 2 20.908 2.21799C21.2843 2.40973 21.5903 2.71569 21.782 3.09202C22 3.51984 22 4.0799 22 5.2V12.8C22 13.9201 22 14.4802 21.782 14.908C21.5903 15.2843 21.2843 15.5903 20.908 15.782C20.4802 16 19.9201 16 18.8 16H16M5.2 22H12.8C13.9201 22 14.4802 22 14.908 21.782C15.2843 21.5903 15.5903 21.2843 15.782 20.908C16 20.4802 16 19.9201 16 18.8V11.2C16 10.0799 16 9.51984 15.782 9.09202C15.5903 8.71569 15.2843 8.40973 14.908 8.21799C14.4802 8 13.9201 8 12.8 8H5.2C4.0799 8 3.51984 8 3.09202 8.21799C2.71569 8.40973 2.40973 8.71569 2.21799 9.09202C2 9.51984 2 10.0799 2 11.2V18.8C2 19.9201 2 20.4802 2.21799 20.908C2.40973 21.2843 2.71569 21.5903 3.09202 21.782C3.51984 22 4.07989 22 5.2 22Z"stroke-width=2 stroke-linecap=round stroke-linejoin=round stroke=currentColor>'),Pu=_('<svg width=24 height=24 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M2.5 21.4998L8.04927 19.3655C8.40421 19.229 8.58168 19.1607 8.74772 19.0716C8.8952 18.9924 9.0358 18.901 9.16804 18.7984C9.31692 18.6829 9.45137 18.5484 9.72028 18.2795L21 6.99982C22.1046 5.89525 22.1046 4.10438 21 2.99981C19.8955 1.89525 18.1046 1.89524 17 2.99981L5.72028 14.2795C5.45138 14.5484 5.31692 14.6829 5.20139 14.8318C5.09877 14.964 5.0074 15.1046 4.92823 15.2521C4.83911 15.4181 4.77085 15.5956 4.63433 15.9506L2.5 21.4998ZM2.5 21.4998L4.55812 16.1488C4.7054 15.7659 4.77903 15.5744 4.90534 15.4867C5.01572 15.4101 5.1523 15.3811 5.2843 15.4063C5.43533 15.4351 5.58038 15.5802 5.87048 15.8703L8.12957 18.1294C8.41967 18.4195 8.56472 18.5645 8.59356 18.7155C8.61877 18.8475 8.58979 18.9841 8.51314 19.0945C8.42545 19.2208 8.23399 19.2944 7.85107 19.4417L2.5 21.4998Z"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>'),Os=_('<svg width=24 height=24 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M7.5 12L10.5 15L16.5 9M7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21Z"stroke-width=2 stroke-linecap=round stroke-linejoin=round>'),qu=_('<svg width=24 height=24 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M9 9L15 15M15 9L9 15M7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21Z"stroke=#F04438 stroke-width=2 stroke-linecap=round stroke-linejoin=round>'),Ou=_('<svg width=24 height=24 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 xmlns=http://www.w3.org/2000/svg><rect class=list width=20 height=20 y=2 x=2 rx=2></rect><line class=list-item y1=7 y2=7 x1=6 x2=18></line><line class=list-item y2=12 y1=12 x1=6 x2=18></line><line class=list-item y1=17 y2=17 x1=6 x2=18>'),Lu=_('<svg viewBox="0 0 24 24"height=20 width=20 fill=none xmlns=http://www.w3.org/2000/svg><path d="M3 7.8c0-1.68 0-2.52.327-3.162a3 3 0 0 1 1.311-1.311C5.28 3 6.12 3 7.8 3h8.4c1.68 0 2.52 0 3.162.327a3 3 0 0 1 1.311 1.311C21 5.28 21 6.12 21 7.8v8.4c0 1.68 0 2.52-.327 3.162a3 3 0 0 1-1.311 1.311C18.72 21 17.88 21 16.2 21H7.8c-1.68 0-2.52 0-3.162-.327a3 3 0 0 1-1.311-1.311C3 18.72 3 17.88 3 16.2V7.8Z"stroke-width=2 stroke-linecap=round stroke-linejoin=round>'),Fu=_('<svg width=14 height=14 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M7.5 12L10.5 15L16.5 9M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>'),_u=_('<svg width=14 height=14 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M12 2V6M12 18V22M6 12H2M22 12H18M19.0784 19.0784L16.25 16.25M19.0784 4.99994L16.25 7.82837M4.92157 19.0784L7.75 16.25M4.92157 4.99994L7.75 7.82837"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round></path><animateTransform attributeName=transform attributeType=XML type=rotate from=0 to=360 dur=2s repeatCount=indefinite>'),zu=_('<svg width=14 height=14 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M15 9L9 15M9 9L15 15M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>'),Ru=_('<svg width=14 height=14 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M9.5 15V9M14.5 15V9M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>'),Ku=_('<svg version=1.0 viewBox="0 0 633 633"><linearGradient x1=-666.45 x2=-666.45 y1=163.28 y2=163.99 gradientTransform="matrix(633 0 0 633 422177 -103358)"gradientUnits=userSpaceOnUse><stop stop-color=#6BDAFF offset=0></stop><stop stop-color=#F9FFB5 offset=.32></stop><stop stop-color=#FFA770 offset=.71></stop><stop stop-color=#FF7373 offset=1></stop></linearGradient><circle cx=316.5 cy=316.5 r=316.5></circle><defs><filter x=-137.5 y=412 width=454 height=396.9 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"></feColorMatrix></filter></defs><mask x=-137.5 y=412 width=454 height=396.9 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#fff></circle></g></mask><g><ellipse cx=89.5 cy=610.5 rx=214.5 ry=186 fill=#015064 stroke=#00CFE2 stroke-width=25></ellipse></g><defs><filter x=316.5 y=412 width=454 height=396.9 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"></feColorMatrix></filter></defs><mask x=316.5 y=412 width=454 height=396.9 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#fff></circle></g></mask><g><ellipse cx=543.5 cy=610.5 rx=214.5 ry=186 fill=#015064 stroke=#00CFE2 stroke-width=25></ellipse></g><defs><filter x=-137.5 y=450 width=454 height=396.9 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"></feColorMatrix></filter></defs><mask x=-137.5 y=450 width=454 height=396.9 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#fff></circle></g></mask><g><ellipse cx=89.5 cy=648.5 rx=214.5 ry=186 fill=#015064 stroke=#00A8B8 stroke-width=25></ellipse></g><defs><filter x=316.5 y=450 width=454 height=396.9 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"></feColorMatrix></filter></defs><mask x=316.5 y=450 width=454 height=396.9 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#fff></circle></g></mask><g><ellipse cx=543.5 cy=648.5 rx=214.5 ry=186 fill=#015064 stroke=#00A8B8 stroke-width=25></ellipse></g><defs><filter x=-137.5 y=486 width=454 height=396.9 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"></feColorMatrix></filter></defs><mask x=-137.5 y=486 width=454 height=396.9 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#fff></circle></g></mask><g><ellipse cx=89.5 cy=684.5 rx=214.5 ry=186 fill=#015064 stroke=#007782 stroke-width=25></ellipse></g><defs><filter x=316.5 y=486 width=454 height=396.9 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"></feColorMatrix></filter></defs><mask x=316.5 y=486 width=454 height=396.9 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#fff></circle></g></mask><g><ellipse cx=543.5 cy=684.5 rx=214.5 ry=186 fill=#015064 stroke=#007782 stroke-width=25></ellipse></g><defs><filter x=272.2 y=308 width=176.9 height=129.3 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"></feColorMatrix></filter></defs><mask x=272.2 y=308 width=176.9 height=129.3 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#fff></circle></g></mask><g><line x1=436 x2=431 y1=403.2 y2=431.8 fill=none stroke=#000 stroke-linecap=round stroke-linejoin=bevel stroke-width=11></line><line x1=291 x2=280 y1=341.5 y2=403.5 fill=none stroke=#000 stroke-linecap=round stroke-linejoin=bevel stroke-width=11></line><line x1=332.9 x2=328.6 y1=384.1 y2=411.2 fill=none stroke=#000 stroke-linecap=round stroke-linejoin=bevel stroke-width=11></line><linearGradient x1=-670.75 x2=-671.59 y1=164.4 y2=164.49 gradientTransform="matrix(-184.16 -32.472 -11.461 64.997 -121359 -32126)"gradientUnits=userSpaceOnUse><stop stop-color=#EE2700 offset=0></stop><stop stop-color=#FF008E offset=1></stop></linearGradient><path d="m344.1 363 97.7 17.2c5.8 2.1 8.2 6.1 7.1 12.1s-4.7 9.2-11 9.9l-106-18.7-57.5-59.2c-3.2-4.8-2.9-9.1 0.8-12.8s8.3-4.4 13.7-2.1l55.2 53.6z"clip-rule=evenodd fill-rule=evenodd></path><line x1=428.2 x2=429.1 y1=384.5 y2=378 fill=none stroke=#fff stroke-linecap=round stroke-linejoin=bevel stroke-width=7></line><line x1=395.2 x2=396.1 y1=379.5 y2=373 fill=none stroke=#fff stroke-linecap=round stroke-linejoin=bevel stroke-width=7></line><line x1=362.2 x2=363.1 y1=373.5 y2=367.4 fill=none stroke=#fff stroke-linecap=round stroke-linejoin=bevel stroke-width=7></line><line x1=324.2 x2=328.4 y1=351.3 y2=347.4 fill=none stroke=#fff stroke-linecap=round stroke-linejoin=bevel stroke-width=7></line><line x1=303.2 x2=307.4 y1=331.3 y2=327.4 fill=none stroke=#fff stroke-linecap=round stroke-linejoin=bevel stroke-width=7></line></g><defs><filter x=73.2 y=113.8 width=280.6 height=317.4 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"></feColorMatrix></filter></defs><mask x=73.2 y=113.8 width=280.6 height=317.4 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#fff></circle></g></mask><g><linearGradient x1=-672.16 x2=-672.16 y1=165.03 y2=166.03 gradientTransform="matrix(-100.18 48.861 97.976 200.88 -83342 -93.059)"gradientUnits=userSpaceOnUse><stop stop-color=#A17500 offset=0></stop><stop stop-color=#5D2100 offset=1></stop></linearGradient><path d="m192.3 203c8.1 37.3 14 73.6 17.8 109.1 3.8 35.4 2.8 75.1-3 119.2l61.2-16.7c-15.6-59-25.2-97.9-28.6-116.6s-10.8-51.9-22.1-99.6l-25.3 4.6"clip-rule=evenodd fill-rule=evenodd></path><g stroke=#2F8A00><linearGradient x1=-660.23 x2=-660.23 y1=166.72 y2=167.72 gradientTransform="matrix(92.683 4.8573 -2.0259 38.657 61680 -3088.6)"gradientUnits=userSpaceOnUse><stop stop-color=#2F8A00 offset=0></stop><stop stop-color=#90FF57 offset=1></stop></linearGradient><path d="m195 183.9s-12.6-22.1-36.5-29.9c-15.9-5.2-34.4-1.5-55.5 11.1 15.9 14.3 29.5 22.6 40.7 24.9 16.8 3.6 51.3-6.1 51.3-6.1z"clip-rule=evenodd fill-rule=evenodd stroke-width=13></path><linearGradient x1=-661.36 x2=-661.36 y1=164.18 y2=165.18 gradientTransform="matrix(110 5.7648 -6.3599 121.35 73933 -15933)"gradientUnits=userSpaceOnUse><stop stop-color=#2F8A00 offset=0></stop><stop stop-color=#90FF57 offset=1></stop></linearGradient><path d="m194.9 184.5s-47.5-8.5-83.2 15.7c-23.8 16.2-34.3 49.3-31.6 99.4 30.3-27.8 52.1-48.5 65.2-61.9 19.8-20.2 49.6-53.2 49.6-53.2z"clip-rule=evenodd fill-rule=evenodd stroke-width=13></path><linearGradient x1=-656.79 x2=-656.79 y1=165.15 y2=166.15 gradientTransform="matrix(62.954 3.2993 -3.5023 66.828 42156 -8754.1)"gradientUnits=userSpaceOnUse><stop stop-color=#2F8A00 offset=0></stop><stop stop-color=#90FF57 offset=1></stop></linearGradient><path d="m195 183.9c-0.8-21.9 6-38 20.6-48.2s29.8-15.4 45.5-15.3c-6.1 21.4-14.5 35.8-25.2 43.4s-24.4 14.2-40.9 20.1z"clip-rule=evenodd fill-rule=evenodd stroke-width=13></path><linearGradient x1=-663.07 x2=-663.07 y1=165.44 y2=166.44 gradientTransform="matrix(152.47 7.9907 -3.0936 59.029 101884 -4318.7)"gradientUnits=userSpaceOnUse><stop stop-color=#2F8A00 offset=0></stop><stop stop-color=#90FF57 offset=1></stop></linearGradient><path d="m194.9 184.5c31.9-30 64.1-39.7 96.7-29s50.8 30.4 54.6 59.1c-35.2-5.5-60.4-9.6-75.8-12.1-15.3-2.6-40.5-8.6-75.5-18z"clip-rule=evenodd fill-rule=evenodd stroke-width=13></path><linearGradient x1=-662.57 x2=-662.57 y1=164.44 y2=165.44 gradientTransform="matrix(136.46 7.1517 -5.2163 99.533 91536 -11442)"gradientUnits=userSpaceOnUse><stop stop-color=#2F8A00 offset=0></stop><stop stop-color=#90FF57 offset=1></stop></linearGradient><path d="m194.9 184.5c35.8-7.6 65.6-0.2 89.2 22s37.7 49 42.3 80.3c-39.8-9.7-68.3-23.8-85.5-42.4s-32.5-38.5-46-59.9z"clip-rule=evenodd fill-rule=evenodd stroke-width=13></path><linearGradient x1=-656.43 x2=-656.43 y1=163.86 y2=164.86 gradientTransform="matrix(60.866 3.1899 -8.7773 167.48 41560 -25168)"gradientUnits=userSpaceOnUse><stop stop-color=#2F8A00 offset=0></stop><stop stop-color=#90FF57 offset=1></stop></linearGradient><path d="m194.9 184.5c-33.6 13.8-53.6 35.7-60.1 65.6s-3.6 63.1 8.7 99.6c27.4-40.3 43.2-69.6 47.4-88s5.6-44.1 4-77.2z"clip-rule=evenodd fill-rule=evenodd stroke-width=13></path><path d="m196.5 182.3c-14.8 21.6-25.1 41.4-30.8 59.4s-9.5 33-11.1 45.1"fill=none stroke-linecap=round stroke-width=8></path><path d="m194.9 185.7c-24.4 1.7-43.8 9-58.1 21.8s-24.7 25.4-31.3 37.8"fill=none stroke-linecap=round stroke-width=8></path><path d="m204.5 176.4c29.7-6.7 52-8.4 67-5.1s26.9 8.6 35.8 15.9"fill=none stroke-linecap=round stroke-width=8></path><path d="m196.5 181.4c20.3 9.9 38.2 20.5 53.9 31.9s27.4 22.1 35.1 32"fill=none stroke-linecap=round stroke-width=8></path></g></g><defs><filter x=50.5 y=399 width=532 height=633 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"></feColorMatrix></filter></defs><mask x=50.5 y=399 width=532 height=633 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#fff></circle></g></mask><g><linearGradient x1=-666.06 x2=-666.23 y1=163.36 y2=163.75 gradientTransform="matrix(532 0 0 633 354760 -102959)"gradientUnits=userSpaceOnUse><stop stop-color=#FFF400 offset=0></stop><stop stop-color=#3C8700 offset=1></stop></linearGradient><ellipse cx=316.5 cy=715.5 rx=266 ry=316.5></ellipse></g><defs><filter x=391 y=-24 width=288 height=283 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"></feColorMatrix></filter></defs><mask x=391 y=-24 width=288 height=283 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#fff></circle></g></mask><g><linearGradient x1=-664.56 x2=-664.56 y1=163.79 y2=164.79 gradientTransform="matrix(227 0 0 227 151421 -37204)"gradientUnits=userSpaceOnUse><stop stop-color=#FFDF00 offset=0></stop><stop stop-color=#FF9D00 offset=1></stop></linearGradient><circle cx=565.5 cy=89.5 r=113.5></circle><linearGradient x1=-644.5 x2=-645.77 y1=342 y2=342 gradientTransform="matrix(30 0 0 1 19770 -253)"gradientUnits=userSpaceOnUse><stop stop-color=#FFA400 offset=0></stop><stop stop-color=#FF5E00 offset=1></stop></linearGradient><line x1=427 x2=397 y1=89 y2=89 fill=none stroke-linecap=round stroke-linejoin=bevel stroke-width=12></line><linearGradient x1=-641.56 x2=-642.83 y1=196.02 y2=196.07 gradientTransform="matrix(26.5 0 0 5.5 17439 -1025.5)"gradientUnits=userSpaceOnUse><stop stop-color=#FFA400 offset=0></stop><stop stop-color=#FF5E00 offset=1></stop></linearGradient><line x1=430.5 x2=404 y1=55.5 y2=50 fill=none stroke-linecap=round stroke-linejoin=bevel stroke-width=12></line><linearGradient x1=-643.73 x2=-645 y1=185.83 y2=185.9 gradientTransform="matrix(29 0 0 8 19107 -1361)"gradientUnits=userSpaceOnUse><stop stop-color=#FFA400 offset=0></stop><stop stop-color=#FF5E00 offset=1></stop></linearGradient><line x1=431 x2=402 y1=122 y2=130 fill=none stroke-linecap=round stroke-linejoin=bevel stroke-width=12></line><linearGradient x1=-638.94 x2=-640.22 y1=177.09 y2=177.39 gradientTransform="matrix(24 0 0 13 15783 -2145)"gradientUnits=userSpaceOnUse><stop stop-color=#FFA400 offset=0></stop><stop stop-color=#FF5E00 offset=1></stop></linearGradient><line x1=442 x2=418 y1=153 y2=166 fill=none stroke-linecap=round stroke-linejoin=bevel stroke-width=12></line><linearGradient x1=-633.42 x2=-634.7 y1=172.41 y2=173.31 gradientTransform="matrix(20 0 0 19 13137 -3096)"gradientUnits=userSpaceOnUse><stop stop-color=#FFA400 offset=0></stop><stop stop-color=#FF5E00 offset=1></stop></linearGradient><line x1=464 x2=444 y1=180 y2=199 fill=none stroke-linecap=round stroke-linejoin=bevel stroke-width=12></line><linearGradient x1=-619.05 x2=-619.52 y1=170.82 y2=171.82 gradientTransform="matrix(13.83 0 0 22.85 9050 -3703.4)"gradientUnits=userSpaceOnUse><stop stop-color=#FFA400 offset=0></stop><stop stop-color=#FF5E00 offset=1></stop></linearGradient><line x1=491.4 x2=477.5 y1=203 y2=225.9 fill=none stroke-linecap=round stroke-linejoin=bevel stroke-width=12></line><linearGradient x1=-578.5 x2=-578.63 y1=170.31 y2=171.31 gradientTransform="matrix(7.5 0 0 24.5 4860 -3953)"gradientUnits=userSpaceOnUse><stop stop-color=#FFA400 offset=0></stop><stop stop-color=#FF5E00 offset=1></stop></linearGradient><line x1=524.5 x2=517 y1=219.5 y2=244 fill=none stroke-linecap=round stroke-linejoin=bevel stroke-width=12></line><linearGradient x1=666.5 x2=666.5 y1=170.31 y2=171.31 gradientTransform="matrix(.5 0 0 24.5 231.5 -3944)"gradientUnits=userSpaceOnUse><stop stop-color=#FFA400 offset=0></stop><stop stop-color=#FF5E00 offset=1></stop></linearGradient><line x1=564.5 x2=565 y1=228.5 y2=253 fill=none stroke-linecap=round stroke-linejoin=bevel stroke-width=12>');function Bu(){return xu()}function Ls(){return wu()}function un(){return $u()}function ti(){return Cu()}function ni(){return qr()}function Nu(){return(()=>{var e=qr();return e.style.setProperty("transform","rotate(90deg)"),e})()}function Uu(){return(()=>{var e=qr();return e.style.setProperty("transform","rotate(-90deg)"),e})()}function Gu(){return Su()}function Vu(){return ku()}function Hu(){return Eu()}function ju(){return Mu()}function Wu(){return Tu()}function Qu(){return Au()}function Yu(){return Iu()}function Xu(){return Du()}function Zu(){return Pu()}function Ju(e){return(()=>{var n=Os(),t=n.firstChild;return N(()=>A(t,"stroke",e.theme==="dark"?"#12B76A":"#027A48")),n})()}function ed(){return qu()}function td(){return Ou()}function nd(e){return[p(K,{get when(){return e.checked},get children(){var n=Os(),t=n.firstChild;return N(()=>A(t,"stroke",e.theme==="dark"?"#9B8AFB":"#6938EF")),n}}),p(K,{get when(){return!e.checked},get children(){var n=Lu(),t=n.firstChild;return N(()=>A(t,"stroke",e.theme==="dark"?"#9B8AFB":"#6938EF")),n}})]}function rd(){return Fu()}function od(){return _u()}function id(){return zu()}function sd(){return Ru()}function ri(){let e=qe();return(()=>{var n=Ku(),t=n.firstChild,r=t.nextSibling,o=r.nextSibling,s=o.firstChild,l=o.nextSibling,a=l.firstChild,i=l.nextSibling,c=i.nextSibling,d=c.firstChild,u=c.nextSibling,g=u.firstChild,f=u.nextSibling,h=f.nextSibling,v=h.firstChild,y=h.nextSibling,m=y.firstChild,b=y.nextSibling,x=b.nextSibling,w=x.firstChild,$=x.nextSibling,F=$.firstChild,D=$.nextSibling,P=D.nextSibling,C=P.firstChild,O=P.nextSibling,V=O.firstChild,G=O.nextSibling,Y=G.nextSibling,Ce=Y.firstChild,te=Y.nextSibling,ne=te.firstChild,ge=te.nextSibling,oe=ge.nextSibling,he=oe.firstChild,ie=oe.nextSibling,de=ie.firstChild,fe=ie.nextSibling,Ae=fe.firstChild,T=Ae.nextSibling,ve=T.nextSibling,Z=ve.nextSibling,bt=Z.nextSibling,H=fe.nextSibling,je=H.firstChild,ke=H.nextSibling,Rt=ke.firstChild,ze=ke.nextSibling,xt=ze.firstChild,Tt=xt.nextSibling,st=Tt.nextSibling,Je=st.firstChild,lt=Je.nextSibling,q=lt.nextSibling,se=q.nextSibling,Ie=se.nextSibling,le=Ie.nextSibling,re=le.nextSibling,ae=re.nextSibling,me=ae.nextSibling,ee=me.nextSibling,at=ee.nextSibling,ct=at.nextSibling,We=ze.nextSibling,At=We.firstChild,ut=We.nextSibling,It=ut.firstChild,dt=ut.nextSibling,wt=dt.firstChild,wn=wt.nextSibling,Xt=dt.nextSibling,$n=Xt.firstChild,Kt=Xt.nextSibling,Cn=Kt.firstChild,Zt=Kt.nextSibling,Jt=Zt.firstChild,en=Jt.nextSibling,Bt=en.nextSibling,Lr=Bt.nextSibling,Fr=Lr.nextSibling,_r=Fr.nextSibling,zr=_r.nextSibling,Rr=zr.nextSibling,Kr=Rr.nextSibling,Br=Kr.nextSibling,Nr=Br.nextSibling,Ur=Nr.nextSibling,Gr=Ur.nextSibling,Vr=Gr.nextSibling,Hr=Vr.nextSibling,jr=Hr.nextSibling,Wr=jr.nextSibling,Bs=Wr.nextSibling;return A(t,"id",`a-${e}`),A(r,"fill",`url(#a-${e})`),A(s,"id",`am-${e}`),A(l,"id",`b-${e}`),A(a,"filter",`url(#am-${e})`),A(i,"mask",`url(#b-${e})`),A(d,"id",`ah-${e}`),A(u,"id",`k-${e}`),A(g,"filter",`url(#ah-${e})`),A(f,"mask",`url(#k-${e})`),A(v,"id",`ae-${e}`),A(y,"id",`j-${e}`),A(m,"filter",`url(#ae-${e})`),A(b,"mask",`url(#j-${e})`),A(w,"id",`ai-${e}`),A($,"id",`i-${e}`),A(F,"filter",`url(#ai-${e})`),A(D,"mask",`url(#i-${e})`),A(C,"id",`aj-${e}`),A(O,"id",`h-${e}`),A(V,"filter",`url(#aj-${e})`),A(G,"mask",`url(#h-${e})`),A(Ce,"id",`ag-${e}`),A(te,"id",`g-${e}`),A(ne,"filter",`url(#ag-${e})`),A(ge,"mask",`url(#g-${e})`),A(he,"id",`af-${e}`),A(ie,"id",`f-${e}`),A(de,"filter",`url(#af-${e})`),A(fe,"mask",`url(#f-${e})`),A(Z,"id",`m-${e}`),A(bt,"fill",`url(#m-${e})`),A(je,"id",`ak-${e}`),A(ke,"id",`e-${e}`),A(Rt,"filter",`url(#ak-${e})`),A(ze,"mask",`url(#e-${e})`),A(xt,"id",`n-${e}`),A(Tt,"fill",`url(#n-${e})`),A(Je,"id",`r-${e}`),A(lt,"fill",`url(#r-${e})`),A(q,"id",`s-${e}`),A(se,"fill",`url(#s-${e})`),A(Ie,"id",`q-${e}`),A(le,"fill",`url(#q-${e})`),A(re,"id",`p-${e}`),A(ae,"fill",`url(#p-${e})`),A(me,"id",`o-${e}`),A(ee,"fill",`url(#o-${e})`),A(at,"id",`l-${e}`),A(ct,"fill",`url(#l-${e})`),A(At,"id",`al-${e}`),A(ut,"id",`d-${e}`),A(It,"filter",`url(#al-${e})`),A(dt,"mask",`url(#d-${e})`),A(wt,"id",`u-${e}`),A(wn,"fill",`url(#u-${e})`),A($n,"id",`ad-${e}`),A(Kt,"id",`c-${e}`),A(Cn,"filter",`url(#ad-${e})`),A(Zt,"mask",`url(#c-${e})`),A(Jt,"id",`t-${e}`),A(en,"fill",`url(#t-${e})`),A(Bt,"id",`v-${e}`),A(Lr,"stroke",`url(#v-${e})`),A(Fr,"id",`aa-${e}`),A(_r,"stroke",`url(#aa-${e})`),A(zr,"id",`w-${e}`),A(Rr,"stroke",`url(#w-${e})`),A(Kr,"id",`ac-${e}`),A(Br,"stroke",`url(#ac-${e})`),A(Nr,"id",`ab-${e}`),A(Ur,"stroke",`url(#ab-${e})`),A(Gr,"id",`y-${e}`),A(Vr,"stroke",`url(#y-${e})`),A(Hr,"id",`x-${e}`),A(jr,"stroke",`url(#x-${e})`),A(Wr,"id",`z-${e}`),A(Bs,"stroke",`url(#z-${e})`),n})()}var ld=_('<span><svg width=16 height=16 viewBox="0 0 16 16"fill=none xmlns=http://www.w3.org/2000/svg><path d="M6 12L10 8L6 4"stroke-width=2 stroke-linecap=round stroke-linejoin=round>'),ad=_('<button title="Copy object to clipboard">'),cd=_('<button title="Remove all items"aria-label="Remove all items">'),ud=_('<button title="Delete item"aria-label="Delete item">'),dd=_('<button title="Toggle value"aria-label="Toggle value">'),fd=_('<button title="Bulk Edit Data"aria-label="Bulk Edit Data">'),sn=_("<div>"),gd=_("<div><button> <span></span> <span> "),hd=_("<input>"),oi=_("<span>"),vd=_("<div><span>:"),pd=_("<div><div><button> [<!>...<!>]");function yd(e,n){let t=0,r=[];for(;t<e.length;)r.push(e.slice(t,t+n)),t=t+n;return r}var ii=e=>{let n=$e(),t=R().shadowDOMTarget?W.bind({target:R().shadowDOMTarget}):W,r=M(()=>n()==="dark"?Yt(t):Qt(t));return(()=>{var o=ld();return N(()=>I(o,L(r().expander,t`
          transform: rotate(${e.expanded?90:0}deg);
        `,e.expanded&&t`
            & svg {
              top: -1px;
            }
          `))),o})()},md=e=>{let n=$e(),t=R().shadowDOMTarget?W.bind({target:R().shadowDOMTarget}):W,r=M(()=>n()==="dark"?Yt(t):Qt(t)),[o,s]=z("NoCopy");return(()=>{var l=ad();return io(l,"click",o()==="NoCopy"?()=>{navigator.clipboard.writeText(co(e.value)).then(()=>{s("SuccessCopy"),setTimeout(()=>{s("NoCopy")},1500)},a=>{s("ErrorCopy"),setTimeout(()=>{s("NoCopy")},1500)})}:void 0,!0),k(l,p(no,{get children(){return[p(Sn,{get when(){return o()==="NoCopy"},get children(){return p(Xu,{})}}),p(Sn,{get when(){return o()==="SuccessCopy"},get children(){return p(Ju,{get theme(){return n()}})}}),p(Sn,{get when(){return o()==="ErrorCopy"},get children(){return p(ed,{})}})]}})),N(a=>{var i=r().actionButton,c=`${o()==="NoCopy"?"Copy object to clipboard":o()==="SuccessCopy"?"Object copied to clipboard":"Error copying object to clipboard"}`;return i!==a.e&&I(l,a.e=i),c!==a.t&&A(l,"aria-label",a.t=c),a},{e:void 0,t:void 0}),l})()},bd=e=>{let n=$e(),t=R().shadowDOMTarget?W.bind({target:R().shadowDOMTarget}):W,r=M(()=>n()==="dark"?Yt(t):Qt(t)),o=R().client;return(()=>{var s=cd();return s.$$click=()=>{let l=e.activeQuery.state.data,a=Tn(l,e.dataPath,[]);o.setQueryData(e.activeQuery.queryKey,a)},k(s,p(td,{})),N(()=>I(s,r().actionButton)),s})()},si=e=>{let n=$e(),t=R().shadowDOMTarget?W.bind({target:R().shadowDOMTarget}):W,r=M(()=>n()==="dark"?Yt(t):Qt(t)),o=R().client;return(()=>{var s=ud();return s.$$click=()=>{let l=e.activeQuery.state.data,a=ho(l,e.dataPath);o.setQueryData(e.activeQuery.queryKey,a)},k(s,p(Ls,{})),N(()=>I(s,L(r().actionButton))),s})()},xd=e=>{let n=$e(),t=R().shadowDOMTarget?W.bind({target:R().shadowDOMTarget}):W,r=M(()=>n()==="dark"?Yt(t):Qt(t)),o=R().client;return(()=>{var s=dd();return s.$$click=()=>{let l=e.activeQuery.state.data,a=Tn(l,e.dataPath,!e.value);o.setQueryData(e.activeQuery.queryKey,a)},k(s,p(nd,{get theme(){return n()},get checked(){return e.value}})),N(()=>I(s,L(r().actionButton,t`
          width: ${S.size[3.5]};
          height: ${S.size[3.5]};
        `))),s})()};function li(e){return Symbol.iterator in e}function $t(e){let n=$e(),t=R().shadowDOMTarget?W.bind({target:R().shadowDOMTarget}):W,r=M(()=>n()==="dark"?Yt(t):Qt(t)),o=R().client,[s,l]=z((e.defaultExpanded||[]).includes(e.label)),a=()=>l(h=>!h),[i,c]=z([]),d=M(()=>Array.isArray(e.value)?e.value.map((h,v)=>({label:v.toString(),value:h})):e.value!==null&&typeof e.value=="object"&&li(e.value)&&typeof e.value[Symbol.iterator]=="function"?e.value instanceof Map?Array.from(e.value,([h,v])=>({label:h,value:v})):Array.from(e.value,(h,v)=>({label:v.toString(),value:h})):typeof e.value=="object"&&e.value!==null?Object.entries(e.value).map(([h,v])=>({label:h,value:v})):[]),u=M(()=>Array.isArray(e.value)?"array":e.value!==null&&typeof e.value=="object"&&li(e.value)&&typeof e.value[Symbol.iterator]=="function"?"Iterable":typeof e.value=="object"&&e.value!==null?"object":typeof e.value),g=M(()=>yd(d(),100)),f=e.dataPath??[];return(()=>{var h=sn();return k(h,p(K,{get when(){return g().length},get children(){return[(()=>{var v=gd(),y=v.firstChild,m=y.firstChild,b=m.nextSibling,x=b.nextSibling,w=x.nextSibling,$=w.firstChild;return y.$$click=()=>a(),k(y,p(ii,{get expanded(){return s()}}),m),k(b,()=>e.label),k(w,()=>String(u()).toLowerCase()==="iterable"?"(Iterable) ":"",$),k(w,()=>d().length,$),k(w,()=>d().length>1?"items":"item",null),k(v,p(K,{get when(){return e.editable},get children(){var F=sn();return k(F,p(md,{get value(){return e.value}}),null),k(F,p(K,{get when(){return e.itemsDeletable&&e.activeQuery!==void 0},get children(){return p(si,{get activeQuery(){return e.activeQuery},dataPath:f})}}),null),k(F,p(K,{get when(){return u()==="array"&&e.activeQuery!==void 0},get children(){return p(bd,{get activeQuery(){return e.activeQuery},dataPath:f})}}),null),k(F,p(K,{get when(){return M(()=>!!e.onEdit)()&&!ao(e.value).meta},get children(){var D=fd();return D.$$click=()=>{e.onEdit?.()},k(D,p(Zu,{})),N(()=>I(D,r().actionButton)),D}}),null),N(()=>I(F,r().actions)),F}}),null),N(F=>{var D=r().expanderButtonContainer,P=r().expanderButton,C=r().info;return D!==F.e&&I(v,F.e=D),P!==F.t&&I(y,F.t=P),C!==F.a&&I(w,F.a=C),F},{e:void 0,t:void 0,a:void 0}),v})(),p(K,{get when(){return s()},get children(){return[p(K,{get when(){return g().length===1},get children(){var v=sn();return k(v,p(Pn,{get each(){return d()},by:y=>y.label,children:y=>p($t,{get defaultExpanded(){return e.defaultExpanded},get label(){return y().label},get value(){return y().value},get editable(){return e.editable},get dataPath(){return[...f,y().label]},get activeQuery(){return e.activeQuery},get itemsDeletable(){return u()==="array"||u()==="Iterable"||u()==="object"}})})),N(()=>I(v,r().subEntry)),v}}),p(K,{get when(){return g().length>1},get children(){var v=sn();return k(v,p(to,{get each(){return g()},children:(y,m)=>(()=>{var b=pd(),x=b.firstChild,w=x.firstChild,$=w.firstChild,F=$.nextSibling,D=F.nextSibling,P=D.nextSibling;return P.nextSibling,w.$$click=()=>c(C=>C.includes(m)?C.filter(O=>O!==m):[...C,m]),k(w,p(ii,{get expanded(){return i().includes(m)}}),$),k(w,m*100,F),k(w,m*100+100-1,P),k(x,p(K,{get when(){return i().includes(m)},get children(){var C=sn();return k(C,p(Pn,{get each(){return y()},by:O=>O.label,children:O=>p($t,{get defaultExpanded(){return e.defaultExpanded},get label(){return O().label},get value(){return O().value},get editable(){return e.editable},get dataPath(){return[...f,O().label]},get activeQuery(){return e.activeQuery}})})),N(()=>I(C,r().subEntry)),C}}),null),N(C=>{var O=r().entry,V=r().expanderButton;return O!==C.e&&I(x,C.e=O),V!==C.t&&I(w,C.t=V),C},{e:void 0,t:void 0}),b})()})),N(()=>I(v,r().subEntry)),v}})]}})]}}),null),k(h,p(K,{get when(){return g().length===0},get children(){var v=vd(),y=v.firstChild,m=y.firstChild;return k(y,()=>e.label,m),k(v,p(K,{get when(){return M(()=>!!(e.editable&&e.activeQuery!==void 0))()&&(u()==="string"||u()==="number"||u()==="boolean")},get fallback(){return(()=>{var b=oi();return k(b,()=>nn(e.value)),N(()=>I(b,r().value)),b})()},get children(){return[p(K,{get when(){return M(()=>!!(e.editable&&e.activeQuery!==void 0))()&&(u()==="string"||u()==="number")},get children(){var b=hd();return b.addEventListener("change",x=>{let w=e.activeQuery.state.data,$=Tn(w,f,u()==="number"?x.target.valueAsNumber:x.target.value);o.setQueryData(e.activeQuery.queryKey,$)}),N(x=>{var w=u()==="number"?"number":"text",$=L(r().value,r().editableInput);return w!==x.e&&A(b,"type",x.e=w),$!==x.t&&I(b,x.t=$),x},{e:void 0,t:void 0}),N(()=>b.value=e.value),b}}),p(K,{get when(){return u()==="boolean"},get children(){var b=oi();return k(b,p(xd,{get activeQuery(){return e.activeQuery},dataPath:f,get value(){return e.value}}),null),k(b,()=>nn(e.value),null),N(()=>I(b,L(r().value,r().actions,r().editableInput))),b}})]}}),null),k(v,p(K,{get when(){return e.editable&&e.itemsDeletable&&e.activeQuery!==void 0},get children(){return p(si,{get activeQuery(){return e.activeQuery},dataPath:f})}}),null),N(b=>{var x=r().row,w=r().label;return x!==b.e&&I(v,b.e=x),w!==b.t&&I(y,b.t=w),b},{e:void 0,t:void 0}),v}}),null),N(()=>I(h,r().entry)),h})()}var Fs=(e,n)=>{let{colors:t,font:r,size:o,border:s}=S,l=(a,i)=>e==="light"?a:i;return{entry:n`
      & * {
        font-size: ${r.size.xs};
        font-family:
          ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
          'Liberation Mono', 'Courier New', monospace;
      }
      position: relative;
      outline: none;
      word-break: break-word;
    `,subEntry:n`
      margin: 0 0 0 0.5em;
      padding-left: 0.75em;
      border-left: 2px solid ${l(t.gray[300],t.darkGray[400])};
      /* outline: 1px solid ${t.teal[400]}; */
    `,expander:n`
      & path {
        stroke: ${t.gray[400]};
      }
      & svg {
        width: ${o[3]};
        height: ${o[3]};
      }
      display: inline-flex;
      align-items: center;
      transition: all 0.1s ease;
      /* outline: 1px solid ${t.blue[400]}; */
    `,expanderButtonContainer:n`
      display: flex;
      align-items: center;
      line-height: ${o[4]};
      min-height: ${o[4]};
      gap: ${o[2]};
    `,expanderButton:n`
      cursor: pointer;
      color: inherit;
      font: inherit;
      outline: inherit;
      height: ${o[5]};
      background: transparent;
      border: none;
      padding: 0;
      display: inline-flex;
      align-items: center;
      gap: ${o[1]};
      position: relative;
      /* outline: 1px solid ${t.green[400]}; */

      &:focus-visible {
        border-radius: ${s.radius.xs};
        outline: 2px solid ${t.blue[800]};
      }

      & svg {
        position: relative;
        left: 1px;
      }
    `,info:n`
      color: ${l(t.gray[500],t.gray[500])};
      font-size: ${r.size.xs};
      margin-left: ${o[1]};
      /* outline: 1px solid ${t.yellow[400]}; */
    `,label:n`
      color: ${l(t.gray[700],t.gray[300])};
      white-space: nowrap;
    `,value:n`
      color: ${l(t.purple[600],t.purple[400])};
      flex-grow: 1;
    `,actions:n`
      display: inline-flex;
      gap: ${o[2]};
      align-items: center;
    `,row:n`
      display: inline-flex;
      gap: ${o[2]};
      width: 100%;
      margin: ${o[.25]} 0px;
      line-height: ${o[4.5]};
      align-items: center;
    `,editableInput:n`
      border: none;
      padding: ${o[.5]} ${o[1]} ${o[.5]} ${o[1.5]};
      flex-grow: 1;
      border-radius: ${s.radius.xs};
      background-color: ${l(t.gray[200],t.darkGray[500])};

      &:hover {
        background-color: ${l(t.gray[300],t.darkGray[600])};
      }
    `,actionButton:n`
      background-color: transparent;
      color: ${l(t.gray[500],t.gray[500])};
      border: none;
      display: inline-flex;
      padding: 0px;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      width: ${o[3]};
      height: ${o[3]};
      position: relative;
      z-index: 1;

      &:hover svg {
        color: ${l(t.gray[600],t.gray[400])};
      }

      &:focus-visible {
        border-radius: ${s.radius.xs};
        outline: 2px solid ${t.blue[800]};
        outline-offset: 2px;
      }
    `}},Qt=e=>Fs("light",e),Yt=e=>Fs("dark",e);kn(["click"]);var wd=_('<div><div aria-hidden=true></div><button type=button aria-label="Open Tanstack query devtools"class=tsqd-open-btn>'),xn=_("<div>"),$d=_('<aside aria-label="Tanstack query devtools"><div></div><button aria-label="Close tanstack query devtools">'),Cd=_("<select name=tsqd-queries-filter-sort>"),Sd=_("<select name=tsqd-mutations-filter-sort>"),kd=_("<span>Asc"),Ed=_("<span>Desc"),Md=_('<button aria-label="Open in picture-in-picture mode"title="Open in picture-in-picture mode">'),Td=_("<div>Settings"),Ad=_("<span>Position"),Id=_("<span>Top"),Dd=_("<span>Bottom"),Pd=_("<span>Left"),qd=_("<span>Right"),Od=_("<span>Theme"),Ld=_("<span>Light"),Fd=_("<span>Dark"),_d=_("<span>System"),zd=_("<div><div class=tsqd-queries-container>"),Rd=_("<div><div class=tsqd-mutations-container>"),Kd=_('<div><div><div><button aria-label="Close Tanstack query devtools"><span>TANSTACK</span><span> v</span></button></div></div><div><div><div><input aria-label="Filter queries by query key"type=text placeholder=Filter name=tsqd-query-filter-input></div><div></div><button class=tsqd-query-filter-sort-order-btn></button></div><div><button aria-label="Clear query cache"></button><button>'),ai=_("<option>Sort by "),Bd=_("<div class=tsqd-query-disabled-indicator>disabled"),_s=_("<button><div></div><code class=tsqd-query-hash>"),Nd=_("<div role=tooltip id=tsqd-status-tooltip>"),Ud=_("<span>"),Gd=_("<button><span></span><span>"),Vd=_("<button><span></span> Error"),Hd=_('<div><span></span>Trigger Error<select><option value=""disabled selected>'),jd=_('<div class="tsqd-query-details-explorer-container tsqd-query-details-data-explorer">'),Wd=_("<form><textarea name=data></textarea><div><span></span><div><button type=button>Cancel</button><button>Save"),Qd=_('<div><div>Query Details</div><div><div class=tsqd-query-details-summary><pre><code></code></pre><span></span></div><div class=tsqd-query-details-observers-count><span>Observers:</span><span></span></div><div class=tsqd-query-details-last-updated><span>Last Updated:</span><span></span></div></div><div>Actions</div><div><button><span></span>Refetch</button><button><span></span>Invalidate</button><button><span></span>Reset</button><button><span></span>Remove</button><button><span></span> Loading</button></div><div>Data </div><div>Query Explorer</div><div class="tsqd-query-details-explorer-container tsqd-query-details-query-explorer">'),Yd=_("<option>"),Xd=_('<div><div>Mutation Details</div><div><div class=tsqd-query-details-summary><pre><code></code></pre><span></span></div><div class=tsqd-query-details-last-updated><span>Submitted At:</span><span></span></div></div><div>Variables Details</div><div class="tsqd-query-details-explorer-container tsqd-query-details-query-explorer"></div><div>Context Details</div><div class="tsqd-query-details-explorer-container tsqd-query-details-query-explorer"></div><div>Data Explorer</div><div class="tsqd-query-details-explorer-container tsqd-query-details-query-explorer"></div><div>Mutations Explorer</div><div class="tsqd-query-details-explorer-container tsqd-query-details-query-explorer">'),[Le,jn]=z(null),[Ct,zs]=z(null),[Ye,Or]=z(0),[ln,Zd]=z(!1),vf=e=>{let n=$e(),t=R().shadowDOMTarget?W.bind({target:R().shadowDOMTarget}):W,r=M(()=>n()==="dark"?He(t):Ve(t)),o=M(()=>R().onlineManager);ft(()=>{let u=o().subscribe(g=>{Zd(!g)});U(()=>{u()})});let s=vr(),l=M(()=>R().buttonPosition||Js),a=M(()=>e.localStore.open==="true"?!0:e.localStore.open==="false"?!1:R().initialIsOpen||el),i=M(()=>e.localStore.position||R().position||or),c;B(()=>{let u=c.parentElement,g=e.localStore.height||ci,f=e.localStore.width||ui,h=i();u.style.setProperty("--tsqd-panel-height",`${h==="top"?"-":""}${g}px`),u.style.setProperty("--tsqd-panel-width",`${h==="left"?"-":""}${f}px`)}),ft(()=>{let u=()=>{let g=c.parentElement,f=getComputedStyle(g).fontSize;g.style.setProperty("--tsqd-font-size",f)};u(),window.addEventListener("focus",u),U(()=>{window.removeEventListener("focus",u)})});let d=M(()=>e.localStore.pip_open??"false");return[p(K,{get when(){return M(()=>!!s().pipWindow)()&&d()=="true"},get children(){return p(Yn,{get mount(){return s().pipWindow?.document.body},get children(){return p(Jd,{get children(){return p(Rs,e)}})}})}}),(()=>{var u=xn(),g=c;return typeof g=="function"?Nt(g,u):c=u,k(u,p(So,{name:"tsqd-panel-transition",get children(){return p(K,{get when(){return M(()=>!!(a()&&!s().pipWindow))()&&d()=="false"},get children(){return p(ef,{get localStore(){return e.localStore},get setLocalStore(){return e.setLocalStore}})}})}}),null),k(u,p(So,{name:"tsqd-button-transition",get children(){return p(K,{get when(){return!a()},get children(){var f=wd(),h=f.firstChild,v=h.nextSibling;return k(h,p(ri,{})),v.$$click=()=>e.setLocalStore("open","true"),k(v,p(ri,{})),N(()=>I(f,L(r().devtoolsBtn,r()[`devtoolsBtn-position-${l()}`],"tsqd-open-btn-container"))),f}})}}),null),N(()=>I(u,L(t`
            & .tsqd-panel-transition-exit-active,
            & .tsqd-panel-transition-enter-active {
              transition:
                opacity 0.3s,
                transform 0.3s;
            }

            & .tsqd-panel-transition-exit-to,
            & .tsqd-panel-transition-enter {
              ${i()==="top"||i()==="bottom"?"transform: translateY(var(--tsqd-panel-height));":"transform: translateX(var(--tsqd-panel-width));"}
            }

            & .tsqd-button-transition-exit-active,
            & .tsqd-button-transition-enter-active {
              transition:
                opacity 0.3s,
                transform 0.3s;
              opacity: 1;
            }

            & .tsqd-button-transition-exit-to,
            & .tsqd-button-transition-enter {
              transform: ${l()==="relative"?"none;":l()==="top-left"?"translateX(-72px);":l()==="top-right"?"translateX(72px);":"translateY(72px);"};
              opacity: 0;
            }
          `,"tsqd-transitions-container"))),u})()]},Jd=e=>{let n=vr(),t=$e(),r=R().shadowDOMTarget?W.bind({target:R().shadowDOMTarget}):W,o=M(()=>t()==="dark"?He(r):Ve(r)),s=()=>{let{colors:l}=S,a=(i,c)=>t()==="dark"?c:i;return Ye()<Lt?r`
        flex-direction: column;
        background-color: ${a(l.gray[300],l.gray[600])};
      `:r`
      flex-direction: row;
      background-color: ${a(l.gray[200],l.darkGray[900])};
    `};return B(()=>{let l=n().pipWindow,a=()=>{l&&Or(l.innerWidth)};l&&(l.addEventListener("resize",a),a()),U(()=>{l&&l.removeEventListener("resize",a)})}),(()=>{var l=xn();return l.style.setProperty("--tsqd-font-size","16px"),l.style.setProperty("max-height","100vh"),l.style.setProperty("height","100vh"),l.style.setProperty("width","100vw"),k(l,()=>e.children),N(()=>I(l,L(o().panel,s(),{[r`
            min-width: min-content;
          `]:Ye()<hr},"tsqd-main-panel"))),l})()},pf=e=>{let n=$e(),t=R().shadowDOMTarget?W.bind({target:R().shadowDOMTarget}):W,r=M(()=>n()==="dark"?He(t):Ve(t)),o;ft(()=>{pi(o,({width:l},a)=>{a===o&&Or(l)})});let s=()=>{let{colors:l}=S,a=(i,c)=>n()==="dark"?c:i;return Ye()<Lt?t`
        flex-direction: column;
        background-color: ${a(l.gray[300],l.gray[600])};
      `:t`
      flex-direction: row;
      background-color: ${a(l.gray[200],l.darkGray[900])};
    `};return(()=>{var l=xn(),a=o;return typeof a=="function"?Nt(a,l):o=l,l.style.setProperty("--tsqd-font-size","16px"),k(l,()=>e.children),N(()=>I(l,L(r().parentPanel,s(),{[t`
            min-width: min-content;
          `]:Ye()<hr},"tsqd-main-panel"))),l})()},ef=e=>{let n=$e(),t=R().shadowDOMTarget?W.bind({target:R().shadowDOMTarget}):W,r=M(()=>n()==="dark"?He(t):Ve(t)),[o,s]=z(!1),l=M(()=>e.localStore.position||R().position||or),a=d=>{let u=d.currentTarget.parentElement;if(!u)return;s(!0);let{height:g,width:f}=u.getBoundingClientRect(),h=d.clientX,v=d.clientY,y=0,m=Xn(3.5),b=Xn(12),x=$=>{if($.preventDefault(),l()==="left"||l()==="right"){let F=l()==="right"?h-$.clientX:$.clientX-h;y=Math.round(f+F),y<b&&(y=b),e.setLocalStore("width",String(Math.round(y)));let D=u.getBoundingClientRect().width;Number(e.localStore.width)<D&&e.setLocalStore("width",String(D))}else{let F=l()==="bottom"?v-$.clientY:$.clientY-v;y=Math.round(g+F),y<m&&(y=m,jn(null)),e.setLocalStore("height",String(Math.round(y)))}},w=()=>{o()&&s(!1),document.removeEventListener("mousemove",x,!1),document.removeEventListener("mouseUp",w,!1)};document.addEventListener("mousemove",x,!1),document.addEventListener("mouseup",w,!1)},i;ft(()=>{pi(i,({width:d},u)=>{u===i&&Or(d)})}),B(()=>{let d=i.parentElement?.parentElement?.parentElement;if(!d)return;let u=e.localStore.position||or,g=uo("padding",u),f=e.localStore.position==="left"||e.localStore.position==="right",h=(({padding:v,paddingTop:y,paddingBottom:m,paddingLeft:b,paddingRight:x})=>({padding:v,paddingTop:y,paddingBottom:m,paddingLeft:b,paddingRight:x}))(d.style);d.style[g]=`${f?e.localStore.width:e.localStore.height}px`,U(()=>{Object.entries(h).forEach(([v,y])=>{d.style[v]=y})})});let c=()=>{let{colors:d}=S,u=(g,f)=>n()==="dark"?f:g;return Ye()<Lt?t`
        flex-direction: column;
        background-color: ${u(d.gray[300],d.gray[600])};
      `:t`
      flex-direction: row;
      background-color: ${u(d.gray[200],d.darkGray[900])};
    `};return(()=>{var d=$d(),u=d.firstChild,g=u.nextSibling,f=i;return typeof f=="function"?Nt(f,d):i=d,u.$$mousedown=a,g.$$click=()=>e.setLocalStore("open","false"),k(g,p(un,{})),k(d,p(Rs,e),null),N(h=>{var v=L(r().panel,r()[`panel-position-${l()}`],c(),{[t`
            min-width: min-content;
          `]:Ye()<hr&&(l()==="right"||l()==="left")},"tsqd-main-panel"),y=l()==="bottom"||l()==="top"?`${e.localStore.height||ci}px`:"auto",m=l()==="right"||l()==="left"?`${e.localStore.width||ui}px`:"auto",b=L(r().dragHandle,r()[`dragHandle-position-${l()}`],"tsqd-drag-handle"),x=L(r().closeBtn,r()[`closeBtn-position-${l()}`],"tsqd-minimize-btn");return v!==h.e&&I(d,h.e=v),y!==h.t&&((h.t=y)!=null?d.style.setProperty("height",y):d.style.removeProperty("height")),m!==h.a&&((h.a=m)!=null?d.style.setProperty("width",m):d.style.removeProperty("width")),b!==h.o&&I(u,h.o=b),x!==h.i&&I(g,h.i=x),h},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0}),d})()},Rs=e=>{af(),cf();let n,t=$e(),r=R().shadowDOMTarget?W.bind({target:R().shadowDOMTarget}):W,o=M(()=>t()==="dark"?He(r):Ve(r)),s=vr(),[l,a]=z("queries"),i=M(()=>e.localStore.sort||nl),c=M(()=>Number(e.localStore.sortOrder)||yo),d=M(()=>e.localStore.mutationSort||rl),u=M(()=>Number(e.localStore.mutationSortOrder)||yo),g=M(()=>En[i()]),f=M(()=>Mn[d()]),h=M(()=>R().onlineManager),v=M(()=>R().client.getQueryCache()),y=M(()=>R().client.getMutationCache()),m=Se(D=>D().getAll().length,!1),b=M(et(()=>[m(),e.localStore.filter,i(),c()],()=>{let D=v().getAll(),P=e.localStore.filter?D.filter(O=>mo(O.queryHash,e.localStore.filter||"").passed):[...D];return g()?P.sort((O,V)=>g()(O,V)*c()):P})),x=Qe(D=>D().getAll().length,!1),w=M(et(()=>[x(),e.localStore.mutationFilter,d(),u()],()=>{let D=y().getAll(),P=e.localStore.mutationFilter?D.filter(O=>{let V=`${O.options.mutationKey?JSON.stringify(O.options.mutationKey)+" - ":""}${new Date(O.state.submittedAt).toLocaleString()}`;return mo(V,e.localStore.mutationFilter||"").passed}):[...D];return f()?P.sort((O,V)=>f()(O,V)*u()):P})),$=D=>{e.setLocalStore("position",D)},F=D=>{let C=getComputedStyle(n).getPropertyValue("--tsqd-font-size");D.style.setProperty("--tsqd-font-size",C)};return[(()=>{var D=Kd(),P=D.firstChild,C=P.firstChild,O=C.firstChild,V=O.firstChild,G=V.nextSibling,Y=G.firstChild,Ce=P.nextSibling,te=Ce.firstChild,ne=te.firstChild,ge=ne.firstChild,oe=ne.nextSibling,he=oe.nextSibling,ie=te.nextSibling,de=ie.firstChild,fe=de.nextSibling,Ae=n;return typeof Ae=="function"?Nt(Ae,D):n=D,O.$$click=()=>{if(!s().pipWindow&&!e.showPanelViewOnly){e.setLocalStore("open","false");return}e.onClose&&e.onClose()},k(G,()=>R().queryFlavor,Y),k(G,()=>R().version,null),k(C,p(Ne.Root,{get class(){return L(o().viewToggle)},get value(){return l()},onChange:T=>{a(T),jn(null),zs(null)},get children(){return[p(Ne.Item,{value:"queries",class:"tsqd-radio-toggle",get children(){return[p(Ne.ItemInput,{}),p(Ne.ItemControl,{get children(){return p(Ne.ItemIndicator,{})}}),p(Ne.ItemLabel,{title:"Toggle Queries View",children:"Queries"})]}}),p(Ne.Item,{value:"mutations",class:"tsqd-radio-toggle",get children(){return[p(Ne.ItemInput,{}),p(Ne.ItemControl,{get children(){return p(Ne.ItemIndicator,{})}}),p(Ne.ItemLabel,{title:"Toggle Mutations View",children:"Mutations"})]}})]}}),null),k(P,p(K,{get when(){return l()==="queries"},get children(){return p(rf,{})}}),null),k(P,p(K,{get when(){return l()==="mutations"},get children(){return p(of,{})}}),null),k(ne,p(Bu,{}),ge),ge.$$input=T=>{l()==="queries"?e.setLocalStore("filter",T.currentTarget.value):e.setLocalStore("mutationFilter",T.currentTarget.value)},k(oe,p(K,{get when(){return l()==="queries"},get children(){var T=Cd();return T.addEventListener("change",ve=>{e.setLocalStore("sort",ve.currentTarget.value)}),k(T,()=>Object.keys(En).map(ve=>(()=>{var Z=ai();return Z.firstChild,Z.value=ve,k(Z,ve,null),Z})())),N(()=>T.value=i()),T}}),null),k(oe,p(K,{get when(){return l()==="mutations"},get children(){var T=Sd();return T.addEventListener("change",ve=>{e.setLocalStore("mutationSort",ve.currentTarget.value)}),k(T,()=>Object.keys(Mn).map(ve=>(()=>{var Z=ai();return Z.firstChild,Z.value=ve,k(Z,ve,null),Z})())),N(()=>T.value=d()),T}}),null),k(oe,p(un,{}),null),he.$$click=()=>{l()==="queries"?e.setLocalStore("sortOrder",String(c()*-1)):e.setLocalStore("mutationSortOrder",String(u()*-1))},k(he,p(K,{get when(){return(l()==="queries"?c():u())===1},get children(){return[kd(),p(ti,{})]}}),null),k(he,p(K,{get when(){return(l()==="queries"?c():u())===-1},get children(){return[Ed(),p(ni,{})]}}),null),de.$$click=()=>{l()==="queries"?(tt({type:"CLEAR_QUERY_CACHE"}),v().clear()):(tt({type:"CLEAR_MUTATION_CACHE"}),y().clear())},k(de,p(Ls,{})),fe.$$click=()=>{h().setOnline(!h().isOnline())},k(fe,(()=>{var T=M(()=>!!ln());return()=>T()?p(Wu,{}):p(ju,{})})()),k(ie,p(K,{get when(){return M(()=>!s().pipWindow)()&&!s().disabled},get children(){var T=Md();return T.$$click=()=>{s().requestPipWindow(Number(window.innerWidth),Number(e.localStore.height??500))},k(T,p(Yu,{})),N(()=>I(T,L(o().actionsBtn,"tsqd-actions-btn","tsqd-action-open-pip"))),T}}),null),k(ie,p(ye.Root,{gutter:4,get children(){return[p(ye.Trigger,{get class(){return L(o().actionsBtn,"tsqd-actions-btn","tsqd-action-settings")},get children(){return p(Qu,{})}}),p(ye.Portal,{ref:T=>F(T),get mount(){return M(()=>!!s().pipWindow)()?s().pipWindow.document.body:document.body},get children(){return p(ye.Content,{get class(){return L(o().settingsMenu,"tsqd-settings-menu")},get children(){return[(()=>{var T=Td();return N(()=>I(T,L(o().settingsMenuHeader,"tsqd-settings-menu-header"))),T})(),p(K,{get when(){return!e.showPanelViewOnly},get children(){return p(ye.Sub,{overlap:!0,gutter:8,shift:-4,get children(){return[p(ye.SubTrigger,{get class(){return L(o().settingsSubTrigger,"tsqd-settings-menu-sub-trigger","tsqd-settings-menu-sub-trigger-position")},get children(){return[Ad(),p(un,{})]}}),p(ye.Portal,{ref:T=>F(T),get mount(){return M(()=>!!s().pipWindow)()?s().pipWindow.document.body:document.body},get children(){return p(ye.SubContent,{get class(){return L(o().settingsMenu,"tsqd-settings-submenu")},get children(){return[p(ye.Item,{onSelect:()=>{$("top")},as:"button",get class(){return L(o().settingsSubButton,"tsqd-settings-menu-position-btn","tsqd-settings-menu-position-btn-top")},get children(){return[Id(),p(ti,{})]}}),p(ye.Item,{onSelect:()=>{$("bottom")},as:"button",get class(){return L(o().settingsSubButton,"tsqd-settings-menu-position-btn","tsqd-settings-menu-position-btn-bottom")},get children(){return[Dd(),p(ni,{})]}}),p(ye.Item,{onSelect:()=>{$("left")},as:"button",get class(){return L(o().settingsSubButton,"tsqd-settings-menu-position-btn","tsqd-settings-menu-position-btn-left")},get children(){return[Pd(),p(Nu,{})]}}),p(ye.Item,{onSelect:()=>{$("right")},as:"button",get class(){return L(o().settingsSubButton,"tsqd-settings-menu-position-btn","tsqd-settings-menu-position-btn-right")},get children(){return[qd(),p(Uu,{})]}})]}})}})]}})}}),p(ye.Sub,{overlap:!0,gutter:8,shift:-4,get children(){return[p(ye.SubTrigger,{get class(){return L(o().settingsSubTrigger,"tsqd-settings-menu-sub-trigger","tsqd-settings-menu-sub-trigger-position")},get children(){return[Od(),p(un,{})]}}),p(ye.Portal,{ref:T=>F(T),get mount(){return M(()=>!!s().pipWindow)()?s().pipWindow.document.body:document.body},get children(){return p(ye.SubContent,{get class(){return L(o().settingsMenu,"tsqd-settings-submenu")},get children(){return[p(ye.Item,{onSelect:()=>{e.setLocalStore("theme_preference","light")},as:"button",get class(){return L(o().settingsSubButton,e.localStore.theme_preference==="light"&&o().themeSelectedButton,"tsqd-settings-menu-position-btn","tsqd-settings-menu-position-btn-top")},get children(){return[Ld(),p(Gu,{})]}}),p(ye.Item,{onSelect:()=>{e.setLocalStore("theme_preference","dark")},as:"button",get class(){return L(o().settingsSubButton,e.localStore.theme_preference==="dark"&&o().themeSelectedButton,"tsqd-settings-menu-position-btn","tsqd-settings-menu-position-btn-bottom")},get children(){return[Fd(),p(Vu,{})]}}),p(ye.Item,{onSelect:()=>{e.setLocalStore("theme_preference","system")},as:"button",get class(){return L(o().settingsSubButton,e.localStore.theme_preference==="system"&&o().themeSelectedButton,"tsqd-settings-menu-position-btn","tsqd-settings-menu-position-btn-left")},get children(){return[_d(),p(Hu,{})]}})]}})}})]}})]}})}})]}}),null),k(D,p(K,{get when(){return l()==="queries"},get children(){var T=zd(),ve=T.firstChild;return k(ve,p(Pn,{by:Z=>Z.queryHash,get each(){return b()},children:Z=>p(tf,{get query(){return Z()}})})),N(()=>I(T,L(o().overflowQueryContainer,"tsqd-queries-overflow-container"))),T}}),null),k(D,p(K,{get when(){return l()==="mutations"},get children(){var T=Rd(),ve=T.firstChild;return k(ve,p(Pn,{by:Z=>Z.mutationId,get each(){return w()},children:Z=>p(nf,{get mutation(){return Z()}})})),N(()=>I(T,L(o().overflowQueryContainer,"tsqd-mutations-overflow-container"))),T}}),null),N(T=>{var ve=L(o().queriesContainer,Ye()<Lt&&(Le()||Ct())&&r`
              height: 50%;
              max-height: 50%;
            `,Ye()<Lt&&!(Le()||Ct())&&r`
              height: 100%;
              max-height: 100%;
            `,"tsqd-queries-container"),Z=L(o().row,"tsqd-header"),bt=o().logoAndToggleContainer,H=L(o().logo,"tsqd-text-logo-container"),je=L(o().tanstackLogo,"tsqd-text-logo-tanstack"),ke=L(o().queryFlavorLogo,"tsqd-text-logo-query-flavor"),Rt=L(o().row,"tsqd-filters-actions-container"),ze=L(o().filtersContainer,"tsqd-filters-container"),xt=L(o().filterInput,"tsqd-query-filter-textfield-container"),Tt=L("tsqd-query-filter-textfield"),st=L(o().filterSelect,"tsqd-query-filter-sort-container"),Je=`Sort order ${(l()==="queries"?c():u())===-1?"descending":"ascending"}`,lt=(l()==="queries"?c():u())===-1,q=L(o().actionsContainer,"tsqd-actions-container"),se=L(o().actionsBtn,"tsqd-actions-btn","tsqd-action-clear-cache"),Ie=`Clear ${l()} cache`,le=L(o().actionsBtn,ln()&&o().actionsBtnOffline,"tsqd-actions-btn","tsqd-action-mock-offline-behavior"),re=`${ln()?"Unset offline mocking behavior":"Mock offline behavior"}`,ae=ln(),me=`${ln()?"Unset offline mocking behavior":"Mock offline behavior"}`;return ve!==T.e&&I(D,T.e=ve),Z!==T.t&&I(P,T.t=Z),bt!==T.a&&I(C,T.a=bt),H!==T.o&&I(O,T.o=H),je!==T.i&&I(V,T.i=je),ke!==T.n&&I(G,T.n=ke),Rt!==T.s&&I(Ce,T.s=Rt),ze!==T.h&&I(te,T.h=ze),xt!==T.r&&I(ne,T.r=xt),Tt!==T.d&&I(ge,T.d=Tt),st!==T.l&&I(oe,T.l=st),Je!==T.u&&A(he,"aria-label",T.u=Je),lt!==T.c&&A(he,"aria-pressed",T.c=lt),q!==T.w&&I(ie,T.w=q),se!==T.m&&I(de,T.m=se),Ie!==T.f&&A(de,"title",T.f=Ie),le!==T.y&&I(fe,T.y=le),re!==T.g&&A(fe,"aria-label",T.g=re),ae!==T.p&&A(fe,"aria-pressed",T.p=ae),me!==T.b&&A(fe,"title",T.b=me),T},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0,n:void 0,s:void 0,h:void 0,r:void 0,d:void 0,l:void 0,u:void 0,c:void 0,w:void 0,m:void 0,f:void 0,y:void 0,g:void 0,p:void 0,b:void 0}),N(()=>ge.value=l()==="queries"?e.localStore.filter||"":e.localStore.mutationFilter||""),D})(),p(K,{get when(){return M(()=>l()==="queries")()&&Le()},get children(){return p(sf,{})}}),p(K,{get when(){return M(()=>l()==="mutations")()&&Ct()},get children(){return p(lf,{})}})]},tf=e=>{let n=$e(),t=R().shadowDOMTarget?W.bind({target:R().shadowDOMTarget}):W,r=M(()=>n()==="dark"?He(t):Ve(t)),{colors:o,alpha:s}=S,l=(f,h)=>n()==="dark"?h:f,a=Se(f=>f().find({queryKey:e.query.queryKey})?.state,!0,f=>f.query.queryHash===e.query.queryHash),i=Se(f=>f().find({queryKey:e.query.queryKey})?.isDisabled()??!1,!0,f=>f.query.queryHash===e.query.queryHash),c=Se(f=>f().find({queryKey:e.query.queryKey})?.isStale()??!1,!0,f=>f.query.queryHash===e.query.queryHash),d=Se(f=>f().find({queryKey:e.query.queryKey})?.getObserversCount()??0,!0,f=>f.query.queryHash===e.query.queryHash),u=M(()=>fo({queryState:a(),observerCount:d(),isStale:c()})),g=()=>u()==="gray"?t`
        background-color: ${l(o[u()][200],o[u()][700])};
        color: ${l(o[u()][700],o[u()][300])};
      `:t`
      background-color: ${l(o[u()][200]+s[80],o[u()][900])};
      color: ${l(o[u()][800],o[u()][300])};
    `;return p(K,{get when(){return a()},get children(){var f=_s(),h=f.firstChild,v=h.nextSibling;return f.$$click=()=>jn(e.query.queryHash===Le()?null:e.query.queryHash),k(h,d),k(v,()=>e.query.queryHash),k(f,p(K,{get when(){return i()},get children(){return Bd()}}),null),N(y=>{var m=L(r().queryRow,Le()===e.query.queryHash&&r().selectedQueryRow,"tsqd-query-row"),b=`Query key ${e.query.queryHash}`,x=L(g(),"tsqd-query-observer-count");return m!==y.e&&I(f,y.e=m),b!==y.t&&A(f,"aria-label",y.t=b),x!==y.a&&I(h,y.a=x),y},{e:void 0,t:void 0,a:void 0}),f}})},nf=e=>{let n=$e(),t=R().shadowDOMTarget?W.bind({target:R().shadowDOMTarget}):W,r=M(()=>n()==="dark"?He(t):Ve(t)),{colors:o,alpha:s}=S,l=(g,f)=>n()==="dark"?f:g,a=Qe(g=>g().getAll().find(v=>v.mutationId===e.mutation.mutationId)?.state),i=Qe(g=>{let h=g().getAll().find(v=>v.mutationId===e.mutation.mutationId);return h?h.state.isPaused:!1}),c=Qe(g=>{let h=g().getAll().find(v=>v.mutationId===e.mutation.mutationId);return h?h.state.status:"idle"}),d=M(()=>qt({isPaused:i(),status:c()})),u=()=>d()==="gray"?t`
        background-color: ${l(o[d()][200],o[d()][700])};
        color: ${l(o[d()][700],o[d()][300])};
      `:t`
      background-color: ${l(o[d()][200]+s[80],o[d()][900])};
      color: ${l(o[d()][800],o[d()][300])};
    `;return p(K,{get when(){return a()},get children(){var g=_s(),f=g.firstChild,h=f.nextSibling;return g.$$click=()=>{zs(e.mutation.mutationId===Ct()?null:e.mutation.mutationId)},k(f,p(K,{get when(){return d()==="purple"},get children(){return p(sd,{})}}),null),k(f,p(K,{get when(){return d()==="green"},get children(){return p(rd,{})}}),null),k(f,p(K,{get when(){return d()==="red"},get children(){return p(id,{})}}),null),k(f,p(K,{get when(){return d()==="yellow"},get children(){return p(od,{})}}),null),k(h,p(K,{get when(){return e.mutation.options.mutationKey},get children(){return[M(()=>JSON.stringify(e.mutation.options.mutationKey))," -"," "]}}),null),k(h,()=>new Date(e.mutation.state.submittedAt).toLocaleString(),null),N(v=>{var y=L(r().queryRow,Ct()===e.mutation.mutationId&&r().selectedQueryRow,"tsqd-query-row"),m=`Mutation submitted at ${new Date(e.mutation.state.submittedAt).toLocaleString()}`,b=L(u(),"tsqd-query-observer-count");return y!==v.e&&I(g,v.e=y),m!==v.t&&A(g,"aria-label",v.t=m),b!==v.a&&I(f,v.a=b),v},{e:void 0,t:void 0,a:void 0}),g}})},rf=()=>{let e=Se(i=>i().getAll().filter(c=>Pt(c)==="stale").length),n=Se(i=>i().getAll().filter(c=>Pt(c)==="fresh").length),t=Se(i=>i().getAll().filter(c=>Pt(c)==="fetching").length),r=Se(i=>i().getAll().filter(c=>Pt(c)==="paused").length),o=Se(i=>i().getAll().filter(c=>Pt(c)==="inactive").length),s=$e(),l=R().shadowDOMTarget?W.bind({target:R().shadowDOMTarget}):W,a=M(()=>s()==="dark"?He(l):Ve(l));return(()=>{var i=xn();return k(i,p(vt,{label:"Fresh",color:"green",get count(){return n()}}),null),k(i,p(vt,{label:"Fetching",color:"blue",get count(){return t()}}),null),k(i,p(vt,{label:"Paused",color:"purple",get count(){return r()}}),null),k(i,p(vt,{label:"Stale",color:"yellow",get count(){return e()}}),null),k(i,p(vt,{label:"Inactive",color:"gray",get count(){return o()}}),null),N(()=>I(i,L(a().queryStatusContainer,"tsqd-query-status-container"))),i})()},of=()=>{let e=Qe(a=>a().getAll().filter(i=>qt({isPaused:i.state.isPaused,status:i.state.status})==="green").length),n=Qe(a=>a().getAll().filter(i=>qt({isPaused:i.state.isPaused,status:i.state.status})==="yellow").length),t=Qe(a=>a().getAll().filter(i=>qt({isPaused:i.state.isPaused,status:i.state.status})==="purple").length),r=Qe(a=>a().getAll().filter(i=>qt({isPaused:i.state.isPaused,status:i.state.status})==="red").length),o=$e(),s=R().shadowDOMTarget?W.bind({target:R().shadowDOMTarget}):W,l=M(()=>o()==="dark"?He(s):Ve(s));return(()=>{var a=xn();return k(a,p(vt,{label:"Paused",color:"purple",get count(){return t()}}),null),k(a,p(vt,{label:"Pending",color:"yellow",get count(){return n()}}),null),k(a,p(vt,{label:"Success",color:"green",get count(){return e()}}),null),k(a,p(vt,{label:"Error",color:"red",get count(){return r()}}),null),N(()=>I(a,L(l().queryStatusContainer,"tsqd-query-status-container"))),a})()},vt=e=>{let n=$e(),t=R().shadowDOMTarget?W.bind({target:R().shadowDOMTarget}):W,r=M(()=>n()==="dark"?He(t):Ve(t)),{colors:o,alpha:s}=S,l=(f,h)=>n()==="dark"?h:f,a,[i,c]=z(!1),[d,u]=z(!1),g=M(()=>!(Le()&&Ye()<Zs&&Ye()>Lt||Ye()<Lt));return(()=>{var f=Gd(),h=f.firstChild,v=h.nextSibling,y=a;return typeof y=="function"?Nt(y,f):a=f,f.addEventListener("mouseleave",()=>{c(!1),u(!1)}),f.addEventListener("mouseenter",()=>c(!0)),f.addEventListener("blur",()=>u(!1)),f.addEventListener("focus",()=>u(!0)),so(f,j({get disabled(){return g()},get class(){return L(r().queryStatusTag,!g()&&t`
            cursor: pointer;
            &:hover {
              background: ${l(o.gray[200],o.darkGray[400])}${s[80]};
            }
          `,"tsqd-query-status-tag",`tsqd-query-status-tag-${e.label.toLowerCase()}`)}},()=>i()||d()?{"aria-describedby":"tsqd-status-tooltip"}:{}),!1,!0),k(f,p(K,{get when(){return M(()=>!g())()&&(i()||d())},get children(){var m=Nd();return k(m,()=>e.label),N(()=>I(m,L(r().statusTooltip,"tsqd-query-status-tooltip"))),m}}),h),k(f,p(K,{get when(){return g()},get children(){var m=Ud();return k(m,()=>e.label),N(()=>I(m,L(r().queryStatusTagLabel,"tsqd-query-status-tag-label"))),m}}),v),k(v,()=>e.count),N(m=>{var b=L(t`
            width: ${S.size[1.5]};
            height: ${S.size[1.5]};
            border-radius: ${S.border.radius.full};
            background-color: ${S.colors[e.color][500]};
          `,"tsqd-query-status-tag-dot"),x=L(r().queryStatusCount,e.count>0&&e.color!=="gray"&&t`
              background-color: ${l(o[e.color][100],o[e.color][900])};
              color: ${l(o[e.color][700],o[e.color][300])};
            `,"tsqd-query-status-tag-count");return b!==m.e&&I(h,m.e=b),x!==m.t&&I(v,m.t=x),m},{e:void 0,t:void 0}),f})()},sf=()=>{let e=$e(),n=R().shadowDOMTarget?W.bind({target:R().shadowDOMTarget}):W,t=M(()=>e()==="dark"?He(n):Ve(n)),{colors:r}=S,o=(C,O)=>e()==="dark"?O:C,s=R().client,[l,a]=z(!1),[i,c]=z("view"),[d,u]=z(!1),g=M(()=>R().errorTypes||[]),f=Se(C=>C().getAll().find(O=>O.queryHash===Le()),!1),h=Se(C=>C().getAll().find(O=>O.queryHash===Le()),!1),v=Se(C=>C().getAll().find(O=>O.queryHash===Le())?.state,!1),y=Se(C=>C().getAll().find(O=>O.queryHash===Le())?.state.data,!1),m=Se(C=>{let O=C().getAll().find(V=>V.queryHash===Le());return O?Pt(O):"inactive"}),b=Se(C=>{let O=C().getAll().find(V=>V.queryHash===Le());return O?O.state.status:"pending"}),x=Se(C=>C().getAll().find(O=>O.queryHash===Le())?.getObserversCount()??0),w=M(()=>go(m())),$=()=>{tt({type:"REFETCH",queryHash:f()?.queryHash}),f()?.fetch()?.catch(()=>{})},F=C=>{let O=f();if(!O)return;tt({type:"TRIGGER_ERROR",queryHash:O.queryHash,metadata:{error:C?.name}});let V=C?.initializer(O)??new Error("Unknown error from devtools"),G=O.options;O.setState({status:"error",error:V,fetchMeta:pe(X({},O.state.fetchMeta),{__previousQueryOptions:G})})},D=()=>{let C=f();if(!C)return;tt({type:"RESTORE_LOADING",queryHash:C.queryHash});let O=C.state,V=C.state.fetchMeta?C.state.fetchMeta.__previousQueryOptions:null;C.cancel({silent:!0}),C.setState(pe(X({},O),{fetchStatus:"idle",fetchMeta:null})),V&&C.fetch(V)};B(()=>{m()!=="fetching"&&a(!1)});let P=()=>w()==="gray"?n`
        background-color: ${o(r[w()][200],r[w()][700])};
        color: ${o(r[w()][700],r[w()][300])};
        border-color: ${o(r[w()][400],r[w()][600])};
      `:n`
      background-color: ${o(r[w()][100],r[w()][900])};
      color: ${o(r[w()][700],r[w()][300])};
      border-color: ${o(r[w()][400],r[w()][600])};
    `;return p(K,{get when(){return M(()=>!!f())()&&v()},get children(){var C=Qd(),O=C.firstChild,V=O.nextSibling,G=V.firstChild,Y=G.firstChild,Ce=Y.firstChild,te=Y.nextSibling,ne=G.nextSibling,ge=ne.firstChild,oe=ge.nextSibling,he=ne.nextSibling,ie=he.firstChild,de=ie.nextSibling,fe=V.nextSibling,Ae=fe.nextSibling,T=Ae.firstChild,ve=T.firstChild,Z=T.nextSibling,bt=Z.firstChild,H=Z.nextSibling,je=H.firstChild,ke=H.nextSibling,Rt=ke.firstChild,ze=ke.nextSibling,xt=ze.firstChild,Tt=xt.nextSibling,st=Ae.nextSibling;st.firstChild;var Je=st.nextSibling,lt=Je.nextSibling;return k(Ce,()=>nn(f().queryKey,!0)),k(te,m),k(oe,x),k(de,()=>new Date(v().dataUpdatedAt).toLocaleTimeString()),T.$$click=$,Z.$$click=()=>{tt({type:"INVALIDATE",queryHash:f()?.queryHash}),s.invalidateQueries(f())},H.$$click=()=>{tt({type:"RESET",queryHash:f()?.queryHash}),s.resetQueries(f())},ke.$$click=()=>{tt({type:"REMOVE",queryHash:f()?.queryHash}),s.removeQueries(f()),jn(null)},ze.$$click=()=>{if(f()?.state.data===void 0)a(!0),D();else{let q=f();if(!q)return;tt({type:"TRIGGER_LOADING",queryHash:q.queryHash});let se=q.options;q.fetch(pe(X({},se),{queryFn:()=>new Promise(()=>{}),gcTime:-1})),q.setState({data:void 0,status:"pending",fetchMeta:pe(X({},q.state.fetchMeta),{__previousQueryOptions:se})})}},k(ze,()=>b()==="pending"?"Restore":"Trigger",Tt),k(Ae,p(K,{get when(){return g().length===0||b()==="error"},get children(){var q=Vd(),se=q.firstChild,Ie=se.nextSibling;return q.$$click=()=>{f().state.error?(tt({type:"RESTORE_ERROR",queryHash:f()?.queryHash}),s.resetQueries(f())):F()},k(q,()=>b()==="error"?"Restore":"Trigger",Ie),N(le=>{var re=L(n`
                  color: ${o(r.red[500],r.red[400])};
                `,"tsqd-query-details-actions-btn","tsqd-query-details-action-error"),ae=b()==="pending",me=n`
                  background-color: ${o(r.red[500],r.red[400])};
                `;return re!==le.e&&I(q,le.e=re),ae!==le.t&&(q.disabled=le.t=ae),me!==le.a&&I(se,le.a=me),le},{e:void 0,t:void 0,a:void 0}),q}}),null),k(Ae,p(K,{get when(){return!(g().length===0||b()==="error")},get children(){var q=Hd(),se=q.firstChild,Ie=se.nextSibling,le=Ie.nextSibling;return le.firstChild,le.addEventListener("change",re=>{let ae=g().find(me=>me.name===re.currentTarget.value);F(ae)}),k(le,p(eo,{get each(){return g()},children:re=>(()=>{var ae=Yd();return k(ae,()=>re.name),N(()=>ae.value=re.name),ae})()}),null),k(q,p(un,{}),null),N(re=>{var ae=L(t().actionsSelect,"tsqd-query-details-actions-btn","tsqd-query-details-action-error-multiple"),me=n`
                  background-color: ${S.colors.red[400]};
                `,ee=b()==="pending";return ae!==re.e&&I(q,re.e=ae),me!==re.t&&I(se,re.t=me),ee!==re.a&&(le.disabled=re.a=ee),re},{e:void 0,t:void 0,a:void 0}),q}}),null),k(st,()=>i()==="view"?"Explorer":"Editor",null),k(C,p(K,{get when(){return i()==="view"},get children(){var q=jd();return k(q,p($t,{label:"Data",defaultExpanded:["Data"],get value(){return y()},editable:!0,onEdit:()=>c("edit"),get activeQuery(){return f()}})),N(se=>(se=S.size[2])!=null?q.style.setProperty("padding",se):q.style.removeProperty("padding")),q}}),Je),k(C,p(K,{get when(){return i()==="edit"},get children(){var q=Wd(),se=q.firstChild,Ie=se.nextSibling,le=Ie.firstChild,re=le.nextSibling,ae=re.firstChild,me=ae.nextSibling;return q.addEventListener("submit",ee=>{ee.preventDefault();let ct=new FormData(ee.currentTarget).get("data");try{let We=JSON.parse(ct);f().setState(pe(X({},f().state),{data:We})),c("view")}catch{u(!0)}}),se.addEventListener("focus",()=>u(!1)),k(le,()=>d()?"Invalid Value":""),ae.$$click=()=>c("view"),N(ee=>{var at=L(t().devtoolsEditForm,"tsqd-query-details-data-editor"),ct=t().devtoolsEditTextarea,We=d(),At=t().devtoolsEditFormActions,ut=t().devtoolsEditFormError,It=t().devtoolsEditFormActionContainer,dt=L(t().devtoolsEditFormAction,n`
                      color: ${o(r.gray[600],r.gray[300])};
                    `),wt=L(t().devtoolsEditFormAction,n`
                      color: ${o(r.blue[600],r.blue[400])};
                    `);return at!==ee.e&&I(q,ee.e=at),ct!==ee.t&&I(se,ee.t=ct),We!==ee.a&&A(se,"data-error",ee.a=We),At!==ee.o&&I(Ie,ee.o=At),ut!==ee.i&&I(le,ee.i=ut),It!==ee.n&&I(re,ee.n=It),dt!==ee.s&&I(ae,ee.s=dt),wt!==ee.h&&I(me,ee.h=wt),ee},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0,n:void 0,s:void 0,h:void 0}),N(()=>se.value=JSON.stringify(y(),null,2)),q}}),Je),k(lt,p($t,{label:"Query",defaultExpanded:["Query","queryKey"],get value(){return h()}})),N(q=>{var se=L(t().detailsContainer,"tsqd-query-details-container"),Ie=L(t().detailsHeader,"tsqd-query-details-header"),le=L(t().detailsBody,"tsqd-query-details-summary-container"),re=L(t().queryDetailsStatus,P()),ae=L(t().detailsHeader,"tsqd-query-details-header"),me=L(t().actionsBody,"tsqd-query-details-actions-container"),ee=L(n`
                color: ${o(r.blue[600],r.blue[400])};
              `,"tsqd-query-details-actions-btn","tsqd-query-details-action-refetch"),at=m()==="fetching",ct=n`
                background-color: ${o(r.blue[600],r.blue[400])};
              `,We=L(n`
                color: ${o(r.yellow[600],r.yellow[400])};
              `,"tsqd-query-details-actions-btn","tsqd-query-details-action-invalidate"),At=b()==="pending",ut=n`
                background-color: ${o(r.yellow[600],r.yellow[400])};
              `,It=L(n`
                color: ${o(r.gray[600],r.gray[300])};
              `,"tsqd-query-details-actions-btn","tsqd-query-details-action-reset"),dt=b()==="pending",wt=n`
                background-color: ${o(r.gray[600],r.gray[400])};
              `,wn=L(n`
                color: ${o(r.pink[500],r.pink[400])};
              `,"tsqd-query-details-actions-btn","tsqd-query-details-action-remove"),Xt=m()==="fetching",$n=n`
                background-color: ${o(r.pink[500],r.pink[400])};
              `,Kt=L(n`
                color: ${o(r.cyan[500],r.cyan[400])};
              `,"tsqd-query-details-actions-btn","tsqd-query-details-action-loading"),Cn=l(),Zt=n`
                background-color: ${o(r.cyan[500],r.cyan[400])};
              `,Jt=L(t().detailsHeader,"tsqd-query-details-header"),en=L(t().detailsHeader,"tsqd-query-details-header"),Bt=S.size[2];return se!==q.e&&I(C,q.e=se),Ie!==q.t&&I(O,q.t=Ie),le!==q.a&&I(V,q.a=le),re!==q.o&&I(te,q.o=re),ae!==q.i&&I(fe,q.i=ae),me!==q.n&&I(Ae,q.n=me),ee!==q.s&&I(T,q.s=ee),at!==q.h&&(T.disabled=q.h=at),ct!==q.r&&I(ve,q.r=ct),We!==q.d&&I(Z,q.d=We),At!==q.l&&(Z.disabled=q.l=At),ut!==q.u&&I(bt,q.u=ut),It!==q.c&&I(H,q.c=It),dt!==q.w&&(H.disabled=q.w=dt),wt!==q.m&&I(je,q.m=wt),wn!==q.f&&I(ke,q.f=wn),Xt!==q.y&&(ke.disabled=q.y=Xt),$n!==q.g&&I(Rt,q.g=$n),Kt!==q.p&&I(ze,q.p=Kt),Cn!==q.b&&(ze.disabled=q.b=Cn),Zt!==q.T&&I(xt,q.T=Zt),Jt!==q.A&&I(st,q.A=Jt),en!==q.O&&I(Je,q.O=en),Bt!==q.I&&((q.I=Bt)!=null?lt.style.setProperty("padding",Bt):lt.style.removeProperty("padding")),q},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0,n:void 0,s:void 0,h:void 0,r:void 0,d:void 0,l:void 0,u:void 0,c:void 0,w:void 0,m:void 0,f:void 0,y:void 0,g:void 0,p:void 0,b:void 0,T:void 0,A:void 0,O:void 0,I:void 0}),C}})},lf=()=>{let e=$e(),n=R().shadowDOMTarget?W.bind({target:R().shadowDOMTarget}):W,t=M(()=>e()==="dark"?He(n):Ve(n)),{colors:r}=S,o=(d,u)=>e()==="dark"?u:d,s=Qe(d=>{let g=d().getAll().find(f=>f.mutationId===Ct());return g?g.state.isPaused:!1}),l=Qe(d=>{let g=d().getAll().find(f=>f.mutationId===Ct());return g?g.state.status:"idle"}),a=M(()=>qt({isPaused:s(),status:l()})),i=Qe(d=>d().getAll().find(u=>u.mutationId===Ct()),!1),c=()=>a()==="gray"?n`
        background-color: ${o(r[a()][200],r[a()][700])};
        color: ${o(r[a()][700],r[a()][300])};
        border-color: ${o(r[a()][400],r[a()][600])};
      `:n`
      background-color: ${o(r[a()][100],r[a()][900])};
      color: ${o(r[a()][700],r[a()][300])};
      border-color: ${o(r[a()][400],r[a()][600])};
    `;return p(K,{get when(){return i()},get children(){var d=Xd(),u=d.firstChild,g=u.nextSibling,f=g.firstChild,h=f.firstChild,v=h.firstChild,y=h.nextSibling,m=f.nextSibling,b=m.firstChild,x=b.nextSibling,w=g.nextSibling,$=w.nextSibling,F=$.nextSibling,D=F.nextSibling,P=D.nextSibling,C=P.nextSibling,O=C.nextSibling,V=O.nextSibling;return k(v,p(K,{get when(){return i().options.mutationKey},fallback:"No mutationKey found",get children(){return nn(i().options.mutationKey,!0)}})),k(y,p(K,{get when(){return a()==="purple"},children:"pending"}),null),k(y,p(K,{get when(){return a()!=="purple"},get children(){return l()}}),null),k(x,()=>new Date(i().state.submittedAt).toLocaleTimeString()),k($,p($t,{label:"Variables",defaultExpanded:["Variables"],get value(){return i().state.variables}})),k(D,p($t,{label:"Context",defaultExpanded:["Context"],get value(){return i().state.context}})),k(C,p($t,{label:"Data",defaultExpanded:["Data"],get value(){return i().state.data}})),k(V,p($t,{label:"Mutation",defaultExpanded:["Mutation"],get value(){return i()}})),N(G=>{var Y=L(t().detailsContainer,"tsqd-query-details-container"),Ce=L(t().detailsHeader,"tsqd-query-details-header"),te=L(t().detailsBody,"tsqd-query-details-summary-container"),ne=L(t().queryDetailsStatus,c()),ge=L(t().detailsHeader,"tsqd-query-details-header"),oe=S.size[2],he=L(t().detailsHeader,"tsqd-query-details-header"),ie=S.size[2],de=L(t().detailsHeader,"tsqd-query-details-header"),fe=S.size[2],Ae=L(t().detailsHeader,"tsqd-query-details-header"),T=S.size[2];return Y!==G.e&&I(d,G.e=Y),Ce!==G.t&&I(u,G.t=Ce),te!==G.a&&I(g,G.a=te),ne!==G.o&&I(y,G.o=ne),ge!==G.i&&I(w,G.i=ge),oe!==G.n&&((G.n=oe)!=null?$.style.setProperty("padding",oe):$.style.removeProperty("padding")),he!==G.s&&I(F,G.s=he),ie!==G.h&&((G.h=ie)!=null?D.style.setProperty("padding",ie):D.style.removeProperty("padding")),de!==G.r&&I(P,G.r=de),fe!==G.d&&((G.d=fe)!=null?C.style.setProperty("padding",fe):C.style.removeProperty("padding")),Ae!==G.l&&I(O,G.l=Ae),T!==G.u&&((G.u=T)!=null?V.style.setProperty("padding",T):V.style.removeProperty("padding")),G},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0,n:void 0,s:void 0,h:void 0,r:void 0,d:void 0,l:void 0,u:void 0}),d}})},_n=new Map,af=()=>{let e=M(()=>R().client.getQueryCache()),n=e().subscribe(t=>{Xr(()=>{for(let[r,o]of _n.entries())o.shouldUpdate(t)&&o.setter(r(e))})});return U(()=>{_n.clear(),n()}),n},Se=(e,n=!0,t=()=>!0)=>{let r=M(()=>R().client.getQueryCache()),[o,s]=z(e(r),n?void 0:{equals:!1});return B(()=>{s(e(r))}),_n.set(e,{setter:s,shouldUpdate:t}),U(()=>{_n.delete(e)}),o},zn=new Map,cf=()=>{let e=M(()=>R().client.getMutationCache()),n=e().subscribe(()=>{for(let[t,r]of zn.entries())queueMicrotask(()=>{r(t(e))})});return U(()=>{zn.clear(),n()}),n},Qe=(e,n=!0)=>{let t=M(()=>R().client.getMutationCache()),[r,o]=z(e(t),n?void 0:{equals:!1});return B(()=>{o(e(t))}),zn.set(e,o),U(()=>{zn.delete(e)}),r},uf="@tanstack/query-devtools-event",tt=({type:e,queryHash:n,metadata:t})=>{let r=new CustomEvent(uf,{detail:{type:e,queryHash:n,metadata:t},bubbles:!0,cancelable:!0});window.dispatchEvent(r)},Ks=(e,n)=>{let{colors:t,font:r,size:o,alpha:s,shadow:l,border:a}=S,i=(c,d)=>e==="light"?c:d;return{devtoolsBtn:n`
      z-index: 100000;
      position: fixed;
      padding: 4px;
      text-align: left;

      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 9999px;
      box-shadow: ${l.md()};
      overflow: hidden;

      & div {
        position: absolute;
        top: -8px;
        left: -8px;
        right: -8px;
        bottom: -8px;
        border-radius: 9999px;

        & svg {
          position: absolute;
          width: 100%;
          height: 100%;
        }
        filter: blur(6px) saturate(1.2) contrast(1.1);
      }

      &:focus-within {
        outline-offset: 2px;
        outline: 3px solid ${t.green[600]};
      }

      & button {
        position: relative;
        z-index: 1;
        padding: 0;
        border-radius: 9999px;
        background-color: transparent;
        border: none;
        height: 40px;
        display: flex;
        width: 40px;
        overflow: hidden;
        cursor: pointer;
        outline: none;
        & svg {
          position: absolute;
          width: 100%;
          height: 100%;
        }
      }
    `,panel:n`
      position: fixed;
      z-index: 9999;
      display: flex;
      gap: ${S.size[.5]};
      & * {
        box-sizing: border-box;
        text-transform: none;
      }

      & *::-webkit-scrollbar {
        width: 7px;
      }

      & *::-webkit-scrollbar-track {
        background: transparent;
      }

      & *::-webkit-scrollbar-thumb {
        background: ${i(t.gray[300],t.darkGray[200])};
      }

      & *::-webkit-scrollbar-thumb:hover {
        background: ${i(t.gray[400],t.darkGray[300])};
      }
    `,parentPanel:n`
      z-index: 9999;
      display: flex;
      height: 100%;
      gap: ${S.size[.5]};
      & * {
        box-sizing: border-box;
        text-transform: none;
      }

      & *::-webkit-scrollbar {
        width: 7px;
      }

      & *::-webkit-scrollbar-track {
        background: transparent;
      }

      & *::-webkit-scrollbar-thumb {
        background: ${i(t.gray[300],t.darkGray[200])};
      }

      & *::-webkit-scrollbar-thumb:hover {
        background: ${i(t.gray[400],t.darkGray[300])};
      }
    `,"devtoolsBtn-position-bottom-right":n`
      bottom: 12px;
      right: 12px;
    `,"devtoolsBtn-position-bottom-left":n`
      bottom: 12px;
      left: 12px;
    `,"devtoolsBtn-position-top-left":n`
      top: 12px;
      left: 12px;
    `,"devtoolsBtn-position-top-right":n`
      top: 12px;
      right: 12px;
    `,"devtoolsBtn-position-relative":n`
      position: relative;
    `,"panel-position-top":n`
      top: 0;
      right: 0;
      left: 0;
      max-height: 90%;
      min-height: ${o[14]};
      border-bottom: ${i(t.gray[400],t.darkGray[300])} 1px solid;
    `,"panel-position-bottom":n`
      bottom: 0;
      right: 0;
      left: 0;
      max-height: 90%;
      min-height: ${o[14]};
      border-top: ${i(t.gray[400],t.darkGray[300])} 1px solid;
    `,"panel-position-right":n`
      bottom: 0;
      right: 0;
      top: 0;
      border-left: ${i(t.gray[400],t.darkGray[300])} 1px solid;
      max-width: 90%;
    `,"panel-position-left":n`
      bottom: 0;
      left: 0;
      top: 0;
      border-right: ${i(t.gray[400],t.darkGray[300])} 1px solid;
      max-width: 90%;
    `,closeBtn:n`
      position: absolute;
      cursor: pointer;
      z-index: 5;
      display: flex;
      align-items: center;
      justify-content: center;
      outline: none;
      background-color: ${i(t.gray[50],t.darkGray[700])};
      &:hover {
        background-color: ${i(t.gray[200],t.darkGray[500])};
      }
      &:focus-visible {
        outline: 2px solid ${t.blue[600]};
      }
      & svg {
        color: ${i(t.gray[600],t.gray[400])};
        width: ${o[2]};
        height: ${o[2]};
      }
    `,"closeBtn-position-top":n`
      bottom: 0;
      right: ${o[2]};
      transform: translate(0, 100%);
      border-right: ${i(t.gray[400],t.darkGray[300])} 1px solid;
      border-left: ${i(t.gray[400],t.darkGray[300])} 1px solid;
      border-top: none;
      border-bottom: ${i(t.gray[400],t.darkGray[300])} 1px solid;
      border-radius: 0px 0px ${a.radius.sm} ${a.radius.sm};
      padding: ${o[.5]} ${o[1.5]} ${o[1]} ${o[1.5]};

      &::after {
        content: ' ';
        position: absolute;
        bottom: 100%;
        left: -${o[2.5]};
        height: ${o[1.5]};
        width: calc(100% + ${o[5]});
      }

      & svg {
        transform: rotate(180deg);
      }
    `,"closeBtn-position-bottom":n`
      top: 0;
      right: ${o[2]};
      transform: translate(0, -100%);
      border-right: ${i(t.gray[400],t.darkGray[300])} 1px solid;
      border-left: ${i(t.gray[400],t.darkGray[300])} 1px solid;
      border-top: ${i(t.gray[400],t.darkGray[300])} 1px solid;
      border-bottom: none;
      border-radius: ${a.radius.sm} ${a.radius.sm} 0px 0px;
      padding: ${o[1]} ${o[1.5]} ${o[.5]} ${o[1.5]};

      &::after {
        content: ' ';
        position: absolute;
        top: 100%;
        left: -${o[2.5]};
        height: ${o[1.5]};
        width: calc(100% + ${o[5]});
      }
    `,"closeBtn-position-right":n`
      bottom: ${o[2]};
      left: 0;
      transform: translate(-100%, 0);
      border-right: none;
      border-left: ${i(t.gray[400],t.darkGray[300])} 1px solid;
      border-top: ${i(t.gray[400],t.darkGray[300])} 1px solid;
      border-bottom: ${i(t.gray[400],t.darkGray[300])} 1px solid;
      border-radius: ${a.radius.sm} 0px 0px ${a.radius.sm};
      padding: ${o[1.5]} ${o[.5]} ${o[1.5]} ${o[1]};

      &::after {
        content: ' ';
        position: absolute;
        left: 100%;
        height: calc(100% + ${o[5]});
        width: ${o[1.5]};
      }

      & svg {
        transform: rotate(-90deg);
      }
    `,"closeBtn-position-left":n`
      bottom: ${o[2]};
      right: 0;
      transform: translate(100%, 0);
      border-left: none;
      border-right: ${i(t.gray[400],t.darkGray[300])} 1px solid;
      border-top: ${i(t.gray[400],t.darkGray[300])} 1px solid;
      border-bottom: ${i(t.gray[400],t.darkGray[300])} 1px solid;
      border-radius: 0px ${a.radius.sm} ${a.radius.sm} 0px;
      padding: ${o[1.5]} ${o[1]} ${o[1.5]} ${o[.5]};

      &::after {
        content: ' ';
        position: absolute;
        right: 100%;
        height: calc(100% + ${o[5]});
        width: ${o[1.5]};
      }

      & svg {
        transform: rotate(90deg);
      }
    `,queriesContainer:n`
      flex: 1 1 700px;
      background-color: ${i(t.gray[50],t.darkGray[700])};
      display: flex;
      flex-direction: column;
      & * {
        font-family: ui-sans-serif, Inter, system-ui, sans-serif, sans-serif;
      }
    `,dragHandle:n`
      position: absolute;
      transition: background-color 0.125s ease;
      &:hover {
        background-color: ${t.purple[400]}${i("",s[90])};
      }
      z-index: 4;
    `,"dragHandle-position-top":n`
      bottom: 0;
      width: 100%;
      height: 3px;
      cursor: ns-resize;
    `,"dragHandle-position-bottom":n`
      top: 0;
      width: 100%;
      height: 3px;
      cursor: ns-resize;
    `,"dragHandle-position-right":n`
      left: 0;
      width: 3px;
      height: 100%;
      cursor: ew-resize;
    `,"dragHandle-position-left":n`
      right: 0;
      width: 3px;
      height: 100%;
      cursor: ew-resize;
    `,row:n`
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: ${S.size[2]} ${S.size[2.5]};
      gap: ${S.size[2.5]};
      border-bottom: ${i(t.gray[300],t.darkGray[500])} 1px solid;
      align-items: center;
      & > button {
        padding: 0;
        background: transparent;
        border: none;
        display: flex;
        gap: ${o[.5]};
        flex-direction: column;
      }
    `,logoAndToggleContainer:n`
      display: flex;
      gap: ${S.size[3]};
      align-items: center;
    `,logo:n`
      cursor: pointer;
      display: flex;
      flex-direction: column;
      background-color: transparent;
      border: none;
      gap: ${S.size[.5]};
      padding: 0px;
      &:hover {
        opacity: 0.7;
      }
      &:focus-visible {
        outline-offset: 4px;
        border-radius: ${a.radius.xs};
        outline: 2px solid ${t.blue[800]};
      }
    `,tanstackLogo:n`
      font-size: ${r.size.md};
      font-weight: ${r.weight.bold};
      line-height: ${r.lineHeight.xs};
      white-space: nowrap;
      color: ${i(t.gray[600],t.gray[300])};
    `,queryFlavorLogo:n`
      font-weight: ${r.weight.semibold};
      font-size: ${r.size.xs};
      background: linear-gradient(
        to right,
        ${i("#ea4037, #ff9b11","#dd524b, #e9a03b")}
      );
      background-clip: text;
      -webkit-background-clip: text;
      line-height: 1;
      -webkit-text-fill-color: transparent;
      white-space: nowrap;
    `,queryStatusContainer:n`
      display: flex;
      gap: ${S.size[2]};
      height: min-content;
    `,queryStatusTag:n`
      display: flex;
      gap: ${S.size[1.5]};
      box-sizing: border-box;
      height: ${S.size[6.5]};
      background: ${i(t.gray[50],t.darkGray[500])};
      color: ${i(t.gray[700],t.gray[300])};
      border-radius: ${S.border.radius.sm};
      font-size: ${r.size.sm};
      padding: ${S.size[1]};
      padding-left: ${S.size[1.5]};
      align-items: center;
      font-weight: ${r.weight.medium};
      border: ${i("1px solid "+t.gray[300],"1px solid transparent")};
      user-select: none;
      position: relative;
      &:focus-visible {
        outline-offset: 2px;
        outline: 2px solid ${t.blue[800]};
      }
    `,queryStatusTagLabel:n`
      font-size: ${r.size.xs};
    `,queryStatusCount:n`
      font-size: ${r.size.xs};
      padding: 0 5px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${i(t.gray[500],t.gray[400])};
      background-color: ${i(t.gray[200],t.darkGray[300])};
      border-radius: 2px;
      font-variant-numeric: tabular-nums;
      height: ${S.size[4.5]};
    `,statusTooltip:n`
      position: absolute;
      z-index: 1;
      background-color: ${i(t.gray[50],t.darkGray[500])};
      top: 100%;
      left: 50%;
      transform: translate(-50%, calc(${S.size[2]}));
      padding: ${S.size[.5]} ${S.size[2]};
      border-radius: ${S.border.radius.sm};
      font-size: ${r.size.xs};
      border: 1px solid ${i(t.gray[400],t.gray[600])};
      color: ${i(t.gray[600],t.gray[300])};

      &::before {
        top: 0px;
        content: ' ';
        display: block;
        left: 50%;
        transform: translate(-50%, -100%);
        position: absolute;
        border-color: transparent transparent
          ${i(t.gray[400],t.gray[600])} transparent;
        border-style: solid;
        border-width: 7px;
        /* transform: rotate(180deg); */
      }

      &::after {
        top: 0px;
        content: ' ';
        display: block;
        left: 50%;
        transform: translate(-50%, calc(-100% + 2px));
        position: absolute;
        border-color: transparent transparent
          ${i(t.gray[100],t.darkGray[500])} transparent;
        border-style: solid;
        border-width: 7px;
      }
    `,filtersContainer:n`
      display: flex;
      gap: ${S.size[2]};
      & > button {
        cursor: pointer;
        padding: ${S.size[.5]} ${S.size[1.5]} ${S.size[.5]}
          ${S.size[2]};
        border-radius: ${S.border.radius.sm};
        background-color: ${i(t.gray[100],t.darkGray[400])};
        border: 1px solid ${i(t.gray[300],t.darkGray[200])};
        color: ${i(t.gray[700],t.gray[300])};
        font-size: ${r.size.xs};
        display: flex;
        align-items: center;
        line-height: ${r.lineHeight.sm};
        gap: ${S.size[1.5]};
        max-width: 160px;
        &:focus-visible {
          outline-offset: 2px;
          border-radius: ${a.radius.xs};
          outline: 2px solid ${t.blue[800]};
        }
        & svg {
          width: ${S.size[3]};
          height: ${S.size[3]};
          color: ${i(t.gray[500],t.gray[400])};
        }
      }
    `,filterInput:n`
      padding: ${o[.5]} ${o[2]};
      border-radius: ${S.border.radius.sm};
      background-color: ${i(t.gray[100],t.darkGray[400])};
      display: flex;
      box-sizing: content-box;
      align-items: center;
      gap: ${S.size[1.5]};
      max-width: 160px;
      min-width: 100px;
      border: 1px solid ${i(t.gray[300],t.darkGray[200])};
      height: min-content;
      color: ${i(t.gray[600],t.gray[400])};
      & > svg {
        width: ${o[3]};
        height: ${o[3]};
      }
      & input {
        font-size: ${r.size.xs};
        width: 100%;
        background-color: ${i(t.gray[100],t.darkGray[400])};
        border: none;
        padding: 0;
        line-height: ${r.lineHeight.sm};
        color: ${i(t.gray[700],t.gray[300])};
        &::placeholder {
          color: ${i(t.gray[700],t.gray[300])};
        }
        &:focus {
          outline: none;
        }
      }

      &:focus-within {
        outline-offset: 2px;
        border-radius: ${a.radius.xs};
        outline: 2px solid ${t.blue[800]};
      }
    `,filterSelect:n`
      padding: ${S.size[.5]} ${S.size[2]};
      border-radius: ${S.border.radius.sm};
      background-color: ${i(t.gray[100],t.darkGray[400])};
      display: flex;
      align-items: center;
      gap: ${S.size[1.5]};
      box-sizing: content-box;
      max-width: 160px;
      border: 1px solid ${i(t.gray[300],t.darkGray[200])};
      height: min-content;
      & > svg {
        color: ${i(t.gray[600],t.gray[400])};
        width: ${S.size[2]};
        height: ${S.size[2]};
      }
      & > select {
        appearance: none;
        color: ${i(t.gray[700],t.gray[300])};
        min-width: 100px;
        line-height: ${r.lineHeight.sm};
        font-size: ${r.size.xs};
        background-color: ${i(t.gray[100],t.darkGray[400])};
        border: none;
        &:focus {
          outline: none;
        }
      }
      &:focus-within {
        outline-offset: 2px;
        border-radius: ${a.radius.xs};
        outline: 2px solid ${t.blue[800]};
      }
    `,actionsContainer:n`
      display: flex;
      gap: ${S.size[2]};
    `,actionsBtn:n`
      border-radius: ${S.border.radius.sm};
      background-color: ${i(t.gray[100],t.darkGray[400])};
      border: 1px solid ${i(t.gray[300],t.darkGray[200])};
      width: ${S.size[6.5]};
      height: ${S.size[6.5]};
      justify-content: center;
      display: flex;
      align-items: center;
      gap: ${S.size[1.5]};
      max-width: 160px;
      cursor: pointer;
      padding: 0;
      &:hover {
        background-color: ${i(t.gray[200],t.darkGray[500])};
      }
      & svg {
        color: ${i(t.gray[700],t.gray[300])};
        width: ${S.size[3]};
        height: ${S.size[3]};
      }
      &:focus-visible {
        outline-offset: 2px;
        border-radius: ${a.radius.xs};
        outline: 2px solid ${t.blue[800]};
      }
    `,actionsBtnOffline:n`
      & svg {
        stroke: ${i(t.yellow[700],t.yellow[500])};
        fill: ${i(t.yellow[700],t.yellow[500])};
      }
    `,overflowQueryContainer:n`
      flex: 1;
      overflow-y: auto;
      & > div {
        display: flex;
        flex-direction: column;
      }
    `,queryRow:n`
      display: flex;
      align-items: center;
      padding: 0;
      border: none;
      cursor: pointer;
      color: ${i(t.gray[700],t.gray[300])};
      background-color: ${i(t.gray[50],t.darkGray[700])};
      line-height: 1;
      &:focus {
        outline: none;
      }
      &:focus-visible {
        outline-offset: -2px;
        border-radius: ${a.radius.xs};
        outline: 2px solid ${t.blue[800]};
      }
      &:hover .tsqd-query-hash {
        background-color: ${i(t.gray[200],t.darkGray[600])};
      }

      & .tsqd-query-observer-count {
        padding: 0 ${S.size[1]};
        user-select: none;
        min-width: ${S.size[6.5]};
        align-self: stretch;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: ${r.size.xs};
        font-weight: ${r.weight.medium};
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom: 1px solid ${i(t.gray[300],t.darkGray[700])};
      }
      & .tsqd-query-hash {
        user-select: text;
        font-size: ${r.size.xs};
        display: flex;
        align-items: center;
        min-height: ${S.size[6]};
        flex: 1;
        padding: ${S.size[1]} ${S.size[2]};
        font-family:
          ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
          'Liberation Mono', 'Courier New', monospace;
        border-bottom: 1px solid ${i(t.gray[300],t.darkGray[400])};
        text-align: left;
        text-overflow: clip;
        word-break: break-word;
      }

      & .tsqd-query-disabled-indicator {
        align-self: stretch;
        display: flex;
        align-items: center;
        padding: 0 ${S.size[2]};
        color: ${i(t.gray[800],t.gray[300])};
        background-color: ${i(t.gray[300],t.darkGray[600])};
        border-bottom: 1px solid ${i(t.gray[300],t.darkGray[400])};
        font-size: ${r.size.xs};
      }
    `,selectedQueryRow:n`
      background-color: ${i(t.gray[200],t.darkGray[500])};
    `,detailsContainer:n`
      flex: 1 1 700px;
      background-color: ${i(t.gray[50],t.darkGray[700])};
      color: ${i(t.gray[700],t.gray[300])};
      font-family: ui-sans-serif, Inter, system-ui, sans-serif, sans-serif;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      display: flex;
      text-align: left;
    `,detailsHeader:n`
      font-family: ui-sans-serif, Inter, system-ui, sans-serif, sans-serif;
      position: sticky;
      top: 0;
      z-index: 2;
      background-color: ${i(t.gray[200],t.darkGray[600])};
      padding: ${S.size[1.5]} ${S.size[2]};
      font-weight: ${r.weight.medium};
      font-size: ${r.size.xs};
      line-height: ${r.lineHeight.xs};
      text-align: left;
    `,detailsBody:n`
      margin: ${S.size[1.5]} 0px ${S.size[2]} 0px;
      & > div {
        display: flex;
        align-items: stretch;
        padding: 0 ${S.size[2]};
        line-height: ${r.lineHeight.sm};
        justify-content: space-between;
        & > span {
          font-size: ${r.size.xs};
        }
        & > span:nth-child(2) {
          font-variant-numeric: tabular-nums;
        }
      }

      & > div:first-child {
        margin-bottom: ${S.size[1.5]};
      }

      & code {
        font-family:
          ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
          'Liberation Mono', 'Courier New', monospace;
        margin: 0;
        font-size: ${r.size.xs};
        line-height: ${r.lineHeight.xs};
      }

      & pre {
        margin: 0;
        display: flex;
        align-items: center;
      }
    `,queryDetailsStatus:n`
      border: 1px solid ${t.darkGray[200]};
      border-radius: ${S.border.radius.sm};
      font-weight: ${r.weight.medium};
      padding: ${S.size[1]} ${S.size[2.5]};
    `,actionsBody:n`
      flex-wrap: wrap;
      margin: ${S.size[2]} 0px ${S.size[2]} 0px;
      display: flex;
      gap: ${S.size[2]};
      padding: 0px ${S.size[2]};
      & > button {
        font-family: ui-sans-serif, Inter, system-ui, sans-serif, sans-serif;
        font-size: ${r.size.xs};
        padding: ${S.size[1]} ${S.size[2]};
        display: flex;
        border-radius: ${S.border.radius.sm};
        background-color: ${i(t.gray[100],t.darkGray[600])};
        border: 1px solid ${i(t.gray[300],t.darkGray[400])};
        align-items: center;
        gap: ${S.size[2]};
        font-weight: ${r.weight.medium};
        line-height: ${r.lineHeight.xs};
        cursor: pointer;
        &:focus-visible {
          outline-offset: 2px;
          border-radius: ${a.radius.xs};
          outline: 2px solid ${t.blue[800]};
        }
        &:hover {
          background-color: ${i(t.gray[200],t.darkGray[500])};
        }

        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        & > span {
          width: ${o[1.5]};
          height: ${o[1.5]};
          border-radius: ${S.border.radius.full};
        }
      }
    `,actionsSelect:n`
      font-size: ${r.size.xs};
      padding: ${S.size[.5]} ${S.size[2]};
      display: flex;
      border-radius: ${S.border.radius.sm};
      overflow: hidden;
      background-color: ${i(t.gray[100],t.darkGray[600])};
      border: 1px solid ${i(t.gray[300],t.darkGray[400])};
      align-items: center;
      gap: ${S.size[2]};
      font-weight: ${r.weight.medium};
      line-height: ${r.lineHeight.sm};
      color: ${i(t.red[500],t.red[400])};
      cursor: pointer;
      position: relative;
      &:hover {
        background-color: ${i(t.gray[200],t.darkGray[500])};
      }
      & > span {
        width: ${o[1.5]};
        height: ${o[1.5]};
        border-radius: ${S.border.radius.full};
      }
      &:focus-within {
        outline-offset: 2px;
        border-radius: ${a.radius.xs};
        outline: 2px solid ${t.blue[800]};
      }
      & select {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        appearance: none;
        background-color: transparent;
        border: none;
        color: transparent;
        outline: none;
      }

      & svg path {
        stroke: ${S.colors.red[400]};
      }
      & svg {
        width: ${S.size[2]};
        height: ${S.size[2]};
      }
    `,settingsMenu:n`
      display: flex;
      & * {
        font-family: ui-sans-serif, Inter, system-ui, sans-serif, sans-serif;
      }
      flex-direction: column;
      gap: ${o[.5]};
      border-radius: ${S.border.radius.sm};
      border: 1px solid ${i(t.gray[300],t.gray[700])};
      background-color: ${i(t.gray[50],t.darkGray[600])};
      font-size: ${r.size.xs};
      color: ${i(t.gray[700],t.gray[300])};
      z-index: 99999;
      min-width: 120px;
      padding: ${o[.5]};
    `,settingsSubTrigger:n`
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-radius: ${S.border.radius.xs};
      padding: ${S.size[1]} ${S.size[1]};
      cursor: pointer;
      background-color: transparent;
      border: none;
      color: ${i(t.gray[700],t.gray[300])};
      & svg {
        color: ${i(t.gray[600],t.gray[400])};
        transform: rotate(-90deg);
        width: ${S.size[2]};
        height: ${S.size[2]};
      }
      &:hover {
        background-color: ${i(t.gray[200],t.darkGray[500])};
      }
      &:focus-visible {
        outline-offset: 2px;
        outline: 2px solid ${t.blue[800]};
      }
      &.data-disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    `,settingsMenuHeader:n`
      padding: ${S.size[1]} ${S.size[1]};
      font-weight: ${r.weight.medium};
      border-bottom: 1px solid ${i(t.gray[300],t.darkGray[400])};
      color: ${i(t.gray[500],t.gray[400])};
      font-size: ${r.size.xs};
    `,settingsSubButton:n`
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: ${i(t.gray[700],t.gray[300])};
      font-size: ${r.size.xs};
      border-radius: ${S.border.radius.xs};
      padding: ${S.size[1]} ${S.size[1]};
      cursor: pointer;
      background-color: transparent;
      border: none;
      & svg {
        color: ${i(t.gray[600],t.gray[400])};
      }
      &:hover {
        background-color: ${i(t.gray[200],t.darkGray[500])};
      }
      &:focus-visible {
        outline-offset: 2px;
        outline: 2px solid ${t.blue[800]};
      }
    `,themeSelectedButton:n`
      background-color: ${i(t.purple[100],t.purple[900])};
      color: ${i(t.purple[700],t.purple[300])};
      & svg {
        color: ${i(t.purple[700],t.purple[300])};
      }
      &:hover {
        background-color: ${i(t.purple[100],t.purple[900])};
      }
    `,viewToggle:n`
      border-radius: ${S.border.radius.sm};
      background-color: ${i(t.gray[200],t.darkGray[600])};
      border: 1px solid ${i(t.gray[300],t.darkGray[200])};
      display: flex;
      padding: 0;
      font-size: ${r.size.xs};
      color: ${i(t.gray[700],t.gray[300])};
      overflow: hidden;

      &:has(:focus-visible) {
        outline: 2px solid ${t.blue[800]};
      }

      & .tsqd-radio-toggle {
        opacity: 0.5;
        display: flex;
        & label {
          display: flex;
          align-items: center;
          cursor: pointer;
          line-height: ${r.lineHeight.md};
        }

        & label:hover {
          background-color: ${i(t.gray[100],t.darkGray[500])};
        }
      }

      & > [data-checked] {
        opacity: 1;
        background-color: ${i(t.gray[100],t.darkGray[400])};
        & label:hover {
          background-color: ${i(t.gray[100],t.darkGray[400])};
        }
      }

      & .tsqd-radio-toggle:first-child {
        & label {
          padding: 0 ${S.size[1.5]} 0 ${S.size[2]};
        }
        border-right: 1px solid ${i(t.gray[300],t.darkGray[200])};
      }

      & .tsqd-radio-toggle:nth-child(2) {
        & label {
          padding: 0 ${S.size[2]} 0 ${S.size[1.5]};
        }
      }
    `,devtoolsEditForm:n`
      padding: ${o[2]};
      & > [data-error='true'] {
        outline: 2px solid ${i(t.red[200],t.red[800])};
        outline-offset: 2px;
        border-radius: ${a.radius.xs};
      }
    `,devtoolsEditTextarea:n`
      width: 100%;
      max-height: 500px;
      font-family: 'Fira Code', monospace;
      font-size: ${r.size.xs};
      border-radius: ${a.radius.sm};
      field-sizing: content;
      padding: ${o[2]};
      background-color: ${i(t.gray[100],t.darkGray[800])};
      color: ${i(t.gray[900],t.gray[100])};
      border: 1px solid ${i(t.gray[200],t.gray[700])};
      resize: none;
      &:focus {
        outline-offset: 2px;
        border-radius: ${a.radius.xs};
        outline: 2px solid ${i(t.blue[200],t.blue[800])};
      }
    `,devtoolsEditFormActions:n`
      display: flex;
      justify-content: space-between;
      gap: ${o[2]};
      align-items: center;
      padding-top: ${o[1]};
      font-size: ${r.size.xs};
    `,devtoolsEditFormError:n`
      color: ${i(t.red[700],t.red[500])};
    `,devtoolsEditFormActionContainer:n`
      display: flex;
      gap: ${o[2]};
    `,devtoolsEditFormAction:n`
      font-family: ui-sans-serif, Inter, system-ui, sans-serif, sans-serif;
      font-size: ${r.size.xs};
      padding: ${o[1]} ${S.size[2]};
      display: flex;
      border-radius: ${a.radius.sm};
      background-color: ${i(t.gray[100],t.darkGray[600])};
      border: 1px solid ${i(t.gray[300],t.darkGray[400])};
      align-items: center;
      gap: ${o[2]};
      font-weight: ${r.weight.medium};
      line-height: ${r.lineHeight.xs};
      cursor: pointer;
      &:focus-visible {
        outline-offset: 2px;
        border-radius: ${a.radius.xs};
        outline: 2px solid ${t.blue[800]};
      }
      &:hover {
        background-color: ${i(t.gray[200],t.darkGray[500])};
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    `}},Ve=e=>Ks("light",e),He=e=>Ks("dark",e);kn(["click","mousedown","input"]);export{ff as a,gf as b,ol as c,hf as d,il as e,vf as f,pf as g,Rs as h};

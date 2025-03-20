!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(t="undefined"!=typeof globalThis?globalThis:t||self).PlantaeFilter=e()}(this,(function(){"use strict";var t=Object.defineProperty,e=(e,n,s)=>((e,n,s)=>n in e?t(e,n,{enumerable:!0,configurable:!0,writable:!0,value:s}):e[n]=s)(e,"symbol"!=typeof n?n+"":n,s);function n(t){return Array.isArray?Array.isArray(t):"[object Array]"===l(t)}function s(t){return"string"==typeof t}function i(t){return"number"==typeof t}function o(t){return!0===t||!1===t||function(t){return r(t)&&null!==t}(t)&&"[object Boolean]"==l(t)}function r(t){return"object"==typeof t}function c(t){return null!=t}function a(t){return!t.trim().length}function l(t){return null==t?void 0===t?"[object Undefined]":"[object Null]":Object.prototype.toString.call(t)}const u=Object.prototype.hasOwnProperty;class h{constructor(t){this._keys=[],this._keyMap={};let e=0;t.forEach((t=>{let n=d(t);this._keys.push(n),this._keyMap[n.id]=n,e+=n.weight})),this._keys.forEach((t=>{t.weight/=e}))}get(t){return this._keyMap[t]}keys(){return this._keys}toJSON(){return JSON.stringify(this._keys)}}function d(t){let e=null,i=null,o=null,r=1,c=null;if(s(t)||n(t))o=t,e=p(t),i=g(t);else{if(!u.call(t,"name"))throw new Error((t=>`Missing ${t} property in key`)("name"));const n=t.name;if(o=n,u.call(t,"weight")&&(r=t.weight,r<=0))throw new Error((t=>`Property 'weight' in key '${t}' must be a positive integer`)(n));e=p(n),i=g(n),c=t.getFn}return{path:e,id:i,weight:r,src:o,getFn:c}}function p(t){return n(t)?t:t.split(".")}function g(t){return n(t)?t.join("."):t}var f={isCaseSensitive:!1,ignoreDiacritics:!1,includeScore:!1,keys:[],shouldSort:!0,sortFn:(t,e)=>t.score===e.score?t.idx<e.idx?-1:1:t.score<e.score?-1:1,includeMatches:!1,findAllMatches:!1,minMatchCharLength:1,location:0,threshold:.6,distance:100,...{useExtendedSearch:!1,getFn:function(t,e){let r=[],a=!1;const l=(t,e,u)=>{if(c(t))if(e[u]){const h=t[e[u]];if(!c(h))return;if(u===e.length-1&&(s(h)||i(h)||o(h)))r.push(function(t){return null==t?"":function(t){if("string"==typeof t)return t;let e=t+"";return"0"==e&&1/t==-1/0?"-0":e}(t)}(h));else if(n(h)){a=!0;for(let t=0,n=h.length;t<n;t+=1)l(h[t],e,u+1)}else e.length&&l(h,e,u+1)}else r.push(t)};return l(t,s(e)?e.split("."):e,0),a?r:r[0]},ignoreLocation:!1,ignoreFieldNorm:!1,fieldNormWeight:1}};const m=/[^ ]+/g;class y{constructor({getFn:t=f.getFn,fieldNormWeight:e=f.fieldNormWeight}={}){this.norm=function(t=1,e=3){const n=new Map,s=Math.pow(10,e);return{get(e){const i=e.match(m).length;if(n.has(i))return n.get(i);const o=1/Math.pow(i,.5*t),r=parseFloat(Math.round(o*s)/s);return n.set(i,r),r},clear(){n.clear()}}}(e,3),this.getFn=t,this.isCreated=!1,this.setIndexRecords()}setSources(t=[]){this.docs=t}setIndexRecords(t=[]){this.records=t}setKeys(t=[]){this.keys=t,this._keysMap={},t.forEach(((t,e)=>{this._keysMap[t.id]=e}))}create(){!this.isCreated&&this.docs.length&&(this.isCreated=!0,s(this.docs[0])?this.docs.forEach(((t,e)=>{this._addString(t,e)})):this.docs.forEach(((t,e)=>{this._addObject(t,e)})),this.norm.clear())}add(t){const e=this.size();s(t)?this._addString(t,e):this._addObject(t,e)}removeAt(t){this.records.splice(t,1);for(let e=t,n=this.size();e<n;e+=1)this.records[e].i-=1}getValueForItemAtKeyId(t,e){return t[this._keysMap[e]]}size(){return this.records.length}_addString(t,e){if(!c(t)||a(t))return;let n={v:t,i:e,n:this.norm.get(t)};this.records.push(n)}_addObject(t,e){let i={i:e,$:{}};this.keys.forEach(((e,o)=>{let r=e.getFn?e.getFn(t):this.getFn(t,e.path);if(c(r))if(n(r)){let t=[];const e=[{nestedArrIndex:-1,value:r}];for(;e.length;){const{nestedArrIndex:i,value:o}=e.pop();if(c(o))if(s(o)&&!a(o)){let e={v:o,i:i,n:this.norm.get(o)};t.push(e)}else n(o)&&o.forEach(((t,n)=>{e.push({nestedArrIndex:n,value:t})}))}i.$[o]=t}else if(s(r)&&!a(r)){let t={v:r,n:this.norm.get(r)};i.$[o]=t}})),this.records.push(i)}toJSON(){return{keys:this.keys,records:this.records}}}function A(t,e,{getFn:n=f.getFn,fieldNormWeight:s=f.fieldNormWeight}={}){const i=new y({getFn:n,fieldNormWeight:s});return i.setKeys(t.map(d)),i.setSources(e),i.create(),i}function v(t,{errors:e=0,currentLocation:n=0,expectedLocation:s=0,distance:i=f.distance,ignoreLocation:o=f.ignoreLocation}={}){const r=e/t.length;if(o)return r;const c=Math.abs(s-n);return i?r+c/i:c?1:r}const x=32;function E(t,e,n,{location:s=f.location,distance:i=f.distance,threshold:o=f.threshold,findAllMatches:r=f.findAllMatches,minMatchCharLength:c=f.minMatchCharLength,includeMatches:a=f.includeMatches,ignoreLocation:l=f.ignoreLocation}={}){if(e.length>x)throw new Error(`Pattern length exceeds max of ${x}.`);const u=e.length,h=t.length,d=Math.max(0,Math.min(s,h));let p=o,g=d;const m=c>1||a,y=m?Array(h):[];let A;for(;(A=t.indexOf(e,g))>-1;){let t=v(e,{currentLocation:A,expectedLocation:d,distance:i,ignoreLocation:l});if(p=Math.min(t,p),g=A+u,m){let t=0;for(;t<u;)y[A+t]=1,t+=1}}g=-1;let E=[],b=1,w=u+h;const C=1<<u-1;for(let f=0;f<u;f+=1){let s=0,o=w;for(;s<o;){v(e,{errors:f,currentLocation:d+o,expectedLocation:d,distance:i,ignoreLocation:l})<=p?s=o:w=o,o=Math.floor((w-s)/2+s)}w=o;let c=Math.max(1,d-o+1),a=r?h:Math.min(d+o,h)+u,A=Array(a+2);A[a+1]=(1<<f)-1;for(let r=a;r>=c;r-=1){let s=r-1,o=n[t.charAt(s)];if(m&&(y[s]=+!!o),A[r]=(A[r+1]<<1|1)&o,f&&(A[r]|=(E[r+1]|E[r])<<1|1|E[r+1]),A[r]&C&&(b=v(e,{errors:f,currentLocation:s,expectedLocation:d,distance:i,ignoreLocation:l}),b<=p)){if(p=b,g=s,g<=d)break;c=Math.max(1,2*d-g)}}if(v(e,{errors:f+1,currentLocation:d,expectedLocation:d,distance:i,ignoreLocation:l})>p)break;E=A}const _={isMatch:g>=0,score:Math.max(.001,b)};if(m){const t=function(t=[],e=f.minMatchCharLength){let n=[],s=-1,i=-1,o=0;for(let r=t.length;o<r;o+=1){let r=t[o];r&&-1===s?s=o:r||-1===s||(i=o-1,i-s+1>=e&&n.push([s,i]),s=-1)}return t[o-1]&&o-s>=e&&n.push([s,o-1]),n}(y,c);t.length?a&&(_.indices=t):_.isMatch=!1}return _}function b(t){let e={};for(let n=0,s=t.length;n<s;n+=1){const i=t.charAt(n);e[i]=(e[i]||0)|1<<s-n-1}return e}const w=String.prototype.normalize?t=>t.normalize("NFD").replace(/[\u0300-\u036F\u0483-\u0489\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u07FD\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u08D3-\u08E1\u08E3-\u0903\u093A-\u093C\u093E-\u094F\u0951-\u0957\u0962\u0963\u0981-\u0983\u09BC\u09BE-\u09C4\u09C7\u09C8\u09CB-\u09CD\u09D7\u09E2\u09E3\u09FE\u0A01-\u0A03\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81-\u0A83\u0ABC\u0ABE-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AE2\u0AE3\u0AFA-\u0AFF\u0B01-\u0B03\u0B3C\u0B3E-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B62\u0B63\u0B82\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD7\u0C00-\u0C04\u0C3E-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C81-\u0C83\u0CBC\u0CBE-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0D00-\u0D03\u0D3B\u0D3C\u0D3E-\u0D44\u0D46-\u0D48\u0D4A-\u0D4D\u0D57\u0D62\u0D63\u0D82\u0D83\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2\u0DF3\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EB9\u0EBB\u0EBC\u0EC8-\u0ECD\u0F18\u0F19\u0F35\u0F37\u0F39\u0F3E\u0F3F\u0F71-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102B-\u103E\u1056-\u1059\u105E-\u1060\u1062-\u1064\u1067-\u106D\u1071-\u1074\u1082-\u108D\u108F\u109A-\u109D\u135D-\u135F\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4-\u17D3\u17DD\u180B-\u180D\u1885\u1886\u18A9\u1920-\u192B\u1930-\u193B\u1A17-\u1A1B\u1A55-\u1A5E\u1A60-\u1A7C\u1A7F\u1AB0-\u1ABE\u1B00-\u1B04\u1B34-\u1B44\u1B6B-\u1B73\u1B80-\u1B82\u1BA1-\u1BAD\u1BE6-\u1BF3\u1C24-\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE8\u1CED\u1CF2-\u1CF4\u1CF7-\u1CF9\u1DC0-\u1DF9\u1DFB-\u1DFF\u20D0-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\uA66F-\uA672\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA823-\uA827\uA880\uA881\uA8B4-\uA8C5\uA8E0-\uA8F1\uA8FF\uA926-\uA92D\uA947-\uA953\uA980-\uA983\uA9B3-\uA9C0\uA9E5\uAA29-\uAA36\uAA43\uAA4C\uAA4D\uAA7B-\uAA7D\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEB-\uAAEF\uAAF5\uAAF6\uABE3-\uABEA\uABEC\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F]/g,""):t=>t;class C{constructor(t,{location:e=f.location,threshold:n=f.threshold,distance:s=f.distance,includeMatches:i=f.includeMatches,findAllMatches:o=f.findAllMatches,minMatchCharLength:r=f.minMatchCharLength,isCaseSensitive:c=f.isCaseSensitive,ignoreDiacritics:a=f.ignoreDiacritics,ignoreLocation:l=f.ignoreLocation}={}){if(this.options={location:e,threshold:n,distance:s,includeMatches:i,findAllMatches:o,minMatchCharLength:r,isCaseSensitive:c,ignoreDiacritics:a,ignoreLocation:l},t=c?t:t.toLowerCase(),t=a?w(t):t,this.pattern=t,this.chunks=[],!this.pattern.length)return;const u=(t,e)=>{this.chunks.push({pattern:t,alphabet:b(t),startIndex:e})},h=this.pattern.length;if(h>x){let t=0;const e=h%x,n=h-e;for(;t<n;)u(this.pattern.substr(t,x),t),t+=x;if(e){const t=h-x;u(this.pattern.substr(t),t)}}else u(this.pattern,0)}searchIn(t){const{isCaseSensitive:e,ignoreDiacritics:n,includeMatches:s}=this.options;if(t=e?t:t.toLowerCase(),t=n?w(t):t,this.pattern===t){let e={isMatch:!0,score:0};return s&&(e.indices=[[0,t.length-1]]),e}const{location:i,distance:o,threshold:r,findAllMatches:c,minMatchCharLength:a,ignoreLocation:l}=this.options;let u=[],h=0,d=!1;this.chunks.forEach((({pattern:e,alphabet:n,startIndex:p})=>{const{isMatch:g,score:f,indices:m}=E(t,e,n,{location:i+p,distance:o,threshold:r,findAllMatches:c,minMatchCharLength:a,includeMatches:s,ignoreLocation:l});g&&(d=!0),h+=f,g&&m&&(u=[...u,...m])}));let p={isMatch:d,score:d?h/this.chunks.length:1};return d&&s&&(p.indices=u),p}}class _{constructor(t){this.pattern=t}static isMultiMatch(t){return M(t,this.multiRegex)}static isSingleMatch(t){return M(t,this.singleRegex)}search(){}}function M(t,e){const n=t.match(e);return n?n[1]:null}class B extends _{constructor(t,{location:e=f.location,threshold:n=f.threshold,distance:s=f.distance,includeMatches:i=f.includeMatches,findAllMatches:o=f.findAllMatches,minMatchCharLength:r=f.minMatchCharLength,isCaseSensitive:c=f.isCaseSensitive,ignoreDiacritics:a=f.ignoreDiacritics,ignoreLocation:l=f.ignoreLocation}={}){super(t),this._bitapSearch=new C(t,{location:e,threshold:n,distance:s,includeMatches:i,findAllMatches:o,minMatchCharLength:r,isCaseSensitive:c,ignoreDiacritics:a,ignoreLocation:l})}static get type(){return"fuzzy"}static get multiRegex(){return/^"(.*)"$/}static get singleRegex(){return/^(.*)$/}search(t){return this._bitapSearch.searchIn(t)}}class k extends _{constructor(t){super(t)}static get type(){return"include"}static get multiRegex(){return/^'"(.*)"$/}static get singleRegex(){return/^'(.*)$/}search(t){let e,n=0;const s=[],i=this.pattern.length;for(;(e=t.indexOf(this.pattern,n))>-1;)n=e+i,s.push([e,n-1]);const o=!!s.length;return{isMatch:o,score:o?0:1,indices:s}}}const D=[class extends _{constructor(t){super(t)}static get type(){return"exact"}static get multiRegex(){return/^="(.*)"$/}static get singleRegex(){return/^=(.*)$/}search(t){const e=t===this.pattern;return{isMatch:e,score:e?0:1,indices:[0,this.pattern.length-1]}}},k,class extends _{constructor(t){super(t)}static get type(){return"prefix-exact"}static get multiRegex(){return/^\^"(.*)"$/}static get singleRegex(){return/^\^(.*)$/}search(t){const e=t.startsWith(this.pattern);return{isMatch:e,score:e?0:1,indices:[0,this.pattern.length-1]}}},class extends _{constructor(t){super(t)}static get type(){return"inverse-prefix-exact"}static get multiRegex(){return/^!\^"(.*)"$/}static get singleRegex(){return/^!\^(.*)$/}search(t){const e=!t.startsWith(this.pattern);return{isMatch:e,score:e?0:1,indices:[0,t.length-1]}}},class extends _{constructor(t){super(t)}static get type(){return"inverse-suffix-exact"}static get multiRegex(){return/^!"(.*)"\$$/}static get singleRegex(){return/^!(.*)\$$/}search(t){const e=!t.endsWith(this.pattern);return{isMatch:e,score:e?0:1,indices:[0,t.length-1]}}},class extends _{constructor(t){super(t)}static get type(){return"suffix-exact"}static get multiRegex(){return/^"(.*)"\$$/}static get singleRegex(){return/^(.*)\$$/}search(t){const e=t.endsWith(this.pattern);return{isMatch:e,score:e?0:1,indices:[t.length-this.pattern.length,t.length-1]}}},class extends _{constructor(t){super(t)}static get type(){return"inverse-exact"}static get multiRegex(){return/^!"(.*)"$/}static get singleRegex(){return/^!(.*)$/}search(t){const e=-1===t.indexOf(this.pattern);return{isMatch:e,score:e?0:1,indices:[0,t.length-1]}}},B],F=D.length,S=/ +(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/;const L=new Set([B.type,k.type]);class O{constructor(t,{isCaseSensitive:e=f.isCaseSensitive,ignoreDiacritics:n=f.ignoreDiacritics,includeMatches:s=f.includeMatches,minMatchCharLength:i=f.minMatchCharLength,ignoreLocation:o=f.ignoreLocation,findAllMatches:r=f.findAllMatches,location:c=f.location,threshold:a=f.threshold,distance:l=f.distance}={}){this.query=null,this.options={isCaseSensitive:e,ignoreDiacritics:n,includeMatches:s,minMatchCharLength:i,findAllMatches:r,ignoreLocation:o,location:c,threshold:a,distance:l},t=e?t:t.toLowerCase(),t=n?w(t):t,this.pattern=t,this.query=function(t,e={}){return t.split("|").map((t=>{let n=t.trim().split(S).filter((t=>t&&!!t.trim())),s=[];for(let i=0,o=n.length;i<o;i+=1){const t=n[i];let o=!1,r=-1;for(;!o&&++r<F;){const n=D[r];let i=n.isMultiMatch(t);i&&(s.push(new n(i,e)),o=!0)}if(!o)for(r=-1;++r<F;){const n=D[r];let i=n.isSingleMatch(t);if(i){s.push(new n(i,e));break}}}return s}))}(this.pattern,this.options)}static condition(t,e){return e.useExtendedSearch}searchIn(t){const e=this.query;if(!e)return{isMatch:!1,score:1};const{includeMatches:n,isCaseSensitive:s,ignoreDiacritics:i}=this.options;t=s?t:t.toLowerCase(),t=i?w(t):t;let o=0,r=[],c=0;for(let a=0,l=e.length;a<l;a+=1){const s=e[a];r.length=0,o=0;for(let e=0,i=s.length;e<i;e+=1){const i=s[e],{isMatch:a,indices:l,score:u}=i.search(t);if(!a){c=0,o=0,r.length=0;break}if(o+=1,c+=u,n){const t=i.constructor.type;L.has(t)?r=[...r,...l]:r.push(l)}}if(o){let t={isMatch:!0,score:c/o};return n&&(t.indices=r),t}}return{isMatch:!1,score:1}}}const I=[];function N(t,e){for(let n=0,s=I.length;n<s;n+=1){let s=I[n];if(s.condition(t,e))return new s(t,e)}return new C(t,e)}const R="$and",T="$or",$="$path",z="$val",V=t=>!(!t[R]&&!t[T]),j=t=>({[R]:Object.keys(t).map((e=>({[e]:t[e]})))});function W(t,e,{auto:i=!0}={}){const o=t=>{let c=Object.keys(t);const a=(t=>!!t[$])(t);if(!a&&c.length>1&&!V(t))return o(j(t));if((t=>!n(t)&&r(t)&&!V(t))(t)){const n=a?t[$]:c[0],o=a?t[z]:t[n];if(!s(o))throw new Error((t=>`Invalid value for key ${t}`)(n));const r={keyId:g(n),pattern:o};return i&&(r.searcher=N(o,e)),r}let l={children:[],operator:c[0]};return c.forEach((e=>{const s=t[e];n(s)&&s.forEach((t=>{l.children.push(o(t))}))})),l};return V(t)||(t=j(t)),o(t)}function P(t,e){const n=t.matches;e.matches=[],c(n)&&n.forEach((t=>{if(!c(t.indices)||!t.indices.length)return;const{indices:n,value:s}=t;let i={indices:n,value:s};t.key&&(i.key=t.key.src),t.idx>-1&&(i.refIndex=t.idx),e.matches.push(i)}))}function q(t,e){e.score=t.score}class H{constructor(t,e={},n){this.options={...f,...e},this.options.useExtendedSearch,this._keyStore=new h(this.options.keys),this.setCollection(t,n)}setCollection(t,e){if(this._docs=t,e&&!(e instanceof y))throw new Error("Incorrect 'index' type");this._myIndex=e||A(this.options.keys,this._docs,{getFn:this.options.getFn,fieldNormWeight:this.options.fieldNormWeight})}add(t){c(t)&&(this._docs.push(t),this._myIndex.add(t))}remove(t=()=>!1){const e=[];for(let n=0,s=this._docs.length;n<s;n+=1){const i=this._docs[n];t(i,n)&&(this.removeAt(n),n-=1,s-=1,e.push(i))}return e}removeAt(t){this._docs.splice(t,1),this._myIndex.removeAt(t)}getIndex(){return this._myIndex}search(t,{limit:e=-1}={}){const{includeMatches:n,includeScore:o,shouldSort:r,sortFn:c,ignoreFieldNorm:a}=this.options;let l=s(t)?s(this._docs[0])?this._searchStringList(t):this._searchObjectList(t):this._searchLogical(t);return function(t,{ignoreFieldNorm:e=f.ignoreFieldNorm}){t.forEach((t=>{let n=1;t.matches.forEach((({key:t,norm:s,score:i})=>{const o=t?t.weight:null;n*=Math.pow(0===i&&o?Number.EPSILON:i,(o||1)*(e?1:s))})),t.score=n}))}(l,{ignoreFieldNorm:a}),r&&l.sort(c),i(e)&&e>-1&&(l=l.slice(0,e)),function(t,e,{includeMatches:n=f.includeMatches,includeScore:s=f.includeScore}={}){const i=[];return n&&i.push(P),s&&i.push(q),t.map((t=>{const{idx:n}=t,s={item:e[n],refIndex:n};return i.length&&i.forEach((e=>{e(t,s)})),s}))}(l,this._docs,{includeMatches:n,includeScore:o})}_searchStringList(t){const e=N(t,this.options),{records:n}=this._myIndex,s=[];return n.forEach((({v:t,i:n,n:i})=>{if(!c(t))return;const{isMatch:o,score:r,indices:a}=e.searchIn(t);o&&s.push({item:t,idx:n,matches:[{score:r,value:t,norm:i,indices:a}]})})),s}_searchLogical(t){const e=W(t,this.options),n=(t,e,s)=>{if(!t.children){const{keyId:n,searcher:i}=t,o=this._findMatches({key:this._keyStore.get(n),value:this._myIndex.getValueForItemAtKeyId(e,n),searcher:i});return o&&o.length?[{idx:s,item:e,matches:o}]:[]}const i=[];for(let o=0,r=t.children.length;o<r;o+=1){const r=t.children[o],c=n(r,e,s);if(c.length)i.push(...c);else if(t.operator===R)return[]}return i},s=this._myIndex.records,i={},o=[];return s.forEach((({$:t,i:s})=>{if(c(t)){let r=n(e,t,s);r.length&&(i[s]||(i[s]={idx:s,item:t,matches:[]},o.push(i[s])),r.forEach((({matches:t})=>{i[s].matches.push(...t)})))}})),o}_searchObjectList(t){const e=N(t,this.options),{keys:n,records:s}=this._myIndex,i=[];return s.forEach((({$:t,i:s})=>{if(!c(t))return;let o=[];n.forEach(((n,s)=>{o.push(...this._findMatches({key:n,value:t[s],searcher:e}))})),o.length&&i.push({idx:s,item:t,matches:o})})),i}_findMatches({key:t,value:e,searcher:s}){if(!c(e))return[];let i=[];if(n(e))e.forEach((({v:e,i:n,n:o})=>{if(!c(e))return;const{isMatch:r,score:a,indices:l}=s.searchIn(e);r&&i.push({score:a,key:t,value:e,idx:n,norm:o,indices:l})}));else{const{v:n,n:o}=e,{isMatch:r,score:c,indices:a}=s.searchIn(n);r&&i.push({score:c,key:t,value:n,norm:o,indices:a})}return i}}function Q(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}H.version="7.1.0",H.createIndex=A,H.parseIndex=function(t,{getFn:e=f.getFn,fieldNormWeight:n=f.fieldNormWeight}={}){const{keys:s,records:i}=t,o=new y({getFn:e,fieldNormWeight:n});return o.setKeys(s),o.setIndexRecords(i),o},H.config=f,H.parseQuery=W,function(...t){I.push(...t)}(O);var J,K={exports:{}};const U=Q((J||(J=1,K.exports=function(){var t=function(){for(var t=3,e=document.createElement("b"),n=e.all||[];e.innerHTML="\x3c!--[if gt IE "+ ++t+"]><i><![endif]--\x3e",n[0];);return t>4?t:document.documentMode}(),e=navigator.platform.toLowerCase().indexOf("mac")+1,n=function(t){if(!(this instanceof n))return new n(t);var r=this,c={rows_in_block:50,blocks_in_cluster:4,tag:null,show_no_data_row:!0,no_data_class:"clusterize-no-data",no_data_text:"No data",keep_parity:!0,callbacks:{}};r.options={};for(var a,l=["rows_in_block","blocks_in_cluster","show_no_data_row","no_data_class","no_data_text","keep_parity","tag","callbacks"],u=0;a=l[u];u++)r.options[a]=void 0!==t[a]&&null!=t[a]?t[a]:c[a];var h,d=["scroll","content"];for(u=0;h=d[u];u++)if(r[h+"_elem"]=t[h+"Id"]?document.getElementById(t[h+"Id"]):t[h+"Elem"],!r[h+"_elem"])throw new Error("Error! Could not find "+h+" element");r.content_elem.hasAttribute("tabindex")||r.content_elem.setAttribute("tabindex",0);var p=o(t.rows)?t.rows:r.fetchMarkup(),g={},f=r.scroll_elem.scrollTop;r.insertToDOM(p,g),r.scroll_elem.scrollTop=f;var m=!1,y=0,A=!1,v=function(){e&&(A||(r.content_elem.style.pointerEvents="none"),A=!0,clearTimeout(y),y=setTimeout((function(){r.content_elem.style.pointerEvents="auto",A=!1}),50)),m!=(m=r.getClusterNum(p))&&r.insertToDOM(p,g),r.options.callbacks.scrollingProgress&&r.options.callbacks.scrollingProgress(r.getScrollProgress())},x=0,E=function(){clearTimeout(x),x=setTimeout(r.refresh,100)};s("scroll",r.scroll_elem,v),s("resize",window,E),r.destroy=function(t){i("scroll",r.scroll_elem,v),i("resize",window,E),r.html((t?r.generateEmptyRow():p).join(""))},r.refresh=function(t){(r.getRowsHeight(p)||t)&&r.update(p)},r.update=function(t){p=o(t)?t:[];var e=r.scroll_elem.scrollTop;p.length*r.options.item_height<e&&(r.scroll_elem.scrollTop=0,m=0),r.insertToDOM(p,g),r.scroll_elem.scrollTop=e},r.clear=function(){r.update([])},r.getRowsAmount=function(){return p.length},r.getScrollProgress=function(){return this.options.scroll_top/(p.length*this.options.item_height)*100||0};var b=function(t,e){var n=o(e)?e:[];n.length&&(p="append"==t?p.concat(n):n.concat(p),r.insertToDOM(p,g))};r.append=function(t){b("append",t)},r.prepend=function(t){b("prepend",t)}};function s(t,e,n){return e.addEventListener?e.addEventListener(t,n,!1):e.attachEvent("on"+t,n)}function i(t,e,n){return e.removeEventListener?e.removeEventListener(t,n,!1):e.detachEvent("on"+t,n)}function o(t){return"[object Array]"===Object.prototype.toString.call(t)}function r(t,e){return window.getComputedStyle?window.getComputedStyle(e)[t]:e.currentStyle[t]}return n.prototype={constructor:n,fetchMarkup:function(){for(var t=[],e=this.getChildNodes(this.content_elem);e.length;)t.push(e.shift().outerHTML);return t},exploreEnvironment:function(e,n){var s=this.options;s.content_tag=this.content_elem.tagName.toLowerCase(),e.length&&(t&&t<=9&&!s.tag&&(s.tag=e[0].match(/<([^>\s/]*)/)[1].toLowerCase()),this.content_elem.children.length<=1&&(n.data=this.html(e[0]+e[0]+e[0])),s.tag||(s.tag=this.content_elem.children[0].tagName.toLowerCase()),this.getRowsHeight(e))},getRowsHeight:function(t){var e=this.options,n=e.item_height;if(e.cluster_height=0,t.length){var s=this.content_elem.children;if(s.length){var i=s[Math.floor(s.length/2)];if(e.item_height=i.offsetHeight,"tr"==e.tag&&"collapse"!=r("borderCollapse",this.content_elem)&&(e.item_height+=parseInt(r("borderSpacing",this.content_elem),10)||0),"tr"!=e.tag){var o=parseInt(r("marginTop",i),10)||0,c=parseInt(r("marginBottom",i),10)||0;e.item_height+=Math.max(o,c)}return e.block_height=e.item_height*e.rows_in_block,e.rows_in_cluster=e.blocks_in_cluster*e.rows_in_block,e.cluster_height=e.blocks_in_cluster*e.block_height,n!=e.item_height}}},getClusterNum:function(t){var e=this.options;e.scroll_top=this.scroll_elem.scrollTop;var n=e.cluster_height-e.block_height,s=Math.floor(e.scroll_top/n),i=Math.floor(t.length*e.item_height/n);return Math.min(s,i)},generateEmptyRow:function(){var t=this.options;if(!t.tag||!t.show_no_data_row)return[];var e,n=document.createElement(t.tag),s=document.createTextNode(t.no_data_text);return n.className=t.no_data_class,"tr"==t.tag&&((e=document.createElement("td")).colSpan=100,e.appendChild(s)),n.appendChild(e||s),[n.outerHTML]},generate:function(t){var e=this.options,n=t.length;if(n<e.rows_in_block)return{top_offset:0,bottom_offset:0,rows_above:0,rows:n?t:this.generateEmptyRow()};var s=Math.max((e.rows_in_cluster-e.rows_in_block)*this.getClusterNum(t),0),i=s+e.rows_in_cluster,o=Math.max(s*e.item_height,0),r=Math.max((n-i)*e.item_height,0),c=[],a=s;o<1&&a++;for(var l=s;l<i;l++)t[l]&&c.push(t[l]);return{top_offset:o,bottom_offset:r,rows_above:a,rows:c}},renderExtraTag:function(t,e){var n=document.createElement(this.options.tag),s="clusterize-";return n.className=[s+"extra-row",s+t].join(" "),e&&(n.style.height=e+"px"),n.outerHTML},insertToDOM:function(t,e){this.options.cluster_height||this.exploreEnvironment(t,e);var n=this.generate(t),s=n.rows.join(""),i=this.checkChanges("data",s,e),o=this.checkChanges("top",n.top_offset,e),r=this.checkChanges("bottom",n.bottom_offset,e),c=this.options.callbacks,a=[];i||o?(n.top_offset&&(this.options.keep_parity&&a.push(this.renderExtraTag("keep-parity")),a.push(this.renderExtraTag("top-space",n.top_offset))),a.push(s),n.bottom_offset&&a.push(this.renderExtraTag("bottom-space",n.bottom_offset)),c.clusterWillChange&&c.clusterWillChange(),this.html(a.join("")),"ol"==this.options.content_tag&&this.content_elem.setAttribute("start",n.rows_above),this.content_elem.style["counter-increment"]="clusterize-counter "+(n.rows_above-1),c.clusterChanged&&c.clusterChanged()):r&&(this.content_elem.lastChild.style.height=n.bottom_offset+"px")},html:function(e){var n=this.content_elem;if(t&&t<=9&&"tr"==this.options.tag){var s,i=document.createElement("div");for(i.innerHTML="<table><tbody>"+e+"</tbody></table>";s=n.lastChild;)n.removeChild(s);for(var o=this.getChildNodes(i.firstChild.firstChild);o.length;)n.appendChild(o.shift())}else n.innerHTML=e},getChildNodes:function(t){for(var e=t.children,n=[],s=0,i=e.length;s<i;s++)n.push(e[s]);return n},checkChanges:function(t,e,n){var s=e!=n[t];return n[t]=e,s}},n}()),K.exports));class G extends HTMLElement{constructor(){super(),e(this,"options",[]),e(this,"selectedValues",[]),e(this,"pendingValues",[]),e(this,"fuse"),e(this,"clusterize"),e(this,"config",{label:"Filtro",allText:"Todos",emptyText:"Selecione",groupNameSelecteds:"Selecionados",fuseOptions:{keys:["text","value"],threshold:.3,ignoreDiacritics:!0,useExtendedSearch:!0,ignoreLocation:!0,includeScore:!0,includeMatches:!0},clusterizeOptions:{tag:"ul",no_data_text:"Não encontrado"}})}connectedCallback(){this.loadConfig(),this.loadTemplate(),requestAnimationFrame((()=>{this.extractOptions(),this.attachEvents(),this.initSearch(),this.initClusterize(),this.populateOptions(this.options),this.syncSelectElement(),this.updateFilter(),this.dispatchEvent(new CustomEvent("plantae-filter-ready",{bubbles:!1}))}))}loadConfig(){this.config.label=this.getAttribute("label")||this.config.label,this.config.allText=this.getAttribute("all-text")||this.config.allText,this.config.emptyText=this.getAttribute("empty-text")||this.config.emptyText,this.config.groupNameSelecteds=this.getAttribute("group-name-selecteds")||this.config.groupNameSelecteds;const t=this.getAttribute("fuse-options");if(t)try{const e=JSON.parse(t);this.config.fuseOptions={...this.config.fuseOptions,...e}}catch(n){console.warn("Invalid JSON for fuse-options",n)}const e=this.getAttribute("clusterize-options");if(e)try{const t=JSON.parse(e);this.config.clusterizeOptions={...this.config.clusterizeOptions,...t}}catch(n){console.warn("Invalid JSON for clusterize-options",n)}}extractOptions(){const t=this.querySelector("select");if(!t)return;const e=[];Array.from(t.children).forEach((t=>{if("optgroup"===t.tagName.toLowerCase()){const n=t,s=n.label;Array.from(n.children).forEach((t=>{const n=t;e.push({value:isNaN(Number(n.value))?n.value:Number(n.value),text:n.text,group:s})}))}else if("option"===t.tagName.toLowerCase()){const n=t;e.push({value:isNaN(Number(n.value))?n.value:Number(n.value),text:n.text,group:null})}})),this.options=e,t.style.display="none",this.fuse=new H(e,this.config.fuseOptions)}loadTemplate(){const t=document.createElement("template");t.innerHTML='<style>:host{color-scheme:light}.select-dropdown-wrapper{display:inline-block;position:relative}.filter{background-color:#fff;color:#333;padding:5px 10px;border:1px solid #999;border-radius:4px;cursor:pointer;display:inline-flex;align-items:center;max-width:300px;white-space:nowrap;text-overflow:ellipsis;position:relative;overflow:visible;font-size:.8em}.filter-text-wrapper{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1}.btn-close{background:none;border:none;cursor:pointer;font-size:14px;margin-left:8px;color:inherit}.form-control{display:block;width:100%;padding:.4rem .75rem;font-size:.9rem;line-height:1.4;color:#333;background-color:#fff;border:1px solid #ccc;border-radius:4px}.form-control:focus{outline:none;border-color:#777;box-shadow:0 0 0 2px #0000001a}.mb-2{margin-bottom:.5rem}.select-dropdown{display:none;position:absolute;top:100%;left:0;background:#fff;border:1px solid #ccc;box-shadow:0 2px 4px #0000001a;z-index:10;width:100%;min-width:200px;border-radius:4px;font-size:.85em}.scroll-area{max-height:200px;overflow-y:auto}.content-area{padding:0;margin:0;list-style:none}.select-dropdown ul{list-style:none;padding:0;margin:0}.select-dropdown li{padding:5px 10px;cursor:pointer;transition:background .2s}.select-dropdown li.selected{background:#333;color:#fff;font-weight:700}.select-dropdown li:not(.optgroup):hover{background:#555;color:#fff}.select-dropdown li.optgroup{font-weight:700;font-size:.85rem;color:#666;background-color:#f5f5f5;padding:8px 12px;cursor:default}ul.clusterize-no-data{padding:10px;font-size:.85rem;color:#999;font-style:italic}.dropdown-header{display:flex;padding:8px}.dropdown-header input{width:100%;padding:4px 8px}.dropdown-footer{padding:8px;text-align:right;border-top:1px solid #ccc}.btn{display:inline-block;background:#333;color:#fff;padding:.3rem .6rem;font-size:.75rem;border:none;border-radius:4px;cursor:pointer}.btn:hover{background:#555}.btn:focus{outline:none;box-shadow:0 0 0 2px #0003}.btn:disabled{opacity:.6;cursor:not-allowed}.counter-filter{background:#d33;color:#fff;font-size:.7rem;font-weight:700;border-radius:999px;padding:2px 6px;position:absolute;top:0;left:0;transform:translate(-40%,-50%);z-index:20;box-shadow:0 0 2px #0000004d}mark{background:#ff0;color:inherit;border-radius:3px;pointer-events:none}.select-dropdown li.selected mark{color:#333;font-weight:700}.select-dropdown li:not(.optgroup):hover mark{color:#333}</style><div class="select-dropdown-wrapper">\n    <div id="filter" class="filter" part="filter">\n        <div class="filter-text-wrapper" part="filter-text-wrapper">\n            <span id="filterText" part="filter-text"></span>\n        </div>\n        <button class="btn-close" id="clearButton" part="clear-button" title="Limpar itens selecionados">✕</button>\n    </div>\n    <div class="select-dropdown" id="dropdown" part="dropdown">\n        <div class="dropdown-header" part="dropdown-header">\n            <input type="text" id="searchInput" part="search-input" placeholder="Buscar...">\n        </div>\n        <div id="scrollArea" class="scroll-area" part="scroll-area">\n            <ul id="contentArea" class="content-area" part="content-area"></ul>\n        </div>\n        <div class="dropdown-footer" part="dropdown-footer">\n            <button id="applyButton" part="apply-button">Aplicar</button>\n        </div>\n    </div>\n</div>',this.attachShadow({mode:"open"}).append(t.content.cloneNode(!0))}populateOptions(t){const e=[],n=[],s=new Map,i=new Set(this.pendingValues.map(String)),o=this.shadowRoot.getElementById("searchInput"),r=!!(null==o?void 0:o.value.trim()),c=(t,e)=>{if(!e||0===e.length)return t;const n=e.find((t=>"text"===t.key||"value"===t.key));if(!n)return t;const s=function(t){const e=[...t].sort(((t,e)=>t[0]-e[0])),n=[];for(const[s,i]of e)if(n.length){const t=n[n.length-1];s<=t[1]+1?t[1]=Math.max(t[1],i):n.push([s,i])}else n.push([s,i]);return n}(n.indices);let i="",o=0;return s.forEach((([e,n])=>{i+=t.slice(o,e),i+=`<mark>${t.slice(e,n+1)}</mark>`,o=n+1})),i+=t.slice(o),i};for(const a of t){let t,e;"item"in a?(t=a.item,e=a.matches):(t=a,e=void 0);const o=i.has(String(t.value)),l=r?c(t.text,e):t.text,u=`<li part="dropdown-item${o?" selected":""}" data-value="${t.value}">${l}</li>`;o?n.push(u):(s.has(t.group)||s.set(t.group,[]),s.get(t.group).push(u))}if(n.length>0&&(e.push(`<li class="optgroup">${this.config.groupNameSelecteds} (${n.length})</li>`),e.push(...n),e.push('<li class="optgroup"></li>')),r)s.forEach((t=>e.push(...t)));else{let t=null;for(const[n,i]of s)n!==t&&(n?e.push(`<li class="optgroup">${n}</li>`):null!==t&&e.push('<li class="optgroup"></li>'),t=n),e.push(...i)}this.clusterize.update(e)}updateFilter(){const t=this.options.length,e=this.selectedValues.length,n=this.options.filter((t=>this.selectedValues.includes(String(t.value)))).map((t=>t.text));this.shadowRoot.getElementById("filterText").innerHTML=e?`<span class='counter-filter'>${e}</span> <strong>${this.config.label}:</strong> ${e===t?this.config.allText:n.join(", ")}`:`<strong>${this.config.label}:</strong> ${this.config.emptyText}`;const s=this.shadowRoot.getElementById("clearButton");s.style.opacity=e?"1":"0.5",s.style.pointerEvents=e?"auto":"none";this.shadowRoot.getElementById("filter").setAttribute("title",e?n.join(", "):"")}attachEvents(){document.addEventListener("keydown",(t=>this.handleEscKey(t))),this.shadowRoot.getElementById("filter").addEventListener("click",(()=>this.toggleDropdown())),this.shadowRoot.getElementById("clearButton").addEventListener("click",(t=>this.clearSelectionInterno(t))),this.shadowRoot.getElementById("applyButton").addEventListener("click",(()=>this.applySelection())),document.addEventListener("click",(t=>this.handleOutsideClick(t)))}toggleSelectOption(t,e){t.classList.toggle("selected"),t.classList.contains("selected")?(this.pendingValues.push(e),t.setAttribute("part","dropdown-item selected")):(this.pendingValues=this.pendingValues.filter((t=>t!==e)),t.setAttribute("part","dropdown-item"))}handleOutsideClick(t){this.contains(t.target)||this.closeDropdown()}handleEscKey(t){"Escape"===t.key&&this.closeDropdown()}initSearch(){const t=this.shadowRoot.getElementById("searchInput");t.addEventListener("input",function(t,e=300){let n;return(...s)=>{clearTimeout(n),n=setTimeout((()=>t(...s)),e)}}((()=>{const e=t.value.trim();if(!e)return this.populateOptions(this.options),void this.syncPendingWithApplied();const n=this.fuse.search(e);this.populateOptions(n),this.syncPendingWithApplied()}),300))}initClusterize(){this.clusterize=new U({rows:[],scrollElem:this.shadowRoot.getElementById("scrollArea"),contentElem:this.shadowRoot.getElementById("contentArea"),...this.config.clusterizeOptions}),this.shadowRoot.getElementById("contentArea").addEventListener("click",(t=>{const e=t.target;if("li"===e.tagName.toLowerCase()&&!e.classList.contains("optgroup")){const t=e,n=t.dataset.value;this.toggleSelectOption(t,n)}}))}syncSelectElement(){const t=this.querySelector("select");t.innerHTML="",this.options.filter((t=>this.selectedValues.includes(String(t.value)))).forEach((e=>{const n=document.createElement("option");n.value=String(e.value),n.text=e.text,n.selected=!0,t.appendChild(n)}))}applySelection(){this.selectedValues=[...this.pendingValues],this.syncSelectElement(),this.updateFilter(),this.closeDropdown(),this.dispatchEvent(new Event("change"))}clearSelectionInterno(t){null==t||t.stopPropagation(),this.selectedValues=[],this.pendingValues=[],this.populateOptions(this.options),this.syncSelectElement(),this.updateFilter(),this.dispatchEvent(new Event("change"))}toggleDropdown(){"block"===this.shadowRoot.getElementById("dropdown").style.display?this.closeDropdown():this.openDropdown()}closeDropdown(){this.shadowRoot.getElementById("dropdown").style.display="none"}openDropdown(){const t=this.shadowRoot.getElementById("searchInput"),e=this.shadowRoot.getElementById("dropdown");t&&(t.value="",requestAnimationFrame((()=>{t.focus()}))),e.style.display="block",this.pendingValues=[...this.selectedValues],this.populateOptions(this.options),this.syncPendingWithApplied()}syncPendingWithApplied(){this.shadowRoot.querySelectorAll("#contentArea li[data-value]").forEach((t=>{const e=t,n=e.dataset.value;this.pendingValues.includes(n)?(e.classList.add("selected"),e.setAttribute("part","dropdown-item selected")):(e.classList.remove("selected"),e.setAttribute("part","dropdown-item"))}))}isOptionDisabled(t){const e=this.shadowRoot.querySelector(`#contentArea li[data-value='${t}']`);return(null==e?void 0:e.classList.contains("disabled"))||!1}setOptionsDisabled(t,e){this.shadowRoot.querySelectorAll("#contentArea li[data-value]").forEach((n=>{const s=n,i=s.dataset.value;t.includes(i)&&(e?(s.classList.add("disabled"),s.setAttribute("aria-disabled","true"),s.style.pointerEvents="none",s.style.opacity="0.5"):(s.classList.remove("disabled"),s.removeAttribute("aria-disabled"),s.style.pointerEvents="",s.style.opacity=""))}))}addOption(t){this.options.find((e=>e.value===t.value))||(this.options.push({value:t.value,text:t.text,group:t.group??null}),this.fuse.setCollection(this.options),this.populateOptions(this.options),this.syncSelectElement())}addOptions(t){t.forEach((t=>{this.options.find((e=>e.value===t.value))||this.options.push({value:t.value,text:t.text,group:t.group??null})})),this.fuse.setCollection(this.options),this.populateOptions(this.options),this.syncSelectElement()}selectOptions(t){t.filter((t=>{const e=this.options.find((e=>e.value===t));return e&&!this.isOptionDisabled(e.value)})).forEach((t=>{this.selectedValues.includes(String(t))||this.selectedValues.push(String(t))})),this.pendingValues=[...this.selectedValues],this.populateOptions(this.options),this.syncSelectElement(),this.updateFilter()}removeOptions(t){this.options=this.options.filter((e=>!t.includes(e.value))),this.selectedValues=this.selectedValues.filter((e=>!t.includes(e))),this.pendingValues=this.pendingValues.filter((e=>!t.includes(e))),this.fuse.setCollection(this.options),this.populateOptions(this.options),this.syncSelectElement(),this.updateFilter()}removeAllOptions(){this.options=[],this.selectedValues=[],this.pendingValues=[],this.fuse.setCollection(this.options),this.populateOptions(this.options),this.syncSelectElement(),this.updateFilter()}clearSelection(){this.clearSelectionInterno()}disableOptions(t){this.setOptionsDisabled(t,!0)}enableOptions(t){this.setOptionsDisabled(t,!1)}getSelected(){return this.options.filter((t=>this.selectedValues.includes(String(t.value))))}getAllOptions(){return[...this.options]}}return customElements.get("plantae-filter")||customElements.define("plantae-filter",G),class{constructor(t,n={}){var s;e(this,"component"),e(this,"isReady",!1),e(this,"queue",[]);const i=document.createElement("plantae-filter"),o={...this.getDatasetAttributes(t),...n};Object.entries(o).forEach((([t,e])=>{i.setAttribute(t,e)})),null==(s=t.parentNode)||s.insertBefore(i,t),i.appendChild(t),this.component=i,i.addEventListener("plantae-filter-ready",(()=>{this.isReady=!0,this.flushQueue()}))}flushQueue(){this.queue.forEach((t=>t())),this.queue=[]}runOrQueue(t){this.isReady?t():this.queue.push(t)}getDatasetAttributes(t){const e={};return Array.from(t.attributes).forEach((t=>{if(t.name.startsWith("data-pl-")){const n=t.name.replace("data-pl-","");e[n]=t.value}})),e}addOption(t){this.runOrQueue((()=>this.component.addOption(t)))}addOptions(t){this.runOrQueue((()=>this.component.addOptions(t)))}selectOptions(t){this.runOrQueue((()=>this.component.selectOptions(t)))}removeOptions(t){this.runOrQueue((()=>this.component.removeOptions(t)))}removeAllOptions(){this.runOrQueue((()=>this.component.removeAllOptions()))}clearSelection(){this.runOrQueue((()=>this.component.clearSelection()))}disableOptions(t){this.runOrQueue((()=>this.component.disableOptions(t)))}enableOptions(t){this.runOrQueue((()=>this.component.enableOptions(t)))}getSelected(){return this.component.getSelected()}getAllOptions(){return this.component.getAllOptions()}}}));

!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(t="undefined"!=typeof globalThis?globalThis:t||self).PlantaeFilter=e()}(this,(function(){"use strict";var t=Object.defineProperty,e=(e,o,i)=>((e,o,i)=>o in e?t(e,o,{enumerable:!0,configurable:!0,writable:!0,value:i}):e[o]=i)(e,"symbol"!=typeof o?o+"":o,i),o="undefined"!=typeof document?document.currentScript:null;function i(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var n,s={exports:{}};const r=i((n||(n=1,s.exports=function(){var t=function(){for(var t=3,e=document.createElement("b"),o=e.all||[];e.innerHTML="\x3c!--[if gt IE "+ ++t+"]><i><![endif]--\x3e",o[0];);return t>4?t:document.documentMode}(),e=navigator.platform.toLowerCase().indexOf("mac")+1,o=function(t){if(!(this instanceof o))return new o(t);var r=this,l={rows_in_block:50,blocks_in_cluster:4,tag:null,show_no_data_row:!0,no_data_class:"clusterize-no-data",no_data_text:"No data",keep_parity:!0,callbacks:{}};r.options={};for(var a,c=["rows_in_block","blocks_in_cluster","show_no_data_row","no_data_class","no_data_text","keep_parity","tag","callbacks"],d=0;a=c[d];d++)r.options[a]=void 0!==t[a]&&null!=t[a]?t[a]:l[a];var h,p=["scroll","content"];for(d=0;h=p[d];d++)if(r[h+"_elem"]=t[h+"Id"]?document.getElementById(t[h+"Id"]):t[h+"Elem"],!r[h+"_elem"])throw new Error("Error! Could not find "+h+" element");r.content_elem.hasAttribute("tabindex")||r.content_elem.setAttribute("tabindex",0);var u=s(t.rows)?t.rows:r.fetchMarkup(),f={},g=r.scroll_elem.scrollTop;r.insertToDOM(u,f),r.scroll_elem.scrollTop=g;var m=!1,b=0,w=!1,y=function(){e&&(w||(r.content_elem.style.pointerEvents="none"),w=!0,clearTimeout(b),b=setTimeout((function(){r.content_elem.style.pointerEvents="auto",w=!1}),50)),m!=(m=r.getClusterNum(u))&&r.insertToDOM(u,f),r.options.callbacks.scrollingProgress&&r.options.callbacks.scrollingProgress(r.getScrollProgress())},v=0,x=function(){clearTimeout(v),v=setTimeout(r.refresh,100)};i("scroll",r.scroll_elem,y),i("resize",window,x),r.destroy=function(t){n("scroll",r.scroll_elem,y),n("resize",window,x),r.html((t?r.generateEmptyRow():u).join(""))},r.refresh=function(t){(r.getRowsHeight(u)||t)&&r.update(u)},r.update=function(t){u=s(t)?t:[];var e=r.scroll_elem.scrollTop;u.length*r.options.item_height<e&&(r.scroll_elem.scrollTop=0,m=0),r.insertToDOM(u,f),r.scroll_elem.scrollTop=e},r.clear=function(){r.update([])},r.getRowsAmount=function(){return u.length},r.getScrollProgress=function(){return this.options.scroll_top/(u.length*this.options.item_height)*100||0};var _=function(t,e){var o=s(e)?e:[];o.length&&(u="append"==t?u.concat(o):o.concat(u),r.insertToDOM(u,f))};r.append=function(t){_("append",t)},r.prepend=function(t){_("prepend",t)}};function i(t,e,o){return e.addEventListener?e.addEventListener(t,o,!1):e.attachEvent("on"+t,o)}function n(t,e,o){return e.removeEventListener?e.removeEventListener(t,o,!1):e.detachEvent("on"+t,o)}function s(t){return"[object Array]"===Object.prototype.toString.call(t)}function r(t,e){return window.getComputedStyle?window.getComputedStyle(e)[t]:e.currentStyle[t]}return o.prototype={constructor:o,fetchMarkup:function(){for(var t=[],e=this.getChildNodes(this.content_elem);e.length;)t.push(e.shift().outerHTML);return t},exploreEnvironment:function(e,o){var i=this.options;i.content_tag=this.content_elem.tagName.toLowerCase(),e.length&&(t&&t<=9&&!i.tag&&(i.tag=e[0].match(/<([^>\s/]*)/)[1].toLowerCase()),this.content_elem.children.length<=1&&(o.data=this.html(e[0]+e[0]+e[0])),i.tag||(i.tag=this.content_elem.children[0].tagName.toLowerCase()),this.getRowsHeight(e))},getRowsHeight:function(t){var e=this.options,o=e.item_height;if(e.cluster_height=0,t.length){var i=this.content_elem.children;if(i.length){var n=i[Math.floor(i.length/2)];if(e.item_height=n.offsetHeight,"tr"==e.tag&&"collapse"!=r("borderCollapse",this.content_elem)&&(e.item_height+=parseInt(r("borderSpacing",this.content_elem),10)||0),"tr"!=e.tag){var s=parseInt(r("marginTop",n),10)||0,l=parseInt(r("marginBottom",n),10)||0;e.item_height+=Math.max(s,l)}return e.block_height=e.item_height*e.rows_in_block,e.rows_in_cluster=e.blocks_in_cluster*e.rows_in_block,e.cluster_height=e.blocks_in_cluster*e.block_height,o!=e.item_height}}},getClusterNum:function(t){var e=this.options;e.scroll_top=this.scroll_elem.scrollTop;var o=e.cluster_height-e.block_height,i=Math.floor(e.scroll_top/o),n=Math.floor(t.length*e.item_height/o);return Math.min(i,n)},generateEmptyRow:function(){var t=this.options;if(!t.tag||!t.show_no_data_row)return[];var e,o=document.createElement(t.tag),i=document.createTextNode(t.no_data_text);return o.className=t.no_data_class,"tr"==t.tag&&((e=document.createElement("td")).colSpan=100,e.appendChild(i)),o.appendChild(e||i),[o.outerHTML]},generate:function(t){var e=this.options,o=t.length;if(o<e.rows_in_block)return{top_offset:0,bottom_offset:0,rows_above:0,rows:o?t:this.generateEmptyRow()};var i=Math.max((e.rows_in_cluster-e.rows_in_block)*this.getClusterNum(t),0),n=i+e.rows_in_cluster,s=Math.max(i*e.item_height,0),r=Math.max((o-n)*e.item_height,0),l=[],a=i;s<1&&a++;for(var c=i;c<n;c++)t[c]&&l.push(t[c]);return{top_offset:s,bottom_offset:r,rows_above:a,rows:l}},renderExtraTag:function(t,e){var o=document.createElement(this.options.tag),i="clusterize-";return o.className=[i+"extra-row",i+t].join(" "),e&&(o.style.height=e+"px"),o.outerHTML},insertToDOM:function(t,e){this.options.cluster_height||this.exploreEnvironment(t,e);var o=this.generate(t),i=o.rows.join(""),n=this.checkChanges("data",i,e),s=this.checkChanges("top",o.top_offset,e),r=this.checkChanges("bottom",o.bottom_offset,e),l=this.options.callbacks,a=[];n||s?(o.top_offset&&(this.options.keep_parity&&a.push(this.renderExtraTag("keep-parity")),a.push(this.renderExtraTag("top-space",o.top_offset))),a.push(i),o.bottom_offset&&a.push(this.renderExtraTag("bottom-space",o.bottom_offset)),l.clusterWillChange&&l.clusterWillChange(),this.html(a.join("")),"ol"==this.options.content_tag&&this.content_elem.setAttribute("start",o.rows_above),this.content_elem.style["counter-increment"]="clusterize-counter "+(o.rows_above-1),l.clusterChanged&&l.clusterChanged()):r&&(this.content_elem.lastChild.style.height=o.bottom_offset+"px")},html:function(e){var o=this.content_elem;if(t&&t<=9&&"tr"==this.options.tag){var i,n=document.createElement("div");for(n.innerHTML="<table><tbody>"+e+"</tbody></table>";i=o.lastChild;)o.removeChild(i);for(var s=this.getChildNodes(n.firstChild.firstChild);s.length;)o.appendChild(s.shift())}else o.innerHTML=e},getChildNodes:function(t){for(var e=t.children,o=[],i=0,n=e.length;i<n;i++)o.push(e[i]);return o},checkChanges:function(t,e,o){var i=e!=o[t];return o[t]=e,i}},o}()),s.exports));class l extends HTMLElement{constructor(){super(),e(this,"options",[]),e(this,"optionMap",new Map),e(this,"selectedValues",new Set),e(this,"pendingValues",new Set),e(this,"clusterize"),e(this,"cursorIndex",-1),e(this,"searchToken",0),e(this,"searchWorker"),e(this,"loadingIndicator"),e(this,"searchInput"),e(this,"applyButton"),e(this,"clearButton"),e(this,"dropdown"),e(this,"filterText"),e(this,"filter"),e(this,"scrollArea"),e(this,"contentArea"),e(this,"config",{label:"Filtro",allText:"Todos",emptyText:"Selecione",applyButtonText:"Aplicar",groupSelectedLabel:"Selecionados",searchPlaceholder:"Buscar..",searchDebounceDelay:100,fuseOptions:{keys:["text","value"],threshold:.3,ignoreDiacritics:!0,useExtendedSearch:!0,ignoreLocation:!0,includeScore:!0,includeMatches:!0},clusterizeOptions:{tag:"ul",no_data_text:"Não encontrado"}})}connectedCallback(){this.loadConfig(),this.loadTemplate(),requestAnimationFrame((()=>{this.extractOptions(),this.attachEvents(),this.initFuseWorker(),this.initClusterize(),this.populateOptions(this.options),this.syncSelectElement(),this.updateFilter(),this.dispatchEvent(new CustomEvent("plantae-filter-ready",{bubbles:!1}))}))}loadConfig(){const t=function(t){const e={};return Array.from(t.attributes).forEach((t=>{const o=t.name.replace(/-([a-z])/g,((t,e)=>e.toUpperCase()));e[o]=t.value})),e}(this);this.config.label=t.label||this.config.label,this.config.allText=t.allText||this.config.allText,this.config.emptyText=t.emptyText||this.config.emptyText,this.config.groupSelectedLabel=t.groupSelectedLabel||this.config.groupSelectedLabel,this.config.applyButtonText=t.applyButtonText||this.config.applyButtonText,this.config.searchPlaceholder=t.searchPlaceholder||this.config.searchPlaceholder,this.config.searchDebounceDelay=Number(t.searchDebounceDelay)||this.config.searchDebounceDelay;const e=t.fuseOptions;if(e)try{const t=JSON.parse(e);this.config.fuseOptions={...this.config.fuseOptions,...t}}catch(i){console.warn("Invalid JSON for fuseOptions",i)}const o=t.clusterizeOptions;if(o)try{const t=JSON.parse(o);this.config.clusterizeOptions={...this.config.clusterizeOptions,...t}}catch(i){console.warn("Invalid JSON for clusterizeOptions",i)}}async extractOptions(){const t=this.querySelector("select");if(!t)return;const e=[],o=Array.from(t.children);let i=0;for(const n of o){if(n instanceof HTMLOptGroupElement){for(const t of Array.from(n.children))if(t instanceof HTMLOptionElement){const o={value:t.value,text:t.text,group:n.label,disabled:t.disabled};this.optionMap.set(o.value,o),e.push(o)}}else if(n instanceof HTMLOptionElement){const t={value:n.value,text:n.text,group:null,disabled:n.disabled};this.optionMap.set(t.value,t),e.push(t)}i++,i%200==0&&await new Promise(requestAnimationFrame)}this.options=e,t.style.display="none"}loadTemplate(){const t=document.createElement("template");t.innerHTML='<style>:host{color-scheme:light}.select-dropdown-wrapper{display:inline-block;position:relative}.filter{background-color:#fff;color:#333;padding:5px 10px;border:1px solid #999;border-radius:4px;cursor:pointer;display:inline-flex;align-items:center;max-width:300px;white-space:nowrap;text-overflow:ellipsis;position:relative;overflow:visible;font-size:.8em}.filter-text-wrapper{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1}.btn-close{background:none;border:none;cursor:pointer;font-size:14px;margin-left:8px;color:inherit}.form-control{display:block;width:100%;padding:.4rem .75rem;font-size:.9rem;line-height:1.4;color:#333;background-color:#fff;border:1px solid #ccc;border-radius:4px}.form-control:focus{outline:none;border-color:#777;box-shadow:0 0 0 2px #0000001a}.mb-2{margin-bottom:.5rem}.select-dropdown{display:none;position:absolute;top:100%;left:0;background:#fff;border:1px solid #ccc;box-shadow:0 2px 4px #0000001a;z-index:10;width:100%;min-width:200px;border-radius:4px;font-size:.85em}.scroll-area{max-height:200px;overflow-y:auto}.content-area{padding:0;margin:0;list-style:none}.select-dropdown ul{list-style:none;padding:0;margin:0}.select-dropdown li{padding:5px 10px;cursor:pointer;transition:background .2s}.select-dropdown li.selected{background:#333;color:#fff}.select-dropdown li:not(.optgroup).focused,.select-dropdown li:not(.optgroup):hover{background:#555;color:#fff}.select-dropdown li.disabled{pointer-events:none;opacity:.5}.select-dropdown li.optgroup{font-weight:700;font-size:.85rem;color:#666;background-color:#f5f5f5;padding:8px 12px;cursor:default}ul.clusterize-no-data{padding:10px;font-size:.85rem;color:#999;font-style:italic}.dropdown-header{display:flex;padding:8px}.dropdown-header input{width:100%;padding:4px 8px}.dropdown-footer{border-top:1px solid #ccc;display:flex;justify-content:space-between;align-items:center;padding:.5rem;gap:.5rem}.btn{display:inline-block;background:#333;color:#fff;padding:.3rem .6rem;font-size:.75rem;border:none;border-radius:4px;cursor:pointer}.btn:hover{background:#555}.btn:focus{outline:none;box-shadow:0 0 0 2px #0003}.btn:disabled{opacity:.6;cursor:not-allowed}.counter-filter{background:#d33;color:#fff;font-size:.7rem;font-weight:700;border-radius:999px;padding:2px;min-width:20px;aspect-ratio:1 / 1;display:inline-flex;align-items:center;justify-content:center;position:absolute;top:0;left:0;transform:translate(-40%,-50%);z-index:20;box-shadow:0 0 2px #0000004d}mark{background:#ff03;color:inherit;border-radius:3px;pointer-events:none}.loading-indicator{width:16px;height:16px;min-width:16px;border:2px solid rgba(0,0,0,.2);border-top:2px solid rgba(0,0,0,.8);border-radius:50%;display:inline-block;animation:spin .6s linear infinite;vertical-align:middle;visibility:hidden}@keyframes spin{to{transform:rotate(360deg)}}</style><div class="select-dropdown-wrapper">\n    <div id="filter" class="filter" part="filter">\n        <div class="filter-text-wrapper" part="filter-text-wrapper">\n            <span id="filterText" part="filter-text"></span>\n        </div>\n        <button class="btn-close" id="clearButton" part="clear-button" title="">✕</button>\n    </div>\n    <div class="select-dropdown" id="dropdown" part="dropdown">\n        <div class="dropdown-header" part="dropdown-header">\n            <input type="text" id="searchInput" part="search-input" placeholder="">\n        </div>\n        <div id="scrollArea" class="scroll-area" part="scroll-area">\n            <ul id="contentArea" class="content-area" part="content-area"></ul>\n        </div>\n        <div class="dropdown-footer" part="dropdown-footer">\n            <span id="loadingIndicator" class="loading-indicator" part="loading-indicator"></span>\n            <button id="applyButton" part="apply-button"></button>\n        </div>\n    </div>\n</div>',this.attachShadow({mode:"open"}).append(t.content.cloneNode(!0)),this.searchInput=this.shadowRoot.getElementById("searchInput"),this.applyButton=this.shadowRoot.getElementById("applyButton"),this.clearButton=this.shadowRoot.getElementById("clearButton"),this.dropdown=this.shadowRoot.getElementById("dropdown"),this.filterText=this.shadowRoot.getElementById("filterText"),this.filter=this.shadowRoot.getElementById("filter"),this.scrollArea=this.shadowRoot.getElementById("scrollArea"),this.contentArea=this.shadowRoot.getElementById("contentArea"),this.loadingIndicator=this.shadowRoot.getElementById("loadingIndicator"),this.searchInput.placeholder=this.config.searchPlaceholder,this.applyButton.innerText=this.config.applyButtonText}async populateOptions(t){let e=[];const o=[],i=new Map,n=this.searchInput.value.trim();for(const s of t){const{item:t,matches:e}="item"in s?{item:s.item,matches:s.matches}:{item:s,matches:void 0},r=String(t.value),l=this.pendingValues.has(r),a=t.disabled,c=l?a?"selected disabled":"selected":a?"disabled":"",d=`<li part="dropdown-item ${c}" class="${c}" data-value="${r}" ${a?'aria-disabled="true"':""}>${n?this.formatTextWithHighlight(t.text,e):t.text}</li>`;if(l)o.push(d);else{const e=t.group||null;i.has(e)||i.set(e,[]),i.get(e).push(d)}}o.length>0&&(e.push(`<li class="optgroup">${this.config.groupSelectedLabel} (${o.length})</li>`),e=e.concat(o),e.push('<li class="optgroup"></li>')),n?i.forEach((t=>{e=e.concat(t)})):i.forEach(((t,o)=>{o&&e.push(`<li class="optgroup">${o}</li>`),e=e.concat(t)})),this.clusterize.clear(),this.clusterize.update(e)}formatTextWithHighlight(t,e){if(!e||0===e.length)return t;const o=e.find((t=>"text"===t.key));if(!o)return t;const i=function(t){const e=[...t].sort(((t,e)=>t[0]-e[0])),o=[];for(const[i,n]of e)if(o.length){const t=o[o.length-1];i<=t[1]+1?t[1]=Math.max(t[1],n):o.push([i,n])}else o.push([i,n]);return o}(o.indices);let n="",s=0;return i.forEach((([e,o])=>{n+=t.slice(s,e),n+=`<mark part="highlight">${t.slice(e,o+1)}</mark>`,s=o+1})),n+=t.slice(s),n}updateFilter(){const t=this.options.length,e=this.selectedValues.size,o=this.options.filter((t=>this.selectedValues.has(String(t.value)))).map((t=>t.text));this.filterText.innerHTML=e?`<span class='counter-filter'>${e}</span> <strong>${this.config.label}:</strong> ${e===t?this.config.allText:o.join(", ")}`:`<strong>${this.config.label}:</strong> ${this.config.emptyText}`,this.clearButton.style.opacity=e?"1":"0.5",this.clearButton.style.pointerEvents=e?"auto":"none",this.filter.setAttribute("title",e?o.join(", "):"")}attachEvents(){this.filter.addEventListener("click",(()=>this.toggleDropdown())),this.clearButton.addEventListener("click",(t=>this.clear(t))),this.applyButton.addEventListener("click",(()=>this.applySelection())),this.searchInput.addEventListener("input",function(t,e=300){let o;return(...i)=>{clearTimeout(o),o=setTimeout((()=>t(...i)),e)}}(this.handleSearch.bind(this),this.config.searchDebounceDelay)),this.contentArea.addEventListener("click",this.handleClickitem.bind(this)),document.addEventListener("keydown",(t=>this.handleKeyboardNavigation(t))),document.addEventListener("click",(t=>this.handleOutsideClick(t)))}toggleSelectOption(t,e){t.classList.remove("focused"),t.classList.toggle("selected"),t.classList.contains("selected")?(this.pendingValues.add(e),t.setAttribute("part","dropdown-item selected")):(this.pendingValues.delete(e),t.setAttribute("part","dropdown-item"))}handleOutsideClick(t){this.contains(t.target)||this.closeDropdown()}handleKeyboardNavigation(t){if(!("block"===this.dropdown.style.display))return;const e=Array.from(this.contentArea.querySelectorAll("li[data-value]"));if(!e.length)return;if("ArrowDown"===t.key){t.preventDefault();let o=0;do{this.cursorIndex=(this.cursorIndex+1)%e.length,o++}while(e[this.cursorIndex].classList.contains("disabled")&&o<e.length);this.updateCursor(e)}if("ArrowUp"===t.key){t.preventDefault();let o=0;do{this.cursorIndex=(this.cursorIndex-1+e.length)%e.length,o++}while(e[this.cursorIndex].classList.contains("disabled")&&o<e.length);this.updateCursor(e)}const o=this.shadowRoot.activeElement||document.activeElement;if((!o||"BUTTON"!==o.tagName)&&"Enter"===t.key){t.preventDefault();const o=e[this.cursorIndex];if(o&&!o.classList.contains("disabled")){const t=o.dataset.value;this.toggleSelectOption(o,t)}}}updateCursor(t){if(t.forEach((t=>{t.classList.remove("focused"),t.setAttribute("part",t.classList.contains("selected")?"dropdown-item selected":"dropdown-item")})),this.cursorIndex>=0&&t[this.cursorIndex]){const e=t[this.cursorIndex];e.classList.add("focused");let o="dropdown-item";e.classList.contains("selected")&&(o+=" selected"),o+=" focused",e.setAttribute("part",o),e.scrollIntoView({block:"nearest"})}}handleSearch(){this.searchToken++;const t=this.searchInput.value.trim();if(!t)return this.populateOptions(this.options),void(this.loadingIndicator.style.visibility="hidden");this.loadingIndicator.style.visibility="visible",this.searchWorker.postMessage({type:"search",payload:{term:t,token:this.searchToken}})}handleClickitem(t){const e=t.target;if("li"===e.tagName.toLowerCase()&&!e.classList.contains("optgroup")){const t=e,o=t.dataset.value;this.toggleSelectOption(t,o)}}initFuseWorker(){this.searchWorker=new Worker(new URL(""+("undefined"==typeof document&&"undefined"==typeof location?require("url").pathToFileURL(__dirname+"/assets/search-worker-BgbjMa5d.js").href:new URL("assets/search-worker-BgbjMa5d.js","undefined"==typeof document?location.href:document.currentScript&&"SCRIPT"===document.currentScript.tagName.toUpperCase()&&document.currentScript.src||document.baseURI).href),"undefined"==typeof document&&"undefined"==typeof location?require("url").pathToFileURL(__filename).href:"undefined"==typeof document?location.href:o&&"SCRIPT"===o.tagName.toUpperCase()&&o.src||new URL("plantae-filter.umd.js",document.baseURI).href),{type:"module"}),this.searchWorker.postMessage({type:"init",payload:{collection:this.options,options:this.config.fuseOptions}}),this.searchWorker.onmessage=t=>{if("results"===t.data.type){if(t.data.token!==this.searchToken)return;this.populateOptions(t.data.results),this.loadingIndicator.style.visibility="hidden"}}}initClusterize(){this.clusterize=new r({rows:[],scrollElem:this.scrollArea,contentElem:this.contentArea,...this.config.clusterizeOptions})}syncSelectElement(){const t=this.querySelector("select");t.innerHTML="",this.options.filter((t=>this.selectedValues.has(String(t.value)))).forEach((e=>{const o=document.createElement("option");o.value=String(e.value),o.text=e.text,o.selected=!0,t.appendChild(o)}))}applySelection(){this.selectedValues=new Set(this.pendingValues),this.syncSelectElement(),this.updateFilter(),this.closeDropdown(),this.dispatchEvent(new Event("change"))}clear(t){null==t||t.stopPropagation(),this.selectedValues.clear(),this.pendingValues.clear(),this.populateOptions(this.options),this.syncSelectElement(),this.updateFilter(),this.dispatchEvent(new Event("change"))}toggleDropdown(){"block"===this.dropdown.style.display?this.closeDropdown():this.openDropdown()}closeDropdown(){this.dropdown.style.display="none"}openDropdown(){this.cursorIndex=-1,this.searchInput.value="",requestAnimationFrame((()=>{this.searchInput.focus()})),this.dropdown.style.display="block",this.pendingValues=new Set(this.selectedValues),this.populateOptions(this.options)}addOption(t){this.addOptions([t])}addOptions(t){t.forEach((t=>{this.optionMap.has(t.value)||this.options.push({value:t.value,text:t.text,group:t.group??null,disabled:t.disabled??!1})})),this.searchWorker.postMessage({type:"update",payload:{collection:this.options}}),this.populateOptions(this.options),this.syncSelectElement()}selectOptions(t){t.forEach((t=>{const e=this.optionMap.get(t);!e||e.disabled||this.selectedValues.has(String(t))||this.selectedValues.add(String(t))})),this.pendingValues=new Set(this.selectedValues),this.populateOptions(this.options),this.syncSelectElement(),this.updateFilter()}removeOptions(t){this.options=this.options.filter((e=>!t.includes(e.value))),t.forEach((t=>{this.selectedValues.delete(String(t)),this.pendingValues.delete(String(t))})),this.searchWorker.postMessage({type:"update",payload:{collection:this.options}}),this.populateOptions(this.options),this.syncSelectElement(),this.updateFilter()}removeAllOptions(){this.options=[],this.selectedValues.clear(),this.pendingValues.clear(),this.searchWorker.postMessage({type:"update",payload:{collection:this.options}}),this.populateOptions(this.options),this.syncSelectElement(),this.updateFilter()}clearSelection(){this.clear()}disableOptions(t){t.forEach((t=>{const e=this.optionMap.get(t);e&&(e.disabled=!0)})),this.populateOptions(this.options)}enableOptions(t){t.forEach((t=>{const e=this.optionMap.get(t);e&&(e.disabled=!1)})),this.populateOptions(this.options)}getSelected(){return this.options.filter((t=>this.selectedValues.has(String(t.value))))}getAllOptions(){return[...this.options]}}return customElements.get("plantae-filter")||customElements.define("plantae-filter",l),class{constructor(t,o={}){var i;e(this,"component"),e(this,"isReady",!1),e(this,"queue",[]);const n=document.createElement("plantae-filter"),s={...this.getDatasetAttributes(t,"data-pl-"),...o};Object.entries(s).forEach((([t,e])=>{n.setAttribute(t.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),"string"==typeof e?e:JSON.stringify(e))})),null==(i=t.parentNode)||i.insertBefore(n,t),n.appendChild(t),this.component=n,n.addEventListener("plantae-filter-ready",(()=>{this.isReady=!0,this.flushQueue()}))}flushQueue(){this.queue.forEach((t=>t())),this.queue=[]}runOrQueue(t){this.isReady?t():this.queue.push(t)}getDatasetAttributes(t,e=""){const o={};return Array.from(t.attributes).forEach((t=>{if(t.name.startsWith(e)){const i=t.name.replace(e,"");o[i]=t.value}})),o}addOption(t){this.runOrQueue((()=>this.component.addOption(t)))}addOptions(t){this.runOrQueue((()=>this.component.addOptions(t)))}selectOptions(t){this.runOrQueue((()=>this.component.selectOptions(t)))}removeOptions(t){this.runOrQueue((()=>this.component.removeOptions(t)))}removeAllOptions(){this.runOrQueue((()=>this.component.removeAllOptions()))}clearSelection(){this.runOrQueue((()=>this.component.clearSelection()))}disableOptions(t){this.runOrQueue((()=>this.component.disableOptions(t)))}enableOptions(t){this.runOrQueue((()=>this.component.enableOptions(t)))}getSelected(){return this.component.getSelected()}getAllOptions(){return this.component.getAllOptions()}}}));

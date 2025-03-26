var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
const templateHtml = '<div class="select-dropdown-wrapper">\n    <div id="filter" class="filter" part="filter">\n        <div class="filter-text-wrapper" part="filter-text-wrapper">\n            <span id="filterText" part="filter-text"></span>\n        </div>\n        <button class="btn-close" id="clearButton" part="clear-button" title="">✕</button>\n    </div>\n    <div class="select-dropdown" id="dropdown" part="dropdown" style="display: none;">\n        <div class="dropdown-header" part="dropdown-header">\n            <input type="text" id="searchInput" part="search-input" placeholder="">\n        </div>\n        <div id="scrollArea" class="scroll-area" part="scroll-area">\n            <ul id="contentArea" class="content-area" part="content-area"></ul>\n        </div>\n        <div class="dropdown-footer" part="dropdown-footer">\n            <span id="loadingIndicator" class="loading-indicator" part="loading-indicator"></span>\n            <button id="applyButton" part="apply-button"></button>\n        </div>\n    </div>\n</div>';
const styles = ":host{color-scheme:light}.select-dropdown-wrapper{display:inline-block;position:relative}.filter{background-color:#fff;color:#333;padding:5px 10px;border:1px solid #999;border-radius:4px;cursor:pointer;display:inline-flex;align-items:center;max-width:300px;white-space:nowrap;text-overflow:ellipsis;position:relative;overflow:visible;font-size:.8em}.filter-text-wrapper{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1}.btn-close{background:none;border:none;cursor:pointer;font-size:14px;margin-left:8px;color:inherit}.form-control{display:block;width:100%;padding:.4rem .75rem;font-size:.9rem;line-height:1.4;color:#333;background-color:#fff;border:1px solid #ccc;border-radius:4px}.form-control:focus{outline:none;border-color:#777;box-shadow:0 0 0 2px #0000001a}.mb-2{margin-bottom:.5rem}.select-dropdown{display:none;position:absolute;top:100%;left:0;background:#fff;border:1px solid #ccc;box-shadow:0 2px 4px #0000001a;z-index:10;width:100%;min-width:200px;border-radius:4px;font-size:.85em}.scroll-area{max-height:200px;overflow-y:auto}.content-area{padding:0;margin:0;list-style:none}.select-dropdown ul{list-style:none;padding:0;margin:0}.select-dropdown li{padding:5px 10px;cursor:pointer;transition:background .2s}.select-dropdown li.selected{background:#333;color:#fff}.select-dropdown li:not(.optgroup).focused,.select-dropdown li:not(.optgroup):hover{background:#555;color:#fff}.select-dropdown li.disabled{pointer-events:none;opacity:.5}.select-dropdown li.optgroup{font-weight:700;font-size:.85rem;color:#666;background-color:#f5f5f5;padding:8px 12px;cursor:default}ul.clusterize-no-data{padding:10px;font-size:.85rem;color:#999;font-style:italic}.dropdown-header{display:flex;padding:8px}.dropdown-header input{width:100%;padding:4px 8px}.dropdown-footer{border-top:1px solid #ccc;display:flex;justify-content:space-between;align-items:center;padding:.5rem;gap:.5rem}.btn{display:inline-block;background:#333;color:#fff;padding:.3rem .6rem;font-size:.75rem;border:none;border-radius:4px;cursor:pointer}.btn:hover{background:#555}.btn:focus{outline:none;box-shadow:0 0 0 2px #0003}.btn:disabled{opacity:.6;cursor:not-allowed}.counter-filter{background:#d33;color:#fff;font-size:.7rem;font-weight:700;border-radius:999px;padding:2px;min-width:20px;aspect-ratio:1 / 1;display:inline-flex;align-items:center;justify-content:center;position:absolute;top:0;left:0;transform:translate(-40%,-50%);z-index:20;box-shadow:0 0 2px #0000004d}mark{background:#ff03;color:inherit;border-radius:3px;pointer-events:none}.loading-indicator{width:16px;height:16px;min-width:16px;border:2px solid rgba(0,0,0,.2);border-top:2px solid rgba(0,0,0,.8);border-radius:50%;display:inline-block;animation:spin .6s linear infinite;vertical-align:middle;visibility:hidden}@keyframes spin{to{transform:rotate(360deg)}}";
function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
function mergeOverlapping(indices) {
  const sorted = [...indices].sort((a, b) => a[0] - b[0]);
  const merged = [];
  for (const [start, end] of sorted) {
    if (!merged.length) {
      merged.push([start, end]);
    } else {
      const last = merged[merged.length - 1];
      if (start <= last[1] + 1) {
        last[1] = Math.max(last[1], end);
      } else {
        merged.push([start, end]);
      }
    }
  }
  return merged;
}
function attributesToCamelCase(element) {
  const result = {};
  Array.from(element.attributes).forEach((attr) => {
    const key = attr.name.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
    result[key] = attr.value;
  });
  return result;
}
function camelToKebab(str) {
  return str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var clusterize = { exports: {} };
var hasRequiredClusterize;
function requireClusterize() {
  if (hasRequiredClusterize) return clusterize.exports;
  hasRequiredClusterize = 1;
  (function(module) {
    (function(name, definition) {
      module.exports = definition();
    })("Clusterize", function() {
      var ie = function() {
        for (var v = 3, el = document.createElement("b"), all = el.all || []; el.innerHTML = "<!--[if gt IE " + ++v + "]><i><![endif]-->", all[0]; ) {
        }
        return v > 4 ? v : document.documentMode;
      }(), is_mac = navigator.platform.toLowerCase().indexOf("mac") + 1;
      var Clusterize2 = function(data) {
        if (!(this instanceof Clusterize2))
          return new Clusterize2(data);
        var self = this;
        var defaults = {
          rows_in_block: 50,
          blocks_in_cluster: 4,
          tag: null,
          show_no_data_row: true,
          no_data_class: "clusterize-no-data",
          no_data_text: "No data",
          keep_parity: true,
          callbacks: {}
        };
        self.options = {};
        var options = ["rows_in_block", "blocks_in_cluster", "show_no_data_row", "no_data_class", "no_data_text", "keep_parity", "tag", "callbacks"];
        for (var i = 0, option; option = options[i]; i++) {
          self.options[option] = typeof data[option] != "undefined" && data[option] != null ? data[option] : defaults[option];
        }
        var elems = ["scroll", "content"];
        for (var i = 0, elem; elem = elems[i]; i++) {
          self[elem + "_elem"] = data[elem + "Id"] ? document.getElementById(data[elem + "Id"]) : data[elem + "Elem"];
          if (!self[elem + "_elem"])
            throw new Error("Error! Could not find " + elem + " element");
        }
        if (!self.content_elem.hasAttribute("tabindex"))
          self.content_elem.setAttribute("tabindex", 0);
        var rows = isArray(data.rows) ? data.rows : self.fetchMarkup(), cache = {}, scroll_top = self.scroll_elem.scrollTop;
        self.insertToDOM(rows, cache);
        self.scroll_elem.scrollTop = scroll_top;
        var last_cluster = false, scroll_debounce = 0, pointer_events_set = false, scrollEv = function() {
          if (is_mac) {
            if (!pointer_events_set) self.content_elem.style.pointerEvents = "none";
            pointer_events_set = true;
            clearTimeout(scroll_debounce);
            scroll_debounce = setTimeout(function() {
              self.content_elem.style.pointerEvents = "auto";
              pointer_events_set = false;
            }, 50);
          }
          if (last_cluster != (last_cluster = self.getClusterNum(rows)))
            self.insertToDOM(rows, cache);
          if (self.options.callbacks.scrollingProgress)
            self.options.callbacks.scrollingProgress(self.getScrollProgress());
        }, resize_debounce = 0, resizeEv = function() {
          clearTimeout(resize_debounce);
          resize_debounce = setTimeout(self.refresh, 100);
        };
        on("scroll", self.scroll_elem, scrollEv);
        on("resize", window, resizeEv);
        self.destroy = function(clean) {
          off("scroll", self.scroll_elem, scrollEv);
          off("resize", window, resizeEv);
          self.html((clean ? self.generateEmptyRow() : rows).join(""));
        };
        self.refresh = function(force) {
          if (self.getRowsHeight(rows) || force) self.update(rows);
        };
        self.update = function(new_rows) {
          rows = isArray(new_rows) ? new_rows : [];
          var scroll_top2 = self.scroll_elem.scrollTop;
          if (rows.length * self.options.item_height < scroll_top2) {
            self.scroll_elem.scrollTop = 0;
            last_cluster = 0;
          }
          self.insertToDOM(rows, cache);
          self.scroll_elem.scrollTop = scroll_top2;
        };
        self.clear = function() {
          self.update([]);
        };
        self.getRowsAmount = function() {
          return rows.length;
        };
        self.getScrollProgress = function() {
          return this.options.scroll_top / (rows.length * this.options.item_height) * 100 || 0;
        };
        var add = function(where, _new_rows) {
          var new_rows = isArray(_new_rows) ? _new_rows : [];
          if (!new_rows.length) return;
          rows = where == "append" ? rows.concat(new_rows) : new_rows.concat(rows);
          self.insertToDOM(rows, cache);
        };
        self.append = function(rows2) {
          add("append", rows2);
        };
        self.prepend = function(rows2) {
          add("prepend", rows2);
        };
      };
      Clusterize2.prototype = {
        constructor: Clusterize2,
        // fetch existing markup
        fetchMarkup: function() {
          var rows = [], rows_nodes = this.getChildNodes(this.content_elem);
          while (rows_nodes.length) {
            rows.push(rows_nodes.shift().outerHTML);
          }
          return rows;
        },
        // get tag name, content tag name, tag height, calc cluster height
        exploreEnvironment: function(rows, cache) {
          var opts = this.options;
          opts.content_tag = this.content_elem.tagName.toLowerCase();
          if (!rows.length) return;
          if (ie && ie <= 9 && !opts.tag) opts.tag = rows[0].match(/<([^>\s/]*)/)[1].toLowerCase();
          if (this.content_elem.children.length <= 1) cache.data = this.html(rows[0] + rows[0] + rows[0]);
          if (!opts.tag) opts.tag = this.content_elem.children[0].tagName.toLowerCase();
          this.getRowsHeight(rows);
        },
        getRowsHeight: function(rows) {
          var opts = this.options, prev_item_height = opts.item_height;
          opts.cluster_height = 0;
          if (!rows.length) return;
          var nodes = this.content_elem.children;
          if (!nodes.length) return;
          var node = nodes[Math.floor(nodes.length / 2)];
          opts.item_height = node.offsetHeight;
          if (opts.tag == "tr" && getStyle("borderCollapse", this.content_elem) != "collapse")
            opts.item_height += parseInt(getStyle("borderSpacing", this.content_elem), 10) || 0;
          if (opts.tag != "tr") {
            var marginTop = parseInt(getStyle("marginTop", node), 10) || 0;
            var marginBottom = parseInt(getStyle("marginBottom", node), 10) || 0;
            opts.item_height += Math.max(marginTop, marginBottom);
          }
          opts.block_height = opts.item_height * opts.rows_in_block;
          opts.rows_in_cluster = opts.blocks_in_cluster * opts.rows_in_block;
          opts.cluster_height = opts.blocks_in_cluster * opts.block_height;
          return prev_item_height != opts.item_height;
        },
        // get current cluster number
        getClusterNum: function(rows) {
          var opts = this.options;
          opts.scroll_top = this.scroll_elem.scrollTop;
          var cluster_divider = opts.cluster_height - opts.block_height;
          var current_cluster = Math.floor(opts.scroll_top / cluster_divider);
          var max_cluster = Math.floor(rows.length * opts.item_height / cluster_divider);
          return Math.min(current_cluster, max_cluster);
        },
        // generate empty row if no data provided
        generateEmptyRow: function() {
          var opts = this.options;
          if (!opts.tag || !opts.show_no_data_row) return [];
          var empty_row = document.createElement(opts.tag), no_data_content = document.createTextNode(opts.no_data_text), td;
          empty_row.className = opts.no_data_class;
          if (opts.tag == "tr") {
            td = document.createElement("td");
            td.colSpan = 100;
            td.appendChild(no_data_content);
          }
          empty_row.appendChild(td || no_data_content);
          return [empty_row.outerHTML];
        },
        // generate cluster for current scroll position
        generate: function(rows) {
          var opts = this.options, rows_len = rows.length;
          if (rows_len < opts.rows_in_block) {
            return {
              top_offset: 0,
              bottom_offset: 0,
              rows_above: 0,
              rows: rows_len ? rows : this.generateEmptyRow()
            };
          }
          var items_start = Math.max((opts.rows_in_cluster - opts.rows_in_block) * this.getClusterNum(rows), 0), items_end = items_start + opts.rows_in_cluster, top_offset = Math.max(items_start * opts.item_height, 0), bottom_offset = Math.max((rows_len - items_end) * opts.item_height, 0), this_cluster_rows = [], rows_above = items_start;
          if (top_offset < 1) {
            rows_above++;
          }
          for (var i = items_start; i < items_end; i++) {
            rows[i] && this_cluster_rows.push(rows[i]);
          }
          return {
            top_offset,
            bottom_offset,
            rows_above,
            rows: this_cluster_rows
          };
        },
        renderExtraTag: function(class_name, height) {
          var tag = document.createElement(this.options.tag), clusterize_prefix = "clusterize-";
          tag.className = [clusterize_prefix + "extra-row", clusterize_prefix + class_name].join(" ");
          height && (tag.style.height = height + "px");
          return tag.outerHTML;
        },
        // if necessary verify data changed and insert to DOM
        insertToDOM: function(rows, cache) {
          if (!this.options.cluster_height) {
            this.exploreEnvironment(rows, cache);
          }
          var data = this.generate(rows), this_cluster_rows = data.rows.join(""), this_cluster_content_changed = this.checkChanges("data", this_cluster_rows, cache), top_offset_changed = this.checkChanges("top", data.top_offset, cache), only_bottom_offset_changed = this.checkChanges("bottom", data.bottom_offset, cache), callbacks = this.options.callbacks, layout = [];
          if (this_cluster_content_changed || top_offset_changed) {
            if (data.top_offset) {
              this.options.keep_parity && layout.push(this.renderExtraTag("keep-parity"));
              layout.push(this.renderExtraTag("top-space", data.top_offset));
            }
            layout.push(this_cluster_rows);
            data.bottom_offset && layout.push(this.renderExtraTag("bottom-space", data.bottom_offset));
            callbacks.clusterWillChange && callbacks.clusterWillChange();
            this.html(layout.join(""));
            this.options.content_tag == "ol" && this.content_elem.setAttribute("start", data.rows_above);
            this.content_elem.style["counter-increment"] = "clusterize-counter " + (data.rows_above - 1);
            callbacks.clusterChanged && callbacks.clusterChanged();
          } else if (only_bottom_offset_changed) {
            this.content_elem.lastChild.style.height = data.bottom_offset + "px";
          }
        },
        // unfortunately ie <= 9 does not allow to use innerHTML for table elements, so make a workaround
        html: function(data) {
          var content_elem = this.content_elem;
          if (ie && ie <= 9 && this.options.tag == "tr") {
            var div = document.createElement("div"), last;
            div.innerHTML = "<table><tbody>" + data + "</tbody></table>";
            while (last = content_elem.lastChild) {
              content_elem.removeChild(last);
            }
            var rows_nodes = this.getChildNodes(div.firstChild.firstChild);
            while (rows_nodes.length) {
              content_elem.appendChild(rows_nodes.shift());
            }
          } else {
            content_elem.innerHTML = data;
          }
        },
        getChildNodes: function(tag) {
          var child_nodes = tag.children, nodes = [];
          for (var i = 0, ii = child_nodes.length; i < ii; i++) {
            nodes.push(child_nodes[i]);
          }
          return nodes;
        },
        checkChanges: function(type, value, cache) {
          var changed = value != cache[type];
          cache[type] = value;
          return changed;
        }
      };
      function on(evt, element, fnc) {
        return element.addEventListener ? element.addEventListener(evt, fnc, false) : element.attachEvent("on" + evt, fnc);
      }
      function off(evt, element, fnc) {
        return element.removeEventListener ? element.removeEventListener(evt, fnc, false) : element.detachEvent("on" + evt, fnc);
      }
      function isArray(arr) {
        return Object.prototype.toString.call(arr) === "[object Array]";
      }
      function getStyle(prop, elem) {
        return window.getComputedStyle ? window.getComputedStyle(elem)[prop] : elem.currentStyle[prop];
      }
      return Clusterize2;
    });
  })(clusterize);
  return clusterize.exports;
}
var clusterizeExports = requireClusterize();
const Clusterize = /* @__PURE__ */ getDefaultExportFromCjs(clusterizeExports);
class PlantaeFilterElement extends HTMLElement {
  constructor() {
    super(...arguments);
    __publicField(this, "options", []);
    __publicField(this, "optionMap", /* @__PURE__ */ new Map());
    __publicField(this, "selectedValues", /* @__PURE__ */ new Set());
    __publicField(this, "pendingValues", /* @__PURE__ */ new Set());
    __publicField(this, "clusterize");
    __publicField(this, "cursorIndex", -1);
    __publicField(this, "searchToken", 0);
    __publicField(this, "searchWorker");
    __publicField(this, "loadingIndicator");
    __publicField(this, "searchInput");
    __publicField(this, "applyButton");
    __publicField(this, "clearButton");
    __publicField(this, "dropdown");
    __publicField(this, "filterText");
    __publicField(this, "filter");
    __publicField(this, "scrollArea");
    __publicField(this, "contentArea");
    __publicField(this, "config", {
      label: "Filtro",
      allText: "Todos",
      emptyText: "Selecione",
      applyButtonText: "Aplicar",
      groupSelectedLabel: "Selecionados",
      searchPlaceholder: "Buscar..",
      searchDebounceDelay: 100,
      fuseOptions: {
        keys: ["text", "value"],
        threshold: 0.3,
        ignoreDiacritics: true,
        useExtendedSearch: true,
        ignoreLocation: true,
        includeScore: true,
        includeMatches: true
      },
      clusterizeOptions: {
        tag: "ul",
        no_data_text: "Não encontrado"
      }
    });
  }
  connectedCallback() {
    this.loadConfig();
    this.loadTemplate();
    requestAnimationFrame(() => {
      this.extractOptions();
      this.attachEvents();
      this.initFuseWorker();
      this.initClusterize();
      this.populateOptions(this.options);
      this.syncSelectElement();
      this.updateFilter();
      this.dispatchEvent(new CustomEvent("plantae-filter-ready", { bubbles: false }));
    });
  }
  loadConfig() {
    const componentAttributes = attributesToCamelCase(this);
    this.config.label = componentAttributes.label || this.config.label;
    this.config.allText = componentAttributes.allText || this.config.allText;
    this.config.emptyText = componentAttributes.emptyText || this.config.emptyText;
    this.config.groupSelectedLabel = componentAttributes.groupSelectedLabel || this.config.groupSelectedLabel;
    this.config.applyButtonText = componentAttributes.applyButtonText || this.config.applyButtonText;
    this.config.searchPlaceholder = componentAttributes.searchPlaceholder || this.config.searchPlaceholder;
    this.config.searchDebounceDelay = Number(componentAttributes.searchDebounceDelay) || this.config.searchDebounceDelay;
    const fuseAttr = componentAttributes.fuseOptions;
    if (fuseAttr) {
      try {
        const parsed = JSON.parse(fuseAttr);
        this.config.fuseOptions = { ...this.config.fuseOptions, ...parsed };
      } catch (err) {
        console.warn("Invalid JSON for fuseOptions", err);
      }
    }
    const clusterizeAttr = componentAttributes.clusterizeOptions;
    if (clusterizeAttr) {
      try {
        const parsed = JSON.parse(clusterizeAttr);
        this.config.clusterizeOptions = { ...this.config.clusterizeOptions, ...parsed };
      } catch (err) {
        console.warn("Invalid JSON for clusterizeOptions", err);
      }
    }
  }
  async extractOptions() {
    const selectElement = this.querySelector("select");
    if (!selectElement) return;
    const flatOptions = [];
    const children = Array.from(selectElement.children);
    let batchCount = 0;
    for (const child of children) {
      if (child instanceof HTMLOptGroupElement) {
        for (const option of Array.from(child.children)) {
          if (option instanceof HTMLOptionElement) {
            const opt = {
              value: option.value,
              text: option.text,
              group: child.label,
              disabled: option.disabled
            };
            this.optionMap.set(opt.value, opt);
            flatOptions.push(opt);
          }
        }
      } else if (child instanceof HTMLOptionElement) {
        const opt = {
          value: child.value,
          text: child.text,
          group: null,
          disabled: child.disabled
        };
        this.optionMap.set(opt.value, opt);
        flatOptions.push(opt);
      }
      batchCount++;
      if (batchCount % 200 === 0) {
        await new Promise(requestAnimationFrame);
      }
    }
    this.options = flatOptions;
    selectElement.style.display = "none";
  }
  loadTemplate() {
    const template = document.createElement("template");
    template.innerHTML = `<style>${styles}</style>${templateHtml}`;
    this.attachShadow({ mode: "open" }).append(template.content.cloneNode(true));
    this.searchInput = this.shadowRoot.getElementById("searchInput");
    this.applyButton = this.shadowRoot.getElementById("applyButton");
    this.clearButton = this.shadowRoot.getElementById("clearButton");
    this.dropdown = this.shadowRoot.getElementById("dropdown");
    this.filterText = this.shadowRoot.getElementById("filterText");
    this.filter = this.shadowRoot.getElementById("filter");
    this.scrollArea = this.shadowRoot.getElementById("scrollArea");
    this.contentArea = this.shadowRoot.getElementById("contentArea");
    this.loadingIndicator = this.shadowRoot.getElementById("loadingIndicator");
    this.searchInput.placeholder = this.config.searchPlaceholder;
    this.applyButton.innerText = this.config.applyButtonText;
  }
  async populateOptions(optionsToRender) {
    let rows = [];
    const selectedRows = [];
    const groupedRows = /* @__PURE__ */ new Map();
    const isSearching = this.searchInput.value.trim();
    for (const opt of optionsToRender) {
      const { item, matches } = "item" in opt ? { item: opt.item, matches: opt.matches } : { item: opt, matches: void 0 };
      const valueStr = String(item.value);
      const isSelected = this.pendingValues.has(valueStr);
      const isDisabled = item.disabled;
      const text = isSearching ? this.formatTextWithHighlight(item.text, matches) : item.text;
      const classes = isSelected ? isDisabled ? "selected disabled" : "selected" : isDisabled ? "disabled" : "";
      const li = `<li part="dropdown-item${classes ? ` ${classes}` : classes}" class="${classes}" data-value="${valueStr}" ${isDisabled ? 'aria-disabled="true"' : ""}>${text}</li>`;
      if (isSelected) {
        selectedRows.push(li);
      } else {
        const groupKey = item.group || null;
        if (!groupedRows.has(groupKey)) {
          groupedRows.set(groupKey, []);
        }
        groupedRows.get(groupKey).push(li);
      }
    }
    if (selectedRows.length > 0) {
      rows.push(`<li class="optgroup">${this.config.groupSelectedLabel} (${selectedRows.length})</li>`);
      rows = rows.concat(selectedRows);
      rows.push(`<li class="optgroup"></li>`);
    }
    if (isSearching) {
      groupedRows.forEach((items) => {
        rows = rows.concat(items);
      });
    } else {
      groupedRows.forEach((items, group) => {
        if (group) rows.push(`<li class="optgroup">${group}</li>`);
        rows = rows.concat(items);
      });
    }
    this.clusterize.clear();
    this.clusterize.update(rows);
  }
  formatTextWithHighlight(text, matches) {
    if (!matches || matches.length === 0) return text;
    const match = matches.find((m) => m.key === "text");
    if (!match) return text;
    const mergedIndices = mergeOverlapping(match.indices);
    let highlighted = "";
    let lastIndex = 0;
    mergedIndices.forEach(([start, end]) => {
      highlighted += text.slice(lastIndex, start);
      highlighted += `<mark part="highlight">${text.slice(start, end + 1)}</mark>`;
      lastIndex = end + 1;
    });
    highlighted += text.slice(lastIndex);
    return highlighted;
  }
  updateFilter() {
    const total = this.options.length;
    const count = this.selectedValues.size;
    const selectedTexts = this.options.filter((opt) => this.selectedValues.has(String(opt.value))).map((opt) => opt.text);
    this.filterText.innerHTML = count ? `<span part='counter-filter' class='counter-filter'>${count}</span> <strong>${this.config.label}:</strong> ${count === total ? this.config.allText : selectedTexts.join(", ")}` : `<strong>${this.config.label}:</strong> ${this.config.emptyText}`;
    this.clearButton.style.opacity = count ? "1" : "0.5";
    this.clearButton.style.pointerEvents = count ? "auto" : "none";
    this.filter.setAttribute("title", count ? selectedTexts.join(", ") : "");
  }
  // === EVENT HANDLERS ===
  attachEvents() {
    this.filter.addEventListener("click", () => this.toggleDropdown());
    this.clearButton.addEventListener("click", (e) => this.clear(e));
    this.applyButton.addEventListener("click", () => this.applySelection());
    this.searchInput.addEventListener("input", debounce(this.handleSearch.bind(this), this.config.searchDebounceDelay));
    this.contentArea.addEventListener("click", this.handleClickitem.bind(this));
    document.addEventListener("keydown", (e) => this.handleKeyboardNavigation(e));
    document.addEventListener("click", (e) => this.handleOutsideClick(e));
  }
  toggleSelectOption(li, value) {
    li.classList.remove("focused");
    li.classList.toggle("selected");
    if (li.classList.contains("selected")) {
      this.pendingValues.add(value);
      li.setAttribute("part", "dropdown-item selected");
    } else {
      this.pendingValues.delete(value);
      li.setAttribute("part", "dropdown-item");
    }
  }
  handleOutsideClick(event) {
    if (!this.contains(event.target)) {
      this.closeDropdown();
    }
  }
  handleKeyboardNavigation(event) {
    const isOpen = this.dropdown.style.display === "block";
    if (!isOpen) return;
    const lis = Array.from(this.contentArea.querySelectorAll("li[data-value]"));
    if (!lis.length) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      let attempts = 0;
      do {
        this.cursorIndex = (this.cursorIndex + 1) % lis.length;
        attempts++;
      } while (lis[this.cursorIndex].classList.contains("disabled") && attempts < lis.length);
      this.updateCursor(lis);
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      let attempts = 0;
      do {
        this.cursorIndex = (this.cursorIndex - 1 + lis.length) % lis.length;
        attempts++;
      } while (lis[this.cursorIndex].classList.contains("disabled") && attempts < lis.length);
      this.updateCursor(lis);
    }
    const activeEl = this.shadowRoot.activeElement || document.activeElement;
    if (activeEl && activeEl.tagName === "BUTTON") {
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      const li = lis[this.cursorIndex];
      if (li && !li.classList.contains("disabled")) {
        const value = li.dataset.value;
        this.toggleSelectOption(li, value);
      }
    }
  }
  updateCursor(lis) {
    lis.forEach((li) => {
      li.classList.remove("focused");
      li.setAttribute("part", li.classList.contains("selected") ? "dropdown-item selected" : "dropdown-item");
    });
    if (this.cursorIndex >= 0 && lis[this.cursorIndex]) {
      const targetLi = lis[this.cursorIndex];
      targetLi.classList.add("focused");
      let partValue = "dropdown-item";
      if (targetLi.classList.contains("selected")) {
        partValue += " selected";
      }
      partValue += " focused";
      targetLi.setAttribute("part", partValue);
      targetLi.scrollIntoView({ block: "nearest" });
    }
  }
  handleSearch() {
    this.searchToken++;
    const searchTerm = this.searchInput.value.trim();
    if (!searchTerm) {
      this.populateOptions(this.options);
      this.loadingIndicator.style.visibility = "hidden";
      return;
    }
    this.loadingIndicator.style.visibility = "visible";
    this.searchWorker.postMessage({
      type: "search",
      payload: {
        term: searchTerm,
        token: this.searchToken
      }
    });
  }
  handleClickitem(event) {
    const target = event.target;
    if (target.tagName.toLowerCase() === "li" && !target.classList.contains("optgroup")) {
      const li = target;
      const value = li.dataset.value;
      this.toggleSelectOption(li, value);
    }
  }
  initFuseWorker() {
    const workerCode = `
            importScripts('https://unpkg.com/fuse.js/dist/fuse.js');
            let fuse;

            self.onmessage = function(e) {
                const { type, payload } = e.data;

                if (type === 'init') {
                    fuse = new Fuse(payload.collection, payload.options);
                    self.postMessage({ type: 'ready' });
                }

                if (type === 'update') {
                    fuse.setCollection(payload.collection);
                    self.postMessage({ type: 'updated' });
                }

                if (type === 'search') {
                    const results = fuse.search(payload.term);
                    self.postMessage({ type: 'results', results, token: payload.token });
                }
            }
        `;
    const blob = new Blob([workerCode], { type: "application/javascript" });
    this.searchWorker = new Worker(URL.createObjectURL(blob));
    this.searchWorker.postMessage({
      type: "init",
      payload: {
        collection: this.options,
        options: this.config.fuseOptions
      }
    });
    this.searchWorker.onmessage = (e) => {
      if (e.data.type === "results") {
        if (e.data.token !== this.searchToken)
          return;
        this.populateOptions(e.data.results);
        this.loadingIndicator.style.visibility = "hidden";
      }
    };
  }
  initClusterize() {
    this.clusterize = new Clusterize({
      rows: [],
      scrollElem: this.scrollArea,
      contentElem: this.contentArea,
      ...this.config.clusterizeOptions
    });
  }
  // === STATE + SELECTION ===
  syncSelectElement() {
    const selectElement = this.querySelector("select");
    selectElement.innerHTML = "";
    this.options.filter((opt) => this.selectedValues.has(String(opt.value))).forEach((opt) => {
      const option = document.createElement("option");
      option.value = String(opt.value);
      option.text = opt.text;
      option.selected = true;
      selectElement.appendChild(option);
    });
  }
  applySelection() {
    this.selectedValues = new Set(this.pendingValues);
    this.syncSelectElement();
    this.updateFilter();
    this.closeDropdown();
    this.dispatchEvent(new Event("change"));
  }
  clear(event) {
    event == null ? void 0 : event.stopPropagation();
    this.selectedValues.clear();
    this.pendingValues.clear();
    this.populateOptions(this.options);
    this.syncSelectElement();
    this.updateFilter();
    this.dispatchEvent(new Event("change"));
  }
  toggleDropdown() {
    const isOpen = this.dropdown.style.display === "block";
    if (isOpen) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }
  closeDropdown() {
    this.dropdown.style.display = "none";
  }
  openDropdown() {
    this.cursorIndex = -1;
    this.searchInput.value = "";
    requestAnimationFrame(() => {
      this.searchInput.focus();
    });
    this.dropdown.style.display = "block";
    this.pendingValues = new Set(this.selectedValues);
    this.populateOptions(this.options);
  }
  // === PUBLIC API ===
  addOption(option) {
    this.addOptions([option]);
  }
  addOptions(options) {
    options.forEach((option) => {
      const exists = this.optionMap.has(option.value);
      if (!exists) {
        this.options.push({
          value: option.value,
          text: option.text,
          group: option.group ?? null,
          disabled: option.disabled ?? false
        });
      }
    });
    this.searchWorker.postMessage({
      type: "update",
      payload: { collection: this.options }
    });
    this.populateOptions(this.options);
    this.syncSelectElement();
  }
  selectOptions(values) {
    values.forEach((v) => {
      const opt = this.optionMap.get(v);
      if (opt && !opt.disabled && !this.selectedValues.has(String(v))) {
        this.selectedValues.add(String(v));
      }
    });
    this.pendingValues = new Set(this.selectedValues);
    this.populateOptions(this.options);
    this.syncSelectElement();
    this.updateFilter();
  }
  removeOptions(values) {
    this.options = this.options.filter((opt) => !values.includes(opt.value));
    values.forEach((v) => {
      this.selectedValues.delete(String(v));
      this.pendingValues.delete(String(v));
    });
    this.searchWorker.postMessage({
      type: "update",
      payload: { collection: this.options }
    });
    this.populateOptions(this.options);
    this.syncSelectElement();
    this.updateFilter();
  }
  removeAllOptions() {
    this.options = [];
    this.selectedValues.clear();
    this.pendingValues.clear();
    this.searchWorker.postMessage({
      type: "update",
      payload: { collection: this.options }
    });
    this.populateOptions(this.options);
    this.syncSelectElement();
    this.updateFilter();
  }
  clearSelection() {
    this.clear();
  }
  disableOptions(values) {
    values.forEach((v) => {
      const opt = this.optionMap.get(v);
      if (opt) {
        opt.disabled = true;
      }
    });
    this.populateOptions(this.options);
  }
  enableOptions(values) {
    values.forEach((v) => {
      const opt = this.optionMap.get(v);
      if (opt) {
        opt.disabled = false;
      }
    });
    this.populateOptions(this.options);
  }
  getSelected() {
    return this.options.filter((opt) => this.selectedValues.has(String(opt.value)));
  }
  getAllOptions() {
    return [...this.options];
  }
}
class PlantaeFilter {
  constructor(select, attributes = {}) {
    __publicField(this, "component");
    __publicField(this, "isReady", false);
    __publicField(this, "queue", []);
    var _a;
    const wrapper = document.createElement("plantae-filter");
    const datasetAttributes = this.getDatasetAttributes(select, "data-pl-");
    const mergedAttributes = { ...datasetAttributes, ...attributes };
    Object.entries(mergedAttributes).forEach(([key, value]) => {
      wrapper.setAttribute(camelToKebab(key), typeof value === "string" ? value : JSON.stringify(value));
    });
    (_a = select.parentNode) == null ? void 0 : _a.insertBefore(wrapper, select);
    wrapper.appendChild(select);
    this.component = wrapper;
    wrapper.addEventListener("plantae-filter-ready", () => {
      this.isReady = true;
      this.flushQueue();
    });
  }
  flushQueue() {
    this.queue.forEach((fn) => fn());
    this.queue = [];
  }
  runOrQueue(fn) {
    if (this.isReady) {
      fn();
    } else {
      this.queue.push(fn);
    }
  }
  getDatasetAttributes(select, prefix = "") {
    const attrs = {};
    Array.from(select.attributes).forEach((attr) => {
      if (attr.name.startsWith(prefix)) {
        const key = attr.name.replace(prefix, "");
        attrs[key] = attr.value;
      }
    });
    return attrs;
  }
  // Expondo métodos do componente
  addOption(option) {
    this.runOrQueue(() => this.component.addOption(option));
  }
  addOptions(options) {
    this.runOrQueue(() => this.component.addOptions(options));
  }
  selectOptions(values) {
    this.runOrQueue(() => this.component.selectOptions(values));
  }
  removeOptions(values) {
    this.runOrQueue(() => this.component.removeOptions(values));
  }
  removeAllOptions() {
    this.runOrQueue(() => this.component.removeAllOptions());
  }
  clearSelection() {
    this.runOrQueue(() => this.component.clearSelection());
  }
  disableOptions(values) {
    this.runOrQueue(() => this.component.disableOptions(values));
  }
  enableOptions(values) {
    this.runOrQueue(() => this.component.enableOptions(values));
  }
  getSelected() {
    return this.component.getSelected();
  }
  getAllOptions() {
    return this.component.getAllOptions();
  }
}
if (!customElements.get("plantae-filter")) {
  customElements.define("plantae-filter", PlantaeFilterElement);
}
export {
  PlantaeFilter as default
};

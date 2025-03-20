var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
const templateHtml = '<div class="select-dropdown-wrapper">\n    <div id="filter" class="filter" part="filter">\n        <div class="filter-text-wrapper" part="filter-text-wrapper">\n            <span id="filterText" part="filter-text"></span>\n        </div>\n        <button class="btn-close" id="clearButton" part="clear-button" title="Limpar itens selecionados">✕</button>\n    </div>\n    <div class="select-dropdown" id="dropdown" part="dropdown">\n        <div class="dropdown-header" part="dropdown-header">\n            <input type="text" id="searchInput" part="search-input" placeholder="">\n        </div>\n        <div id="scrollArea" class="scroll-area" part="scroll-area">\n            <ul id="contentArea" class="content-area" part="content-area"></ul>\n        </div>\n        <div class="dropdown-footer" part="dropdown-footer">\n            <button id="applyButton" part="apply-button"></button>\n        </div>\n    </div>\n</div>';
const styles = ":host{color-scheme:light}.select-dropdown-wrapper{display:inline-block;position:relative}.filter{background-color:#fff;color:#333;padding:5px 10px;border:1px solid #999;border-radius:4px;cursor:pointer;display:inline-flex;align-items:center;max-width:300px;white-space:nowrap;text-overflow:ellipsis;position:relative;overflow:visible;font-size:.8em}.filter-text-wrapper{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1}.btn-close{background:none;border:none;cursor:pointer;font-size:14px;margin-left:8px;color:inherit}.form-control{display:block;width:100%;padding:.4rem .75rem;font-size:.9rem;line-height:1.4;color:#333;background-color:#fff;border:1px solid #ccc;border-radius:4px}.form-control:focus{outline:none;border-color:#777;box-shadow:0 0 0 2px #0000001a}.mb-2{margin-bottom:.5rem}.select-dropdown{display:none;position:absolute;top:100%;left:0;background:#fff;border:1px solid #ccc;box-shadow:0 2px 4px #0000001a;z-index:10;width:100%;min-width:200px;border-radius:4px;font-size:.85em}.scroll-area{max-height:200px;overflow-y:auto}.content-area{padding:0;margin:0;list-style:none}.select-dropdown ul{list-style:none;padding:0;margin:0}.select-dropdown li{padding:5px 10px;cursor:pointer;transition:background .2s}.select-dropdown li.selected{background:#333;color:#fff}.select-dropdown li:not(.optgroup):hover{background:#555;color:#fff}.select-dropdown li.optgroup{font-weight:700;font-size:.85rem;color:#666;background-color:#f5f5f5;padding:8px 12px;cursor:default}ul.clusterize-no-data{padding:10px;font-size:.85rem;color:#999;font-style:italic}.dropdown-header{display:flex;padding:8px}.dropdown-header input{width:100%;padding:4px 8px}.dropdown-footer{padding:8px;text-align:right;border-top:1px solid #ccc}.btn{display:inline-block;background:#333;color:#fff;padding:.3rem .6rem;font-size:.75rem;border:none;border-radius:4px;cursor:pointer}.btn:hover{background:#555}.btn:focus{outline:none;box-shadow:0 0 0 2px #0003}.btn:disabled{opacity:.6;cursor:not-allowed}.counter-filter{background:#d33;color:#fff;font-size:.7rem;font-weight:700;border-radius:999px;padding:2px 6px;position:absolute;top:0;left:0;transform:translate(-40%,-50%);z-index:20;box-shadow:0 0 2px #0000004d}mark{background:#ff03;color:inherit;border-radius:3px;pointer-events:none}";
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
function isArray(value) {
  return !Array.isArray ? getTag(value) === "[object Array]" : Array.isArray(value);
}
function baseToString(value) {
  if (typeof value == "string") {
    return value;
  }
  let result = value + "";
  return result == "0" && 1 / value == -Infinity ? "-0" : result;
}
function toString(value) {
  return value == null ? "" : baseToString(value);
}
function isString(value) {
  return typeof value === "string";
}
function isNumber(value) {
  return typeof value === "number";
}
function isBoolean(value) {
  return value === true || value === false || isObjectLike(value) && getTag(value) == "[object Boolean]";
}
function isObject(value) {
  return typeof value === "object";
}
function isObjectLike(value) {
  return isObject(value) && value !== null;
}
function isDefined(value) {
  return value !== void 0 && value !== null;
}
function isBlank(value) {
  return !value.trim().length;
}
function getTag(value) {
  return value == null ? value === void 0 ? "[object Undefined]" : "[object Null]" : Object.prototype.toString.call(value);
}
const INCORRECT_INDEX_TYPE = "Incorrect 'index' type";
const LOGICAL_SEARCH_INVALID_QUERY_FOR_KEY = (key) => `Invalid value for key ${key}`;
const PATTERN_LENGTH_TOO_LARGE = (max) => `Pattern length exceeds max of ${max}.`;
const MISSING_KEY_PROPERTY = (name) => `Missing ${name} property in key`;
const INVALID_KEY_WEIGHT_VALUE = (key) => `Property 'weight' in key '${key}' must be a positive integer`;
const hasOwn = Object.prototype.hasOwnProperty;
class KeyStore {
  constructor(keys) {
    this._keys = [];
    this._keyMap = {};
    let totalWeight = 0;
    keys.forEach((key) => {
      let obj = createKey(key);
      this._keys.push(obj);
      this._keyMap[obj.id] = obj;
      totalWeight += obj.weight;
    });
    this._keys.forEach((key) => {
      key.weight /= totalWeight;
    });
  }
  get(keyId) {
    return this._keyMap[keyId];
  }
  keys() {
    return this._keys;
  }
  toJSON() {
    return JSON.stringify(this._keys);
  }
}
function createKey(key) {
  let path = null;
  let id = null;
  let src = null;
  let weight = 1;
  let getFn = null;
  if (isString(key) || isArray(key)) {
    src = key;
    path = createKeyPath(key);
    id = createKeyId(key);
  } else {
    if (!hasOwn.call(key, "name")) {
      throw new Error(MISSING_KEY_PROPERTY("name"));
    }
    const name = key.name;
    src = name;
    if (hasOwn.call(key, "weight")) {
      weight = key.weight;
      if (weight <= 0) {
        throw new Error(INVALID_KEY_WEIGHT_VALUE(name));
      }
    }
    path = createKeyPath(name);
    id = createKeyId(name);
    getFn = key.getFn;
  }
  return { path, id, weight, src, getFn };
}
function createKeyPath(key) {
  return isArray(key) ? key : key.split(".");
}
function createKeyId(key) {
  return isArray(key) ? key.join(".") : key;
}
function get(obj, path) {
  let list = [];
  let arr = false;
  const deepGet = (obj2, path2, index) => {
    if (!isDefined(obj2)) {
      return;
    }
    if (!path2[index]) {
      list.push(obj2);
    } else {
      let key = path2[index];
      const value = obj2[key];
      if (!isDefined(value)) {
        return;
      }
      if (index === path2.length - 1 && (isString(value) || isNumber(value) || isBoolean(value))) {
        list.push(toString(value));
      } else if (isArray(value)) {
        arr = true;
        for (let i = 0, len = value.length; i < len; i += 1) {
          deepGet(value[i], path2, index + 1);
        }
      } else if (path2.length) {
        deepGet(value, path2, index + 1);
      }
    }
  };
  deepGet(obj, isString(path) ? path.split(".") : path, 0);
  return arr ? list : list[0];
}
const MatchOptions = {
  // Whether the matches should be included in the result set. When `true`, each record in the result
  // set will include the indices of the matched characters.
  // These can consequently be used for highlighting purposes.
  includeMatches: false,
  // When `true`, the matching function will continue to the end of a search pattern even if
  // a perfect match has already been located in the string.
  findAllMatches: false,
  // Minimum number of characters that must be matched before a result is considered a match
  minMatchCharLength: 1
};
const BasicOptions = {
  // When `true`, the algorithm continues searching to the end of the input even if a perfect
  // match is found before the end of the same input.
  isCaseSensitive: false,
  // When `true`, the algorithm will ignore diacritics (accents) in comparisons
  ignoreDiacritics: false,
  // When true, the matching function will continue to the end of a search pattern even if
  includeScore: false,
  // List of properties that will be searched. This also supports nested properties.
  keys: [],
  // Whether to sort the result list, by score
  shouldSort: true,
  // Default sort function: sort by ascending score, ascending index
  sortFn: (a, b) => a.score === b.score ? a.idx < b.idx ? -1 : 1 : a.score < b.score ? -1 : 1
};
const FuzzyOptions = {
  // Approximately where in the text is the pattern expected to be found?
  location: 0,
  // At what point does the match algorithm give up. A threshold of '0.0' requires a perfect match
  // (of both letters and location), a threshold of '1.0' would match anything.
  threshold: 0.6,
  // Determines how close the match must be to the fuzzy location (specified above).
  // An exact letter match which is 'distance' characters away from the fuzzy location
  // would score as a complete mismatch. A distance of '0' requires the match be at
  // the exact location specified, a threshold of '1000' would require a perfect match
  // to be within 800 characters of the fuzzy location to be found using a 0.8 threshold.
  distance: 100
};
const AdvancedOptions = {
  // When `true`, it enables the use of unix-like search commands
  useExtendedSearch: false,
  // The get function to use when fetching an object's properties.
  // The default will search nested paths *ie foo.bar.baz*
  getFn: get,
  // When `true`, search will ignore `location` and `distance`, so it won't matter
  // where in the string the pattern appears.
  // More info: https://fusejs.io/concepts/scoring-theory.html#fuzziness-score
  ignoreLocation: false,
  // When `true`, the calculation for the relevance score (used for sorting) will
  // ignore the field-length norm.
  // More info: https://fusejs.io/concepts/scoring-theory.html#field-length-norm
  ignoreFieldNorm: false,
  // The weight to determine how much field length norm effects scoring.
  fieldNormWeight: 1
};
var Config = {
  ...BasicOptions,
  ...MatchOptions,
  ...FuzzyOptions,
  ...AdvancedOptions
};
const SPACE = /[^ ]+/g;
function norm(weight = 1, mantissa = 3) {
  const cache = /* @__PURE__ */ new Map();
  const m = Math.pow(10, mantissa);
  return {
    get(value) {
      const numTokens = value.match(SPACE).length;
      if (cache.has(numTokens)) {
        return cache.get(numTokens);
      }
      const norm2 = 1 / Math.pow(numTokens, 0.5 * weight);
      const n = parseFloat(Math.round(norm2 * m) / m);
      cache.set(numTokens, n);
      return n;
    },
    clear() {
      cache.clear();
    }
  };
}
class FuseIndex {
  constructor({
    getFn = Config.getFn,
    fieldNormWeight = Config.fieldNormWeight
  } = {}) {
    this.norm = norm(fieldNormWeight, 3);
    this.getFn = getFn;
    this.isCreated = false;
    this.setIndexRecords();
  }
  setSources(docs = []) {
    this.docs = docs;
  }
  setIndexRecords(records = []) {
    this.records = records;
  }
  setKeys(keys = []) {
    this.keys = keys;
    this._keysMap = {};
    keys.forEach((key, idx) => {
      this._keysMap[key.id] = idx;
    });
  }
  create() {
    if (this.isCreated || !this.docs.length) {
      return;
    }
    this.isCreated = true;
    if (isString(this.docs[0])) {
      this.docs.forEach((doc, docIndex) => {
        this._addString(doc, docIndex);
      });
    } else {
      this.docs.forEach((doc, docIndex) => {
        this._addObject(doc, docIndex);
      });
    }
    this.norm.clear();
  }
  // Adds a doc to the end of the index
  add(doc) {
    const idx = this.size();
    if (isString(doc)) {
      this._addString(doc, idx);
    } else {
      this._addObject(doc, idx);
    }
  }
  // Removes the doc at the specified index of the index
  removeAt(idx) {
    this.records.splice(idx, 1);
    for (let i = idx, len = this.size(); i < len; i += 1) {
      this.records[i].i -= 1;
    }
  }
  getValueForItemAtKeyId(item, keyId) {
    return item[this._keysMap[keyId]];
  }
  size() {
    return this.records.length;
  }
  _addString(doc, docIndex) {
    if (!isDefined(doc) || isBlank(doc)) {
      return;
    }
    let record = {
      v: doc,
      i: docIndex,
      n: this.norm.get(doc)
    };
    this.records.push(record);
  }
  _addObject(doc, docIndex) {
    let record = { i: docIndex, $: {} };
    this.keys.forEach((key, keyIndex) => {
      let value = key.getFn ? key.getFn(doc) : this.getFn(doc, key.path);
      if (!isDefined(value)) {
        return;
      }
      if (isArray(value)) {
        let subRecords = [];
        const stack = [{ nestedArrIndex: -1, value }];
        while (stack.length) {
          const { nestedArrIndex, value: value2 } = stack.pop();
          if (!isDefined(value2)) {
            continue;
          }
          if (isString(value2) && !isBlank(value2)) {
            let subRecord = {
              v: value2,
              i: nestedArrIndex,
              n: this.norm.get(value2)
            };
            subRecords.push(subRecord);
          } else if (isArray(value2)) {
            value2.forEach((item, k) => {
              stack.push({
                nestedArrIndex: k,
                value: item
              });
            });
          } else ;
        }
        record.$[keyIndex] = subRecords;
      } else if (isString(value) && !isBlank(value)) {
        let subRecord = {
          v: value,
          n: this.norm.get(value)
        };
        record.$[keyIndex] = subRecord;
      }
    });
    this.records.push(record);
  }
  toJSON() {
    return {
      keys: this.keys,
      records: this.records
    };
  }
}
function createIndex(keys, docs, { getFn = Config.getFn, fieldNormWeight = Config.fieldNormWeight } = {}) {
  const myIndex = new FuseIndex({ getFn, fieldNormWeight });
  myIndex.setKeys(keys.map(createKey));
  myIndex.setSources(docs);
  myIndex.create();
  return myIndex;
}
function parseIndex(data, { getFn = Config.getFn, fieldNormWeight = Config.fieldNormWeight } = {}) {
  const { keys, records } = data;
  const myIndex = new FuseIndex({ getFn, fieldNormWeight });
  myIndex.setKeys(keys);
  myIndex.setIndexRecords(records);
  return myIndex;
}
function computeScore$1(pattern, {
  errors = 0,
  currentLocation = 0,
  expectedLocation = 0,
  distance = Config.distance,
  ignoreLocation = Config.ignoreLocation
} = {}) {
  const accuracy = errors / pattern.length;
  if (ignoreLocation) {
    return accuracy;
  }
  const proximity = Math.abs(expectedLocation - currentLocation);
  if (!distance) {
    return proximity ? 1 : accuracy;
  }
  return accuracy + proximity / distance;
}
function convertMaskToIndices(matchmask = [], minMatchCharLength = Config.minMatchCharLength) {
  let indices = [];
  let start = -1;
  let end = -1;
  let i = 0;
  for (let len = matchmask.length; i < len; i += 1) {
    let match = matchmask[i];
    if (match && start === -1) {
      start = i;
    } else if (!match && start !== -1) {
      end = i - 1;
      if (end - start + 1 >= minMatchCharLength) {
        indices.push([start, end]);
      }
      start = -1;
    }
  }
  if (matchmask[i - 1] && i - start >= minMatchCharLength) {
    indices.push([start, i - 1]);
  }
  return indices;
}
const MAX_BITS = 32;
function search(text, pattern, patternAlphabet, {
  location = Config.location,
  distance = Config.distance,
  threshold = Config.threshold,
  findAllMatches = Config.findAllMatches,
  minMatchCharLength = Config.minMatchCharLength,
  includeMatches = Config.includeMatches,
  ignoreLocation = Config.ignoreLocation
} = {}) {
  if (pattern.length > MAX_BITS) {
    throw new Error(PATTERN_LENGTH_TOO_LARGE(MAX_BITS));
  }
  const patternLen = pattern.length;
  const textLen = text.length;
  const expectedLocation = Math.max(0, Math.min(location, textLen));
  let currentThreshold = threshold;
  let bestLocation = expectedLocation;
  const computeMatches = minMatchCharLength > 1 || includeMatches;
  const matchMask = computeMatches ? Array(textLen) : [];
  let index;
  while ((index = text.indexOf(pattern, bestLocation)) > -1) {
    let score = computeScore$1(pattern, {
      currentLocation: index,
      expectedLocation,
      distance,
      ignoreLocation
    });
    currentThreshold = Math.min(score, currentThreshold);
    bestLocation = index + patternLen;
    if (computeMatches) {
      let i = 0;
      while (i < patternLen) {
        matchMask[index + i] = 1;
        i += 1;
      }
    }
  }
  bestLocation = -1;
  let lastBitArr = [];
  let finalScore = 1;
  let binMax = patternLen + textLen;
  const mask = 1 << patternLen - 1;
  for (let i = 0; i < patternLen; i += 1) {
    let binMin = 0;
    let binMid = binMax;
    while (binMin < binMid) {
      const score2 = computeScore$1(pattern, {
        errors: i,
        currentLocation: expectedLocation + binMid,
        expectedLocation,
        distance,
        ignoreLocation
      });
      if (score2 <= currentThreshold) {
        binMin = binMid;
      } else {
        binMax = binMid;
      }
      binMid = Math.floor((binMax - binMin) / 2 + binMin);
    }
    binMax = binMid;
    let start = Math.max(1, expectedLocation - binMid + 1);
    let finish = findAllMatches ? textLen : Math.min(expectedLocation + binMid, textLen) + patternLen;
    let bitArr = Array(finish + 2);
    bitArr[finish + 1] = (1 << i) - 1;
    for (let j = finish; j >= start; j -= 1) {
      let currentLocation = j - 1;
      let charMatch = patternAlphabet[text.charAt(currentLocation)];
      if (computeMatches) {
        matchMask[currentLocation] = +!!charMatch;
      }
      bitArr[j] = (bitArr[j + 1] << 1 | 1) & charMatch;
      if (i) {
        bitArr[j] |= (lastBitArr[j + 1] | lastBitArr[j]) << 1 | 1 | lastBitArr[j + 1];
      }
      if (bitArr[j] & mask) {
        finalScore = computeScore$1(pattern, {
          errors: i,
          currentLocation,
          expectedLocation,
          distance,
          ignoreLocation
        });
        if (finalScore <= currentThreshold) {
          currentThreshold = finalScore;
          bestLocation = currentLocation;
          if (bestLocation <= expectedLocation) {
            break;
          }
          start = Math.max(1, 2 * expectedLocation - bestLocation);
        }
      }
    }
    const score = computeScore$1(pattern, {
      errors: i + 1,
      currentLocation: expectedLocation,
      expectedLocation,
      distance,
      ignoreLocation
    });
    if (score > currentThreshold) {
      break;
    }
    lastBitArr = bitArr;
  }
  const result = {
    isMatch: bestLocation >= 0,
    // Count exact matches (those with a score of 0) to be "almost" exact
    score: Math.max(1e-3, finalScore)
  };
  if (computeMatches) {
    const indices = convertMaskToIndices(matchMask, minMatchCharLength);
    if (!indices.length) {
      result.isMatch = false;
    } else if (includeMatches) {
      result.indices = indices;
    }
  }
  return result;
}
function createPatternAlphabet(pattern) {
  let mask = {};
  for (let i = 0, len = pattern.length; i < len; i += 1) {
    const char = pattern.charAt(i);
    mask[char] = (mask[char] || 0) | 1 << len - i - 1;
  }
  return mask;
}
const stripDiacritics = String.prototype.normalize ? (str) => str.normalize("NFD").replace(/[\u0300-\u036F\u0483-\u0489\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u07FD\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u08D3-\u08E1\u08E3-\u0903\u093A-\u093C\u093E-\u094F\u0951-\u0957\u0962\u0963\u0981-\u0983\u09BC\u09BE-\u09C4\u09C7\u09C8\u09CB-\u09CD\u09D7\u09E2\u09E3\u09FE\u0A01-\u0A03\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81-\u0A83\u0ABC\u0ABE-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AE2\u0AE3\u0AFA-\u0AFF\u0B01-\u0B03\u0B3C\u0B3E-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B62\u0B63\u0B82\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD7\u0C00-\u0C04\u0C3E-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C81-\u0C83\u0CBC\u0CBE-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0D00-\u0D03\u0D3B\u0D3C\u0D3E-\u0D44\u0D46-\u0D48\u0D4A-\u0D4D\u0D57\u0D62\u0D63\u0D82\u0D83\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2\u0DF3\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EB9\u0EBB\u0EBC\u0EC8-\u0ECD\u0F18\u0F19\u0F35\u0F37\u0F39\u0F3E\u0F3F\u0F71-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102B-\u103E\u1056-\u1059\u105E-\u1060\u1062-\u1064\u1067-\u106D\u1071-\u1074\u1082-\u108D\u108F\u109A-\u109D\u135D-\u135F\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4-\u17D3\u17DD\u180B-\u180D\u1885\u1886\u18A9\u1920-\u192B\u1930-\u193B\u1A17-\u1A1B\u1A55-\u1A5E\u1A60-\u1A7C\u1A7F\u1AB0-\u1ABE\u1B00-\u1B04\u1B34-\u1B44\u1B6B-\u1B73\u1B80-\u1B82\u1BA1-\u1BAD\u1BE6-\u1BF3\u1C24-\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE8\u1CED\u1CF2-\u1CF4\u1CF7-\u1CF9\u1DC0-\u1DF9\u1DFB-\u1DFF\u20D0-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\uA66F-\uA672\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA823-\uA827\uA880\uA881\uA8B4-\uA8C5\uA8E0-\uA8F1\uA8FF\uA926-\uA92D\uA947-\uA953\uA980-\uA983\uA9B3-\uA9C0\uA9E5\uAA29-\uAA36\uAA43\uAA4C\uAA4D\uAA7B-\uAA7D\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEB-\uAAEF\uAAF5\uAAF6\uABE3-\uABEA\uABEC\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F]/g, "") : (str) => str;
class BitapSearch {
  constructor(pattern, {
    location = Config.location,
    threshold = Config.threshold,
    distance = Config.distance,
    includeMatches = Config.includeMatches,
    findAllMatches = Config.findAllMatches,
    minMatchCharLength = Config.minMatchCharLength,
    isCaseSensitive = Config.isCaseSensitive,
    ignoreDiacritics = Config.ignoreDiacritics,
    ignoreLocation = Config.ignoreLocation
  } = {}) {
    this.options = {
      location,
      threshold,
      distance,
      includeMatches,
      findAllMatches,
      minMatchCharLength,
      isCaseSensitive,
      ignoreDiacritics,
      ignoreLocation
    };
    pattern = isCaseSensitive ? pattern : pattern.toLowerCase();
    pattern = ignoreDiacritics ? stripDiacritics(pattern) : pattern;
    this.pattern = pattern;
    this.chunks = [];
    if (!this.pattern.length) {
      return;
    }
    const addChunk = (pattern2, startIndex) => {
      this.chunks.push({
        pattern: pattern2,
        alphabet: createPatternAlphabet(pattern2),
        startIndex
      });
    };
    const len = this.pattern.length;
    if (len > MAX_BITS) {
      let i = 0;
      const remainder = len % MAX_BITS;
      const end = len - remainder;
      while (i < end) {
        addChunk(this.pattern.substr(i, MAX_BITS), i);
        i += MAX_BITS;
      }
      if (remainder) {
        const startIndex = len - MAX_BITS;
        addChunk(this.pattern.substr(startIndex), startIndex);
      }
    } else {
      addChunk(this.pattern, 0);
    }
  }
  searchIn(text) {
    const { isCaseSensitive, ignoreDiacritics, includeMatches } = this.options;
    text = isCaseSensitive ? text : text.toLowerCase();
    text = ignoreDiacritics ? stripDiacritics(text) : text;
    if (this.pattern === text) {
      let result2 = {
        isMatch: true,
        score: 0
      };
      if (includeMatches) {
        result2.indices = [[0, text.length - 1]];
      }
      return result2;
    }
    const {
      location,
      distance,
      threshold,
      findAllMatches,
      minMatchCharLength,
      ignoreLocation
    } = this.options;
    let allIndices = [];
    let totalScore = 0;
    let hasMatches = false;
    this.chunks.forEach(({ pattern, alphabet, startIndex }) => {
      const { isMatch, score, indices } = search(text, pattern, alphabet, {
        location: location + startIndex,
        distance,
        threshold,
        findAllMatches,
        minMatchCharLength,
        includeMatches,
        ignoreLocation
      });
      if (isMatch) {
        hasMatches = true;
      }
      totalScore += score;
      if (isMatch && indices) {
        allIndices = [...allIndices, ...indices];
      }
    });
    let result = {
      isMatch: hasMatches,
      score: hasMatches ? totalScore / this.chunks.length : 1
    };
    if (hasMatches && includeMatches) {
      result.indices = allIndices;
    }
    return result;
  }
}
class BaseMatch {
  constructor(pattern) {
    this.pattern = pattern;
  }
  static isMultiMatch(pattern) {
    return getMatch(pattern, this.multiRegex);
  }
  static isSingleMatch(pattern) {
    return getMatch(pattern, this.singleRegex);
  }
  search() {
  }
}
function getMatch(pattern, exp) {
  const matches = pattern.match(exp);
  return matches ? matches[1] : null;
}
class ExactMatch extends BaseMatch {
  constructor(pattern) {
    super(pattern);
  }
  static get type() {
    return "exact";
  }
  static get multiRegex() {
    return /^="(.*)"$/;
  }
  static get singleRegex() {
    return /^=(.*)$/;
  }
  search(text) {
    const isMatch = text === this.pattern;
    return {
      isMatch,
      score: isMatch ? 0 : 1,
      indices: [0, this.pattern.length - 1]
    };
  }
}
class InverseExactMatch extends BaseMatch {
  constructor(pattern) {
    super(pattern);
  }
  static get type() {
    return "inverse-exact";
  }
  static get multiRegex() {
    return /^!"(.*)"$/;
  }
  static get singleRegex() {
    return /^!(.*)$/;
  }
  search(text) {
    const index = text.indexOf(this.pattern);
    const isMatch = index === -1;
    return {
      isMatch,
      score: isMatch ? 0 : 1,
      indices: [0, text.length - 1]
    };
  }
}
class PrefixExactMatch extends BaseMatch {
  constructor(pattern) {
    super(pattern);
  }
  static get type() {
    return "prefix-exact";
  }
  static get multiRegex() {
    return /^\^"(.*)"$/;
  }
  static get singleRegex() {
    return /^\^(.*)$/;
  }
  search(text) {
    const isMatch = text.startsWith(this.pattern);
    return {
      isMatch,
      score: isMatch ? 0 : 1,
      indices: [0, this.pattern.length - 1]
    };
  }
}
class InversePrefixExactMatch extends BaseMatch {
  constructor(pattern) {
    super(pattern);
  }
  static get type() {
    return "inverse-prefix-exact";
  }
  static get multiRegex() {
    return /^!\^"(.*)"$/;
  }
  static get singleRegex() {
    return /^!\^(.*)$/;
  }
  search(text) {
    const isMatch = !text.startsWith(this.pattern);
    return {
      isMatch,
      score: isMatch ? 0 : 1,
      indices: [0, text.length - 1]
    };
  }
}
class SuffixExactMatch extends BaseMatch {
  constructor(pattern) {
    super(pattern);
  }
  static get type() {
    return "suffix-exact";
  }
  static get multiRegex() {
    return /^"(.*)"\$$/;
  }
  static get singleRegex() {
    return /^(.*)\$$/;
  }
  search(text) {
    const isMatch = text.endsWith(this.pattern);
    return {
      isMatch,
      score: isMatch ? 0 : 1,
      indices: [text.length - this.pattern.length, text.length - 1]
    };
  }
}
class InverseSuffixExactMatch extends BaseMatch {
  constructor(pattern) {
    super(pattern);
  }
  static get type() {
    return "inverse-suffix-exact";
  }
  static get multiRegex() {
    return /^!"(.*)"\$$/;
  }
  static get singleRegex() {
    return /^!(.*)\$$/;
  }
  search(text) {
    const isMatch = !text.endsWith(this.pattern);
    return {
      isMatch,
      score: isMatch ? 0 : 1,
      indices: [0, text.length - 1]
    };
  }
}
class FuzzyMatch extends BaseMatch {
  constructor(pattern, {
    location = Config.location,
    threshold = Config.threshold,
    distance = Config.distance,
    includeMatches = Config.includeMatches,
    findAllMatches = Config.findAllMatches,
    minMatchCharLength = Config.minMatchCharLength,
    isCaseSensitive = Config.isCaseSensitive,
    ignoreDiacritics = Config.ignoreDiacritics,
    ignoreLocation = Config.ignoreLocation
  } = {}) {
    super(pattern);
    this._bitapSearch = new BitapSearch(pattern, {
      location,
      threshold,
      distance,
      includeMatches,
      findAllMatches,
      minMatchCharLength,
      isCaseSensitive,
      ignoreDiacritics,
      ignoreLocation
    });
  }
  static get type() {
    return "fuzzy";
  }
  static get multiRegex() {
    return /^"(.*)"$/;
  }
  static get singleRegex() {
    return /^(.*)$/;
  }
  search(text) {
    return this._bitapSearch.searchIn(text);
  }
}
class IncludeMatch extends BaseMatch {
  constructor(pattern) {
    super(pattern);
  }
  static get type() {
    return "include";
  }
  static get multiRegex() {
    return /^'"(.*)"$/;
  }
  static get singleRegex() {
    return /^'(.*)$/;
  }
  search(text) {
    let location = 0;
    let index;
    const indices = [];
    const patternLen = this.pattern.length;
    while ((index = text.indexOf(this.pattern, location)) > -1) {
      location = index + patternLen;
      indices.push([index, location - 1]);
    }
    const isMatch = !!indices.length;
    return {
      isMatch,
      score: isMatch ? 0 : 1,
      indices
    };
  }
}
const searchers = [
  ExactMatch,
  IncludeMatch,
  PrefixExactMatch,
  InversePrefixExactMatch,
  InverseSuffixExactMatch,
  SuffixExactMatch,
  InverseExactMatch,
  FuzzyMatch
];
const searchersLen = searchers.length;
const SPACE_RE = / +(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/;
const OR_TOKEN = "|";
function parseQuery(pattern, options = {}) {
  return pattern.split(OR_TOKEN).map((item) => {
    let query = item.trim().split(SPACE_RE).filter((item2) => item2 && !!item2.trim());
    let results = [];
    for (let i = 0, len = query.length; i < len; i += 1) {
      const queryItem = query[i];
      let found = false;
      let idx = -1;
      while (!found && ++idx < searchersLen) {
        const searcher = searchers[idx];
        let token = searcher.isMultiMatch(queryItem);
        if (token) {
          results.push(new searcher(token, options));
          found = true;
        }
      }
      if (found) {
        continue;
      }
      idx = -1;
      while (++idx < searchersLen) {
        const searcher = searchers[idx];
        let token = searcher.isSingleMatch(queryItem);
        if (token) {
          results.push(new searcher(token, options));
          break;
        }
      }
    }
    return results;
  });
}
const MultiMatchSet = /* @__PURE__ */ new Set([FuzzyMatch.type, IncludeMatch.type]);
class ExtendedSearch {
  constructor(pattern, {
    isCaseSensitive = Config.isCaseSensitive,
    ignoreDiacritics = Config.ignoreDiacritics,
    includeMatches = Config.includeMatches,
    minMatchCharLength = Config.minMatchCharLength,
    ignoreLocation = Config.ignoreLocation,
    findAllMatches = Config.findAllMatches,
    location = Config.location,
    threshold = Config.threshold,
    distance = Config.distance
  } = {}) {
    this.query = null;
    this.options = {
      isCaseSensitive,
      ignoreDiacritics,
      includeMatches,
      minMatchCharLength,
      findAllMatches,
      ignoreLocation,
      location,
      threshold,
      distance
    };
    pattern = isCaseSensitive ? pattern : pattern.toLowerCase();
    pattern = ignoreDiacritics ? stripDiacritics(pattern) : pattern;
    this.pattern = pattern;
    this.query = parseQuery(this.pattern, this.options);
  }
  static condition(_, options) {
    return options.useExtendedSearch;
  }
  searchIn(text) {
    const query = this.query;
    if (!query) {
      return {
        isMatch: false,
        score: 1
      };
    }
    const { includeMatches, isCaseSensitive, ignoreDiacritics } = this.options;
    text = isCaseSensitive ? text : text.toLowerCase();
    text = ignoreDiacritics ? stripDiacritics(text) : text;
    let numMatches = 0;
    let allIndices = [];
    let totalScore = 0;
    for (let i = 0, qLen = query.length; i < qLen; i += 1) {
      const searchers2 = query[i];
      allIndices.length = 0;
      numMatches = 0;
      for (let j = 0, pLen = searchers2.length; j < pLen; j += 1) {
        const searcher = searchers2[j];
        const { isMatch, indices, score } = searcher.search(text);
        if (isMatch) {
          numMatches += 1;
          totalScore += score;
          if (includeMatches) {
            const type = searcher.constructor.type;
            if (MultiMatchSet.has(type)) {
              allIndices = [...allIndices, ...indices];
            } else {
              allIndices.push(indices);
            }
          }
        } else {
          totalScore = 0;
          numMatches = 0;
          allIndices.length = 0;
          break;
        }
      }
      if (numMatches) {
        let result = {
          isMatch: true,
          score: totalScore / numMatches
        };
        if (includeMatches) {
          result.indices = allIndices;
        }
        return result;
      }
    }
    return {
      isMatch: false,
      score: 1
    };
  }
}
const registeredSearchers = [];
function register(...args) {
  registeredSearchers.push(...args);
}
function createSearcher(pattern, options) {
  for (let i = 0, len = registeredSearchers.length; i < len; i += 1) {
    let searcherClass = registeredSearchers[i];
    if (searcherClass.condition(pattern, options)) {
      return new searcherClass(pattern, options);
    }
  }
  return new BitapSearch(pattern, options);
}
const LogicalOperator = {
  AND: "$and",
  OR: "$or"
};
const KeyType = {
  PATH: "$path",
  PATTERN: "$val"
};
const isExpression = (query) => !!(query[LogicalOperator.AND] || query[LogicalOperator.OR]);
const isPath = (query) => !!query[KeyType.PATH];
const isLeaf = (query) => !isArray(query) && isObject(query) && !isExpression(query);
const convertToExplicit = (query) => ({
  [LogicalOperator.AND]: Object.keys(query).map((key) => ({
    [key]: query[key]
  }))
});
function parse(query, options, { auto = true } = {}) {
  const next = (query2) => {
    let keys = Object.keys(query2);
    const isQueryPath = isPath(query2);
    if (!isQueryPath && keys.length > 1 && !isExpression(query2)) {
      return next(convertToExplicit(query2));
    }
    if (isLeaf(query2)) {
      const key = isQueryPath ? query2[KeyType.PATH] : keys[0];
      const pattern = isQueryPath ? query2[KeyType.PATTERN] : query2[key];
      if (!isString(pattern)) {
        throw new Error(LOGICAL_SEARCH_INVALID_QUERY_FOR_KEY(key));
      }
      const obj = {
        keyId: createKeyId(key),
        pattern
      };
      if (auto) {
        obj.searcher = createSearcher(pattern, options);
      }
      return obj;
    }
    let node = {
      children: [],
      operator: keys[0]
    };
    keys.forEach((key) => {
      const value = query2[key];
      if (isArray(value)) {
        value.forEach((item) => {
          node.children.push(next(item));
        });
      }
    });
    return node;
  };
  if (!isExpression(query)) {
    query = convertToExplicit(query);
  }
  return next(query);
}
function computeScore(results, { ignoreFieldNorm = Config.ignoreFieldNorm }) {
  results.forEach((result) => {
    let totalScore = 1;
    result.matches.forEach(({ key, norm: norm2, score }) => {
      const weight = key ? key.weight : null;
      totalScore *= Math.pow(
        score === 0 && weight ? Number.EPSILON : score,
        (weight || 1) * (ignoreFieldNorm ? 1 : norm2)
      );
    });
    result.score = totalScore;
  });
}
function transformMatches(result, data) {
  const matches = result.matches;
  data.matches = [];
  if (!isDefined(matches)) {
    return;
  }
  matches.forEach((match) => {
    if (!isDefined(match.indices) || !match.indices.length) {
      return;
    }
    const { indices, value } = match;
    let obj = {
      indices,
      value
    };
    if (match.key) {
      obj.key = match.key.src;
    }
    if (match.idx > -1) {
      obj.refIndex = match.idx;
    }
    data.matches.push(obj);
  });
}
function transformScore(result, data) {
  data.score = result.score;
}
function format(results, docs, {
  includeMatches = Config.includeMatches,
  includeScore = Config.includeScore
} = {}) {
  const transformers = [];
  if (includeMatches) transformers.push(transformMatches);
  if (includeScore) transformers.push(transformScore);
  return results.map((result) => {
    const { idx } = result;
    const data = {
      item: docs[idx],
      refIndex: idx
    };
    if (transformers.length) {
      transformers.forEach((transformer) => {
        transformer(result, data);
      });
    }
    return data;
  });
}
class Fuse {
  constructor(docs, options = {}, index) {
    this.options = { ...Config, ...options };
    if (this.options.useExtendedSearch && false) ;
    this._keyStore = new KeyStore(this.options.keys);
    this.setCollection(docs, index);
  }
  setCollection(docs, index) {
    this._docs = docs;
    if (index && !(index instanceof FuseIndex)) {
      throw new Error(INCORRECT_INDEX_TYPE);
    }
    this._myIndex = index || createIndex(this.options.keys, this._docs, {
      getFn: this.options.getFn,
      fieldNormWeight: this.options.fieldNormWeight
    });
  }
  add(doc) {
    if (!isDefined(doc)) {
      return;
    }
    this._docs.push(doc);
    this._myIndex.add(doc);
  }
  remove(predicate = () => false) {
    const results = [];
    for (let i = 0, len = this._docs.length; i < len; i += 1) {
      const doc = this._docs[i];
      if (predicate(doc, i)) {
        this.removeAt(i);
        i -= 1;
        len -= 1;
        results.push(doc);
      }
    }
    return results;
  }
  removeAt(idx) {
    this._docs.splice(idx, 1);
    this._myIndex.removeAt(idx);
  }
  getIndex() {
    return this._myIndex;
  }
  search(query, { limit = -1 } = {}) {
    const {
      includeMatches,
      includeScore,
      shouldSort,
      sortFn,
      ignoreFieldNorm
    } = this.options;
    let results = isString(query) ? isString(this._docs[0]) ? this._searchStringList(query) : this._searchObjectList(query) : this._searchLogical(query);
    computeScore(results, { ignoreFieldNorm });
    if (shouldSort) {
      results.sort(sortFn);
    }
    if (isNumber(limit) && limit > -1) {
      results = results.slice(0, limit);
    }
    return format(results, this._docs, {
      includeMatches,
      includeScore
    });
  }
  _searchStringList(query) {
    const searcher = createSearcher(query, this.options);
    const { records } = this._myIndex;
    const results = [];
    records.forEach(({ v: text, i: idx, n: norm2 }) => {
      if (!isDefined(text)) {
        return;
      }
      const { isMatch, score, indices } = searcher.searchIn(text);
      if (isMatch) {
        results.push({
          item: text,
          idx,
          matches: [{ score, value: text, norm: norm2, indices }]
        });
      }
    });
    return results;
  }
  _searchLogical(query) {
    const expression = parse(query, this.options);
    const evaluate = (node, item, idx) => {
      if (!node.children) {
        const { keyId, searcher } = node;
        const matches = this._findMatches({
          key: this._keyStore.get(keyId),
          value: this._myIndex.getValueForItemAtKeyId(item, keyId),
          searcher
        });
        if (matches && matches.length) {
          return [
            {
              idx,
              item,
              matches
            }
          ];
        }
        return [];
      }
      const res = [];
      for (let i = 0, len = node.children.length; i < len; i += 1) {
        const child = node.children[i];
        const result = evaluate(child, item, idx);
        if (result.length) {
          res.push(...result);
        } else if (node.operator === LogicalOperator.AND) {
          return [];
        }
      }
      return res;
    };
    const records = this._myIndex.records;
    const resultMap = {};
    const results = [];
    records.forEach(({ $: item, i: idx }) => {
      if (isDefined(item)) {
        let expResults = evaluate(expression, item, idx);
        if (expResults.length) {
          if (!resultMap[idx]) {
            resultMap[idx] = { idx, item, matches: [] };
            results.push(resultMap[idx]);
          }
          expResults.forEach(({ matches }) => {
            resultMap[idx].matches.push(...matches);
          });
        }
      }
    });
    return results;
  }
  _searchObjectList(query) {
    const searcher = createSearcher(query, this.options);
    const { keys, records } = this._myIndex;
    const results = [];
    records.forEach(({ $: item, i: idx }) => {
      if (!isDefined(item)) {
        return;
      }
      let matches = [];
      keys.forEach((key, keyIndex) => {
        matches.push(
          ...this._findMatches({
            key,
            value: item[keyIndex],
            searcher
          })
        );
      });
      if (matches.length) {
        results.push({
          idx,
          item,
          matches
        });
      }
    });
    return results;
  }
  _findMatches({ key, value, searcher }) {
    if (!isDefined(value)) {
      return [];
    }
    let matches = [];
    if (isArray(value)) {
      value.forEach(({ v: text, i: idx, n: norm2 }) => {
        if (!isDefined(text)) {
          return;
        }
        const { isMatch, score, indices } = searcher.searchIn(text);
        if (isMatch) {
          matches.push({
            score,
            key,
            value: text,
            idx,
            norm: norm2,
            indices
          });
        }
      });
    } else {
      const { v: text, n: norm2 } = value;
      const { isMatch, score, indices } = searcher.searchIn(text);
      if (isMatch) {
        matches.push({ score, key, value: text, norm: norm2, indices });
      }
    }
    return matches;
  }
}
Fuse.version = "7.1.0";
Fuse.createIndex = createIndex;
Fuse.parseIndex = parseIndex;
Fuse.config = Config;
{
  Fuse.parseQuery = parse;
}
{
  register(ExtendedSearch);
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
        var rows = isArray2(data.rows) ? data.rows : self.fetchMarkup(), cache = {}, scroll_top = self.scroll_elem.scrollTop;
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
          rows = isArray2(new_rows) ? new_rows : [];
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
          var new_rows = isArray2(_new_rows) ? _new_rows : [];
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
      function isArray2(arr) {
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
    super();
    // === STATE ===
    __publicField(this, "options", []);
    __publicField(this, "selectedValues", []);
    __publicField(this, "pendingValues", []);
    __publicField(this, "fuse");
    __publicField(this, "clusterize");
    // === CONFIG ===
    __publicField(this, "config", {
      label: "Filtro",
      allText: "Todos",
      emptyText: "Selecione",
      applyButtonText: "Aplicar",
      groupSelectedLabel: "Selecionados",
      searchPlaceholder: "Buscar..",
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
      this.initSearch();
      this.initClusterize();
      this.populateOptions(this.options);
      this.syncSelectElement();
      this.updateFilter();
      this.dispatchEvent(new CustomEvent("plantae-filter-ready", { bubbles: false }));
    });
  }
  loadConfig() {
    this.config.label = this.getAttribute("filter-label") || this.config.label;
    this.config.allText = this.getAttribute("filter-all-text") || this.config.allText;
    this.config.emptyText = this.getAttribute("filter-empty-text") || this.config.emptyText;
    this.config.groupSelectedLabel = this.getAttribute("filter-group-selected-label") || this.config.groupSelectedLabel;
    this.config.applyButtonText = this.getAttribute("filter-apply-button-text") || this.config.applyButtonText;
    this.config.searchPlaceholder = this.getAttribute("filter-search-placeholder") || this.config.searchPlaceholder;
    const fuseAttr = this.getAttribute("filter-fuse-options");
    if (fuseAttr) {
      try {
        const parsed = JSON.parse(fuseAttr);
        this.config.fuseOptions = { ...this.config.fuseOptions, ...parsed };
      } catch (err) {
        console.warn("Invalid JSON for fuse-options", err);
      }
    }
    const clusterizeAttr = this.getAttribute("filter-clusterize-options");
    if (clusterizeAttr) {
      try {
        const parsed = JSON.parse(clusterizeAttr);
        this.config.clusterizeOptions = { ...this.config.clusterizeOptions, ...parsed };
      } catch (err) {
        console.warn("Invalid JSON for clusterize-options", err);
      }
    }
  }
  // === DOM / TEMPLATE ===
  extractOptions() {
    const selectElement = this.querySelector("select");
    if (!selectElement) return;
    const flatOptions = [];
    Array.from(selectElement.children).forEach((child) => {
      if (child.tagName.toLowerCase() === "optgroup") {
        const group = child;
        const groupLabel = group.label;
        Array.from(group.children).forEach((option) => {
          const opt = option;
          flatOptions.push({
            value: isNaN(Number(opt.value)) ? opt.value : Number(opt.value),
            text: opt.text,
            group: groupLabel
          });
        });
      } else if (child.tagName.toLowerCase() === "option") {
        const opt = child;
        flatOptions.push({
          value: isNaN(Number(opt.value)) ? opt.value : Number(opt.value),
          text: opt.text,
          group: null
        });
      }
    });
    this.options = flatOptions;
    selectElement.style.display = "none";
    this.fuse = new Fuse(flatOptions, this.config.fuseOptions);
  }
  loadTemplate() {
    var _a, _b;
    const template = document.createElement("template");
    template.innerHTML = `<style>${styles}</style>${templateHtml}`;
    this.attachShadow({ mode: "open" }).append(template.content.cloneNode(true));
    const searchInput = (_a = this.shadowRoot) == null ? void 0 : _a.getElementById("searchInput");
    if (searchInput instanceof HTMLInputElement) {
      searchInput.placeholder = this.config.searchPlaceholder;
    }
    const applyButton = (_b = this.shadowRoot) == null ? void 0 : _b.getElementById("applyButton");
    if (applyButton instanceof HTMLElement) {
      applyButton.innerText = this.config.applyButtonText;
    }
  }
  populateOptions(optionsToRender) {
    const rows = [];
    const selectedRows = [];
    const groupedRows = /* @__PURE__ */ new Map();
    const pendingSet = new Set(this.pendingValues.map(String));
    const searchInput = this.shadowRoot.getElementById("searchInput");
    const isSearching = !!(searchInput == null ? void 0 : searchInput.value.trim());
    const formatTextWithHighlight = (text, matches) => {
      if (!matches || matches.length === 0) return text;
      const match = matches.find((m) => m.key === "text" || m.key === "value");
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
    };
    for (const opt of optionsToRender) {
      let option;
      let matches;
      if ("item" in opt) {
        option = opt.item;
        matches = opt.matches;
      } else {
        option = opt;
        matches = void 0;
      }
      const isSelected = pendingSet.has(String(option.value));
      const text = isSearching ? formatTextWithHighlight(option.text, matches) : option.text;
      const li = `<li part="dropdown-item${isSelected ? " selected" : ""}" data-value="${option.value}">${text}</li>`;
      if (isSelected) {
        selectedRows.push(li);
      } else {
        if (!groupedRows.has(option.group)) {
          groupedRows.set(option.group, []);
        }
        groupedRows.get(option.group).push(li);
      }
    }
    if (selectedRows.length > 0) {
      rows.push(`<li class="optgroup">${this.config.groupSelectedLabel} (${selectedRows.length})</li>`);
      rows.push(...selectedRows);
      rows.push(`<li class="optgroup"></li>`);
    }
    if (isSearching) {
      groupedRows.forEach((items) => rows.push(...items));
    } else {
      let lastGroup = null;
      for (const [group, items] of groupedRows) {
        if (group !== lastGroup) {
          if (group) {
            rows.push(`<li class="optgroup">${group}</li>`);
          } else if (lastGroup !== null) {
            rows.push(`<li class="optgroup"></li>`);
          }
          lastGroup = group;
        }
        rows.push(...items);
      }
    }
    this.clusterize.update(rows);
  }
  updateFilter() {
    const total = this.options.length;
    const count = this.selectedValues.length;
    const selectedTexts = this.options.filter((opt) => this.selectedValues.includes(String(opt.value))).map((opt) => opt.text);
    const filterText = this.shadowRoot.getElementById("filterText");
    filterText.innerHTML = count ? `<span class='counter-filter'>${count}</span> <strong>${this.config.label}:</strong> ${count === total ? this.config.allText : selectedTexts.join(", ")}` : `<strong>${this.config.label}:</strong> ${this.config.emptyText}`;
    const clearBtn = this.shadowRoot.getElementById("clearButton");
    clearBtn.style.opacity = count ? "1" : "0.5";
    clearBtn.style.pointerEvents = count ? "auto" : "none";
    const filter = this.shadowRoot.getElementById("filter");
    filter.setAttribute("title", count ? selectedTexts.join(", ") : "");
  }
  // === EVENT HANDLERS ===
  attachEvents() {
    document.addEventListener("keydown", (e) => this.handleEscKey(e));
    this.shadowRoot.getElementById("filter").addEventListener("click", () => this.toggleDropdown());
    this.shadowRoot.getElementById("clearButton").addEventListener("click", (e) => this.clearSelectionInterno(e));
    this.shadowRoot.getElementById("applyButton").addEventListener("click", () => this.applySelection());
    document.addEventListener("click", (e) => this.handleOutsideClick(e));
  }
  toggleSelectOption(li, value) {
    li.classList.toggle("selected");
    if (li.classList.contains("selected")) {
      this.pendingValues.push(value);
      li.setAttribute("part", "dropdown-item selected");
    } else {
      this.pendingValues = this.pendingValues.filter((v) => v !== value);
      li.setAttribute("part", "dropdown-item");
    }
  }
  handleOutsideClick(event) {
    if (!this.contains(event.target)) {
      this.closeDropdown();
    }
  }
  handleEscKey(event) {
    if (event.key === "Escape") {
      this.closeDropdown();
    }
  }
  initSearch() {
    const input = this.shadowRoot.getElementById("searchInput");
    const handleSearch = () => {
      const searchTerm = input.value.trim();
      if (!searchTerm) {
        this.populateOptions(this.options);
        this.syncPendingWithApplied();
        return;
      }
      const results = this.fuse.search(searchTerm);
      this.populateOptions(results);
      this.syncPendingWithApplied();
    };
    input.addEventListener("input", debounce(handleSearch, 300));
  }
  initClusterize() {
    this.clusterize = new Clusterize({
      rows: [],
      scrollElem: this.shadowRoot.getElementById("scrollArea"),
      contentElem: this.shadowRoot.getElementById("contentArea"),
      ...this.config.clusterizeOptions
    });
    this.shadowRoot.getElementById("contentArea").addEventListener("click", (e) => {
      const target = e.target;
      if (target.tagName.toLowerCase() === "li" && !target.classList.contains("optgroup")) {
        const li = target;
        const value = li.dataset.value;
        this.toggleSelectOption(li, value);
      }
    });
  }
  // === STATE + SELECTION ===
  syncSelectElement() {
    const selectElement = this.querySelector("select");
    selectElement.innerHTML = "";
    this.options.filter((opt) => this.selectedValues.includes(String(opt.value))).forEach((opt) => {
      const option = document.createElement("option");
      option.value = String(opt.value);
      option.text = opt.text;
      option.selected = true;
      selectElement.appendChild(option);
    });
  }
  applySelection() {
    this.selectedValues = [...this.pendingValues];
    this.syncSelectElement();
    this.updateFilter();
    this.closeDropdown();
    this.dispatchEvent(new Event("change"));
  }
  clearSelectionInterno(event) {
    event == null ? void 0 : event.stopPropagation();
    this.selectedValues = [];
    this.pendingValues = [];
    this.populateOptions(this.options);
    this.syncSelectElement();
    this.updateFilter();
    this.dispatchEvent(new Event("change"));
  }
  toggleDropdown() {
    const dropdown = this.shadowRoot.getElementById("dropdown");
    const isOpen = dropdown.style.display === "block";
    if (isOpen) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }
  closeDropdown() {
    const dropdown = this.shadowRoot.getElementById("dropdown");
    dropdown.style.display = "none";
  }
  openDropdown() {
    const searchInput = this.shadowRoot.getElementById("searchInput");
    const dropdown = this.shadowRoot.getElementById("dropdown");
    if (searchInput) {
      searchInput.value = "";
      requestAnimationFrame(() => {
        searchInput.focus();
      });
    }
    dropdown.style.display = "block";
    this.pendingValues = [...this.selectedValues];
    this.populateOptions(this.options);
    this.syncPendingWithApplied();
  }
  syncPendingWithApplied() {
    const lis = this.shadowRoot.querySelectorAll("#contentArea li[data-value]");
    lis.forEach((li) => {
      const el = li;
      const value = el.dataset.value;
      if (this.pendingValues.includes(value)) {
        el.classList.add("selected");
        el.setAttribute("part", "dropdown-item selected");
      } else {
        el.classList.remove("selected");
        el.setAttribute("part", "dropdown-item");
      }
    });
  }
  isOptionDisabled(value) {
    const li = this.shadowRoot.querySelector(`#contentArea li[data-value='${value}']`);
    return (li == null ? void 0 : li.classList.contains("disabled")) || false;
  }
  setOptionsDisabled(values, disabled) {
    const lis = this.shadowRoot.querySelectorAll("#contentArea li[data-value]");
    lis.forEach((li) => {
      const el = li;
      const value = el.dataset.value;
      if (values.includes(value)) {
        if (disabled) {
          el.classList.add("disabled");
          el.setAttribute("aria-disabled", "true");
          el.style.pointerEvents = "none";
          el.style.opacity = "0.5";
        } else {
          el.classList.remove("disabled");
          el.removeAttribute("aria-disabled");
          el.style.pointerEvents = "";
          el.style.opacity = "";
        }
      }
    });
  }
  // === PUBLIC API ===
  addOption(option) {
    const exists = this.options.find((opt) => opt.value === option.value);
    if (exists) return;
    this.options.push({
      value: option.value,
      text: option.text,
      group: option.group ?? null
    });
    this.fuse.setCollection(this.options);
    this.populateOptions(this.options);
    this.syncSelectElement();
  }
  addOptions(options) {
    options.forEach((option) => {
      const exists = this.options.find((opt) => opt.value === option.value);
      if (!exists) {
        this.options.push({
          value: option.value,
          text: option.text,
          group: option.group ?? null
        });
      }
    });
    this.fuse.setCollection(this.options);
    this.populateOptions(this.options);
    this.syncSelectElement();
  }
  selectOptions(values) {
    const validValues = values.filter((v) => {
      const opt = this.options.find((opt2) => opt2.value === v);
      return opt && !this.isOptionDisabled(opt.value);
    });
    validValues.forEach((v) => {
      if (!this.selectedValues.includes(String(v))) {
        this.selectedValues.push(String(v));
      }
    });
    this.pendingValues = [...this.selectedValues];
    this.populateOptions(this.options);
    this.syncSelectElement();
    this.updateFilter();
  }
  removeOptions(values) {
    this.options = this.options.filter((opt) => !values.includes(opt.value));
    this.selectedValues = this.selectedValues.filter((v) => !values.includes(v));
    this.pendingValues = this.pendingValues.filter((v) => !values.includes(v));
    this.fuse.setCollection(this.options);
    this.populateOptions(this.options);
    this.syncSelectElement();
    this.updateFilter();
  }
  removeAllOptions() {
    this.options = [];
    this.selectedValues = [];
    this.pendingValues = [];
    this.fuse.setCollection(this.options);
    this.populateOptions(this.options);
    this.syncSelectElement();
    this.updateFilter();
  }
  clearSelection() {
    this.clearSelectionInterno();
  }
  disableOptions(values) {
    this.setOptionsDisabled(values, true);
  }
  enableOptions(values) {
    this.setOptionsDisabled(values, false);
  }
  getSelected() {
    return this.options.filter((opt) => this.selectedValues.includes(String(opt.value)));
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
    const datasetAttributes = this.getDatasetAttributes(select);
    const mergedAttributes = { ...datasetAttributes, ...attributes };
    Object.entries(mergedAttributes).forEach(([key, value]) => {
      wrapper.setAttribute(key, value);
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
  getDatasetAttributes(select) {
    const attrs = {};
    Array.from(select.attributes).forEach((attr) => {
      if (attr.name.startsWith("data-pl-")) {
        const key = attr.name.replace("data-pl-", "");
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

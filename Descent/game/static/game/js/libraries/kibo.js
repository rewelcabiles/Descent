var Kibo = function(element) {
  this.element = element || window.document;
  this.initialize();
};

Kibo.KEY_NAMES_BY_CODE = {
  8: 'backspace', 9: 'tab', 13: 'enter',
  16: 'shift', 17: 'ctrl', 18: 'alt', 224: 'cmd', 91: 'lcmd', 92:'rwin', 93: 'rcmd',
  20: 'caps_lock',
  27: 'esc',
  32: 'space',
  33: 'page_up', 34: 'page_down',
  35: 'end', 36: 'home',
  37: 'left', 38: 'up', 39: 'right', 40: 'down',
  45: 'insert', 46: 'delete',
  48: '0', 49: '1', 50: '2', 51: '3', 52: '4', 53: '5', 54: '6', 55: '7', 56: '8', 57: '9',
  59: 'semi_colon',61: 'equals_sign',
  65: 'a', 66: 'b', 67: 'c', 68: 'd', 69: 'e', 70: 'f', 71: 'g', 72: 'h', 73: 'i', 74: 'j', 75: 'k', 76: 'l', 77: 'm', 78: 'n', 79: 'o', 80: 'p', 81: 'q', 82: 'r', 83: 's', 84: 't', 85: 'u', 86: 'v', 87: 'w', 88: 'x', 89: 'y', 90: 'z',
  96: '0', 97: '1', 98: '2', 99: '3', 100: '4', 101: '5', 102: '6', 103: '7', 104: '8', 105: '9',
  106:'multiply',107:'add',109:'subtract',110: 'decimal_point',111:'divide',
  112: 'f1', 113: 'f2', 114: 'f3', 115: 'f4', 116: 'f5', 117: 'f6', 118: 'f7', 119: 'f8', 120: 'f9', 121: 'f10', 122: 'f11', 123: 'f12',
  144: 'num_lock', 145: 'scroll_lock', 
  173: 'dash',
  186: 'semi_colon', 187: 'equal_sign', 188: 'comma', 189: 'dash', 190: 'period', 191: 'forward_slash',192: 'grave_accent',
  219: 'open_bracket',220:'back_slash',221:'close_bracket',222:'single_quote',
};

Kibo.KEY_CODES_BY_NAME = {};
(function() {
  for(var key in Kibo.KEY_NAMES_BY_CODE)
    if(Object.prototype.hasOwnProperty.call(Kibo.KEY_NAMES_BY_CODE, key))
      Kibo.KEY_CODES_BY_NAME[Kibo.KEY_NAMES_BY_CODE[key]] = +key;
})();

Kibo.MODIFIERS = ['shift', 'ctrl', 'alt', 'cmd','lcmd','rcmd','rwin'];

Kibo.WILDCARD_TYPES = ['arrow', 'number', 'letter', 'f', 'symbol'];

Kibo.WILDCARDS = {
  arrow: [37, 38, 39, 40],
  number: [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105],
  letter: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90],
  f: [112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123],
  symbol: [59,61,106,107,109,109,110,111,173,186,187,188,189,190,191,192,219,220,221,222]
};

Kibo.registerEvent = (function() {
  if(document.addEventListener) {
    return function(element, eventName, func) {
      element.addEventListener(eventName, func, false);
    };
  }
  else if(document.attachEvent) {
    return function(element, eventName, func) {
      element.attachEvent('on' + eventName, func);
    };
  }
})();

Kibo.unregisterEvent = (function() {
  if(document.removeEventListener) {
    return function(element, eventName, func) {
      element.removeEventListener(eventName, func, false);
    };
  }
  else if(document.detachEvent) {
    return function(element, eventName, func) {
      element.detachEvent('on' + eventName, func);
    };
  }
})();

Kibo.stringContains = function(string, substring) {
  return string.indexOf(substring) !== -1;
};

Kibo.neatString = function(string) {
  return string.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ');
};

Kibo.capitalize = function(string) {
  return string.toLowerCase().replace(/^./, function(match) { return match.toUpperCase(); });
};

Kibo.isString = function(what) {
  return Kibo.stringContains(Object.prototype.toString.call(what), 'String');
};

Kibo.arrayIncludes = (function() {
  if(Array.prototype.indexOf) {
    return function(haystack, needle) {
      return haystack.indexOf(needle) !== -1;
    };
  }
  else {
    return function(haystack, needle) {
      for(var i = 0; i < haystack.length; i++)
        if(haystack[i] === needle)
          return true;
      return false;
    };
  }
})();

Kibo.extractModifiers = function(keyCombination) {
  var modifiers, i
  modifiers = [];
  for(i = 0; i < Kibo.MODIFIERS.length; i++)
    if(Kibo.stringContains(keyCombination, Kibo.MODIFIERS[i]))
      modifiers.push(Kibo.MODIFIERS[i]);
  return modifiers;
}

Kibo.extractKey = function(keyCombination) {
  var keys, i;
  keys = Kibo.neatString(keyCombination).split(' ');
  for(i = 0; i < keys.length; i++)
    if(!Kibo.arrayIncludes(Kibo.MODIFIERS, keys[i]))
      return keys[i];
};

Kibo.modifiersAndKey = function(keyCombination) {
  var result, key;

  if(Kibo.stringContains(keyCombination, 'any')) {
    return Kibo.neatString(keyCombination).split(' ').slice(0, 2).join(' ');
  }

  result = Kibo.extractModifiers(keyCombination);

  key = Kibo.extractKey(keyCombination);
  if(key && !Kibo.arrayIncludes(Kibo.MODIFIERS, key))
    result.push(key);

  return result.join(' ');
}

Kibo.keyName = function(keyCode) {
  return Kibo.KEY_NAMES_BY_CODE[keyCode + ''];
};

Kibo.keyCode = function(keyName) {
  return +Kibo.KEY_CODES_BY_NAME[keyName];
};

Kibo.prototype.initialize = function() {
  var i, that = this;

  this.lastKeyCode = -1;
  this.lastModifiers = {};
  for(i = 0; i < Kibo.MODIFIERS.length; i++)
    this.lastModifiers[Kibo.MODIFIERS[i]] = false;

  this.keysDown = { any: [] };
  this.keysUp = { any: [] };
  for(i = 0; i < Kibo.WILDCARD_TYPES.length; i++) {
    this.keysDown['any ' + Kibo.WILDCARD_TYPES[i]] = [];
    this.keysUp['any ' + Kibo.WILDCARD_TYPES[i]] = [];
  }

  this.downHandler = this.handler('down');
  this.upHandler = this.handler('up');

  Kibo.registerEvent(this.element, 'keydown', this.downHandler);
  Kibo.registerEvent(this.element, 'keyup', this.upHandler);
  Kibo.registerEvent(window, 'unload', function unloader() {
    Kibo.unregisterEvent(that.element, 'keydown', that.downHandler);
    Kibo.unregisterEvent(that.element, 'keyup', that.upHandler);
    Kibo.unregisterEvent(window, 'unload', unloader);
  });
};

Kibo.prototype.handler = function(upOrDown) {
  var that = this;
  return function(e) {
    var i, j, registeredKeys, lastModifiersAndKey;

    e = e || window.event;

    that.lastKeyCode = e.which;
    for(i = 0; i < Kibo.MODIFIERS.length; i++)
      that.lastModifiers[Kibo.MODIFIERS[i]] = e[Kibo.MODIFIERS[i] + 'Key'];
    if(Kibo.arrayIncludes(Kibo.MODIFIERS, Kibo.keyName(that.lastKeyCode)))
      that.lastModifiers[Kibo.keyName(that.lastKeyCode)] = true;

    registeredKeys = that['keys' + Kibo.capitalize(upOrDown)];

    for(i = 0; i < registeredKeys.any.length; i++)
      if((registeredKeys.any[i](e) === false) && e.preventDefault)
        e.preventDefault();

    for(i = 0; i < Kibo.WILDCARD_TYPES.length; i++)
      if(Kibo.arrayIncludes(Kibo.WILDCARDS[Kibo.WILDCARD_TYPES[i]], that.lastKeyCode))
        for(j = 0; j < registeredKeys['any ' + Kibo.WILDCARD_TYPES[i]].length; j++)
          if((registeredKeys['any ' + Kibo.WILDCARD_TYPES[i]][j](e) === false) && e.preventDefault)
            e.preventDefault();

    lastModifiersAndKey = that.lastModifiersAndKey();
    if(registeredKeys[lastModifiersAndKey])
      for(i = 0; i < registeredKeys[lastModifiersAndKey].length; i++)
        if((registeredKeys[lastModifiersAndKey][i](e) === false) && e.preventDefault)
          e.preventDefault();
  };
};

Kibo.prototype.registerKeys = function(upOrDown, newKeys, func) {
  var i, keys, registeredKeys = this['keys' + Kibo.capitalize(upOrDown)];

  if(Kibo.isString(newKeys))
    newKeys = [newKeys];

  for(i = 0; i < newKeys.length; i++) {
    keys = newKeys[i];
    keys = Kibo.modifiersAndKey(keys + '');

    if(registeredKeys[keys])
      registeredKeys[keys].push(func);
    else
      registeredKeys[keys] = [func];
  }

  return this;
};

Kibo.prototype.unregisterKeys = function(upOrDown, newKeys, func) {
  var i, j, keys, registeredKeys = this['keys' + Kibo.capitalize(upOrDown)];

  if(Kibo.isString(newKeys))
    newKeys = [newKeys];

  for(i = 0; i < newKeys.length; i++) {
    keys = newKeys[i];
    keys = Kibo.modifiersAndKey(keys + '');

    if(func === null)
      delete registeredKeys[keys];
    else {
      if(registeredKeys[keys]) {
        for(j = 0; j < registeredKeys[keys].length; j++) {
          if(String(registeredKeys[keys][j]) === String(func)) {
            registeredKeys[keys].splice(j, 1);
            break;
          }
        }
      }
    }
  }

  return this;
};

Kibo.prototype.delegate = function(upOrDown, keys, func) {
  return func !== null ? this.registerKeys(upOrDown, keys, func) : this.unregisterKeys(upOrDown, keys, func);
};

Kibo.prototype.down = function(keys, func) {
  return this.delegate('down', keys, func);
};

Kibo.prototype.up = function(keys, func) {
  return this.delegate('up', keys, func);
};

Kibo.prototype.lastKey = function(modifier) {
  if(!modifier)
    return Kibo.keyName(this.lastKeyCode);

  return this.lastModifiers[modifier];
};

Kibo.prototype.lastModifiersAndKey = function() {
  var result, i;

  result = [];
  for(i = 0; i < Kibo.MODIFIERS.length; i++)
    if(this.lastKey(Kibo.MODIFIERS[i]))
      result.push(Kibo.MODIFIERS[i]);

  if(!Kibo.arrayIncludes(result, this.lastKey()))
    result.push(this.lastKey());

  return result.join(' ');
};
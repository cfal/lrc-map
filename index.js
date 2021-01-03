'use strict';

// A least-recently-created cache.
class LrcMap {
  constructor(opts = {}) {
    this._maxItems = opts.maxItems || 1024;
    // TODO: It would be cleaner (and faster) to use a circular buffer,
    // since then we don't have to shift().
    this._added = [];
    this._data = {};
  }

  clear() {
    this._added = [];
    this._data = {};
  }

  set(key, value) {
    const exists = key in this._data;
    this._data[key] = value;
    if (exists) {
      const i = this._added.indexOf(key);
      if (i < 0) {
        throw new Error('Cache is invalid: ' + key);
      }
      this._added.splice(i, 1);
      this._added.push(key);
    } else {
      this._added.push(key);
      if (this._added.length > this._maxItems) {
        delete this._data[this._added.shift()];
      }
    }
  }

  remove(key) {
    if (!(key in this._data)) {
      return;
    }
    delete this._data[key];
    const i = this._added.indexOf(key);
    if (i < 0) {
      throw new Error('Cache is invalid: ' + key);
    }
    this._added.splice(i, 1);
  }

  get(key) {
    return this._data[key];
  }

  has(key) {
    return key in this._data;
  }

  keys() {
    return this._added.concat();
  }
}

module.exports = LrcMap;

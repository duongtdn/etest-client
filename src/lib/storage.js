"use strict"

export default {
  SUBMITTEDKEY: '__$submitted__',
  PINNEDKEY: '__$pinned__',
  QUIZZESKEY: '__$quizzes__',
  SESSIONKEY: '__$sss__',
  observe(key, handler, flag=true) {
    if (typeof handler === 'number' && !flag) {
      return this.__removeObserver(key, handler);
    } else if (typeof handler === 'function' && flag) {
      return this.__addObserver(key, handler);
    }
  },
  update(key, data) {
    if (data === undefined) { return this; }
    localStorage.setItem(key, JSON.stringify(data));
    this.__fire(key, data);
    return this;
  },
  get(key) {
    const data = localStorage.getItem(key);
    if (data && data.length > 0) {
      return JSON.parse(data);
    } else {
      return null;
    }
  },
  clear(key) {
    if (key) {
      localStorage.removeItem(key);
      this.__fire(key, null);
    } else {
      ['SUBMITTEDKEY', 'PINNEDKEY', 'QUIZZESKEY', 'SESSIONKEY']
      .forEach(key => {
        localStorage.removeItem(this[key]);
        this.__fire(this[key], null);
      });
    }
    return this;
  },
  __handlers: {},
  __addObserver(key, handler) {
    if (this.__handlers[key] === undefined) {
      this.__handlers[key] = { cnt: 0 };
    }
    const cnt = this.__handlers[key].cnt++;
    this.__handlers[key][cnt] = handler;
    return cnt;
  },
  __removeObserver(key, handlerIndex) {
    if (this.__handlers[key][handlerIndex]) {
      delete this.__handlers[key][handlerIndex];
    }
  },
  __fire(key, data) {
    if (this.__handlers[key]) {
      Object.keys(this.__handlers[key]).forEach( h => {
        if (typeof this.__handlers[key][h] === 'function') {
          this.__handlers[key][h](data);
        }
      })
    }
  }
}

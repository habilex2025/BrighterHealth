/*!
 * in-view 0.6.1 - Get notified when a DOM element enters or exits the viewport.
 * Copyright (c) 2016 Cam Wiegert <cam@camwiegert.com> - https://camwiegert.github.io/in-view
 * License: MIT
 */
!(function (t, e) {
  typeof exports === 'object' && typeof module === 'object'
    ? (module.exports = e())
    : typeof define === 'function' && define.amd
    ? define([], e)
    : typeof exports === 'object'
    ? (exports.inView = e())
    : (t.inView = e());
})(this, function () {
  return (function (t) {
    function e(r) {
      if (n[r]) return n[r].exports;
      const i = (n[r] = { exports: {}, id: r, loaded: !1 });
      return t[r].call(i.exports, i, i.exports, e), (i.loaded = !0), i.exports;
    }
    var n = {};
    return (e.m = t), (e.c = n), (e.p = ''), e(0);
  })([
    function (t, e, n) {
      'use strict';
      function r(t) {
        return t && t.__esModule ? t : { default: t };
      }
      const i = n(2);
      const o = r(i);
      t.exports = o.default;
    },
    function (t, e) {
      function n(t) {
        const e = typeof t;
        return t != null && (e == 'object' || e == 'function');
      }
      t.exports = n;
    },
    function (t, e, n) {
      'use strict';
      function r(t) {
        return t && t.__esModule ? t : { default: t };
      }
      Object.defineProperty(e, '__esModule', { value: !0 });
      const i = n(9);
      const o = r(i);
      const u = n(3);
      const f = r(u);
      const s = n(4);
      const c = function () {
        if (typeof window !== 'undefined') {
          const t = 100;
          const e = ['scroll', 'resize', 'load'];
          const n = { history: [] };
          const r = { offset: {}, threshold: 0, test: s.inViewport };
          const i = (0, o.default)(function () {
            n.history.forEach(function (t) {
              n[t].check();
            });
          }, t);
          e.forEach(function (t) {
            return addEventListener(t, i);
          }),
            window.MutationObserver &&
              addEventListener('DOMContentLoaded', function () {
                new MutationObserver(i).observe(document.body, {
                  attributes: !0,
                  childList: !0,
                  subtree: !0,
                });
              });
          const u = function (t) {
            if (typeof t === 'string') {
              const e = [].slice.call(document.querySelectorAll(t));
              return (
                n.history.indexOf(t) > -1 ? (n[t].elements = e) : ((n[t] = (0, f.default)(e, r)), n.history.push(t)),
                n[t]
              );
            }
          };
          return (
            (u.offset = function (t) {
              if (void 0 === t) return r.offset;
              const e = function (t) {
                return typeof t === 'number';
              };
              return (
                ['top', 'right', 'bottom', 'left'].forEach(
                  e(t)
                    ? function (e) {
                        return (r.offset[e] = t);
                      }
                    : function (n) {
                        return e(t[n]) ? (r.offset[n] = t[n]) : null;
                      }
                ),
                r.offset
              );
            }),
            (u.threshold = function (t) {
              return typeof t === 'number' && t >= 0 && t <= 1 ? (r.threshold = t) : r.threshold;
            }),
            (u.test = function (t) {
              return typeof t === 'function' ? (r.test = t) : r.test;
            }),
            (u.is = function (t) {
              return r.test(t, r);
            }),
            u.offset(0),
            u
          );
        }
      };
      e.default = c();
    },
    function (t, e) {
      'use strict';
      function n(t, e) {
        if (!(t instanceof e)) throw new TypeError('Cannot call a class as a function');
      }
      Object.defineProperty(e, '__esModule', { value: !0 });
      const r = (function () {
        function t(t, e) {
          for (let n = 0; n < e.length; n++) {
            const r = e[n];
            (r.enumerable = r.enumerable || !1),
              (r.configurable = !0),
              'value' in r && (r.writable = !0),
              Object.defineProperty(t, r.key, r);
          }
        }
        return function (e, n, r) {
          return n && t(e.prototype, n), r && t(e, r), e;
        };
      })();
      const i = (function () {
        function t(e, r) {
          n(this, t),
            (this.options = r),
            (this.elements = e),
            (this.current = []),
            (this.handlers = { enter: [], exit: [] }),
            (this.singles = { enter: [], exit: [] });
        }
        return (
          r(t, [
            {
              key: 'check',
              value: function () {
                const t = this;
                return (
                  this.elements.forEach(function (e) {
                    const n = t.options.test(e, t.options);
                    const r = t.current.indexOf(e);
                    const i = r > -1;
                    const o = n && !i;
                    const u = !n && i;
                    o && (t.current.push(e), t.emit('enter', e)), u && (t.current.splice(r, 1), t.emit('exit', e));
                  }),
                  this
                );
              },
            },
            {
              key: 'on',
              value: function (t, e) {
                return this.handlers[t].push(e), this;
              },
            },
            {
              key: 'once',
              value: function (t, e) {
                return this.singles[t].unshift(e), this;
              },
            },
            {
              key: 'emit',
              value: function (t, e) {
                for (; this.singles[t].length; ) this.singles[t].pop()(e);
                for (let n = this.handlers[t].length; --n > -1; ) this.handlers[t][n](e);
                return this;
              },
            },
          ]),
          t
        );
      })();
      e.default = function (t, e) {
        return new i(t, e);
      };
    },
    function (t, e) {
      'use strict';
      function n(t, e) {
        const n = t.getBoundingClientRect();
        const r = n.top;
        const i = n.right;
        const o = n.bottom;
        const u = n.left;
        const f = n.width;
        const s = n.height;
        const c = {
          t: o,
          r: window.innerWidth - u,
          b: window.innerHeight - r,
          l: i,
        };
        const a = { x: e.threshold * f, y: e.threshold * s };
        return (
          c.t > e.offset.top + a.y &&
          c.r > e.offset.right + a.x &&
          c.b > e.offset.bottom + a.y &&
          c.l > e.offset.left + a.x
        );
      }
      Object.defineProperty(e, '__esModule', { value: !0 }), (e.inViewport = n);
    },
    function (t, e) {
      (function (e) {
        const n = typeof e === 'object' && e && e.Object === Object && e;
        t.exports = n;
      }.call(
        e,
        (function () {
          return this;
        })()
      ));
    },
    function (t, e, n) {
      const r = n(5);
      const i = typeof self === 'object' && self && self.Object === Object && self;
      const o = r || i || Function('return this')();
      t.exports = o;
    },
    function (t, e, n) {
      function r(t, e, n) {
        function r(e) {
          const n = x;
          const r = m;
          return (x = m = void 0), (E = e), (w = t.apply(r, n));
        }
        function a(t) {
          return (E = t), (j = setTimeout(h, e)), M ? r(t) : w;
        }
        function l(t) {
          const n = t - O;
          const r = t - E;
          const i = e - n;
          return _ ? c(i, g - r) : i;
        }
        function d(t) {
          const n = t - O;
          const r = t - E;
          return void 0 === O || n >= e || n < 0 || (_ && r >= g);
        }
        function h() {
          const t = o();
          return d(t) ? p(t) : void (j = setTimeout(h, l(t)));
        }
        function p(t) {
          return (j = void 0), T && x ? r(t) : ((x = m = void 0), w);
        }
        function v() {
          void 0 !== j && clearTimeout(j), (E = 0), (x = O = m = j = void 0);
        }
        function y() {
          return void 0 === j ? w : p(o());
        }
        function b() {
          const t = o();
          const n = d(t);
          if (((x = arguments), (m = this), (O = t), n)) {
            if (void 0 === j) return a(O);
            if (_) return (j = setTimeout(h, e)), r(O);
          }
          return void 0 === j && (j = setTimeout(h, e)), w;
        }
        let x;
        let m;
        let g;
        let w;
        let j;
        let O;
        var E = 0;
        var M = !1;
        var _ = !1;
        var T = !0;
        if (typeof t !== 'function') throw new TypeError(f);
        return (
          (e = u(e) || 0),
          i(n) &&
            ((M = !!n.leading),
            (_ = 'maxWait' in n),
            (g = _ ? s(u(n.maxWait) || 0, e) : g),
            (T = 'trailing' in n ? !!n.trailing : T)),
          (b.cancel = v),
          (b.flush = y),
          b
        );
      }
      var i = n(1);
      var o = n(8);
      var u = n(10);
      var f = 'Expected a function';
      var s = Math.max;
      var c = Math.min;
      t.exports = r;
    },
    function (t, e, n) {
      const r = n(6);
      const i = function () {
        return r.Date.now();
      };
      t.exports = i;
    },
    function (t, e, n) {
      function r(t, e, n) {
        let r = !0;
        let f = !0;
        if (typeof t !== 'function') throw new TypeError(u);
        return (
          o(n) && ((r = 'leading' in n ? !!n.leading : r), (f = 'trailing' in n ? !!n.trailing : f)),
          i(t, e, { leading: r, maxWait: e, trailing: f })
        );
      }
      var i = n(7);
      var o = n(1);
      var u = 'Expected a function';
      t.exports = r;
    },
    function (t, e) {
      function n(t) {
        return t;
      }
      t.exports = n;
    },
  ]);
});

(() => {
  function I(e) {
    return Array.isArray ? Array.isArray(e) : ft(e) === "[object Array]"
  }
  var Mt = 1 / 0;

  function yt(e) {
    if (typeof e == "string") return e;
    let t = e + "";
    return t == "0" && 1 / e == -Mt ? "-0" : t
  }

  function _t(e) {
    return e == null ? "" : yt(e)
  }

  function E(e) {
    return typeof e == "string"
  }

  function lt(e) {
    return typeof e == "number"
  }

  function Et(e) {
    return e === !0 || e === !1 || wt(e) && ft(e) == "[object Boolean]"
  }

  function ut(e) {
    return typeof e == "object"
  }

  function wt(e) {
    return ut(e) && e !== null
  }

  function M(e) {
    return e != null
  }

  function H(e) {
    return !e.trim().length
  }

  function ft(e) {
    return e == null ? e === void 0 ? "[object Undefined]" : "[object Null]" : Object.prototype.toString.call(e)
  }
  var At = "Incorrect 'index' type",
    It = e => `Invalid value for key ${e}`,
    St = e => `Pattern length exceeds max of ${e}.`,
    Lt = e => `Missing ${e} property in key`,
    xt = e => `Property 'weight' in key '${e}' must be a positive integer`,
    it = Object.prototype.hasOwnProperty,
    U = class {
      constructor(t) {
        this._keys = [], this._keyMap = {};
        let s = 0;
        t.forEach(n => {
          let r = dt(n);
          this._keys.push(r), this._keyMap[r.id] = r, s += r.weight
        }), this._keys.forEach(n => {
          n.weight /= s
        })
      }
      get(t) {
        return this._keyMap[t]
      }
      keys() {
        return this._keys
      }
      toJSON() {
        return JSON.stringify(this._keys)
      }
    };

  function dt(e) {
    let t = null,
      s = null,
      n = null,
      r = 1,
      i = null;
    if (E(e) || I(e)) n = e, t = ct(e), s = V(e);
    else {
      if (!it.call(e, "name")) throw new Error(Lt("name"));
      let c = e.name;
      if (n = c, it.call(e, "weight") && (r = e.weight, r <= 0)) throw new Error(xt(c));
      t = ct(c), s = V(c), i = e.getFn
    }
    return {
      path: t,
      id: s,
      weight: r,
      src: n,
      getFn: i
    }
  }

  function ct(e) {
    return I(e) ? e : e.split(".")
  }

  function V(e) {
    return I(e) ? e.join(".") : e
  }

  function Rt(e, t) {
    let s = [],
      n = !1,
      r = (i, c, o) => {
        if (M(i))
          if (!c[o]) s.push(i);
          else {
            let h = c[o],
              l = i[h];
            if (!M(l)) return;
            if (o === c.length - 1 && (E(l) || lt(l) || Et(l))) s.push(_t(l));
            else if (I(l)) {
              n = !0;
              for (let a = 0, f = l.length; a < f; a += 1) r(l[a], c, o + 1)
            } else c.length && r(l, c, o + 1)
          }
      };
    return r(e, E(t) ? t.split(".") : t, 0), n ? s : s[0]
  }
  var bt = {
      includeMatches: !1,
      findAllMatches: !1,
      minMatchCharLength: 1
    },
    Nt = {
      isCaseSensitive: !1,
      includeScore: !1,
      keys: [],
      shouldSort: !0,
      sortFn: (e, t) => e.score === t.score ? e.idx < t.idx ? -1 : 1 : e.score < t.score ? -1 : 1
    },
    kt = {
      location: 0,
      threshold: .6,
      distance: 100
    },
    Ot = {
      useExtendedSearch: !1,
      getFn: Rt,
      ignoreLocation: !1,
      ignoreFieldNorm: !1,
      fieldNormWeight: 1
    },
    u = {
      ...Nt,
      ...bt,
      ...kt,
      ...Ot
    },
    $t = /[^ ]+/g;

  function Ct(e = 1, t = 3) {
    let s = new Map,
      n = Math.pow(10, t);
    return {
      get(r) {
        let i = r.match($t).length;
        if (s.has(i)) return s.get(i);
        let c = 1 / Math.pow(i, .5 * e),
          o = parseFloat(Math.round(c * n) / n);
        return s.set(i, o), o
      },
      clear() {
        s.clear()
      }
    }
  }
  var $ = class {
    constructor({
      getFn: t = u.getFn,
      fieldNormWeight: s = u.fieldNormWeight
    } = {}) {
      this.norm = Ct(s, 3), this.getFn = t, this.isCreated = !1, this.setIndexRecords()
    }
    setSources(t = []) {
      this.docs = t
    }
    setIndexRecords(t = []) {
      this.records = t
    }
    setKeys(t = []) {
      this.keys = t, this._keysMap = {}, t.forEach((s, n) => {
        this._keysMap[s.id] = n
      })
    }
    create() {
      this.isCreated || !this.docs.length || (this.isCreated = !0, E(this.docs[0]) ? this.docs.forEach((t, s) => {
        this._addString(t, s)
      }) : this.docs.forEach((t, s) => {
        this._addObject(t, s)
      }), this.norm.clear())
    }
    add(t) {
      let s = this.size();
      E(t) ? this._addString(t, s) : this._addObject(t, s)
    }
    removeAt(t) {
      this.records.splice(t, 1);
      for (let s = t, n = this.size(); s < n; s += 1) this.records[s].i -= 1
    }
    getValueForItemAtKeyId(t, s) {
      return t[this._keysMap[s]]
    }
    size() {
      return this.records.length
    }
    _addString(t, s) {
      if (!M(t) || H(t)) return;
      let n = {
        v: t,
        i: s,
        n: this.norm.get(t)
      };
      this.records.push(n)
    }
    _addObject(t, s) {
      let n = {
        i: s,
        $: {}
      };
      this.keys.forEach((r, i) => {
        let c = r.getFn ? r.getFn(t) : this.getFn(t, r.path);
        if (M(c)) {
          if (I(c)) {
            let o = [],
              h = [{
                nestedArrIndex: -1,
                value: c
                            }];
            for (; h.length;) {
              let {
                nestedArrIndex: l,
                value: a
              } = h.pop();
              if (M(a))
                if (E(a) && !H(a)) {
                  let f = {
                    v: a,
                    i: l,
                    n: this.norm.get(a)
                  };
                  o.push(f)
                } else I(a) && a.forEach((f, d) => {
                  h.push({
                    nestedArrIndex: d,
                    value: f
                  })
                })
            }
            n.$[i] = o
          } else if (E(c) && !H(c)) {
            let o = {
              v: c,
              n: this.norm.get(c)
            };
            n.$[i] = o
          }
        }
      }), this.records.push(n)
    }
    toJSON() {
      return {
        keys: this.keys,
        records: this.records
      }
    }
  };

  function gt(e, t, {
    getFn: s = u.getFn,
    fieldNormWeight: n = u.fieldNormWeight
  } = {}) {
    let r = new $({
      getFn: s,
      fieldNormWeight: n
    });
    return r.setKeys(e.map(dt)), r.setSources(t), r.create(), r
  }

  function Tt(e, {
    getFn: t = u.getFn,
    fieldNormWeight: s = u.fieldNormWeight
  } = {}) {
    let {
      keys: n,
      records: r
    } = e, i = new $({
      getFn: t,
      fieldNormWeight: s
    });
    return i.setKeys(n), i.setIndexRecords(r), i
  }

  function v(e, {
    errors: t = 0,
    currentLocation: s = 0,
    expectedLocation: n = 0,
    distance: r = u.distance,
    ignoreLocation: i = u.ignoreLocation
  } = {}) {
    let c = t / e.length;
    if (i) return c;
    let o = Math.abs(n - s);
    return r ? c + o / r : o ? 1 : c
  }

  function vt(e = [], t = u.minMatchCharLength) {
    let s = [],
      n = -1,
      r = -1,
      i = 0;
    for (let c = e.length; i < c; i += 1) {
      let o = e[i];
      o && n === -1 ? n = i : !o && n !== -1 && (r = i - 1, r - n + 1 >= t && s.push([n, r]), n = -1)
    }
    return e[i - 1] && i - n >= t && s.push([n, i - 1]), s
  }
  var N = 32;

  function Ft(e, t, s, {
    location: n = u.location,
    distance: r = u.distance,
    threshold: i = u.threshold,
    findAllMatches: c = u.findAllMatches,
    minMatchCharLength: o = u.minMatchCharLength,
    includeMatches: h = u.includeMatches,
    ignoreLocation: l = u.ignoreLocation
  } = {}) {
    if (t.length > N) throw new Error(St(N));
    let a = t.length,
      f = e.length,
      d = Math.max(0, Math.min(n, f)),
      g = i,
      p = d,
      m = o > 1 || h,
      R = m ? Array(f) : [],
      A;
    for (;
      (A = e.indexOf(t, p)) > -1;) {
      let y = v(t, {
        currentLocation: A,
        expectedLocation: d,
        distance: r,
        ignoreLocation: l
      });
      if (g = Math.min(y, g), p = A + a, m) {
        let L = 0;
        for (; L < a;) R[A + L] = 1, L += 1
      }
    }
    p = -1;
    let k = [],
      b = 1,
      C = a + f,
      mt = 1 << a - 1;
    for (let y = 0; y < a; y += 1) {
      let L = 0,
        x = C;
      for (; L < x;) v(t, {
        errors: y,
        currentLocation: d + x,
        expectedLocation: d,
        distance: r,
        ignoreLocation: l
      }) <= g ? L = x : C = x, x = Math.floor((C - L) / 2 + L);
      C = x;
      let nt = Math.max(1, d - x + 1),
        W = c ? f : Math.min(d + x, f) + a,
        O = Array(W + 2);
      O[W + 1] = (1 << y) - 1;
      for (let _ = W; _ >= nt; _ -= 1) {
        let T = _ - 1,
          rt = s[e.charAt(T)];
        if (m && (R[T] = +!!rt), O[_] = (O[_ + 1] << 1 | 1) & rt, y && (O[_] |= (k[_ + 1] | k[_]) << 1 | 1 | k[_ + 1]), O[_] & mt && (b = v(t, {
            errors: y,
            currentLocation: T,
            expectedLocation: d,
            distance: r,
            ignoreLocation: l
          }), b <= g)) {
          if (g = b, p = T, p <= d) break;
          nt = Math.max(1, 2 * d - p)
        }
      }
      if (v(t, {
          errors: y + 1,
          currentLocation: d,
          expectedLocation: d,
          distance: r,
          ignoreLocation: l
        }) > g) break;
      k = O
    }
    let K = {
      isMatch: p >= 0,
      score: Math.max(.001, b)
    };
    if (m) {
      let y = vt(R, o);
      y.length ? h && (K.indices = y) : K.isMatch = !1
    }
    return K
  }

  function jt(e) {
    let t = {};
    for (let s = 0, n = e.length; s < n; s += 1) {
      let r = e.charAt(s);
      t[r] = (t[r] || 0) | 1 << n - s - 1
    }
    return t
  }
  var F = class {
      constructor(t, {
        location: s = u.location,
        threshold: n = u.threshold,
        distance: r = u.distance,
        includeMatches: i = u.includeMatches,
        findAllMatches: c = u.findAllMatches,
        minMatchCharLength: o = u.minMatchCharLength,
        isCaseSensitive: h = u.isCaseSensitive,
        ignoreLocation: l = u.ignoreLocation
      } = {}) {
        if (this.options = {
            location: s,
            threshold: n,
            distance: r,
            includeMatches: i,
            findAllMatches: c,
            minMatchCharLength: o,
            isCaseSensitive: h,
            ignoreLocation: l
          }, this.pattern = h ? t : t.toLowerCase(), this.chunks = [], !this.pattern.length) return;
        let a = (d, g) => {
            this.chunks.push({
              pattern: d,
              alphabet: jt(d),
              startIndex: g
            })
          },
          f = this.pattern.length;
        if (f > N) {
          let d = 0,
            g = f % N,
            p = f - g;
          for (; d < p;) a(this.pattern.substr(d, N), d), d += N;
          if (g) {
            let m = f - N;
            a(this.pattern.substr(m), m)
          }
        } else a(this.pattern, 0)
      }
      searchIn(t) {
        let {
          isCaseSensitive: s,
          includeMatches: n
        } = this.options;
        if (s || (t = t.toLowerCase()), this.pattern === t) {
          let p = {
            isMatch: !0,
            score: 0
          };
          return n && (p.indices = [
                        [0, t.length - 1]
                    ]), p
        }
        let {
          location: r,
          distance: i,
          threshold: c,
          findAllMatches: o,
          minMatchCharLength: h,
          ignoreLocation: l
        } = this.options, a = [], f = 0, d = !1;
        this.chunks.forEach(({
          pattern: p,
          alphabet: m,
          startIndex: R
        }) => {
          let {
            isMatch: A,
            score: k,
            indices: b
          } = Ft(t, p, m, {
            location: r + R,
            distance: i,
            threshold: c,
            findAllMatches: o,
            minMatchCharLength: h,
            includeMatches: n,
            ignoreLocation: l
          });
          A && (d = !0), f += k, A && b && (a = [...a, ...b])
        });
        let g = {
          isMatch: d,
          score: d ? f / this.chunks.length : 1
        };
        return d && n && (g.indices = a), g
      }
    },
    w = class {
      constructor(t) {
        this.pattern = t
      }
      static isMultiMatch(t) {
        return ot(t, this.multiRegex)
      }
      static isSingleMatch(t) {
        return ot(t, this.singleRegex)
      }
      search() {}
    };

  function ot(e, t) {
    let s = e.match(t);
    return s ? s[1] : null
  }
  var B = class extends w {
      constructor(t) {
        super(t)
      }
      static get type() {
        return "exact"
      }
      static get multiRegex() {
        return /^="(.*)"$/
      }
      static get singleRegex() {
        return /^=(.*)$/
      }
      search(t) {
        let s = t === this.pattern;
        return {
          isMatch: s,
          score: s ? 0 : 1,
          indices: [0, this.pattern.length - 1]
        }
      }
    },
    Y = class extends w {
      constructor(t) {
        super(t)
      }
      static get type() {
        return "inverse-exact"
      }
      static get multiRegex() {
        return /^!"(.*)"$/
      }
      static get singleRegex() {
        return /^!(.*)$/
      }
      search(t) {
        let n = t.indexOf(this.pattern) === -1;
        return {
          isMatch: n,
          score: n ? 0 : 1,
          indices: [0, t.length - 1]
        }
      }
    },
    G = class extends w {
      constructor(t) {
        super(t)
      }
      static get type() {
        return "prefix-exact"
      }
      static get multiRegex() {
        return /^\^"(.*)"$/
      }
      static get singleRegex() {
        return /^\^(.*)$/
      }
      search(t) {
        let s = t.startsWith(this.pattern);
        return {
          isMatch: s,
          score: s ? 0 : 1,
          indices: [0, this.pattern.length - 1]
        }
      }
    },
    z = class extends w {
      constructor(t) {
        super(t)
      }
      static get type() {
        return "inverse-prefix-exact"
      }
      static get multiRegex() {
        return /^!\^"(.*)"$/
      }
      static get singleRegex() {
        return /^!\^(.*)$/
      }
      search(t) {
        let s = !t.startsWith(this.pattern);
        return {
          isMatch: s,
          score: s ? 0 : 1,
          indices: [0, t.length - 1]
        }
      }
    },
    Q = class extends w {
      constructor(t) {
        super(t)
      }
      static get type() {
        return "suffix-exact"
      }
      static get multiRegex() {
        return /^"(.*)"\$$/
      }
      static get singleRegex() {
        return /^(.*)\$$/
      }
      search(t) {
        let s = t.endsWith(this.pattern);
        return {
          isMatch: s,
          score: s ? 0 : 1,
          indices: [t.length - this.pattern.length, t.length - 1]
        }
      }
    },
    X = class extends w {
      constructor(t) {
        super(t)
      }
      static get type() {
        return "inverse-suffix-exact"
      }
      static get multiRegex() {
        return /^!"(.*)"\$$/
      }
      static get singleRegex() {
        return /^!(.*)\$$/
      }
      search(t) {
        let s = !t.endsWith(this.pattern);
        return {
          isMatch: s,
          score: s ? 0 : 1,
          indices: [0, t.length - 1]
        }
      }
    },
    j = class extends w {
      constructor(t, {
        location: s = u.location,
        threshold: n = u.threshold,
        distance: r = u.distance,
        includeMatches: i = u.includeMatches,
        findAllMatches: c = u.findAllMatches,
        minMatchCharLength: o = u.minMatchCharLength,
        isCaseSensitive: h = u.isCaseSensitive,
        ignoreLocation: l = u.ignoreLocation
      } = {}) {
        super(t), this._bitapSearch = new F(t, {
          location: s,
          threshold: n,
          distance: r,
          includeMatches: i,
          findAllMatches: c,
          minMatchCharLength: o,
          isCaseSensitive: h,
          ignoreLocation: l
        })
      }
      static get type() {
        return "fuzzy"
      }
      static get multiRegex() {
        return /^"(.*)"$/
      }
      static get singleRegex() {
        return /^(.*)$/
      }
      search(t) {
        return this._bitapSearch.searchIn(t)
      }
    },
    P = class extends w {
      constructor(t) {
        super(t)
      }
      static get type() {
        return "include"
      }
      static get multiRegex() {
        return /^'"(.*)"$/
      }
      static get singleRegex() {
        return /^'(.*)$/
      }
      search(t) {
        let s = 0,
          n, r = [],
          i = this.pattern.length;
        for (;
          (n = t.indexOf(this.pattern, s)) > -1;) s = n + i, r.push([n, s - 1]);
        let c = !!r.length;
        return {
          isMatch: c,
          score: c ? 0 : 1,
          indices: r
        }
      }
    },
    J = [B, P, G, z, X, Q, Y, j],
    ht = J.length,
    Pt = / +(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/,
    Dt = "|";

  function Kt(e, t = {}) {
    return e.split(Dt).map(s => {
      let n = s.trim().split(Pt).filter(i => i && !!i.trim()),
        r = [];
      for (let i = 0, c = n.length; i < c; i += 1) {
        let o = n[i],
          h = !1,
          l = -1;
        for (; !h && ++l < ht;) {
          let a = J[l],
            f = a.isMultiMatch(o);
          f && (r.push(new a(f, t)), h = !0)
        }
        if (!h)
          for (l = -1; ++l < ht;) {
            let a = J[l],
              f = a.isSingleMatch(o);
            if (f) {
              r.push(new a(f, t));
              break
            }
          }
      }
      return r
    })
  }
  var Wt = new Set([j.type, P.type]),
    Z = class {
      constructor(t, {
        isCaseSensitive: s = u.isCaseSensitive,
        includeMatches: n = u.includeMatches,
        minMatchCharLength: r = u.minMatchCharLength,
        ignoreLocation: i = u.ignoreLocation,
        findAllMatches: c = u.findAllMatches,
        location: o = u.location,
        threshold: h = u.threshold,
        distance: l = u.distance
      } = {}) {
        this.query = null, this.options = {
          isCaseSensitive: s,
          includeMatches: n,
          minMatchCharLength: r,
          findAllMatches: c,
          ignoreLocation: i,
          location: o,
          threshold: h,
          distance: l
        }, this.pattern = s ? t : t.toLowerCase(), this.query = Kt(this.pattern, this.options)
      }
      static condition(t, s) {
        return s.useExtendedSearch
      }
      searchIn(t) {
        let s = this.query;
        if (!s) return {
          isMatch: !1,
          score: 1
        };
        let {
          includeMatches: n,
          isCaseSensitive: r
        } = this.options;
        t = r ? t : t.toLowerCase();
        let i = 0,
          c = [],
          o = 0;
        for (let h = 0, l = s.length; h < l; h += 1) {
          let a = s[h];
          c.length = 0, i = 0;
          for (let f = 0, d = a.length; f < d; f += 1) {
            let g = a[f],
              {
                isMatch: p,
                indices: m,
                score: R
              } = g.search(t);
            if (p) {
              if (i += 1, o += R, n) {
                let A = g.constructor.type;
                Wt.has(A) ? c = [...c, ...m] : c.push(m)
              }
            } else {
              o = 0, i = 0, c.length = 0;
              break
            }
          }
          if (i) {
            let f = {
              isMatch: !0,
              score: o / i
            };
            return n && (f.indices = c), f
          }
        }
        return {
          isMatch: !1,
          score: 1
        }
      }
    },
    q = [];

  function Ht(...e) {
    q.push(...e)
  }

  function tt(e, t) {
    for (let s = 0, n = q.length; s < n; s += 1) {
      let r = q[s];
      if (r.condition(e, t)) return new r(e, t)
    }
    return new F(e, t)
  }
  var D = {
      AND: "$and",
      OR: "$or"
    },
    et = {
      PATH: "$path",
      PATTERN: "$val"
    },
    st = e => !!(e[D.AND] || e[D.OR]),
    Ut = e => !!e[et.PATH],
    Vt = e => !I(e) && ut(e) && !st(e),
    at = e => ({
            [D.AND]: Object.keys(e).map(t => ({
                [t]: e[t]
      }))
    });

  function pt(e, t, {
    auto: s = !0
  } = {}) {
    let n = r => {
      let i = Object.keys(r),
        c = Ut(r);
      if (!c && i.length > 1 && !st(r)) return n(at(r));
      if (Vt(r)) {
        let h = c ? r[et.PATH] : i[0],
          l = c ? r[et.PATTERN] : r[h];
        if (!E(l)) throw new Error(It(h));
        let a = {
          keyId: V(h),
          pattern: l
        };
        return s && (a.searcher = tt(l, t)), a
      }
      let o = {
        children: [],
        operator: i[0]
      };
      return i.forEach(h => {
        let l = r[h];
        I(l) && l.forEach(a => {
          o.children.push(n(a))
        })
      }), o
    };
    return st(e) || (e = at(e)), n(e)
  }

  function Bt(e, {
    ignoreFieldNorm: t = u.ignoreFieldNorm
  }) {
    e.forEach(s => {
      let n = 1;
      s.matches.forEach(({
        key: r,
        norm: i,
        score: c
      }) => {
        let o = r ? r.weight : null;
        n *= Math.pow(c === 0 && o ? Number.EPSILON : c, (o || 1) * (t ? 1 : i))
      }), s.score = n
    })
  }

  function Yt(e, t) {
    let s = e.matches;
    t.matches = [], M(s) && s.forEach(n => {
      if (!M(n.indices) || !n.indices.length) return;
      let {
        indices: r,
        value: i
      } = n, c = {
        indices: r,
        value: i
      };
      n.key && (c.key = n.key.src), n.idx > -1 && (c.refIndex = n.idx), t.matches.push(c)
    })
  }

  function Gt(e, t) {
    t.score = e.score
  }

  function zt(e, t, {
    includeMatches: s = u.includeMatches,
    includeScore: n = u.includeScore
  } = {}) {
    let r = [];
    return s && r.push(Yt), n && r.push(Gt), e.map(i => {
      let {
        idx: c
      } = i, o = {
        item: t[c],
        refIndex: c
      };
      return r.length && r.forEach(h => {
        h(i, o)
      }), o
    })
  }
  var S = class {
    constructor(t, s = {}, n) {
      this.options = {
        ...u,
        ...s
      }, this.options.useExtendedSearch, this._keyStore = new U(this.options.keys), this.setCollection(t, n)
    }
    setCollection(t, s) {
      if (this._docs = t, s && !(s instanceof $)) throw new Error(At);
      this._myIndex = s || gt(this.options.keys, this._docs, {
        getFn: this.options.getFn,
        fieldNormWeight: this.options.fieldNormWeight
      })
    }
    add(t) {
      M(t) && (this._docs.push(t), this._myIndex.add(t))
    }
    remove(t = () => !1) {
      let s = [];
      for (let n = 0, r = this._docs.length; n < r; n += 1) {
        let i = this._docs[n];
        t(i, n) && (this.removeAt(n), n -= 1, r -= 1, s.push(i))
      }
      return s
    }
    removeAt(t) {
      this._docs.splice(t, 1), this._myIndex.removeAt(t)
    }
    getIndex() {
      return this._myIndex
    }
    search(t, {
      limit: s = -1
    } = {}) {
      let {
        includeMatches: n,
        includeScore: r,
        shouldSort: i,
        sortFn: c,
        ignoreFieldNorm: o
      } = this.options, h = E(t) ? E(this._docs[0]) ? this._searchStringList(t) : this._searchObjectList(t) : this._searchLogical(t);
      return Bt(h, {
        ignoreFieldNorm: o
      }), i && h.sort(c), lt(s) && s > -1 && (h = h.slice(0, s)), zt(h, this._docs, {
        includeMatches: n,
        includeScore: r
      })
    }
    _searchStringList(t) {
      let s = tt(t, this.options),
        {
          records: n
        } = this._myIndex,
        r = [];
      return n.forEach(({
        v: i,
        i: c,
        n: o
      }) => {
        if (!M(i)) return;
        let {
          isMatch: h,
          score: l,
          indices: a
        } = s.searchIn(i);
        h && r.push({
          item: i,
          idx: c,
          matches: [{
            score: l,
            value: i,
            norm: o,
            indices: a
                    }]
        })
      }), r
    }
    _searchLogical(t) {
      let s = pt(t, this.options),
        n = (o, h, l) => {
          if (!o.children) {
            let {
              keyId: f,
              searcher: d
            } = o, g = this._findMatches({
              key: this._keyStore.get(f),
              value: this._myIndex.getValueForItemAtKeyId(h, f),
              searcher: d
            });
            return g && g.length ? [{
              idx: l,
              item: h,
              matches: g
                        }] : []
          }
          let a = [];
          for (let f = 0, d = o.children.length; f < d; f += 1) {
            let g = o.children[f],
              p = n(g, h, l);
            if (p.length) a.push(...p);
            else if (o.operator === D.AND) return []
          }
          return a
        },
        r = this._myIndex.records,
        i = {},
        c = [];
      return r.forEach(({
        $: o,
        i: h
      }) => {
        if (M(o)) {
          let l = n(s, o, h);
          l.length && (i[h] || (i[h] = {
            idx: h,
            item: o,
            matches: []
          }, c.push(i[h])), l.forEach(({
            matches: a
          }) => {
            i[h].matches.push(...a)
          }))
        }
      }), c
    }
    _searchObjectList(t) {
      let s = tt(t, this.options),
        {
          keys: n,
          records: r
        } = this._myIndex,
        i = [];
      return r.forEach(({
        $: c,
        i: o
      }) => {
        if (!M(c)) return;
        let h = [];
        n.forEach((l, a) => {
          h.push(...this._findMatches({
            key: l,
            value: c[a],
            searcher: s
          }))
        }), h.length && i.push({
          idx: o,
          item: c,
          matches: h
        })
      }), i
    }
    _findMatches({
      key: t,
      value: s,
      searcher: n
    }) {
      if (!M(s)) return [];
      let r = [];
      if (I(s)) s.forEach(({
        v: i,
        i: c,
        n: o
      }) => {
        if (!M(i)) return;
        let {
          isMatch: h,
          score: l,
          indices: a
        } = n.searchIn(i);
        h && r.push({
          score: l,
          key: t,
          value: i,
          idx: c,
          norm: o,
          indices: a
        })
      });
      else {
        let {
          v: i,
          n: c
        } = s, {
          isMatch: o,
          score: h,
          indices: l
        } = n.searchIn(i);
        o && r.push({
          score: h,
          key: t,
          value: i,
          norm: c,
          indices: l
        })
      }
      return r
    }
  };
  S.version = "7.0.0";
  S.createIndex = gt;
  S.parseIndex = Tt;
  S.config = u;
  S.parseQuery = pt;
  Ht(Z);
  (function() {
    let e = document.querySelector("#icons-body");
    if (!e) return;
    let t = e.querySelector("#search"),
      s = e.querySelector("#icons-list"),
      n = Array.from(s.children),
      r = n.map(a => ({
        name: a.dataset.name,
        categories: a.dataset.categories.split(" "),
        tags: a.dataset.tags.split(" ")
      })),
      i = new S(r, {
        ignoreLocation: !0,
        useExtendedSearch: !0,
        shouldSort: !1,
        keys: ["name", "categories", "tags"],
        threshold: 0
      });

    function c(a) {
      let f = a ? a.trim() : "";
      if (s.innerHTML = "", f.length > 0) {
        let p = i.search(f).map(m => n[m.refIndex]);
        s.append(...p)
      } else s.append(...n);
      let d = new URL(window.location);
      f.length > 0 ? d.searchParams.set("q", f) : d.searchParams.delete("q"), window.history.replaceState(null, null, d)
    }
    let o;
    t.addEventListener("input", () => {
      clearTimeout(o), o = setTimeout(() => {
        c(t.value)
      }, 250)
    });
    let h = new URLSearchParams(window.location.search).get("q");
    if (!h || h.length === 0) return;
    let l = h.trim();
    c(l), t.value = l, document.querySelector("#content").scrollIntoView()
  })();
})();
! function(b, f) {
  "object" == typeof exports && "object" == typeof module ? module.exports = f() : "function" == typeof define && define.amd ? define("solarlunar", [], f) : "object" == typeof exports ? exports.solarlunar = f() : b.solarlunar = f()
}(this, function() {
  return function(b) {
    function f(c) {
      if (e[c]) return e[c].exports;
      var t = e[c] = {
        i: c,
        l: !1,
        exports: {}
      };
      return b[c].call(t.exports, t, t.exports, f), t.l = !0, t.exports
    }
    var e = {};
    return f.m = b, f.c = e, f.d = function(b, e, c) {
      f.o(b, e) || Object.defineProperty(b, e, {
        configurable: !1,
        enumerable: !0,
        get: c
      })
    }, f.n = function(b) {
      var e = b && b.__esModule ? function() {
        return b.default
      } : function() {
        return b
      };
      return f.d(e, "a", e), e
    }, f.o = function(b, f) {
      return Object.prototype.hasOwnProperty.call(b, f)
    }, f.p = "", f(f.s = 0)
  }([function(b, f, e) {
    "use strict";
    Object.defineProperty(f, "__esModule", {
      value: !0
    });
    var c = e(1),
      t = function(b) {
        return b && b.__esModule ? b : {
          default: b
        }
      }(c);
    f.default = t.default, b.exports = f.default
  }, function(b, f, e) {
    "use strict";

    function c(b) {
      return b && b.__esModule ? b : {
        default: b
      }
    }
    Object.defineProperty(f, "__esModule", {
      value: !0
    });
    var t = e(2),
      r = c(t),
      a = e(3),
      n = c(a),
      d = e(4),
      u = c(d),
      s = e(5),
      o = c(s),
      l = e(6),
      i = c(l),
      p = e(7),
      y = c(p),
      h = e(8),
      v = c(h),
      M = e(9),
      g = c(M),
      _ = e(10),
      D = c(_),
      x = e(11),
      m = c(x),
      j = e(12),
      I = c(j),
      S = {
        lunarInfo: r.default,
        solarMonth: n.default,
        gan: u.default,
        zhi: o.default,
        animals: i.default,
        lunarTerm: y.default,
        lTermInfo: v.default,
        nStr1: g.default,
        nStr2: D.default,
        nStr3: m.default,
        nStr4: I.default,
        lYearDays: function(b) {
          var f, e = 348;
          for (f = 32768; f > 8; f >>= 1) e += S.lunarInfo[b - 1900] & f ? 1 : 0;
          return e + S.leapDays(b)
        },
        leapMonth: function(b) {
          return 15 & S.lunarInfo[b - 1900]
        },
        leapDays: function(b) {
          return S.leapMonth(b) ? 65536 & S.lunarInfo[b - 1900] ? 30 : 29 : 0
        },
        monthDays: function(b, f) {
          return f > 12 || f < 1 ? -1 : S.lunarInfo[b - 1900] & 65536 >> f ? 30 : 29
        },
        solarDays: function(b, f) {
          if (f > 12 || f < 1) return -1;
          var e = f - 1;
          return 1 == e ? b % 4 == 0 && b % 100 != 0 || b % 400 == 0 ? 29 : 28 : S.solarMonth[e]
        },
        toGanZhi: function(b) {
          return S.gan[b % 10] + S.zhi[b % 12]
        },
        getTerm: function(b, f) {
          if (b < 1900 || b > 2100) return -1;
          if (f < 1 || f > 24) return -1;
          var e = S.lTermInfo[b - 1900],
            c = [parseInt("0x" + e.substr(0, 5)).toString(), parseInt("0x" + e.substr(5, 5)).toString(), parseInt("0x" + e.substr(10, 5)).toString(), parseInt("0x" + e.substr(15, 5)).toString(), parseInt("0x" + e.substr(20, 5)).toString(), parseInt("0x" + e.substr(25, 5)).toString()],
            t = [c[0].substr(0, 1), c[0].substr(1, 2), c[0].substr(3, 1), c[0].substr(4, 2), c[1].substr(0, 1), c[1].substr(1, 2), c[1].substr(3, 1), c[1].substr(4, 2), c[2].substr(0, 1), c[2].substr(1, 2), c[2].substr(3, 1), c[2].substr(4, 2), c[3].substr(0, 1), c[3].substr(1, 2), c[3].substr(3, 1), c[3].substr(4, 2), c[4].substr(0, 1), c[4].substr(1, 2), c[4].substr(3, 1), c[4].substr(4, 2), c[5].substr(0, 1), c[5].substr(1, 2), c[5].substr(3, 1), c[5].substr(4, 2)];
          return parseInt(t[f - 1])
        },
        toChinaYear: function(b) {
          var f = parseInt(b / 1e3),
            e = parseInt(b % 1e3 / 100),
            c = parseInt(b % 100 / 10),
            t = b % 10;
          return S.nStr4[f] + S.nStr4[e] + S.nStr4[c] + S.nStr4[t] + "年"
        },
        toChinaMonth: function(b) {
          if (b > 12 || b < 1) return -1;
          var f = S.nStr3[b - 1];
          return f += "月"
        },
        toChinaDay: function(b) {
          var f;
          switch (b) {
            case 10:
              f = "初十";
              break;
            case 20:
              f = "二十";
              break;
            case 30:
              f = "三十";
              break;
            default:
              f = S.nStr2[Math.floor(b / 10)], f += S.nStr1[b % 10]
          }
          return f
        },
        getAnimal: function(b) {
          return S.animals[(b - 4) % 12]
        },
        solar2lunar: function(b, f, e) {
          if (b < 1900 || b > 2100) return -1;
          if (1900 == b && 1 == f && e < 31) return -1;
          if (b) var c = new Date(b, parseInt(f) - 1, e);
          else var c = new Date;
          var t, r = 0,
            a = 0,
            b = c.getFullYear(),
            f = c.getMonth() + 1,
            e = c.getDate(),
            n = (Date.UTC(c.getFullYear(), c.getMonth(), c.getDate()) - Date.UTC(1900, 0, 31)) / 864e5;
          for (t = 1900; t < 2101 && n > 0; t++) a = S.lYearDays(t), n -= a;
          n < 0 && (n += a, t--);
          var d = new Date,
            u = !1;
          d.getFullYear() == b && d.getMonth() + 1 == f && d.getDate() == e && (u = !0);
          var s = c.getDay(),
            o = S.nStr1[s];
          0 == s && (s = 7);
          var l = t,
            r = S.leapMonth(t),
            i = !1;
          for (t = 1; t < 13 && n > 0; t++) r > 0 && t == r + 1 && 0 == i ? (--t, i = !0, a = S.leapDays(l)) : a = S.monthDays(l, t), 1 == i && t == r + 1 && (i = !1), n -= a;
          0 == n && r > 0 && t == r + 1 && (i ? i = !1 : (i = !0, --t)), n < 0 && (n += a, --t);
          var p = t,
            y = n + 1,
            h = f - 1,
            v = S.getTerm(l, 3),
            M = S.toGanZhi(l - 4);
          M = h < 2 && e < v ? S.toGanZhi(l - 5) : S.toGanZhi(l - 4);
          var g = S.getTerm(b, 2 * f - 1),
            _ = S.getTerm(b, 2 * f),
            D = S.toGanZhi(12 * (b - 1900) + f + 11);
          e >= g && (D = S.toGanZhi(12 * (b - 1900) + f + 12));
          var x = !1,
            m = "";
          g == e && (x = !0, m = S.lunarTerm[2 * f - 2]), _ == e && (x = !0, m = S.lunarTerm[2 * f - 1]);
          var j = Date.UTC(b, h, 1, 0, 0, 0, 0) / 864e5 + 25567 + 10,
            I = S.toGanZhi(j + e - 1);
          return {
            lYear: l,
            lMonth: p,
            lDay: y,
            animal: S.getAnimal(l),
            yearCn: S.toChinaYear(l),
            monthCn: (i ? "闰" : "") + S.toChinaMonth(p),
            dayCn: S.toChinaDay(y),
            cYear: b,
            cMonth: f,
            cDay: e,
            gzYear: M,
            gzMonth: D,
            gzDay: I,
            isToday: u,
            isLeap: i,
            nWeek: s,
            ncWeek: "星期" + o,
            isTerm: x,
            term: m
          }
        },
        lunar2solar: function(b, f, e, c) {
          var t = S.leapMonth(b);
          S.leapDays(b);
          if (c && t != f) return -1;
          if (2100 == b && 12 == f && e > 1 || 1900 == b && 1 == f && e < 31) return -1;
          var r = S.monthDays(b, f);
          if (b < 1900 || b > 2100 || e > r) return -1;
          for (var a = 0, n = 1900; n < b; n++) a += S.lYearDays(n);
          for (var d = 0, u = !1, n = 1; n < f; n++) d = S.leapMonth(b), u || d <= n && d > 0 && (a += S.leapDays(b), u = !0), a += S.monthDays(b, n);
          c && (a += r);
          var s = Date.UTC(1900, 1, 30, 0, 0, 0),
            o = new Date(864e5 * (a + e - 31) + s),
            l = o.getUTCFullYear(),
            i = o.getUTCMonth() + 1,
            p = o.getUTCDate();
          return S.solar2lunar(l, i, p)
        }
      };
    f.default = S, b.exports = f.default
  }, function(b, f, e) {
    "use strict";
    Object.defineProperty(f, "__esModule", {
      value: !0
    }), f.default = [19416, 19168, 42352, 21717, 53856, 55632, 91476, 22176, 39632, 21970, 19168, 42422, 42192, 53840, 119381, 46400, 54944, 44450, 38320, 84343, 18800, 42160, 46261, 27216, 27968, 109396, 11104, 38256, 21234, 18800, 25958, 54432, 59984, 28309, 23248, 11104, 100067, 37600, 116951, 51536, 54432, 120998, 46416, 22176, 107956, 9680, 37584, 53938, 43344, 46423, 27808, 46416, 86869, 19872, 42416, 83315, 21168, 43432, 59728, 27296, 44710, 43856, 19296, 43748, 42352, 21088, 62051, 55632, 23383, 22176, 38608, 19925, 19152, 42192, 54484, 53840, 54616, 46400, 46752, 103846, 38320, 18864, 43380, 42160, 45690, 27216, 27968, 44870, 43872, 38256, 19189, 18800, 25776, 29859, 59984, 27480, 21952, 43872, 38613, 37600, 51552, 55636, 54432, 55888, 30034, 22176, 43959, 9680, 37584, 51893, 43344, 46240, 47780, 44368, 21977, 19360, 42416, 86390, 21168, 43312, 31060, 27296, 44368, 23378, 19296, 42726, 42208, 53856, 60005, 54576, 23200, 30371, 38608, 19415, 19152, 42192, 118966, 53840, 54560, 56645, 46496, 22224, 21938, 18864, 42359, 42160, 43600, 111189, 27936, 44448, 84835, 37744, 18936, 18800, 25776, 92326, 59984, 27424, 108228, 43744, 41696, 53987, 51552, 54615, 54432, 55888, 23893, 22176, 42704, 21972, 21200, 43448, 43344, 46240, 46758, 44368, 21920, 43940, 42416, 21168, 45683, 26928, 29495, 27296, 44368, 84821, 19296, 42352, 21732, 53600, 59752, 54560, 55968, 92838, 22224, 19168, 43476, 41680, 53584, 62034, 54560], b.exports = f.default
  }, function(b, f, e) {
    "use strict";
    Object.defineProperty(f, "__esModule", {
      value: !0
    }), f.default = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], b.exports = f.default
  }, function(b, f, e) {
    "use strict";
    Object.defineProperty(f, "__esModule", {
      value: !0
    }), f.default = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"], b.exports = f.default
  }, function(b, f, e) {
    "use strict";
    Object.defineProperty(f, "__esModule", {
      value: !0
    }), f.default = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"], b.exports = f.default
  }, function(b, f, e) {
    "use strict";
    Object.defineProperty(f, "__esModule", {
      value: !0
    }), f.default = ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"], b.exports = f.default
  }, function(b, f, e) {
    "use strict";
    Object.defineProperty(f, "__esModule", {
      value: !0
    }), f.default = ["小寒", "大寒", "立春", "雨水", "惊蛰", "春分", "清明", "谷雨", "立夏", "小满", "芒种", "夏至", "小暑", "大暑", "立秋", "处暑", "白露", "秋分", "寒露", "霜降", "立冬", "小雪", "大雪", "冬至"], b.exports = f.default
  }, function(b, f, e) {
    "use strict";
    Object.defineProperty(f, "__esModule", {
      value: !0
    }), f.default = ["9778397bd097c36b0b6fc9274c91aa", "97b6b97bd19801ec9210c965cc920e", "97bcf97c3598082c95f8c965cc920f", "97bd0b06bdb0722c965ce1cfcc920f", "b027097bd097c36b0b6fc9274c91aa", "97b6b97bd19801ec9210c965cc920e", "97bcf97c359801ec95f8c965cc920f", "97bd0b06bdb0722c965ce1cfcc920f", "b027097bd097c36b0b6fc9274c91aa", "97b6b97bd19801ec9210c965cc920e", "97bcf97c359801ec95f8c965cc920f", "97bd0b06bdb0722c965ce1cfcc920f", "b027097bd097c36b0b6fc9274c91aa", "9778397bd19801ec9210c965cc920e", "97b6b97bd19801ec95f8c965cc920f", "97bd09801d98082c95f8e1cfcc920f", "97bd097bd097c36b0b6fc9210c8dc2", "9778397bd197c36c9210c9274c91aa", "97b6b97bd19801ec95f8c965cc920e", "97bd09801d98082c95f8e1cfcc920f", "97bd097bd097c36b0b6fc9210c8dc2", "9778397bd097c36c9210c9274c91aa", "97b6b97bd19801ec95f8c965cc920e", "97bcf97c3598082c95f8e1cfcc920f", "97bd097bd097c36b0b6fc9210c8dc2", "9778397bd097c36c9210c9274c91aa", "97b6b97bd19801ec9210c965cc920e", "97bcf97c3598082c95f8c965cc920f", "97bd097bd097c35b0b6fc920fb0722", "9778397bd097c36b0b6fc9274c91aa", "97b6b97bd19801ec9210c965cc920e", "97bcf97c3598082c95f8c965cc920f", "97bd097bd097c35b0b6fc920fb0722", "9778397bd097c36b0b6fc9274c91aa", "97b6b97bd19801ec9210c965cc920e", "97bcf97c359801ec95f8c965cc920f", "97bd097bd097c35b0b6fc920fb0722", "9778397bd097c36b0b6fc9274c91aa", "97b6b97bd19801ec9210c965cc920e", "97bcf97c359801ec95f8c965cc920f", "97bd097bd097c35b0b6fc920fb0722", "9778397bd097c36b0b6fc9274c91aa", "97b6b97bd19801ec9210c965cc920e", "97bcf97c359801ec95f8c965cc920f", "97bd097bd07f595b0b6fc920fb0722", "9778397bd097c36b0b6fc9210c8dc2", "9778397bd19801ec9210c9274c920e", "97b6b97bd19801ec95f8c965cc920f", "97bd07f5307f595b0b0bc920fb0722", "7f0e397bd097c36b0b6fc9210c8dc2", "9778397bd097c36c9210c9274c920e", "97b6b97bd19801ec95f8c965cc920f", "97bd07f5307f595b0b0bc920fb0722", "7f0e397bd097c36b0b6fc9210c8dc2", "9778397bd097c36c9210c9274c91aa", "97b6b97bd19801ec9210c965cc920e", "97bd07f1487f595b0b0bc920fb0722", "7f0e397bd097c36b0b6fc9210c8dc2", "9778397bd097c36b0b6fc9274c91aa", "97b6b97bd19801ec9210c965cc920e", "97bcf7f1487f595b0b0bb0b6fb0722", "7f0e397bd097c35b0b6fc920fb0722", "9778397bd097c36b0b6fc9274c91aa", "97b6b97bd19801ec9210c965cc920e", "97bcf7f1487f595b0b0bb0b6fb0722", "7f0e397bd097c35b0b6fc920fb0722", "9778397bd097c36b0b6fc9274c91aa", "97b6b97bd19801ec9210c965cc920e", "97bcf7f1487f531b0b0bb0b6fb0722", "7f0e397bd097c35b0b6fc920fb0722", "9778397bd097c36b0b6fc9274c91aa", "97b6b97bd19801ec9210c965cc920e", "97bcf7f1487f531b0b0bb0b6fb0722", "7f0e397bd07f595b0b6fc920fb0722", "9778397bd097c36b0b6fc9274c91aa", "97b6b97bd19801ec9210c9274c920e", "97bcf7f0e47f531b0b0bb0b6fb0722", "7f0e397bd07f595b0b0bc920fb0722", "9778397bd097c36b0b6fc9210c91aa", "97b6b97bd197c36c9210c9274c920e", "97bcf7f0e47f531b0b0bb0b6fb0722", "7f0e397bd07f595b0b0bc920fb0722", "9778397bd097c36b0b6fc9210c8dc2", "9778397bd097c36c9210c9274c920e", "97b6b7f0e47f531b0723b0b6fb0722", "7f0e37f5307f595b0b0bc920fb0722", "7f0e397bd097c36b0b6fc9210c8dc2", "9778397bd097c36b0b70c9274c91aa", "97b6b7f0e47f531b0723b0b6fb0721", "7f0e37f1487f595b0b0bb0b6fb0722", "7f0e397bd097c35b0b6fc9210c8dc2", "9778397bd097c36b0b6fc9274c91aa", "97b6b7f0e47f531b0723b0b6fb0721", "7f0e27f1487f595b0b0bb0b6fb0722", "7f0e397bd097c35b0b6fc920fb0722", "9778397bd097c36b0b6fc9274c91aa", "97b6b7f0e47f531b0723b0b6fb0721", "7f0e27f1487f531b0b0bb0b6fb0722", "7f0e397bd097c35b0b6fc920fb0722", "9778397bd097c36b0b6fc9274c91aa", "97b6b7f0e47f531b0723b0b6fb0721", "7f0e27f1487f531b0b0bb0b6fb0722", "7f0e397bd097c35b0b6fc920fb0722", "9778397bd097c36b0b6fc9274c91aa", "97b6b7f0e47f531b0723b0b6fb0721", "7f0e27f1487f531b0b0bb0b6fb0722", "7f0e397bd07f595b0b0bc920fb0722", "9778397bd097c36b0b6fc9274c91aa", "97b6b7f0e47f531b0723b0787b0721", "7f0e27f0e47f531b0b0bb0b6fb0722", "7f0e397bd07f595b0b0bc920fb0722", "9778397bd097c36b0b6fc9210c91aa", "97b6b7f0e47f149b0723b0787b0721", "7f0e27f0e47f531b0723b0b6fb0722", "7f0e397bd07f595b0b0bc920fb0722", "9778397bd097c36b0b6fc9210c8dc2", "977837f0e37f149b0723b0787b0721", "7f07e7f0e47f531b0723b0b6fb0722", "7f0e37f5307f595b0b0bc920fb0722", "7f0e397bd097c35b0b6fc9210c8dc2", "977837f0e37f14998082b0787b0721", "7f07e7f0e47f531b0723b0b6fb0721", "7f0e37f1487f595b0b0bb0b6fb0722", "7f0e397bd097c35b0b6fc9210c8dc2", "977837f0e37f14998082b0787b06bd", "7f07e7f0e47f531b0723b0b6fb0721", "7f0e27f1487f531b0b0bb0b6fb0722", "7f0e397bd097c35b0b6fc920fb0722", "977837f0e37f14998082b0787b06bd", "7f07e7f0e47f531b0723b0b6fb0721", "7f0e27f1487f531b0b0bb0b6fb0722", "7f0e397bd097c35b0b6fc920fb0722", "977837f0e37f14998082b0787b06bd", "7f07e7f0e47f531b0723b0b6fb0721", "7f0e27f1487f531b0b0bb0b6fb0722", "7f0e397bd07f595b0b0bc920fb0722", "977837f0e37f14998082b0787b06bd", "7f07e7f0e47f531b0723b0b6fb0721", "7f0e27f1487f531b0b0bb0b6fb0722", "7f0e397bd07f595b0b0bc920fb0722", "977837f0e37f14998082b0787b06bd", "7f07e7f0e47f149b0723b0787b0721", "7f0e27f0e47f531b0b0bb0b6fb0722", "7f0e397bd07f595b0b0bc920fb0722", "977837f0e37f14998082b0723b06bd", "7f07e7f0e37f149b0723b0787b0721", "7f0e27f0e47f531b0723b0b6fb0722", "7f0e397bd07f595b0b0bc920fb0722", "977837f0e37f14898082b0723b02d5", "7ec967f0e37f14998082b0787b0721", "7f07e7f0e47f531b0723b0b6fb0722", "7f0e37f1487f595b0b0bb0b6fb0722", "7f0e37f0e37f14898082b0723b02d5", "7ec967f0e37f14998082b0787b0721", "7f07e7f0e47f531b0723b0b6fb0722", "7f0e37f1487f531b0b0bb0b6fb0722", "7f0e37f0e37f14898082b0723b02d5", "7ec967f0e37f14998082b0787b06bd", "7f07e7f0e47f531b0723b0b6fb0721", "7f0e37f1487f531b0b0bb0b6fb0722", "7f0e37f0e37f14898082b072297c35", "7ec967f0e37f14998082b0787b06bd", "7f07e7f0e47f531b0723b0b6fb0721", "7f0e27f1487f531b0b0bb0b6fb0722", "7f0e37f0e37f14898082b072297c35", "7ec967f0e37f14998082b0787b06bd", "7f07e7f0e47f531b0723b0b6fb0721", "7f0e27f1487f531b0b0bb0b6fb0722", "7f0e37f0e366aa89801eb072297c35", "7ec967f0e37f14998082b0787b06bd", "7f07e7f0e47f149b0723b0787b0721", "7f0e27f1487f531b0b0bb0b6fb0722", "7f0e37f0e366aa89801eb072297c35", "7ec967f0e37f14998082b0723b06bd", "7f07e7f0e47f149b0723b0787b0721", "7f0e27f0e47f531b0723b0b6fb0722", "7f0e37f0e366aa89801eb072297c35", "7ec967f0e37f14998082b0723b06bd", "7f07e7f0e37f14998083b0787b0721", "7f0e27f0e47f531b0723b0b6fb0722", "7f0e37f0e366aa89801eb072297c35", "7ec967f0e37f14898082b0723b02d5", "7f07e7f0e37f14998082b0787b0721", "7f07e7f0e47f531b0723b0b6fb0722", "7f0e36665b66aa89801e9808297c35", "665f67f0e37f14898082b0723b02d5", "7ec967f0e37f14998082b0787b0721", "7f07e7f0e47f531b0723b0b6fb0722", "7f0e36665b66a449801e9808297c35", "665f67f0e37f14898082b0723b02d5", "7ec967f0e37f14998082b0787b06bd", "7f07e7f0e47f531b0723b0b6fb0721", "7f0e36665b66a449801e9808297c35", "665f67f0e37f14898082b072297c35", "7ec967f0e37f14998082b0787b06bd", "7f07e7f0e47f531b0723b0b6fb0721", "7f0e26665b66a449801e9808297c35", "665f67f0e37f1489801eb072297c35", "7ec967f0e37f14998082b0787b06bd", "7f07e7f0e47f531b0723b0b6fb0721", "7f0e27f1487f531b0b0bb0b6fb0722"], b.exports = f.default
  }, function(b, f, e) {
    "use strict";
    Object.defineProperty(f, "__esModule", {
      value: !0
    }), f.default = ["日", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"], b.exports = f.default
  }, function(b, f, e) {
    "use strict";
    Object.defineProperty(f, "__esModule", {
      value: !0
    }), f.default = ["初", "十", "廿", "卅"], b.exports = f.default
  }, function(b, f, e) {
    "use strict";
    Object.defineProperty(f, "__esModule", {
      value: !0
    }), f.default = ["正", "二", "三", "四", "五", "六", "七", "八", "九", "十", "冬", "腊"], b.exports = f.default
  }, function(b, f, e) {
    "use strict";
    Object.defineProperty(f, "__esModule", {
      value: !0
    }), f.default = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"], b.exports = f.default
  }])
});
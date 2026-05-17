function e (license_code) {
  var g, h, i, j, k, l, m, n, d = "", f = "", o = parseInt;
  d = license_code;
  for (f = "", g = 1; g < d.length; g++)
    f += o(d[g]) ? o(d[g]) : 1;
  for (j = o(f.length / 2),
    k = o(f.substring(0, j + 1)),
    l = o(f.substring(j)),
    g = l - k,
    g < 0 && (g = -g),
    f = g,
    g = k - l,
    g < 0 && (g = -g),
    f += g,
    f *= 2,
    f = "" + f,
    i = 16 / 2 + 2,
    m = "",
    g = 0; g < j + 1; g++)
    for (h = 1; h <= 4; h++)
      n = o(d[g + h]) + o(f[g]),
      n >= i && (n -= i),
      m += n;
  return m
}

export function calcHash(fakeHash, license_code) {
  var h = fakeHash.substring(0, 32), i = e(license_code);
  for (var j = h, k = h.length - 1; k >= 0; k--) {
    for (var l = k, m = k; m < i.length; m++)
      l += parseInt(i[m]);
    for (; l >= h.length; )
      l -= h.length;
    for (var n = "", o = 0; o < h.length; o++)
      n += o == k ? h[l] : o == l ? h[k] : h[o];
    h = n
  }
  return fakeHash.replace(j, h);
}

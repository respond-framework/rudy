// handle redirects from back/next actions, where we want to replace in place
// instead of pushing a new entry to preserve proper movement along history track
export default (function (n, url, curr, tmp) {
  var _tmp$from$location = tmp.from.location,
      entries = _tmp$from$location.entries,
      index = _tmp$from$location.index;

  if (!isNAdjacentToSameUrl(url, curr, n)) {
    var _prevUrl = tmp.from.location.url;
    n = tmp.revertPop ? null : n; // if this back/next movement is due to a user-triggered pop (browser back/next buttons), we don't need to shift the browser history by n, since it's already been done

    return {
      n: n,
      entries: entries,
      index: index,
      prevUrl: _prevUrl
    };
  }

  var newIndex = index + n;
  var prevUrl = entries[newIndex].location.url;
  n = tmp.revertPop ? n : n * 2;
  return {
    n: n,
    entries: entries,
    index: newIndex,
    prevUrl: prevUrl
  };
});

var isNAdjacentToSameUrl = function isNAdjacentToSameUrl(url, curr, n) {
  var entries = curr.entries,
      index = curr.index;
  var loc = entries[index + n * 2];
  return loc && loc.location.url === url;
};

export var findNeighboringN = function findNeighboringN(from, curr) {
  var entries = curr.entries,
      index = curr.index;
  var prev = entries[index - 1];
  if (prev && prev.location.url === from.location.url) return -1;
  var next = entries[index + 1];
  if (next && next.location.url === from.location.url) return 1;
};
//# sourceMappingURL=replacePopAction.js.map
// Capitalize names
function toTitles(s) {
  return s.replace(/\w\S*/g, function(t) { return t.charAt(0).toUpperCase() + t.substr(1).toLowerCase(); });
}

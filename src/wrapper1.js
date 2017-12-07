(function(root, factory) {
  /* ======= Global Wade ======= */
  if(typeof module === "undefined") {
    root.Trie1 = factory();
  } else {
    module.exports = factory();
  }
}(this, function() {
    //=require ../dist/trie1.js
    return Trie1;
}));

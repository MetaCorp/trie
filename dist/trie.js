/**
 * Trie v0.0.7
 * Copyright 2017 Léopold Szabatura
 * Released under the MIT License
 * https://github.com/MetaCorp/trie
 */

(function(root, factory) {
  /* ======= Global Wade ======= */
  if(typeof module === "undefined") {
    root.Trie = factory();
  } else {
    module.exports = factory();
  }
}(this, function() {
    var whitespaceRE = /\s+/g;
    
    var config = {
    }
    
    function bNode(root, word, index) {
      var curr = root
      for(var i = 0, c = null; c = word.charAt(i); i++, prev = curr, curr = curr[c]) {
        curr[c] = {}
      }
      if (!curr.$)
        { curr.$ = [index] }
      else
        { curr.$.push(index) }
      return root
    }
    
    function run(node, cb) {
      for(var k in node) {
        cb(node)
        k !== '$' && run(node[k], cb)
      }
    }
    
    function bTree(words) {
      var this$1 = this;
    
      this.words = []
      this.root = {}
      for(var i = 0; i < words.length; i++) {
        this$1.addWord(words[i])
      }
    }
    
    bTree.prototype.addWord = function (word) {
      var prev = this.root
      var j = 0
      for(curr = prev; curr = curr[word.charAt(j)]; j++, prev = curr) {}
      bNode(prev, word.substr(j), this.words.length)
      this.words.push(word)
    }
    
    bTree.prototype.search = function (str) {
      var this$1 = this;
    
      var res = new Set()
      var prev = this.root
      var j = 0
      for(curr = prev; curr = curr[str.charAt(j)]; j++, prev = curr) {}
      j === str.length && run(prev, function (node) { return node.$ && node.$.forEach(function (i) { return res.add(this$1.words[i]); }); })
      return Array.from(res)
    }
    
    var Trie = bTree
    
    Trie.config = config
    
    Trie.version = "0.0.7"
    
    return Trie;
}));

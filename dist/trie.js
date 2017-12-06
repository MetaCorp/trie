/**
 * Trie v0.0.1
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
    
    function bNode(word, index) {
      if (!word || !word.length) {
        this.value = null
        this.children = []
      }
      else {
        this.value = word[0]
        if (word.length === 1) {
          this.index = index
          this.children = []
        }
        else
          { this.children = [new bNode(word.substr(1), index)] }
      }
    }
    
    bNode.prototype.getChild = function (val) {
      if (val === undefined) { return }
      var ret = this.children.filter(function (n) { return n.value === val; })
      return ret.length ? ret[0] : undefined
    }
    
    bNode.prototype.addChild = function (node) {
      this.children.push(node)
    }
    
    bNode.prototype.run = function (cb) {
      cb(this)
      this.children.forEach(function (node) { return node.run(cb); })
    }
    
    function bTree(words) {
      var this$1 = this;
    
      this.words = []
      this.root = new bNode()
      words && words.forEach(function (word) { return this$1.addWord(word); })
    }
    
    bTree.prototype.addWord = function (word) {
      if (!word || !word.length) { return }
      var index = this.words.length
      this.words.push(word)
      var prev = this.root, i = 0;
      for (var node = prev; node = node.getChild(word.charAt(i)); i++ , prev = node) { }
      if (i >= word.length)
        { prev.index = index }
      else
        { prev.addChild(new bNode(word.substr(i), index)) }
    }
    
    bTree.prototype.search = function (str) {
      var this$1 = this;
    
      var ret = []
      var prev = this.root, i = 0;
      for (var node = prev; node = node.getChild(str.charAt(i)); i++ , prev = node) { }
      i === str.length && prev.run(function (node) { return node.index !== undefined && ret.push(this$1.words[node.index]); })
      return ret
    }
    
    var Trie = bTree
    
    Trie.config = config
    
    Trie.version = "0.0.1"
    
    return Trie;
}));

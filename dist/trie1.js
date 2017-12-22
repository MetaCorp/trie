/**
 * Trie v0.1.1
 * Copyright 2017 Léopold Szabatura
 * Released under the MIT License
 * https://github.com/MetaCorp/trie
 */

(function(root, factory) {
  /* ======= Global Wade ======= */
  if(typeof module === "undefined") {
    root.Trie1 = factory();
  } else {
    module.exports = factory();
  }
}(this, function() {
    var whitespaceRE = /\s+/g
    
    var config = {
      stopWords: [],
      punctuationRE: /[!"',.:;?]/g,
      processors: [
        function (entry) {
          return entry.toLowerCase()
        },
        function (entry) {
          return entry.replace(config.punctuationRE, '')
        },
        function (entry) {
          var stopWords = config.stopWords
          var terms = getTerms(entry)
          var i = terms.length
    
          while ((i--) !== 0)
            { if (stopWords.indexOf(terms[i]) !== -1)
              { terms.splice(i, 1) } }
    
          return terms.join(' ')
        }
      ]
    }
    
    var getTerms = function (entry) {
      if (!entry || !entry.length) { return [] }
      var terms = entry.split(whitespaceRE)
      if (terms[0].length === 0) { terms.shift() }
      if (terms[terms.length - 1].length === 0) { terms.pop() }
      return terms
    }
    
    var processEntry = function (entry) {
      if (entry.length) {
        for (var i = 0, l = config.processors.length; i < l; i++)
          { entry = config.processors[i](entry) }
      }
      return getTerms(entry)
    }
    
    function bNode(word, index) {
      if (!word || !word.length) {
        this.value = null
        this.children = []
      } else {
        this.value = word[0]
        if (word.length === 1) {
          this.addIndex(index)
          this.children = []
        } else
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
    
    bNode.prototype.addIndex = function (index) {
      if (this.indexes)
        { this.indexes.push(index) }
      else
        { this.indexes = [index] }
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
      var wordArray = processEntry(word)
      if (!wordArray.length) { return }
      var index = this.words.length
      var prev = this.root,
        i = 0;
      for (var i = 0, l = wordArray.length; i < l; i++) {
        var word$1 = wordArray[i]
        for (var node = prev; node = node.getChild(word$1.charAt(i)); i++, prev = node) {}
        if (i >= word$1.length)
          { prev.addIndex(index) }
        else
          { prev.addChild(new bNode(word$1.substr(i), index)) }
      }
      this.words.push(word)
    }
    
    bTree.prototype.search = function (str) {
      var this$1 = this;
    
      var strArray = processEntry(str)
      if (!strArray.length) { return [] }
      var ret = new Set()
      for (var i = 0, l = strArray.length; i < l; i++) {
        var str$1 = strArray[i]
        var prev = this$1.root,
          i = 0;
        for (var node = prev; node = node.getChild(str$1.charAt(i)); i++, prev = node) {}
        i === str$1.length &&
          prev.run(function (node) { return node.indexes &&
            node.indexes.forEach(function (index) { return ret.add(this$1.words[index]); }); })
      }
      return Array.from(ret)
    }
    
    var Trie1 = bTree
    
    Trie1.config = config
    
    Trie1.version = "0.1.1"
    
    return Trie1;
}));

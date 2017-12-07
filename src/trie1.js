const whitespaceRE = /\s+/g

const config = {
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
      const stopWords = config.stopWords
      const terms = getTerms(entry)
      var i = terms.length

      while ((i--) !== 0)
        if (stopWords.indexOf(terms[i]) !== -1)
          terms.splice(i, 1)

      return terms.join(' ')
    }
  ]
}

const getTerms = function (entry) {
  if (!entry || !entry.length) return []
  const terms = entry.split(whitespaceRE)
  if (terms[0].length === 0) terms.shift()
  if (terms[terms.length - 1].length === 0) terms.pop()
  return terms
}

const processEntry = function (entry) {
  if (entry.length) {
    for (let i = 0, l = config.processors.length; i < l; i++)
      entry = config.processors[i](entry)
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
      this.children = [new bNode(word.substr(1), index)]
  }
}

bNode.prototype.getChild = function (val) {
  if (val === undefined) return
  const ret = this.children.filter(n => n.value === val)
  return ret.length ? ret[0] : undefined
}

bNode.prototype.addChild = function (node) {
  this.children.push(node)
}

bNode.prototype.addIndex = function (index) {
  if (this.indexes)
    this.indexes.push(index)
  else
    this.indexes = [index]
}

bNode.prototype.run = function (cb) {
  cb(this)
  this.children.forEach(node => node.run(cb))
}

function bTree(words) {
  this.words = []
  this.root = new bNode()
  words && words.forEach(word => this.addWord(word))
}

bTree.prototype.addWord = function (word) {
  const wordArray = processEntry(word)
  if (!wordArray.length) return
  const index = this.words.length
  var prev = this.root,
    i = 0;
  for (var i = 0, l = wordArray.length; i < l; i++) {
    const word = wordArray[i]
    for (var node = prev; node = node.getChild(word.charAt(i)); i++, prev = node) {}
    if (i >= word.length)
      prev.addIndex(index)
    else
      prev.addChild(new bNode(word.substr(i), index))
  }
  this.words.push(word)
}

bTree.prototype.search = function (str) {
  const strArray = processEntry(str)
  if (!strArray.length) return []
  const ret = new Set()
  for (var i = 0, l = strArray.length; i < l; i++) {
    const str = strArray[i]
    var prev = this.root,
      i = 0;
    for (var node = prev; node = node.getChild(str.charAt(i)); i++, prev = node) {}
    i === str.length &&
      prev.run(node => node.indexes &&
        node.indexes.forEach(index => ret.add(this.words[index])))
  }
  return Array.from(ret)
}

const Trie1 = bTree

Trie1.config = config

Trie1.version = "__VERSION__"

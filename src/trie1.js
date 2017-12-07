const whitespaceRE = /\s+/g;

const config = {
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
  if (!word || !word.length) return
  const index = this.words.length
  this.words.push(word)
  var prev = this.root,
    i = 0;
  const wordArray = word.toLowerCase().split(' ')
  wordArray.forEach(word => {
    for (var node = prev; node = node.getChild(word.charAt(i)); i++, prev = node) {}
    if (i >= word.length)
      prev.addIndex(index)
    else
      prev.addChild(new bNode(word.substr(i), index))
  })
}

bTree.prototype.search = function (str) {
  const ret = new Set()
  const strArray = str.toLowerCase().split(' ')
  strArray.forEach(str => {
    var prev = this.root,
      i = 0;
    for (var node = prev; node = node.getChild(str.charAt(i)); i++, prev = node) {}
    i === str.length &&
      prev.run(node => node.indexes &&
        node.indexes.forEach(index => ret.add(this.words[index])))
  })
  return Array.from(ret)
}

const Trie = bTree

Trie.config = config

Trie.version = "__VERSION__"

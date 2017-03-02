#!/usr/bin/env node

module.exports = pbpastehtml

var osascript = require('node-osascript')
var path = require('path')
var sh = require('shelljs')

var NOT_HTML =
  'execution error: Can’t make some data into the expected type. (-1700)'

var pastehtml = 'the clipboard as "HTML"'

if (!module.parent) pbpastehtml()

function pbpastehtml () {
  return osascript.execute(pastehtml, handleRaw)
}

function handleRaw (err, result, buf) {
  if (err && err.message.indexOf(NOT_HTML) > -1) return output('')
  if (err) return console.error(new Error(err.message).stack)

  var raw = buf.toString('utf8')
  var html = unpack(raw)

  return output(html)
}

function unpack (raw) {
  var needle = '«data HTML'
  var end = '»'
  raw = raw.substring(raw.indexOf(needle) + needle.length, raw.indexOf(end))
  var unpacked = Buffer.from(raw, 'hex').toString('utf8')
  return unpacked
}

function output (html) {
  var dest = process.argv[2]
  if (dest) sh.ShellString(html).to(path.resolve(process.cwd(), dest))
  else process.stdout.write(html)
}

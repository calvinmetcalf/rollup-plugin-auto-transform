import { createFilter} from 'rollup-pluginutils';
import {readdir as _readdir, readFile as _readFile} from 'fs';
import {dirname, join} from 'path';
import duplexify from 'duplexify';
import {PassThrough} from 'stream';
import _nodeResolve from 'resolve';
import 'babel-polyfill';
function readdir(dir) {
  return new Promise((yes, no)=>
    _readdir(dir, (err, resp) => {
      if (err) {
        return no(err);
      }
      yes(resp);
    })
  )
}
function nodeResolve(file, basedir) {
  return new Promise((yes, no)=>
    _nodeResolve(file, {basedir}, (err, resp) => {
      if (err) {
        return no(err);
      }
      yes(resp);
    })
  )
}
function readFile(path) {
  return new Promise((yes, no)=>
    _readFile(path, {
      encoding: 'utf8'
    },(err, resp) => {
      if (err) {
        return no(err);
      }
      yes(resp);
    })
  )
}
async function getPackageDir(id, filter, cache) {
  var dir = dirname(id);
  var dirs = [dir];
  var out;
  while (true) {
    if (!dir || !filter(dir)) {
      break;
    }
    if (cache.has(dir)) {
      out = cache.get(dir);
      dirs.pop();
      break;
    }
    let files = await readdir(dir);
    if (files.some(file => file === 'package.json')) {
      out = dir;
      break;
    }
    dir = dirname(dir);
    dirs.push(dir);
  }
  for (let dir of dirs) {
    cache.set(dir, out);
  }
  return out;
}
async function getPackage(dir, cache) {
  if (cache.has(dir)) {
    return cache.get(dir);
  }
  try {
    let pack = await readFile(join(dir, 'package.json'));
    let out = JSON.parse(pack);
    cache.set(dir, out);
    return out;
  } catch (e) {
    cache.set(dir, false);
    return;
  }
}
async function loadTransforms(transforms, baseDir) {
  var out = [];
  for (let transform of transforms) {
    if (Array.isArray(transform)) {
      let filepath = await nodeResolve(transform[0], baseDir);
      let tr = require(filepath);
      out.push(file=>wrapStream(tr(file, transform[1])));
    } else {
      let filepath = await nodeResolve(transform, baseDir);
      let tr = require(filepath);
      out.push(file=>wrapStream(tr(file)));
    }
  }
  return out;
}
function drainStream(makeStream, code, id) {
  return new Promise((yes, no) =>{
    let stream = makeStream(id);
    var out = '';
    stream.on('data', d=> out += d.toString());
    stream.on('error', no);
    stream.on('end', ()=>yes(out));
    stream.end(code);
  });
}
function wrapStream(tr) {
  if (typeof tr.read === 'function') {
    return tr;
  }
  var input = new PassThrough();
  var output = new PassThrough();
  input.pipe(tr).pipe(output);
  return duplexify(input, output);
}
export default (options = {}) => {
  var basedir = options.basedir || process.cwd();
  options.include = options.include || ['node_modules/**'];
  var filter = createFilter(options.include, options.exclude);
  var packCache = new Map();
  var dirCache = new Map();
  return {
    async transform (code, id) {
      if (!filter(id)) {
        return null;
      }
      let packDir = await getPackageDir(id, filter, dirCache);
      if (!packDir) {
        return null;
      }
      let pack = await getPackage(packDir, packCache);
      if (!pack || !pack.browserify || !pack.browserify.transform) {
        return null;
      }
      let transforms = await loadTransforms(pack.browserify.transform, packDir);
      for (let trans of transforms) {
      //  console.log('cal', code, id);
        if (!trans) {
          continue;
        }
        let tempCode = await drainStream(trans, code, id);
        if (tempCode) {
          code = tempCode;
        }
      }
      return code;
    }
  }
}

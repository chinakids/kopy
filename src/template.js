import asyncEach from 'async.each'
import match from 'multimatch'
import isBinaryPath from 'is-binary-path'

export default ({
  skipInterpolation,
  template = require('jstransformer-lodash'),
  templateOptions
} = {}) => {
  return (files, metalsmith, done) => {
    const keys = Object.keys(files)
    let matchedFile
    if (skipInterpolation) {
      if (typeof skipInterpolation === 'function') {
        matchedFile = skipInterpolation
      } else {
        const matches = match(keys, skipInterpolation)
        matchedFile = file => matches.indexOf(file) !== -1
      }
    }

    asyncEach(keys, run, done)

    function run(file, done) {
      const content = files[file].contents.toString()

      const shouldSkip = matchedFile && matchedFile(file, content)

      // we skip unmathed files (by multimatch or your own function)
      // and binary files
      if (shouldSkip || isBinaryPath(file)) {
        return done()
      }

      const res = require('jstransformer')(template).render(content, templateOptions, metalsmith.metadata().merged)
      files[file].contents = new Buffer(res.body)
      done()
    }
  }
}

const { execSync } = require('child_process')

// This is based on circle-github-bot and should be changed
exports.curl = function curl (url, params = '') {
  return execSync(
    `curl -L --silent ${params} "${url}"`,
    {
      stdio: 'ignore',
      encoding: 'utf8',
      maxBuffer: 50 * 1024 * 1024
    }
    ).toString('utf8').trim()
}

const { resolve } = require('path')
const { Bot } = require('./bot')
const { parseFile } = require('./coverage/parse')
const { format } = require('./coverage/format')

exports.formatComment = function ({
  formatted: { status, changed, folders },
  baseArtifactUrl,
  buildNum,
  buildUrl,
  priorBuildNum,
  priorBuildUrl,
  branch,
  verbose
}) {
  return `
**[Code Coverage](${baseArtifactUrl}/index.html): ${status}** 
${verbose ? changed : ''}
<details>
<summary><strong>🗂 Folder Coverage</strong></summary>
${folders}
</details>
<p>

From **Circle CI [build ${buildNum}](${buildUrl})** ${
    priorBuildNum
      ? `compared to [build ${priorBuildNum}](${priorBuildUrl}) (from \`${branch}\` branch)`
      : ''
  }`
}

exports.postComment = function postComment ({
  coverageJsonFilename = 'coverage/coverage-final.json',
  coverageHtmlRoot = 'coverage/lcov-report',
  defaultBaseBranch = 'master',
  root = process.cwd(),
  verbose = true
}) {
  const bot = Bot.create()

  const coverage = parseFile(root, resolve(root, coverageJsonFilename))

  const branch = bot.getBaseBranch(defaultBaseBranch)
  const { priorCoverage, priorBuild } = bot.getPriorBuild(
    branch,
    coverageJsonFilename
  )

  if (!priorCoverage) {
    console.log(`No prior coverage found`)
  }

  const baseArtifactUrl = bot.artifactUrl(`/${coverageHtmlRoot}`)
  const text = exports.formatComment({
    formatted: format(coverage, priorCoverage, baseArtifactUrl),
    baseArtifactUrl,
    buildNum: process.env.CIRCLE_BUILD_NUM,
    buildUrl: process.env.CIRCLE_BUILD_URL,
    priorBuildNum: priorBuild,
    priorBuildUrl: process.env.CIRCLE_BUILD_URL.replace(
      /\/\d+$/,
      `/${priorBuild}`
    ),
    branch,
    verbose
  })

  const result = JSON.parse(bot.comment(text))
  return result && result.html_url
}

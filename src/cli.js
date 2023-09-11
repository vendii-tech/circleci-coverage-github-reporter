#!/usr/bin/env node

const args = require('args')

args
  .option(
    ['j', 'coverage-json'],
    'Relative path to istanbul coverage JSON',
    'coverage/coverage-final.json'
  )
  .option(
    ['r', 'coverage-root'],
    'Relative path to coverage html root (for artifact links)',
    'coverage/lcov-report'
  )
  .option(['b', 'branch'], 'Base branch to use if not PR', 'master')
  .option(['v', 'verbose'], 'Verbose comments will be posted', 'true')

const { coverageJson, coverageHtml, branch, verbose } = args.parse(
  process.argv
)

const { postComment } = require('./github-comment')

try {
  const params = {
    root: process.cwd(),
    coverageJsonFilename: coverageJson,
    coverageHtmlRoot: coverageHtml,
    defaultBaseBranch: branch,
    verbose: verbose === 'true'
  }
  const url = postComment(params)
  console.log('Posted to ', url)
} catch (err) {
  console.error(err)
}

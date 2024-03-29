import fs from 'fs'
import path from 'path'
import gulp from 'gulp'
import { env } from '@shared/environment'
import { watch } from '../utils/watch'
import { watchViews } from '../utils/watchViews'
import { watchComponents } from '../utils/watchComponents'
import { resolveSource } from '@shared/resolveSource'
import { resolveOutput } from '@shared/resolveOutput'
import {
  compiler,
  devCompiler,
  vendorCompiler,
  devVendorCompiler,
} from '../compilers/scriptCompilers'

const sourceDir = resolveSource(env.scripts.sourceDir)
const sourcePagesDir = resolveSource(env.scripts.sourcePagesDir)
const sourceVendorDir = resolveSource(env.scripts.sourceVendorDir)
const sourceComponentsDir = resolveSource(env.components.sourceDir)
const outputDir = resolveOutput(env.scripts.outputDir)
const outputPagesDir = resolveOutput(env.scripts.outputPagesDir)
const outputVendorDir = resolveOutput(env.scripts.outputVendorDir)
const scriptsGlob = path.join(sourceDir, '*.js')
const scriptsPagesGlob = path.join(sourcePagesDir, '*.js')
const scriptsVendorGlob = path.join(sourceVendorDir, '*.js')
const scriptsComponentsGlob = path.join(sourceComponentsDir, '**', '*.js')

/**
 *
 */
gulp.task('build:scripts', (done) => {
  gulp.series(
    compiler(scriptsGlob, outputDir),
    compiler(scriptsPagesGlob, outputPagesDir),
    vendorCompiler(scriptsVendorGlob, outputVendorDir)
  )(done)
})

/**
 *
 */
gulp.task('start:scripts', () => {
  const fn = devCompiler(scriptsGlob, outputDir)
  const fnPages = devCompiler(scriptsPagesGlob, outputPagesDir)
  const fnVendor = devVendorCompiler(scriptsVendorGlob, outputVendorDir)

  fn.displayName = '[scripts]: compile scripts'

  fnPages.displayName = '[scripts]: compile pages scripts'

  fnVendor.displayName = '[scripts]: compile vendors'

  watch(scriptsGlob, gulp.series(fn, fnPages))

  watch(scriptsVendorGlob, fnVendor)

  watchViews(scriptsPagesGlob, (pageName, pagePath) => {
    const fnPage = devCompiler(pagePath, outputPagesDir)
    fnPage.displayName = `[scripts]: compile ${pageName} page`
    return fnPage
  })

  watchComponents(scriptsComponentsGlob, (pageName, componentName) => {
    if (pageName === 'global') {
      return fn
    }

    const pagePath = path.join(sourcePagesDir, `${pageName}.js`)

    if (fs.existsSync(pagePath)) {
      const fnPage = devCompiler(pagePath, outputDir)

      fnPage.displayName = `[scripts]: compile ${pageName} script by ${componentName} component`

      return fnPage
    }

    throw new Error(`script of "${pageName}" page not found. Path: ${pagePath}`)
  })
})

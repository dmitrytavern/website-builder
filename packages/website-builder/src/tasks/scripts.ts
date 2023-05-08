import path from 'path'
import gulp from 'gulp'
import { env } from '@shared/environment'
import { watch } from '../watchers/watch'
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
const outputDir = resolveOutput(env.scripts.outputDir)
const outputPagesDir = resolveOutput(env.scripts.outputPagesDir)
const outputVendorDir = resolveOutput(env.scripts.outputVendorDir)
const scriptsGlob = path.join(sourceDir, '*.js')
const scriptsPagesGlob = path.join(sourcePagesDir, '*.js')
const scriptsVendorGlob = path.join(sourceVendorDir, '*.js')

const scriptsCompilerGlob = [
  scriptsGlob,
  `!${scriptsPagesGlob}`,
  `!${scriptsVendorGlob}`,
]

const scriptsPageCompilerGlob = [
  `!${scriptsGlob}`,
  scriptsPagesGlob,
  `!${scriptsVendorGlob}`,
]

const scriptsVendorCompilerGlob = [
  `!${scriptsGlob}`,
  scriptsVendorGlob,
  `!${scriptsPagesGlob}`,
]

/**
 *
 */
export const build: gulp.TaskFunction = (done) => {
  gulp.series(
    compiler(scriptsCompilerGlob, outputDir),
    compiler(scriptsPageCompilerGlob, outputPagesDir),
    vendorCompiler(scriptsVendorCompilerGlob, outputVendorDir)
  )(done)
}

/**
 *
 */
export const start: gulp.TaskFunction = () => {
  const fn = devCompiler(scriptsCompilerGlob, outputDir)
  const fnPage = devCompiler(scriptsPageCompilerGlob, outputPagesDir)
  const fnVendor = devVendorCompiler(scriptsVendorCompilerGlob, outputVendorDir)

  watch(scriptsCompilerGlob, fn)
  watch(scriptsPageCompilerGlob, fnPage)
  watch(scriptsVendorCompilerGlob, fnVendor)
}
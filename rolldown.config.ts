import type {Plugin} from 'rolldown'
import type {MinifyOptions} from 'terser'

import fs from 'fs-extra'
import {defineConfig} from 'rolldown'
import {dts} from 'rolldown-plugin-dts'
import {minify} from 'terser'

type PackageJson = {
  dependencies?: Record<string, string>
  description?: string
  license?: string
  name?: string
  repository?: {
    type?: string
    url?: string
  } | string
  version?: string
}

const packageJson = await fs.readJson('package.json') as PackageJson
const runtimeDependencies = Object.keys(packageJson.dependencies ?? {})
const githubRepository = (() => {
  const value = typeof packageJson.repository === 'string' ? packageJson.repository : packageJson.repository?.url
  if (!value) {
    return
  }
  const match = /github\.com[/:]([^/]+\/[^/]+?)(?:\.git)?$/u.exec(value)
  return match?.[1]
})()
const laxDependencies = Object.fromEntries(Object.entries(packageJson.dependencies ?? {}).map(([name, version]) => [
  name,
  /^\d+\.\d+\.\d+$/u.test(version) ? `^${version}` : version,
]))
const terserOptions: MinifyOptions = {
  module: true,
  toplevel: true,
  ecma: 2020,
  compress: {
    passes: 100,
    unsafe_comps: true,
    unsafe_math: true,
    unsafe_regexp: true,
    unsafe_undefined: true,
    unsafe_Function: true,
    unsafe_methods: true,
    unsafe_proto: true,
    pure_new: true,
  },
  format: {
    semicolons: false,
  },
}
const aggressiveTerser = (): Plugin => ({
  name: 'terser-aggressive',
  generateBundle: {
    order: 'post',
    async handler(_options, bundle) {
      await Promise.all(Object.values(bundle).map(async output => {
        if (output.type !== 'chunk' || /\.d\.[cm]?ts$/u.test(output.fileName)) {
          return
        }
        const result = await minify(output.code, terserOptions)
        if (!result.code) {
          throw new Error(`Terser did not emit code for ${output.fileName}.`)
        }
        output.code = result.code
        output.map = null
      }))
    },
  },
})
const packageFiles = (): Plugin => ({
  name: 'package-files',
  async generateBundle() {
    const [license, readme] = await Promise.all([
      fs.readFile('license.txt', 'utf8'),
      fs.readFile('readme.md', 'utf8'),
    ])
    const outputPackageJson = {
      ...githubRepository ? {
        bugs: {
          url: `https://github.com/${githubRepository}/issues`,
        },
      } : {},
      dependencies: laxDependencies,
      description: packageJson.description,
      ...githubRepository ? {
        homepage: `https://github.com/${githubRepository}#readme`,
      } : {},
      license: packageJson.license ?? 'MIT',
      name: packageJson.name,
      ...githubRepository ? {
        repository: `github:${githubRepository}`,
      } : {},
      version: packageJson.version,
      type: 'module',
      exports: {
        '.': {
          types: './lib.d.ts',
          import: './lib.js',
          default: './lib.js',
        },
      },
      types: './lib.d.ts',
    }
    this.emitFile({
      type: 'asset',
      fileName: 'LICENSE',
      source: license,
    })
    this.emitFile({
      type: 'asset',
      fileName: 'README.md',
      source: readme,
    })
    this.emitFile({
      type: 'asset',
      fileName: 'package.json',
      source: JSON.stringify(outputPackageJson),
    })
  },
})

export default defineConfig({
  input: 'src/main.ts',
  external: runtimeDependencies,
  platform: 'node',
  plugins: [
    dts(),
    aggressiveTerser(),
    packageFiles(),
  ],
  output: {
    dir: 'dist/aubit-schema/production',
    format: 'esm',
    cleanDir: true,
    topLevelVar: true,
    entryFileNames: chunk => (chunk.name.endsWith('.d') ? 'lib.d.ts' : 'lib.js'),
  },
})

export interface Environment {
  /**
   * Specifies the root directory of the entire project.
   * Used in defining all possible paths in scripts.
   */
  root: string

  /**
   * Defines a path relative to the project root that will
   * store all the project source files and that will take
   * part in constructing complete paths for them.
   */
  sourceDir: string

  /**
   * Specifies the output path of the build artifacts relative
   * to the project root.
   */
  outputDir: string

  /**
   * Defines settings for processing html/pug files.
   */
  html: {
    /**
     * Defines a directory path that will store all the project
     * pages.
     */
    sourceDir: string

    /**
     * Specifies the output path of the html build artifacts
     * relative to the project root.
     */
    outputDir: string
  }

  /**
   * Defines settings for processing css/sass/scss files.
   */
  styles: {
    /**
     * Specifies the path to the directory where all global style
     * files will be stored.
     * Note: page files and library files are not included and
     * are specified separately.
     */
    sourceDir: string

    /**
     * Specifies the path to the directory where the style files
     * for the pages will be stored.
     */
    sourcePagesDir: string

    /**
     * Specifies the output path for artifacts that come out of
     * the global styles assembly.
     */
    outputDir: string

    /**
     * Specifies the output path for artifacts that come out of
     * the css assembly for each page.
     */
    outputPagesDir: string
  }
}
declare module 'spark-md5' {
  interface SparkMD5ArrayBuffer {
    append(arr: ArrayBuffer): SparkMD5ArrayBuffer
    end(raw?: boolean): string
    reset(): SparkMD5ArrayBuffer
  }

  interface SparkMD5Static {
    ArrayBuffer: new () => SparkMD5ArrayBuffer
  }

  const SparkMD5: SparkMD5Static
  export default SparkMD5
}

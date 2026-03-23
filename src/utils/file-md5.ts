/**
 * Compute MD5 hash of a File using spark-md5.
 * Reads in chunks to support large files without excessive memory.
 */

import SparkMD5 from 'spark-md5'

const CHUNK_SIZE = 2 * 1024 * 1024 // 2MB

export const computeFileMd5 = async (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const spark = new SparkMD5.ArrayBuffer()
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE)
    let currentChunk = 0

    const fileReader = new FileReader()

    fileReader.onload = (e) => {
      const result = e.target?.result
      if (!result || !(result instanceof ArrayBuffer)) {
        reject(new Error('Failed to read file chunk'))
        return
      }
      spark.append(result)
      currentChunk++

      if (currentChunk < totalChunks) {
        loadNextChunk()
      } else {
        resolve(spark.end())
      }
    }

    fileReader.onerror = () => reject(new Error('Failed to read file'))

    const loadNextChunk = () => {
      const start = currentChunk * CHUNK_SIZE
      const end = Math.min(start + CHUNK_SIZE, file.size)
      fileReader.readAsArrayBuffer(file.slice(start, end))
    }

    if (file.size === 0) {
      resolve(spark.end())
    } else {
      loadNextChunk()
    }
  })

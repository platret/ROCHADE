const retryDelaysMs = [1_000, 3_000, 7_000]

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

export const retryWithBackoff = async <T>(attempt: () => Promise<T>, keepGoing: () => boolean): Promise<T> => {
  for (const delayMs of retryDelaysMs) {
    try {
      return await attempt()
    } catch (error) {
      if (!keepGoing()) throw error
      await sleep(delayMs)
      if (!keepGoing()) throw error
    }
  }
  return attempt()
}

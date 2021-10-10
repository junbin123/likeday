export const getTitleTextInfo = count => {
  if (count < 0 || count > 60) {
    return new Error()
  }
  if (count <= 14) {
    return {
      fontSize: 40,
      rows: 1,
      sliceIndex: count
    }
  }
  if (count <= 18) {
    return {
      fontSize: 30,
      rows: 1,
      sliceIndex: count
    }
  }
  if (count <= 24) {
    return {
      fontSize: 22,
      rows: 1,
      sliceIndex: count
    }
  }
  const sliceIndex = count / 2 === Math.floor(count / 2) ? count / 2 : Math.floor(count / 2) - 1
  if (count <= 44) {
    return {
      fontSize: 24,
      rows: 2,
      sliceIndex
    }
  }
  if (count <= 52) {
    return {
      fontSize: 20,
      rows: 2,
      sliceIndex
    }
  }
  return {
    fontSize: 18,
    rows: 2,
    sliceIndex
  }
}

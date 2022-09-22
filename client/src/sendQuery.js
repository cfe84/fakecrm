export default function sendQueryAsync(url, method = "GET", body = undefined, headers = {}) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest()
    request.onreadystatechange = function () {
      if (this.readyState === 4) {
        try {
          resolve(this.responseText)
        } catch (err) {
          reject(Error(this.responseText))
        }
      }
    }
    request.open(method, `/api/${url}`, true)
    Object.keys(headers).forEach(header => {
      request.setRequestHeader(header, headers[header])
    })
    if (body) {
      request.setRequestHeader("content-type", "application/json")
    }
    request.send(body ? JSON.stringify(body) : undefined)
  })
}
interface IRequest {
    name: string,
    value: string
}

const createRequest = (request: IRequest[]) => {
    let ret = "?"
    request.map((value, index) => value.name + "=" + value.value + ((index < request.length - 1) ? ("&") : ""))
        .forEach(x => ret = ret.concat(x))
    return ret
}

const headers = { headers: { method: "GET", Accept: 'application/json' } }
const httpString: "http://127.0.0.1:4000/api/" = "http://127.0.0.1:4000/api/"

export { headers, httpString, IRequest, createRequest }

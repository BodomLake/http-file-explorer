import service from "./axios.config";

const RequestMethod = {
  GET: 'get',
  DELETE: 'delete',
  UPDATE: 'update',
  POST: 'post',
}

export function getReq(url, queryParams) {
  return service({
    url: url,
    method: RequestMethod.GET,
    params: queryParams
  })
}

// 表单请求
export function postFormReq(url, queryParams) {
  return service({
    url: url,
    method: RequestMethod.POST,
    params: queryParams
  })
}

// POST 请求体
export function postObjReq(url, queryParams) {
  return service({
    url: url,
    method: RequestMethod.POST,
    data: queryParams
  })
}

// DELETE 请求体删除
export function delReq(url, queryParams) {
  return service({
    url: url,
    method: RequestMethod.DELETE,
    data: queryParams
  })
}

// update 表单更新
export function updateFormReq(url, queryParams) {
  return service({
    url: url,
    method: RequestMethod.UPDATE,
    query: queryParams
  })
}

// update 请求体更新
export function updateObjReq(url, queryParams) {
  return service({
    url: url,
    method: RequestMethod.UPDATE,
    data: queryParams
  })
}





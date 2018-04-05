import request from '../utils/request.js';

export function login() {	
  return request('test');
}

export function queryDataLocal(params) {
  return request('test', {
    method: 'POST',
    body: params,
  });
}
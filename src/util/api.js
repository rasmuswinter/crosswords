// todo: use fetch-ponyfill?

// import fetchPonyfill from 'fetch-ponyfill';
// import Promise from 'bluebird';
//
// const {fetch, Request, Response, Headers} = fetchPonyfill({ Promise });

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    let error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}

const jsonHeaders = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
};

export const client = {
  get: url => fetch(url).then(checkStatus),
  post: (url, data) => fetch(url, {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(data)
    }).then(checkStatus),
  put: (url, data) => fetch(url, {
      method: 'PUT',
      headers: jsonHeaders,
      body: JSON.stringify(data)
    }).then(checkStatus)
};

export default {
  fetchCrossword: id => client.get('/api/crossword/' + id)
};
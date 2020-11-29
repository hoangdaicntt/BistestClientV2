import {EventEmitter} from 'events';

export const environment = {
  production: true,
  // host: 'http://127.0.0.1:3000/api',
  host: (location.origin + '/api'),
  user: {
    authed: false,
    username: '',
    password: '',
    authChange: new EventEmitter()
  }
};

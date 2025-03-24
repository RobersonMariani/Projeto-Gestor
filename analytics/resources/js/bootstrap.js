import axios from 'axios';
import Auth from './auth';

window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

Auth.init();


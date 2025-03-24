import axios from 'axios';

const TOKEN_KEY = 'token';

const Auth = {
    // Salva o token no localStorage e define o header do axios
    setToken(token) {
        localStorage.setItem(TOKEN_KEY, token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    },

    // Recupera o token atual
    getToken() {
        return localStorage.getItem(TOKEN_KEY);
    },

    // Verifica se está autenticado
    isAuthenticated() {
        return !!this.getToken();
    },

    // Remove token e limpa headers
    logout() {
        localStorage.removeItem(TOKEN_KEY);
        delete axios.defaults.headers.common['Authorization'];
    },

    // Inicializa o header do axios
    init() {
        const token = this.getToken();
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    }
};

export default Auth;

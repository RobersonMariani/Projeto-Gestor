import Auth from './auth';

document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');

    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        try {
            const response = await axios.post('/api/login', {
                email,
                password
            });

            const token = response.data.access_token;

            Auth.setToken(token); // <- agora usa o helper

            window.location.href = '/gestores/dashboard-ocorrencias';
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            let code = error.response?.status;
            loginError.classList.remove('d-none');
            loginError.textContent =
                code === 401
                    ? 'E-mail ou senha incorretos.'
                    : error.response?.data?.error || 'Erro ao tentar logar.';
        }
    });
});

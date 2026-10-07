import { useState } from 'react';

import { api } from '../../services/api';
import '../Login/styles.css';
import './styles.css';

export function Cadastro({ onLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [registeredUser, setRegisteredUser] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !password || !passwordConfirmation) {
      setError('Preencha todos os campos para criar sua conta.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Digite um endereço de e-mail válido.');
      return;
    }

    if (password.length < 8) {
      setError('Sua senha precisa ter pelo menos 8 caracteres.');
      return;
    }

    if (password !== passwordConfirmation) {
      setError('As senhas não conferem. Verifique e tente novamente.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/users', {
        name: name.trim(),
        email: email.trim(),
        password,
      });
      setRegisteredUser(data);
    } catch (requestError) {
      const status = requestError.response?.status;
      const backendError = requestError.response?.data?.error;
      const backendMessage = requestError.response?.data?.message;

      if (status === 429) {
        setError(
          'Muitas tentativas de cadastro. Aguarde alguns minutos e tente novamente.'
        );
      } else if (
        backendMessage === 'Email is already registered' ||
        backendError === 'Email is already registered'
      ) {
        setError('Este e-mail já está cadastrado. Tente entrar na sua conta.');
      } else if (Array.isArray(backendError)) {
        setError(backendError.join(' '));
      } else if (backendError) {
        setError(backendError);
      } else if (requestError.response) {
        setError('Não foi possível criar sua conta. Tente novamente.');
      } else {
        setError(
          'Não conseguimos conectar ao servidor. Confira sua conexão e tente novamente.'
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page registration-page">
      <section
        className="login-story registration-story"
        aria-label="Sobre o Sorteio"
      >
        <a className="brand" href="#inicio" aria-label="Sorteio, início">
          <span className="brand-mark" aria-hidden="true">
            <span>so</span>
          </span>
          <span className="brand-name">
            sorteio<span>.</span>
          </span>
        </a>

        <div className="story-content">
          <span className="story-eyebrow">
            <span className="eyebrow-dot" /> UM NOVO COMEÇO, UMA NOVA CHANCE
          </span>
          <h1>
            Seu próximo
            <br />
            sorteio <span>começa aqui.</span>
          </h1>
          <p>
            Crie sua conta e deixe a organização dos seus sorteios com a gente.
          </p>
          <div className="registration-art" aria-hidden="true">
            <div className="registration-ticket">
              <span className="registration-ticket-label">
                SUA PRÓXIMA RODADA
              </span>
              <div className="registration-balls">
                <span>7</span>
                <span>12</span>
                <span>24</span>
              </div>
              <span className="registration-ticket-caption">
                Um cadastro. Muitas possibilidades.
              </span>
            </div>
            <span className="registration-spark registration-spark-one">✳</span>
            <span className="registration-spark registration-spark-two">✦</span>
          </div>
        </div>

        <p className="story-footer">
          Sorteios de um jeito simples. <span>✳</span> Feitos pra todo mundo.
        </p>
      </section>

      <section className="login-panel registration-panel">
        <div className="mobile-brand brand" aria-label="Sorteio">
          <span className="brand-mark" aria-hidden="true">
            <span>so</span>
          </span>
          <span className="brand-name">
            sorteio<span>.</span>
          </span>
        </div>

        <div className="login-card registration-card">
          {registeredUser ? (
            <div className="welcome-card" role="status">
              <span className="welcome-icon" aria-hidden="true">
                ✓
              </span>
              <span className="form-eyebrow">CADASTRO CONCLUÍDO</span>
              <h2>Boas-vindas, {registeredUser.name}!</h2>
              <p>
                Sua conta foi criada. Entre com seu e-mail e sua senha para
                continuar.
              </p>
              <div className="account-detail">
                <span>Conta criada para</span>
                <strong>{registeredUser.email}</strong>
              </div>
              <button
                className="submit-button"
                type="button"
                onClick={() => onLogin(registeredUser.email)}
              >
                Ir para o login <span aria-hidden="true">→</span>
              </button>
            </div>
          ) : (
            <>
              <div className="form-heading registration-heading">
                <span className="form-eyebrow">VAMOS COMEÇAR?</span>
                <h2>
                  Crie sua conta<span>.</span>
                </h2>
                <p>Leva só um minutinho para começar.</p>
              </div>

              <form
                className="login-form registration-form"
                onSubmit={handleSubmit}
                noValidate
              >
                <label className="field-label" htmlFor="register-name">
                  Nome
                </label>
                <div className="input-wrap">
                  <span className="input-icon" aria-hidden="true">
                    ✳
                  </span>
                  <input
                    id="register-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Como podemos te chamar?"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                  />
                </div>

                <label
                  className="field-label registration-label"
                  htmlFor="register-email"
                >
                  E-mail
                </label>
                <div className="input-wrap">
                  <span className="input-icon" aria-hidden="true">
                    @
                  </span>
                  <input
                    id="register-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="voce@exemplo.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </div>

                <label
                  className="field-label registration-label"
                  htmlFor="register-password"
                >
                  Senha
                </label>
                <div className="input-wrap">
                  <span className="input-icon" aria-hidden="true">
                    ⌑
                  </span>
                  <input
                    id="register-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Pelo menos 8 caracteres"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    minLength={8}
                    required
                  />
                  <button
                    className="toggle-password"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? 'Ocultar senhas' : 'Mostrar senhas'
                    }
                  >
                    {showPassword ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>

                <label
                  className="field-label registration-label"
                  htmlFor="register-password-confirmation"
                >
                  Confirme sua senha
                </label>
                <div className="input-wrap">
                  <span className="input-icon" aria-hidden="true">
                    ⌑
                  </span>
                  <input
                    id="register-password-confirmation"
                    name="passwordConfirmation"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Digite sua senha novamente"
                    value={passwordConfirmation}
                    onChange={(event) =>
                      setPasswordConfirmation(event.target.value)
                    }
                    required
                  />
                </div>

                {error && (
                  <p className="form-error" role="alert">
                    {error}
                  </p>
                )}

                <button
                  className="submit-button registration-submit"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="button-spinner" />
                      Criando conta...
                    </>
                  ) : (
                    <>
                      Criar minha conta <span aria-hidden="true">→</span>
                    </>
                  )}
                </button>
              </form>

              <p className="signup-note registration-login-note">
                Já tem uma conta?{' '}
                <button type="button" onClick={() => onLogin()}>
                  Entrar
                </button>
              </p>
              <div className="secure-note">
                <span aria-hidden="true">♢</span> Sua senha é protegida e nunca
                é salva neste navegador.
              </div>
            </>
          )}
        </div>

        <footer className="panel-footer">
          <span>© 2026 Sorteio</span>
          <span className="footer-divider">·</span>
          <span>Feito pra transformar o acaso em história.</span>
        </footer>
      </section>
    </main>
  );
}

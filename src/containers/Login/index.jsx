import { useState } from 'react';

import { api } from '../../services/api';
import { obterUsuario, salvarSessao } from '../../services/session';
import './styles.css';

const SAVED_EMAIL_KEY = 'sorteador.email';

function TicketIllustration() {
  return (
    <svg
      className="login-art"
      viewBox="0 0 480 380"
      role="img"
      aria-labelledby="ticket-title"
      fill="none"
    >
      <title id="ticket-title">Uma seleção aleatória de números da sorte</title>
      <circle
        cx="240"
        cy="190"
        r="146"
        stroke="currentColor"
        strokeOpacity=".16"
      />
      <circle
        cx="240"
        cy="190"
        r="111"
        stroke="currentColor"
        strokeOpacity=".18"
        strokeDasharray="2 9"
      />
      <path d="M53 104h374v172H53z" rx="26" fill="#fff" />
      <path d="M53 139h374v137H53V139Z" fill="#F9F8F4" />
      <path
        d="M53 147h374M53 268h374"
        stroke="#E9E6DC"
        strokeWidth="2"
        strokeDasharray="5 8"
      />
      <path d="M53 104h374v172H53z" stroke="#E9E6DC" strokeWidth="2" />
      <text
        x="81"
        y="133"
        fill="#827D70"
        fontSize="11"
        fontWeight="700"
        letterSpacing="2"
      >
        SORTEIO DA RODADA
      </text>
      <circle cx="123" cy="202" r="31" fill="#FDE6D6" />
      <circle cx="240" cy="202" r="31" fill="#E8EFDD" />
      <circle cx="357" cy="202" r="31" fill="#F7EDC9" />
      <text
        x="123"
        y="211"
        textAnchor="middle"
        fill="#D86B3C"
        fontSize="25"
        fontWeight="800"
      >
        7
      </text>
      <text
        x="240"
        y="211"
        textAnchor="middle"
        fill="#587447"
        fontSize="25"
        fontWeight="800"
      >
        12
      </text>
      <text
        x="357"
        y="211"
        textAnchor="middle"
        fill="#9B7925"
        fontSize="25"
        fontWeight="800"
      >
        24
      </text>
      <circle cx="390" cy="79" r="24" fill="#E8774F" />
      <path
        d="m381 79 6 6 12-13"
        stroke="#fff"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m83 300 5 11 12 1-9 8 3 12-11-6-10 6 2-12-9-8 12-1 5-11Z"
        fill="#E2B84F"
      />
      <path
        d="m395 294 4 8 9 1-7 6 2 9-8-5-8 5 2-9-7-6 9-1 4-8Z"
        fill="#92A376"
      />
      <circle cx="96" cy="75" r="4" fill="#E8774F" />
      <circle cx="410" cy="315" r="5" fill="#E2B84F" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="m4 7 8 6 8-6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect
        x="4.5"
        y="10"
        width="15"
        height="11"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M8 10V7a4 4 0 1 1 8 0v3m-4 5v2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Login({ onRegister, onLoginSuccess, initialEmail = '' }) {
  const [email, setEmail] = useState(
    () => initialEmail || localStorage.getItem(SAVED_EMAIL_KEY) || ''
  );
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(
    Boolean(localStorage.getItem(SAVED_EMAIL_KEY))
  );
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(() => {
    return obterUsuario();
  });

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Preencha seu e-mail e sua senha para continuar.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/sessions', {
        email: email.trim(),
        password,
      });

      if (!data.token)
        throw new Error(
          'A resposta do servidor não trouxe um token de acesso.'
        );

      const usuario = { id: data.id, name: data.name, email: data.email };
      salvarSessao(data.token, usuario);
      if (remember) localStorage.setItem(SAVED_EMAIL_KEY, email.trim());
      else localStorage.removeItem(SAVED_EMAIL_KEY);
      setUser(usuario);
    } catch (requestError) {
      const status = requestError.response?.status;
      const backendError = requestError.response?.data?.error;

      if (status === 429) {
        setError(
          'Muitas tentativas de acesso. Aguarde alguns minutos e tente novamente.'
        );
      } else if (backendError === 'Invalid email or password') {
        setError(
          'E-mail ou senha incorretos. Confira seus dados e tente novamente.'
        );
      } else if (Array.isArray(backendError)) {
        setError(backendError.join(' '));
      } else if (backendError) {
        setError(backendError);
      } else if (requestError.response) {
        setError('Não foi possível entrar. Tente novamente.');
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
    <main className="login-page">
      <section className="login-story" aria-label="Sobre o Sorteio">
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
            <span className="eyebrow-dot" /> SEU PRÓXIMO SORTEIO COMEÇA AQUI
          </span>
          <h1>
            Que vença a<br />
            melhor <span>chance.</span>
          </h1>
          <p>Organize seu sorteio com facilidade. A sorte deixa com a gente.</p>
          <TicketIllustration />
        </div>

        <p className="story-footer">
          Sorteios de um jeito simples. <span>✳</span> Feitos pra todo mundo.
        </p>
      </section>

      <section className="login-panel">
        <div className="mobile-brand brand" aria-label="Sorteio">
          <span className="brand-mark" aria-hidden="true">
            <span>so</span>
          </span>
          <span className="brand-name">
            sorteio<span>.</span>
          </span>
        </div>
        <div className="login-card">
          {user ? (
            <div className="welcome-card" role="status">
              <span className="welcome-icon" aria-hidden="true">
                ✓
              </span>
              <span className="form-eyebrow">ACESSO CONFIRMADO</span>
              <h2>Que bom ter você aqui, {user.name}!</h2>
              <p>
                Sua conta está conectada e pronta para seus próximos sorteios.
              </p>
              <div className="account-detail">
                <span>Conta conectada</span>
                <strong>{user.email}</strong>
              </div>
              <button
                className="submit-button"
                type="button"
                onClick={() => onLoginSuccess?.(user)}
              >
                Continuar para o início <span aria-hidden="true">→</span>
              </button>
            </div>
          ) : (
            <>
              <div className="form-heading">
                <span className="form-eyebrow">BOM TER VOCÊ DE VOLTA</span>
                <h2>
                  Entre na sua conta<span>.</span>
                </h2>
                <p>Seu próximo grande momento começa com um login.</p>
              </div>

              <form className="login-form" onSubmit={handleSubmit} noValidate>
                <label className="field-label" htmlFor="email">
                  E-mail
                </label>
                <div className="input-wrap">
                  <span className="input-icon">
                    <MailIcon />
                  </span>
                  <input
                    id="email"
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
                  className="field-label password-label"
                  htmlFor="password"
                >
                  Senha
                </label>
                <div className="input-wrap">
                  <span className="input-icon">
                    <LockIcon />
                  </span>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                  <button
                    className="toggle-password"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? 'Ocultar senha' : 'Mostrar senha'
                    }
                  >
                    {showPassword ? (
                      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                          d="m3 3 18 18M10.6 10.6a2 2 0 0 0 2.8 2.8"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                        />
                        <path
                          d="M9.9 5.2A10.7 10.7 0 0 1 12 5c5.2 0 8.5 5.2 8.5 7s-1.1 3.1-3 4.7M6.2 6.2C3.9 7.7 2.5 10.4 2.5 12S5.8 19 12 19c1.4 0 2.6-.3 3.7-.8"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                          d="M2.5 12S5.8 5 12 5s9.5 7 9.5 7-3.3 7-9.5 7-9.5-7-9.5-7Z"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinejoin="round"
                        />
                        <circle
                          cx="12"
                          cy="12"
                          r="3"
                          stroke="currentColor"
                          strokeWidth="1.7"
                        />
                      </svg>
                    )}
                  </button>
                </div>

                <div className="form-options">
                  <label className="remember-option">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(event) => setRemember(event.target.checked)}
                    />
                    <span className="custom-checkbox" />
                    Lembrar meu e-mail
                  </label>
                  <span
                    className="forgot-link"
                    title="Entre em contato com o suporte para recuperar sua senha"
                  >
                    Esqueceu sua senha?
                  </span>
                </div>

                {error && (
                  <p className="form-error" role="alert">
                    {error}
                  </p>
                )}

                <button
                  className="submit-button"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="button-spinner" />
                      Entrando...
                    </>
                  ) : (
                    <>
                      Entrar na minha conta <span aria-hidden="true">→</span>
                    </>
                  )}
                </button>
              </form>

              <p className="signup-note">
                Ainda não tem uma conta?{' '}
                <button type="button" onClick={onRegister}>
                  Criar minha conta
                </button>
              </p>
              <div className="secure-note">
                <span aria-hidden="true">♢</span> Sua conta está protegida e
                seus dados são privados.
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

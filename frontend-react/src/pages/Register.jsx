
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'No fue posible registrar la cuenta.'
        );
      }

      sessionStorage.setItem('token', data.token);
      sessionStorage.setItem('userName', data.user.name);
      sessionStorage.setItem('userRole', data.user.role);

      navigate('/dashboard', { replace: true });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">

        <div className="brand">
          <span className="brand-icon">▣</span>
          Inventario Fácil
        </div>

        <h1>Crear cuenta</h1>

        <p className="muted">
          Regístrate para comenzar a utilizar Inventario Fácil.
        </p>

        <form onSubmit={handleSubmit}>

          <label htmlFor="name">Nombre</label>
          <input
            id="name"
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={80}
            required
          />

          <label htmlFor="email">Correo electrónico</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            minLength={8}
            maxLength={128}
            required
          />

          {error && (
            <p className="feedback error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading}>
            {loading ? 'Registrando...' : 'Crear cuenta'}
          </button>

        </form>

        <p className="auth-footer">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login">Inicia sesión</Link>
        </p>

      </section>
    </main>
  );
}

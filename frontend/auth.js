const form = document.querySelector('form');
const message = document.querySelector('#message');
if (sessionStorage.getItem('token')) location.replace('/dashboard.html');
form.addEventListener('submit', async e => {
  e.preventDefault();
  const isRegister = form.id === 'register-form';
  const button = form.querySelector('button');
  const payload = { email: document.querySelector('#email').value, password: document.querySelector('#password').value };
  if (isRegister) payload.name = document.querySelector('#name').value;
  button.disabled = true;
  message.textContent = '';
  try {
    const response = await fetch(`/api/auth/${isRegister ? 'register' : 'login'}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'No se pudo completar la solicitud.');
    sessionStorage.setItem('token', data.token);
    sessionStorage.setItem('userName', data.user.name);
    location.replace('/dashboard.html');
  } catch (error) { message.textContent = error.message; }
  finally { button.disabled = false; }
});

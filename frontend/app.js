const token = sessionStorage.getItem('token');
if (!token) location.replace('/');
const $ = selector => document.querySelector(selector);
const tbody = $('#products-body');
const dialog = $('#product-dialog');
let products = [];
let editingId = null;
$('#welcome').textContent = sessionStorage.getItem('userName') || 'Usuario';
$('#logout').addEventListener('click', () => { sessionStorage.clear(); location.replace('/'); });
function showMessage(text, isError = false) {
  $('#message').textContent = text;
  $('#message').classList.toggle('error', isError);
}
async function api(path, options = {}) {
  const res = await fetch(path, {
    ...options, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...options.headers }
  });
  const data = await res.json();
  if (res.status === 401) { sessionStorage.clear(); location.replace('/'); throw new Error('Tu sesión expiró.'); }
  if (!res.ok) throw new Error(data.message || 'Error en la solicitud.');
  return data;
}
function td(text) { const el = document.createElement('td'); el.textContent = text; return el; }
function render() {
  const q = $('#search').value.trim().toLowerCase();
  const filtered = products.filter(p => `${p.name} ${p.category}`.toLowerCase().includes(q));
  tbody.replaceChildren();
  filtered.forEach(product => {
    const tr = document.createElement('tr');
    const titleTd = document.createElement('td');
    const strong = document.createElement('strong'); strong.textContent = product.name;
    const desc = document.createElement('small'); desc.textContent = product.description || 'Sin descripción';
    titleTd.append(strong, desc);
    tr.append(titleTd, td(product.category), td(currency(product.price)), td(product.stock));
    const actions = document.createElement('td');
    const edit = document.createElement('button'); edit.type = 'button'; edit.className = 'link-button'; edit.textContent = 'Editar';
    edit.addEventListener('click', () => openDialog(product));
    const del = document.createElement('button'); del.type = 'button'; del.className = 'link-button danger'; del.textContent = 'Eliminar';
    del.addEventListener('click', () => deleteProduct(product));
    actions.append(edit, del); tr.append(actions); tbody.append(tr);
  });
  $('#empty').hidden = filtered.length !== 0;
  $('#count').textContent = products.length;
  $('#total').textContent = currency(products.reduce((sum, p) => sum + p.price * p.stock, 0));
}
const currency = value => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
async function load() {
  try { products = await api('/api/products'); render(); }
  catch (error) { showMessage(error.message, true); }
}
function openDialog(product = null) {
  editingId = product?._id || null;
  $('#product-form').reset();
  $('#form-message').textContent = '';
  $('#dialog-title').textContent = product ? 'Editar producto' : 'Nuevo producto';
  $('#name').value = product?.name || '';
  $('#description').value = product?.description || '';
  $('#category').value = product?.category || 'General';
  $('#price').value = product?.price ?? '';
  $('#stock').value = product?.stock ?? '';
  dialog.showModal();
}
$('#show-create').addEventListener('click', () => openDialog());
$('#cancel').addEventListener('click', () => dialog.close());
$('#search').addEventListener('input', render);
$('#product-form').addEventListener('submit', async e => {
  e.preventDefault();
  const save = $('#save');
  const payload = {
    name: $('#name').value.trim(), description: $('#description').value.trim(),
    category: $('#category').value.trim(), price: Number($('#price').value), stock: Number($('#stock').value)
  };
  if (!Number.isInteger(payload.stock) || payload.stock < 0 || !Number.isFinite(payload.price) || payload.price < 0) {
    $('#form-message').textContent = 'Ingresa precio y existencias válidos.'; return;
  }
  save.disabled = true;
  try {
    await api(editingId ? `/api/products/${editingId}` : '/api/products', {
      method: editingId ? 'PUT' : 'POST', body: JSON.stringify(payload)
    });
    dialog.close(); await load(); showMessage('Producto guardado correctamente.');
  } catch (error) { $('#form-message').textContent = error.message; }
  finally { save.disabled = false; }
});
async function deleteProduct(product) {
  if (!confirm(`¿Eliminar "${product.name}"?`)) return;
  try {
    await api(`/api/products/${product._id}`, { method: 'DELETE' });
    await load(); showMessage('Producto eliminado correctamente.');
  } catch (error) { showMessage(error.message, true); }
}
load();

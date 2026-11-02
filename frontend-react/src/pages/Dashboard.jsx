
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const mxn = value =>
  new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(value);

const usd = value =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);

const emptyForm = {
  name: '',
  description: '',
  category: 'General',
  price: '',
  stock: ''
};

export default function Dashboard() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [rate, setRate] = useState(null);
  const [rateDate, setRateDate] = useState('');
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const userName = sessionStorage.getItem('userName') || 'Usuario';
  const userRole = sessionStorage.getItem('userRole');
  const isAdmin = userRole === 'admin';

  function logout() {
    sessionStorage.clear();
    navigate('/login', { replace: true });
  }

  async function api(path, options = {}) {
    const token = sessionStorage.getItem('token');

    const response = await fetch(path, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...options.headers
      }
    });

    if (response.status === 401) {
      logout();
      throw new Error('Tu sesión expiró.');
    }

    const text = await response.text();
    let data;

    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      throw new Error('Respuesta inválida del servidor.');
    }

    if (!response.ok) {
      throw new Error(data.message || 'Error en la solicitud.');
    }

    return data;
  }

  async function loadProducts() {
    const allProducts = [];
    let page = 1;
    let totalPages = 1;
    let total = 0;

    do {
      const data = await api(
        `/api/products?page=${page}&limit=100`
      );

      if (!Array.isArray(data.products)) {
        throw new Error('Formato de inventario inválido.');
      }

      allProducts.push(...data.products);
      totalPages = data.totalPages;
      total = data.total;
      page++;
    } while (page <= totalPages);

    setProducts(allProducts);
    setTotalProducts(total);
  }

  async function loadCurrency() {
    try {
      const data = await api(
        '/api/currency/convert?amount=1'
      );

      if (!Number.isFinite(data.rate) || data.rate <= 0) {
        throw new Error('Tipo de cambio inválido.');
      }

      setRate(data.rate);
      setRateDate(data.date);
    } catch {
      setRate(null);
      setRateDate('');
    }
  }

  useEffect(() => {
    let active = true;

    async function initialize() {
      try {
        await loadProducts();
        await loadCurrency();
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    initialize();

    return () => {
      active = false;
    };
  }, []);

  const filtered = products.filter(product =>
    `${product.name} ${product.category}`
      .toLowerCase()
      .includes(search.toLowerCase().trim())
  );

  const totalMXN = products.reduce(
    (sum, product) =>
      sum + product.price * product.stock,
    0
  );

  function openCreate() {
    setEditingId(null);
    setForm({ ...emptyForm });
    setError('');
    setMessage('');
    setShowForm(true);
  }

  function openEdit(product) {
    setEditingId(product._id);
    setForm({
      name: product.name,
      description: product.description || '',
      category: product.category,
      price: product.price,
      stock: product.stock
    });
    setError('');
    setMessage('');
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setError('');
  }

  function updateField(event) {
    const { name, value } = event.target;
    setForm(previous => ({ ...previous, [name]: value }));
  }

  async function saveProduct(event) {
    event.preventDefault();

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      category: form.category.trim(),
      price: Number(form.price),
      stock: Number(form.stock)
    };

    if (
      !Number.isFinite(payload.price) ||
      payload.price < 0 ||
      !Number.isInteger(payload.stock) ||
      payload.stock < 0
    ) {
      setError('Ingresa un precio y existencias válidos.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      await api(
        editingId
          ? `/api/products/${editingId}`
          : '/api/products',
        {
          method: editingId ? 'PUT' : 'POST',
          body: JSON.stringify(payload)
        }
      );

      closeForm();
      await loadProducts();
      setMessage('Producto guardado correctamente.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function deleteProduct(product) {
    if (!window.confirm(`¿Eliminar "${product.name}"?`)) {
      return;
    }

    setError('');
    setMessage('');

    try {
      await api(`/api/products/${product._id}`, {
        method: 'DELETE'
      });

      await loadProducts();
      setMessage('Producto eliminado correctamente.');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <header className="topbar">
        <div className="brand">
          <span className="brand-icon">▣</span>
          Inventario Fácil
        </div>

        <div className="topbar-actions">
          <span>{userName}</span>
          <button
            className="secondary small"
            onClick={logout}
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="container">
        <section className="heading">
          <div>
            <p className="eyebrow">PANEL DE CONTROL</p>
            <h1>Gestión de productos</h1>
            <p className="muted">
              Consulta y administra tu inventario de forma sencilla.
            </p>
          </div>

          {isAdmin && (
            <button onClick={openCreate}>
              + Nuevo producto
            </button>
          )}
        </section>

        <div className="stats">
          <div className="stat">
            <span>Total de productos</span>
            <strong>{totalProducts}</strong>
          </div>

          <div className="stat">
            <span>Valor del inventario (MXN)</span>
            <strong>{mxn(totalMXN)}</strong>
          </div>

          <div className="stat">
            <span>Valor del inventario (USD)</span>
            <strong>
              {rate === null
                ? 'No disponible'
                : usd(totalMXN * rate)}
            </strong>
            <small>
              {rate === null
                ? 'No se pudo consultar el tipo de cambio.'
                : `1 MXN = ${rate} USD · ${rateDate}`}
            </small>
          </div>
        </div>

        <section className="panel">
          <div className="panel-header">
            <h2>Inventario</h2>
            <input
              type="search"
              placeholder="Buscar por nombre o categoría..."
              aria-label="Buscar productos"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {message && (
            <p className="feedback" role="status">{message}</p>
          )}
          {error && !showForm && (
            <p className="feedback error" role="alert">{error}</p>
          )}

          {loading ? (
            <p className="muted">Cargando inventario...</p>
          ) : (
            <>
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Categoría</th>
                      <th>Precio</th>
                      <th>Existencias</th>
                      {isAdmin && <th>Acciones</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(product => (
                      <tr key={product._id}>
                        <td>
                          <strong>{product.name}</strong>
                          <small>
                            {product.description || 'Sin descripción'}
                          </small>
                        </td>
                        <td>{product.category}</td>
                        <td>{mxn(product.price)}</td>
                        <td>{product.stock}</td>
                        {isAdmin && (
                          <td>
                            <button
                              className="link-button"
                              onClick={() => openEdit(product)}
                            >
                              Editar
                            </button>
                            <button
                              className="link-button danger"
                              onClick={() => deleteProduct(product)}
                            >
                              Eliminar
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filtered.length === 0 && (
                <p className="muted empty">
                  No hay productos para mostrar.
                </p>
              )}
            </>
          )}
        </section>
      </main>

      {showForm && isAdmin && (
        <div className="modal-overlay">
          <section className="product-modal" role="dialog"
            aria-modal="true" aria-labelledby="form-title">
            <form onSubmit={saveProduct}>
              <h2 id="form-title">
                {editingId ? 'Editar producto' : 'Nuevo producto'}
              </h2>

              <label htmlFor="name">Nombre</label>
              <input id="name" name="name" value={form.name}
                onChange={updateField} maxLength={100} required />

              <label htmlFor="description">Descripción</label>
              <textarea id="description" name="description"
                value={form.description}
                onChange={updateField}
                maxLength={500} rows={3} />

              <label htmlFor="category">Categoría</label>
              <input id="category" name="category"
                value={form.category}
                onChange={updateField} maxLength={60} required />

              <div className="form-grid">
                <div>
                  <label htmlFor="price">Precio (MXN)</label>
                  <input id="price" name="price" type="number"
                    min="0" step="0.01" value={form.price}
                    onChange={updateField} required />
                </div>
                <div>
                  <label htmlFor="stock">Existencias</label>
                  <input id="stock" name="stock" type="number"
                    min="0" step="1" value={form.stock}
                    onChange={updateField} required />
                </div>
              </div>

              {error && <p className="feedback error" role="alert">{error}</p>}

              <div className="dialog-actions">
                <button type="button" className="secondary"
                  onClick={closeForm}>
                  Cancelar
                </button>
                <button type="submit" disabled={saving}>
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  );
}

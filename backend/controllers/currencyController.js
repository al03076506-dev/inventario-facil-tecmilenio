
const asyncHandler = require('../middleware/asyncHandler');

exports.convert = asyncHandler(async (req, res) => {
  const amount = Number(req.query.amount);

  if (
    req.query.amount === undefined ||
    req.query.amount === '' ||
    !Number.isFinite(amount) ||
    amount < 0
  ) {
    return res.status(400).json({
      message: 'Ingresa una cantidad válida mayor o igual a cero.'
    });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  let response;

  try {
    response = await fetch(
      'https://api.frankfurter.dev/v2/rate/MXN/USD',
      { signal: controller.signal }
    );
  } catch (error) {
    return res.status(502).json({
      message: 'No fue posible conectar con la API de monedas.'
    });
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    return res.status(502).json({
      message: 'La API externa no respondió correctamente.'
    });
  }

  let data;

  try {
    data = await response.json();
  } catch (error) {
    return res.status(502).json({
      message: 'La API externa devolvió una respuesta inválida.'
    });
  }

  if (
    data.base !== 'MXN' ||
    data.quote !== 'USD' ||
    !Number.isFinite(data.rate) ||
    data.rate <= 0
  ) {
    return res.status(502).json({
      message: 'El tipo de cambio recibido no es válido.'
    });
  }

  res.json({
    amountMXN: amount,
    rate: data.rate,
    amountUSD: Number((amount * data.rate).toFixed(2)),
    date: data.date,
    source: 'Frankfurter'
  });
});

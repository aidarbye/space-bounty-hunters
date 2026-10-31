function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function parseBool(value) {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return null;
}

module.exports = { parseId, parseBool };

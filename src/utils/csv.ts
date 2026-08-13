export interface ProductoCSV {
  marca: string
  codigoInterno: string
  nombre: string
  categoria: string
  descripcion: string
  precio: number
  stock: number
}

/** Parsea una línea de CSV respetando comillas (para campos con comas, ej. descripciones). */
function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (inQuotes) {
      if (char === '"') {
        if (line[i + 1] === '"') {
          current += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        current += char
      }
    } else {
      if (char === '"') {
        inQuotes = true
      } else if (char === ',') {
        result.push(current)
        current = ''
      } else {
        current += char
      }
    }
  }

  result.push(current)
  return result
}

/**
 * Parsea el CSV de productos. Espera columnas (en cualquier orden):
 * marca, codigoInterno, nombre, categoria, descripcion, precio, stock
 */
export function parseProductosCSV(raw: string): ProductoCSV[] {
  const lines = raw.split(/\r?\n/).filter((l) => l.trim().length > 0)
  if (lines.length === 0) return []

  const headers = parseCSVLine(lines[0]).map((h) => h.trim().toLowerCase().replace(/\s+/g, ''))

  const colIndex = {
    marca: headers.indexOf('marca'),
    codigoInterno: headers.indexOf('codigointerno'),
    nombre: headers.indexOf('nombre'),
    categoria: headers.indexOf('categoria'),
    descripcion: headers.indexOf('descripcion'),
    precio: headers.indexOf('precio'),
    stock: headers.indexOf('stock'),
  }

  const getCol = (cols: string[], i: number) => (i >= 0 ? (cols[i] ?? '').trim() : '')

  return lines
    .slice(1)
    .map((line) => {
      const cols = parseCSVLine(line)
      const precioRaw = getCol(cols, colIndex.precio).replace(/\./g, '').replace(',', '.')
      const stockRaw = getCol(cols, colIndex.stock)
      return {
        marca: getCol(cols, colIndex.marca),
        codigoInterno: getCol(cols, colIndex.codigoInterno),
        nombre: getCol(cols, colIndex.nombre),
        categoria: getCol(cols, colIndex.categoria),
        descripcion: getCol(cols, colIndex.descripcion),
        precio: Number(precioRaw) || 0,
        stock: Number(stockRaw) || 0,
      }
    })
    .filter((p) => p.codigoInterno && p.nombre)
}

export interface Producto {
  marca: string;
  codigoInterno: string;
  nombre: string;
  categoria: string;
  descripcion: string;
  precio: number;
  stock: number;
}

export function parseProductosCSV(csvText: string): Producto[] {
  const result: Producto[] = [];
  let currentField = '';
  let currentRow: string[] = [];
  let inQuotes = false;

  // Lector inteligente para ignorar saltos de línea dentro de las descripciones
  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentField += '"';
        i++; // salteamos la comilla doble
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ';' && !inQuotes) {
      // Acá detectamos el Punto y Coma (;) de tu Excel
      currentRow.push(currentField);
      currentField = '';
    } else if ((char === '\n' || (char === '\r' && nextChar === '\n')) && !inQuotes) {
      if (char === '\r') i++; // saltear el \n de Windows
      currentRow.push(currentField);
      if (currentRow.length > 1) { 
        result.push(mapRowToProduct(currentRow));
      }
      currentRow = [];
      currentField = '';
    } else {
      currentField += char;
    }
  }

  // Agregar la última fila si el archivo no termina en salto de línea
  if (currentRow.length > 0 || currentField !== '') {
    currentRow.push(currentField);
    if (currentRow.length > 1) {
      result.push(mapRowToProduct(currentRow));
    }
  }

  // Devolvemos los productos salteando la Fila 1 (que son los títulos)
  return result.slice(1);
}

function mapRowToProduct(row: string[]): Producto {
  // Limpieza de precios: Convierte "8.901,00" en "8901.00" para que la app pueda sumarlo
  let precioStr = row[5] || '0';
  precioStr = precioStr.replace(/\./g, '').replace(',', '.'); 

  return {
    marca: row[0]?.trim() || '',
    codigoInterno: row[1]?.trim() || '',
    nombre: row[2]?.trim() || '',
    categoria: row[3]?.trim() || '',
    descripcion: row[4]?.trim() || '',
    precio: parseFloat(precioStr) || 0,
    stock: parseInt(row[6] || '0', 10) || 0,
  };
}
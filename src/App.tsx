import { useState, useMemo } from 'react'
import productosCsvRaw from './productos/productos.csv?raw'
import { parseProductosCSV } from './utils/csv'

// --- Types ---
interface Product {
  codigoInterno: string
  marca: string
  nombre: string
  categoria: string
  descripcion: string
  price: number
  stock: number
}

interface CartItem {
  product: Product
  qty: number
}

// --- Catálogo cargado desde src/productos/productos.csv ---
// Para actualizar el catálogo, editá ese archivo (columnas: marca, codigoInterno,
// nombre, categoria, descripcion, precio, stock) y volvé a desplegar.
const CATALOG: Product[] = parseProductosCSV(productosCsvRaw).map((p) => ({
  codigoInterno: p.codigoInterno,
  marca: p.marca,
  nombre: p.nombre,
  categoria: p.categoria,
  descripcion: p.descripcion,
  price: p.precio,
  stock: p.stock,
}))

// --- WhatsApp number (replace with real one) ---
const WA_NUMBER = '5492291543003'

function formatPrice(n: number) {
  return '$' + n.toLocaleString('es-AR')
}

// Icons
function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function PlusIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function MinusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4h6v2" />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

function CartEmptyIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#F4A995" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.99-1.61L23 6H6" />
    </svg>
  )
}

// --- Search Section ---
function ProductSearch({
  onAdd,
  qtyInCart,
}: {
  onAdd: (p: Product) => void
  qtyInCart: (codigoInterno: string) => number
}) {
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return CATALOG.filter(
      (p) => p.codigoInterno.toLowerCase().includes(q) || p.nombre.toLowerCase().includes(q)
    )
  }, [query])

  return (
    <section style={{ padding: '20px 16px 0' }}>
      {/* Search bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: '#fff',
          border: '1.5px solid #F4A995',
          borderRadius: 12,
          padding: '10px 14px',
          boxShadow: '0 1px 4px rgba(235,130,108,0.08)',
        }}
      >
        <span style={{ color: '#EB826C', flexShrink: 0 }}>
          <SearchIcon />
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por código o nombre..."
          style={{
            flex: 1,
            border: 'none',
            background: 'transparent',
            fontFamily: 'Inter, sans-serif',
            fontSize: 15,
            color: '#2d1a14',
          }}
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            style={{
              background: 'none',
              border: 'none',
              color: '#C9614A',
              cursor: 'pointer',
              padding: 0,
              fontSize: 18,
              lineHeight: 1,
            }}
          >
            ×
          </button>
        )}
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div
          style={{
            marginTop: 10,
            borderRadius: 12,
            overflow: 'hidden',
            border: '1px solid #F4A995',
            background: '#fff',
          }}
        >
          {results.map((p, i) => {
            const enCarrito = qtyInCart(p.codigoInterno)
            const disponible = p.stock - enCarrito
            const sinStock = disponible <= 0
            return (
              <div
                key={p.codigoInterno}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 14px',
                  borderBottom: i < results.length - 1 ? '1px solid #FDE8E2' : 'none',
                  opacity: sinStock ? 0.55 : 1,
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 11,
                      fontWeight: 600,
                      color: '#C9614A',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      marginBottom: 2,
                    }}
                  >
                    {p.codigoInterno}
                    {p.marca ? ` · ${p.marca}` : ''}
                  </div>
                  <div
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 14,
                      fontWeight: 500,
                      color: '#2d1a14',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {p.nombre}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 2 }}>
                    <span
                      style={{
                        fontFamily: 'Barlow Condensed, sans-serif',
                        fontSize: 16,
                        fontWeight: 600,
                        color: '#EB826C',
                      }}
                    >
                      {formatPrice(p.price)}
                    </span>
                    <span
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: 11,
                        color: sinStock ? '#C9614A' : '#a07060',
                        fontWeight: sinStock ? 600 : 400,
                      }}
                    >
                      {sinStock ? 'Sin stock disponible' : `Stock: ${disponible}`}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (sinStock) return
                    onAdd(p)
                    setQuery('')
                  }}
                  disabled={sinStock}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: sinStock ? '#F4A995' : '#EB826C',
                    border: 'none',
                    color: '#fff',
                    cursor: sinStock ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    if (!sinStock) (e.currentTarget as HTMLButtonElement).style.background = '#C9614A'
                  }}
                  onMouseLeave={(e) => {
                    if (!sinStock) (e.currentTarget as HTMLButtonElement).style.background = '#EB826C'
                  }}
                  title={sinStock ? 'Sin stock disponible' : 'Agregar al pedido'}
                >
                  <PlusIcon />
                </button>
              </div>
            )
          })}
        </div>
      )}

      {query && results.length === 0 && (
        <div
          style={{
            marginTop: 10,
            padding: '14px',
            borderRadius: 12,
            background: '#fff',
            border: '1px solid #F4A995',
            fontFamily: 'Inter, sans-serif',
            fontSize: 14,
            color: '#a07060',
            textAlign: 'center',
          }}
        >
          No se encontraron productos para &ldquo;{query}&rdquo;
        </div>
      )}
    </section>
  )
}

// --- Cart Section ---
function Cart({
  items,
  onChangeQty,
  onRemove,
}: {
  items: CartItem[]
  onChangeQty: (id: string, delta: number) => void
  onRemove: (id: string) => void
}) {
  const total = items.reduce((s, i) => s + i.product.price * i.qty, 0)

  return (
    <section style={{ padding: '24px 16px 0' }}>
      <h2
        style={{
          fontFamily: 'Barlow Condensed, sans-serif',
          fontSize: 26,
          fontWeight: 700,
          color: '#2d1a14',
          margin: '0 0 14px',
          letterSpacing: '0.01em',
          textTransform: 'uppercase',
        }}
      >
        Tu pedido
        {items.length > 0 && (
          <span
            style={{
              marginLeft: 10,
              fontSize: 13,
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              background: '#EB826C',
              color: '#fff',
              borderRadius: 20,
              padding: '2px 10px',
              verticalAlign: 'middle',
              textTransform: 'none',
            }}
          >
            {items.length}
          </span>
        )}
      </h2>

      {items.length === 0 ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
            padding: '36px 24px',
            background: '#fff',
            borderRadius: 14,
            border: '1.5px dashed #F4A995',
            textAlign: 'center',
          }}
        >
          <CartEmptyIcon />
          <p
            style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontSize: 20,
              fontWeight: 600,
              color: '#C9614A',
              margin: 0,
            }}
          >
            Tu pedido está vacío
          </p>
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 14,
              color: '#a07060',
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            Buscá productos arriba y agregálos con el botón&nbsp;+
          </p>
        </div>
      ) : (
        <div
          style={{
            background: '#fff',
            borderRadius: 14,
            overflow: 'hidden',
            border: '1px solid #F4A995',
          }}
        >
          {items.map((item, i) => (
            <div
              key={item.product.codigoInterno}
              style={{
                padding: '13px 14px',
                borderBottom: i < items.length - 1 ? '1px solid #FDE8E2' : 'none',
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: '6px 12px',
                alignItems: 'center',
              }}
            >
              {/* Product name + code */}
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 14,
                    fontWeight: 500,
                    color: '#2d1a14',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {item.product.nombre}
                </div>
                <div
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 11,
                    color: '#a07060',
                    marginTop: 2,
                  }}
                >
                  {formatPrice(item.product.price)} / máquina
                  {item.qty >= item.product.stock ? (
                    <span style={{ color: '#C9614A', fontWeight: 600 }}> · Máximo stock disponible</span>
                  ) : (
                    ` · Stock: ${item.product.stock}`
                  )}
                </div>
              </div>

              {/* Subtotal */}
              <div
                style={{
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontSize: 18,
                  fontWeight: 700,
                  color: '#2d1a14',
                  textAlign: 'right',
                }}
              >
                {formatPrice(item.product.price * item.qty)}
              </div>

              {/* Qty controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  onClick={() => onChangeQty(item.product.codigoInterno, -1)}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    border: '1.5px solid #F4A995',
                    background: '#FDF0ED',
                    color: '#C9614A',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background 0.12s',
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = '#F4A995')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = '#FDF0ED')}
                >
                  <MinusIcon />
                </button>
                <span
                  style={{
                    fontFamily: 'Barlow Condensed, sans-serif',
                    fontSize: 20,
                    fontWeight: 700,
                    minWidth: 28,
                    textAlign: 'center',
                    color: '#2d1a14',
                  }}
                >
                  {item.qty}
                </span>
                <button
                  onClick={() => onChangeQty(item.product.codigoInterno, 1)}
                  disabled={item.qty >= item.product.stock}
                  title={item.qty >= item.product.stock ? 'Alcanzaste el stock disponible' : 'Agregar una unidad más'}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    border: `1.5px solid ${item.qty >= item.product.stock ? '#F4A995' : '#EB826C'}`,
                    background: item.qty >= item.product.stock ? '#F4A995' : '#EB826C',
                    color: '#fff',
                    cursor: item.qty >= item.product.stock ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background 0.12s',
                  }}
                  onMouseEnter={(e) => {
                    if (item.qty < item.product.stock) (e.currentTarget as HTMLButtonElement).style.background = '#C9614A'
                  }}
                  onMouseLeave={(e) => {
                    if (item.qty < item.product.stock) (e.currentTarget as HTMLButtonElement).style.background = '#EB826C'
                  }}
                >
                  <PlusIcon />
                </button>
              </div>

              {/* Delete */}
              <button
                onClick={() => onRemove(item.product.codigoInterno)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#F4A995',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  padding: 0,
                  transition: 'color 0.12s',
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = '#C9614A')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = '#F4A995')}
                title="Quitar producto"
              >
                <TrashIcon />
              </button>
            </div>
          ))}

          {/* Total */}
          <div
            style={{
              padding: '14px 14px',
              borderTop: '2px solid #FDE8E2',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              background: '#FDF0ED',
            }}
          >
            <span
              style={{
                fontFamily: 'Barlow Condensed, sans-serif',
                fontSize: 18,
                fontWeight: 600,
                color: '#a07060',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Total
            </span>
            <span
              style={{
                fontFamily: 'Barlow Condensed, sans-serif',
                fontSize: 32,
                fontWeight: 800,
                color: '#C9614A',
                letterSpacing: '-0.01em',
              }}
            >
              {formatPrice(total)}
            </span>
          </div>
        </div>
      )}
    </section>
  )
}

// --- Name Field ---
function NameField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [focused, setFocused] = useState(false)
  return (
    <section style={{ padding: '24px 16px 0' }}>
      <label
        style={{
          display: 'block',
          fontFamily: 'Inter, sans-serif',
          fontSize: 12,
          fontWeight: 600,
          color: '#C9614A',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          marginBottom: 8,
        }}
      >
        Tu nombre
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Ej: María García"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%',
          padding: '13px 16px',
          fontFamily: 'Inter, sans-serif',
          fontSize: 15,
          color: '#2d1a14',
          background: '#fff',
          border: `1.5px solid ${focused ? '#EB826C' : '#F4A995'}`,
          borderRadius: 12,
          boxShadow: focused ? '0 0 0 3px rgba(235,130,108,0.15)' : 'none',
          transition: 'border-color 0.15s, box-shadow 0.15s',
        }}
      />
    </section>
  )
}

// --- Footer Buttons ---
function Footer({ name, items }: { name: string; items: CartItem[] }) {
  const buildMessage = () => {
    if (items.length === 0) return encodeURIComponent('Hola! Me gustaría consultar sobre sus productos.')
    const lines = [
      `*Pedido de ${name || 'un cliente'}*`,
      '',
      ...items.map((i) => `• ${i.product.nombre} (${i.product.codigoInterno}) x${i.qty} — ${formatPrice(i.product.price * i.qty)}`),
      '',
      `*Total: ${formatPrice(items.reduce((s, i) => s + i.product.price * i.qty, 0))}*`,
    ]
    return encodeURIComponent(lines.join('\n'))
  }

  const waBase = `https://wa.me/${WA_NUMBER}?text=`
  const orderMsg = buildMessage()
  const consultMsg = encodeURIComponent('Hola! Quisiera consultar sobre sus productos disponibles.')

  return (
    <footer
      style={{
        padding: '24px 16px 32px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      {/* Primary */}
      <a
        href={`${waBase}${orderMsg}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          padding: '15px 20px',
          borderRadius: 14,
          background: items.length === 0 ? '#F4A995' : '#EB826C',
          color: '#fff',
          fontFamily: 'Inter, sans-serif',
          fontSize: 15,
          fontWeight: 600,
          textDecoration: 'none',
          transition: 'background 0.15s',
          cursor: items.length === 0 ? 'default' : 'pointer',
          pointerEvents: items.length === 0 ? 'none' : 'auto',
        }}
        onMouseEnter={(e) => {
          if (items.length > 0) (e.currentTarget as HTMLAnchorElement).style.background = '#C9614A'
        }}
        onMouseLeave={(e) => {
          if (items.length > 0) (e.currentTarget as HTMLAnchorElement).style.background = '#EB826C'
        }}
      >
        <WhatsAppIcon />
        Enviar pedido por WhatsApp
      </a>

      {/* Secondary */}
      <a
        href={`${waBase}${consultMsg}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          padding: '15px 20px',
          borderRadius: 14,
          background: 'transparent',
          border: '1.5px solid #EB826C',
          color: '#C9614A',
          fontFamily: 'Inter, sans-serif',
          fontSize: 15,
          fontWeight: 600,
          textDecoration: 'none',
          transition: 'background 0.15s, color 0.15s',
        }}
        onMouseEnter={(e) => {
          ;(e.currentTarget as HTMLAnchorElement).style.background = '#FDE8E2'
        }}
        onMouseLeave={(e) => {
          ;(e.currentTarget as HTMLAnchorElement).style.background = 'transparent'
        }}
      >
        <WhatsAppIcon />
        Consultar productos por WhatsApp
      </a>
    </footer>
  )
}

// --- Main App ---
const INITIAL_CART: CartItem[] = [
  { product: CATALOG[1], qty: 2 },
  { product: CATALOG[7], qty: 1 },
  { product: CATALOG[3], qty: 3 },
]

export default function App() {
  const [cart, setCart] = useState<CartItem[]>(INITIAL_CART)
  const [name, setName] = useState('')

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.codigoInterno === product.codigoInterno)
      if (existing) {
        if (existing.qty >= product.stock) return prev // no hay más stock disponible
        return prev.map((i) =>
          i.product.codigoInterno === product.codigoInterno ? { ...i, qty: i.qty + 1 } : i
        )
      }
      if (product.stock <= 0) return prev
      return [...prev, { product, qty: 1 }]
    })
  }

  const changeQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) =>
          i.product.codigoInterno === id
            ? { ...i, qty: Math.min(i.qty + delta, i.product.stock) }
            : i
        )
        .filter((i) => i.qty > 0)
    )
  }

  const removeItem = (id: string) => {
    setCart((prev) => prev.filter((i) => i.product.codigoInterno !== id))
  }

  const qtyInCart = (codigoInterno: string) =>
    cart.find((i) => i.product.codigoInterno === codigoInterno)?.qty ?? 0

  return (
    <div style={{ minHeight: '100vh', background: '#FDF0ED' }}>
      {/* Centered max-width wrapper for desktop */}
      <div style={{ maxWidth: 480, margin: '0 auto', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <header
          style={{
            background: '#EB826C',
            height: 64,
            display: 'flex',
            alignItems: 'center',
            padding: '0 20px',
            position: 'sticky',
            top: 0,
            zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span
              style={{
                fontFamily: 'Barlow Condensed, sans-serif',
                fontSize: 28,
                fontWeight: 800,
                color: '#fff',
                letterSpacing: '0.01em',
                textTransform: 'uppercase',
                lineHeight: 1,
              }}
            >
              Presupuestador
            </span>
            <span
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 11,
                fontWeight: 500,
                color: 'rgba(255,255,255,0.65)',
                letterSpacing: '0.08em',
              }}
            >
              v1.0
            </span>
          </div>
        </header>

        {/* Body */}
        <div style={{ flex: 1 }}>
          <ProductSearch onAdd={addToCart} qtyInCart={qtyInCart} />
          <Cart items={cart} onChangeQty={changeQty} onRemove={removeItem} />
          <NameField value={name} onChange={setName} />
          <Footer name={name} items={cart} />
        </div>
      </div>
    </div>
  )
}

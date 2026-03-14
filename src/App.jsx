import { useState, useMemo } from 'react'
import ProductCard from './components/ProductCard/ProductCard'
import './App.css'
import ofertasData from './data/ofertas.json'

function App() {
  const products = ofertasData || []
  const [selectedStore, setSelectedStore] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const stores = useMemo(() => {
    const storeSet = new Set(products.map(p => p.platform || 'Amazon'))
    return Array.from(storeSet)
  }, [products])

  const categories = useMemo(() => {
    const catSet = new Set(products.map(p => p.category || 'General'))
    return Array.from(catSet)
  }, [products])

  const filteredProducts = useMemo(() => {
    let result = products
    if (selectedStore !== 'all') {
      result = result.filter(p => (p.platform || 'Amazon') === selectedStore)
    }
    if (selectedCategory !== 'all') {
      result = result.filter(p => (p.category || 'General') === selectedCategory)
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(p => 
        p.title.toLowerCase().includes(query) ||
        (p.category && p.category.toLowerCase().includes(query)) ||
        (p.platform && p.platform.toLowerCase().includes(query))
      )
    }
    return result
  }, [products, selectedStore, selectedCategory, searchQuery])

  const storeLabels = {
    Amazon: { color: '#FF9900', icon: '📦' },
    Target: { color: '#CC0000', icon: '🎯' },
    Walmart: { color: '#0071CE', icon: '🛒' },
    BestBuy: { color: '#0046BE', icon: '🎮' },
    eBay: { color: '#E53238', icon: '🏷️' }
  }

  const categoryLabels = {
    electronica: { color: '#8B5CF6', icon: '📱' },
    General: { color: '#6B7280', icon: '📦' }
  }

  return (
    <div className="app-layout">
      <header className="navbar">
        <div className="container navbar-content">
          <a href="/" className="brand">
            <img src="/TuttoClick.png" alt="TuttoClick Logo" className="brand-img" />
            <span className="brand-text">TuttoClick</span>
          </a>
          
          <div className="search-container">
            <span className="search-icon">🔍</span>
            <input 
              type="text" 
              className="search-input"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="search-clear" onClick={() => setSearchQuery('')}>
                ✕
              </button>
            )}
          </div>
          
          <nav className="nav-links">
            <a href="#" className={`nav-link ${selectedStore === 'all' && selectedCategory === 'all' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setSelectedStore('all'); setSelectedCategory('all') }}>
              🔥 Ofertas
            </a>
            <div className="nav-dropdown">
              <button className="nav-dropdown-btn">
                🏪 Tiendas
              </button>
              <div className="nav-dropdown-content">
                <a 
                  href="#"
                  className={selectedStore === 'all' ? 'active' : ''}
                  onClick={(e) => { e.preventDefault(); setSelectedStore('all') }}
                >
                  <span>🌐</span>
                  Todas
                </a>
                {stores.map(store => (
                  <a 
                    key={store} 
                    href="#"
                    className={selectedStore === store ? 'active' : ''}
                    onClick={(e) => { e.preventDefault(); setSelectedStore(store) }}
                  >
                    <span style={{ color: storeLabels[store]?.color || '#666' }}>
                      {storeLabels[store]?.icon || '🏪'}
                    </span>
                    {store}
                  </a>
                ))}
              </div>
            </div>
            <div className="nav-dropdown">
              <button className="nav-dropdown-btn">
                📂 Categorías
              </button>
              <div className="nav-dropdown-content">
                <a 
                  href="#"
                  className={selectedCategory === 'all' ? 'active' : ''}
                  onClick={(e) => { e.preventDefault(); setSelectedCategory('all') }}
                >
                  <span>🌐</span>
                  Todas
                </a>
                {categories.map(cat => (
                  <a 
                    key={cat} 
                    href="#"
                    className={selectedCategory === cat ? 'active' : ''}
                    onClick={(e) => { e.preventDefault(); setSelectedCategory(cat) }}
                  >
                    <span style={{ color: categoryLabels[cat]?.color || '#666' }}>
                      {categoryLabels[cat]?.icon || '📁'}
                    </span>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </a>
                ))}
              </div>
            </div>
          </nav>
        </div>
      </header>

      <main className="main-content">
        <div className="hero-section">
          <div className="container">
            <div className="hero-badge">
              <span className="hero-icon">⚡</span>
              <span>Las Mejores Ofertas en Un Solo Lugar</span>
            </div>
            <h1 className="hero-title">
              {searchQuery ? (
                <>Resultados para "<span className="highlight">{searchQuery}</span>"</>
              ) : selectedStore === 'all' && selectedCategory === 'all' ? (
                <>Descubre <span className="highlight">Ofertas Increíbles</span></>
              ) : selectedStore !== 'all' ? (
                <>Ofertas en <span className="highlight">{selectedStore}</span></>
              ) : (
                <><span className="highlight">{selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}</span></>
              )}
            </h1>
            <p className="hero-subtitle">
              {searchQuery
                ? `${filteredProducts.length} producto${filteredProducts.length !== 1 ? 's' : ''} encontrado${filteredProducts.length !== 1 ? 's' : ''}`
                : selectedStore === 'all' && selectedCategory === 'all'
                ? 'Equipos seleccionados por expertos. Actualizado diariamente. ¡No dejes pasar estas ofertas exclusivas!'
                : selectedStore !== 'all'
                ? `Las mejores ofertas de ${selectedStore} verificadas por nuestro equipo.`
                : `Explora las mejores ofertas en ${selectedCategory}.`
              }
            </p>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">{filteredProducts.length}</span>
                <span className="stat-label">Ofertas</span>
              </div>
              <div className="stat">
                <span className="stat-number">{stores.length}</span>
                <span className="stat-label">Tiendas</span>
              </div>
              <div className="stat">
                <span className="stat-number">{categories.length}</span>
                <span className="stat-label">Categorías</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              <span className="section-icon">
                {selectedStore !== 'all' ? (storeLabels[selectedStore]?.icon || '🏪') : 
                 selectedCategory !== 'all' ? (categoryLabels[selectedCategory]?.icon || '📁') : '🎯'}
              </span>
              {selectedStore === 'all' && selectedCategory === 'all' 
                ? 'Ofertas del Día' 
                : selectedStore !== 'all' 
                ? `Ofertas en ${selectedStore}`
                : selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)
              }
            </h2>
            <p className="section-subtitle">
              {filteredProducts.length > 0 
                ? `(${filteredProducts.length} ofertas disponibles)`
                : 'No hay ofertas disponibles'
              }
            </p>
          </div>
          
          {filteredProducts.length > 0 ? (
            <div className="grid products-grid">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <span className="no-results-icon">🔍</span>
              <p>No hay ofertas disponibles con esos filtros.</p>
              <button className="btn-reset" onClick={() => { setSelectedStore('all'); setSelectedCategory('all') }}>
                Ver todas las ofertas
              </button>
            </div>
          )}
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <img src="/TuttoClick.png" alt="TuttoClick" className="footer-logo" />
              <p>Tu fuente confiable de las mejores ofertas.</p>
            </div>
            <p className="affiliate-disclaimer">
              Como Afiliado de Amazon, percibo dinero con las compras elegibles. 
              TuttoClick is a participant in the Amazon Services LLC Associates Program, 
              an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com.
            </p>
            <p style={{ marginTop: '1rem' }}>&copy; {new Date().getFullYear()} TuttoClick. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App

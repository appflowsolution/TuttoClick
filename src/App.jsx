import ProductCard from './components/ProductCard/ProductCard'
import './App.css'
import ofertasData from './data/ofertas.json'

function App() {
  const products = ofertasData || [];

  return (
    <div className="app-layout">
      <header className="navbar">
        <div className="container navbar-content">
          <a href="/" className="brand">
            <img src="/TuttoClick.png" alt="TuttoClick Logo" className="brand-img" />
            <span className="brand-text">TuttoClick</span>
          </a>
          <nav className="nav-links">
            <a href="#" className="nav-link active">🔥 Ofertas</a>
            <a href="#" className="nav-link">Top Ventas</a>
            <a href="#" className="nav-link">Categorías</a>
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
              Descubre <span className="highlight">Ofertas Increíbles</span> en Tecnología
            </h1>
            <p className="hero-subtitle">
              Equipos seleccionados por expertos. Actualizado diariamente. 
              ¡No dejes pasar estas ofertas exclusivas!
            </p>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">{products.length}</span>
                <span className="stat-label">Ofertas Activas</span>
              </div>
              <div className="stat">
                <span className="stat-number">24/7</span>
                <span className="stat-label">Actualizado</span>
              </div>
              <div className="stat">
                <span className="stat-number">100%</span>
                <span className="stat-label">Verificado</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              <span className="section-icon">🎯</span>
              Ofertas del Día
            </h2>
            <p className="section-subtitle">Las mejores ofertas seleccionadas especialmente para ti</p>
          </div>
          
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
            {products.map(product => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <img src="/TuttoClick.png" alt="TuttoClick" className="footer-logo" />
              <p>Tu fuente confiable de las mejores ofertas en tecnología.</p>
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

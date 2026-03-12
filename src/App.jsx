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
            TuttoClick
          </a>
          <nav>
            <a href="#" style={{ color: "var(--text-main)", textDecoration: "none", fontWeight: 500 }}>Top Ventas</a>
          </nav>
        </div>
      </header>

      <main className="main-content container">
        <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <h1>Las Mejores Ofertas en Tecnología</h1>
          <p className="text-muted">Equipos seleccionados por expertos. Actualizado diariamente.</p>
        </div>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
          {products.map(product => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <p className="affiliate-disclaimer">
            Como Afiliado de Amazon, percibo dinero con las compras elegibles. 
            TuttoClick is a participant in the Amazon Services LLC Associates Program, 
            an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com.
          </p>
          <p style={{ marginTop: '1rem' }}>&copy; {new Date().getFullYear()} TuttoClick. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}

export default App

import Button from '../Button/Button'
import './ProductCard.css'

function calculateDiscount(price, originalPrice) {
  const p = parseFloat(price)
  const op = parseFloat(originalPrice)
  if (!p || !op || op <= p) return null
  return Math.round(((op - p) / op) * 100)
}

export default function ProductCard({ title, image, price, originalPrice, rating, amazonUrl, platform = 'Amazon', category = 'General' }) {
  const discount = calculateDiscount(price, originalPrice)
  
  const platformLogos = {
    Amazon: { color: '#FF9900', name: 'Amazon' },
    Target: { color: '#CC0000', name: 'Target' },
    Walmart: { color: '#0071CE', name: 'Walmart' },
    BestBuy: { color: '#0046BE', name: 'Best Buy' },
    eBay: { color: '#E53238', name: 'eBay' },
    default: { color: '#666666', name: platform }
  }
  
  const currentPlatform = platformLogos[platform] || platformLogos.default
  
  return (
    <div className="product-card" style={{ '--platform-color': currentPlatform.color }}>
      {discount && (
        <div className="discount-badge">
          <span className="discount-percent">-{discount}%</span>
          <span className="discount-label">OFERTA</span>
        </div>
      )}
      
      <div className="urgent-badge">
        <span className="fire-icon">🔥</span>
        <span>¡Oferta Limitada!</span>
      </div>
      
      <div className="product-image-container">
        <img 
          src={image} 
          alt={title} 
          loading="lazy" 
          width="300" 
          height="300"
          className="product-image"
        />
      </div>
      
      <div className="product-content">
        <div className="title-row">
          <div className="platform-badge" style={{ backgroundColor: currentPlatform.color }}>
            {currentPlatform.name}
          </div>
          {category && category !== 'General' && (
            <span className="category-label">{category}</span>
          )}
        </div>
        
        <h3 className="product-title">{title}</h3>
        
        <div className="product-rating">
          <span className="stars">{'★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating))}</span>
          <span className="rating-value">({rating})</span>
        </div>
        
        <div className="product-price">
          <div className="price-wrapper">
            <span className="current-price">${price}</span>
            {originalPrice && (
              <span className="original-price">${originalPrice}</span>
            )}
          </div>
          {discount && (
            <div className="savings">
              ¡Ahorras ${(parseFloat(originalPrice) - parseFloat(price)).toFixed(2)}!
            </div>
          )}
        </div>
        
        <div className="product-actions">
          <Button 
            variant="primary" 
            className="w-full deal-btn"
            onClick={() => window.open(amazonUrl, '_blank', 'noopener,noreferrer')}
          >
            <span className="btn-icon">🛒</span>
            Ver Oferta
          </Button>
        </div>
        
        <div className="stock-info">
          <span className="stock-dot"></span>
          <span className="stock-text">Stock limitado - ¡Date prisa!</span>
        </div>
      </div>
    </div>
  )
}

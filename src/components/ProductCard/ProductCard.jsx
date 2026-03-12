import Button from '../Button/Button'
import './ProductCard.css'

export default function ProductCard({ title, image, price, originalPrice, rating, amazonUrl }) {
  return (
    <div className="product-card">
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
        <h3 className="product-title">{title}</h3>
        
        <div className="product-rating">
          <span className="stars">{'★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating))}</span>
          <span className="rating-value text-muted">({rating})</span>
        </div>
        
        <div className="product-price tabular-nums">
          <span className="current-price">${price}</span>
          {originalPrice && <span className="original-price text-muted">${originalPrice}</span>}
        </div>
        
        <div className="product-actions">
          <Button 
            variant="primary" 
            className="w-full"
            onClick={() => window.open(amazonUrl, '_blank', 'noopener,noreferrer')}
          >
            Ver en Amazon
          </Button>
        </div>
      </div>
    </div>
  )
}

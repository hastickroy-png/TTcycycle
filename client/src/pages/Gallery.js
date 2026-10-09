import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Gallery.css';

function Gallery({ paintings, addToCart, cart }) {
  const [filteredPaintings, setFilteredPaintings] = useState([]);
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    let sorted = [...paintings];
    
    if (sortBy === 'price-low') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      sorted.sort((a, b) => b.year - a.year);
    }
    
    setFilteredPaintings(sorted);
  }, [paintings, sortBy]);

  const totalValue = paintings.reduce((sum, p) => sum + p.price / 100, 0);

  return (
    <div>
      <header className="gallery-header">
        <div className="header-content">
          <h1>🎨 Hastick Gallery</h1>
          <p className="tagline">Original Paintings & Fine Art</p>
        </div>
        <Link to="/checkout" className="cart-link">
          🛒 Cart
          {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
        </Link>
      </header>

      <div className="container">
        <div className="gallery-hero">
          <h2>Welcome to My Art Gallery</h2>
          <p>Discover unique, handcrafted paintings from Hastick</p>
          <div className="gallery-stats">
            <div className="stat">
              <span className="stat-number">{paintings.length}</span>
              <span className="stat-label">Original Works</span>
            </div>
            <div className="stat">
              <span className="stat-number">${totalValue.toFixed(0)}</span>
              <span className="stat-label">Total Value</span>
            </div>
          </div>
        </div>

        <div className="gallery-controls">
          <h3>Sort by:</h3>
          <div className="sort-buttons">
            <button 
              className={sortBy === 'featured' ? 'active' : ''} 
              onClick={() => setSortBy('featured')}
            >
              Featured
            </button>
            <button 
              className={sortBy === 'price-low' ? 'active' : ''} 
              onClick={() => setSortBy('price-low')}
            >
              Price: Low to High
            </button>
            <button 
              className={sortBy === 'price-high' ? 'active' : ''} 
              onClick={() => setSortBy('price-high')}
            >
              Price: High to Low
            </button>
            <button 
              className={sortBy === 'newest' ? 'active' : ''} 
              onClick={() => setSortBy('newest')}
            >
              Newest First
            </button>
          </div>
        </div>

        {filteredPaintings.length === 0 ? (
          <div className="no-paintings">
            <p>No paintings available at the moment.</p>
          </div>
        ) : (
          <div className="paintings-grid">
            {filteredPaintings.map(painting => (
              <PaintingCard key={painting.id} painting={painting} addToCart={addToCart} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PaintingCard({ painting, addToCart }) {
  const handleAddToCart = () => {
    addToCart(painting);
  };

  return (
    <div className="painting-card">
      <div className="painting-image">
        <img src={painting.image} alt={painting.title} />
        <div className="painting-overlay">
          <button className="btn-view" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
      <div className="painting-info">
        <h3>{painting.title}</h3>
        <p className="artist">by {painting.artist}</p>
        
        <div className="painting-details">
          <div className="detail">
            <span className="label">Medium:</span>
            <span className="value">{painting.medium}</span>
          </div>
          <div className="detail">
            <span className="label">Size:</span>
            <span className="value">{painting.size}</span>
          </div>
          <div className="detail">
            <span className="label">Year:</span>
            <span className="value">{painting.year}</span>
          </div>
        </div>

        <p className="description">{painting.description}</p>
        
        <div className="painting-footer">
          <span className="price">${(painting.price / 100).toFixed(2)}</span>
          <button className="btn-buy" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default Gallery;

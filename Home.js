import './Home.css';

function Home() {
  return (
    <div className="container">
      {/* Left Section */}
      <div className="text-section">
        <h3>Why Choose Us</h3>
        <h1>We Offer A Complete Diagnostic For Your Car</h1>
        
          <p>We have 24/7 emergency hotline</p>
          <p>Mobile diagnostic service at home</p>
          <p>Manage your car online 24/7</p>
        
        <div className="stats">
          <div>
            <h2>674</h2>
            <p>Happy Clients</p>
          </div>
          <div>
            <h2>987</h2>
            <p>Vehicles Repaired</p>
          </div>
          <div>
            <h2>15</h2>
            <p>Years of Experience</p>
          </div>
          <div>
            <h2>49</h2>
            <p>Awards Winning</p>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div>
        <img
          src="https://bestlah.sg/wp-content/uploads/2024/05/Best-Car-Workshop-Singapore.jpg"
          alt="Red car"
          className="car-image"
        />
        
        
      </div>
    </div>

  );
}

export default Home;

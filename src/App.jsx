import { useMemo, useState } from "react";
import "./App.css";
import FoodCard from "./components/FoodCard";
import SignupModal from "./components/SignupModal";
import { bestFoods, menuItems } from "./data/menuData";

const categoryFilters = [
  "All",
  "Best Seller",
  "Starter",
  "Main Course",
  "Dessert",
  "Drink",
];

function App() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [topSearch, setTopSearch] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });
  const [currentUser, setCurrentUser] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [orderedItems, setOrderedItems] = useState([]);
  const [orderFeedback, setOrderFeedback] = useState("");

  const filteredMenu = useMemo(() => {
    const normalizedQuery = topSearch.trim().toLowerCase();
    const mergedItems = [
      ...bestFoods.map((item) => ({ ...item, source: "featured" })),
      ...menuItems.map((item) => ({ ...item, source: "menu" })),
    ];

    const matches = mergedItems.filter((item) => {
      const isCategoryMatch =
        activeCategory === "All" ? true : item.category === activeCategory;

      const isSearchMatch = normalizedQuery
        ? `${item.name} ${item.description} ${item.category}`
            .toLowerCase()
            .includes(normalizedQuery)
        : true;

      return isCategoryMatch && isSearchMatch;
    });

    if (sortBy === "price-low") {
      return [...matches].sort((a, b) => a.price - b.price);
    }

    if (sortBy === "price-high") {
      return [...matches].sort((a, b) => b.price - a.price);
    }

    return matches;
  }, [activeCategory, topSearch, sortBy]);

  const totalOrderAmount = useMemo(
    () => orderedItems.reduce((sum, item) => sum + item.price, 0),
    [orderedItems]
  );

  const isOrdered = (itemId, source) =>
    orderedItems.some((item) => item.id === itemId && item.source === source);

  const handleOrder = (item, source) => {
    setOrderedItems((previous) => {
      const alreadyOrdered = previous.some(
        (entry) => entry.id === item.id && entry.source === source
      );

      if (alreadyOrdered) {
        return previous;
      }

      return [...previous, { id: item.id, source, name: item.name, price: item.price }];
    });

    setOrderFeedback(`${item.name} added to order`);
    setTimeout(() => setOrderFeedback(""), 1500);
  };

  const handleSignup = async (formData) => {
    setIsSubmitting(true);
    setStatusMessage({ type: "", text: "" });

    const apiBaseUrl = import.meta.env.VITE_API_URL || "";

    try {
      const response = await fetch(`${apiBaseUrl}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.message || "Signup failed. Please try again.");
      }

      if (payload.user) {
        setCurrentUser(payload.user);
      }

      setStatusMessage({
        type: "success",
        text: payload.message || "Account created! Welcome!",
      });

      setTimeout(() => {
        setIsSignupOpen(false);
        setStatusMessage({ type: "", text: "" });
      }, 1500);
    } catch (error) {
      setStatusMessage({
        type: "error",
        text: error.message || "Unable to complete signup. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="brand-block">
          <p className="brand-mark">Urban Spice</p>
          <p className="brand-subtitle">Fine Dining and Lounge</p>
        </div>
        <nav className="top-nav">
          <a href="#home">Home</a>
          <a href="#menu">Menu</a>
          <a href="#about">About</a>
        </nav>
        <label className="top-search-wrap" htmlFor="top-search">
          <input
            id="top-search"
            type="search"
            value={topSearch}
            onChange={(event) => setTopSearch(event.target.value)}
            placeholder="Search dishes..."
          />
        </label>
      </header>

      <main>
        <section className="hero-section" id="home">
          <div className="hero-content">
            <p className="eyebrow">Award Winning Restaurant</p>
            <h1>Crafted Meals. Warm Atmosphere. Memorable Nights.</h1>
            <p className="hero-copy">
              Discover seasonal ingredients, chef-curated plates, and a vibrant
              experience designed for food lovers.
            </p>
            <div className="hero-actions">
              <a className="cta-primary" href="#menu">
                Explore Menu
              </a>
              <a className="cta-secondary" href="#menu">
                View Full Menu
              </a>
            </div>
            {statusMessage.text ? (
              <p className={`status-banner ${statusMessage.type}`}>{statusMessage.text}</p>
            ) : null}
          </div>
          <div className="hero-highlight-card">
            <p className="small-heading">Chef Special Today</p>
            <h3>Smoked Butter Chicken</h3>
            <p>
              Slow-cooked, charcoal-finished, and served with saffron naan and
              mint crema.
            </p>
            <span className="price-tag">$24</span>
          </div>
        </section>

        <section className="section-block" id="menu">
          <div className="section-title-wrap">
            <p className="eyebrow">Our Selection</p>
            <h2>Best Foods and Menu</h2>
          </div>
          <div className="menu-toolbar">
            <div className="filter-row" role="tablist" aria-label="Menu category filters">
              {categoryFilters.map((filter) => (
                <button
                  key={filter}
                  className={activeCategory === filter ? "filter-chip active" : "filter-chip"}
                  onClick={() => setActiveCategory(filter)}
                  role="tab"
                  aria-selected={activeCategory === filter}
                >
                  {filter}
                </button>
              ))}
            </div>
            <div className="menu-actions">
              <label className="menu-sort-wrap" htmlFor="menu-sort">
                <span>Sort</span>
                <select
                  id="menu-sort"
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </label>
              <button
                className="menu-reset"
                onClick={() => {
                  setActiveCategory("All");
                  setSortBy("featured");
                  setTopSearch("");
                }}
              >
                Reset
              </button>
            </div>
          </div>

          <div className="menu-meta-row">
            <p className="menu-meta">
              Showing {filteredMenu.length} dish{filteredMenu.length === 1 ? "" : "es"}
            </p>
            <p className="menu-meta">
              Ordered: {orderedItems.length} | Total: ${totalOrderAmount.toFixed(2)}
            </p>
          </div>

          <div className="card-grid unified-menu-grid">
            {filteredMenu.length === 0 ? (
              <article className="menu-empty-state">
                <div>
                  <h3>No matching dishes</h3>
                  <p>Try another keyword or reset filters to see all menu items.</p>
                  <button
                    className="menu-reset"
                    onClick={() => {
                      setActiveCategory("All");
                      setSortBy("featured");
                      setTopSearch("");
                    }}
                  >
                    Show All Menu
                  </button>
                </div>
              </article>
            ) : (
              filteredMenu.map((item, index) => (
                <FoodCard
                  key={`${item.source}-${item.id}`}
                  food={item}
                  index={index}
                  ordered={isOrdered(item.id, item.source)}
                  onOrder={() => handleOrder(item, item.source)}
                />
              ))
            )}
          </div>
        </section>

        <section className="section-block about-section" id="about">
          <p className="eyebrow">Why Choose Us</p>
          <h2>Hospitality with Signature Flavors</h2>
          <p>
            Urban Spice combines premium ingredients with modern culinary art.
            Our space is ideal for family dinners, business meetings, and
            celebrations.
          </p>
        </section>
      </main>

      <footer className="site-footer" id="contact">
        <div>
          <h3>Urban Spice Restaurant</h3>
          <p>154 Wellington Street, Downtown District</p>
          <p>Phone: +1 (202) 555-0148</p>
          <p>Email: hello@urbanspice.com</p>
        </div>
        <div>
          <h4>Opening Hours</h4>
          <p>Monday - Thursday: 11:00 AM - 10:00 PM</p>
          <p>Friday - Saturday: 11:00 AM - 12:00 AM</p>
          <p>Sunday: 11:00 AM - 9:00 PM</p>
        </div>
        <div>
          <h4>Reservations</h4>
          <p>Book tables for events and private dining experiences.</p>
        </div>
      </footer>

      {orderFeedback ? <div className="order-toast">{orderFeedback}</div> : null}

      {currentUser ? (
        <>
          <button
            className="floating-profile"
            onClick={() => setIsProfileOpen((previous) => !previous)}
          >
            {currentUser.fullName?.slice(0, 1)?.toUpperCase() || "U"}
          </button>
          {isProfileOpen ? (
            <div className="profile-panel">
              <h4>{currentUser.fullName}</h4>
              <p>{currentUser.email}</p>
              <p>Orders: {orderedItems.length}</p>
              <p>Total: ${totalOrderAmount.toFixed(2)}</p>
            </div>
          ) : null}
        </>
      ) : (
        <button className="floating-signup" onClick={() => setIsSignupOpen(true)}>
          Sign Up
        </button>
      )}

      <SignupModal
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
        onSubmit={handleSignup}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

export default App;
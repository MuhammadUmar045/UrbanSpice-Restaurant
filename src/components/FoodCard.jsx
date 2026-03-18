import { useState } from "react";

const FALLBACK_FOOD_IMAGE =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80";

function FoodCard({ food, index = 0, ordered = false, onOrder }) {
  const [imageSrc, setImageSrc] = useState(food.image);

  return (
    <article
      className={ordered ? "food-card food-card-ordered" : "food-card"}
      style={{ animationDelay: `${index * 90}ms` }}
    >
      <img
        src={imageSrc}
        alt={food.name}
        onError={() => {
          if (imageSrc !== FALLBACK_FOOD_IMAGE) {
            setImageSrc(FALLBACK_FOOD_IMAGE);
          }
        }}
      />
      <div className="food-card-body">
        <h3>{food.name}</h3>
        <p>{food.description}</p>
      </div>
      <div className="food-card-footer">
        <span>{food.rating} / 5</span>
        <div className="food-card-actions">
          <span>${food.price}</span>
          <button
            className={ordered ? "order-button order-button-ordered" : "order-button"}
            onClick={onOrder}
            disabled={ordered}
          >
            {ordered ? "Ordered" : "Order"}
          </button>
        </div>
      </div>
    </article>
  );
}

export default FoodCard;

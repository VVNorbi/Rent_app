import { Link } from "react-router-dom";
import "./card.scss";
import { IoBedOutline, IoMapOutline, IoLinkOutline } from 'react-icons/io5'; // Przykład importu ikon z react-icons
function Card({ item }) {
  return (
    <div className="card">
        <Link to={`/${item.id}`} className="imageContainer">
            <img src={item.img} alt="" />
        </Link>
      <div className="textContainer">
        <h2 className="title">
          <Link to={`/${item.id}`}>{item.location}</Link>
        </h2>
        <p className="address">
          <IoMapOutline className="icon" />
          <span>{item.district}, {item.street}</span>
        </p>
        <p className="price">{item.price} PLN</p>
        <div className="bottom">
          <div className="features">
            <div className="feature">
              <IoBedOutline className="icon" />
              <span>{item.rooms} rooms</span>
            </div>
            <div className="feature">
              <IoMapOutline className="icon" />
              <span>{item.area} m²</span>
            </div>
            {item.url && (
              <div className="feature">
                <IoLinkOutline className="icon" />
                <span>{item.url}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

  );
}

export default Card;
import React , {useEffect} from "react";
import Layout from "./../components/Layout/Layout";
import "../styles/HomePage.css";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../features/cartSlice";
import { fetchInitialProducts } from "../features/cartSlice"; 

const HomePage = () => {
  const items = useSelector((state) => state.allCart.items);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchInitialProducts());
  }, [dispatch]);

  return (
    <Layout title={"Home Page - Shopping App "}>
      <div className="container-fluid row mt-3">
        <div className="col-md-12 home-page">
          <div className="d-flex flex-wrap">
            {items?.map((p) => (
              <div className="card m-2" key={p.id}>
                <img
                  src={p.image}
                  className="card-img-top"
                  alt={p.name}
                />
                <div className="card-body">
                  <div className="card-name-price">
                    <h5 className="card-title">{p.title.substring(0, 25)}...</h5>
                    <h5 className="card-title card-price">
                      {p.price.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </h5>
                  </div>
                  <p className="card-text">
                    {p.description.substring(0, 60)}...
                  </p>
                  <p className="card-title ">
                    {p.category}
                  </p>
                  <div className="card-name-price">
                  
                    <button
                      onClick={() => dispatch(addToCart(p))}
                      className="btn btn-dark ms-1"
                    >
                      ADD TO CART
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;


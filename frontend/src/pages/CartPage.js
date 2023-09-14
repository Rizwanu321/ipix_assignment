import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Layout from "./../components/Layout/Layout";
import {
  getCartTotal,
  removeItem,
  decreaseItemQuantity,
  increaseItemQuantity,
  clearCart
} from "../features/cartSlice";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import DropIn from "braintree-web-drop-in-react";

const CartPage = () => {
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState("");
  const [loading, setLoading] = useState(false);

  const { cart, totalQuantity, totalPrice } = useSelector(
    (state) => state.allCart
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCartTotal());
  }, [cart]);

  // Get payment gateway token
  const getToken = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/braintree/token");
      setClientToken(data?.clientToken);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getToken();
  }, [auth?.token]);

  // Handle payments
  const handlePayment = async () => {
    try {
      setLoading(true);
      const { nonce } = await instance.requestPaymentMethod();
      const { data } = await axios.post("/api/v1/product/braintree/payment", {
        nonce,
        cart,
      });
      setLoading(true);
      localStorage.removeItem("cartItems");
      dispatch(clearCart());
      navigate("/");
      toast.success("Payment Completed Successfully ");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <Layout title={"Cart - Shopping App"}>
      <div>
        <section className="h-100 gradient-custom">
          <div className="container py-5">
            <div className="row d-flex justify-content-center my-4">
              <div className="col-md-12 col-lg-8">
                <div className="card mb-4">
                  <div className="card-header py-3">
                    <h5 className="mb-0">Cart - {cart.length} items</h5>
                  </div>
                  <div className="card-body">
                    {cart?.map((data) => (
                      <div className="row" key={data.id}>
                        <div className="col-md-4 col-lg-3 mb-4 mb-lg-0">
                          <div
                            className="bg-image hover-overlay hover-zoom ripple rounded"
                            data-mdb-ripple-color="light"
                          >
                            <img
                              src={data.image}
                              className="w-100"
                              alt="Blue Jeans Jacket"
                            />
                          </div>
                        </div>

                        <div className="col-md-8 col-lg-5 mb-4 mb-lg-0">
                          <p>
                            <strong>{data.title}</strong>
                          </p>

                          <button
                            type="button"
                            className="btn btn-primary btn-sm me-1 mb-2"
                            data-mdb-toggle="tooltip"
                            title="Remove item"
                            onClick={() => dispatch(removeItem(data.id))}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>

                        <div className="col-md-12 col-lg-4 mb-4 mb-lg-0">
                          <div className="d-flex mb-4" style={{ maxWidth: "300px" }}>
                            {data.quantity > 0 ? (
                              <button
                                className="btn btn-primary px-3 me-2"
                                onClick={() =>
                                  dispatch(decreaseItemQuantity(data.id))
                                }
                              >
                                <i className="fas fa-minus"></i>
                              </button>
                            ) : (
                              ""
                            )}

                            <div className="form-outline">
                              <input
                                id={`quantity-${data.id}`}
                                min="0"
                                name="quantity"
                                value={data.quantity}
                                type="number"
                                className="form-control"
                                onChange={() => null}
                              />
                              <label
                                className="form-label"
                                htmlFor={`quantity-${data.id}`}
                              ></label>
                            </div>

                            <button
                              className="btn btn-primary px-3 ms-2"
                              onClick={() =>
                                dispatch(increaseItemQuantity(data.id))
                              }
                            >
                              <i className="fas fa-plus"></i>
                            </button>
                          </div>

                          <p className="text-start text-md-center">
                            <strong>{data.price}</strong>
                          </p>
                        </div>
                        <hr className="my-4" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="col-md-12 col-lg-4">
                <div className="card mb-4">
                  <div className="card-header py-3">
                    <h5 className="mb-0">Summary</h5>
                  </div>
                  <div className="card-body">
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                        Total Quantity
                        <span>{totalQuantity}</span>
                      </li>

                      <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                        <div>
                          <strong>Total amount</strong>
                        </div>
                        <span>
                          <strong>{totalPrice}</strong>
                        </span>
                      </li>
                    </ul>

                    {auth?.user?.address ? (
                      <div className="mb-3">
                        <h4>Current Address</h4>
                        <h5>{auth?.user?.address}</h5>
                      </div>
                    ) : (
                      <div className="mb-3">
                          <button
                            className="btn btn-outline-warning"
                            onClick={() =>
                              navigate("/login", {
                                state: "/cart",
                              })
                            }
                          >
                            Plase Login to checkout
                          </button>
                      </div>
                    )}

                   
                    <div className="mt-2">
                      {!clientToken || !auth?.token || !cart?.length ? (
                        ""
                      ) : (
                        <>
                          <DropIn
                            options={{
                              authorization: clientToken,
                              paypal: {
                                flow: "vault",
                              },
                            }}
                            onInstance={(instance) => setInstance(instance)}
                          />

                          <button
                            className="btn btn-primary"
                            onClick={handlePayment}
                            disabled={
                              loading || !instance || !auth?.user?.address
                            }
                          >
                            {loading ? "Processing ...." : "Make Payment"}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default CartPage;

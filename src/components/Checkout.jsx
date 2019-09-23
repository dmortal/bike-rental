import React, { useEffect, useState } from "react";
import cn from "classnames";
import rawData from "../bikerentals.json";
import i18n from "../i18n.json";
import "../App.css";
import "./Checkout.css";

const Checkout = ({ history }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selection, setSelection] = useState({ bikes: {}, accessories: {} });
  const [activeStep, setActiveStep] = useState(1);
  useEffect(() => {
    //Emulating service call
    setTimeout(() => {
      setData({
        bikes: rawData.products.filter(
          product => product.product_type === "bike"
        ),
        accessories: rawData.products.filter(
          product => product.product_type !== "bike"
        )
      });
      setIsLoading(false);
    }, 1000);
  }, []);
  const handleSelection = (item, quantity) => {
    if(!quantity.match(/^[0-9]*$/)){
      return;
    }
    const newSelection = { ...selection };
    const type = item.product_type === "bike" ? "bikes" : "accessories";

    if (quantity < 1) {
      delete newSelection[type][item.id];
    } else {
      newSelection[type][item.id] = { ...item, quantity: quantity };
    }
    setSelection(newSelection);
    setError(null);
  };
  const handleContinue = () => {
    if (activeStep === 3) {
      history.push("/confirmation");
    }
    if (Object.keys(selection.bikes).length < 1) {
      setError(i18n.bike_selection_error);
    } else {
      setActiveStep(activeStep + 1);
    }
  };
  const renderProduct = (item, type) => (
    <div className="Product" key={item.id}>
      <img src={item.image} alt={item.name} />
      <p className="Product__description">
        {item.name}
        <span className="Product__description__price">{Number(item.price).toLocaleString('en')}</span>
      </p>
      <input
        className="Product__quantity"
        type="text"
        placeholder={i18n.quantity_placeholder}
        value={selection[type][item.id] ? selection[type][item.id].quantity : ''}
        onChange={e => handleSelection(item, e.target.value)}
      />
    </div>
  );
  return (
    <div>
      <header className="Header">
        <h1>{i18n.checkout_header}</h1>
        <h3 className="subheading">{i18n.checkout_subheader}</h3>
      </header>
      {error && <p className="Error">{error}</p>}
      {isLoading ? (
        <div className="Loading">{i18n.loading_text}</div>
      ) : (
        <>
          <button
            onClick={handleContinue}
            className={cn("ContinueCta", {
              "ContinueCta--disabled": Object.keys(selection.bikes).length < 1
            })}
            disabled={Object.keys(selection.bikes).length < 1}
          >
            {i18n.continueCta}
          </button>
          <ul className="Wizard">
            <li
              className={cn("Wizard__category", {
                "Wizard__category--active": activeStep === 1
              })}
            >
              <header className="Wizard__category__header">
                {i18n.bike_selection_heading}
              </header>
              <div className="Wizard__category__items">
                {data.bikes.map(item => renderProduct(item, "bikes"))}
              </div>
            </li>
            <li
              className={cn("Wizard__category", {
                "Wizard__category--active": activeStep === 2
              })}
            >
              <header className="Wizard__category__header">
                {i18n.accessory_selection_heading}
              </header>
              <div className="Wizard__category__items">
              {data.accessories.map(item => renderProduct(item, "accessories"))}
              </div>
            </li>
            <li
              className={cn("Wizard__category", {
                "Wizard__category--active": activeStep === 3
              })}
            >
              <header className="Wizard__category__header">
                {i18n.summary_heading}
              </header>
              <div className="Wizard__category__items">
                <table className="Wizard__category__summary">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Quantity</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tfoot>
                    <tr>
                      <th colSpan="3">Total: <span className="Product__description__price">{Number(Object.values(selection.bikes).concat(Object.values(selection.accessories)).reduce((acc,curr)=>acc+curr.price*curr.quantity,0)).toLocaleString('en')}</span></th>
                    </tr>
                  </tfoot>
                  <tbody>
                    {Object.values(selection.bikes).map(item => (
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td><span className="Product__description__price">{Number(item.price * item.quantity).toLocaleString('en')}</span></td>
                      </tr>
                    ))}
                    {Object.values(selection.accessories).map(item => (
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td><span className="Product__description__price">{Number(item.price * item.quantity).toLocaleString('en')}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </li>
          </ul>
        </>
      )}
    </div>
  );
};

export { Checkout };

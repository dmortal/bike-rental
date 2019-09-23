import React from "react";
import i18n from "../i18n.json";
import "../App.css";

const Confirmation = () => {
  return (
    <div>
      <header className="Header">
        <h1>{i18n.confirmation_header}</h1>
        <h3 className="subheading">{i18n.confirmation_subheader}</h3>
      </header>
    </div>
  );
};

export {Confirmation};

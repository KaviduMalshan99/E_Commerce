import React from 'react';
import './Widget.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faShoppingCart, faDollarSign, faReceipt } from '@fortawesome/free-solid-svg-icons';

const Widget = ({ title, value, icon }) => {
    let iconElement;
    // Assign specific icons based on the widget type
    switch (icon) {
        case "customers":
            iconElement = <FontAwesomeIcon icon={faUsers} />;
            break;
        case "orders":
            iconElement = <FontAwesomeIcon icon={faShoppingCart} />;
            break;
        case "revenue":
            iconElement = <FontAwesomeIcon icon={faDollarSign} />;
            break;
        case "totalOrders":
            iconElement = <FontAwesomeIcon icon={faReceipt} />;
            break;
        default:
            iconElement = null;
    }

    return (
        <div className="widget">
            <div className="left">
                <span className="title">{title}</span>
                <span className="value">{value}</span>
            </div>
            <div className="right">
                {iconElement && <div className="icon">{iconElement}</div>}  {/* Display the icon */}
            </div>
        </div>
    );
};

export default Widget;

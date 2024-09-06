import { Link } from 'react-router-dom';
import './Orders.scss';

const Orders = () => {
  return (
    <div className='main-containerorr'>
      <Link to="/admin/refundorder"><button type="button" className='order-button'>Refund Orders</button></Link>
      <Link to="/admin/OrderTable"><button type="button" className='order-button'>Orders</button></Link>
      <Link to="/admin/OrderCancellation"><button type="button" className='order-button'>Cancel Orders</button></Link>
    </div>
  );
};

export default Orders;

import { Link } from "react-router-dom";
import "../App.css";

function Navbar() {
  return (
    <div className="navbar">

      <h2>Inventory System</h2>

      <div className="navLinks">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/add">Add Product</Link>
        <Link to="/">Logout</Link>
      </div>

    </div>
  );
}

export default Navbar;
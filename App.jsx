import React, { useState } from 'react';
import './App.css';

const App = () => {
  // Set the total available seats and initialize states
  const [seatsLeft, setSeatsLeft] = useState(20);  // Initial available seats
  const [reservations, setReservations] = useState([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [guestCount, setGuestCount] = useState(1);
  const [selectedMenuItems, setSelectedMenuItems] = useState([]);
  const [error, setError] = useState('');

  // Menu data with pricing
  const menu = [
    { name: 'Pasta', price: 300 },
    { name: 'Burger', price: 150 },
    { name: 'Pizza', price: 500 },
    { name: 'Salad', price: 120 },
    { name: 'Ice Cream', price: 80 },
  ];

  // Handle reservation form submission
  const handleReservation = (e) => {
    e.preventDefault();

    // Check for duplicate reservation
    if (reservations.some(res => res.name === name)) {
      setError('Duplicate reservation detected!');
      return;
    }

    // Check if enough seats are available
    if (guestCount > seatsLeft) {
      setError('Not enough seats available!');
      return;
    }

    // Add reservation with selected menu items
    const newReservation = {
      name,
      phone,
      guestCount,
      selectedMenuItems,
      checkInTime: new Date().toLocaleTimeString(),
      checkedOut: false,
    };
    
    setReservations([...reservations, newReservation]);
    setSeatsLeft(seatsLeft - guestCount);
    setName('');
    setPhone('');
    setGuestCount(1);
    setSelectedMenuItems([]);
    setError('');
  };

  // Handle checkout of a reservation
  const handleCheckout = (index) => {
    const updatedReservations = [...reservations];
    updatedReservations[index].checkedOut = true;
    setReservations(updatedReservations);
    setSeatsLeft(seatsLeft + updatedReservations[index].guestCount);
  };

  // Handle deleting a reservation
  const handleDelete = (index) => {
    const updatedReservations = [...reservations];
    setSeatsLeft(seatsLeft + updatedReservations[index].guestCount);
    updatedReservations.splice(index, 1);
    setReservations(updatedReservations);
  };

  // Handle menu item selection
  const handleMenuItemChange = (event) => {
    const itemName = event.target.name;
    const isChecked = event.target.checked;

    setSelectedMenuItems((prevItems) => {
      if (isChecked) {
        return [...prevItems, itemName];
      } else {
        return prevItems.filter(item => item !== itemName);
      }
    });
  };

  return (
    <div className="App">
      <h1>Restaurant Reservation System</h1>

      <div className="reservation-form">
        <h2>Make a Reservation</h2>
        <form onSubmit={handleReservation}>
          <input
            type="text"
            placeholder="Customer Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Guest Count"
            value={guestCount}
            onChange={(e) => setGuestCount(Number(e.target.value))}
            min="1"
            max={seatsLeft}
            required
          />
          <div className="seats-left">
            <strong>Seats Left: {seatsLeft}</strong>
          </div>

          <div className="menu-selection">
            <h3>Select Menu Items</h3>
            {menu.map((item, index) => (
              <div key={index} className="menu-item">
                <input
                  type="checkbox"
                  name={item.name}
                  checked={selectedMenuItems.includes(item.name)}
                  onChange={handleMenuItemChange}
                />
                <label>{item.name} - ₹{item.price}</label>
              </div>
            ))}
          </div>

          <button type="submit">Book Reservation</button>
        </form>
        {error && <div className="error">{error}</div>}
      </div>

      <div className="reservations-table">
        <h2>Reservations</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Check-in Time</th>
              <th>Selected Menu Items</th>
              <th>Checkout</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation, index) => (
              <tr key={index}>
                <td>{reservation.name}</td>
                <td>{reservation.phone}</td>
                <td>{reservation.checkInTime}</td>
                <td>{reservation.selectedMenuItems.join(', ')}</td> {/* Display selected menu items */}
                <td>{reservation.checkedOut ? 'Checked Out' : <button onClick={() => handleCheckout(index)}>Click to Checkout</button>}</td>
                <td><button onClick={() => handleDelete(index)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;

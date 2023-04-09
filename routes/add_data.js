//app.post and app.get methods for add-data page

module.exports = {
getAdd:  (req, res) => {
    res.render('add_data.ejs')
  },

postAdd : async (req, res) => {
    try {
      const { ReferenceNum, CountryCode, ItemNum, ItemDescription, FullName, AddressType, AddressLine1, AddressLine2, CustomerCode, FirstName, LastName, Phone, Email } = req.body;
  
      // Add data to Addresses
      const addressQuery = "INSERT INTO Addresses (FullName, AddressType, AddressLine1, AddressLine2) VALUES (?, ?, ?, ?)";
      const addressValues = [FullName, AddressType, AddressLine1, AddressLine2];
      await pool.query(addressQuery, addressValues);
      const addressIDquery = "select last_insert_id()"
      const [addressID] = await pool.query(addressIDquery); 
      const AddressID = addressID[0]['last_insert_id()'];
  
      // Add data to Customers
      const customerQuery = "INSERT INTO Customers (CustomerCode, FirstName, LastName, Phone, Email) VALUES (?, ?, ?, ?, ?)";
      const customerValues = [CustomerCode, FirstName, LastName, Phone, Email];
      await pool.query(customerQuery, customerValues);
      const customerIDquery = "select last_insert_id()"
      const [customerID] = await pool.query(customerIDquery); 
      const CustomerID =customerID[0]['last_insert_id()'];
  
      // Add data to Orders
      const orderQuery = "INSERT INTO Orders (ReferenceNum, CountryCode, AddressID, CustomerID) VALUES (?, ?, ?, ?)";
      const orderValues = [ReferenceNum, CountryCode, AddressID, CustomerID];
      await pool.query(orderQuery, orderValues);
      const OrderIdQuery = "select last_insert_id()"
      const [orderID] = await pool.query(OrderIdQuery);
      const OrderID = orderID[0]['last_insert_id()'];
  
      // Add data to OrderLines
      const orderLineQuery = "INSERT INTO OrderLines (OrderID, ItemNum, ItemDescription) VALUES (?, ?, ?)";
      const orderLineValues = [OrderID, ItemNum, ItemDescription];
      await pool.query(orderLineQuery, orderLineValues);
      
      res.redirect('/');
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  }

};
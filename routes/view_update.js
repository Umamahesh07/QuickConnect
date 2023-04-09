//app.post and app.get methods for update orders page

module.exports = {
  getUpdate: async (req, res) => {
    try {
      const sqlQuery = `
                  SELECT 
                  o.OrderID,
                  c.FirstName,
                  c.LastName,
                  c.Phone,
                  c.Email,
                  CONCAT(a.AddressLine1, CHAR(31), a.AddressLine2) AS FullAddress,
                  GROUP_CONCAT(ol.ItemDescription SEPARATOR ' and ') AS ItemDescriptions
                  FROM Orders o
                  JOIN Customers c ON o.CustomerID = c.CustomerID
                  JOIN Addresses a ON o.AddressID = a.AddressID
                  JOIN OrderLines ol ON o.OrderID = ol.OrderID
                  GROUP BY o.OrderID
                  `;

      const [results] = await pool.query(sqlQuery);
      res.render('view-update', { results });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error retrieving data');
    }
  },

  postUpdate: async (req, res) => {
    try {
      const updatedData = req.body.updatedData;
  
      for (const data of updatedData) {
        const { id, FirstName, LastName, Phone, Email, FullAddress, ItemDescriptions } = data;
  
        const [AddressLine1, AddressLine2] = FullAddress.split(String.fromCharCode(31));
  
        await pool.query(`
          UPDATE Addresses AS a
          JOIN Orders AS o ON o.AddressID = a.AddressID
          JOIN Customers AS c ON o.CustomerID = c.CustomerID
          SET c.FirstName = ?, c.LastName = ?, c.Phone = ?, c.Email = ?,
          a.AddressLine1 = ?, a.AddressLine2 = ?
          WHERE o.OrderID = ?`,
          [FirstName, LastName, Phone, Email, AddressLine1, AddressLine2, id]);
  
        const itemDescriptionsArray = ItemDescriptions.split(' and ');
  
        const [existingOrderLines] = await pool.query(`
          SELECT OrderLineID, ItemDescription
          FROM OrderLines
          WHERE OrderID = ?`, [id]);
  
        for (const [index, itemDesc] of itemDescriptionsArray.entries()) {
          if (index < existingOrderLines.length) {
            await pool.query(`
              UPDATE OrderLines
              SET ItemDescription = ?
              WHERE OrderID = ? AND OrderLineID = ?`,
              [itemDesc, id, existingOrderLines[index].OrderLineID]);
          } else {
            await pool.query(`
              INSERT INTO OrderLines (OrderID, ItemDescription)
              VALUES (?, ?)`,
              [id, itemDesc]);
          }
        }
      }
  
      res.status(200).json({ message: 'Orders updated successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error updating data' });
    }
  }  
};
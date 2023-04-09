//app.get and app.post methods for upload xml page

const multer = require('multer');
const upload = multer();

module.exports = {

  getUploadxml: async (req, res) => {
    res.render('upload-xml.ejs')
  },

  postUploadxmlMiddleware: upload.single('xmlfile'),

  postUploadxml: (async (req, res) => {
    try {
      const parser = new xml2js.Parser();
      const parsedXml = await parser.parseStringPromise(req.file.buffer.toString());

      const orders = parsedXml.TransactionRequest.Orders[0].Order;

      for (const order of orders) {
        const [address] = await pool.query('INSERT INTO Addresses SET ?', {
          FullName: order.Address[0].FullName[0],
          AddressType: order.Address[0].AddressType[0],
          AddressLine1: order.Address[0].AddressLine1[0],
          AddressLine2: order.Address[0].AddressLine2[0]
        });

        const [customer] = await pool.query('INSERT INTO Customers SET ?', {
          CustomerCode: order.Customer[0].CustomerCode[0],
          FirstName: order.Customer[0].FirstName[0],
          LastName: order.Customer[0].LastName[0],
          Phone: order.Customer[0].Phone[0],
          Email: order.Customer[0].Email[0]
        });

        const [orderResult] = await pool.query('INSERT INTO Orders SET ?', {
          ReferenceNum: order.ReferenceNum[0],
          CountryCode: order.CountryCode[0],
          AddressID: address.insertId,
          CustomerID: customer.insertId
        });

        const orderLines = order.OrderLines[0].OrderLine;
        for (const orderLine of orderLines) {
          await pool.query('INSERT INTO OrderLines SET ?', {
            OrderID: orderResult.insertId,
            ItemNum: orderLine.ItemNum[0],
            ItemDescription: orderLine.ItemDescription[0]
          });
        }
      }
      res.status(200).json({ message: 'XML file uploaded and processed successfully.' });
      //res.redirect('/upload-xml')
    } catch (error) {
      res.status(500).json({ message: 'Error processing the XML file.' });
    } finally {
      res.end();
    }
  })
};
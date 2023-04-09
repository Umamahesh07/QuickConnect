//app.post method for index page
module.exports = {
getHome : ( (req, res) => {
    res.render('index.ejs');
  })
};
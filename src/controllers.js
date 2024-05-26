const controllers = {
  helloWorld: (req, res) => {
    res.render('Home', { title: "Home Page" });
  }
}

export default controllers
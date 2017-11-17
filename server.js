const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

app.get('/api/*', (req, res) => {
  res.json({ok: true});
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

module.exports = {app};

//https://guarded-dawn-76753.herokuapp.com/ | https://git.heroku.com/guarded-dawn-76753.git
// 24cfab2e-9acf-428a-bb0a-64a65ec1c4af

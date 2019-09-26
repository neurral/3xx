import express = require('express');

const port = process.env.PORT || 3000;
const app: express.Application = express();

app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  const { q } = req.query || { q: null };
  if (q) {
    // TODO add support for intelligent TLD. use .com for now.
    const tld = '.com';
    const protocol = 'https://';

    // like somestring.com with/without ? ! / and # and anything after that
    // TODO add support for &
    const hasTLD = /^\w+(\.\w+)+(#|!|\?(\w+=)?|\/?)?\w*$/;
    const hasProtocol = /https?:\/\//; // has 'http://' or 'https://' in front

    let finalURL =
      (!hasProtocol.test(q) ? protocol : '') + q + (!hasTLD.test(q) ? tld : '');

    return res.redirect(finalURL);
  }

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  // TODO implement html search page?
  return res.send(`'q' not provided: search instead?`);
});

app.listen(port, () => {
  console.log(`Server running at ${port}`);
});

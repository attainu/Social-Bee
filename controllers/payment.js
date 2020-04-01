const checksum_lib = require('../payment_gateway/checksum/checksum');
const port = 5500;
// dotenv.config({ path: './config/config.env' });
module.exports = app => {
  app.get('/payment', (req, res) => {
    let params = {};
    (params['MID'] = 'lhueum27134638287227'),
      (params['WEBSITE'] = 'WEBSTAGING'),
      (params['CHANNEL_ID'] = 'WEB'),
      (params['INDUSTRY_TYPE_ID'] = 'Retail'),
      (params['ORDER_ID'] = 'ORD0001'),
      (params['CUST_ID'] = 'CUST0011'),
      (params['TXN_AMOUNT'] = '100'),
      (params['CALLBACK_URL'] = 'http://localhost:' + port + '/callback'),
      (params['EMAIL'] = 'xyz@gmail.com'),
      (params['MOBILE_NO'] = '+91XXXXXXXXXX');

    checksum_lib.genchecksum(params, '2dXRzM1KXWXlEiK2', function(
      err,
      checksum
    ) {
      let txn_url = 'https://securegw-stage.paytm.in/order/process';

      let form_fields = '';
      for (x in params) {
        form_fields +=
          "<input type='hidden' name='" + x + "' value='" + params[x] + "'/>";
      }

      form_fields +=
        "<input type='hidden' name='CHECKSUMHASH' value='" + checksum + "' />";

      var html =
        '<html><body><center><h1>Social bee Thanks you for the contribution! Do not refresh the page</h1></center><form method="post" action="' +
        txn_url +
        '" name="f1">' +
        form_fields +
        '</form><script type="text/javascript">document.f1.submit()</script></body></html>';
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write(html);
      res.end();
    });
  });
};

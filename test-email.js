require('dotenv').config({ path: 'server/.env' });
const { sendQuotationEmail } = require('./server/utils/emailService');

async function test() {
  try {
    const res = await sendQuotationEmail('admin@partydial.com', 'Test Venue', 'Test Plan', 1000, 'http://test.com', [{
        filename: 'test.pdf',
        content: 'JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBvYmoKPDwvTGVuZ3RoIDMgMCBSL0ZpbHRlci9GbGF0ZURlY29kZT4+CnN0cmVhbQp4nDPQM1Qo5ypUMFAwALJMLY31jBQU0g2M4tw1DGNdQzXSU1PT81JzUvPzS/Pz0lOL8osSSzLz8xTSFQwVFApykwB58Q7FCmVuZHN0cmVhbQplbmRvYmoKCjMgMCBvYmoKNDMKZW5kb2JqCgo1IDAgb2JqCjw8L0xlbmd0aCA2IDAgUi9GaWx0ZXIvRmxhdGVEZWNvZGUvTGVuZ3RoMSA0NTE+PgpzdHJlYW0KeJxdkb1ugzAQhPd5ii3aA9j+3FghKlTqyFT1ATwMBoFIsJzY4ts3YJpWvW2/j2d377h9bY66A/QzZ8XqfN21PZ2O07C+bS/b87Efvj+3x+N5348ff/Yw+3kY98/H9u/Y1/l+v72M/Xh8z9vL7W4f4/A8z1/H7/v2Mfd/X7f94/h/P35+47D+Mff+89gO/fjv38d4+8fc/v3/4/n+n3P7n/77H8ff/z/+/v/z/7+Pv//f/z++f39/fP/+/P98fP/+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+',
        encoding: 'base64',
        contentType: 'application/pdf'
    }]);
    console.log("Success:", res);
  } catch (err) {
    console.error("Error:", err);
  }
}
test();

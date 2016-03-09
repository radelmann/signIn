module.exports = {
  'session_secret': process.env.SESSION_SECRET,
  'port': process.env.SIGNIN_PROD_PORT || 3000,
  'smtp_port': process.env.SMTP_PORT || 587,
  'db_url': process.env.SIGNIN_PROD_DB_URL || 'mongodb://localhost/signin',
  'smtp_host': process.env.SMTP_HOST || 'smtp.mandrillapp.com',
  'smtp_user': process.env.SMTP_USER,
  'smtp_password': process.env.SMTP_PASSWORD,
  'smtp_from': process.env.SMTP_FROM,

  'facebookAuth': {
    'clientID': process.env.FB_CLIENT_ID,
    'clientSecret': process.env.FB_SECRET,
    'callbackURL': process.env.FB_CALLBACK_URL
  },

  'twitterAuth': {
    'consumerKey': process.env.TW_CONSUMER_KEY,
    'consumerSecret': process.env.TW_CONSUMER_SECRET,
    'callbackURL': process.env.TW_CALLBACK_URL
  },

  'googleAuth': {
    'clientID': process.env.G_CLIENT_ID,
    'clientSecret': process.env.G_SECRET,
    'callbackURL': process.env.G_CALLBACK_URL
  }
};
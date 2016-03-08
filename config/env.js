module.exports = {
  'session_secret': process.env.SESSION_SECRET,
  'port': process.env.SIGNIN_PROD_PORT || 3000,
  'smtp_port': process.env.SMTP_PORT || 587,
  'db_url': process.env.SIGNIN_PROD_DB_URL || 'mongodb://localhost/signin',
  'smtp_host': process.env.SMTP_HOST || 'smtp.mandrillapp.com',
  'smtp_user': process.env.SMTP_USER,
  'smtp_password': process.env.SMTP_PASSWORD,
  'smtp_from': process.env.SMTP_FROM
};
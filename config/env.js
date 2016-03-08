module.exports = {
    'session_secret' : process.env.SIGNIN_PROD_SESSION_SECRET || 'dev-session-secret',
    'port' : process.env.SIGNIN_PROD_PORT || 3000,
    'db_url' : process.env.SIGNIN_PROD_DB_URL || 'mongodb://localhost/signin' 
};
// Function to generate a random token for invitations
 const generateToken = ()=>  {
    return require('crypto').randomBytes(20).toString('hex');
  }


module.exports = generateToken
// call express
const express = require('express');
const app = express();

//number of port
const PORT = process.env.PORT || 5000;

//path try
app.get('/', (req, res) => {
  res.send('🚀 Server Running');
});

// run server 
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

const express = require('express');
const router = express.Router();
const API_KEY = '2Pr8CMwjd881IB4ROVdAQQ==ggefXLlkjd8m7dkT';

/**
 * Excercise API
 * Using API Ninjas api to query exercise data
 */

router.get('/exercise', async(req, res, next) => {
  console.log(req.url)
  console.log(req.query)
  console.log(req.params)
  let fetchData = await fetch('https://api.api-ninjas.com/v1/exercises?muscle=biceps', {
    headers: {
      'X-Api-Key': API_KEY 
    }
  })

  let data = await fetchData.json();

  console.log(data);
  next();
})

module.exports = router;
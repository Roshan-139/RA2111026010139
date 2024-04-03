const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
const WINDOW_SIZE = 10;
let storedNumbers = [];
let average = 0;
async function fetchNumbers(numberId, token) {
    const headers = {
        Authorization: `Bearer ${token}`
    };

    try {
        if (numberId === "p") {
            const response = await axios.get(`http://20.244.56.144/test/primes`, { headers });
            return response.data;
        } else if (numberId === "f") {
            const response = await axios.get(`http://20.244.56.144/test/fibo`, { headers });
            return response.data;
        } else if (numberId === "e") {
            const response = await axios.get(`http://20.244.56.144/test/even`, { headers });
            return response.data;
        } else if (numberId === "r") {
            const response = await axios.get(`http://20.244.56.144/test/rand`, { headers });
            return response.data;
        }
    } catch (error) {
        console.error('Error fetching numbers:', error);
        return null;
    }
}
function calculateAverage(numbers) {
    if (numbers.length > 0) {
        return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
    } else {
        return 0;
    }
}
app.get('/numbers/:numberId', async (req, res) => {
    const { numberId } = req.params;
    const token = req.query.token; 
    if (!token) {
        return res.status(401).json({ error: 'Authorization token is required' });
    }

    const numbers = await fetchNumbers(numberId, token);

    if (numbers !== null && numbers.length > 0) {
        storedNumbers = [...new Set([...storedNumbers, ...numbers])];
        storedNumbers = storedNumbers.slice(-WINDOW_SIZE);
        average = calculateAverage(storedNumbers);
    }

    res.json({
        storedNumbersBefore: storedNumbers.slice(0, -numbers.length),
        storedNumbersAfter: storedNumbers.slice(-numbers.length),
        average
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

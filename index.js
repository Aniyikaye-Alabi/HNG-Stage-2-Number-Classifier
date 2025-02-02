// Import required modules
const express = require("express");
const axios = require("axios");
const cors = require("cors");

// Initialize the Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

// Helper function to check if a number is prime
function isPrime(num) {
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;
    for (let i = 5; i * i <= num; i += 6) {
        if (num % i === 0 || num % (i + 2) === 0) return false;
    }
    return true;
}

// Helper function to check if a number is a perfect number
function isPerfect(num) {
    if (num <= 1) return false;
    let sum = 1;
    for (let i = 2; i * i <= num; i++) {
        if (num % i === 0) {
            sum += i;
            if (i !== num / i) sum += num / i;
        }
    }
    return sum === num;
}

// Helper function to check if a number is an Armstrong number
function isArmstrong(num) {
    const digits = String(num).split("");
    const sum = digits.reduce((acc, digit) => acc + Math.pow(Number(digit), digits.length), 0);
    return sum === num;
}

// Helper function to calculate the sum of digits
function digitSum(num) {
    return String(num)
        .split("")
        .reduce((acc, digit) => acc + Number(digit), 0);
}

// Helper function to determine if a number is odd or even
function parity(num) {
    return num % 2 === 0 ? "even" : "odd";
}

// API endpoint to classify a number
app.get("/api/classify-number", async (req, res) => {
    const number = req.query.number;

    // Validate the input
    if (!number || isNaN(number)) {
        return res.status(400).json({
            number: number || "null",
            error: true,
        });
    }

    const num = parseInt(number, 10);

    // Fetch fun fact from the Numbers API
    let funFact = "";
    try {
        const response = await axios.get(`http://numbersapi.com/${num}/math`);
        funFact = response.data;
    } catch (error) {
        funFact = "No fun fact available for this number.";
    }

    // Determine properties of the number
    const properties = [];
    if (isArmstrong(num)) properties.push("armstrong");
    properties.push(parity(num));

    // Prepare the response
    const response = {
        number: num,
        is_prime: isPrime(num),
        is_perfect: isPerfect(num),
        properties: properties,
        digit_sum: digitSum(num),
        fun_fact: funFact,
    };

    // Send the response
    res.status(200).json(response);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
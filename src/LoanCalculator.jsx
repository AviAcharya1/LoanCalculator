import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container,
    TextField,
    Slider,
    Typography,
    Grid,
    Card,
    CardContent,
    Box
} from '@mui/material';

const LoanCalculator = () => {
    const [amount, setAmount] = useState(10000); // Default amount
    const [duration, setDuration] = useState(3); // Default duration in years
    const [interestRate, setInterestRate] = useState(5); // Default interest rate in %
    const [monthlyPayment, setMonthlyPayment] = useState(null);
    const [breakdown, setBreakdown] = useState([]);

    useEffect(() => {
        calculateLoan(amount, duration, interestRate);
    }, [amount, duration, interestRate]);

    const handleAmountChange = (e) => {
        setAmount(e.target.value);
    };

    const handleDurationChange = (e, newValue) => {
        setDuration(newValue);
    };

    const handleInterestRateChange = (e, newValue) => {
        setInterestRate(newValue);
    };

    const calculateLoan = async (amount, duration, interestRate) => {
        try {
            const response = await axios.post('http://localhost:5000/calculate', {
                amount,
                duration,
                interestRate,
            });
            setMonthlyPayment(response.data.monthlyPayment);
            setBreakdown(response.data.breakdown);
        } catch (error) {
            console.error("Error calculating loan", error);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box my={4}>
                <Typography variant="h4" gutterBottom>
                    Loan Calculator
                </Typography>
                <TextField
                    fullWidth
                    label="Loan Amount"
                    type="number"
                    value={amount}
                    onChange={handleAmountChange}
                    variant="outlined"
                    margin="normal"
                />
                <Typography gutterBottom>
                    Duration (years): {duration}
                </Typography>
                <Slider
                    value={duration}
                    min={0.25}
                    max={5}
                    step={0.25}
                    onChange={handleDurationChange}
                    valueLabelDisplay="auto"
                    marks
                />
                <Typography gutterBottom>
                    Interest Rate (%): {interestRate}
                </Typography>
                <Slider
                    value={interestRate}
                    min={1}
                    max={20}
                    step={0.25}
                    onChange={handleInterestRateChange}
                    valueLabelDisplay="auto"
                    marks
                />
                {monthlyPayment && (
                    <Card variant="outlined" style={{ marginTop: '20px' }}>
                        <CardContent>
                            <Typography variant="h6">
                                Monthly Payment: ${monthlyPayment}
                            </Typography>
                            <Typography variant="h6" style={{ marginTop: '20px' }}>
                                Payment Breakdown:
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={6}><Typography>Month</Typography></Grid>
                                <Grid item xs={3}><Typography>Principal</Typography></Grid>
                                <Grid item xs={3}><Typography>Interest</Typography></Grid>
                            </Grid>
                            {breakdown.map((item, index) => (
                                <Grid container spacing={2} key={index}>
                                    <Grid item xs={6}><Typography>{index + 1}</Typography></Grid>
                                    <Grid item xs={3}><Typography>{item.principal}</Typography></Grid>
                                    <Grid item xs={3}><Typography>{item.interest}</Typography></Grid>
                                </Grid>
                            ))}
                        </CardContent>
                    </Card>
                )}
            </Box>
        </Container>
    );
};

export default LoanCalculator;

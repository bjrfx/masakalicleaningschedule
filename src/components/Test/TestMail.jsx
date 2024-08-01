import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

const TestMail = () => {
    const [recipient, setRecipient] = useState('');
    const [taskName, setTaskName] = useState('Test Task');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSendEmail = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const response = await fetch('/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    recipients: [recipient],
                    recipientNames: ['Test Recipient'],
                    taskName,
                }),
            });

            if (response.ok) {
                setMessage('Email sent successfully');
            } else {
                const errorText = await response.text();
                setError(`Error sending email: ${errorText}`);
            }
        } catch (error) {
            setError(`Error: ${error.message}`);
        }
    };

    return (
        <div style={{ marginTop: '50px' }}>
            <h1>Test Email Sending</h1>
            {message && <Alert variant="success">{message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSendEmail}>
                <Form.Group controlId="formRecipientEmail">
                    <Form.Label>Recipient Email</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter recipient email"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        required
                    />
                </Form.Group>

                <Button variant="primary" type="submit" style={{ marginTop: '20px' }}>
                    Send Test Email
                </Button>
            </Form>
        </div>
    );
};

export default TestMail;
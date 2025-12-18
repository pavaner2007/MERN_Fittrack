import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000';

async function testAPI() {
  try {
    console.log('Testing server health...');
    const healthResponse = await fetch(`${BASE_URL}/`);
    const healthData = await healthResponse.json();
    console.log('Server health:', healthData);

    // Test user registration
    console.log('\nTesting user registration...');
    const registerResponse = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      })
    });
    
    if (registerResponse.ok) {
      const registerData = await registerResponse.json();
      console.log('Registration successful:', registerData);
      
      // Test login
      console.log('\nTesting user login...');
      const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123'
        })
      });
      
      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        console.log('Login successful:', loginData);
      } else {
        console.log('Login failed:', await loginResponse.text());
      }
    } else {
      console.log('Registration failed:', await registerResponse.text());
    }

  } catch (error) {
    console.error('API test failed:', error.message);
  }
}

testAPI();
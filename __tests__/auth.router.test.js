const request = require('supertest');
const app = require('../server'); // Adjust the path as necessary to import your Express app
const User = require('../model/user.modal');

describe('Auth Routes', () => {
  describe('POST /api/v1/auth/users', () => {
    it('should create a new user and return 201 status', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        userName: 'johndoe123',
        email: 'johndoe@example.com',
        password: 'P@ssw0rd',
        addresses: [
          {
            type: 'billing',
            street: '123 Main Street',
            city: 'Cityville',
            district: 'District A',
            state: 'State X',
            country: 'Country Y',
            pincode: '12345'
          },
          {
            type: 'shipping',
            street: '456 Elm Street',
            city: 'Townsville',
            district: 'District B',
            state: 'State Z',
            country: 'Country Z',
            pincode: '54321'
          }
        ],
        phone: {
          country_code: '+1',
          number: '1234567890'
        },
        profilePicture: 'https://example.com/profile.jpg',
        dateOfBirth: '1990-01-01'
      };

      const response = await request(app)
        .post('/api/v1/auth/users')
        .send(userData);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('message', 'User created successfully');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user).toHaveProperty('userName', userData.userName);
      expect(response.body.user).toHaveProperty('email', userData.email);

      // Optionally, you can add more detailed assertions to validate the user data saved in the database
      const savedUser = await User.findOne({ email: userData.email });
      expect(savedUser).toBeTruthy();
      expect(savedUser.firstName).toBe(userData.firstName);
      expect(savedUser.lastName).toBe(userData.lastName);
      // Add more assertions as needed

      // Clean up: Delete the user after testing
      await User.deleteOne({ email: userData.email });
    });

    // Add more test cases for different scenarios, such as password mismatch, duplicate email, etc.
  });
});
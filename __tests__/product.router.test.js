const { Product } = require("../model/product.modal");
const request = require('supertest');
const connectDB = require("../utils/connectDB");
const app = require("../server");

// Establish connection to the database before running tests
beforeAll(async () => {
    await connectDB("mongodb+srv://selvaganapathikanakaraj2105:FhidJdraQBaUJm7K@ecomcluster.p2asger.mongodb.net/ecom?retryWrites=true&w=majority");
});

let productId;
let variantId;

describe('Product Routes', () => {
    describe('POST /api/v1/product', () => {
        // Test case to create a new product
        it('Should create a new product and return 201 status', async () => {
            // Sample product data
            const productData = {
                name: "SampleProduct",
                description: "This is a sample product description",
                category: "Electronics",
                seller: "60f7b9c7b6b4f20015e8c1d4",
                variants: [
                    {
                        name: "Variant 1",
                        price: 50,
                        images: [
                            "image1.jpg",
                            "image2.jpg"
                        ],
                        stock: 100,
                        isAvailable: true,
                        ratings: [
                            {
                                user: "60f7b9c7b6b4f20015e8c1d2",
                                rating: 4,
                                comment: "Great product!"
                            }
                        ]
                    }
                ]
            };

            // Send a POST request to create the product
            const response = await request(app)
                .post('/api/v1/product')
                .send(productData);

            // Expecting a successful creation (status code 201)
            expect(response.statusCode).toBe(201); 
            // Expecting the returned product to have the same name as the one sent
            expect(response.body.product).toHaveProperty('name', productData.name); 

            // Store the generated productId and variantId for later use
            productId = response.body.product._id;
            variantId = response.body.product.variants[0]._id;
        });

    });

    describe('GET /api/v1/product', () => {
        // Test case to get all products
        it('Should get all products and return 200 status', async () => {
            const response = await request(app).get('/api/v1/product');
            // Expecting successful retrieval (status code 200)
            expect(response.statusCode).toBe(200); 
            // Expecting the response status to be 'success'
            expect(response.body.status).toBe('success'); 
        });
    });

    describe('GET /api/v1/product/:id', () => {
        // Test case to get a product by ID
        it('Should get a product by ID and return 200 status', async () => {
            const response = await request(app).get(`/api/v1/product/${productId}`);
            // Expecting successful retrieval (status code 200)
            expect(response.statusCode).toBe(200); 
            // Expecting the response status to be 'success'
            expect(response.body.status).toBe('success'); 
            // Expecting the returned product ID to match the requested one
            expect(response.body.product._id).toBe(productId); 
        });
    });

    describe('PATCH /api/v1/product/productDetails/:id', () => {
        // Test case to update product details by ID
        it('Should update product details by ID and return 200 status', async () => {
            // Data to update product details
            const updateData = { name: "Updated SampleProduct" };
            const response = await request(app).patch(`/api/v1/product/productDetails/${productId}`).send(updateData);
            // Expecting successful update (status code 200)
            expect(response.statusCode).toBe(200); 
            // Expecting the response status to be 'success'
            expect(response.body.status).toBe('success'); 
        });
    });

    describe('PATCH /api/v1/product/rating/:id', () => {
        // Test case to add a rating to a product by ID
        it('Should add a rating to a product by ID and return 200 status', async () => {
            // Rating data to add
            const ratingData = {
                "variantId": variantId,
                "ratings": {
                    "user": "60f7b9c7b6b4f20015e8c1d4",
                    "rating": 5,
                    "comment": "Super"
                }
            };
            const response = await request(app).patch(`/api/v1/product/rating/${productId}`).send(ratingData);
            // Expecting successful addition (status code 200)
            expect(response.statusCode).toBe(200);
            // Expecting the response status to be 'success'
            expect(response.body.status).toBe('success');
        });
    });

    describe('DELETE /api/v1/product/:id', () => {
        // Test case to delete a product by ID
        it('Should delete a product by ID and return 200 status', async () => {
            const response = await request(app).delete(`/api/v1/product/${productId}`);
            // Expecting successful deletion (status code 200)
            expect(response.statusCode).toBe(200);
            // Expecting the response status to be 'success' 
            expect(response.body.status).toBe('success');
        });
    });
});


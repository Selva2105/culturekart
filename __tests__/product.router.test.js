const { Product } = require("../model/product.modal");
const request = require('supertest');
const connectDB = require("../utils/connectDB");
const app = require("../server");

beforeAll(async () => {
    await connectDB("mongodb+srv://selvaganapathikanakaraj2105:FhidJdraQBaUJm7K@ecomcluster.p2asger.mongodb.net/ecom?retryWrites=true&w=majority");
});

let productId;
let variantId;

describe('Product Routes', () => {
    describe('POST /api/v1/product', () => {
        it('Should create a new product and return 201 status', async () => {
            const productData =
            {
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

            const response = await request(app)
                .post('/api/v1/product')
                .send(productData);

            expect(response.statusCode).toBe(201);
            expect(response.body.product).toHaveProperty('name', productData.name);

            productId = response.body.product._id;
            variantId = response.body.product.variants[0]._id;
        }, 30000);

    });

    describe('GET /api/v1/product', () => {
        it('Should get all products and return 200 status', async () => {
            const response = await request(app).get('/api/v1/product');
            expect(response.statusCode).toBe(200);
            expect(response.body.status).toBe('success');
        });
    });

    describe('GET /api/v1/product/:id', () => {
        it('should get a product by ID and return 200 status', async () => {
            const response = await request(app).get(`/api/v1/product/${productId}`);
            expect(response.statusCode).toBe(200);
            expect(response.body.status).toBe('success');
            expect(response.body.product._id).toBe(productId);
        });
    });

    describe('PATCH /api/v1/product/productDetails/:id', () => {
        it('should update product details by ID and return 200 status', async () => {
            const updateData = { name: "Updated SampleProduct" };
            const response = await request(app).patch(`/api/v1/product/productDetails/${productId}`).send(updateData);
            expect(response.statusCode).toBe(200);
            expect(response.body.status).toBe('success');
        },30000);
    });

    describe('PATCH /api/v1/product/rating/:id', () => {
        it('should add a rating to a product by ID and return 200 status', async () => {
            const ratingData = {
                "variantId": variantId,
                "ratings": {
                  "user": "60f7b9c7b6b4f20015e8c1d4",
                  "rating": 5,
                  "comment": "Super"
                }
              };
            const response = await request(app).patch(`/api/v1/product/rating/${productId}`).send(ratingData);
            expect(response.statusCode).toBe(200);
            expect(response.body.status).toBe('success');
        });
    });

    describe('DELETE /api/v1/product/:id', () => {
        it('Should delete a product by ID and return 200 status', async () => {
            const response = await request(app).delete(`/api/v1/product/${productId}`);
            expect(response.statusCode).toBe(200);
            expect(response.body.status).toBe('success');

        }, 30000);
    });
});
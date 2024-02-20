const { Product } = require("../model/product.modal");
const request = require('supertest');
const connectDB = require("../utils/connectDB");
const app = require("../server");

const DBURL = process.env.MONGO_URL;

beforeAll(async () => {
    await connectDB("mongodb+srv://selvaganapathikanakaraj2105:FhidJdraQBaUJm7K@ecomcluster.p2asger.mongodb.net/ecom?retryWrites=true&w=majority");
});


describe('Product Routes', () => {
    describe('POST /api/v1/product', () => {
        it('should create a new product and return 201 status', async () => {
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
            expect(response.body).toHaveProperty('name', productData.name);

            // Clean up: Delete the product after testing
            await Product.deleteOne({ name: productData.name });
        },20000);

    });
});
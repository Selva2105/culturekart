const Product = require("../../model/model.product");
const ApiFeature = require("../../utils/ApiFeature");
const AsyncErrorHandler = require("../../utils/asyncErrorHandler");
const CustomError = require("../../utils/customError");

const getProducts = AsyncErrorHandler(async (req, res, next) => {
  // 1. Filter the data
  const products = new ApiFeature(Product.find(), req.query).filter().sort().limitFields().pagenate();

  // 2. Await for the response from the instance of Apifeature class
  const fullProducts = await products.query;

  // 3. Get unique categories
  const categories = await Product.distinct('category');

  // 4. Respond with the product data along with unique categories
  res.status(201).json({
    status: "success",
    length: fullProducts.length,
    data: {
      categories: categories,
      products: fullProducts,
    },
  });
});

const getAllCaregory = AsyncErrorHandler(async (req, res, next) => {

  // 1. Get unique categories
  const categories = Product.schema.path('category').enumValues;
  // 4. Respond with the product data along with unique categories
  res.status(201).json({
    status: "success",
    categories: categories,
  });
})


const createProduct = AsyncErrorHandler(async (req, res, next) => {

  // 1. Destructure both required and optional fields from the request body
  const {
    name,
    description,
    product_list,
    category,
    quantity,
    brand,
    modelNumber,
    manufacturer,
    releaseDate,
    totalSales
  } = req.body;

  // 2. Validate if required fields are provided
  if (Object.keys(req.body).length === 0) {
    const error = new CustomError("Give the required fields", 500);
    return next(error);
  }

  // 3. Create a new product instance using the Product model
  const newProduct = new Product({
    name,
    description,
    product_list,
    category,
    quantity,
    brand,
    modelNumber,
    manufacturer,
    releaseDate,
    totalSales
  });

  // 4. Save the new product to the database
  const savedProduct = await newProduct.save();

  // 5. Respond with the saved product data
  res.status(201).json({
    status: "success",
    data: {
      product: savedProduct,
    },
  });
});

const updateProduct = AsyncErrorHandler(async (req, res, next) => {

  // 1. Get the product id from the params
  const productId = req.params.id;

  // 2. Check if Id is provided
  if (!productId) {
    const error = new CustomError("Product ID is required", 400);
    return next(error);
  }

  // 3. Fields that are not allowed to be updated by the user
  const disallowedFields = ["_id", "__v", "releaseDate"];

  // 4. If any disallowed fields are present in the request body
  const updates = Object.keys(req.body);
  const disallowedUpdates = updates.filter((update) =>
    disallowedFields.includes(update)
  );

  // 5. If disallowed fields are found, send an error response
  if (disallowedUpdates.length > 0) {
    const error = new CustomError(
      `Updating ${disallowedUpdates.join(", ")} is not allowed.`,
      400
    );
    return next(error);
  }

  // 6. Prepare the update object
  const updateObject = {};
  updates.forEach((update) => {
    if (update === "product_list") {
      // Update each item in the product_list array
      req.body[update].forEach((newItem, index) => {
        const key = `product_list.$[elem${index}]`;
        updateObject[key] = newItem;
      });
    } else {
      // Update other fields
      updateObject[update] = req.body[update];
    }
  });

  // 7. Update the product in the database
  const options = { arrayFilters: [] };
  req.body.product_list.forEach((item, index) => {
    options.arrayFilters.push({ [`elem${index}._id`]: item._id });
  });

  const result = await Product.updateOne(
    { _id: productId },
    { $set: updateObject },
    options
  );

  // 8. Check if the product was found and updated
  if (result.n === 0) {
    const error = new CustomError("Product not found", 404);
    return next(error);
  }

  // 9. Send success response
  res.status(200).json({
    status: "success",
    message: `${result.modifiedCount} field updated`,
  });
});

const addQuantityPrice = AsyncErrorHandler(async (req, res, next) => {
  // 1. Get the product id from the params
  const productId = req.params.id;

  // 2. Destructure the req body
  const { size, price, quantity } = req.body;

  // 3. Find the product to add the product list or throw an error if not found
  const product = await Product.findById(productId);

  if (!product) {
    const error = new CustomError("Product not found", 404);
    return next(error);
  }

  // 4. Check if the size already exists, if exists throw an error
  const existingSize = product.product_list.find((item) => item.size === size);

  if (existingSize) {
    const error = new CustomError("Size already exists for this product", 400);
    return next(error);
  }

  // 5. Check if there are already five items in the product list, throw an error if true
  if (product.product_list.length >= 5) {
    const error = new CustomError("Product list is full, cannot add more items", 400);
    return next(error);
  }

  // 6. Add new product_list
  product.product_list.push({
    size,
    price,
    quantity,
  });

  // 7. Save the updated product
  await product.save();

  // 8. Send the response
  res.status(201).json({
    status: "success",
    message: "Quantity price added successfully",
  });
});


const deleteQuantityPrice = AsyncErrorHandler(async (req, res, next) => {

  // 1. Get the product id from the params
  const productId = req.params.id;

  // 2. Destructure the req body
  const { sizeToDelete } = req.body;

  const product = await Product.findById(productId);

  if (!product) {
    const error = new CustomError("Product not found", 404);
    return next(error);
  }

  // 3. Find the index of the product_list with the given size
  const productListIndex = product.product_list.findIndex(
    (item) => item.size === sizeToDelete
  );

  if (productListIndex === -1) {
    const error = new CustomError("Product list with specified size not found", 400);
    return next(error);
  }

  // 4. Remove the product_list from the array
  product.product_list.splice(productListIndex, 1);

  // 5. Save the updated product
  await product.save();

  // 6. Send the response
  res.status(201).json({
    status: "success",
    message: "Quantity price removed successfully",
  });

});

const deleteProduct = AsyncErrorHandler(async (req, res, next) => {

  // 1. Get the product id from the params
  const productId = req.params.id;

  // 2. Find the product or throw an error if not found
  const product = await Product.findById(productId);

  if (!product) {
    const error = new CustomError("Product not found", 404);
    return next(error);
  }

  // 3. Delete the product
  await Product.deleteOne({ _id: productId });

  // 4. Send the response
  res.status(200).json({
    status: "success",
    message: "Product deleted successfully",
  });
});


module.exports = {
  createProduct,
  getProducts,
  updateProduct,
  addQuantityPrice,
  deleteQuantityPrice,
  deleteProduct,
  getAllCaregory
};

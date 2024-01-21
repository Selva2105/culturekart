class ApiFeature {

    /**
     * @constructor
     * @param {Object} query - MongoDB query object.
     * @param {Object} queryStr - Request query string.
     */
    constructor(query, queryStr) {

        // MongoDB query to be executed
        this.query = query;

        // Request query string containing filters, sorting, paging, etc.
        this.queryStr = queryStr;

        // Create a shallow copy of the request query string to avoid modifying the original
        this.queryObj = { ...queryStr }

        // Remove certain fields from the query string to get filters only
        const excludeFields = ['sort', 'page', 'limit', 'fields'];

        // Remove unwanted fields from the query object
        excludeFields.forEach((field) => {
            delete this.queryObj[field]
        })
    }

    /**
     * Applies filtering based on the request query.
     * @returns {Object} - Current instance for method chaining.
     */
    filter() {
        // Convert the query object to a string, add $ in front of comparison operators, and parse it back to JSON
        let queryString = JSON.stringify(this.queryObj);
        queryString = queryString.replace(/\b(gte|gt|lte|lt|eq)\b/g, (match) => `$${match}`);
        let finalQueryString = JSON.parse(queryString);

        // Apply the filtered query to the main query
        this.query = this.query.find(finalQueryString);

        return this; // Allow method chaining
    }

    /**
     * Applies sorting based on the request query.
     * @returns {Object} - Current instance for method chaining.
     */
    sort() {
        if (this.queryStr.sort) {
            // Extract fields to sort by from the query string and join them with a space
            const sortBy = this.queryStr.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            // If no sorting specified, default to sorting by createdAt in descending order
            this.query = this.query.sort("-createdAt");
        }

        return this; // Allow method chaining
    }

    /**
     * Limits fields returned in the query result.
     * @returns {Object} - Current instance for method chaining.
     */
    limitFields() {
        if (this.queryStr.fields) {
            // Extract fields to include from the query string and select them
            const fields = this.queryStr.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            // If no specific fields specified, exclude the '__v' field
            this.query = this.query.select('-__v');
        }

        return this; // Allow method chaining
    }

    /**
     * Handles pagination based on the request query.
     * @returns {Object} - Current instance for method chaining.
     */
    pagenate() {
        // Extract page and limit values from the query string (default to page 1 and limit 10 if not provided)
        const page = this.queryStr.page * 1 || 1;
        const limit = this.queryStr.limit * 1 || 10;

        // Calculate the number of documents to skip based on the page and limit
        const skip = (page - 1) * limit;

        // Apply skip and limit to the query for pagination
        this.query = this.query.skip(skip).limit(limit);

        return this; // Allow method chaining
    }
}

module.exports = ApiFeature;

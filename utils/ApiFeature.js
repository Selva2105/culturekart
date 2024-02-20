class ApiFeature {
    /**
     * @constructor
     * @param {Object} query - MongoDB query object.
     * @param {Object} queryStr - Request query string.
     * @param {String} defaultSortField - Default field to sort by.
     */
    constructor(query, queryStr, defaultSortField = '-createdAt') {
        this.query = query;
        this.queryStr = queryStr;
        this.defaultSortField = defaultSortField;
        this.queryObj = { ...queryStr };

        const excludeFields = ['sort', 'page', 'limit', 'fields'];
        excludeFields.forEach(field => delete this.queryObj[field]);
    }

    filter() {
        try {
            let queryString = JSON.stringify(this.queryObj);
            queryString = queryString.replace(/\b(gte|gt|lte|lt|eq)\b/g, match => `$${match}`);
            const finalQueryString = JSON.parse(queryString);
            this.query = this.query.find(finalQueryString);
        } catch (error) {
            // Placeholder for error handling
            console.error('Error applying filters:', error);
        }
        return this;
    }

    sort() {
        try {
            if (this.queryStr.sort) {
                const sortBy = this.queryStr.sort.split(',').join(' ');
                this.query = this.query.sort(sortBy);
            } else {
                this.query = this.query.sort(this.defaultSortField);
            }
        } catch (error) {
            // Placeholder for error handling
            console.error('Error applying sorting:', error);
        }
        return this;
    }

    limitFields() {
        try {
            if (this.queryStr.fields) {
                const fields = this.queryStr.fields.split(',').join(' ');
                this.query = this.query.select(fields);
            } else {
                this.query = this.query.select('-__v');
            }
        } catch (error) {
            // Placeholder for error handling
            console.error('Error limiting fields:', error);
        }
        return this;
    }

    paginate() {
        try {
            const page = parseInt(this.queryStr.page, 10) || 1;
            const limit = parseInt(this.queryStr.limit, 10) || 10;
            const skip = (page - 1) * limit;
            this.query = this.query.skip(skip).limit(limit);
        } catch (error) {
            // Placeholder for error handling
            console.error('Error applying pagination:', error);
        }
        return this;
    }
}

module.exports = ApiFeature;
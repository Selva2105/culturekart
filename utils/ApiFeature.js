class ApiFeature {

    constructor(query, queryStr) {

        // === this query will hold ModelName.find({}) === //
        this.query = query;

        // === this queryStr will hold req.query === //
        this.queryStr = queryStr;

        // === this queryObj will hold req.query shallow copy === //
        this.queryObj = { ...queryStr }

        // === this loop will remove the filters and give the query string alone === //
        const excludeFields = ['sort', 'page', 'limit', 'fields'];

        excludeFields.forEach((ele) => {
            delete this.queryObj[ele]
        })

    }

    filter() {

        // 1. to add $ infront of operators[gte,lte,eq,lt,gt] convert it to string add the $ symbol and again parse it to JSON obj
        let queryString = JSON.stringify(this.queryObj);
        queryString = queryString.replace(/\b(gte|gt|lte|lt|eq)\b/g, (match) => `$${match}`);
        let finalQueryString = JSON.parse(queryString);

        this.query = this.query.find(finalQueryString);

        return this;
    }

    sort() {

        if (this.queryStr.sort) {
            const sortBy = this.queryStr.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort("-createdAt")
        }

        return this;
    }

    limitFields(){
        if (this.queryStr.fields) {
            const fields = this.queryStr.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v')
        }

        return this;
    }

    pagenate(){
         // 5. Paginating the result to convert string to number *1
         const page = this.queryStr.page * 1 || 1;
         const limit = this.queryStr.limit * 1 || 10;
         // PAGE 1: 1 - 10[skip : 0]; 2 : 11 - 20[skip : 10]
         const skip = (page - 1) * limit;
         this.query = this.query.skip(skip).limit(limit)

         return this;
    }

}

module.exports = ApiFeature
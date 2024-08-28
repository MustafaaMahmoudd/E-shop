class AdvancedFilter {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filter() {
    let exclude = ["page", "limit", "sort", "fields"];
    let queryObj = { ...this.queryString };
    exclude.forEach((el) => {
      delete queryObj[el];
    });
    Object.keys(queryObj).forEach((key) => {
      if (typeof queryObj[key] === "object") return;
      queryObj[key] = { $regex: queryObj[key], $options: "i" };
      // console.log(el)
    });

    //Advanced filter
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (word) => `$${word}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }
  sort() {
    if (this.queryString.sort) {
      let sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    }
    return this;
  }
  fields() {
    if (this.queryString.fields) {
      let field = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(field);
    }
    return this;
  }
  pagination() {
    let page = this.queryString.page * 1;
    let limit = this.queryString.limit * 1;
    let skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}


module.exports=AdvancedFilter;

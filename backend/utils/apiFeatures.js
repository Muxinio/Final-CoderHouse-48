class APIFeature {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: new RegExp(this.queryStr.keyword, "i"),
        }
      : {};
    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    let filterContent = { ...this.queryStr };

    // Eliminar campos de la consulta
    const removeFields = ["keyword", "limit", "page"];

    // Eliminar propiedades que contienen a removeFiles
    removeFields.forEach((el) => delete filterContent[el]);

    //Filtrar precio, valoraciones
    let queryStr = JSON.stringify({ ...filterContent }); // Convertir en cadena

    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  pagination(resPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    this.query = this.query.limit(resPerPage).skip(skip);
    return this;
  }
}

module.exports = APIFeature;

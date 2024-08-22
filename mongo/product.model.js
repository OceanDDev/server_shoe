  //ket noi collection product 
  const mongoose = require('mongoose');
  const Schema = mongoose.Schema;
  const ObjectId =Schema.ObjectId;

  const productsSchema = new Schema({ 
    product_name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    image: { type: String, required: false }, 
    hot: { type: Number, required: false},
    category:{ 
      type : {
        categoryId: { type: ObjectId, required: true},
        categoryName: { type: String, required: true} 
      },
      required: true
    }

  })

  module.exports = mongoose.models.product || mongoose.model('product',productsSchema);
// passmogo quickstart product
// duongdev
  //yBCmSMukLIrgESYa
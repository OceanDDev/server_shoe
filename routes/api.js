var express = require('express');
var router = express.Router();
const productController = require('../mongo/product.Controller');
const productModel = require('../mongo/product.model');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); 
  }
});

const checkFile = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|png)$/)) {
    cb(new Error('Only images are allowed.'), false); 
  } else {
    cb(null, true);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: checkFile
});

// Create a new product
router.post('/add',  async (req, res) => {
  try {
    let body = req.body;
    // body.image = req.file.originalname // Assuming the field name is 'image'
    const result = await productController.insert(body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await productController.getAll();
    return res.status(200).json(products);
  } catch (error) {
    console.log('Error getting all products: ' + error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
      const { id } = req.params;
      const product = await productController.getProductById(id);
      res.status(200).json(product);
  } catch (error) {
      console.log('Error getting product by ID:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});
  
module.exports = router;
// Get product details by ID
router.get('/details/:_id', async (req, res) => {
  try {
    const productId = req.params._id;
    const details = await productModel.findById(productId);
    if (!details) {
      return res.status(404).json({ error: 'Product not found' });
    }
    return res.status(200).json({ details });
  } catch (error) {
    console.error('Error getting product details: ' + error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete product by ID
router.delete('/delete/:id', async (req, res) => {
  try {
    const {id}  = req.params;
    const deletedProduct = await productController.remove(id);
    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    return res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.log('Error deleting product: ' + error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update product by ID
router.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    // body.image = req.file ? req.file.originalname : req.body.imgOld;

    const productUpdate = await productController.update(id, body);
    res.status(200).json(productUpdate);
  } catch (error) {
    console.log('Error updating product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;

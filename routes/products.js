var express = require('express');
var router = express.Router();
const productController = require('../mongo/product.Controller');
const multer = require('multer');
const categoryModel = require('../mongo/category.model'); 

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/'); 
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`)
    }   
});

const upload = multer({ storage: storage });

router.get('/', async (req, res) => {
    try {
        const product = await productController.getAll();
        return res.status(200).json(product);
    } catch (error) {
        console.log('Error getting all categories: ' + error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/insert', upload.single('image'), async (req, res) => {
    try {
        const { product_name, brand, price, description, hot, category } = req.body;
        const image =req.file.filename

        // Tìm category từ ID
        const categoryFind = await categoryModel.findById(category);
        if (!categoryFind) {
            throw new Error(`Không tìm thấy category`);
        }

        // Tạo sản phẩm mới
        const result = await productController.insert({
            product_name,
            brand,
            price,
            hot,
            description,
            image,
            category,
        });

        res.status(201).json(result);
    } catch (error) {
        console.error('Lỗi khi thêm sản phẩm:', error.message);
        res.status(500).json({ error: error.message });
    }
});

router.put('/update/:id', upload.single('image'), async (req, res) => {
    try {
        
        const { id } = req.params;
        const body = req.body;
        body.image = req.file ? req.file.filename : req.body.imgOld;

        const productUpdate = await productController.update(id, body);
        res.status(200).json(productUpdate);
    } catch (error) {
        console.log('Error updating product:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
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

router.get('/page/:page/limit/:limit', async (req, res) => {
    try {
        const { page, limit } = req.params;
        const result = await productController.getAllPage(page, limit);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Lấy sản phẩm theo danh mục
router.get('/category/:categoryName', async (req, res) => {
    try {
        const { categoryName } = req.params;
        const products = await productController.getProductByCategoryName(categoryName);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Tìm kiếm sản phẩm
router.get('/search/:keyword', async (req, res) => {
    try {
        const { keyword } = req.params;
        const products = await productController.getProductByKeyword(keyword);
        return res.status(200).json(products);
    } catch (error) {
        console.log('Error getting products by keyword:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Lấy danh sách sản phẩm có sắp xếp giá tăng dần và giới hạn số lượng
router.get('/sort-price/:order/:limit', async (req, res) => {
    try {
        const { order, limit } = req.params;
        const products = await productController.getSortPrice(order, limit);
        return res.status(200).json(products);
    } catch (error) {
        console.log('Error sorting products by price:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Lấy sản phẩm hot
router.get('/hot-products/:num', async (req, res) => {
    try {
        const { num } = req.params;
        const hotProducts = await productController.getHotProducts(num);
        return res.status(200).json(hotProducts);
    } catch (error) {
        console.log('Error getting hot products:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;

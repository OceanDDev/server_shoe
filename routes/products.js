const express = require('express');
const router = express.Router();
const productController = require('../mongo/product.Controller');
const multer = require('multer');
const categoryModel = require('../mongo/category.model'); 

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/'); 
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    }   
});

const upload = multer({ storage: storage });

router.get('/', async (req, res) => {
    try {
        const products = await productController.getAll();
        res.status(200).json(products);
    } catch (error) {
        console.error('Error getting all products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/insert', upload.single('image'), async (req, res) => {
    try {
        const { product_name, brand, price, description, hot, category } = req.body;
        const image = req.file ? req.file.filename : null; // Xử lý trường hợp không có file

        // Tìm category từ ID
        const categoryFind = await categoryModel.findById(category);
        if (!categoryFind) {
            return res.status(404).json({ error: 'Category not found' });
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
        console.error('Error inserting product:', error.message);
        res.status(500).json({ error: error.message });
    }
});

router.put('/update/:id', upload.single('image'), async (req, res) => {
    try {
        const { id } = req.params;
        const body = req.body;
        body.image = req.file ? req.file.filename : req.body.imgOld; // Xử lý trường hợp không có file

        const productUpdate = await productController.update(id, body);
        res.status(200).json(productUpdate);
    } catch (error) {
        console.error('Error updating product:', error);
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
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productController.getProductById(id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error('Error getting product by ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/page/:page/limit/:limit', async (req, res) => {
    try {
        const { page, limit } = req.params;
        const result = await productController.getAllPage(parseInt(page), parseInt(limit));
        res.status(200).json(result);
    } catch (error) {
        console.error('Error getting products by page and limit:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/category/:categoryName', async (req, res) => {
    try {
        const { categoryName } = req.params;
        const products = await productController.getProductByCategoryName(categoryName);
        if (products.length === 0) {
            return res.status(404).json({ error: 'No products found in this category' });
        }
        res.status(200).json(products);
    } catch (error) {
        console.error('Error getting products by category name:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/search/:keyword', async (req, res) => {
    try {
        const { keyword } = req.params;
        const products = await productController.getProductByKeyword(keyword);
        if (products.length === 0) {
            return res.status(404).json({ error: 'No products found matching the keyword' });
        }
        res.status(200).json(products);
    } catch (error) {
        console.error('Error getting products by keyword:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/sort-price/:order/:limit', async (req, res) => {
    try {
        const { order, limit } = req.params;
        const products = await productController.getSortPrice(order, parseInt(limit));
        if (products.length === 0) {
            return res.status(404).json({ error: 'No products found' });
        }
        res.status(200).json(products);
    } catch (error) {
        console.error('Error sorting products by price:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/hot-products/:num', async (req, res) => {
    try {
        const { num } = req.params;
        const hotProducts = await productController.getHotProducts(parseInt(num));
        if (hotProducts.length === 0) {
            return res.status(404).json({ error: 'No hot products found' });
        }
        res.status(200).json(hotProducts);
    } catch (error) {
        console.error('Error getting hot products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;

var express = require('express');
var router = express.Router();
const categoryController = require('../mongo/category.Controller');


// Lấy tất cả danh mục
router.get('/', async (req, res) => {
    try {
        const categories = await categoryController.getAll();
        return res.status(200).json(categories);
    } catch (error) {
        console.log('Error getting all categories: ' + error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name || !description) {
            return res.status(400).json({ error: 'Name and description are required.' });
        }

        const newCategory = await categoryController.insert({ name, description });
        return res.status(201).json(newCategory);
    } catch (error) {
        console.log('Error adding category:', error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Lấy một danh mục theo id
router.get('/:id', async (req, res) => {
    try {
        const category = await categoryController.getCategoryById(req.params.id);
        return res.status(200).json(category);
    } catch (error) {
        console.log('Error getting category by id: ' + error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Cập nhật một danh mục
router.put('/:id', async (req, res) => {
    try {
        const { name, description } = req.body;
        const updatedCategory = await categoryController.update(req.params.id, { name, description });
        return res.status(200).json(updatedCategory);
    } catch (error) {
        console.log('Error updating category: ' + error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Xóa một danh mục
router.delete('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const deletedCategory = await categoryController.remove(id);
            return res.status(200).json(deletedCategory);
        } catch (error) {
            console.log('Error deleting category: ' + error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;

const productModel = require('./product.model');
const categoryModel = require('./category.model');

module.exports = { insert, getAll, remove, update, getCategoryById };

async function insert(body) {
    try {
        const { name, description } = body; 

        const categoryNew = new categoryModel({
            name,
            description
        });

        const result = await categoryNew.save();
        return result;
    } catch (error) {
        console.log('Error inserting category:', error);
        throw error;
    }
}

async function getAll() {
    try {
        const result = await categoryModel.find();
        return result;
    } catch (error) {
        console.log("Error getting all categories:", error);
        throw error;
    }

}

async function getCategoryById(id) {
    try {
        const category = await categoryModel.findById(id);
        if (!category) {
            throw new Error("Category not found");
        }
        return category;
    } catch (error) {
        console.log("Error getting category by id:", error);
        throw error;
    }
}

async function remove(id) {
    try {
        const result = await categoryModel.findByIdAndDelete(id);
        return result;
    } catch (error) {
        console.log("Error deleting category:", error);
        throw error;
    }
}

async function update(id, body) {
    try {
        const { name, description } = body; 

        const category = await categoryModel.findById(id);
        if (!category) {
            throw new Error("Category not found");
        }

        category.name = name;
        category.description = description;

        const result = await category.save();
        return result;
    } catch (error) {
        console.log('Error updating category:', error);
        throw error;
    }
}

// thực hiện thao tác CRUD mongoDB
const productModel = require('./product.model');
const categoryModel = require('./category.model');

module.exports = {insert,getAll,remove,update,getProductById,getAllPage,getProductByKeyword,getSortPrice,getHotProducts, getProductByCategoryName};

async function insert(body){
    try {
        const {product_name,price,description,image,category,hot} = body;
        
        const categoryFind = await categoryModel.findById(category)
        if (!categoryFind){
            throw new Error(`Cannot insert`)
        }
        const proNew = new productModel({
            product_name,
            price,
            description,
            image,
            hot,
            category :{ 
                 
                  categoryId: categoryFind._id,
                  categoryName: categoryFind.name
            }
        })
        const result = await proNew.save()
        return result;
    } catch (error) {
        console.log('Error inserting');
        throw error
    }
}

async function getAll(body) {
    try {
        const result = await productModel.find()
        return result;
    } catch (error) {
        console.log("loi getall product",error);
        throw error
    }
    
}

async function getProductById(id) {
    try {
        const product = await productModel.findById(id);
        if (!product) {
            throw new Error("Product not found");
        }
        return product;
    } catch (error) {
        console.log("Error getting product by id:", error);
        throw error;
    }
}
async function remove(id) {
    try {
        const result = await productModel.findByIdAndDelete(id)
        return result;
    } catch (error) {
        console.log("loi xoa san pham",error);
        throw error
    }
}

async function update(id, body) {
    try {
        const { product_name, price, description, image,hot, category } = body;

        const product = await productModel.findById(id);
        if (!product) {
            throw new Error("Product not found");
        }

        let categoryUpdate = null;
        if (category) {
            const categoryFind = await categoryModel.findById(category);
            if (!categoryFind) {
                throw new Error("Category not found");
            }
            categoryUpdate = {
                categoryId: categoryFind._id,
                categoryName: categoryFind.name
            };
        } else {
            categoryUpdate = product.category;
        }

        product.product_name = product_name;
        product.hot = hot;
        product.price = price;
        product.description = description;
        product.image = image;
        product.category = categoryUpdate;

        const result = await product.save();
        return result;
    } catch (error) {
        console.log('Error editing product', error);
        throw error;
    }
}

async function getAllPage(page, limit) {
    try {
        page = parseInt(page) ? parseInt(page) : 1;
        limit = parseInt(limit) ? parseInt(limit) : 10;
        const skip = (page - 1) * limit;
        const result = await productModel.find().sort('-_id').skip(skip).limit(limit);
        const total = await productModel.countDocuments();
        const numberOfPages = Math.ceil(total / limit);

        return { result, countPro: total, countPage: numberOfPages, currentPage: page, limit: limit };
    } catch (error) {
        console.log('Error get all', error);
        throw error;
    }
}



// tim kiem san pham
async function getProductByKeyword(keyword) {
    try {
        // Tìm kiếm các sản phẩm có tên chứa từ khóa
        const products = await productModel.find({
            product_name: { $regex: keyword, $options: 'i' } 
        });
        return products;
    } catch (error) {
        console.log('Error getting products by keyword:', error);
        throw error;
    }
}

// sap xep theo so luon 
async function getSortPrice(order, limit) {
    try {
        let sortOrder;
        if (order === 'asc') {
            sortOrder = 1; // Sắp xếp tăng dần
        } else if (order === 'desc') {
            sortOrder = -1; // Sắp xếp giảm dần
        } else {
            throw new Error('Invalid order parameter. Please use "asc" or "desc".');
        }
        
        const products = await productModel.find().sort({ price: sortOrder }).limit(limit);
        return products;
    } catch (error) {
        console.log('Error sorting products by price:', error);
        throw error;
    }
}

// lay san pham hot 
async function getHotProducts(num) {
    try {
        
        const hotProducts = await productModel.find({ hot: parseInt(num)});
        return hotProducts;
    } catch (error) {
        console.log('Error getting hot products:', error);
        throw error;
    }
}
// lay san pham theo danh muc 
async function getProductByCategoryName(categoryName) {
    try {
        const category = await categoryModel.findOne({ name: categoryName   });
        if (!category) {
            throw new Error("Category not found");
        }

        const products = await productModel.find({ 'category.categoryName': categoryName });
        return products;
    } catch (error) {
        console.log('Error getting products by category name:', error);
        throw error;
    }
}
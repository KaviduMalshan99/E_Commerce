const Category = require('./CatagoryModel');

const getCategories = (req, res, next) => {
    Category.find()
        .then(response => {
            res.json({ response });
        })
        .catch(error => {
            res.json({ message: error });
        });
};

const addCategory = (req, res, next) => {
    const { CatagoryId, CatagoryName } = req.body;

    const category = new Category({
        CatagoryId: CatagoryId,
        CatagoryName: CatagoryName
    });

    category.save()
        .then(response => {
            res.json({ response });
        })
        .catch(error => {
            res.json({ error });
        });
};

const updateCategory = (req, res, next) => {
    const CatagoryId = req.params.id; // Assuming categoryId is passed in the URL params
    const { CatagoryName } = req.body;

    Category.findOneAndUpdate(
        { CatagoryId: CatagoryId },
        { $set: { CatagoryName: CatagoryName } },
        { new: true } // Return the updated document
    )
        .then(response => {
            res.json({ response });
        })
        .catch(error => {
            res.json({ error });
        });
};

const deleteCategory = (req, res, next) => {
    const CatagoryId = req.params.id; // Assuming categoryId is passed in the URL params

    Category.deleteOne({ CatagoryId: CatagoryId })
        .then(response => {
            res.json({ response });
        })
        .catch(error => {
            res.json({ error });
        });
};

module.exports = { getCategories, addCategory, updateCategory, deleteCategory };

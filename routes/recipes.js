const {Router} = require('express');
const router = Router();

const path = require('path');
const { unlink } = require('fs-extra');

const Recipe = require('../models/Recipe');

//get ALL recipes from the server
router.get('/',async (req,res) => {
    const recipes = await Recipe.find();
    res.json(recipes);
});
//get ONE recipe from the server
router.get('/:id',async (req,res) => {
    const recipe = await Recipe.findById(req.params.id);
    res.json(recipe);
});

// CREATES a new recipe
router.post('/',async(req,res)=> {
    const newRecipe = new Recipe(req.body);
    const recipe = await newRecipe.save();
    res.json({message: 'Recipe Saved',recipe});
});

// UPDATE one recipe
router.put('/:id',async(req,res)=>{
    const recipe = new Recipe(req.body);
    await recipe.updateOne({_id:req.params.id},{$set:recipe});
    res.json({message: 'Recipe Updated'});
});

//UPDATE RECIPE IMAGE
router.put('/image/:id',async(req,res)=> {
    const imagePath = req.file ? '/uploads/' + req.file.filename : "";
    await Recipe.updateOne({_id:req.params.id},{$set: {imagePath: imagePath}});
    res.json({message: 'Recipe Image Updated'});
});

// DELETES a recipe
router.delete('/:id', async (req, res)=>{
    try {
        const recipe = await Recipe.findByIdAndDelete(req.params.id);
        if (recipe.imagePath) {
            try {
                await unlink(path.resolve('./server/public/'+ recipe.imagePath));
            } catch (err) {
                res.json(err);
            }
        }
        res.json({message:'Recipe Deleted'});
    } catch (err) {
        res.json(err);
    }
});

//get ingredients list
// router.get('/ingredients/:term'), async (req,res)=>{
//     const regexp = new RegExp (req.params.term,i);
//     await Recipe.find({ingredients.name,regexp})
// }

module.exports = router;
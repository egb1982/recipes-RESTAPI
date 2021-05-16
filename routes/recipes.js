const {Router} = require('express');
const router = Router();
const path = require('path');
const { unlink } = require('fs-extra');
const sharp = require('sharp');

const Recipe = require('../models/Recipe');

//get ALL recipes from the server
router.get('/',async (req,res) => {
    const recipes = await Recipe.find();
    res.json(recipes);
});

// get Filtered recipes
router.get('/search/:term', async (req,res) => {
    const filter = new RegExp(req.params.term,'i');
    const recipes = await Recipe.find({ 
        $or: [ { name: { $regex: filter } },{ category: { $regex: filter } } ] 
    });
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
    await Recipe.findByIdAndUpdate(req.params.id,{$set:recipe});
    res.json({message: 'Recipe Updated'});
});

//UPDATE RECIPE IMAGE
router.put('/image/:id',async(req,res)=> {
    
    const recipeId = req.params.id;
    sharp(req.file.path)
    .resize({width:350, height:200})
    .toBuffer()
    .then(async data => {
        let image = {data, contentType: req.file.contentType }
        try {
            await Recipe.updateOne({_id:recipeId},{$set: {image:image}});
            await unlink(path.resolve(req.file.path));  
            res.json({message:"Recipe Image Updated"});    
        } catch (err){
            res.json(err);
        }
    })
});

// DELETES a recipe
router.delete('/:id', async (req, res)=>{
    try {
        await Recipe.findByIdAndDelete(req.params.id);
        res.json({message:'Recipe Deleted'});
    } catch (err) {
        res.json(err);
    }
});

module.exports = router;
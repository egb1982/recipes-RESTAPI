const {Schema,model} = require('mongoose');

const IngredientSchema = new Schema({ 
    name: { type: String },
    quantity: { type: String }
});

const StepSchema = new Schema({ 
    description: { type: String }
});

const ImageSchema = new Schema(
    {data:Buffer, contentType: String}
);

const RecipeSchema = new Schema({
    name: { type: String, required: true },
    difficulty: { type: Number, required: true },
    category: { type: String, required: true },
    ingredients: [IngredientSchema],
    steps: [StepSchema],
    imagePath: { type: String },
    imageId:{ type: String, unique:true},
    image: ImageSchema,
    created: { type: Date, default: Date.now }
});

module.exports = model('Recipe', RecipeSchema);

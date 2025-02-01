import React, { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import "react-toastify/dist/ReactToastify.css";
import { getRecipe } from '../api/RecipeService';
import { toastError, toastSuccess } from '../api/ToastService';
import { ToastContainer } from 'react-toastify';
const RecipeDetail = ({ updateRecipe, updateImage }) => {
  const { id } = useParams();
  const inputRef = useRef();
  const [recipe, setRecipe] = useState({
    id: '',
    name: '',
    category: '',
    cookTime: '',
    ingredients: '',
    recipe: '',
    photoUrl: '',
  });
  
  const fetchRecipe = async (id) => {
    try {
      const { data } = await getRecipe(id);
      setRecipe(data);
      console.log(data);
    } catch (error) {
      toastError(error.message);
      console.log(error);
    }
  }

  const selectImage = () => {
    inputRef.current.click();
  };

  const onChange = (event) => {
    setRecipe({... recipe, [event.target.name]: event.target.value});
  }

  const onUpdateRecipe = async (event) => {
    event.preventDefault();
    await updateRecipe(recipe);
    fetchRecipe(id);
  }

  const updatePhotoFn = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file, file.name);
      formData.append('id', id);
      await updateImage(formData);
      setRecipe((prev) => ({ ...prev, photoUrl: `${prev.photoUrl}?updated_at=${new Date().getTime()}` }));
      // console.log(data);
    } catch (error) {
      toastError(error.message);
      console.log(error);
    }
  }
  useEffect(() => {
    fetchRecipe(id);
  }, []);

  return (
    <>
      <Link to={'/'} className='link'><i className='bi bi-arrow-left'></i>&nbsp; Back to recipe list</Link>
      <div className='recipeInfo'>
        <div className='recipeInfo__details'>
          <img src={recipe.photoUrl} alt={`Profile photo of ${recipe.name}`} />
          <div className='recipeInfo__metadata'>
            <p className='recipeInfo__name'>{recipe.name}</p>
            <p className='recipeInfo__muted'>JPG or PNG. Max size of 10MB.</p>
            <button onClick={selectImage} className='btn'><i className='bi bi-cloud-upload'></i>Change Photo</button>
          </div>
        </div>
        {/* Form */}
        <div className='recipeInfo__settings'>
          <form className="form" onSubmit={onUpdateRecipe}>
            <div className="recipe-details">
              <input type="hidden" defaultValue={recipe.id} name="id" required />
              <div className="input-box">
                <span className="details">Name</span>
                <input type="text" onChange={onChange} value={recipe.name} name="name" required />
              </div>
              <div className="input-box">
                <span className="details">Category</span>
                <input type="text" onChange={onChange} value={recipe.category} name="category" required />
              </div>
              <div className="input-box">
                <span className="details">Cooking Time</span>
                <input type="text" onChange={onChange} value={recipe.cookTime} name="cookTime" required />
              </div>
              <div className="input-box">
                <span className="details">Ingredients</span>
                <input type="text" onChange={onChange} value={recipe.ingredients} name="ingredients" required />
              </div>
              <div className="input-box">
                <span className="details">Recipe</span>
                <input type="text" onChange={onChange} value={recipe.recipe} name="recipe" required />
              </div>
            </div>
            <div className="form_footer">
              <button type="submit" className="btn">Save</button>
            </div>
          </form>
        </div>
      </div>
      <form style={{ display: 'none' }}>
        <input type='file' ref={inputRef} onChange={(event) => updatePhotoFn(event.target.files[0])} name='file' accept='image/*' />
      </form>
    </>
  )
}

export default RecipeDetail
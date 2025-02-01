import React from 'react'
import { Link } from 'react-router-dom'

const Recipe = ({recipe}) => {
  return (
    <Link to={`/recipes/${recipe.id}`} className="recipe__item">
        <div className='recipe__header'>
            <div className='recipe__image'>
                <img src={recipe.photoUrl} alt={recipe.name}/>
            </div>
            <div className='recipe__details'>
                <p className='recipe_name'>{recipe.name.substring(0,15)}</p>
                <p className='recipe_title'>{recipe.category == 'Main' ?
                <i className='bi bi-food'></i> : <i className='bi bi-eye'></i>
            }{recipe.category}</p>
            </div>
        </div>
        <div className='recipe__body'>
            <p>
                <i className='bi bi-envelope'></i> {recipe.cookTime}
            </p>
            <p>
                <i className='bi bi-geo'></i> {recipe.ingredients.substring(0,15)}
            </p>
            <p>{recipe.recipe.substring(0,15)}</p>
            </div>
    </Link>
  )
}

export default Recipe
import { useEffect, useState, useRef } from 'react';
import './App.css';
import "react-toastify/dist/ReactToastify.css";
import { getRecipes, saveRecipe, updatePhoto, updateRecipe } from './api/RecipeService';
import Header from './components/Header';
import { Navigate, Routes, Route } from 'react-router-dom';
import RecipeList from './components/RecipeList';
import RecipeDetail from './components/RecipeDetail';
import { toastError, toastSuccess } from './api/ToastService';
import { ToastContainer } from 'react-toastify';

function App() {
  const [data, setData] = useState({});
  const [currPage, setCurrPage] = useState(0);
  const [file, setFile] = useState(undefined);
  const [values, setValues] = useState({
    name: '',
    category: '',
    cookTime: '',
    ingredients: '',
    recipe: '',
  });
  const modalRef = useRef();
  const fileRef = useRef();
  
  //updates data on change
  const onChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  }

  useEffect(() => {
    const message = localStorage.getItem('toastMessage');
    if (message) {
      toastSuccess(message);
      localStorage.removeItem('toastMessage');
    }
  }, []);

  const toggleModal = (show) => {
    show ? modalRef.current.showModal() : modalRef.current.close();
  };
  const getAllRecipes = async (page = 0, size = 10) => {
    try {
      setCurrPage(page);
      const { data } = await getRecipes(page, size);
      setData(data || {});
    } catch (error) {
      console.log(error);
      toastError(error.message);
      fileRef.current.value = null;
    }
  }

  const updateRecipe = async (recipe) => {
    try {
      const {data} = await saveRecipe(recipe);
      console.log(data);
      toastSuccess('Recipe updated.');
    }catch(error){
      toastError(error.message);
      console.log(error);
    }
  }

  const updateImage = async (formData) => {
    try {
      const { data: photoUrl } = await updatePhoto(formData);
          toastSuccess('Image updated.');
    }catch(error){
      toastError(error.message);
      console.log(error);
    }
  }

  const handleNewRecipe = async (event) => {
    event.preventDefault();
    try {
      const { data } = await saveRecipe(values);
      const formData = new FormData();
      formData.append('file', file, file.name);
      formData.append('id', data.id);
      const { data: photoUrl } = await updatePhoto(formData);
      formData.append('photoUrl', photoUrl);
      toggleModal(false);
      setFile(undefined);
      fileRef.current.value = null;
      setValues({
        name: '',
        category: '',
        cookTime: '',
        ingredients: '',
        recipe: '',
      });
      getAllRecipes();
      toastSuccess('Added recipe successfully.');
    }catch(error){
      toastError(error.message);
      console.log(error);
    }
  }

  useEffect(() => {
    getAllRecipes();
  }, [])

  return (
    <>
      <ToastContainer />
      <Header toggleModal={toggleModal} nbOfRecipes={data.totalElements} />
      <main className='main'>
        <div className='container'>
          <Routes>
            <Route path='/' element={<Navigate to={'/recipes'} />} />
            <Route path="/recipes" element={<RecipeList data={data} currentPage={currPage} getAllRecipes={getAllRecipes} />} />
            <Route path="/recipes/:id" element={<RecipeDetail updateRecipe={updateRecipe} updateImage={updateImage}/>} />
          </Routes>
        </div>
      </main>

      {/* Modal */}
      <dialog ref={modalRef} className="modal" id="modal">
        <div className="modal__header">
          <h3>New Recipe</h3>
          <i onClick={() => toggleModal(false)} className="bi bi-x-lg"></i>
        </div>
        <div className="divider"></div>
        <div className="modal__body">
          <form onSubmit={handleNewRecipe}>
            <div className="recipe-details">
              <div className="input-box">
                <span className="details">Name</span>
                <input type="text" value={values.name} onChange={onChange} name='name' required />
              </div>
              <div className="input-box">
                <span className="details">Category</span>
                <input type="text" value={values.category} onChange={onChange} name='category' required />
              </div>
              <div className="input-box">
                <span className="details">Cooking Time</span>
                <input type="text" value={values.cookTime} onChange={onChange} name='cookTime' required />
              </div>
              <div className="input-box">
                <span className="details">Ingredients</span>
                <input type="text" value={values.ingredients} onChange={onChange} name='ingredients' required />
              </div>
              <div className="input-box">
                <span className="details">Recipe</span>
                <input type="text" value={values.recipe} onChange={onChange} name='recipe' required />
              </div>
              <div className="file-input">
                <span className="details">Recipe Photo</span>
                <input type="file" ref={fileRef} value={values.photoUrl} onChange={(event) => {
                  setFile(event.target.files[0]);
                }
                } name='photoUrl' required />
              </div>
            </div>
            <div className="form_footer">
              <button onClick={() => toggleModal(false)} type='button' className="btn btn-danger">Cancel</button>
              <button type='submit' className="btn" >Save</button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
}

export default App;

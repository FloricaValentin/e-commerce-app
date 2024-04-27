import React,{useState} from 'react'
import {storage, db} from '../../config/Config'
const AddProducts = () => {

  const [productName,setProductName] = useState('')
  const [productImage,setProductImage] = useState(null)
  const [productValue,setProductValue] = useState(0)
  const [error,setError] = useState('')

  const types = ['image/png', 'image/jpeg', 'image/jpg'];

  const productImageHandler = (e) => {
    let selectedFile = e.target.files[0]
    if (selectedFile && types.includes(selectedFile.type)) {
      setProductImage(selectedFile)
      setError('')
     } else{
        setProductImage(null);
        setError('Please select a valid image format png,jpeg or jpg ')
      }
  }

  const addProduct  = (e) => {
    e.preventDefault();
    console.log(productImage,productName,productValue)
    const uploadTask = storage.ref(`product-images/${productImage.name}`).put(productImage);
    uploadTask.on('state_changed', snapshot => {
      const progress = (snapshot.bytesTransferred/snapshot.totalBytes) * 100;
      console.log(progress)
    },error => {
      setError(error.message)
    }, () => {
      storage.ref('product-images').child(productImage.name).getDownloadURL().then(url=> {
        db.collection('Products').add({
          ProductName: productName,
          ProductValue: Number(productValue),
          ProductImage: url
        }).then(() =>{
          setProductName('')
          setProductValue(0)
          setProductImage('')
          setError('')
          document.getElementById('file').value = '';
        }).catch(error => setError(error.message))
      })
    })
  }
  return (
    <div className='container'>
        <h2 className='title'>Add Products</h2>
        <br />
        <form className='form-group' onSubmit={addProduct}>
          <label htmlFor='product-name'>Product Name</label>
          <input type="text" className='form-control' required 
          onChange={(e)=> setProductName(e.target.value)} value={productName} />
          <br />
          <label htmlFor='product-value'>Product Value</label> 
          <input type="number" className='form-control' required 
          onChange={(e)=> setProductValue(e.target.value)} value={productValue}/>
          <br />
          <label htmlFor='product-img'>Product Image</label>
          <br />
          <input type="file" className='form-control' 
          onChange={productImageHandler} id='file' />
          <br />
          <button className='btn btn-success btn-md addbutton' >Add</button> 
        </form>
        {error && <span>{error}</span>}
    </div>
  )
}

export default AddProducts
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useState } from 'react'
import {app} from "../firebase.js";
import  {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";

export default function CreateListing() {
  const {currentUser} = useSelector((state) => state.user )
  console.log(currentUser)
  const [files, setFiles] = useState([])
  const [formData,setFormData] = useState({
    imageUrls:[],
    name:"",
    description:"",
    type:"rent",
    address:"",
    bedrooms:1,
    bathrooms:1,
    regularPrice:50,
    discountPrice:0,
    offer:false,
    parking:false,
    furnished:false,


  })

  const [imageUploadError,setImageUploadError] = useState(false);
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  
  console.log(formData)
  const handleImageSubmit = (e) => {
    setIsUploading(true)
    if ( files.length > 0  && files.length + formData.imageUrls.length < 7 ) {

      const promises = [];

    for (let i = 0; i < files.length; i++ ) {
      
      promises.push(storeImage(files[i]));


    } 
    Promise.all(promises).then((urls) => {
      setFormData({...formData,imageUrls:formData.imageUrls.concat(urls)});
      
      setImageUploadError(false)
      setIsUploading(false)
      
    })
    
    .catch((err) =>  {
      setImageUploadError("Image upload failed (2 mb max per image)")
      setIsUploading(false)
    });
    
    } else {
      setImageUploadError("You can only upload 6 images per listing")
      setIsUploading(false)
    }

  }
  const storeImage = async (file) => {

    return new Promise((resolve,reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage,fileName);
      const uploadTask = uploadBytesResumable(storageRef,file);

      uploadTask.on(
        "state_changed",
     (snapshot) => {
      const progress = 
         (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done `)
     } , 
        (error) => {
          reject(error);

        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL)
          })
        }
      )

    })


  }


  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls:formData.imageUrls.filter((_,i) =>  i !== index )
    })
  }

  const handleChange = (e) => {
    if(e.target.id  === "sale" || e.target.id==="rent" ) {
      setFormData({
        ...formData,
        type:e.target.id
      })
    }
    if(e.target.id ==="parking" || e.target.id === "furnished" || e.target.id ==="offer" ) {
      setFormData({
        ...formData,
         [e.target.id]:e.target.checked
      })

    }
    if(e.target.type === "number" || e.target.type === "text" || e.target.type==="textarea"  ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value
      })
    } 
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if(formData.imageUrls.length < 1) return setError("You must upload at least one image")
      if(formData.regularPrice < formData.discountPrice) return setError("Discount price must be lower than Regular price")
      setLoading(true);
      setError(false);
      const res = await fetch("/api/listing/create",{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
        },
        body:JSON.stringify({
          ...formData,
          userRef:currentUser._id
        }),
       
      });
      const data = await res.json();
      console.log(data)
      setLoading(false);
      if(data.success === false) {
        setError(data.message)
      }
       navigate(`/listing/${data._id}`)
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }
  return (
    <main className='p-3 max-w-4xl mx-auto ' >
      <h1 className='text-3xl font-semibold text-center my-7 ' >
        Create a Listing
      </h1>
      <form onSubmit= {handleSubmit} className='flex flex-col sm:flex-row gap-4 ' >
        <div className="flex flex-col  gap-4 flex-1   ">
          <input onChange={handleChange} value={formData.name} type="text" placeholder='Name' className='border p-3 rounded-lg ' id='name' maxLength="62" minLength="10" required  />
          <textarea onChange={handleChange} value={formData.description} type="text" placeholder='description' className='border p-3 rounded-lg ' id='description' required />
          <input onChange={handleChange} value={formData.address} type="text" placeholder='Address' className='border p-3 rounded-lg ' id='address'  required />

          <div className="flex gap-6 flex-wrap ">
            <div className="flex gap-2 ">
              <input onChange={handleChange} checked={formData.type === "sale"}  type="checkbox" id='sale' className='w-5'  />
              <span>Sell</span>
            </div>
            <div className="flex gap-2 ">
              <input onChange={handleChange}   checked={formData.type === "rent"} type="checkbox" id='rent' className='w-5'  />
              <span>Rent</span>
            </div>
            <div className="flex gap-2 ">
              <input onChange={handleChange}  checked={formData.parking} type="checkbox" id='parking' className='w-5'  />
              <span>Parking Spot</span>
            </div>
            <div className="flex gap-2 ">
              <input onChange={handleChange}   checked={formData.furnished} type="checkbox" id='furnished' className='w-5'  />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2 ">
              <input onChange={handleChange}  checked={formData.offer} type="checkbox" id='offer' className='w-5'  />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2 ">
              <input onChange={handleChange} value={formData.bedrooms} type="number" id='bedrooms' min="1" max="10" required className='p-3 border border-gray-300 rounded-lg ' />
              <p>Beds:</p>
            </div>
            <div className="flex items-center gap-2 ">
              <input onChange={handleChange} value={formData.bathrooms} type="number" id='bathrooms' min="1" max="10" required className='p-3 border border-gray-300 rounded-lg ' />
              <p>Baths:</p>
            </div>
            
            <div className="flex items-center gap-2 ">
              <input onChange={handleChange}  value={formData.regularPrice} type="number" id='regularPrice' min="50" max="100000" required className='p-3 border border-gray-300 rounded-lg ' />
             <div className="flex flex-col items-center">
              <p>Regular Price</p>
              <span className='text-xs' >($ / month) </span></div>
            </div>
            {formData.offer &&  
            <div className="flex items-center gap-2 ">
              <input onChange={handleChange}  value={formData.discountPrice}  type="number" id='discountPrice' min="0" max="100000"  required className='p-3 border border-gray-300 rounded-lg ' />
              <div className="flex flex-col items-center ">
              <p>Discount price</p>
              <span className='text-xs' >($ / month) </span>
              </div>
            </div>
            }
          </div>
        </div>
        <div className="flex flex-col flex-1 ">
          <p className='font-semibold  ' >Images: 
            <span className='font-normal text-gray-600 ml-2  ' >The first image
             will be the cover (max 6) </span>


           </p>
           <div className="flex gap-4 ">
            <input onChange={(e) => setFiles(e.target.files)  } type="file" className='p-3 border border-gray-300 rounded w-full ' id='images' accept='image/*' multiple  />
            <button disabled={isUploading} type='button' onClick={handleImageSubmit} className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80
              ' > {isUploading ? "Uploading...":"Upload" } </button>
           </div>
           <p className="text-red-700  " >
        {imageUploadError && imageUploadError }
        
      </p>
      {
      formData.imageUrls.length > 0 && formData.imageUrls.map((url,index) => (
      <div className="flex justify-between p-3 border items-center " key={index}> 
      <img src={url} alt="listing-image" className="w-20 h-20 rounded-lg object-cover  " />
      <button type="button" onClick = {() => handleRemoveImage(index)}  className="p-3 text-red-700 rounded-lg hover:opacity-75 uppercase "  >Delete</button>
      </div> 
      )  
      )} 
           <button 
           disabled={loading || isUploading }
           className='p-3 bg-slate-700 text-white rounded-lg uppercase 
           hover:opacity-90 disabled:opacity-80  ' >
            {loading? "Creating...":"Create Listing"}
           
           </button>
          {error &&  <p className="text-red-700 text-sm " > {error} </p>}
        </div>
      
      </form>
    
    </main>
  )
}
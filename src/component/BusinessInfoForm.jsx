import React,{ useEffect } from "react";
import { useState } from "react";
import Select from "react-dropdown-select";
import axios from "axios"
import { RxCross2 } from "react-icons/rx";
import toast from 'react-hot-toast';


const BusinessInfoForm = () => {
  const [formData, setFormData] = useState({
    brandName: "",
    emailAddress: "",
    contactNumber: "",
    contactPerson: "",
    outletAddress: "",
    businessType: "",
    cuisinesServed: [],
    instaLink: "",
    fssaiLicenceNumber: "",
    image: null,
    gst:"",
    facebookLink:"",
    youtubeLink:"",
  });

  
  const[fileName,setFileName] = useState("No selected file")
  const [image , setImage]= useState();

const options = [
  { id: "Chinese", name: 1 },
  { id: "Italian", name: 2 },
  { id: "Bengali", name: 3 },
  { id: "North Indian", name: 4 },
  { id: "South Indian", name: 5 },
  { id: "American", name: 6 },
  { id: "European", name: 7 }
];

 
  var userID = localStorage.getItem("user");
  console.log("user id", userID);
  const resId = userID;
  const id = userID;
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const [pic ,setPic] = useState();
  const handleImageChange = async (pics) => {
    //setLoading(true);
    console.log(pics);
    const formData = new FormData();
    formData.append("file", pics);
    

    let config = {
      
      method: "post",
      maxBodyLength: Infinity,
      url: "https://seashell-app-lgwmg.ondigitalocean.app/api/fileUpload",
      // headers: {
      //   ...data.getHeaders(),
      // },
      data: formData,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        console.log(response.data.data.url);
        setPic(response.data.data.url);
        // formData.image = response?.data?.data?.url;
        // console.log(formData.image);

        
      })
      .catch((error) => {
        console.log(error);
      });
    //setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Handle form submission here
    
    formData.image = pic;
    console.log(formData);
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `https://seashell-app-lgwmg.ondigitalocean.app/api/restaurants/${id}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: formData,
    };
    
    axios.request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      setFormData({
      brandName: "",
      emailAddress: "",
      contactNumber: "",
      contactPerson: "",
      outletAddress: "",
      businessType: "",
      cuisinesServed: [],
      instaLink: "",
      fssaiLicenceNumber: "",
      image: null,
      gst:"",
      facebookLink:"",
      youtubeLink:"",
      
    });
toast.success("details updated");  
    getdata();
    })
      
    .catch((error) => {
      console.log(error);
      toast.error("error updateing data");  
    });
    
    
  };


const getdata = async() =>{
 let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://seashell-app-lgwmg.ondigitalocean.app/api/getRestaurantDetails/${id}`,
      headers: { 
        // 'Content-Type': 'application/json'
      },
    };
    
    axios.request(config)
    .then((response) => {
      // console.log(JSON.stringify(response.data));
      console.log((response.data.restaurant));
 const cuisi = response?.data?.restaurant?.cuisineServed?.map(cuisine => ({
        id: cuisine,
      }));
      console.log(cuisi);
      setFormData({
        brandName: response?.data?.restaurant?.name,
        emailAddress: response?.data?.restaurant?.email,
        contactNumber: response?.data?.restaurant?.contact,
        contactPerson: response?.data?.restaurant?.contactPerson,
        outletAddress: response?.data?.restaurant?.outletAddress,
        businessType: response?.data?.restaurant?.businessType,
        cuisinesServed: cuisi,
        instaLink: response?.data?.restaurant?.instaLink,
        facebookLink:response?.data?.restaurant?.facebookLink,
        youtubeLink:response?.data?.restaurant?.youtubeLink,
        fssaiLicenceNumber: response?.data?.restaurant?.fssaiLicenseNo,
        image: response?.data?.restaurant?.image,
        gst: response?.data?.restaurant?.gst,
      });
      console.log(formData)
      console.log(response.data.restaurant.profile.image)
    })
    .catch((error) => {
      console.log(error);
    });
  
}
  useEffect(() => {
   getdata();
  },[id])

  const [loader, setloader] = useState(false);

  return (
    <div>
      <form className="flex flex-col gap-3 mx-6" onSubmit={handleSubmit}>
        <div>
          <label className="w-full font-semibold text-left text-m flex flex-col gap-3">
            Brand Logo:
            <input
              type="file"
              accept="image/*"
              name="image"
              hidden
              onChange={(e) => {
                // e.target.files[0] && setFileName(e.target.files[0].name);
                if (e.target.files)
                  setImage(URL.createObjectURL(e.target.files[0]));
                handleImageChange(e.target.files[0]);
                if (e.target.files) {
                  console.log("inside onchange");
                  console.log(e.target.files);
                  console.log(URL.createObjectURL(e.target.files[0]));
                  // setImage(URL.createObjectURL(e.target.files[0]))
                }
              }}
              // onChange={({target : {files}}) => {
              //   files[0] && setFileName(files[0].name)
              //   if(files){
              //     setImage(URL.createObjectURL(files[0]))
              //   }
              // }}
            />
            {formData.image ? (
              <div className="flex w-fit gap-3 relative">
                <img
                  src="upload.png"
                  alt="upload-logo"
                  width={80}
                  height={80}
                  className="cursor-pointer "
                />
                <img
                  src={formData.image}
                  alt={fileName}
                  width={80}
                  height={80}
                  className="border rounded-lg relative hover:opacity-50"
                />
                <RxCross2
                  className="absolute font-bold text-[1rem] w-6 right-1 top-[8px]  cursor-pointer text-[#426CFF]"
                  // onClick={() => {
                  //   setFileName("No selected file")
                  //   setImage(null)
                  // }}
                />
              </div>
            ) : (
              <img
                src="upload.png"
                alt="upload-logo"
                width={80}
                height={80}
                className="cursor-pointer"
              />
            )}
          </label>
        </div>

        <div className="flex flex-col gap-4 mt-4">
          <div className="flex md:flex-row flex-col md:gap-0 gap-5 justify-between">
            <label className="md:w-[31%] w-full text-left text-m flex flex-col gap-2">
              <p className="font-semibold">Brand Name:</p>
              <input
                type="text"
                name="brandName"
                placeholder="Enter Brand Name"
                value={formData.brandName}
                onChange={handleChange}
                className="w-full text-richblack-5 border rounded-[0.5rem] pl-[12px] h-[3rem] outline-none"
              />
            </label>

            <label className="md:w-[31%] w-full text-left text-m flex flex-col gap-2">
              <p className="font-semibold">Email Address:</p>
              <input
                type="email"
                name="emailAddress"
                placeholder="Enter Email Id"
                value={formData.emailAddress}
                onChange={handleChange}
                className="w-full text-richblack-5 border rounded-[0.5rem] pl-[12px] h-[3rem] outline-none"
              />
            </label>

            <label className="md:w-[31%] w-full text-left text-m flex flex-col gap-2">
              <p className="font-semibold">Contact Number:</p>
              <input
                type="text"
                name="contactNumber"
                placeholder="Enter Contact Number"
                value={formData.contactNumber}
                onChange={handleChange}
                className="w-full text-richblack-5 border rounded-[0.5rem] pl-[12px] h-[3rem] outline-none"
              />
            </label>
          </div>

          <div className="flex md:flex-row flex-col  md:gap-0 gap-5 justify-between">
            <label className="md:w-[31%] w-full text-left text-m flex flex-col gap-2">
              <p className="font-semibold">Contact Person:</p>
              <input
                type="text"
                name="contactPerson"
                placeholder="Enter Contact Person"
                value={formData.contactPerson}
                onChange={handleChange}
                className="w-full text-richblack-5 border rounded-[0.5rem] pl-[12px] h-[3rem] outline-none"
              />
            </label>

            <label className="md:w-[31%] w-full text-left text-m flex flex-col gap-2">
              <p className="font-semibold">Outlet Address:</p>
              <input
                type="text"
                name="outletAddress"
                placeholder="Enter Address"
                value={formData.outletAddress}
                onChange={handleChange}
                className="w-full text-richblack-5 border rounded-[0.5rem] pl-[12px] h-[3rem] outline-none"
              />
            </label>

            <label className="md:w-[31%] w-full text-left text-m flex flex-col gap-2">
              <p className="font-semibold">Business Type:</p>
              <select
                name="businessType"
                value={formData.businessType}
                onChange={handleChange}
                className="w-full text-richblack-5 border rounded-[0.5rem] px-[12px] h-[3rem] outline-none"
              >
                <option value="">Select Business Type</option>
                 <option value="Cafe">Cafe</option>
                <option value="Fine Dining">Fine Dining</option>
                <option value="QSR">QSR</option>
                <option value="Buffet">Buffet</option>
                <option value="Hotel">Hotel</option>
                {/* Add more business types here */}
              </select>
            </label>
          </div>

          <div className="flex md:flex-row flex-col  md:gap-0 gap-5 justify-between">
            {/* <label className="md:w-[31%] w-full font-semibold text-left text-m flex flex-col gap-2">
              Cuisines Served:
              <select
                name="cuisinesServed"
                value={formData.cuisinesServed}
                onChange={handleCuisineChange}
                className="w-full text-richblack-5 border rounded-[0.5rem] pl-[12px] h-[3rem] outline-none"
              >
                <option value="Italian">Italian</option>
                <option value="Mexican">Mexican</option>
                <option value="Chinese">Chinese</option>
              </select>
            </label> */}
            <label className="md:w-[31%] w-full font-semibold text-left text-m flex flex-col gap-2">
              Cuisines Served:
              <Select
                name="cuisinesServed"
                options={options}
                labelField="id"
                valueField="id"
                multi
                onChange={(selectedOptions) =>
                  setFormData({
                    ...formData,
                    cuisinesServed: selectedOptions.map((option) => option.id),
                  })
                }
                color="#004AAD"
                className="w-full text-richblack-5 border rounded-[0.5rem] pl-[12px] h-[3rem] outline-none"
              />
            </label>

            
            <label className="md:w-[31%] w-full text-left text-m flex flex-col gap-2">
              <p className="font-semibold">GST Number(Optional)</p>
              <input
                type="text"
                name="gst"
                placeholder="19654323456543"
                value={formData.gst}
                onChange={handleChange}
                className="w-full text-richblack-5 border rounded-[0.5rem] pl-[12px] h-[3rem] outline-none"
              />
            </label>

            <label className="md:w-[31%] w-full text-left text-m flex flex-col gap-2">
              <p className="font-semibold">FSSAI Licence Number:</p>
              <input
                type="text"
                name="fssaiLicenceNumber"
                placeholder="Enter FSSAI"
                value={formData.fssaiLicenceNumber}
                onChange={handleChange}
                className="w-full text-richblack-5 border rounded-[0.5rem] pl-[12px] h-[3rem] outline-none"
              />
            </label>
          </div>

          <div className="flex md:flex-row flex-col md:gap-0 gap-5 justify-between">
          <label className="md:w-[31%] w-full text-left text-m flex flex-col gap-2">
              <p className="font-semibold">Instagram Link:</p>
              <input
                type="text"
                name="instaLink"
                placeholder="instagram.com/chowman12"
                value={formData.instaLink}
                onChange={handleChange}
                className="w-full text-richblack-5 border rounded-[0.5rem] pl-[12px] h-[3rem] outline-none"
              />
            </label>

            <label className="md:w-[31%] w-full text-left text-m flex flex-col gap-2">
              <p className="font-semibold">Facebook Link (Optional)</p>
              <input
                type="text"
                name="facebookLink"
                placeholder="facebook.com/chowman12"
                value={formData.facebookLink}
                onChange={handleChange}
                className="w-full text-richblack-5 border rounded-[0.5rem] pl-[12px] h-[3rem] outline-none"
              />
            </label>

            <label className="md:w-[31%] w-full text-left text-m flex flex-col gap-2">
              <p className="font-semibold">YouTube Link (Optional)</p>
              <input
                type="text"
                name="youtubeLink"
                placeholder="youtube.com/chowman12"
                value={formData.youtubeLink}
                onChange={handleChange}
                className="w-full text-richblack-5 border rounded-[0.5rem] pl-[12px] h-[3rem] outline-none"
              />
            </label>
          </div>
        </div>

        <div className="w-[50%] md:w-full m-4 mx-auto">
          <button
            className="bg-[#004AAD] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Save changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default BusinessInfoForm;

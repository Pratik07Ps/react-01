import React, { useState } from 'react';
import './ProfilePage.css';

const ProfilePage = ({ user, onImageUpdate }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(user.profileImage || '');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) {
      alert('Please select an image to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedImage);

    try {upload-profile-image
      const response = await fetch('http://127.0.0.1:5000/upload-profile-image', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        alert('Profile image updated successfully!');
        onImageUpdate(data.profileImageUrl); // Update parent component
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div className="profile-page">
      <h2>Profile Page</h2>
      <div className="profile-image-container">
        <img src={preview} alt="Profile" className="profile-image" />
      </div>
      <input type="file" onChange={handleImageChange} accept="image/*" />
      <button onClick={handleUpload}>Upload Image</button>
    </div>
  );
};

export default ProfilePage;

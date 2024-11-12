import { useState, useEffect } from "react";
import { Card, Button, Modal, Input, message, Spin } from "antd";
import { EditOutlined, DeleteOutlined, PictureOutlined, UserOutlined, MailOutlined } from "@ant-design/icons";
import { db } from "../config/firebaseConfig";
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";

const Photos = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newPhotoURL, setNewPhotoURL] = useState(""); // URL input
  const [name, setName] = useState(""); // Name input
  const [email, setEmail] = useState(""); // Email input
  const [editingPhoto, setEditingPhoto] = useState(null); // Track which photo is being edited

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const photosCollection = collection(db, "photos");
      const snapshot = await getDocs(photosCollection);
      const photoList = snapshot.docs.map((doc) => ({
        id: doc.id, // Add unique Firestore document ID
        ...doc.data(),
      }));
      setPhotos(photoList);
    } catch (error) {
      console.error("Error fetching photos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleUpload = async () => {
    if (!newPhotoURL || !name || !email) {
      message.error("Please enter photo URL, name, and email!");
      return;
    }

    try {
      await addDoc(collection(db, "photos"), {
        url: newPhotoURL,
        name: name,
        email: email,
        timestamp: new Date(),
      });

      message.success("Photo added successfully!");
      setIsModalVisible(false);
      setNewPhotoURL("");
      setName("");
      setEmail("");
      fetchPhotos();
    } catch (error) {
      message.error("Error adding photo: " + error.message);
    }
  };

  const handleDelete = async (photoId) => {
    try {
      await deleteDoc(doc(db, "photos", photoId));
      message.success("Photo deleted successfully!");
      fetchPhotos();
    } catch (error) {
      message.error("Error deleting photo: " + error.message);
    }
  };

  const openEditModal = (photo) => {
    setEditingPhoto(photo);
    setName(photo.name);
    setEmail(photo.email);
    setIsModalVisible(true);
  };

  const handleEditSave = async () => {
    if (!name.trim() || !email.trim()) {
      message.error("Name and email cannot be empty!");
      return;
    }

    try {
      const photoRef = doc(db, "photos", editingPhoto.id);
      await updateDoc(photoRef, { name: name, email: email });
      message.success("Photo updated successfully!");

      setIsModalVisible(false);
      setEditingPhoto(null);
      fetchPhotos();
    } catch (error) {
      message.error("Error updating photo: " + error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="md:p-1 pt-10">
      <div className="flex justify-between items-center mb-4 bg-white py-3 px-4 rounded shadow-md">
        <h2 className="text-xl font-semibold text-gray-700">Users Photos List</h2>
        <Button
          type="none"
          onClick={() => setIsModalVisible(true)}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold"
        >
          Add Photo
        </Button>
      </div>

      {/* Photos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {photos.map((photo) => (
        <Card
        key={photo.id}
        className="shadow-lg rounded-lg  overflow-hidden"
      >
        <div className="flex flex-col items-center p-4">
          <img
            src={photo.url}
            alt={photo.name}
            className="w-36 h-36 object-cover rounded-full border-4 transition-transform transform hover:scale-105 hover:shadow-xl border-green-500 shadow-lg"
          />
          <h3 className="text-lg font-semibold text-gray-800 mt-4">name : {photo.name}</h3>
          <p className="text-gray-500 text-sm mb-4"> email : {photo.email}</p>
          <div className="flex space-x-4">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => openEditModal(photo)}
              className="text-blue-600 hover:text-blue-700"
            >
              Edit
            </Button>
            <Button
              type="text"
              icon={<DeleteOutlined />}
              danger
              onClick={() => handleDelete(photo.id)}
              className="text-red-600 hover:text-red-700"
            >
              Delete
            </Button>
          </div>
        </div>
      </Card>
      
        ))}
      </div>

      {/* Add/Edit Photo Modal */}
      <Modal
        title={editingPhoto ? "Edit Photo" : "Add New Photo"}
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingPhoto(null);
        }}
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="none"
            onClick={editingPhoto ? handleEditSave : handleUpload}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {editingPhoto ? "Save Changes" : "Upload Photo"}
          </Button>,
        ]}
      >
        <Input
          placeholder="Photo URL"
          value={newPhotoURL}
          onChange={(e) => setNewPhotoURL(e.target.value)}
          prefix={<PictureOutlined />}
          disabled={!!editingPhoto}
          className="mb-4"
        />
        <Input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          prefix={<UserOutlined />}
          className="mb-4"
        />
        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          prefix={<MailOutlined />}
        />
      </Modal>
    </div>
  );
};

export default Photos;

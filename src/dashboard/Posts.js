import React, { useEffect, useState } from 'react';
import { db } from '../config/firebaseConfig';
import { collection, onSnapshot, addDoc,doc,updateDoc, deleteDoc } from 'firebase/firestore';
import { Button, Modal, Input, message, Spin, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import PostCard from '../components/PostCard';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [content, setContent] = useState('');
  const [profileUrl, setProfileUrl] = useState('');
  const [postImage, setPostImage] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state for posts

  // Fetch posts from Firestore in real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'posts'), (snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false); // Set loading to false once the data is loaded
    });
    return unsubscribe;
  }, []);

  // Add a new post to Firestore
  const addPost = async () => {
    if (!content.trim() || !profileUrl.trim()) {
      message.warning('Please enter content and profile URL');
      return;
    }

    setLoading(true);
    try {
      const postData = { content, profileUrl, postImage: postImage || '' };
      await addDoc(collection(db, 'posts'), postData);
      message.success('Post added successfully');
      setContent('');
      setProfileUrl('');
      setPostImage(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding post:", error);
      message.error('Failed to add post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Edit a post
  const handleEdit = async (postId, newContent, newImage) => {
    try {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, { content: newContent, postImage: newImage });
      message.success('Post updated successfully');
    } catch (error) {
      console.error("Error updating post:", error);
      message.error('Failed to update post. Please try again.');
    }
  };

  // Delete a post
  const handleDelete = async (postId) => {
    try {
      await deleteDoc(doc(db, 'posts', postId));
      message.success('Post deleted successfully');
    } catch (error) {
      console.error("Error deleting post:", error);
      message.error('Failed to delete post. Please try again.');
    }
  };

  // Modal for adding new post
  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);

  // Handle image upload
  const handleImageUpload = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => setPostImage(reader.result);
    reader.readAsDataURL(file);
    return false; // Prevent default upload behavior
  };

  return (
    <div className="space-y-6 md-py-2 md:pt-1 pt-10">
      {/* Navbar */}
      <div className="flex justify-between items-center bg-white shadow p-4 rounded">
        <h2 className="text-xl font-semibold">Post List</h2>
        <Button
          type="none"
          icon={<PlusOutlined />}
          onClick={handleModalOpen}
          className="bg-green-600 text-white hover:bg-green-700"
        >
          Add Post
        </Button>
      </div>

      {/* Loader while posts are loading */}
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Spin size="large" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {posts.length === 0 ? (
            <p>No posts available</p>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      )}

<Modal
  title="Add New Post"
  visible={isModalOpen}
  onOk={addPost}
  onCancel={handleModalClose}
  okText={loading ? <Spin /> : 'Add'}
  cancelText="Cancel"
  okButtonProps={{ disabled: loading }}
  width="90%"  // Set a default width for mobile view
  bodyStyle={{ padding: '15px' }}
  destroyOnClose={true} // This ensures the modal gets destroyed when closed
  style={{
    maxWidth: '500px', // Maximum width for the modal
  }}
>
  <div className="space-y-5">
    <div>
      <label className="block font-medium">Content</label>
      <Input.TextArea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Enter post content"
        rows={4}
        className="w-full"  // Ensure input area spans full width
      />
    </div>
    <div>
      <label className="block font-medium">Profile URL</label>
      <Input
        value={profileUrl}
        onChange={(e) => setProfileUrl(e.target.value)}
        placeholder="Enter profile URL"
        className="w-full"  // Ensure input area spans full width
      />
    </div>
    <div>
      <label className="block font-medium">Post Image</label>
      <Upload beforeUpload={handleImageUpload} showUploadList={false}>
        <Button>Upload Post Image</Button>
      </Upload>
    </div>
  </div>
</Modal>

    </div>
  );
};

export default Posts;

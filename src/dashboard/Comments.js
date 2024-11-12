import { useEffect, useState } from "react";
import { Spin, Card, Button, Modal, Input, Avatar } from "antd";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { FaTrashAlt, FaRegThumbsUp, FaRegCommentDots } from "react-icons/fa";

export default function Comments() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newComment, setNewComment] = useState("");

  // Fetch comments from Firebase
  const fetchComments = async () => {
    setLoading(true);
    const commentsCollection = collection(db, "comments");
    const commentsSnapshot = await getDocs(commentsCollection);
    const commentsList = commentsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setComments(commentsList);
    setLoading(false);
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleAddComment = async () => {
    if (newComment.trim()) {
      await addDoc(collection(db, "comments"), { text: newComment, author: "Admin" });
      fetchComments();
      setNewComment("");
      setShowModal(false);
    }
  };

  const handleDeleteComment = async (id) => {
    await deleteDoc(doc(db, "comments", id));
    fetchComments();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto md:p-0 pt-10">
    {/* Heading */}
    <div className="text-center mb-8">
      <h1 className="text-3xl font-semibold text-gray-100">Comments</h1>
      <p className="text-lg text-gray-200 mt-2">Share your thoughts below</p>
    </div>
  
    {/* Add Comment Button */}
    <div className="flex justify-center mb-6">
      <Button onClick={() => setShowModal(true)} type="none" className="text-white py-5 px-6 font-semibold hover:border-gray-100 bg-green-600 hover:bg-green-500">
        Add Comment
      </Button>
    </div>
  
    {/* Comment List */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
      {comments.map((comment) => (
        <Card
          key={comment.id}
          className="bg-white shadow-xl rounded-lg border border-gray-200  flex flex-col space-y-5 w-full max-w-xl " // Set max width and ensure it's centered
        >
          {/* Comment Header with Profile Circle */}
          <div className="flex items-center space-x-4 bg-gray-100 rounded-full py-2">
            <Avatar size={40} className="bg-green-500 text-white">
              {comment.author ? comment.author.charAt(0) : "A"}
            </Avatar>
            <div>
              <p className="text-lg font-semibold text-gray-800">{comment.author || "Admin"}</p>
            </div>
          </div>
  
          {/* Comment Content */}
          <div className="flex flex-col space-y-2 py-4">
            <p className="text-gray-800 text-base px-2">{comment.text}</p>
          </div>
  
          {/* Comment Actions */}
          <div className="flex text-gray-600 space-x-2">
            <div className="flex">
              <Button 
                type="link" 
                icon={<FaRegThumbsUp />} 
                className="text-gray-500 hover:text-blue-600"
              >
                Like
              </Button>
              <Button 
                type="link" 
                icon={<FaRegCommentDots />} 
                className="text-gray-500 hover:text-green-600"
              >
                Reply
              </Button>
            </div>
            <Button
              type="link"
              icon={<FaTrashAlt />}
              className="text-red-500 hover:text-red-700 mt-2 sm:mt-0"
              onClick={() => handleDeleteComment(comment.id)}
            >
              Delete
            </Button>
          </div>
        </Card>
      ))}
    </div>
  
    {/* Modal for adding a new comment */}
    <Modal
      title="Add New Comment"
      visible={showModal}
      width={350}
      onOk={handleAddComment}
      onCancel={() => setShowModal(false)}
      footer={[
        <Button key="cancel" onClick={() => setShowModal(false)}>
          Cancel
        </Button>,
        <Button key="submit" type="none" onClick={handleAddComment} className="bg-green-600 text-white hover:bg-green-700">
          Add Comment
        </Button>,
      ]}
    >
      <Input
        placeholder="Enter your comment here..."
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        className="py-2 my-4 bg-gray-50"
      />
    </Modal>
  </div>
  
  );
}

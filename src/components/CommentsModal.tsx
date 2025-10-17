import React, { useState, useEffect } from 'react';
// This import path must be correct and consistent across all files
import { Company, User, Comment } from '../types'; 
import { X, MessageCircle, Send, Edit2, Trash2, Check, X as XIcon, Heart } from 'lucide-react';
import { commentsApi } from '../api';

interface CommentsModalProps {
  company: Company;
  users: User[];
  currentUser: User;
  onClose: () => void;
  onEditCompany?: (companyId: number) => void;
}

export const CommentsModal: React.FC<CommentsModalProps> = ({
  company,
  users,
  currentUser,
  onClose,
  onEditCompany,
}) => {
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [comments, setComments] = useState<Comment[]>([]); 
  const [isLoading, setIsLoading] = useState(true);

  const fetchComments = async () => {
    try {
      const fetchedComments = await commentsApi.getCommentsByCompany(company.id);
      setComments(fetchedComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [company.id]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const addedComment = await commentsApi.addComment(company.id, currentUser.id, newComment);
      setComments([...comments, addedComment]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const getUserById = (userId: number) => {
    return users.find((u) => u.id === userId);
  };

  const getUserInitials = (userId: number) => {
    const user = getUserById(userId);
    if (user) {
      return `${user.firstname.charAt(0)}${user.surname.charAt(0)}`;
    }
    return '??';
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col shadow-xl">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <MessageCircle className="w-6 h-6 text-red-600" />
            <h3 className="text-xl font-semibold text-gray-900">
              Comments for {company.name}
            </h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          {isLoading ? (
            <div className="text-center text-gray-500">Loading comments...</div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="relative group mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-lg font-medium">
                      {getUserInitials(comment.userId)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-gray-900">
                        {getUserById(comment.userId)?.firstname}
                      </h4>
                      <span className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {editingCommentId === comment.id ? (
                      <div className="mt-2">
                        <textarea
                          value={editingContent}
                          onChange={(e) => setEditingContent(e.target.value)}
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          rows={2}
                        />
                        <div className="flex space-x-2 mt-2">
                          <button
                            className="px-3 py-1 bg-green-500 text-white text-sm rounded-lg"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded-lg"
                          >
                            <XIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="mt-2 text-gray-800 whitespace-pre-line">{comment.content}</p>
                    )}
                  </div>
                </div>
                {currentUser.id === comment.userId && (
                  <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      className="p-1 rounded-full text-gray-400 hover:text-blue-500"
                      title="Edit Comment"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      className="p-1 rounded-full text-gray-400 hover:text-red-500"
                      title="Delete Comment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="p-6 border-t border-gray-200">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-medium">
                {getUserInitials(currentUser.id)}
              </span>
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={`Write a comment about ${company.name}...`}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none bg-white text-gray-900 placeholder-gray-400"
                rows={3}
              />
              <div className="flex justify-between items-center mt-3">
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <Heart className="w-3 h-3" />
                  <span>Press Enter to add line break</span>
                </div>
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Comment</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
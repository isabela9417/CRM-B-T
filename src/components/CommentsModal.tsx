import React, { useState } from 'react';
import { Company, User, Comment } from '../types';
import { X, MessageCircle, Send, Edit2, Trash2, Check, X as XIcon, ThumbsUp, Heart } from 'lucide-react';

interface CommentsModalProps {
  company: Company;
  users: User[];
  currentUser: User;
  onClose: () => void;
  onAddComment?: (companyId: number, content: string) => void;
}

export const CommentsModal: React.FC<CommentsModalProps> = ({
  company,
  users,
  currentUser,
  onClose,
  onAddComment,
}) => {
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState('');

  // Mock comments with Facebook-style data
  const [comments, setComments] = useState<Comment[]>(company.comments || [
    {
      id: 1,
      companyId: company.id,
      userId: 1,
      content: "Initial contact made. Company seems very interested in our enterprise solutions. They mentioned they're currently using a competitor but are open to switching.",
      createdAt: "2024-01-15T10:30:00Z",
    },
    {
      id: 2,
      companyId: company.id,
      userId: 2,
      content: "Follow-up meeting scheduled for next week. They want to discuss pricing and implementation timeline. Very promising lead!",
      createdAt: "2024-01-16T14:20:00Z",
    },
    {
      id: 3,
      companyId: company.id,
      userId: 1,
      content: "Meeting went well. They're requesting a detailed proposal by Friday. I'll prepare the technical specifications and send it over.",
      createdAt: "2024-01-17T16:45:00Z",
    },
  ]);

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now(),
      companyId: company.id,
      userId: currentUser.id,
      content: newComment.trim(),
      createdAt: new Date().toISOString(),
    };

    setComments([...comments, comment]);
    setNewComment('');
    
    if (onAddComment) {
      onAddComment(company.id, newComment.trim());
    }
  };

  const handleEditComment = (commentId: number, newContent: string) => {
    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, content: newContent, updatedAt: new Date().toISOString() }
        : comment
    ));
    setEditingCommentId(null);
    setEditingContent('');
  };

  const handleDeleteComment = (commentId: number) => {
    setComments(comments.filter(comment => comment.id !== commentId));
  };

  const startEditing = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditingContent(comment.content);
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditingContent('');
  };

  const getUserName = (userId: number) => {
    const user = users.find(u => u.id === userId);
    return user?.name || 'Unknown User';
  };

  const getUserInitials = (userId: number) => {
    const user = users.find(u => u.id === userId);
    if (!user) return 'U';
    return user.firstname?.charAt(0) || user.name?.charAt(0) || 'U';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return diffInMinutes < 1 ? 'Just now' : `${diffInMinutes}m`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) {
        return `${diffInDays}d`;
      } else {
        return date.toLocaleDateString();
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col border">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="bg-primary p-2 rounded-lg">
              <MessageCircle className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-card-foreground">Comments</h2>
              <p className="text-sm text-muted-foreground">{company.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-card-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {comments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
                <p>No comments yet. Be the first to add one!</p>
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="bg-comment-background rounded-lg p-4 border border-comment-border hover:bg-comment-hover transition-colors">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-crm-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-crm-primary-foreground text-sm font-medium">
                        {getUserInitials(comment.userId)}
                      </span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-comment-author text-sm">
                            {getUserName(comment.userId)}
                          </h4>
                          <span className="text-comment-time text-xs">
                            {formatDate(comment.createdAt)}
                            {comment.updatedAt && ' • edited'}
                          </span>
                        </div>
                        
                        {comment.userId === currentUser.id && (
                          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => startEditing(comment)}
                              className="p-1 text-muted-foreground hover:text-primary transition-colors"
                              title="Edit comment"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleDeleteComment(comment.id)}
                              className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                              title="Delete comment"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                      
                      {editingCommentId === comment.id ? (
                        <div className="space-y-3">
                          <textarea
                            value={editingContent}
                            onChange={(e) => setEditingContent(e.target.value)}
                            className="w-full p-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring text-sm bg-background text-foreground resize-none"
                            rows={3}
                          />
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditComment(comment.id, editingContent)}
                              className="px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90 transition-colors flex items-center space-x-1"
                            >
                              <Check className="w-3 h-3" />
                              <span>Save</span>
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-md text-sm hover:bg-secondary/80 transition-colors flex items-center space-x-1"
                            >
                              <XIcon className="w-3 h-3" />
                              <span>Cancel</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="text-card-foreground text-sm leading-relaxed whitespace-pre-wrap mb-3">
                            {comment.content}
                          </p>
                          
                          {/* Facebook-style interaction buttons */}
                          <div className="flex items-center space-x-4 text-xs">
                            <button className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors">
                              <ThumbsUp className="w-3 h-3" />
                              <span>Like</span>
                            </button>
                            <button className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors">
                              <MessageCircle className="w-3 h-3" />
                              <span>Reply</span>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="border-t border-border p-6">
          <div className="flex space-x-3">
            <div className="w-10 h-10 bg-crm-primary rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-crm-primary-foreground text-sm font-medium">
                {getUserInitials(currentUser.id)}
              </span>
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={`Write a comment about ${company.name}...`}
                className="w-full p-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring resize-none bg-background text-foreground placeholder-muted-foreground"
                rows={3}
              />
              <div className="flex justify-between items-center mt-3">
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Heart className="w-3 h-3" />
                  <span>Press Enter to add line break</span>
                </div>
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
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
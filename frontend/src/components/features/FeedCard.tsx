import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Share2, Send, MoreHorizontal, Trash2, X, ChevronDown, ChevronUp, Flame } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { Button } from '../ui/Button';
import { cn } from '@/lib/utils';
export function FeedCard({ 
  post, 
  index, 
  me,
  totalClaps, 
  myClapCount, 
  handleClap,
  expandedComments,
  toggleComments,
  newCommentText,
  setNewCommentText,
  submitComment,
  deleteComment,
  openShareModal
}: {
  post: any;
  index: number;
  me: any;
  totalClaps: number;
  myClapCount: number;
  handleClap: (postId: string, reactions: any[]) => void;
  expandedComments: boolean;
  toggleComments: () => void;
  newCommentText: string;
  setNewCommentText: (txt: string) => void;
  submitComment: (parentId?: string) => void;
  deleteComment: (commentId: string) => void;
  openShareModal: () => void;
}) {
  const [floatingClaps, setFloatingClaps] = useState<{ id: number; x: number; y: number }[]>([]);
  const [showCenterClap, setShowCenterClap] = useState(false);
  const [replyingTo, setReplyingTo] = useState<{ id: string; username: string } | null>(null);
  const [expandedReplies, setExpandedReplies] = useState<Record<string, boolean>>({});

  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleDoubleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newClap = { id: Date.now() + Math.random(), x, y };
    setFloatingClaps((prev) => [...prev, newClap]);
    setShowCenterClap(true);

    handleClap(post.id, post.reactions);

    setTimeout(() => {
      setFloatingClaps((prev) => prev.filter((c) => c.id !== newClap.id));
    }, 1000);

    setTimeout(() => {
      setShowCenterClap(false);
    }, 800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      id={`post-${post.id}`}
    >
      <Card className="hover:border-primary/20 transition-all duration-500 overflow-hidden bg-white dark:bg-white/2 rounded-[2rem] border-slate-200 dark:border-white/5 flex flex-col">
        {/* Card Header */}
        <div className="p-5 flex items-center justify-between border-b border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/1">
          <div className="flex items-center gap-3">
            <Avatar user={post.author} className="w-10 h-10 ring-2 ring-primary/20" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-tight leading-none">{post.author.username}</span>
                {post.club ? (
                  <span className="text-[8px] text-primary font-black bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-wider border border-primary/20">
                    {post.club.name}
                  </span>
                ) : (
                  <span className="text-[8px] text-slate-500 dark:text-neutral-500 font-black bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded-full uppercase tracking-wider border border-slate-300 dark:border-white/10">
                    Geral
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-500 dark:text-neutral-600 font-bold block mt-1">
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Media Centralized Section */}
        {post.mediaUrl && (
          <div 
            onDoubleClick={handleDoubleTap}
            className="relative w-full aspect-square md:aspect-video flex items-center justify-center bg-slate-200 dark:bg-black/50 overflow-hidden cursor-pointer select-none group"
          >
            {post.mediaType === "VIDEO" ? (
              <video 
                src={post.mediaUrl?.startsWith('http') ? post.mediaUrl : `http://localhost:3001${post.mediaUrl}`}
                controls 
                muted 
                loop 
                className="w-full h-full object-cover" 
              />
            ) : (
              <img 
                src={post.mediaUrl?.startsWith('http') ? post.mediaUrl : `http://localhost:3001${post.mediaUrl}`}
                alt="Feed Post" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              />
            )}

            {/* Tap Overlay Effects */}
            <AnimatePresence>
              {showCenterClap && (
                <motion.div
                  initial={{ scale: 0.3, opacity: 0 }}
                  animate={{ scale: [0.3, 1.2, 1], opacity: [0, 1, 1] }}
                  exit={{ scale: 1.5, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 m-auto w-20 h-20 flex items-center justify-center bg-slate-200 dark:bg-black/50 backdrop-blur-md rounded-full border border-slate-300 dark:border-white/10 z-20 pointer-events-none"
                >
                  <span className="text-4xl grayscale-0 saturate-200 filter drop-shadow-[0_0_10px_rgba(249,115,22,0.6)]">👏</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Floaty Particle Claps */}
            <AnimatePresence>
              {floatingClaps.map((c) => (
                <motion.span
                  key={c.id}
                  initial={{ opacity: 1, scale: 0.6, x: c.x - 20, y: c.y - 20 }}
                  animate={{ opacity: 0, scale: 2, y: c.y - 120 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="absolute text-5xl pointer-events-none select-none z-30 filter drop-shadow-[0_0_15px_rgba(16,185,129,0.8)]"
                >
                  <span className="text-4xl grayscale-0 saturate-200 filter drop-shadow-[0_0_15px_rgba(249,115,22,0.8)]">👏</span>
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Card Caption / Content */}
        <div className="p-5 space-y-4">
          <p className="text-slate-800 dark:text-neutral-200 text-md leading-relaxed font-medium">
            {post.content}
          </p>

          {/* Social Action buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-white/5">
            <div className="flex items-center gap-6">
              {/* Clap reaction */}
              <button 
                onClick={() => handleClap(post.id, post.reactions)}
                className="flex items-center gap-2 text-slate-500 dark:text-neutral-500 hover:text-orange-500 transition-all group/btn"
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center group-hover/btn:scale-110 transition-transform shadow-md",
                  myClapCount > 0 ? "bg-orange-500/10 text-orange-500 border border-orange-500/20" : "text-slate-600 dark:text-neutral-400"
                )}>
                  <span className={cn("text-lg transition-all duration-300", myClapCount > 0 ? "grayscale-0 saturate-200 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]" : "grayscale opacity-50")}>👏</span>
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-black uppercase tracking-wider">{totalClaps} Aplausos</span>
                  {myClapCount > 0 && <span className="text-[8px] text-orange-500 font-bold">({myClapCount} suas)</span>}
                </div>
              </button>

              {/* Expand comments */}
              <button 
                onClick={toggleComments}
                className="flex items-center gap-2 text-slate-500 dark:text-neutral-500 hover:text-primary transition-all group/btn"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center group-hover/btn:scale-110 transition-transform shadow-md">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider">{post.comments?.length || 0} Comentários</span>
              </button>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={openShareModal}
                className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-neutral-500 hover:text-white transition-all hover:bg-white/10 hover:scale-105 shadow-md"
              >
                <Share2 size={16} />
              </button>
            </div>
          </div>

          {/* Comments Panel */}
          {expandedComments && (
            <div className="pt-4 border-t border-slate-200 dark:border-white/5 space-y-4 animate-in slide-in-from-top-3 duration-300">
              {/* List comments */}
              <div className="space-y-3 max-h-60 overflow-y-auto scrollbar-hide pr-1">
                {post.comments?.length === 0 ? (
                  <p className="text-slate-500 dark:text-neutral-600 text-xs italic py-2">Seja o primeiro a expressar sua opinião!</p>
                ) : (
                  post.comments?.map((comment: any) => (
                    <div key={comment.id} className="flex flex-col gap-2">
                      {/* Parent Comment */}
                      <div className="flex gap-3 bg-slate-50 dark:bg-white/1 p-3 rounded-2xl border border-slate-200 dark:border-white/5 relative group/comment">
                        <Avatar user={comment.author} className="w-8 h-8" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-bold text-slate-900 dark:text-white">{comment.author.username}</p>
                            <span className="text-[9px] text-slate-500 dark:text-neutral-600 font-semibold">
                              {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-xs text-slate-700 dark:text-neutral-300 mt-1 leading-relaxed">{comment.content}</p>
                          <button 
                            onClick={() => {
                              setReplyingTo({ id: comment.id, username: comment.author.username });
                              inputRef.current?.focus();
                            }}
                            className="text-[9px] font-black uppercase text-slate-500 dark:text-neutral-500 mt-2 hover:text-primary transition-colors"
                          >
                            Responder
                          </button>
                        </div>
                        {comment.authorId === me?.id && (
                          <button
                            onClick={() => deleteComment(comment.id)}
                            className="absolute right-3 top-3 opacity-0 group-hover/comment:opacity-100 hover:text-rose-500 transition-all text-slate-500 dark:text-neutral-600 p-1"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>

                      {/* Nested Replies Toggle */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="ml-10">
                          <button 
                            onClick={() => setExpandedReplies(prev => ({ ...prev, [comment.id]: !prev[comment.id] }))}
                            className="flex items-center gap-2 text-[10px] font-black text-slate-500 dark:text-neutral-500 hover:text-neutral-300 uppercase transition-colors"
                          >
                            <div className="w-6 h-[1px] bg-neutral-600" />
                            {expandedReplies[comment.id] ? (
                              <>Esconder respostas <ChevronUp size={12} /></>
                            ) : (
                              <>Ver {comment.replies.length} resposta{comment.replies.length > 1 ? 's' : ''} <ChevronDown size={14} className="animate-bounce text-primary ml-1" /></>
                            )}
                          </button>

                          {/* Replies List */}
                          <AnimatePresence>
                            {expandedReplies[comment.id] && (
                              <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-2 mt-3"
                              >
                                {comment.replies.map((reply: any) => (
                                  <div key={reply.id} className="flex gap-3 bg-slate-50 dark:bg-white/1 p-2 rounded-xl border border-slate-200 dark:border-white/5 relative group/comment">
                                    <Avatar user={reply.author} className="w-6 h-6" />
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between">
                                        <p className="text-[11px] font-bold text-slate-900 dark:text-white">{reply.author.username}</p>
                                      </div>
                                      <p className="text-[11px] text-slate-700 dark:text-neutral-300 mt-0.5 leading-relaxed">{reply.content}</p>
                                    </div>
                                    {reply.authorId === me?.id && (
                                      <button
                                        onClick={() => deleteComment(reply.id)}
                                        className="absolute right-2 top-2 opacity-0 group-hover/comment:opacity-100 hover:text-rose-500 transition-all text-slate-500 dark:text-neutral-600 p-1"
                                      >
                                        <Trash2 size={10} />
                                      </button>
                                    )}
                                  </div>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Write comment */}
              <div className="flex flex-col gap-2 pt-2 border-t border-slate-200 dark:border-white/5">
                {replyingTo && (
                  <div className="flex items-center justify-between bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20 w-fit">
                    <span className="text-[10px] text-primary font-bold uppercase tracking-wider">
                      Respondendo a @{replyingTo.username}
                    </span>
                    <button onClick={() => setReplyingTo(null)} className="ml-3 text-slate-600 dark:text-neutral-400 hover:text-white">
                      <X size={12} />
                    </button>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Avatar user={me || { username: "..." }} className="w-8 h-8" />
                  <div className="flex-grow relative flex items-center">
                    <input
                      ref={inputRef}
                      type="text"
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      placeholder={replyingTo ? `Adicione sua resposta...` : "Deixe um comentário brilhante..."}
                      className="w-full h-10 pl-4 pr-12 bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/40 outline-none"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && newCommentText.trim()) {
                          submitComment(replyingTo?.id);
                          setReplyingTo(null);
                        }
                      }}
                    />
                    <button 
                      onClick={() => {
                        submitComment(replyingTo?.id);
                        setReplyingTo(null);
                      }}
                      disabled={!newCommentText.trim()}
                      className="absolute right-3 text-slate-600 dark:text-neutral-400 hover:text-primary transition-colors disabled:opacity-40"
                    >
                      <Send size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

import api from "./api";
export { authService } from "./auth.service";

export const bookService = {
  async getAll(params?: any) {
    const { data } = await api.get("/books", { params });
    return data;
  },
  async getById(id: string) {
    const { data } = await api.get(`/books/${id}`);
    return data;
  },
  async getRecommendations() {
    const { data } = await api.get("/books/recommendations");
    return data;
  },
  async search(query: string, tags?: string) {
    const { data } = await api.get("/books/search", { params: { q: query, tags } });
    return data;
  },
  async create(book: any) {
    const { data } = await api.post("/books", book);
    return data;
  },
};

export const clubService = {
  async getAll() {
    const { data } = await api.get("/clubs");
    return data;
  },
  async getById(id: string) {
    const { data } = await api.get(`/clubs/${id}`);
    return data;
  },
  async create(club: { name: string; description?: string; city?: string; isPrivate?: boolean }) {
    const { data } = await api.post("/clubs", club);
    return data;
  },
  async getFeed(id: string) {
    const { data } = await api.get(`/clubs/${id}/feed`);
    return data;
  },
  async getGlobalFeed() {
    const { data } = await api.get("/clubs/feed/global");
    return data;
  },
  async getFollowingFeed() {
    const { data } = await api.get("/clubs/feed/following");
    return data;
  },
  async createPost(content: string, clubId?: string, audioUrl?: string, mediaUrl?: string, mediaType?: string) {
    const url = clubId ? `/clubs/${clubId}/posts` : "/clubs/posts";
    const { data } = await api.post(url, { content, audioUrl, mediaUrl, mediaType });
    return data;
  },
  async reactPost(postId: string, claps: number) {
    const { data } = await api.post(`/clubs/posts/${postId}/react`, { claps });
    return data;
  },
  async commentPost(postId: string, content: string) {
    const { data } = await api.post(`/clubs/posts/${postId}/comments`, { content });
    return data;
  },
  async deleteComment(commentId: string) {
    const { data } = await api.delete(`/clubs/posts/comments/${commentId}`);
    return data;
  },
  async setCurrentBook(clubId: string, bookId: string | null) {
    const { data } = await api.patch(`/clubs/${clubId}/current-book`, { bookId });
    return data;
  },
};

export const eventService = {
  async getAll() {
    const { data } = await api.get("/events");
    return data;
  },
  async create(event: { title: string; date: string; type: "ONLINE" | "PRESENTIAL"; clubId: string; description?: string; link?: string; address?: string; participantLimit?: number }) {
    const { data } = await api.post("/events", event);
    return data;
  },
  async rsvp(eventId: string) {
    const { data } = await api.post(`/events/${eventId}/rsvp`);
    return data;
  },
  async getNearby(lat: number, lng: number, radius: number = 10) {
    const { data } = await api.get("/geolocation/nearby-events", { params: { lat, lng, radius } });
    return data;
  },
};

export const gamificationService = {
  async getRanking() {
    const { data } = await api.get("/gamification/ranking");
    return data;
  },
  async getMyStats() {
    const { data } = await api.get("/gamification/stats");
    return data;
  },
  async getUserStats(userId: string) {
    const { data } = await api.get(`/gamification/stats/${userId}`);
    return data;
  },
};

export const userService = {
  async follow(id: string) {
    const { data } = await api.post(`/users/follow/${id}`);
    return data;
  },
  async unfollow(id: string) {
    const { data } = await api.delete(`/users/unfollow/${id}`);
    return data;
  },
  async getFollowing() {
    const { data } = await api.get("/users/following/list");
    return data;
  },
  async getFollowers() {
    const { data } = await api.get("/users/followers/list");
    return data;
  },
  async search(query: string) {
    const { data } = await api.get("/users/search/all", { params: { search: query } });
    return data;
  },
  async getProfile(userId?: string) {
    const url = userId ? `/users/${userId}` : "/users/me";
    const { data } = await api.get(url);
    return data;
  },
  async updateProfile(userData: any) {
    const { data } = await api.put("/users/profile", userData);
    return data;
  },
};

export const chatService = {
  async getHistory(params: { clubId?: string; eventId?: string; receiverId?: string }) {
    const { data } = await api.get("/chat/history", { params });
    return data;
  },
  async sendMessage(msg: { content: string; clubId?: string; eventId?: string; receiverId?: string }) {
    const { data } = await api.post("/chat/message", msg);
    return data;
  },
  async getConversations() {
    const { data } = await api.get("/chat/conversations");
    return data;
  },
};

export const journalService = {
  async getAll() {
    const { data } = await api.get("/journals");
    return data;
  },
  async create(entry: { bookTitle: string; author?: string; pagesRead: number; feelings: string[]; notes?: string; mediaUrl?: string; mediaType?: string; postToFeed?: boolean }) {
    const { data } = await api.post("/journals", entry);
    return data;
  },
  async remove(id: string) {
    const { data } = await api.delete(`/journals/${id}`);
    return data;
  },
};

export const goalService = {
  async getByClub(clubId: string) {
    const { data } = await api.get(`/clubs/${clubId}/goals`);
    return data;
  },
  async create(clubId: string, goal: { title: string; targetPages: number; endDate: string }) {
    const { data } = await api.post(`/clubs/${clubId}/goals`, goal);
    return data;
  },
  async addProgress(clubId: string, goalId: string, pages: number) {
    const { data } = await api.patch(`/clubs/${clubId}/goals/${goalId}/progress`, { pages });
    return data;
  },
};

export const notificationService = {
  async getAll() {
    const { data } = await api.get("/notifications");
    return data;
  },
  async markAsRead(id: string) {
    const { data } = await api.patch(`/notifications/${id}/read`);
    return data;
  },
};

export const uploadService = {
  async upload(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await api.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },
};

export const searchService = {
  async search(query: string) {
    const { data } = await api.get("/search", { params: { q: query } });
    return data;
  },
};

export const readingListService = {
  async getMyLists() {
    const { data } = await api.get("/reading-lists");
    return data;
  },
  async createList(list: { name: string; type?: string }) {
    const { data } = await api.post("/reading-lists", list);
    return data;
  },
  async addItem(listId: string, bookId: string) {
    const { data } = await api.post(`/reading-lists/${listId}/items`, { bookId });
    return data;
  },
  async removeItem(listId: string, bookId: string) {
    const { data } = await api.delete(`/reading-lists/${listId}/items/${bookId}`);
    return data;
  },
  async deleteList(listId: string) {
    const { data } = await api.delete(`/reading-lists/${listId}`);
    return data;
  },
};

export const bookDiscussionService = {
  async getDiscussions(bookId: string, chapter?: number) {
    const { data } = await api.get(`/books/${bookId}/discussions`, {
      params: chapter !== undefined ? { chapter } : {},
    });
    return data;
  },
  async createDiscussion(bookId: string, discussion: { content: string; chapter?: number }) {
    const { data } = await api.post(`/books/${bookId}/discussions`, discussion);
    return data;
  },
  async deleteDiscussion(discussionId: string) {
    const { data } = await api.delete(`/books/discussions/${discussionId}`);
    return data;
  },
};

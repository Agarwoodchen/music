<template>
  <div class="comments-section" :class="theme">
    <!-- 评论标题和排序 -->
    <div class="comments-header">
      <h2 class="comments-title">评论 <span class="comments-count">({{ comments.length }})</span></h2>
      <div class="sort-options">
        <span class="sort-label">排序：</span>
        <select v-model="sortBy" class="sort-select">
          <option value="hot">最热</option>
          <option value="new">最新</option>
        </select>
      </div>
    </div>

    <!-- 评论输入框 -->
    <div class="comment-input-container">
      <div class="user-avatar">
        <img :src="currentUser.avatar" :alt="currentUser.name" class="avatar-img">
      </div>
      <div class="input-area">
        <textarea v-model="newComment" placeholder="分享你的听歌感受..." class="comment-input" @focus="isInputFocused = true"
          @blur="isInputFocused = false"></textarea>
        <div class="input-actions" v-show="isInputFocused || newComment">
          <div class="action-buttons">
            <button class="emoji-btn" @click="showEmojiPicker = !showEmojiPicker">
              <i class="icon-emoji">😊</i>
            </button>
            <button class="image-btn">
              <i class="icon-image">🖼️</i>
            </button>
          </div>
          <button class="submit-btn" :disabled="!newComment.trim()" @click="submitComment">
            评论
          </button>
        </div>
      </div>
    </div>

    <!-- 表情选择器 -->
    <div class="emoji-picker" v-if="showEmojiPicker">
      <div class="emoji-category">
        <span v-for="category in emojiCategories" :key="category" :class="{ active: activeEmojiCategory === category }"
          @click="activeEmojiCategory = category">
          {{ category }}
        </span>
      </div>
      <div class="emoji-grid">
        <span v-for="emoji in filteredEmojis" :key="emoji" @click="insertEmoji(emoji)">
          {{ emoji }}
        </span>
      </div>
    </div>

    <!-- 评论列表 -->
    <div class="comments-list">
      <div class="comment-item" v-for="comment in sortedComments" :key="comment.id">
        <div class="comment-avatar">
          <img :src="comment.user.avatar" :alt="comment.user.name" class="avatar-img">
        </div>
        <div class="comment-content">
          <div class="comment-header">
            <span class="username">{{ comment.user.name }}</span>
            <span class="comment-time">{{ formatTime(comment.time) }}</span>
          </div>
          <div class="comment-text">{{ comment.content }}</div>
          <div class="comment-footer">
            <button class="like-btn" @click="toggleLike(comment)">
              <i :class="comment.liked ? 'icon-liked' : 'icon-like'">
                {{ comment.liked ? '❤️' : '🤍' }}
              </i>
              <span>{{ comment.likes }}</span>
            </button>
            <button class="reply-btn" @click="showReplyInput(comment)">
              <i class="icon-reply">↩️</i>
              <span>回复</span>
            </button>
          </div>

          <!-- 回复列表 -->
          <div class="replies-list" v-if="comment.replies.length > 0">
            <div class="reply-item" v-for="reply in comment.replies" :key="reply.id">
              <div class="reply-avatar">
                <img :src="reply.user.avatar" :alt="reply.user.name" class="avatar-img">
              </div>
              <div class="reply-content">
                <div class="reply-header">
                  <span class="username">{{ reply.user.name }}</span>
                  <span class="reply-time">{{ formatTime(reply.time) }}</span>
                </div>
                <div class="reply-text">
                  <span class="reply-to" v-if="reply.replyTo">@{{ reply.replyTo }}</span>
                  {{ reply.content }}
                </div>
                <div class="reply-footer">
                  <button class="like-btn" @click="toggleLike(reply)">
                    <i :class="reply.liked ? 'icon-liked' : 'icon-like'">
                      {{ reply.liked ? '❤️' : '🤍' }}
                    </i>
                    <span>{{ reply.likes }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 回复输入框 -->
          <div class="reply-input-container" v-if="activeReplyComment === comment.id">
            <div class="user-avatar">
              <img :src="currentUser.avatar" :alt="currentUser.name" class="avatar-img">
            </div>
            <div class="input-area">
              <textarea v-model="replyContent" :placeholder="'回复 @' + comment.user.name" class="reply-input"
                ref="replyInput"></textarea>
              <div class="input-actions">
                <button class="submit-btn" :disabled="!replyContent.trim()" @click="submitReply(comment)">
                  回复
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 加载更多 -->
    <div class="load-more" v-if="hasMoreComments">
      <button class="load-more-btn" @click="loadMoreComments">
        加载更多评论
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, ref, computed, nextTick, onMounted } from 'vue'
import { ThemeSymbol } from '../theme-context'
import { getSomePlaylistsCommentsApi, addSomePlaylistsCommentsOrReplyApi } from '../api/test.ts'
import { usePlayerStore } from '../stores/usePlayerStore.ts'
const player = usePlayerStore()
import { ElMessage } from 'element-plus'
import { defineProps } from 'vue'
import { useApiStore } from '../stores/userApiUrl.ts'
const apiStore = useApiStore()
const apiBaseUrl = apiStore.apiBaseUrl
const props = defineProps({
  playlistId: {
    type: [Number],
    required: true
  }
})
const playlistId = props.playlistId


const userJson = localStorage.getItem('user');
const user = userJson ? JSON.parse(userJson) : null;
// console.log(props.playlistId, 'casuygcagsciagsgciascascascsa');

const parentCommentId = ref<number | null>(null);

const themeContext = inject(ThemeSymbol)

if (!themeContext) {
  throw new Error('Theme context not provided')
}

const { theme, toggleTheme } = themeContext

// 当前用户
const currentUser = ref({
  id: 1,
  name: '音乐爱好者',
  avatar: 'https://source.unsplash.com/random/100x100/?user,1'
})

// 新评论
const newComment = ref('')
const isInputFocused = ref(false)
const showEmojiPicker = ref(false)

// 表情选择器
const emojiCategories = ['表情', '人物', '自然', '食物', '活动', '旅行', '物品', '符号']
const activeEmojiCategory = ref('表情')
const emojis = {
  '表情': ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇'],
  '人物': ['👶', '🧒', '👦', '👧', '🧑', '👨', '👩', '🧔', '👵', '👴'],
  '自然': ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🦁', '🐮'],
  '食物': ['🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈'],
  '活动': ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱', '🏓', '🏸'],
  '旅行': ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎', '🚓', '🚑', '🚒', '🚐'],
  '物品': ['⌚', '📱', '💻', '⌨️', '🖥', '🖨', '🖱', '🖲', '💽', '💾'],
  '符号': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔']
}

const filteredEmojis = computed(() => {
  return emojis[activeEmojiCategory.value] || []
})

const insertEmoji = (emoji: string) => {
  newComment.value += emoji
  showEmojiPicker.value = false
}

// 排序选项
const sortBy = ref('hot')

// 评论数据
const comments = ref([

])

const sortedComments = computed(() => {
  return [...comments.value].sort((a, b) => {
    if (sortBy.value === 'hot') {
      return b.likes - a.likes
    } else {
      return b.time - a.time
    }
  })
})

// 点赞功能
const toggleLike = (comment: any) => {
  comment.liked = !comment.liked
  comment.likes += comment.liked ? 1 : -1
}

// 回复功能
const activeReplyComment = ref<number | null>(null)
const replyContent = ref('')
const replyInput = ref<HTMLTextAreaElement | null>(null)

const showReplyInput = (comment: any) => {
  activeReplyComment.value = comment.id
  replyContent.value = ''
  nextTick(() => {
    replyInput.value?.focus()
  })
}

const submitReply = async (comment: any) => {
  if (!replyContent.value.trim()) {
    ElMessage.warning('回复内容不能为空');
    return;
  }
  const commentData = {
    user_id: user.id,
    content: replyContent.value,
    parent_id: comment.id
  }
  try {
    const result = await addSomePlaylistsCommentsOrReplyApi(playlistId, commentData);

    if (result.success) {
      ElMessage.success('回复提交成功');
      replyContent.value = '';
      activeReplyComment.value = null;
      // 重新加载评论数据，确保评论列表最新
      await loadPageData();
    } else {
      ElMessage.error('提交失败：' + result.message);
    }
  } catch (error) {
    ElMessage.error('提交失败，请稍后重试');
  }
}

// 提交评论
const submitComment = async () => {
  if (!newComment.value.trim()) {
    ElMessage.warning('评论内容不能为空');
    return;
  }

  const commentData: { user_id: number; content: string; parent_id?: number } = {
    user_id: user.id,
    content: newComment.value,
  };

  if (parentCommentId.value) {
    commentData.parent_id = parentCommentId.value;
  }

  try {
    const result = await addSomePlaylistsCommentsOrReplyApi(playlistId, commentData);

    if (result.success) {
      ElMessage.success('评论提交成功');
      newComment.value = '';
      // 重新加载评论数据，确保评论列表是最新的
      await loadPageData();
      // 清空父评论id，防止下次误发为回复
      parentCommentId.value = null;
    } else {
      ElMessage.error('提交失败：' + result.message);
    }
  } catch (error) {
    ElMessage.error('提交失败稍后重试');
  }
};

// 加载更多
const hasMoreComments = ref(true)
const loadMoreComments = () => {
  // 模拟加载更多数据
  const newComments = Array.from({ length: 3 }, (_, i) => ({
    id: comments.value.length + i + 1,
    user: {
      id: 10 + i,
      name: ['音乐迷', '歌曲爱好者', '旋律追随者'][i],
      avatar: `https://source.unsplash.com/random/100x100/?user,${10 + i}`
    },
    content: `这是加载的第${i + 1}条评论，测试加载更多功能`,
    time: new Date(Date.now() - 3600000 * (24 + i)),
    likes: Math.floor(Math.random() * 20),
    liked: false,
    replies: []
  }))

  comments.value.push(...newComments)
  hasMoreComments.value = comments.value.length < 15
}

// 格式化时间
const formatTime = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  if (diff < 60000) {
    return '刚刚'
  } else if (diff < 3600000) {
    return `${Math.floor(diff / 60000)}分钟前`
  } else if (diff < 86400000) {
    return `${Math.floor(diff / 3600000)}小时前`
  } else {
    return `${Math.floor(diff / 86400000)}天前`
  }
}

const handlePageData = (data: any) => {
  const comments = data.map((comment: any) => ({
    id: comment.id,
    user: {
      id: comment.user_id,
      name: comment.username,
      avatar: comment.avatar_url
        ? apiBaseUrl + comment.avatar_url
        : `https://source.unsplash.com/random/100x100/?user,${comment.user_id}`,
    },
    content: comment.content,
    time: new Date(comment.created_at),
    likes: comment.likes_count,
    liked: false, // 默认未点赞，前端逻辑决定是否标记
    replies: (comment.replies || []).map((reply: any) => ({
      id: reply.id,
      user: {
        id: reply.user_id,
        name: reply.username,
        avatar: reply.avatar_url
          ? apiBaseUrl + reply.avatar_url
          : `https://source.unsplash.com/random/100x100/?user,${reply.user_id}`,
      },
      content: reply.content,
      replyTo: comment.username,
      time: new Date(reply.created_at),
      likes: reply.likes_count,
      liked: false,
    })),
  }));

  return comments;
};


const loadPageData = async () => {

  // console.log(user);

  try {
    const [
      getSomePlaylistsComments
    ] = await Promise.all([
      getSomePlaylistsCommentsApi(playlistId)
    ])
    // console.log(handlePageData(getSomePlaylistsComments.data));
    comments.value = handlePageData(getSomePlaylistsComments.data)
    currentUser.value = {
      id: user.id,
      name: user.username,
      avatar: user.avatar_url ? apiBaseUrl + user.avatar_url : `https://source.unsplash.com/random/100x100/?user,${user.id}`,
    }
  } catch (error) {
    console.error(error)
    ElMessage.error('请求数据失败')
  }
}

onMounted(() => {
  loadPageData()
})

</script>

<style scoped>
.comments-section {
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
  background-color: var(--bg-color);
  color: var(--text-color);
  transition: background-color 0.3s, color 0.3s;
  margin-top: 5vh;
}

/* 评论头部 */
.comments-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border-color);
}

.comments-title {
  margin: 0;
  font-size: 1.5rem;
}

.comments-count {
  color: var(--text-color);
  opacity: 0.7;
  font-size: 1rem;
}

.sort-options {
  display: flex;
  align-items: center;
}

.sort-label {
  font-size: 0.9rem;
  color: var(--text-color);
  opacity: 0.7;
}

.sort-select {
  padding: 5px 10px;
  border-radius: 4px;
  border: 1px solid var(--input-border);
  background-color: var(--input-bg);
  color: var(--input-text);
  cursor: pointer;
}

/* 评论输入框 */
.comment-input-container {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.input-area {
  flex: 1;
}

.comment-input,
.reply-input {
  width: 100%;
  min-height: 80px;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid var(--input-border);
  background-color: var(--input-bg);
  color: var(--input-text);
  resize: none;
  font-family: inherit;
  transition: border-color 0.3s;
}

.comment-input:focus,
.reply-input:focus {
  outline: none;
  border-color: var(--link-color);
}

.input-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.emoji-btn,
.image-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  color: var(--text-color);
  opacity: 0.7;
  transition: opacity 0.3s;
}

.emoji-btn:hover,
.image-btn:hover {
  opacity: 1;
}

.submit-btn {
  background-color: var(--button-bg);
  color: var(--button-text-color);
  border: none;
  padding: 6px 16px;
  border-radius: 15px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: opacity 0.3s;
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.submit-btn:not(:disabled):hover {
  opacity: 0.9;
}

/* 表情选择器 */
.emoji-picker {
  margin-bottom: 20px;
  padding: 10px;
  border-radius: 8px;
  background-color: var(--card-bg);
  box-shadow: 0 4px 8px var(--shadow-color);
}

.emoji-category {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  padding-bottom: 5px;
  border-bottom: 1px solid var(--border-color);
  overflow-x: auto;
}

.emoji-category span {
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 0.8rem;
  cursor: pointer;
  white-space: nowrap;
}

.emoji-category span.active {
  background-color: var(--button-bg);
  color: var(--button-text-color);
}

.emoji-grid {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 5px;
}

.emoji-grid span {
  font-size: 1.5rem;
  cursor: pointer;
  text-align: center;
  padding: 5px;
  border-radius: 5px;
}

.emoji-grid span:hover {
  background-color: var(--hover-bg);
}

/* 评论列表 */
.comments-list {
  margin-top: 20px;
}

.comment-item {
  display: flex;
  gap: 15px;
  padding: 15px 0;
  border-bottom: 1px solid var(--border-color);
}

.comment-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 5px;
}

.username {
  font-weight: bold;
  color: var(--text-color);
}

.comment-time {
  font-size: 0.8rem;
  color: var(--text-color);
  opacity: 0.6;
}

.comment-text {
  margin: 8px 0;
  line-height: 1.5;
  white-space: pre-wrap;
}

.comment-footer {
  display: flex;
  gap: 15px;
  margin-top: 10px;
}

.like-btn,
.reply-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  color: var(--text-color);
  opacity: 0.7;
  transition: opacity 0.3s;
}

.like-btn:hover,
.reply-btn:hover {
  opacity: 1;
}

.icon-liked {
  color: var(--error-color);
}

/* 回复列表 */
.replies-list {
  margin-top: 15px;
  padding-left: 15px;
  border-left: 2px solid var(--border-color);
}

.reply-item {
  display: flex;
  gap: 10px;
  padding: 10px 0;
}

.reply-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.reply-content {
  flex: 1;
}

.reply-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 3px;
}

.reply-time {
  font-size: 0.7rem;
  color: var(--text-color);
  opacity: 0.6;
}

.reply-text {
  font-size: 0.9rem;
  line-height: 1.4;
  white-space: pre-wrap;
}

.reply-to {
  color: var(--link-color);
  margin-right: 5px;
}

.reply-footer {
  margin-top: 5px;
}

/* 回复输入框 */
.reply-input-container {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.reply-input {
  min-height: 60px;
}

/* 加载更多 */
.load-more {
  text-align: center;
  margin-top: 20px;
}

.load-more-btn {
  background-color: var(--card-bg);
  color: var(--text-color);
  border: 1px solid var(--border-color);
  padding: 8px 20px;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s;
}

.load-more-btn:hover {
  background-color: var(--hover-bg);
}

/* 响应式设计 */
@media (max-width: 600px) {

  .comment-input-container,
  .comment-item,
  .reply-item {
    gap: 10px;
  }

  .user-avatar,
  .comment-avatar {
    width: 32px;
    height: 32px;
  }

  .comment-header,
  .reply-header {
    flex-wrap: wrap;
  }

  .emoji-grid {
    grid-template-columns: repeat(8, 1fr);
  }
}
</style>
<template>
  <div class="song-detail-page">
    <!-- 歌曲头部信息 -->
    <div class="song-header">
      <div class="song-cover-container">
        <img :src="song.cover" :alt="song.name" class="song-cover">
        <div class="cover-mask"></div>
      </div>
      <div class="song-info">
        <h1 class="song-title">{{ song.name }}</h1>
        <p class="song-artist">
          <router-link :to="`/artist/${song.artistId}`">{{ song.artist }}</router-link>
          <span v-if="song.album"> • <router-link :to="`/album/${song.albumId}`">{{ song.album }}</router-link></span>
        </p>

        <div class="song-meta">
          <span class="meta-item"><i class="icon-play"></i> {{ song.playCount }}次播放</span>
          <span class="meta-item"><i class="icon-calendar"></i> {{ song.releaseDate }}</span>
          <span class="meta-item"><i class="icon-time"></i> {{ song.duration }}</span>
        </div>

        <div class="song-actions">
          <button class="play-button" @click="playSong">
            <i class="icon-play"></i> 播放
          </button>
          <button class="action-button" @click="toggleLike" :class="{ liked: song.liked }">
            <i :class="song.liked ? 'icon-heart-filled' : 'icon-heart'"></i> {{ song.liked ? '已喜欢' : '喜欢' }}
          </button>
          <button class="action-button" @click="addToPlaylist">
            <i class="icon-add"></i> 添加到
          </button>
          <button class="action-button" @click="downloadSong">
            <i class="icon-download"></i> 下载
          </button>
          <button class="action-button" @click="shareSong">
            <i class="icon-share"></i> 分享
          </button>
        </div>

        <div class="song-tags">
          <span class="tag" v-for="tag in song.tags" :key="tag">{{ tag }}</span>
        </div>
      </div>
    </div>

    <!-- 歌词区域 -->
    <div class="lyrics-section">
      <h2 class="section-title">歌词</h2>
      <div class="lyrics-container" ref="lyricsContainer">
        <div class="lyric-line" v-for="(line, index) in song.lyrics" :key="index"
          :class="{ active: currentLyricIndex === index }">
          {{ line.text }}
        </div>
      </div>
    </div>

    <!-- 相似歌曲推荐 -->
    <div class="similar-songs-section">
      <h2 class="section-title">相似歌曲</h2>
      <div class="similar-songs-grid">
        <div class="similar-song-card" v-for="similarSong in similarSongs" :key="similarSong.id"
          @click="playSimilarSong(similarSong)">
          <div class="similar-song-cover">
            <img :src="similarSong.cover" :alt="similarSong.name">
            <button class="play-icon">
              <i class="icon-play"></i>
            </button>
          </div>
          <div class="similar-song-info">
            <h3>{{ similarSong.name }}</h3>
            <p>{{ similarSong.artist }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 评论区域 -->
    <div class="comments-section">
      <h2 class="section-title">评论 ({{ song.commentCount }})</h2>

      <div class="comment-input">
        <img :src="userAvatar" class="user-avatar">
        <div class="input-container">
          <textarea v-model="commentText" placeholder="分享你的感受..." @focus="expandTextarea"></textarea>
          <div class="comment-actions" v-if="isTextareaExpanded">
            <button class="cancel-button" @click="cancelComment">取消</button>
            <button class="submit-button" @click="submitComment">发表</button>
          </div>
        </div>
      </div>

      <div class="comments-list">
        <div class="comment-item" v-for="comment in comments" :key="comment.id">
          <img :src="comment.user.avatar" class="comment-avatar">
          <div class="comment-content">
            <div class="comment-header">
              <span class="comment-user">{{ comment.user.name }}</span>
              <span class="comment-time">{{ comment.time }}</span>
            </div>
            <p class="comment-text">{{ comment.text }}</p>
            <div class="comment-footer">
              <button class="like-button" @click="likeComment(comment)">
                <i :class="comment.liked ? 'icon-heart-filled' : 'icon-heart'"></i>
                {{ comment.likeCount }}
              </button>
              <button class="reply-button" @click="replyComment(comment)">
                <i class="icon-reply"></i> 回复
              </button>
            </div>
          </div>
        </div>
      </div>

      <button class="load-more" v-if="hasMoreComments" @click="loadMoreComments">
        加载更多评论
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      song: {
        id: '1',
        name: '歌曲名称',
        artist: '歌手名称',
        artistId: '1',
        album: '专辑名称',
        albumId: '1',
        cover: 'https://picsum.photos/400/400?random=1',
        playCount: '1,234,567',
        releaseDate: '2023-05-15',
        duration: '3:45',
        liked: false,
        tags: ['流行', '华语', '治愈'],
        lyrics: [
          { time: 0, text: '[前奏]' },
          { time: 10, text: '第一句歌词' },
          { time: 15, text: '第二句歌词' },
          // 更多歌词...
        ],
        commentCount: 128
      },
      currentLyricIndex: 0,
      similarSongs: [
        { id: '2', name: '相似歌曲1', artist: '歌手A', cover: 'https://picsum.photos/200/200?random=2' },
        { id: '3', name: '相似歌曲2', artist: '歌手B', cover: 'https://picsum.photos/200/200?random=3' },
        { id: '4', name: '相似歌曲3', artist: '歌手C', cover: 'https://picsum.photos/200/200?random=4' },
        { id: '5', name: '相似歌曲4', artist: '歌手D', cover: 'https://picsum.photos/200/200?random=5' }
      ],
      userAvatar: 'https://picsum.photos/50/50?random=100',
      commentText: '',
      isTextareaExpanded: false,
      comments: [
        {
          id: '1',
          user: {
            name: '用户1',
            avatar: 'https://picsum.photos/50/50?random=101'
          },
          text: '这首歌真的太好听了，我已经循环了一整天！',
          time: '2小时前',
          likeCount: 24,
          liked: false
        },
        {
          id: '2',
          user: {
            name: '用户2',
            avatar: 'https://picsum.photos/50/50?random=102'
          },
          text: '歌词写得很有深意，旋律也很抓耳',
          time: '5小时前',
          likeCount: 15,
          liked: true
        }
        // 更多评论...
      ],
      hasMoreComments: true
    }
  },
  methods: {
    playSong() {
      console.log('播放歌曲:', this.song.name)
    },
    toggleLike() {
      this.song.liked = !this.song.liked
      console.log(this.song.liked ? '已喜欢' : '已取消喜欢', this.song.name)
    },
    addToPlaylist() {
      console.log('添加到播放列表:', this.song.name)
    },
    downloadSong() {
      console.log('下载歌曲:', this.song.name)
    },
    shareSong() {
      console.log('分享歌曲:', this.song.name)
    },
    playSimilarSong(song) {
      console.log('播放相似歌曲:', song.name)
    },
    expandTextarea() {
      this.isTextareaExpanded = true
    },
    cancelComment() {
      this.commentText = ''
      this.isTextareaExpanded = false
    },
    submitComment() {
      if (this.commentText.trim()) {
        console.log('发表评论:', this.commentText)
        this.commentText = ''
        this.isTextareaExpanded = false
      }
    },
    likeComment(comment) {
      comment.liked = !comment.liked
      comment.likeCount += comment.liked ? 1 : -1
    },
    replyComment(comment) {
      console.log('回复评论:', comment.user.name)
    },
    loadMoreComments() {
      console.log('加载更多评论')
    }
  }
}
</script>

<style scoped>
.song-detail-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* 歌曲头部信息样式 */
.song-header {
  display: flex;
  gap: 40px;
  margin-bottom: 40px;
}

.song-cover-container {
  position: relative;
  width: 300px;
  height: 300px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 8px 20px var(--shadow-color);
}

.song-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-mask {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.5));
}

.song-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.song-title {
  margin: 0 0 10px 0;
  font-size: 2rem;
  color: var(--text-color);
}

.song-artist {
  margin: 0 0 20px 0;
  font-size: 1.1rem;
  color: var(--text-color);
  opacity: 0.9;
}

.song-artist a {
  color: var(--link-color);
  text-decoration: none;
}

.song-artist a:hover {
  text-decoration: underline;
}

.song-meta {
  display: flex;
  gap: 20px;
  margin-bottom: 25px;
  font-size: 0.9rem;
  color: var(--text-color);
  opacity: 0.7;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.song-actions {
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
  flex-wrap: wrap;
}

.play-button {
  background-color: var(--button-bg);
  color: var(--button-text-color);
  border: none;
  padding: 10px 25px;
  border-radius: 20px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.play-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.action-button {
  background-color: var(--card-bg);
  color: var(--text-color);
  border: none;
  padding: 8px 15px;
  border-radius: 20px;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: background-color 0.2s;
}

.action-button:hover {
  background-color: var(--hover-bg);
}

.action-button.liked {
  color: var(--error-color);
}

.song-tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.tag {
  background-color: var(--card-bg);
  color: var(--text-color);
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  transition: background-color 0.2s;
}

.tag:hover {
  background-color: var(--hover-bg);
}

/* 歌词区域样式 */
.lyrics-section {
  margin-bottom: 40px;
}

.section-title {
  margin: 0 0 20px 0;
  font-size: 1.5rem;
  color: var(--text-color);
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border-color);
}

.lyrics-container {
  max-height: 400px;
  overflow-y: auto;
  padding: 15px;
  background-color: var(--card-bg);
  border-radius: 8px;
  line-height: 2;
  font-size: 1.1rem;
  text-align: center;
}

.lyric-line {
  margin: 10px 0;
  color: var(--text-color);
  opacity: 0.7;
  transition: all 0.3s;
}

.lyric-line.active {
  color: var(--button-bg);
  opacity: 1;
  font-weight: bold;
  transform: scale(1.05);
}

/* 相似歌曲样式 */
.similar-songs-section {
  margin-bottom: 40px;
}

.similar-songs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.similar-song-card {
  background-color: var(--card-bg);
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.similar-song-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px var(--shadow-color);
}

.similar-song-cover {
  position: relative;
  padding-top: 100%;
  overflow: hidden;
}

.similar-song-cover img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.play-icon {
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.similar-song-card:hover .play-icon {
  opacity: 1;
}

.similar-song-info {
  padding: 12px;
}

.similar-song-info h3 {
  margin: 0 0 5px 0;
  font-size: 0.95rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.similar-song-info p {
  margin: 0;
  font-size: 0.8rem;
  opacity: 0.7;
}

/* 评论区域样式 */
.comments-section {
  margin-bottom: 40px;
}

.comment-input {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
}

.user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.input-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.input-container textarea {
  width: 100%;
  min-height: 50px;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--input-bg);
  color: var(--input-text);
  resize: none;
  font-family: inherit;
  transition: min-height 0.3s;
}

.input-container textarea:focus {
  outline: none;
  border-color: var(--button-bg);
  min-height: 80px;
}

.comment-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
}

.cancel-button {
  background: none;
  border: none;
  color: var(--text-color);
  opacity: 0.7;
  cursor: pointer;
  padding: 5px 10px;
}

.submit-button {
  background-color: var(--button-bg);
  color: var(--button-text-color);
  border: none;
  padding: 5px 15px;
  border-radius: 4px;
  cursor: pointer;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.comment-item {
  display: flex;
  gap: 15px;
}

.comment-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
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

.comment-user {
  font-weight: bold;
  font-size: 0.9rem;
}

.comment-time {
  font-size: 0.8rem;
  opacity: 0.7;
}

.comment-text {
  margin: 0 0 8px 0;
  font-size: 0.9rem;
  line-height: 1.5;
}

.comment-footer {
  display: flex;
  gap: 15px;
}

.like-button,
.reply-button {
  background: none;
  border: none;
  color: var(--text-color);
  opacity: 0.7;
  font-size: 0.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 3px;
}

.like-button:hover,
.reply-button:hover {
  opacity: 1;
}

.like-button.liked {
  color: var(--error-color);
  opacity: 1;
}

.load-more {
  display: block;
  width: 100%;
  padding: 10px;
  background-color: var(--card-bg);
  color: var(--text-color);
  border: none;
  border-radius: 4px;
  margin-top: 20px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.load-more:hover {
  background-color: var(--hover-bg);
}

/* 图标样式 */
[class^="icon-"] {
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  display: inline-block;
}

.icon-play::before {
  content: "▶";
}

.icon-heart::before {
  content: "♡";
}

.icon-heart-filled::before {
  content: "❤";
}

.icon-add::before {
  content: "+";
}

.icon-download::before {
  content: "⏬";
}

.icon-share::before {
  content: "↗";
}

.icon-calendar::before {
  content: "📅";
}

.icon-time::before {
  content: "⏱";
}

.icon-reply::before {
  content: "↩";
}
</style>
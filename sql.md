好的，下面是带注释的数据库表设计。每个表后面都附有详细的注释说明，以便更好地理解每个字段的作用和设计意图。

---

## 1. **用户相关**

### `users` 用户表

```sql
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,  -- 用户ID，主键，自动增长
    username VARCHAR(50) UNIQUE NOT NULL,    -- 用户名，唯一且不能为空
    password_hash VARCHAR(255) NOT NULL,     -- 加密后的密码，不能为空
    email VARCHAR(100) UNIQUE,               -- 用户邮箱，唯一，用于找回密码等功能
    avatar_url VARCHAR(255),                 -- 用户头像的 URL 地址，可为空
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP -- 账户创建时间，默认当前时间
);
```

- **`user_id`**：主键，唯一标识用户。
- **`username`**：用户登录时的标识，唯一，不能为空。
- **`password_hash`**：存储经过加密的密码，用于验证用户身份。
- **`email`**：用户的邮箱地址，通常用于找回密码和系统通知。
- **`avatar_url`**：用户头像的 URL 地址，用户可上传个人头像。
- **`created_at`**：账户创建时间，用于记录用户注册时间。

---

### ✅ `user_profiles` 用户详细信息表

```sql
CREATE TABLE user_profiles (
    profile_id INT PRIMARY KEY AUTO_INCREMENT,        -- 主键，自增
    user_id INT NOT NULL,                             -- 外键，关联 users 表
    nickname VARCHAR(50),                             -- 昵称
    gender ENUM('male', 'female', 'other') DEFAULT 'other',  -- 性别
    birthday DATE,                                     -- 生日
    bio TEXT,                                          -- 个性签名/简介
    phone VARCHAR(20),                                 -- 手机号
    address VARCHAR(255),                              -- 地址
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,     -- 创建时间
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- 更新时间

    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
```

---

### 📘 字段说明

| 字段名       | 类型/约束                         | 描述                        |
| ------------ | --------------------------------- | --------------------------- |
| `profile_id` | `INT PRIMARY KEY AUTO_INCREMENT`  | 唯一标识该记录              |
| `user_id`    | `INT`，`FOREIGN KEY`              | 关联 `users` 表的 `user_id` |
| `nickname`   | `VARCHAR(50)`                     | 用户昵称（可修改）          |
| `gender`     | `ENUM('male', 'female', 'other')` | 性别（使用枚举类型）        |
| `birthday`   | `DATE`                            | 生日                        |
| `bio`        | `TEXT`                            | 简介/个性签名               |
| `phone`      | `VARCHAR(20)`                     | 联系电话（可选）            |
| `address`    | `VARCHAR(255)`                    | 地址（可选）                |
| `created_at` | `DATETIME`                        | 创建时间                    |
| `updated_at` | `DATETIME` ON UPDATE 自动更新时间 | 最近一次更新时间            |

---

### `user_levels` 用户等级表

```sql
CREATE TABLE user_levels (
    user_id INT PRIMARY KEY,              -- 用户ID，主键，唯一标识
    level INT DEFAULT 1,                   -- 用户的等级，默认等级为1
    exp_points INT DEFAULT 0,              -- 用户的经验点数，默认从0开始
    last_update DATETIME,                  -- 最后一次等级更新的时间
    FOREIGN KEY(user_id) REFERENCES users(user_id) -- 外键，关联 `users` 表的 `user_id`
);
```

- **`user_id`**：外键，关联 `users` 表中的用户 ID。
- **`level`**：用户的等级，基于经验点数和平台规则动态调整。
- **`exp_points`**：经验点数，记录用户的活跃度和成就。
- **`last_update`**：上次等级更新时间，记录最后一次用户等级的变化。

---

### `user_follows` 用户关注表

```sql
CREATE TABLE user_follows (
    follower_id INT,                      -- 关注者ID，外键，关联 `users` 表
    followee_id INT,                      -- 被关注者ID，外键，关联 `users` 表
    followed_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- 关注时间，默认当前时间
    PRIMARY KEY(follower_id, followee_id), -- 联合主键，保证一个用户只能关注另一个用户一次
    FOREIGN KEY(follower_id) REFERENCES users(user_id), -- 外键，关联 `users` 表
    FOREIGN KEY(followee_id) REFERENCES users(user_id)  -- 外键，关联 `users` 表
);
```

- **`follower_id`**：外键，表示关注者的用户 ID。
- **`followee_id`**：外键，表示被关注者的用户 ID。
- **`followed_at`**：记录用户的关注时间，默认当前时间。

---

### `messages` 私信表

```sql
CREATE TABLE messages (
    message_id INT PRIMARY KEY AUTO_INCREMENT,  -- 消息ID，主键，自动增长
    sender_id INT,                             -- 发送者ID，外键，关联 `users` 表
    receiver_id INT,                           -- 接收者ID，外键，关联 `users` 表
    content TEXT,                              -- 消息内容
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- 消息发送时间
    is_read BOOLEAN DEFAULT FALSE,             -- 消息是否已读，默认未读
    FOREIGN KEY(sender_id) REFERENCES users(user_id), -- 外键，关联 `users` 表
    FOREIGN KEY(receiver_id) REFERENCES users(user_id) -- 外键，关联 `users` 表
);
```

- **`sender_id`**：发送者的用户 ID。
- **`receiver_id`**：接收者的用户 ID。
- **`content`**：消息的内容。
- **`sent_at`**：消息的发送时间。
- **`is_read`**：标记消息是否已读，`FALSE` 表示未读，`TRUE` 表示已读。

---

## 2. **艺人/专辑/音乐资源**

### `artists` 艺人表

```sql
CREATE TABLE artists (
    artist_id INT PRIMARY KEY AUTO_INCREMENT,  -- 艺人ID，主键，自动增长
    name VARCHAR(100) NOT NULL,                -- 艺人名字，不能为空
    bio TEXT,                                  -- 艺人简介，可以为空
    avatar_url VARCHAR(255),                   -- 艺人头像URL
    country VARCHAR(50)                        -- 艺人所在的国家
);
```

- **`artist_id`**：主键，唯一标识一个艺人。
- **`name`**：艺人的名字，不能为空。
- **`bio`**：艺人的简介，可为空，用于描述艺人的背景和历史。
- **`avatar_url`**：艺人头像的 URL 地址。
- **`country`**：艺人所属的国家或地区。

---

### `albums` 专辑表

```sql
CREATE TABLE albums (
    album_id INT PRIMARY KEY AUTO_INCREMENT,   -- 专辑ID，主键，自动增长
    title VARCHAR(100) NOT NULL,               -- 专辑标题，不能为空
    release_date DATE,                         -- 专辑发布日期
    cover_url VARCHAR(255),                    -- 专辑封面图片URL
    artist_id INT,                             -- 外键，关联艺人ID，表示该专辑由哪个艺人发布
    FOREIGN KEY(artist_id) REFERENCES artists(artist_id) -- 外键，关联 `artists` 表的 `artist_id`
);
```

- **`album_id`**：主键，唯一标识专辑。
- **`title`**：专辑的名称，不能为空。
- **`release_date`**：专辑的发布日期。
- **`cover_url`**：专辑封面的 URL 地址。
- **`artist_id`**：外键，关联 `artists` 表，表示该专辑属于哪个艺人。

---

### `songs` 歌曲表

```sql
CREATE TABLE songs (
    song_id INT PRIMARY KEY AUTO_INCREMENT,    -- 歌曲ID，主键，自动增长
    title VARCHAR(100) NOT NULL,               -- 歌曲标题，不能为空
    duration INT,                              -- 歌曲时长（秒）
    audio_url VARCHAR(255),                    -- 歌曲的音频文件URL
    album_id INT,                              -- 外键，关联专辑ID，表示该歌曲所属的专辑
    artist_id INT,                             -- 外键，关联艺人ID，表示歌曲由哪个艺人发布
    release_date DATE,                         -- 歌曲发布的日期
    play_count INT DEFAULT 0,                  -- 歌曲播放次数，默认从0开始
    FOREIGN KEY(album_id) REFERENCES albums(album_id), -- 外键，关联 `albums` 表的 `album_id`
    FOREIGN KEY(artist_id) REFERENCES artists(artist_id) -- 外键，关联 `artists` 表的 `artist_id`
);
```

- **`song_id`**：主键，唯一标识一首歌曲。
- **`title`**：歌曲标题，不能为空。
- **`duration`**：歌曲时长（秒），用来记录歌曲的播放时长。
- **`audio_url`**：歌曲的音频文件 URL 地址。
- **`album_id`**：外键，关联 `albums` 表，表示歌曲所属专辑。
- **`artist_id`**：外键，关联 `artists` 表，表示歌曲属于哪个艺人。
- **`release_date`**：歌曲发布的日期。
- **`play_count`**：歌曲的播放次数，默认从 0 开始，随着播放增加。

---

### `lyrics` 歌词表

```sql
CREATE TABLE lyrics (
    song_id INT PRIMARY KEY,  -- 外键，关联 `songs` 表的 `song_id`
    content TEXT,             -- 歌词内容
    language VARCHAR(20),     -- 歌词语言（例如：中文、英语）
    FOREIGN KEY(song_id) REFERENCES songs(song_id) -- 外键，关联 `songs` 表
);
```

- **`song_id`**：外键，关联 `songs` 表，表示该歌词属于哪一首歌曲。
- **`content`**：歌词内容，存储歌曲的文字部分。
- **`language`**：歌词的语言（例如：中文、英语等）。

---

## 3. **用户交互**

### `comments` 评论表

```sql
CREATE TABLE comments (
    comment_id INT PRIMARY KEY AUTO_INCREMENT,  -- 评论ID，主键，自动增长
    user_id INT,                               -- 评论者ID，外键，关联 `users` 表
    song_id INT,                               -- 评论的歌曲ID，外键，关联 `songs` 表
    content TEXT NOT NULL,                     -- 评论内容，不能为空
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- 评论创建时间，默认当前时间
    FOREIGN KEY(user_id) REFERENCES users(user_id), -- 外键，关联 `users` 表的 `user_id`
    FOREIGN KEY(song_id) REFERENCES songs(song_id)  -- 外键，关联 `songs` 表的 `song_id`
);
```

- **`comment_id`**：主键，唯一标识每一条评论。
- **`user_id`**：外键，评论者的用户 ID。
- **`song_id`**：外键，评论所属的歌曲 ID。
- **`content`**：评论的内容，不能为空。
- **`created_at`**：评论的创建时间，默认为当前时间。

---

### `user_favorites` 收藏歌曲表

```sql
CREATE TABLE user_favorites (
    user_id INT,                                -- 用户ID，外键，关联 `users` 表
    song_id INT,                                -- 歌曲ID，外键，关联 `songs` 表
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- 收藏时间，默认当前时间
    PRIMARY KEY(user_id, song_id),              -- 联合主键，保证每个用户对每首歌只收藏一次
    FOREIGN KEY(user_id) REFERENCES users(user_id), -- 外键，关联 `users` 表的 `user_id`
    FOREIGN KEY(song_id) REFERENCES songs(song_id)  -- 外键，关联 `songs` 表的 `song_id`
);
```

- **`user_id`**：外键，用户 ID，表示收藏歌曲的用户。
- **`song_id`**：外键，歌曲 ID，表示用户收藏的歌曲。
- **`created_at`**：歌曲被收藏的时间。

---

以上是每个表的详细设计和解释。如果你有任何疑问或需要更多细节，随时告诉我！

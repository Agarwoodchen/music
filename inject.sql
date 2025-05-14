CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,  -- 用户ID，主键，自动增长
    username VARCHAR(50) UNIQUE NOT NULL,    -- 用户名，唯一且不能为空
    password_hash VARCHAR(255) NOT NULL,     -- 加密后的密码，不能为空
    email VARCHAR(100) UNIQUE,               -- 用户邮箱，唯一，用于找回密码等功能
    avatar_url VARCHAR(255),                 -- 用户头像的 URL 地址，可为空
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP -- 账户创建时间，默认当前时间
);
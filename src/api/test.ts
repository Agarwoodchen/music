import axios from 'axios';
import config from './config';

const apiClient = axios.create({
  baseURL: config.API_TEST_SQL,
  headers: { 'Content-Type': 'application/json' }
});

// 获取歌手接口
// 获取歌手列表
export const getArtistsListApi = async () => {
  try {
    const response = await apiClient.get('/api/artists');
    // console.log(response.data, '歌手列表');
    return response.data; // 返回的是歌手数组
  } catch (error) {
    console.error('获取歌手列表失败:', error);
    return {
      success: false,
      message: error.response?.data?.message || '获取歌手列表失败'
    };
  }
};


// 获取歌手的专辑、歌曲和歌手自身信息（通过歌手 ID）
export const getArtistDetailsMUALMApi = async (artistId) => {
  try {
    const response = await apiClient.get(`/api/artist-details/${artistId}`);
    return response.data; // 返回包含 artist 和 albums 的对象
  } catch (error) {
    console.error('获取歌手详情失败:', error);
    return {
      success: false,
      message: error.response?.data?.message || '获取歌手详情失败'
    };
  }
};


// GET /api/album/:id - 查询专辑和其所有歌曲
export const getAllAlbumAndSongApi = async (albumId) => {
  try {
    const response = await apiClient.get(`/api/album/${albumId}`);
    return response.data;
  } catch (error) {
    console.error('获取专辑详情失败:', error);
    return {
      success: false,
      message: error.response?.data?.message || '获取专辑详情失败'
    };
  }
};


// 获取指定歌曲详情
// 获取指定歌曲详情
export const getDirectSongDetailApi = async (songId: number, userId: number) => {
  try {
    const response = await apiClient.get(`/api/songsBySongId/${songId}`, {
      params: { userId }
    });

    const data = response.data;

    if (!data || data.error) {
      return {
        success: false,
        message: data?.error || '未找到歌曲详情'
      };
    }

    return {
      success: true,
      data
    };
  } catch (error: any) {
    console.error('获取歌曲详情失败:', error);
    return {
      success: false,
      message: error.response?.data?.error || error.message || '获取歌曲详情失败'
    };
  }
};


// 根据用户 ID 获取该用户 自己创建的歌单 以及 收藏的歌单
export const getUserPlaylistsApi = async (userId: number) => {
  try {
    const response = await apiClient.get(`/api/user/${userId}/playlists`);
    if (!response.data || response.data.error) {
      return {
        success: false,
        message: response.data?.error || '未找到歌单数据'
      };
    }
    return {
      success: true,
      data: response.data
    };
  } catch (error: any) {
    console.error('获取用户歌单失败:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || '获取用户歌单失败'
    };
  }
};

//“新建歌单”的 API  
export const createPlaylistApi = async (playlistData: {
  name: string;
  description?: string;
  cover_url?: string;
  user_id?: number;
  is_public?: number;
  tags?: string;
  category?: string;
}) => {
  try {
    const response = await apiClient.post('/api/playlists/create', playlistData);
    if (response.data.success) {
      return {
        success: true,
        playlistId: response.data.playlist_id
      };
    } else {
      return {
        success: false,
        message: response.data.message || '创建失败'
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || '创建失败'
    };
  }
};


// 上传封面图片
export const uploadCoverImageApi = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('cover', file); // 这个字段名和后端 multer.single('cover') 保持一致

    const response = await apiClient.post('/api/upload/playlist-cover', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return {
      success: true,
      coverUrl: response.data.coverUrl
    };
  } catch (error: any) {
    console.error('上传封面图片失败:', error);
    return {
      success: false,
      message: error.response?.data?.message || '上传封面图片失败'
    };
  }
};




// 获取推荐歌单
// 获取推荐歌单
export const getRecommendationPlayListApi = async () => {
  try {
    const response = await apiClient.get('/api/recommended/playlists');
    const { success, data, message } = response.data;

    if (!success) {
      return {
        success: false,
        message: message || '未找到推荐歌单'
      };
    }

    return {
      success: true,
      data
    };
  } catch (error: any) {
    console.error('获取推荐歌单失败:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || '获取推荐歌单失败'
    };
  }
};


// 获取全部歌单（分页）
export const getAllPlaylistsApi = async (page, pageSize) => {
  try {
    const response = await apiClient.get('/api/playlists', {
      params: { page, pageSize }
    });

    if (response.data.success) {
      return {
        success: true,
        data: response.data.data,
        total: response.data.total,
        page: response.data.page,
        pageSize: response.data.pageSize
      };
    } else {
      return { success: false, message: response.data.message };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || '获取歌单失败'
    };
  }
};



// 获取歌单详情
// 获取歌单详情（包含歌曲信息和用户信息）
export const getPlaylistsDetailsApi = async (playlistId: number, userId?: number) => {
  try {
    const response = await apiClient.get(`/api/playlistsDetails/${playlistId}`, {
      params: userId ? { user_id: userId } : {}
    });

    if (response.data.success) {
      return {
        success: true,
        data: response.data.data
      };
    } else {
      return { success: false, message: response.data.message };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || '获取歌单失败'
    };
  }
};


// 获取某个歌单下的评论
export const getSomePlaylistsCommentsApi = async (
  playlistId: number,
  user_id: number
) => {
  try {
    const response = await apiClient.get(`/api/playlists/${playlistId}/comments`, {
      params: {
        user_id: user_id, // ← 传入当前用户ID
      },
    });

    if (response.data.success) {
      return {
        success: true,
        data: response.data.data,
      };
    } else {
      return { success: false, message: response.data.message };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || '获取评论失败',
    };
  }
};




// 添加评论或子评论
export const addSomePlaylistsCommentsOrReplyApi = async (
  playlistId: number,
  commentData: {
    user_id: number;
    content: string;
    parent_id?: number; // 如果是子评论就传 parent_id
  }
) => {
  try {
    const response = await apiClient.post(`/api/playlists/${playlistId}/comments`, commentData);

    if (response.data.success) {
      return {
        success: true,
        data: response.data.data,
      };
    } else {
      return { success: false, message: response.data.message };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || '添加评论失败',
    };
  }
};



// 添加歌曲到歌单
// 添加歌曲到歌单
export const addSongToPlaylistApi = async (
  playlistId: number,
  songId: number,
  userId: number
) => {
  try {
    const response = await apiClient.post('/api/playlist/add-song', {
      playlist_id: playlistId,
      song_id: songId,
      added_by: userId,
    });

    if (response.data.message === '歌曲添加成功') {
      return {
        success: true,
        data: response.data,
      };
    } else {
      return { success: false, message: response.data.message };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || '添加歌曲失败',
    };
  }
};



// 点赞或取消点赞评论
export const toggleLikeComment = async (user_id: number, comment_id: number) => {
  try {
    const response = await apiClient.post('/api/comment/like', { user_id, comment_id });
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || '操作失败',
    };
  }
};


// 添加收藏歌曲接口
// 添加收藏歌曲接口（前端调用）
export const toggleFavoritesSongApi = async (user_id: number, song_id: number) => {
  try {
    const response = await apiClient.post('/api/favorites/song', { user_id, song_id });
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || '操作失败',
    };
  }
};
// 获取用户收藏歌曲接口
export const getUserFavoriteSongsApi = async (userId: number) => {
  try {
    const res = await apiClient.get(`/api/favorites/songs/${userId}`);
    return res.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || '获取收藏歌曲失败'
    };
  }
};

// 获取用户信息
// 获取用户信息
export const getUserDetailDataApi = async (userId: number) => {
  try {
    const res = await apiClient.get(`/api/users/${userId}`);
    return {
      success: true,
      data: res.data
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.error || error.message || '获取用户信息失败'
    };
  }
};


// 上传头像
export const uploadUserAvatarApi = async (file: File, userId: number) => {
  const formData = new FormData();
  formData.append('avatar', file);
  formData.append('userId', userId.toString());

  try {
    const res = await apiClient.post('/upload-avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return {
      success: true,
      data: res.data
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.error || error.message || '头像上传失败'
    };
  }
};

// 更新用户信息接口
// 更新用户信息接口
export const updateUsersDetailDataApi = async (userId: number, payload: any) => {
  try {
    const res = await apiClient.put(`/api/updataUsers/${userId}`, payload);
    return {
      success: true,
      data: res.data
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.error || error.message || '更新用户信息失败'
    };
  }
};



// 根据用户 ID 获取该用户收藏的歌单
// 根据用户 ID 获取该用户收藏的歌单
export const getUserFavoritePlaylistsApi = async (userId: number) => {
  try {
    const response = await apiClient.get(`/api/users/${userId}/favorite-playlists`);

    if (!response.data || response.data.success === false) {
      return {
        success: false,
        message: response.data?.message || '未找到歌单数据'
      };
    }

    return {
      success: true,
      data: response.data.data  // 只提取有效的数据数组
    };
  } catch (error: any) {
    console.error('获取用户歌单失败:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || '获取用户歌单失败'
    };
  }
};



// 根据用户id和歌单id添加歌单进收藏api
// 添加收藏歌单
export const addFavoritePlaylistApi = async (userId: number, playlistId: number) => {
  try {
    const response = await apiClient.post('/api/addFavoritePlaylist', {
      user_id: userId,
      playlist_id: playlistId
    });

    return {
      success: true,
      message: response.data.message || '收藏成功'
    };
  } catch (error: any) {
    console.error('添加收藏失败:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || '添加收藏失败'
    };
  }
};


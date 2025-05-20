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
export const getDirectSongDetailApi = async (songId: number) => {
  try {
    const response = await apiClient.get(`/api/songsBySongId/${songId}`);
    // 这里可以判断返回数据是否合理
    if (!response.data || response.data.error) {
      return {
        success: false,
        message: response.data?.error || '未找到歌曲详情'
      };
    }
    return {
      success: true,
      data: response.data
    };
  } catch (error: any) {
    console.error('获取歌曲详情失败:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || '获取歌曲详情失败'
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
export const getAllPlaylistsApi = async (page = 1, pageSize = 12) => {
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


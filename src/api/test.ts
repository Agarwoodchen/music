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

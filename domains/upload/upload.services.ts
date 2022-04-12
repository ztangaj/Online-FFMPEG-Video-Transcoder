import axios, { AxiosRequestConfig } from 'axios'
import { ApiResponse } from '../../models/ApiResponse'

const uploadFileRequest = async (
  formData: FormData,
  progressCallback?: (progressEvent: ProgressEvent) => void
): Promise<ApiResponse<string[]>> => {
  console.log('upload file request')
  const config: AxiosRequestConfig = {
    headers: { 'content-type': 'multipart/form-data' },
    onUploadProgress: progressCallback,
    validateStatus: (status) => true
  }
  const response = await axios.post('/api/upload', formData, config)
  // const response = await axios.post('api/upload')

  return response.data
}

export default uploadFileRequest

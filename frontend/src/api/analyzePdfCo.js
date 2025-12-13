import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";


export const analyzePDFWithPdfCo = async (pdfId, page) => {
  const url = page
    ? `${API_URL}/analyze/upload/${pdfId}?page=${page}`
    : `${API_URL}/analyze/upload/${pdfId}`;
  
  const response = await axios.get(url);
  return response.data;
};
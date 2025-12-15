import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Configure axios instance for PDF reports
const reportsApi = axios.create({
  baseURL: `${API_BASE_URL}/reports`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor to handle errors
reportsApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Reports API Error:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      url: error.config?.url
    });
    return Promise.reject(error);
  }
);


export const pdfReportsApi = {


  async generateReport(reportData) {
    try {

      const response = await reportsApi.post('/generate', reportData);

      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Failed to generate PDF report');
      }
    } catch (error) {

      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.response?.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      } else if (error.response?.status === 400) {
        throw new Error('Invalid report data. Please check all required fields.');
      } else {
        throw new Error('Failed to generate PDF report. Please try again.');
      }
    }
  },


  async generateEnhancedReport(reportData) {
    try {

      const response = await reportsApi.post('/generate-enhanced', reportData);

      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Failed to generate enhanced PDF report');
      }
    } catch (error) {

      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.response?.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      } else if (error.response?.status === 400) {
        throw new Error('Invalid enhanced report data. Please check all required fields.');
      } else {
        throw new Error('Failed to generate enhanced PDF report. Please try again.');
      }
    }
  },


  async generateInstitutionalReport(reportData) {
    try {

      const response = await reportsApi.post('/generate-institutional', reportData);

      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Failed to generate institutional PDF report');
      }
    } catch (error) {

      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.response?.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      } else if (error.response?.status === 400) {
        throw new Error('Invalid institutional report data. Please check all required fields.');
      } else {
        throw new Error('Failed to generate institutional PDF report. Please try again.');
      }
    }
  },


  async getReports(options = {}) {
    try {
      const { page = 1, limit = 10 } = options;

      const response = await reportsApi.get('/list', {
        params: { page, limit }
      });

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch reports');
      }
    } catch (error) {

      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error('Failed to fetch reports. Please try again.');
      }
    }
  },


  async downloadReport(reportId) {
    try {
      const response = await reportsApi.get(`/download/${reportId}`, {
        responseType: 'blob'
      });

      return response.data;
    } catch (error) {

      if (error.response?.status === 404) {
        throw new Error('Report not found or has been deleted.');
      } else {
        throw new Error('Failed to download Excel report. Please try again.');
      }
    }
  },


  async downloadPDFReport(reportId) {
    try {
      const response = await reportsApi.get(`/download-pdf/${reportId}`, {
        responseType: 'blob'
      });

      return response.data;
    } catch (error) {

      if (error.response?.status === 404) {
        throw new Error('Report not found or has been deleted.');
      } else {
        throw new Error('Failed to download PDF report. Please try again.');
      }
    }
  },


  getPreviewUrl(reportId) {
    return `${API_BASE_URL}/reports/preview/${reportId}`;
  },


  async previewReport(reportId) {
    try {
      const response = await reportsApi.get(`/preview/${reportId}`, {
        responseType: 'blob'
      });

      return response.data;
    } catch (error) {

      if (error.response?.status === 404) {
        throw new Error('Report not found or has been deleted.');
      } else {
        throw new Error('Failed to preview report. Please try again.');
      }
    }
  },


  async deleteReport(reportId) {
    try {
      const response = await reportsApi.delete(`/${reportId}`);

      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Failed to delete report');
      }
    } catch (error) {

      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.response?.status === 404) {
        throw new Error('Report not found or has been deleted.');
      } else {
        throw new Error('Failed to delete report. Please try again.');
      }
    }
  },

  /**
   * Generates a semester-level Excel report and triggers a download.
   * @param {Object} reportData - The data required for report generation.
   * @returns {Promise<void>}
   */
  async generateSemesterExcel(reportData) {
    try {
      const response = await reportsApi.post('/generate', reportData, {
        responseType: 'blob',
      });

      if (!(response.data instanceof Blob)) {
        throw new Error('Server returned invalid file format. Expected Excel file.');
      }

      const contentDisposition = response.headers['content-disposition'];
      let filename = 'semester-report.xlsx';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (filenameMatch.length > 1) {
          filename = filenameMatch[1];
        }
      }

      this.triggerDownload(response.data, filename);
    } catch {
      throw new Error('Failed to generate semester Excel report. Please try again.');
    }
  },

  /**
   * Generates an institutional-level Excel report and triggers a download.
   * @param {Object} reportData - The data required for report generation.
   * @returns {Promise<void>}
   */
  async generateInstitutionalExcel(reportData) {
    try {

      const response = await reportsApi.post('/generate-institutional', reportData, {
        responseType: 'blob',
        timeout: 30000, // 30 second timeout
      });

      if (!(response.data instanceof Blob)) {
        throw new Error('Server returned invalid file format. Expected Excel file.');
      }

      const contentDisposition = response.headers['content-disposition'];
      let filename = 'institutional-report.xlsx';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (filenameMatch && filenameMatch.length > 1) {
          filename = filenameMatch[1];
        }
      }

      this.triggerDownload(response.data, filename);
    } catch (error) {
      console.error('Excel generation error:', error);
      if (error.response?.data) {
        // Try to read the error response if it's not a blob
        try {
          const errorText = await error.response.data.text();
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.message || 'Server error occurred');
        } catch {
          // If we can't parse the error, use a generic message
        }
      }
      throw new Error(error.message || 'Failed to generate institutional Excel report. Please try again.');
    }
  },

  /**
   * Helper function to trigger file download from blob
   * @param {Blob} blob - File blob
   * @param {string} filename - Desired filename
   */
  triggerDownload(blob, filename) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  /**
   * @deprecated Use `generateSemesterExcel` or `generateInstitutionalExcel` instead. This function uses an inefficient two-step process.
   * Generate and directly download Excel report
   * @param {Object} reportData - Report generation data
   * @returns {Promise} Direct download response
   */
  async DEPRECATED_generateAndDownloadExcel(reportData) {
    try {

      // First generate the report using institutional endpoint
      const generateResponse = await reportsApi.post('/generate-institutional', reportData);

      if (generateResponse.data.success) {
        const reportId = generateResponse.data.data.reportId;

        // Then download it immediately
        const downloadResponse = await reportsApi.get(`/download/${reportId}`, {
          responseType: 'blob'
        });


        // Verify we got a blob, not JSON
        if (!(downloadResponse.data instanceof Blob)) {
          throw new Error('Server returned invalid file format. Expected Excel file.');
        }

        return {
          blob: downloadResponse.data,
          filename: generateResponse.data.data.filename || 'semester_report.xlsx',
          reportData: generateResponse.data.data
        };
      } else {
        throw new Error(generateResponse.data.message || 'Failed to generate Excel report');
      }
    } catch (error) {

      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.response?.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      } else if (error.response?.status === 400) {
        throw new Error('Invalid report data. Please check all required fields.');
      } else {
        throw new Error('Failed to generate Excel report. Please try again.');
      }
    }
  }
};

export default pdfReportsApi;

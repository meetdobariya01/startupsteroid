import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Badge,
  Button,
  Form,
  Pagination,
  Spinner,
  Modal,
  Alert
} from 'react-bootstrap';
import {
  FaFileAlt,
  FaUsers,
  FaDatabase,
  FaChartBar,
  FaTrash,
  FaEye,
  FaDownload,
  FaSearch,
  FaUser,
  FaFolder,
  FaArrowLeft,
  FaFilePdf,
  FaFileImage,
  FaFileWord,
  FaFileExcel,
  FaExclamationTriangle,
  FaBars,
  FaTimes
} from 'react-icons/fa';
import axios from 'axios';
import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';
import './admin.css';

const API_URL = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/files`;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [files, setFiles] = useState([]);
  const [pagination, setPagination] = useState({});
  const [search, setSearch] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [previewError, setPreviewError] = useState(null);
  const [error, setError] = useState('');
  const [token] = useState(localStorage.getItem('token'));
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.role !== 'admin') {
        navigate('/');
        return;
      }
    } catch (err) {
      console.error('Error parsing user:', err);
      navigate('/login');
      return;
    }

    fetchStats();
    fetchFiles();
  }, [token, navigate]);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
      if (err.response?.status === 401) {
        setError('Session expired. Please login again.');
        setTimeout(() => {
          localStorage.clear();
          navigate('/admin-login');
        }, 2000);
      } else {
        setError('Failed to load statistics');
      }
    }
  };

  const fetchFiles = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/admin/all`, {
        params: { page, limit: 20, search },
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setFiles(response.data.data.files || []);
        setPagination(response.data.data.pagination || {});
      }
    } catch (err) {
      console.error('Error fetching files:', err);
      if (err.response?.status === 401) {
        setError('Session expired. Please login again.');
        setTimeout(() => {
          localStorage.clear();
          navigate('/admin-login');
        }, 2000);
      } else {
        setError('Failed to load files');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchFiles(1);
  };

  const handleDelete = async () => {
    if (!selectedFile) return;
    
    try {
      await axios.delete(`${API_URL}/admin/${selectedFile._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowDeleteModal(false);
      fetchFiles(pagination.page || 1);
      fetchStats();
    } catch (err) {
      console.error('Error deleting file:', err);
      setError('Failed to delete file');
    }
  };

  const handleDownload = async (file) => {
    if (!file) return;
    
    setDownloadLoading(true);
    try {
      const response = await fetch(`${API_URL}/${file._id}/download`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Download failed: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.originalName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setDownloadLoading(false);
    } catch (err) {
      console.error('Download error:', err);
      setError('Failed to download file');
      setDownloadLoading(false);
    }
  };

  const handlePreview = async (file) => {
    setPreviewFile(file);
    setShowPreviewModal(true);
    setLoadingPreview(true);
    setPreviewError(null);
    
    if (previewUrl) {
      window.URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }

    try {
      const response = await fetch(`${API_URL}/${file._id}/preview`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Preview failed: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setPreviewUrl(url);
      setLoadingPreview(false);
    } catch (err) {
      console.error('Preview error:', err);
      setPreviewError('Unable to load preview. Please download the file to view it.');
      setLoadingPreview(false);
    }
  };

  const closePreviewModal = () => {
    setShowPreviewModal(false);
    setPreviewFile(null);
    setPreviewError(null);
    if (previewUrl) {
      window.URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType) => {
    if (!mimeType) return <FaFileAlt className="file-type-icon" />;
    if (mimeType.includes('pdf')) return <FaFilePdf className="file-type-icon" style={{ color: '#ff4d4f' }} />;
    if (mimeType.startsWith('image/')) return <FaFileImage className="file-type-icon" style={{ color: '#1890ff' }} />;
    if (mimeType.includes('word') || mimeType.includes('officedocument.wordprocessingml')) {
      return <FaFileWord className="file-type-icon" style={{ color: '#2b5797' }} />;
    }
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet') || mimeType.includes('officedocument.spreadsheetml')) {
      return <FaFileExcel className="file-type-icon" style={{ color: '#217346' }} />;
    }
    return <FaFileAlt className="file-type-icon" />;
  };

  const isPreviewable = (file) => {
    if (!file || !file.mimeType) return false;
    return file.mimeType.startsWith('image/') || file.mimeType.includes('pdf');
  };

  const isMobile = windowWidth < 768;

  if (loading && !stats) {
    return (
      <div>
        <Header />
        <Container className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading dashboard...</p>
        </Container>
        <Footer />
      </div>
    );
  }

  // Mobile Stats Cards
  const MobileStats = () => (
    <Row className="g-2 mb-3">
      {stats && (
        <>
          <Col xs={6}>
            <Card className="stat-card stat-card-mobile shadow-sm">
              <Card.Body className="p-2 text-center">
                <h6 className="text-muted mb-0" style={{ fontSize: '10px' }}>Total Files</h6>
                <h3 className="mb-0" style={{ fontSize: '20px' }}>{stats.totalFiles || 0}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={6}>
            <Card className="stat-card stat-card-mobile shadow-sm">
              <Card.Body className="p-2 text-center">
                <h6 className="text-muted mb-0" style={{ fontSize: '10px' }}>Total Users</h6>
                <h3 className="mb-0" style={{ fontSize: '20px' }}>{stats.totalUsers || 0}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={6}>
            <Card className="stat-card stat-card-mobile shadow-sm">
              <Card.Body className="p-2 text-center">
                <h6 className="text-muted mb-0" style={{ fontSize: '10px' }}>Storage</h6>
                <h3 className="mb-0" style={{ fontSize: '14px' }}>{stats.totalSizeFormatted || '0 Bytes'}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={6}>
            <Card className="stat-card stat-card-mobile shadow-sm">
              <Card.Body className="p-2 text-center">
                <h6 className="text-muted mb-0" style={{ fontSize: '10px' }}>Recent Uploads</h6>
                <h3 className="mb-0" style={{ fontSize: '20px' }}>{stats.recentUploads || 0}</h3>
              </Card.Body>
            </Card>
          </Col>
        </>
      )}
    </Row>
  );

  // Mobile File Card
  const MobileFileCard = ({ file }) => (
    <Card className="mb-2 mobile-file-card">
      <Card.Body className="p-2">
        <div className="d-flex align-items-start gap-2">
          <span style={{ fontSize: '24px' }}>
            {getFileIcon(file.mimeType)}
          </span>
          <div className="flex-grow-1" style={{ minWidth: 0 }}>
            <div className="fw-medium" style={{ fontSize: '13px', wordBreak: 'break-word' }}>
              {file.originalName}
            </div>
            <div style={{ fontSize: '11px', color: '#6c757d' }}>
              {file.description || 'No description'}
            </div>
            <div style={{ fontSize: '10px', color: '#6c757d', marginTop: '2px' }}>
              {file.userId?.username || 'Unknown'} • {formatFileSize(file.fileSize)}
            </div>
          </div>
        </div>
        <div className="d-flex gap-1 mt-2 justify-content-end">
          {isPreviewable(file) && (
            <Button
              variant="outline-info"
              size="sm"
              onClick={() => handlePreview(file)}
              title="Preview"
              style={{ padding: '2px 6px', fontSize: '12px' }}
            >
              <FaEye size={12} />
            </Button>
          )}
          <Button
            variant="outline-success"
            size="sm"
            onClick={() => handleDownload(file)}
            disabled={downloadLoading}
            title="Download"
            style={{ padding: '2px 6px', fontSize: '12px' }}
          >
            {downloadLoading ? <Spinner animation="border" size="sm" /> : <FaDownload size={12} />}
          </Button>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => {
              setSelectedFile(file);
              setShowFileModal(true);
            }}
            title="Details"
            style={{ padding: '2px 6px', fontSize: '12px' }}
          >
            <FaFileAlt size={12} />
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => {
              setSelectedFile(file);
              setShowDeleteModal(true);
            }}
            title="Delete"
            style={{ padding: '2px 6px', fontSize: '12px' }}
          >
            <FaTrash size={12} />
          </Button>
        </div>
      </Card.Body>
    </Card>
  );

  return (
    <div>
      <Header />
      
      <Container className="py-3 py-md-5">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center gap-2 gap-md-3 mb-3 mb-md-4">
          <div className="d-flex align-items-center gap-2 w-100 w-md-auto">
            <Button 
              variant="outline-secondary" 
              onClick={() => navigate('/')}
              className="d-flex align-items-center gap-1"
              style={{ fontSize: isMobile ? '12px' : '14px', padding: isMobile ? '6px 10px' : '8px 16px' }}
            >
              <FaArrowLeft size={isMobile ? 12 : 14} /> {!isMobile && 'Back to Home'}
            </Button>
            <h1 className="mb-0" style={{ fontSize: isMobile ? '20px' : '32px' }}>
              Admin Dashboard
            </h1>
          </div>
          {isMobile && (
            <Button 
              variant="outline-secondary" 
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="ms-auto"
            >
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </Button>
          )}
        </div>
        
        <p className="text-muted mb-3 mb-md-4" style={{ fontSize: isMobile ? '13px' : '16px' }}>
          Manage all uploaded documents across the platform
        </p>

        {error && (
          <Alert variant="danger" onClose={() => setError('')} dismissible className="mb-3">
            {error}
          </Alert>
        )}

        {/* Stats Cards */}
        {stats && (
          isMobile ? <MobileStats /> : (
            <Row className="g-3 g-md-4 mb-3 mb-md-4">
              <Col xs={6} md={3}>
                <Card className="stat-card shadow-sm">
                  <Card.Body className="p-2 p-md-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="text-muted mb-0" style={{ fontSize: isMobile ? '10px' : '14px' }}>Total Files</h6>
                        <h3 className="mb-0" style={{ fontSize: isMobile ? '18px' : '28px' }}>{stats.totalFiles || 0}</h3>
                      </div>
                      <FaFileAlt size={isMobile ? 24 : 32} className="text-primary opacity-50" />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={6} md={3}>
                <Card className="stat-card shadow-sm">
                  <Card.Body className="p-2 p-md-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="text-muted mb-0" style={{ fontSize: isMobile ? '10px' : '14px' }}>Total Users</h6>
                        <h3 className="mb-0" style={{ fontSize: isMobile ? '18px' : '28px' }}>{stats.totalUsers || 0}</h3>
                      </div>
                      <FaUsers size={isMobile ? 24 : 32} className="text-success opacity-50" />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={6} md={3}>
                <Card className="stat-card shadow-sm">
                  <Card.Body className="p-2 p-md-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="text-muted mb-0" style={{ fontSize: isMobile ? '10px' : '14px' }}>Storage</h6>
                        <h3 className="mb-0" style={{ fontSize: isMobile ? '14px' : '24px' }}>{stats.totalSizeFormatted || '0 Bytes'}</h3>
                      </div>
                      <FaDatabase size={isMobile ? 24 : 32} className="text-info opacity-50" />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={6} md={3}>
                <Card className="stat-card shadow-sm">
                  <Card.Body className="p-2 p-md-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="text-muted mb-0" style={{ fontSize: isMobile ? '10px' : '14px' }}>Recent Uploads</h6>
                        <h3 className="mb-0" style={{ fontSize: isMobile ? '18px' : '28px' }}>{stats.recentUploads || 0}</h3>
                      </div>
                      <FaChartBar size={isMobile ? 24 : 32} className="text-warning opacity-50" />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )
        )}

        {/* Files Section */}
        <Card className="shadow-sm">
          <Card.Body className="p-2 p-md-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2 mb-3">
              <h5 className="mb-0" style={{ fontSize: isMobile ? '14px' : '18px' }}>
                All Documents <Badge bg="secondary" className="ms-2">{files.length}</Badge>
              </h5>
              <Form onSubmit={handleSearch} className="d-flex gap-2 w-100 w-md-auto">
                <Form.Control
                  type="text"
                  placeholder={isMobile ? "Search..." : "Search files..."}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ width: isMobile ? '100%' : '250px', fontSize: isMobile ? '13px' : '14px' }}
                  size={isMobile ? 'sm' : 'default'}
                />
                <Button type="submit" variant="primary" size={isMobile ? 'sm' : 'default'}>
                  <FaSearch size={isMobile ? 12 : 14} />
                </Button>
                {search && (
                  <Button 
                    variant="outline-secondary" 
                    size={isMobile ? 'sm' : 'default'}
                    onClick={() => {
                      setSearch('');
                      fetchFiles(1);
                    }}
                  >
                    <FaTimes size={isMobile ? 12 : 14} />
                  </Button>
                )}
              </Form>
            </div>

            {/* Files Display */}
            {isMobile ? (
              // Mobile View - Cards
              <div className="mobile-files-list">
                {loading ? (
                  <div className="text-center py-4">
                    <Spinner animation="border" size="sm" />
                    <p className="mt-2" style={{ fontSize: '13px' }}>Loading...</p>
                  </div>
                ) : files.length === 0 ? (
                  <div className="text-center py-4 text-muted" style={{ fontSize: '14px' }}>
                    No files found
                  </div>
                ) : (
                  files.map(file => <MobileFileCard key={file._id} file={file} />)
                )}
              </div>
            ) : (
              // Desktop View - Table
              <div className="table-responsive">
                <Table hover className="admin-table">
                  <thead>
                    <tr>
                      <th>File</th>
                      <th>User</th>
                      <th>Folder</th>
                      <th>Size</th>
                      <th>Uploaded</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="text-center py-4">
                          <Spinner animation="border" size="sm" /> Loading...
                        </td>
                      </tr>
                    ) : files.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-4 text-muted">
                          No files found
                        </td>
                      </tr>
                    ) : (
                      files.map(file => (
                        <tr key={file._id}>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <span style={{ fontSize: '20px' }}>
                                {getFileIcon(file.mimeType)}
                              </span>
                              <div>
                                <div className="fw-medium">{file.originalName}</div>
                                <small className="text-muted">{file.description || 'No description'}</small>
                              </div>
                            </div>
                          </td>
                          <td>
                            {file.userId ? (
                              <div>
                                <div>{file.userId.username || file.userId.name || 'Unknown'}</div>
                                <small className="text-muted">{file.userId.email || 'No email'}</small>
                              </div>
                            ) : (
                              <span className="text-muted">Unknown</span>
                            )}
                          </td>
                          <td>
                            <Badge bg="secondary" className="text-wrap">
                              {file.folder || 'General'}
                            </Badge>
                          </td>
                          <td>{formatFileSize(file.fileSize)}</td>
                          <td>
                            <div>{formatDate(file.createdAt)}</div>
                            <small className="text-muted">
                              Views: {file.viewCount || 0} | Downloads: {file.downloadCount || 0}
                            </small>
                          </td>
                          <td>
                            <div className="d-flex gap-1">
                              {isPreviewable(file) && (
                                <Button
                                  variant="outline-info"
                                  size="sm"
                                  onClick={() => handlePreview(file)}
                                  title="Preview File"
                                >
                                  <FaEye size={14} />
                                </Button>
                              )}
                              <Button
                                variant="outline-success"
                                size="sm"
                                onClick={() => handleDownload(file)}
                                disabled={downloadLoading}
                                title="Download"
                              >
                                {downloadLoading ? <Spinner animation="border" size="sm" /> : <FaDownload size={14} />}
                              </Button>
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => {
                                  setSelectedFile(file);
                                  setShowFileModal(true);
                                }}
                                title="View Details"
                              >
                                <FaFileAlt size={14} />
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => {
                                  setSelectedFile(file);
                                  setShowDeleteModal(true);
                                }}
                                title="Delete"
                              >
                                <FaTrash size={14} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="d-flex justify-content-center mt-3">
                <Pagination size={isMobile ? 'sm' : 'default'}>
                  <Pagination.Prev 
                    onClick={() => fetchFiles(Math.max(1, pagination.page - 1))}
                    disabled={pagination.page === 1}
                  />
                  {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Pagination.Item
                        key={pageNum}
                        active={pageNum === pagination.page}
                        onClick={() => fetchFiles(pageNum)}
                      >
                        {pageNum}
                      </Pagination.Item>
                    );
                  })}
                  {pagination.pages > 5 && (
                    <>
                      <Pagination.Ellipsis />
                      <Pagination.Item onClick={() => fetchFiles(pagination.pages)}>
                        {pagination.pages}
                      </Pagination.Item>
                    </>
                  )}
                  <Pagination.Next 
                    onClick={() => fetchFiles(Math.min(pagination.pages, pagination.page + 1))}
                    disabled={pagination.page === pagination.pages}
                  />
                </Pagination>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>

      {/* Modals - Same as before but responsive */}
      {/* File Details Modal */}
      <Modal show={showFileModal} onHide={() => setShowFileModal(false)} size={isMobile ? 'sm' : 'lg'}>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: isMobile ? '16px' : '20px' }}>File Details</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ fontSize: isMobile ? '13px' : '14px' }}>
          {selectedFile && (
            <div className="file-details">
              <Row>
                <Col xs={12} md={6}>
                  <p><strong>File Name:</strong> {selectedFile.originalName}</p>
                  <p><strong>Description:</strong> {selectedFile.description || 'N/A'}</p>
                  <p><strong>Folder:</strong> {selectedFile.folder || 'General'}</p>
                  <p><strong>MIME Type:</strong> {selectedFile.mimeType}</p>
                  <p><strong>File Size:</strong> {formatFileSize(selectedFile.fileSize)}</p>
                </Col>
                <Col xs={12} md={6}>
                  <p><strong>Uploaded By:</strong> {selectedFile.userId?.username || 'Unknown'}</p>
                  <p><strong>Email:</strong> {selectedFile.userId?.email || 'N/A'}</p>
                  <p><strong>Uploaded:</strong> {formatDate(selectedFile.createdAt)}</p>
                  <p><strong>Views:</strong> {selectedFile.viewCount || 0}</p>
                  <p><strong>Downloads:</strong> {selectedFile.downloadCount || 0}</p>
                  <p><strong>Status:</strong> <Badge bg={selectedFile.isDeleted ? 'danger' : 'success'}>
                    {selectedFile.isDeleted ? 'Deleted' : 'Active'}
                  </Badge></p>
                </Col>
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="flex-wrap gap-1">
          <Button variant="secondary" size={isMobile ? 'sm' : 'default'} onClick={() => setShowFileModal(false)}>
            Close
          </Button>
          {isPreviewable(selectedFile) && (
            <Button
              variant="info"
              size={isMobile ? 'sm' : 'default'}
              onClick={() => {
                setShowFileModal(false);
                handlePreview(selectedFile);
              }}
            >
              <FaEye /> Preview
            </Button>
          )}
          <Button
            variant="primary"
            size={isMobile ? 'sm' : 'default'}
            onClick={() => handleDownload(selectedFile)}
            disabled={downloadLoading}
          >
            {downloadLoading ? <Spinner animation="border" size="sm" /> : <FaDownload />} Download
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Preview Modal */}
      <Modal 
        show={showPreviewModal} 
        onHide={closePreviewModal}
        size={isMobile ? 'sm' : 'lg'}
        fullscreen={isMobile}
        centered
        className="preview-modal"
      >
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title className="text-white text-truncate" style={{ maxWidth: '80%', fontSize: isMobile ? '14px' : '18px' }}>
            {previewFile?.originalName || 'File Preview'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <div className={`preview-container ${isMobile ? 'preview-container-mobile' : ''}`}>
            {loadingPreview && (
              <div className="text-center p-5">
                <Spinner animation="border" variant="light" className="mb-2" />
                <div className="text-white">Loading preview...</div>
              </div>
            )}
            
            {previewError && (
              <div className="text-center p-4 p-md-5">
                <FaExclamationTriangle size={isMobile ? 32 : 48} className="text-warning mb-3" />
                <div className="text-white" style={{ fontSize: isMobile ? '13px' : '16px' }}>{previewError}</div>
                <Button 
                  variant="outline-light" 
                  className="mt-3"
                  size={isMobile ? 'sm' : 'default'}
                  onClick={() => {
                    closePreviewModal();
                    if (previewFile) handleDownload(previewFile);
                  }}
                >
                  <FaDownload /> Download File Instead
                </Button>
              </div>
            )}

            {!loadingPreview && !previewError && previewUrl && (
              <>
                {previewFile?.mimeType?.startsWith('image/') ? (
                  <img src={previewUrl} alt={previewFile?.originalName} className="preview-image" />
                ) : previewFile?.mimeType?.includes('pdf') ? (
                  <iframe src={previewUrl} title={previewFile?.originalName} className="preview-pdf" />
                ) : (
                  <div className="text-center p-4 p-md-5 text-white">
                    <FaFileAlt size={isMobile ? 48 : 64} className="mb-3" />
                    <p style={{ fontSize: isMobile ? '14px' : '16px' }}>Preview not available for this file type</p>
                    <Button 
                      variant="outline-light"
                      size={isMobile ? 'sm' : 'default'}
                      onClick={() => {
                        closePreviewModal();
                        if (previewFile) handleDownload(previewFile);
                      }}
                    >
                      <FaDownload /> Download File
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer className="bg-dark flex-wrap gap-1">
          <Button variant="secondary" size={isMobile ? 'sm' : 'default'} onClick={closePreviewModal}>
            Close
          </Button>
          {previewFile && (
            <Button 
              variant="success" 
              size={isMobile ? 'sm' : 'default'}
              onClick={() => {
                closePreviewModal();
                handleDownload(previewFile);
              }}
            >
              <FaDownload /> Download File
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} size={isMobile ? 'sm' : 'default'}>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: isMobile ? '16px' : '20px' }}>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ fontSize: isMobile ? '13px' : '14px' }}>
          <p>Are you sure you want to delete the file:</p>
          <p className="fw-bold">{selectedFile?.originalName}</p>
          <p className="text-danger">This action cannot be undone!</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size={isMobile ? 'sm' : 'default'} onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" size={isMobile ? 'sm' : 'default'} onClick={handleDelete}>
            <FaTrash /> Delete Permanently
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
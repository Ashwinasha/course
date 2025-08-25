import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';



function App() {
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [credits, setCredits] = useState('');
  const [editingId, setEditingId] = useState(null);

  // Modal controls
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteCourseId, setDeleteCourseId] = useState(null);
  const [message, setMessage] = useState('');
  const [showMessageModal, setShowMessageModal] = useState(false);

  // Fetch all courses
  const fetchCourses = () => {
    fetch("http://localhost:8080/api/courses")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCourses(data);
        } else {
          setCourses([]);
        }
      });
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Reset form to add mode
  const resetForm = () => {
    setEditingId(null);
    setCode('');
    setTitle('');
    setDescription('');
    setCredits('');
  };

  // Open Add New Course (reset form)
  const handleAddNew = () => {
    resetForm();
  };

  // Fill form with course data for editing
  const handleEdit = (course) => {
    setEditingId(course.id);
    setCode(course.code);
    setTitle(course.title);
    setDescription(course.description);
    setCredits(course.credits);
  };

  // Submit add or edit
  const handleSubmit = (e) => {
  e.preventDefault();

  const method = editingId ? 'PUT' : 'POST';
  const url = editingId
    ? `http://localhost:8080/api/courses/${editingId}`
    : `http://localhost:8080/api/courses`;

  fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, title, description, credits })
  })
    .then(async res => {
      if (!res.ok) {
        // Try to read error message from response body
        const errorText = await res.text();
        throw new Error(errorText || 'Failed to save course');
      }
      return res.json();
    })
    .then(() => {
      fetchCourses();
      resetForm();
      setMessage(editingId ? 'Course updated successfully!' : 'Course added successfully!');
      setShowMessageModal(true);
    })
    .catch(err => {
      // Display duplicate code or other backend errors
      setMessage(err.message.includes('Course code') ? err.message : 'Something went wrong. Please try again.');
      setShowMessageModal(true);
    });
};


  // Open delete modal
  const openDeleteModal = (id) => {
    setDeleteCourseId(id);
    setShowDeleteModal(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    fetch(`http://localhost:8080/api/courses/${deleteCourseId}`, {
      method: 'DELETE'
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to delete course');
        fetchCourses();
        setShowDeleteModal(false);
        setMessage('Course deleted successfully!');
        setShowMessageModal(true);
      })
      .catch(() => {
        setShowDeleteModal(false);
        setMessage('Failed to delete course. Please try again.');
        setShowMessageModal(true);
      });
  };

  return (
    <div 
      className="container mt-5 p-4 rounded shadow"
      style={{ backgroundColor: '#f8f9fa', minHeight: '90vh' }}
    >
      <div className="bg-dark text-white py-3 px-4 rounded-3 shadow mb-4 text-center">
        <h2 className="m-0 fw-bold">🎓 University Course Management</h2>
      </div>

      
      <div className="card mb-4 shadow-sm border-primary">
        <div className="card-body">
          <h5 className="card-title text-primary mb-4">{editingId ? '✏️ Edit Course' : '➕ Add New Course'}</h5>
          
          <form onSubmit={handleSubmit} className="px-1">
            <div className="row g-3">
              <div className="col-md-3">
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control"
                    id="courseCode"
                    placeholder="Course Code"
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    required
                  />
                  <label htmlFor="courseCode">Course Code</label>
                </div>
              </div>
              <div className="col-md-5">
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control"
                    id="courseTitle"
                    placeholder="Course Title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                  />
                  <label htmlFor="courseTitle">Course Title</label>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-floating">
                  <input
                    type="number"
                    className="form-control"
                    id="credits"
                    placeholder="Credits"
                    value={credits}
                    onChange={e => setCredits(e.target.value)}
                    min="0"
                    required
                  />
                  <label htmlFor="credits">Credits</label>
                </div>
              </div>
            </div>

            <div className="form-floating mt-3">
              <textarea
                className="form-control"
                placeholder="Course Description"
                id="description"
                style={{ height: '100px' }}
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
              ></textarea>
              <label htmlFor="description">Course Description</label>
            </div>

            <div className="mt-4 text-end">
              {editingId && (
                <button
                  type="button"
                  className="btn btn-danger me-2"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              )}
              <button 
                type="submit" 
                className={`btn ${editingId ? 'btn-warning' : 'btn-primary'}`}
              >
                {editingId ? 'Update Course' : 'Add Course'}
              </button>
            </div>
          </form>

        </div>
      </div>

      {/* Courses Table */}
     <div className="card shadow-sm border-primary rounded-4">
  <div className="card-body">
    <h4 className="card-title mb-4 text-primary fw-bold">
      📋 Course List
    </h4>

    {/* Outer wrapper to apply rounding and clipping */}
    <div className="table-responsive rounded-4 overflow-hidden border">
      <table className="table table-hover table-bordered align-middle mb-0">
        <thead className="text-dark table-primary text-center">
          <tr>
            <th className="fw-semibold">Code</th>
            <th className="fw-semibold">Title</th>
            <th className="fw-semibold">Description</th>
            <th className="fw-semibold">Credits</th>
            <th className="fw-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center text-muted py-4">
                No courses found.
              </td>
            </tr>
          ) : (
            courses.map(course => (
              <tr key={course.id}>
                <td className="text-center">{course.code}</td>
                <td>{course.title}</td>
                <td>{course.description}</td>
                <td className="text-center">
                  <span className="badge text-dark px-3 py-2 rounded-pill">
                    {course.credits}
                  </span>
                </td>
                <td className="text-center">
                  <div className="d-flex flex-wrap justify-content-center gap-2">
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleEdit(course)}
                      title="Edit Course"
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => openDeleteModal(course.id)}
                      title="Delete Course"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
</div>


      {/* Delete Confirmation Modal */}
      <div
        className={`modal fade ${showDeleteModal ? 'show d-block' : ''}`}
        tabIndex="-1"
        style={{ backgroundColor: showDeleteModal ? 'rgba(0,0,0,0.5)' : 'transparent' }}
        aria-modal={showDeleteModal ? "true" : "false"}
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-danger">
            <div className="modal-header bg-danger text-white">
              <h5 className="modal-title">Confirm Delete</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={() => setShowDeleteModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              Are you sure you want to delete this course?
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Message Modal */}
      <div
        className={`modal fade ${showMessageModal ? 'show d-block' : ''}`}
        tabIndex="-1"
        style={{ backgroundColor: showMessageModal ? 'rgba(0,0,0,0.5)' : 'transparent' }}
        aria-modal={showMessageModal ? "true" : "false"}
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-primary">
            <div className="modal-body text-center">
              <p>{message}</p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setShowMessageModal(false)}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
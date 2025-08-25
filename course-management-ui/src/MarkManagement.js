import React, { useState, useEffect } from 'react';

function MarkManagement() {
  const [marks, setMarks] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);

  const [studentId, setStudentId] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [score, setScore] = useState('');
  const [editingId, setEditingId] = useState(null);

  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteMarkId, setDeleteMarkId] = useState(null);
  const [message, setMessage] = useState('');
  const [showMessageModal, setShowMessageModal] = useState(false);

  // Fetch marks from backend
  const fetchMarks = () => {
    fetch('http://localhost:8080/api/marks')
      .then(res => res.json())
      .then(data => setMarks(Array.isArray(data) ? data : []))
      .catch(() => {
        setMessage('Failed to fetch marks');
        setShowMessageModal(true);
      });
  };

  // Fetch students from backend
  const fetchStudents = () => {
    fetch('http://localhost:8080/api/students')
      .then(res => res.json())
      .then(data => setStudents(Array.isArray(data) ? data : []))
      .catch(() => {
        setMessage('Failed to fetch students');
        setShowMessageModal(true);
      });
  };

  // Fetch courses from backend
  const fetchCourses = () => {
    fetch('http://localhost:8080/api/courses')
      .then(res => res.json())
      .then(data => setCourses(Array.isArray(data) ? data : []))
      .catch(() => {
        setMessage('Failed to fetch courses');
        setShowMessageModal(true);
      });
  };

  useEffect(() => {
    fetchMarks();
    fetchStudents();
    fetchCourses();
  }, []);

  // Reset form fields and editing state
  const resetForm = () => {
    setStudentId('');
    setCourseCode('');
    setScore('');
    setEditingId(null);
  };

  // Handle form submit (Add or Update)
 const handleSubmit = (e) => {
  e.preventDefault();

  // Check for duplicate (both add and edit)
  const duplicate = marks.find(
    (m) =>
      m.studentId === studentId &&
      m.courseCode === courseCode &&
      m.id !== editingId // ignore the current editing record
  );

  if (duplicate) {
    setMessage('Mark for this student and course already exists!');
    setShowMessageModal(true);
    return;
  }

  const method = editingId ? 'PUT' : 'POST';
  const url = editingId
    ? `http://localhost:8080/api/marks/${editingId}`
    : 'http://localhost:8080/api/marks';

  fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      studentId,
      courseCode,
      marks: parseFloat(score),
    }),
  })
    .then(async (res) => {
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to save mark');
      }
      return res.json();
    })
    .then(() => {
      fetchMarks();
      resetForm();
      setMessage(editingId ? 'Mark updated successfully!' : 'Mark added successfully!');
      setShowMessageModal(true);
    })
    .catch((err) => {
      setMessage(err.message || 'Error saving mark');
      setShowMessageModal(true);
    });
};



  // Fill form for editing a mark
  const handleEdit = (mark) => {
    setEditingId(mark.id);
    setStudentId(mark.studentId);
    setCourseCode(mark.courseCode);
    setScore(mark.marks);
  };

  // Open delete confirmation modal
  const openDeleteModal = (id) => {
    setDeleteMarkId(id);
    setShowDeleteModal(true);
  };

  // Confirm deletion
  const confirmDelete = () => {
    fetch(`http://localhost:8080/api/marks/${deleteMarkId}`, {
      method: 'DELETE',
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to delete mark');
        fetchMarks();
        setShowDeleteModal(false);
        setMessage('Mark deleted successfully!');
        setShowMessageModal(true);
      })
      .catch(() => {
        setShowDeleteModal(false);
        setMessage('Failed to delete mark');
        setShowMessageModal(true);
      });
  };

  return (
    <div
      className="container mt-5 p-4 rounded shadow"
      style={{ backgroundColor: '#f8f9fa', minHeight: '90vh' }}
    >
      <div className="bg-dark text-white py-3 px-4 rounded-3 shadow mb-4 text-center">
        <h2 className="m-0 fw-bold">🎯 Mark Management</h2>
      </div>

      {/* Form card */}
      <div className="card mb-4 shadow-sm border-primary">
        <div className="card-body">
          <h5 className="card-title text-primary mb-4">
            {editingId ? '✏️ Edit Mark' : '➕ Add New Mark'}
          </h5>

          <form onSubmit={handleSubmit} className="row g-3 px-1">
            <div className="col-md-4">
              <select
                className="form-select"
                value={studentId}
                onChange={e => setStudentId(e.target.value)}
                required
              >
                <option value="">-- Select Student --</option>
                {students.map((s) => (
                  <option key={s.id} value={s.studentId}>
                    {s.studentId} - {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <select
                className="form-select"
                value={courseCode}
                onChange={e => setCourseCode(e.target.value)}
                required
              >
                <option value="">-- Select Course --</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.code}>
                    {c.code} - {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-2">
              <input
                type="number"
                className="form-control"
                placeholder="Marks"
                value={score}
                onChange={e => setScore(e.target.value)}
                min="0"
                max="100"
                required
              />
            </div>

           <div className="col-md-2 d-flex justify-content-end align-items-center gap-2">
                {editingId && (
                    <button
                    type="button"
                    className="btn btn-danger"
                    onClick={resetForm}
                    >
                    Cancel
                    </button>
                )}
                <button
                    type="submit"
                    className={`btn ${editingId ? 'btn-warning' : 'btn-primary'}`}
                >
                    {editingId ? 'Update' : 'Add Mark'}
                </button>
                </div>

          </form>
        </div>
      </div>

      {/* Marks Table */}
      <div className="card shadow-sm border-primary rounded-4">
        <div className="card-body">
          <h4 className="card-title mb-4 text-primary fw-bold">📋 Marks List</h4>

          <div className="table-responsive rounded-4 overflow-hidden border">
            <table className="table table-hover table-bordered align-middle mb-0 text-center">
              <thead className="text-dark table-primary">
                <tr>
                  <th>ID</th>
                  <th>Student ID</th>
                  <th>Course Code</th>
                  <th>Marks</th>
                  <th>GPA</th>
                  <th>Grade</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {marks.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-muted py-4">
                      No marks found.
                    </td>
                  </tr>
                ) : (
                  marks.map((mark) => (
                    <tr key={mark.id}>
                      <td>{mark.id}</td>
                      <td>{mark.studentId}</td>
                      <td>{mark.courseCode}</td>
                      <td>{mark.marks}</td>
                      <td>{mark.gpa || '-'}</td>
                      <td>{mark.grade || '-'}</td>
                      <td>
                        <div className="d-flex flex-wrap justify-content-center gap-2">
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => handleEdit(mark)}
                            title="Edit Mark"
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => openDeleteModal(mark.id)}
                            title="Delete Mark"
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
        aria-modal={showDeleteModal ? 'true' : 'false'}
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
              />
            </div>
            <div className="modal-body">Are you sure you want to delete this mark?</div>
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
        aria-modal={showMessageModal ? 'true' : 'false'}
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

export default MarkManagement;

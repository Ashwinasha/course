import React, { useState, useEffect } from 'react';
import axios from 'axios';

function StudentRegistration() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);

  const [studentId, setStudentId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [course, setCourse] = useState('');
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteStudentId, setDeleteStudentId] = useState(null);

  // Fetch students
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8080/api/students');
      setStudents(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setMessage('Error loading students: ' + (err.response?.data?.message || err.message));
      setShowMessageModal(true);
    } finally {
      setLoading(false);
    }
  };

  // Fetch courses
  const fetchCourses = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/courses');
      setCourses(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error loading courses:', err);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchCourses();
  }, []);

  const resetForm = () => {
    setStudentId('');
    setName('');
    setEmail('');
    setCourse('');
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Check for duplicate Student ID
    const duplicate = students.find(
      (s) => s.studentId === studentId && s.course === course && s.id !== editingId
    );

    if (duplicate) {
      setMessage('This student is already registered for the selected course!');
      setShowMessageModal(true);
      setLoading(false);
      return;
    }

    try {
      if (editingId) {
        await axios.put(`http://localhost:8080/api/students/${editingId}`, {
          studentId,
          name,
          email,
          course,
        });
        setMessage('✅ Student updated successfully!');
      } else {
        await axios.post('http://localhost:8080/api/students', {
          studentId,
          name,
          email,
          course,
        });
        setMessage('✅ Student registered successfully!');
      }

      fetchStudents();
      resetForm();
      setShowMessageModal(true);
    } catch (err) {
      setMessage('Error: ' + (err.response?.data?.message || err.message));
      setShowMessageModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (student) => {
    setEditingId(student.id);
    setStudentId(student.studentId);
    setName(student.name);
    setEmail(student.email);
    setCourse(student.course);
  };

  const openDeleteModal = (id) => {
    setDeleteStudentId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:8080/api/students/${deleteStudentId}`);
      fetchStudents();
      setMessage('Student deleted successfully!');
      setShowMessageModal(true);
    } catch (err) {
      setMessage('Error deleting student: ' + (err.response?.data?.message || err.message));
      setShowMessageModal(true);
    } finally {
      setShowDeleteModal(false);
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 p-4 rounded shadow" style={{ backgroundColor: '#f8f9fa', minHeight: '90vh' }}>
      <div className="bg-dark text-white py-3 px-4 rounded-3 shadow mb-4 text-center">
        <h2 className="m-0 fw-bold">👨‍🎓 Student Registration</h2>
      </div>

      {/* Form card */}
      <div className="card mb-4 shadow-sm border-primary">
        <div className="card-body">
          <h5 className="card-title text-primary mb-4">{editingId ? '✏️ Edit Student' : '➕ Register New Student'}</h5>
          <form onSubmit={handleSubmit} className="px-1">
            <div className="row g-3">
              <div className="col-md-3">
                <div className="form-floating">
                  <input
                    id="studentId"
                    type="text"
                    className="form-control"
                    placeholder="Student ID"
                    value={studentId}
                    onChange={e => setStudentId(e.target.value)}
                    required
                    disabled={loading}
                  />
                  <label htmlFor="studentId">Student ID</label>
                </div>
              </div>

              <div className="col-md-3">
                <div className="form-floating">
                  <input
                    id="name"
                    type="text"
                    className="form-control"
                    placeholder="Full Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    disabled={loading}
                  />
                  <label htmlFor="name">Full Name</label>
                </div>
              </div>

              <div className="col-md-3">
                <div className="form-floating">
                  <input
                    id="email"
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                  <label htmlFor="email">Email</label>
                </div>
              </div>

              <div className="col-md-3">
                <div className="form-floating">
                  <select
                    id="course"
                    className="form-select"
                    value={course}
                    onChange={e => setCourse(e.target.value)}
                    disabled={loading}
                    required
                  >
                    <option value="">-- Select Course --</option>
                    {courses.map((c) => (
                      <option key={c.id} value={`${c.code} - ${c.title}`}>
                        {c.code} - {c.title}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="course">Course</label>
                </div>
              </div>
            </div>

            <div className="mt-4 text-end">
              {editingId && (
                <button
                  type="button"
                  className="btn btn-danger me-2"
                  onClick={resetForm}
                  disabled={loading}
                >
                  Cancel
                </button>
              )}
              <button type="submit" className={`btn ${editingId ? 'btn-warning' : 'btn-primary'}`} disabled={loading}>
                {loading ? 'Processing...' : editingId ? 'Update Student' : 'Register Student'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Table with scroll */}
      <div className="card shadow-sm border-primary rounded-4">
        <div className="card-body">
          <h4 className="card-title mb-4 text-primary fw-bold">📋 Student List</h4>
          <div
            className="table-responsive rounded-4 overflow-auto border"
            style={{ maxHeight: '300px' }} // Scroll after ~5 rows
          >
            <table className="table table-hover table-bordered align-middle mb-0">
              <thead className="text-dark table-primary text-center">
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Course</th>
                  <th>Registration Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && students.length === 0 ? (
                  <tr><td colSpan="6" className="text-center">Loading...</td></tr>
                ) : students.length === 0 ? (
                  <tr><td colSpan="6" className="text-center text-muted">No students found.</td></tr>
                ) : (
                  students.map(student => (
                    <tr key={student.id}>
                      <td className="text-center">{student.studentId}</td>
                      <td>{student.name}</td>
                      <td>{student.email}</td>
                      <td>{student.course}</td>
                      <td className="text-center">{student.registration_date || student.registrationDate}</td>
                      <td className="text-center">
                        <div className="d-flex justify-content-center gap-2 flex-wrap">
                          <button className="btn btn-sm btn-primary" onClick={() => handleEdit(student)} disabled={loading}>Edit</button>
                          <button className="btn btn-sm btn-danger" onClick={() => openDeleteModal(student.id)} disabled={loading}>Delete</button>
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
      {showDeleteModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-danger">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">Confirm Delete</h5>
                <button className="btn-close btn-close-white" onClick={() => setShowDeleteModal(false)}></button>
              </div>
              <div className="modal-body">Are you sure you want to delete this student?</div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)} disabled={loading}>Cancel</button>
                <button className="btn btn-danger" onClick={confirmDelete} disabled={loading}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Message Modal */}
      {showMessageModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-primary">
              <div className="modal-body text-center">
                <p>{message}</p>
                <button className="btn btn-primary" onClick={() => setShowMessageModal(false)}>OK</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentRegistration;

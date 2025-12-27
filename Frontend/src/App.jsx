import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api';

// ==================== HOME COMPONENT ====================
function Home() {
  return (
    <div>
      <h1>College Management System</h1>
      <p>Welcome to the College Management Portal</p>
      <ul>
        <li>Search for student information</li>
        <li>View faculty details</li>
        <li>Check placement statistics</li>
        <li>Browse job notifications and internships</li>
        <li>View examination schedules</li>
        <li>Explore alumni network</li>
      </ul>
    </div>
  );
}

// ==================== STUDENTS COMPONENT ====================
function Students() {
  const [rollNumber, setRollNumber] = useState('');
  const [student, setStudent] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const searchStudent = async () => {
    if (!rollNumber.trim()) {
      setError('Please enter a roll number');
      return;
    }

    setLoading(true);
    setError('');
    setStudent(null);

    try {
      const response = await fetch(`${API_URL}/students/search/${rollNumber}`);
      const data = await response.json();

      if (data.success) {
        setStudent(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch student data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Student Search</h2>
      <div>
        <input
          type="text"
          placeholder="Enter Roll Number"
          value={rollNumber}
          onChange={(e) => setRollNumber(e.target.value)}
        />
        <button onClick={searchStudent} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {error && <p style={{color: 'red'}}>{error}</p>}

      {student && (
        <div>
          <h3>Student Details</h3>
          <p><strong>Name:</strong> {student.name}</p>
          <p><strong>Roll Number:</strong> {student.roll_number}</p>
          <p><strong>Branch:</strong> {student.dept_name} ({student.dept_code})</p>
          <p><strong>Year:</strong> {student.year}</p>
          <p><strong>Backlogs:</strong> {student.backlogs}</p>
          <p><strong>Fee Paid:</strong> ₹{student.fee_paid}</p>
          <p><strong>Fee Pending:</strong> ₹{student.fee_pending}</p>
          <p><strong>Email:</strong> {student.email}</p>
          <p><strong>Phone:</strong> {student.phone}</p>
        </div>
      )}
    </div>
  );
}

// ==================== FACULTY COMPONENT ====================
// ==================== FACULTY COMPONENT ====================
function Faculty() {
  const [facultyByDept, setFacultyByDept] = useState({});
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFaculty();
    fetchDepartments();
  }, []);

  const fetchFaculty = async () => {
    try {
      const response = await fetch(`${API_URL}/faculty`);
      const data = await response.json();

      if (data.success) {
        setFacultyByDept(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch faculty data');
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await fetch(`${API_URL}/departments`);
      const data = await response.json();

      if (data.success) {
        setDepartments(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch departments');
    }
  };

  if (loading) return <div>Loading faculty data...</div>;
  if (error) return <div style={{color: 'red'}}>{error}</div>;

  const filteredDepts = selectedDept === 'all' 
    ? Object.keys(facultyByDept) 
    : Object.keys(facultyByDept).filter(dept => dept === selectedDept);

  return (
    <div>
      <h2>Faculty Information</h2>
      
      {/* Department Filter */}
      <div style={{marginBottom: '20px'}}>
        <label><strong>Filter by Department: </strong></label>
        <select 
          value={selectedDept} 
          onChange={(e) => setSelectedDept(e.target.value)}
          style={{padding: '5px', marginLeft: '10px'}}
        >
          <option value="all">All Departments</option>
          {departments.map((dept) => (
            <option key={dept.dept_id} value={dept.dept_name}>
              {dept.dept_name}
            </option>
          ))}
        </select>
      </div>

      {/* Faculty List */}
      {filteredDepts.map((deptName) => (
        <div key={deptName} style={{marginBottom: '30px'}}>
          <h3>{deptName}</h3>
          {facultyByDept[deptName].map((member) => (
            <div key={member.faculty_id} style={{marginLeft: '20px', marginBottom: '15px'}}>
              <p><strong>Name:</strong> {member.name}</p>
              <p><strong>Designation:</strong> {member.designation}</p>
              <p><strong>Experience:</strong> {member.experience} years</p>
              <p><strong>Qualification:</strong> {member.qualification}</p>
              <p><strong>Email:</strong> {member.email}</p>
              <hr />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ==================== PLACEMENTS COMPONENT ====================
// ==================== PLACEMENTS COMPONENT ====================
function Placements({ isTeacher }) {
  const [placements, setPlacements] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    dept_id: '',
    academic_year: '',
    students_placed: '',
    total_students: '',
    highest_package: '',
    average_package: ''
  });
  const [editingPlacementId, setEditingPlacementId] = useState(null);

  useEffect(() => {
    fetchPlacements();
    if (isTeacher) {
      fetchDepartments();
    }
  }, [isTeacher]);

  const fetchPlacements = async () => {
    try {
      const response = await fetch(`${API_URL}/placements`);
      const data = await response.json();

      if (data.success) {
        setPlacements(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch placements data');
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await fetch(`${API_URL}/departments`);
      const data = await response.json();

      if (data.success) {
        setDepartments(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch departments');
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingPlacementId 
        ? `${API_URL}/placements/${editingPlacementId}` 
        : `${API_URL}/placements`;
      const method = editingPlacementId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        alert(data.message);
        setShowForm(false);
        setEditingPlacementId(null);
        setFormData({
          dept_id: '',
          academic_year: '',
          students_placed: '',
          total_students: '',
          highest_package: '',
          average_package: ''
        });
        fetchPlacements();
      } else {
        alert('Error: ' + data.message);
      }
    } catch (err) {
      alert('Failed to submit placement record');
    }
  };

  const handleEdit = (placement) => {
    setFormData({
      dept_id: placement.dept_id || '',
      academic_year: placement.academic_year || '',
      students_placed: placement.students_placed || '',
      total_students: placement.total_students || '',
      highest_package: placement.highest_package || '',
      average_package: placement.average_package || ''
    });
    setEditingPlacementId(placement.placement_id);
    setShowForm(true);
  };

  const handleDelete = async (placementId) => {
    if (!window.confirm('Are you sure you want to delete this placement record?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/placements/${placementId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        alert(data.message);
        fetchPlacements();
      } else {
        alert('Error: ' + data.message);
      }
    } catch (err) {
      alert('Failed to delete placement record');
    }
  };

  if (loading) return <div>Loading placements data...</div>;
  if (error) return <div style={{color: 'red'}}>{error}</div>;

  return (
    <div>
      <h2>Placement Statistics</h2>
      
      {isTeacher && (
        <div>
          <button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Add New Placement Record'}
          </button>

          {showForm && (
            <form onSubmit={handleSubmit} style={{marginTop: '20px', marginBottom: '20px'}}>
              <h3>{editingPlacementId ? 'Edit Placement Record' : 'Add New Placement Record'}</h3>
              <div>
                <select
                  name="dept_id"
                  value={formData.dept_id}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept.dept_id} value={dept.dept_id}>
                      {dept.dept_name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <input
                  type="text"
                  name="academic_year"
                  placeholder="Academic Year (e.g., 2023-24)"
                  value={formData.academic_year}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <input
                  type="number"
                  name="students_placed"
                  placeholder="Students Placed"
                  value={formData.students_placed}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <input
                  type="number"
                  name="total_students"
                  placeholder="Total Students"
                  value={formData.total_students}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <input
                  type="number"
                  name="highest_package"
                  placeholder="Highest Package (INR)"
                  value={formData.highest_package}
                  onChange={handleInputChange}
                  step="0.01"
                />
              </div>
              <div>
                <input
                  type="number"
                  name="average_package"
                  placeholder="Average Package (INR)"
                  value={formData.average_package}
                  onChange={handleInputChange}
                  step="0.01"
                />
              </div>
              <button type="submit">{editingPlacementId ? 'Update' : 'Add'} Record</button>
            </form>
          )}
        </div>
      )}

      {placements.map((placement) => (
        <div key={placement.placement_id} style={{marginBottom: '20px', border: '1px solid #ccc', padding: '10px'}}>
          <h3>{placement.dept_name} ({placement.dept_code})</h3>
          <p><strong>Academic Year:</strong> {placement.academic_year}</p>
          <p><strong>Students Placed:</strong> {placement.students_placed} / {placement.total_students}</p>
          <p><strong>Placement Percentage:</strong> {((placement.students_placed / placement.total_students) * 100).toFixed(2)}%</p>
          <p><strong>Highest Package:</strong> ₹{placement.highest_package}</p>
          <p><strong>Average Package:</strong> ₹{placement.average_package}</p>
          
          {isTeacher && (
            <div>
              <button onClick={() => handleEdit(placement)}>Edit</button>
              <button onClick={() => handleDelete(placement.placement_id)}>Delete</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ==================== JOB NOTIFICATIONS COMPONENT ====================
function JobNotifications({ isAdmin }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '',
    position: '',
    description: '',
    eligibility: '',
    package: '',
    location: '',
    last_date: ''
  });
  const [editingJobId, setEditingJobId] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch(`${API_URL}/jobs`);
      const data = await response.json();

      if (data.success) {
        setJobs(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch jobs data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingJobId 
        ? `${API_URL}/jobs/${editingJobId}` 
        : `${API_URL}/jobs`;
      const method = editingJobId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        alert(data.message);
        setShowForm(false);
        setEditingJobId(null);
        setFormData({
          company_name: '',
          position: '',
          description: '',
          eligibility: '',
          package: '',
          location: '',
          last_date: ''
        });
        fetchJobs();
      } else {
        alert('Error: ' + data.message);
      }
    } catch (err) {
      alert('Failed to submit job notification');
    }
  };

  const handleEdit = (job) => {
    setFormData({
      company_name: job.company_name,
      position: job.position,
      description: job.description || '',
      eligibility: job.eligibility || '',
      package: job.package || '',
      location: job.location || '',
      last_date: job.last_date || ''
    });
    setEditingJobId(job.job_id);
    setShowForm(true);
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job notification?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/jobs/${jobId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        alert(data.message);
        fetchJobs();
      } else {
        alert('Error: ' + data.message);
      }
    } catch (err) {
      alert('Failed to delete job notification');
    }
  };

  if (loading) return <div>Loading job notifications...</div>;
  if (error) return <div style={{color: 'red'}}>{error}</div>;

  return (
    <div>
      <h2>Job Notifications</h2>
      
      {isAdmin && (
        <div>
          <button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Add New Job'}
          </button>

          {showForm && (
            <form onSubmit={handleSubmit} style={{marginTop: '20px'}}>
              <h3>{editingJobId ? 'Edit Job' : 'Add New Job'}</h3>
              <div>
                <input
                  type="text"
                  name="company_name"
                  placeholder="Company Name"
                  value={formData.company_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <input
                  type="text"
                  name="position"
                  placeholder="Position"
                  value={formData.position}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <textarea
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>
              <div>
                <textarea
                  name="eligibility"
                  placeholder="Eligibility Criteria"
                  value={formData.eligibility}
                  onChange={handleInputChange}
                  rows="2"
                />
              </div>
              <div>
                <input
                  type="number"
                  name="package"
                  placeholder="Package (in INR)"
                  value={formData.package}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <input
                  type="text"
                  name="location"
                  placeholder="Location"
                  value={formData.location}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <input
                  type="date"
                  name="last_date"
                  value={formData.last_date}
                  onChange={handleInputChange}
                />
              </div>
              <button type="submit">{editingJobId ? 'Update' : 'Add'} Job</button>
            </form>
          )}
        </div>
      )}

      <div style={{marginTop: '30px'}}>
        {jobs.map((job) => (
          <div key={job.job_id} style={{marginBottom: '20px', border: '1px solid #ccc', padding: '10px'}}>
            <h3>{job.company_name} - {job.position}</h3>
            <p><strong>Description:</strong> {job.description}</p>
            <p><strong>Eligibility:</strong> {job.eligibility}</p>
            <p><strong>Package:</strong> ₹{job.package}</p>
            <p><strong>Location:</strong> {job.location}</p>
            <p><strong>Last Date:</strong> {job.last_date}</p>
            <p><strong>Posted:</strong> {new Date(job.posted_date).toLocaleDateString()}</p>
            
            {isAdmin && (
              <div>
                <button onClick={() => handleEdit(job)}>Edit</button>
                <button onClick={() => handleDelete(job.job_id)}>Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== INTERNSHIPS COMPONENT ====================
function Internships() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      const response = await fetch(`${API_URL}/internships`);
      const data = await response.json();

      if (data.success) {
        setInternships(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch internships data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading internships...</div>;
  if (error) return <div style={{color: 'red'}}>{error}</div>;

  return (
    <div>
      <h2>Internship Opportunities</h2>
      {internships.map((internship) => (
        <div key={internship.internship_id} style={{marginBottom: '20px', border: '1px solid #ccc', padding: '10px'}}>
          <h3>{internship.company_name} - {internship.position}</h3>
          <p><strong>Description:</strong> {internship.description}</p>
          <p><strong>Duration:</strong> {internship.duration}</p>
          <p><strong>Stipend:</strong> ₹{internship.stipend}</p>
          <p><strong>Location:</strong> {internship.location}</p>
          <p><strong>Last Date:</strong> {internship.last_date}</p>
          <p><strong>Posted:</strong> {new Date(internship.posted_date).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
}

// ==================== EXAMINATIONS COMPONENT ====================
function Examinations({ isAdmin }) {
  const [exams, setExams] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    exam_name: '',
    exam_type: '',
    dept_id: '',
    year: '',
    subject: '',
    exam_date: '',
    start_time: '',
    end_time: '',
    room_number: ''
  });
  const [editingExamId, setEditingExamId] = useState(null);

  useEffect(() => {
    fetchExams();
    if (isAdmin) {
      fetchDepartments();
    }
  }, [isAdmin]);

  const fetchExams = async () => {
    try {
      const response = await fetch(`${API_URL}/examinations`);
      const data = await response.json();

      if (data.success) {
        setExams(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch examinations data');
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await fetch(`${API_URL}/departments`);
      const data = await response.json();

      if (data.success) {
        setDepartments(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch departments');
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingExamId 
        ? `${API_URL}/examinations/${editingExamId}` 
        : `${API_URL}/examinations`;
      const method = editingExamId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        alert(data.message);
        setShowForm(false);
        setEditingExamId(null);
        setFormData({
          exam_name: '',
          exam_type: '',
          dept_id: '',
          year: '',
          subject: '',
          exam_date: '',
          start_time: '',
          end_time: '',
          room_number: ''
        });
        fetchExams();
      } else {
        alert('Error: ' + data.message);
      }
    } catch (err) {
      alert('Failed to submit examination');
    }
  };

  const handleEdit = (exam) => {
    setFormData({
      exam_name: exam.exam_name,
      exam_type: exam.exam_type || '',
      dept_id: exam.dept_id || '',
      year: exam.year || '',
      subject: exam.subject || '',
      exam_date: exam.exam_date || '',
      start_time: exam.start_time || '',
      end_time: exam.end_time || '',
      room_number: exam.room_number || ''
    });
    setEditingExamId(exam.exam_id);
    setShowForm(true);
  };

  if (loading) return <div>Loading examinations...</div>;
  if (error) return <div style={{color: 'red'}}>{error}</div>;

  return (
    <div>
      <h2>Examination Timetable</h2>
      
      {isAdmin && (
        <div>
          <button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Add New Exam'}
          </button>

          {showForm && (
            <form onSubmit={handleSubmit} style={{marginTop: '20px'}}>
              <h3>{editingExamId ? 'Edit Exam' : 'Add New Exam'}</h3>
              <div>
                <input
                  type="text"
                  name="exam_name"
                  placeholder="Exam Name"
                  value={formData.exam_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <input
                  type="text"
                  name="exam_type"
                  placeholder="Exam Type (Theory/Practical)"
                  value={formData.exam_type}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <select
                  name="dept_id"
                  value={formData.dept_id}
                  onChange={handleInputChange}
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept.dept_id} value={dept.dept_id}>
                      {dept.dept_name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <input
                  type="number"
                  name="year"
                  placeholder="Year"
                  value={formData.year}
                  onChange={handleInputChange}
                  min="1"
                  max="4"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <input
                  type="date"
                  name="exam_date"
                  value={formData.exam_date}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <input
                  type="time"
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <input
                  type="time"
                  name="end_time"
                  value={formData.end_time}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <input
                  type="text"
                  name="room_number"
                  placeholder="Room Number"
                  value={formData.room_number}
                  onChange={handleInputChange}
                />
              </div>
              <button type="submit">{editingExamId ? 'Update' : 'Add'} Exam</button>
            </form>
          )}
        </div>
      )}

      <div style={{marginTop: '30px'}}>
        {exams.map((exam) => (
          <div key={exam.exam_id} style={{marginBottom: '20px', border: '1px solid #ccc', padding: '10px'}}>
            <h3>{exam.exam_name}</h3>
            <p><strong>Type:</strong> {exam.exam_type}</p>
            <p><strong>Department:</strong> {exam.dept_name}</p>
            <p><strong>Year:</strong> {exam.year}</p>
            <p><strong>Subject:</strong> {exam.subject}</p>
            <p><strong>Date:</strong> {exam.exam_date}</p>
            <p><strong>Time:</strong> {exam.start_time} - {exam.end_time}</p>
            <p><strong>Room:</strong> {exam.room_number}</p>
            
            {isAdmin && (
              <div>
                <button onClick={() => handleEdit(exam)}>Edit</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== ALUMNI COMPONENT ====================
function Alumni() {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAlumni();
  }, []);

  const fetchAlumni = async () => {
    try {
      const response = await fetch(`${API_URL}/alumni`);
      const data = await response.json();

      if (data.success) {
        setAlumni(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch alumni data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading alumni data...</div>;
  if (error) return <div style={{color: 'red'}}>{error}</div>;

  return (
    <div>
      <h2>Alumni Network</h2>
      {alumni.map((person) => (
        <div key={person.alumni_id} style={{marginBottom: '20px', border: '1px solid #ccc', padding: '10px'}}>
          <h3>{person.name}</h3>
          <p><strong>Roll Number:</strong> {person.roll_number}</p>
          <p><strong>Department:</strong> {person.dept_name}</p>
          <p><strong>Graduation Year:</strong> {person.graduation_year}</p>
          <p><strong>Current Company:</strong> {person.current_company}</p>
          <p><strong>Current Position:</strong> {person.current_position}</p>
          <p><strong>Email:</strong> {person.email}</p>
        </div>
      ))}
    </div>
  );
}

// ==================== ADMIN LOGIN COMPONENT ====================
function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (data.success) {
        onLogin(true);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Login failed');
    }
  };

  return (
    <div>
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {error && <p style={{color: 'red'}}>{error}</p>}
    </div>
  );
}
// ==================== TEACHER LOGIN COMPONENT ====================
function TeacherLogin({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${API_URL}/teacher/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (data.success) {
        onLogin(true, data.name);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Login failed');
    }
  };

  return (
    <div>
      <h2>Teacher Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {error && <p style={{color: 'red'}}>{error}</p>}
    </div>
  );
}

// ==================== MAIN APP COMPONENT ====================
// ==================== MAIN APP COMPONENT ====================
function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isTeacher, setIsTeacher] = useState(false);
  const [teacherName, setTeacherName] = useState('');

  const handleTeacherLogin = (status, name) => {
    setIsTeacher(status);
    setTeacherName(name || '');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'students':
        return <Students />;
      case 'faculty':
        return <Faculty />;
      case 'placements':
        return <Placements isTeacher={isTeacher} />;
      case 'jobs':
        return <JobNotifications isAdmin={isAdmin || isTeacher} />;
      case 'internships':
        return <Internships />;
      case 'examinations':
        return <Examinations isAdmin={isAdmin || isTeacher} />;
      case 'alumni':
        return <Alumni />;
      case 'admin':
        return isAdmin ? (
          <div>
            <h2>Admin Panel</h2>
            <p>You are logged in as admin.</p>
            <button onClick={() => setIsAdmin(false)}>Logout</button>
          </div>
        ) : (
          <AdminLogin onLogin={setIsAdmin} />
        );
      case 'teacher':
        return isTeacher ? (
          <div>
            <h2>Teacher Panel</h2>
            <p>Welcome, {teacherName}!</p>
            <p>You can now manage placements, jobs, and examinations.</p>
            <button onClick={() => { setIsTeacher(false); setTeacherName(''); }}>Logout</button>
          </div>
        ) : (
          <TeacherLogin onLogin={handleTeacherLogin} />
        );
      default:
        return <Home />;
    }
  };

  return (
    <div style={{padding: '20px'}}>
      <nav style={{marginBottom: '20px', borderBottom: '2px solid #333', paddingBottom: '10px'}}>
        <button onClick={() => setCurrentPage('home')}>Home</button>
        <button onClick={() => setCurrentPage('students')}>Students</button>
        <button onClick={() => setCurrentPage('faculty')}>Faculty</button>
        <button onClick={() => setCurrentPage('placements')}>Placements</button>
        <button onClick={() => setCurrentPage('jobs')}>Jobs</button>
        <button onClick={() => setCurrentPage('internships')}>Internships</button>
        <button onClick={() => setCurrentPage('examinations')}>Examinations</button>
        <button onClick={() => setCurrentPage('alumni')}>Alumni</button>
        <button onClick={() => setCurrentPage('teacher')}>
          {isTeacher ? `Teacher (${teacherName})` : 'Teacher Login'}
        </button>
        <button onClick={() => setCurrentPage('admin')}>
          {isAdmin ? 'Admin Panel' : 'Admin Login'}
        </button>
      </nav>

      <main>
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
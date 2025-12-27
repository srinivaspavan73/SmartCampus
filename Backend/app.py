from flask import Flask, request, jsonify
from flask_cors import CORS
import pymysql
from datetime import datetime

app = Flask(__name__)
CORS(app)
# Database configuration
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': '@Lakshmi73',  # Change this
    'database': 'college_management',
    'cursorclass': pymysql.cursors.DictCursor
}

def get_db_connection():
    """Create and return database connection"""
    return pymysql.connect(**DB_CONFIG)

# ==================== HOME ====================
@app.route('/')
def home():
    return jsonify({'message': 'College Management System API'})

# ==================== STUDENTS ====================
@app.route('/api/students/search/<roll_number>', methods=['GET'])
def search_student(roll_number):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query = """
            SELECT s.*, d.dept_name, d.dept_code
            FROM students s
            LEFT JOIN departments d ON s.dept_id = d.dept_id
            WHERE s.roll_number = %s
        """
        cursor.execute(query, (roll_number,))
        student = cursor.fetchone()
        
        cursor.close()
        conn.close()
        
        if student:
            return jsonify({
                'success': True,
                'data': student
            })
        else:
            return jsonify({
                'success': False,
                'message': 'Student not found'
            }), 404
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

# ==================== FACULTY ====================
@app.route('/api/faculty', methods=['GET'])
def get_faculty():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query = """
            SELECT f.*, d.dept_name, d.dept_code
            FROM faculty f
            LEFT JOIN departments d ON f.dept_id = d.dept_id
            ORDER BY d.dept_name, f.name
        """
        cursor.execute(query)
        faculty = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        # Group by department
        faculty_by_dept = {}
        for member in faculty:
            dept_name = member['dept_name']
            if dept_name not in faculty_by_dept:
                faculty_by_dept[dept_name] = []
            faculty_by_dept[dept_name].append(member)
        
        return jsonify({
            'success': True,
            'data': faculty_by_dept
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

# ==================== PLACEMENTS ====================
@app.route('/api/placements', methods=['GET'])
def get_placements():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query = """
            SELECT p.*, d.dept_name, d.dept_code
            FROM placements p
            LEFT JOIN departments d ON p.dept_id = d.dept_id
            ORDER BY d.dept_name
        """
        cursor.execute(query)
        placements = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        return jsonify({
            'success': True,
            'data': placements
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

# ==================== JOB NOTIFICATIONS ====================
@app.route('/api/jobs', methods=['GET'])
def get_jobs():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query = "SELECT * FROM job_notifications WHERE is_active = TRUE ORDER BY posted_date DESC"
        cursor.execute(query)
        jobs = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        return jsonify({
            'success': True,
            'data': jobs
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/jobs', methods=['POST'])
def add_job():
    try:
        data = request.json
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query = """
            INSERT INTO job_notifications 
            (company_name, position, description, eligibility, package, location, last_date)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query, (
            data['company_name'],
            data['position'],
            data.get('description', ''),
            data.get('eligibility', ''),
            data.get('package', 0),
            data.get('location', ''),
            data.get('last_date', None)
        ))
        conn.commit()
        job_id = cursor.lastrowid
        
        cursor.close()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'Job notification added successfully',
            'job_id': job_id
        }), 201
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/jobs/<int:job_id>', methods=['PUT'])
def update_job(job_id):
    try:
        data = request.json
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query = """
            UPDATE job_notifications 
            SET company_name = %s, position = %s, description = %s, 
                eligibility = %s, package = %s, location = %s, last_date = %s
            WHERE job_id = %s
        """
        cursor.execute(query, (
            data['company_name'],
            data['position'],
            data.get('description', ''),
            data.get('eligibility', ''),
            data.get('package', 0),
            data.get('location', ''),
            data.get('last_date', None),
            job_id
        ))
        conn.commit()
        
        cursor.close()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'Job notification updated successfully'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/jobs/<int:job_id>', methods=['DELETE'])
def delete_job(job_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query = "DELETE FROM job_notifications WHERE job_id = %s"
        cursor.execute(query, (job_id,))
        conn.commit()
        
        cursor.close()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'Job notification deleted successfully'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

# ==================== INTERNSHIPS ====================
@app.route('/api/internships', methods=['GET'])
def get_internships():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query = "SELECT * FROM internships WHERE is_active = TRUE ORDER BY posted_date DESC"
        cursor.execute(query)
        internships = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        return jsonify({
            'success': True,
            'data': internships
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

# ==================== EXAMINATIONS ====================
@app.route('/api/examinations', methods=['GET'])
def get_examinations():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query = """
            SELECT e.*, d.dept_name, d.dept_code
            FROM examinations e
            LEFT JOIN departments d ON e.dept_id = d.dept_id
            ORDER BY e.exam_date, e.start_time
        """
        cursor.execute(query)
        exams = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        return jsonify({
            'success': True,
            'data': exams
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/examinations', methods=['POST'])
def add_examination():
    try:
        data = request.json
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query = """
            INSERT INTO examinations 
            (exam_name, exam_type, dept_id, year, subject, exam_date, start_time, end_time, room_number)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query, (
            data['exam_name'],
            data.get('exam_type', ''),
            data.get('dept_id', None),
            data.get('year', None),
            data.get('subject', ''),
            data.get('exam_date', None),
            data.get('start_time', None),
            data.get('end_time', None),
            data.get('room_number', '')
        ))
        conn.commit()
        exam_id = cursor.lastrowid
        
        cursor.close()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'Examination added successfully',
            'exam_id': exam_id
        }), 201
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/examinations/<int:exam_id>', methods=['PUT'])
def update_examination(exam_id):
    try:
        data = request.json
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query = """
            UPDATE examinations 
            SET exam_name = %s, exam_type = %s, dept_id = %s, year = %s, 
                subject = %s, exam_date = %s, start_time = %s, end_time = %s, room_number = %s
            WHERE exam_id = %s
        """
        cursor.execute(query, (
            data['exam_name'],
            data.get('exam_type', ''),
            data.get('dept_id', None),
            data.get('year', None),
            data.get('subject', ''),
            data.get('exam_date', None),
            data.get('start_time', None),
            data.get('end_time', None),
            data.get('room_number', ''),
            exam_id
        ))
        conn.commit()
        
        cursor.close()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'Examination updated successfully'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

# ==================== ALUMNI ====================
@app.route('/api/alumni', methods=['GET'])
def get_alumni():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query = """
            SELECT a.*, d.dept_name, d.dept_code
            FROM alumni a
            LEFT JOIN departments d ON a.dept_id = d.dept_id
            ORDER BY a.graduation_year DESC, a.name
        """
        cursor.execute(query)
        alumni = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        return jsonify({
            'success': True,
            'data': alumni
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

# ==================== ADMIN ====================
@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    try:
        data = request.json
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query = "SELECT * FROM admin WHERE username = %s AND password = %s"
        cursor.execute(query, (data['username'], data['password']))
        admin = cursor.fetchone()
        
        cursor.close()
        conn.close()
        
        if admin:
            return jsonify({
                'success': True,
                'message': 'Login successful',
                'admin_id': admin['admin_id']
            })
        else:
            return jsonify({
                'success': False,
                'message': 'Invalid credentials'
            }), 401
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

# ==================== DEPARTMENTS (Helper) ====================
@app.route('/api/departments', methods=['GET'])
def get_departments():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query = "SELECT * FROM departments ORDER BY dept_name"
        cursor.execute(query)
        departments = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        return jsonify({
            'success': True,
            'data': departments
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500
    
    # ==================== TEACHER LOGIN ====================
@app.route('/api/teacher/login', methods=['POST'])
def teacher_login():
    try:
        data = request.json
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query = "SELECT * FROM teachers WHERE username = %s AND password = %s"
        cursor.execute(query, (data['username'], data['password']))
        teacher = cursor.fetchone()
        
        cursor.close()
        conn.close()
        
        if teacher:
            return jsonify({
                'success': True,
                'message': 'Login successful',
                'teacher_id': teacher['teacher_id'],
                'name': teacher['name']
            })
        else:
            return jsonify({
                'success': False,
                'message': 'Invalid credentials'
            }), 401
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

# ==================== PLACEMENTS CRUD (Teacher Access) ====================
@app.route('/api/placements', methods=['POST'])
def add_placement():
    try:
        data = request.json
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query = """
            INSERT INTO placements 
            (dept_id, academic_year, students_placed, total_students, highest_package, average_package)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query, (
            data['dept_id'],
            data['academic_year'],
            data['students_placed'],
            data['total_students'],
            data['highest_package'],
            data['average_package']
        ))
        conn.commit()
        placement_id = cursor.lastrowid
        
        cursor.close()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'Placement record added successfully',
            'placement_id': placement_id
        }), 201
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/placements/<int:placement_id>', methods=['PUT'])
def update_placement(placement_id):
    try:
        data = request.json
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query = """
            UPDATE placements 
            SET dept_id = %s, academic_year = %s, students_placed = %s, 
                total_students = %s, highest_package = %s, average_package = %s
            WHERE placement_id = %s
        """
        cursor.execute(query, (
            data['dept_id'],
            data['academic_year'],
            data['students_placed'],
            data['total_students'],
            data['highest_package'],
            data['average_package'],
            placement_id
        ))
        conn.commit()
        
        cursor.close()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'Placement record updated successfully'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/placements/<int:placement_id>', methods=['DELETE'])
def delete_placement(placement_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query = "DELETE FROM placements WHERE placement_id = %s"
        cursor.execute(query, (placement_id,))
        conn.commit()
        
        cursor.close()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'Placement record deleted successfully'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
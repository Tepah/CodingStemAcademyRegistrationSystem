from db_connection import get_db_connection
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename


scores_bp = Blueprint('scores', __name__)

# GET functions
@scores_bp.route('/scores', methods=['GET'])
def get_scores():
    connection = get_db_connection()
    try: 
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM scores")
        scores = cursor.fetchall()
    finally:
        cursor.close()
        connection.close()
    return jsonify({'message': 'Scores retrieved successfully', 'scores': scores}), 200

@scores_bp.route('/total', methods=['GET'])
def get_total_grade():
    student_id = request.args.get('student_id')
    class_id = request.args.get('class_id')
    db = get_db_connection()
    try:
        cursor = db.cursor(dictionary=True)
        
        # Get the total points for assignments with due dates that have passed
        cursor.execute("""
            SELECT SUM(total_points) AS total_points 
            FROM assignments 
            WHERE class_id = %s AND due_date <= NOW()
        """, (class_id,))
        total_points = cursor.fetchone()
        
        if not total_points['total_points']:
            return jsonify({'message': 'No assignments with passed due dates found for this class', 'total': 0})
        
        # Get the total grade for assignments with due dates that have passed
        cursor.execute("""
            SELECT SUM(grade) AS total_grade 
            FROM scores 
            WHERE student_id = %s 
            AND assignment_id IN (
                SELECT id 
                FROM assignments 
                WHERE class_id = %s AND due_date <= NOW()
            )
        """, (student_id, class_id))
        total_grade = cursor.fetchone()
        
        if not total_grade['total_grade']:
            return jsonify({'message': 'No scores found for this student for assignments with passed due dates', 'total': 0})
        
        # Calculate the total grade percentage
        if total_points and total_grade:
            total_grade = (total_grade['total_grade'] / total_points['total_points']) * 100
        else:
            total_grade = 0
    finally:
        cursor.close()
        db.close()
    
    return jsonify({'message': 'Total grade retrieved successfully', 'total': total_grade if total_grade else 0}), 200

@scores_bp.route('/scores/<int:assignment_id>/student/<int:student_id>', methods=['GET'])
def get_scores_by_student(assignment_id, student_id):
    connection = get_db_connection()
    try: 
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM scores WHERE student_id = %s AND assignment_id = %s", (student_id, assignment_id))
        score = cursor.fetchone()
    finally:
        cursor.close()
        connection.close()
    return jsonify({'message': 'Scores retrieved successfully', 'score': score}), 200


@scores_bp.route('/score', methods=['GET'])
def get_score_by_submission():
    submission_id = request.args.get('submission_id')
    connection = get_db_connection()
    try: 
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM scores WHERE submission_id = %s", (submission_id,))
        score = cursor.fetchone()
    finally:
        cursor.close()
        connection.close()
    if score:
        return jsonify({'message': 'Score retrieved successfully', 'score': score}), 200
    else:
        return jsonify({'message': 'Score not found'})

@scores_bp.route('/score', methods=['GET'])
def get_score():
    score_id = request.args.get('id')
    connection = get_db_connection()
    try: 
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM scores WHERE id = %s", (score_id,))
        score = cursor.fetchone()
    finally:
        cursor.close()
        connection.close()
    if score:
        return jsonify({'message': 'Score retrieved successfully', 'score': score}), 200
    else:
        return jsonify({'message': 'Score not found'}), 
    
@scores_bp.route('/scores/assignment', methods=['GET'])
def get_scores_by_assignment():
    assignment_id = request.args.get('assignment_id')
    connection = get_db_connection()
    try: 
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM scores WHERE assignment_id = %s", (assignment_id,))
        scores = cursor.fetchall()
    finally:
        cursor.close()
        connection.close()
    if scores:
        return jsonify({'message': 'Scores retrieved successfully', 'scores': scores}), 200
    else:
        return jsonify({'message': 'No scores found for this assignment'}), 404

# POST functions

@scores_bp.route('/score', methods=['POST'])
def create_score():
    data = request.get_json()
    student_id = data.get('student_id')
    submission_id = data.get('submission_id')
    assignment_id = data.get('assignment_id')
    feedback = data.get('feedback')
    grade = data.get('grade')
    
    connection = get_db_connection()
    try: 
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM scores WHERE student_id = %s AND assignment_id = %s", (student_id, assignment_id))
        existing_score = cursor.fetchone()
        print(data)

        if existing_score:
            return jsonify({'message': 'Score already exists for this student and assignment'}), 400
        else:
            cursor.execute("INSERT INTO scores (student_id, assignment_id, grade, feedback, submission_id) VALUES (%s, %s, %s, %s, %s)", (student_id, assignment_id, grade, feedback, submission_id))
            connection.commit()
            return jsonify({'message': 'Score created successfully'}), 201

    except Exception as e:
        connection.rollback()
        return jsonify({'message': str(e)}, 500)
    finally:
        cursor.close()
        connection.close()


ALLOWED_EXTENSIONS = {"pdf", "docx", "txt", "jpg", "png"}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@scores_bp.route('/ai/score-suggestion', methods=['POST'])
def get_ai_score_suggestion():
    if 'submission_file' not in request.files:
        return jsonify({'message': 'No SubmissionFile'}), 400
    if 'assignment_file' in request.files:
        assignment_file = request.files['assignment_file']
    else:
        assignment_file = None

    submission_file = request.files['submission_file']
    if submission_file.filename == '':
        return jsonify({'message': 'No selected file'}), 400
    if not submission_file or not allowed_file(submission_file.filename):
        return jsonify({'message': 'Invalid file type'}), 400
    
    assignment = request.form.get('assignment')
    
    prompt = generate_submission_suggestion_prompt(assignment_file, submission_file, assignment)

    return jsonify({'message': 'AI score suggestion generated successfully', 'response': {'grade': 0, 'feedback': prompt}), 200


# PUT functions
@scores_bp.route('/score', methods=['PUT'])
def update_score():
    data = request.get_json()
    score_id = data.get('id')
    student_id = data.get('student_id')
    submission_id = data.get('submission_id')
    assignment_id = data.get('assignment_id')
    feedback = data.get('feedback')
    grade = data.get('grade')

    connection = get_db_connection()
    try: 
        cursor = connection.cursor(dictionary=True)
        cursor.execute("UPDATE scores SET student_id = %s, submission_id = %s, assignment_id = %s, feedback = %s, grade = %s WHERE id = %s", (student_id, submission_id, assignment_id, feedback, grade, score_id))
        connection.commit()
        return jsonify({'message': 'Score updated successfully'}), 200
    except Exception as e:
        connection.rollback()
        return jsonify({'message': str(e)}, 500)
    finally:
        cursor.close()
        connection.close()

# DELETE functions
@scores_bp.route('/score', methods=['DELETE'])
def delete_score():
    score_id = request.args.get('id')
    connection = get_db_connection()
    try: 
        cursor = connection.cursor(dictionary=True)
        cursor.execute("DELETE FROM scores WHERE id = %s", (score_id,))
        connection.commit()
        return jsonify({'message': 'Score deleted successfully'}), 200
    except Exception as e:
        connection.rollback()
        return jsonify({'message': str(e)}, 500)
    finally:
        cursor.close()
        connection.close()

# HELPER functions
def generate_submission_suggestion_prompt(assignment_file, submission_file, assignmentData):
    prompt = f"""
    You are a teacher's assistant. You will be given an assignment file and a student's submission file. 
    Your task is to grade the submission based on the assignment file and provide feedback.
    
    Assignment File: {assignment_file.filename if assignment_file else 'No assignment file provided'}
    
    Submission File: {submission_file.filename}
    
    Assignment Data: {assignmentData}

    Please provide a grade (out of 100) and feedback.
    Separate the grade and feedback with a new line.
    """
    return prompt
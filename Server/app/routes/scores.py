from db_connection import get_db_connection
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
import json
import requests
import os
from dotenv import load_dotenv
from PIL import Image
import pytesseract


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
    submission_file = request.files.get('submission_file')
    assignment_file = request.files.get('assignment_file')

    if not submission_file:
        return jsonify({'message': 'No SubmissionFile'}), 400

    if submission_file.filename == '':
        return jsonify({'message': 'No selected submission file'}), 400

    if not allowed_file(submission_file.filename):
        return jsonify({'message': 'Invalid submission file type'}), 400

    assignment_text = None  # Initialize assignment_text
    try:
        # Process submission file
        img = Image.open(submission_file.stream)
        submission_text = pytesseract.image_to_string(img)
        submission_filename = submission_file.filename + ".txt"

        # Process assignment file (if provided)
        if assignment_file and assignment_file.filename != '':
            if not allowed_file(assignment_file.filename):
                return jsonify({'message': 'Invalid assignment file type'}), 400
            img = Image.open(assignment_file.stream)
            assignment_text = pytesseract.image_to_string(img)
            assignment_filename = assignment_file.filename + ".txt"
        assignment = request.form.get('assignment')
        prompt = generate_submission_suggestion_prompt(assignment_text, submission_text, assignment)

        ai_response = get_deepseek_completion_with_files(prompt)
        if ai_response:
            parsed_response = parse_ai_response(ai_response)
            if parsed_response:
                grade = parsed_response.get('grade')
                feedback = parsed_response.get('feedback')
                return jsonify({'message': 'AI score suggestion retrieved successfully', 'grade': grade, 'feedback': feedback}), 200
            else:
                return jsonify({'message': 'Error parsing AI response'}), 500
        else:
            return jsonify({'message': 'Error retrieving AI score suggestion'}), 500

    except Exception as e:
        return jsonify({'message': f'Error processing image: {str(e)}'}), 500

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
def get_deepseek_completion_with_files(prompt):
    api_key = os.environ.get("DEEPSEEK_API_KEY")
    if not api_key:
        raise ValueError("API key is not set in the environment variables.")

    url = "https://api.deepseek.com/v1/chat/completions"  # Double-check this URL!

    headers = {
        'Authorization': f'Bearer {api_key}',
        "Content-Type": "application/json"
    }

    data = {
        "model": "deepseek-chat",  # Or the correct DeepSeek model name
        "messages": [
            {"role": "system", "content": "You are a helpful assistant"},
            {"role": "user", "content": prompt},
        ],
        "stream": False  # Set to False for a complete response
    }

    try:
        response = requests.post(url, headers=headers, json=data)  # Send as data
        response.raise_for_status()  # Raise HTTPError for bad responses (4xx or 5xx)
        return response.json()['choices'][0]['message']['content']  # Adjust based on actual DeepSeek response format

    except requests.exceptions.RequestException as e:
        raise ValueError(f"Error in API request: {e}")
    except (KeyError, ValueError, TypeError) as e:
        raise ValueError(f"Error parsing JSON response: {e}")


def generate_submission_suggestion_prompt(assignment_text, submission_text, assignmentData):
    prompt = f"""
    You are a teacher's assistant. You will be given an assignment (if provided) and a student's submission.
    Your task is to grade the submission based on the assignment and provide feedback.

    Both the assignment and the submission are TEXTUAL representations of images.

    Assignment: {assignment_text if assignment_text else 'No assignment provided'}

    Submission: {submission_text}

    Assignment Data: {json.dumps(assignmentData)}

    Please provide a grade (out of 100) and feedback.
    Separate the grade and feedback with a new line.
    """
    return prompt

def parse_ai_response(response):
    # Example response: "85\nGood job, but you could improve on the introduction."
    try:
        response_lines = response.split('\n')
        grade = int(response_lines[0].strip())
        feedback = '\n'.join(response_lines[1:]).strip()
        return {'grade': grade, 'feedback': feedback}
    except (IndexError, ValueError):
        return {'grade': 0, 'feedback': 'Invalid AI response'}
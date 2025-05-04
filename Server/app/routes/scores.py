from db_connection import get_db_connection
from flask import Blueprint, request, jsonify

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


@scores_bp.route('/scores/<int:assignment_id>/student/<int:student_id>', methods=['GET'])
def get_scores_by_student(assignment_id, student_id):
    connection = get_db_connection()
    try: 
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM scores WHERE student_id = %s AND assignment_id = %s", (student_id, assignment_id))
        scores = cursor.fetchall()
    finally:
        cursor.close()
        connection.close()
    return jsonify({'message': 'Scores retrieved successfully', 'scores': scores}), 200
    
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

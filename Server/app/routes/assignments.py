from db_connection import get_db_connection
from flask import Flask, jsonify, request, Blueprint
import requests
import os
import json

assignments_bp = Blueprint('assignments', __name__)

# GET functions
@assignments_bp.route('/assignments', methods=['GET'])
def get_assignments_by_class_route():
    class_id = request.args.get('class_id', type=int)
    assignments = get_assignments_by_class(class_id)
    if assignments is None:
        return jsonify({"message": "No assignments found"})
    return jsonify({"message": "Assignment retrieved", "assignments": assignments})


def get_assignments_by_class(class_id):
    my_db = get_db_connection()
    try:
        cursor = my_db.cursor(dictionary=True)
        sql = "SELECT * FROM assignments WHERE class_id = %s"
        val = (class_id, )
        cursor.execute(sql, val)
        res = cursor.fetchall()
    finally:
        cursor.close()
        my_db.close()
    return res

@assignments_bp.route('/assignment', methods=['GET'])
def get_assignment_by_id_route():
    id = request.args.get('id')
    assignment = get_assignment_by_id(id)
    if assignment is None:
        return jsonify({"message": "Assignment not found"})
    return jsonify({"message": "Assignment retrieved", "assignment": assignment})

def get_assignment_by_id(id):
    my_db = get_db_connection()
    try:
        cursor = my_db.cursor(dictionary=True)
        sql = "SELECT * FROM assignments WHERE id = %s"
        val = (id, )
        cursor.execute(sql, val)
        res = cursor.fetchone()
    finally:
        cursor.close()
        my_db.close()
    return res

@assignments_bp.route('/classes-assignments', methods=['GET'])
def get_assignments_for_class(class_id):
    class_id = request.args.get('class_id', class_id)
    my_db = get_db_connection()
    try:
        cursor = my_db.cursor(dictionary=True)
        cursor.execute("SELECT * FROM assignments WHERE class_id = %s", (class_id,))
        assignments = cursor.fetchall()
    finally:
        cursor.close()
        my_db.close()
    return jsonify({"message": "Retrieved All Assignments", "assignments": assignments})

# POST functions
@assignments_bp.route('/assignments', methods=['POST'])
def add_assignment_route():
    data = request.get_json()
    class_id = data.get('class_id')
    title = data.get('title')
    description = data.get('description')
    due_date = data.get('due_date')

    add_assignment(class_id, title, description, due_date)
    return jsonify({"message": "Assignment added"})

def add_assignment(class_id, title, description, due_date):
    my_db = get_db_connection()
    try:
        cursor = my_db.cursor()
        sql = "INSERT INTO assignments " \
        "(class_id, title, description, due_date) " \
        "VALUES (%s, %s, %s, %s)"
        vals = (class_id, title, description, due_date)
        cursor.execute(sql, vals)
        my_db.commit()
    finally:
        cursor.close()
        my_db.close()

@assignments_bp.route('/generate-assignment', methods=['POST'])
def generate_assignment():
    data = request.get_json()
    prompt = data.get('prompt')
    class_info = data.get('class_info')

    if not prompt or not class_info:
        return jsonify({"error": "Prompt and class_info are required"}), 400

    try:
        # Prepare detailed prompt for AI
        detailed_prompt = f"""
        Create a comprehensive assignment with these requirements:
        - Class: {class_info.get('class_name', 'N/A')}
        - Grade: {class_info.get('grade_level', 'N/A')}
        - Subject: {class_info.get('subject', 'General')}
        - Specific instructions: {prompt}

        Return in this exact JSON format:
        {{
            "title": "string",
            "description": "string",
            "suggested_due_date": "YYYY-MM-DD"
        }}
        """

        # Call DeepSeek API
        response = requests.post(
            'https://api.deepseek.com/v1/chat/completions',
            headers={
                'Authorization': f'Bearer {os.getenv("DEEPSEEK_API_KEY")}',
                'Content-Type': 'application/json'
            },
            json={
                'model': 'deepseek-chat',
                'messages': [{'role': 'user', 'content': detailed_prompt}],
                'temperature': 0.7,
                'response_format': {'type': 'json_object'}
            },
            timeout=30
        )

        response.raise_for_status()
        ai_content = response.json()['choices'][0]['message']['content']
        
        # Parse and validate response
        assignment_data = json.loads(ai_content)
        if not all(key in assignment_data for key in ['title', 'description']):
            raise ValueError("Invalid AI response format")

        return jsonify({
            "message": "Assignment generated",
            "assignment": {
                "title": assignment_data['title'],
                "description": assignment_data['description'],
                "suggested_due_date": assignment_data.get('suggested_due_date')
            }
        })

    except requests.exceptions.RequestException as e:
        return jsonify({
            "error": "AI service unavailable",
            "details": str(e)
        }), 503
    except json.JSONDecodeError:
        return jsonify({
            "error": "Invalid response from AI service"
        }), 502
    except Exception as e:
        return jsonify({
            "error": "Assignment generation failed",
            "details": str(e)
        }), 500

# PUT functions
@assignments_bp.route('/update-assignment', methods=['PUT'])
def update_assignment_route():
    data = request.get_json()
    id = data.get('id')
    class_id = data.get('class_id')
    description = data.get('description')
    due_date = data.get('due_date')

    assignment = update_assignment(id, class_id, description, due_date)
    if assignment is None:
        return jsonify({"message": "Assignment not found"})
    return jsonify({"message": "Assignment updated", "assignment": assignment})


def update_assignment(id, class_id, description, due_date):
    my_db = get_db_connection()
    try:
        cursor = my_db.cursor(dictionary=True)
        sql = "SELECT * FROM assignments WHERE id = %s"
        val = (id, )
        cursor.execute(sql, val)
        assignment = cursor.fetchone()
        if assignment is None:
            return None
        sql = "UPDATE assignments SET class_id = %s, description" \
        " = %s, due_date = %s WHERE id = %s"
        vals = (class_id if class_id else assignment["class_id"], 
                description if description else assignment["description"],
                due_date if due_date else assignment["due_date"], 
                id)
        cursor.execute(sql, vals)
        my_db.commit()
        res = cursor.fetchone()
    finally:
        cursor.close()
        my_db.close()
    return res

# DELETE functions
@assignments_bp.route('/assignment', methods=['DELETE'])
def delete_assignment_route():
    id = request.args.get('id')
    if not delete_assignment(id):
        return jsonify({"message": "Assignment not found"})
    return jsonify({"message": "Assignment deleted"})

def delete_assignment(id):
    my_db = get_db_connection()
    try:
        cursor = my_db.cursor()
        sql = "DELETE FROM assignments WHERE id = %s"
        val = (id, )
        cursor.execute(sql, val)
        my_db.commit()
    except:
        return False
    finally:
        cursor.close()
        my_db.close()
    return True
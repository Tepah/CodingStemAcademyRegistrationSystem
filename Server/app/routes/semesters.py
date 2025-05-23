from db_connection import get_db_connection
from flask import Flask, json, jsonify, request, Blueprint
import requests
import os

semesters_bp = Blueprint('semesters', __name__)

# GET functions
@semesters_bp.route('/semesters', methods=['GET'])
def get_semesters_by_class_route():
    db = get_db_connection()
    try:
        cursor = db.cursor(dictionary=True)
        sql = "SELECT * FROM semesters"
        cursor.execute(sql)
        semesters = cursor.fetchall()
    finally:
        db.close()
        cursor.close()
    if not semesters:
        return jsonify({'message': 'No semesters found'}), 200
    return jsonify({'message': 'Semesters retrieved', 'semesters': semesters}), 200

@semesters_bp.route('/semesters/ongoing-or-upcoming', methods=['GET'])
def get_concurrent_semesters_route():
    db = get_db_connection()
    try:
        cursor = db.cursor(dictionary=True)
        sql = "SELECT * FROM semesters WHERE status = 'Ongoing' OR status = 'Upcoming'"
        cursor.execute(sql)
        semesters = cursor.fetchall()
    finally:
        db.close()
        cursor.close()
    if not semesters:
        return jsonify({'message': 'No concurrent semesters found'}), 200
    return jsonify({'message': 'Concurrent semesters retrieved', 'semesters': semesters}), 200


@semesters_bp.route('/semester', methods=['GET'])
def get_semester_by_id_route():
    db = get_db_connection()
    semester_id = request.args.get('id')
    try:
        cursor = db.cursor(dictionary=True)
        sql = "SELECT * FROM semesters WHERE id = %s"
        cursor.execute(sql, (semester_id,))
        semester = cursor.fetchone()
    finally:
        db.close()
        cursor.close()
    if not semester:
        return jsonify({'message': 'Semester not found'}), 404
    return jsonify({'message': 'Semester retrieved', 'semester': semester}), 200

@semesters_bp.route('/current-semester', methods=['GET'])
def get_current_semester_route():
    db = get_db_connection()
    try:
        cursor = db.cursor(dictionary=True)
        sql = "SELECT * FROM semesters WHERE status = 'Ongoing'"
        cursor.execute(sql)
        semester = cursor.fetchone()
    finally:
        db.close()
        cursor.close()
    if not semester:
        return jsonify({'message': 'No current semester found'}), 404
    return jsonify({'message': 'Current semester retrieved', 'semester': semester}), 200

# POST functions
@semesters_bp.route('/semester', methods=['POST'])
def create_semester_route():
    db = get_db_connection()
    data = request.get_json()
    try:
        cursor = db.cursor(dictionary=True)
        sql = "INSERT INTO semesters (name, start_date, end_date, status) VALUES (%s, %s, %s, %s)"
        cursor.execute(sql, (data['name'], data['start_date'], data['end_date'], data['status']))
        db.commit()
    finally:
        db.close()
        cursor.close()
    return jsonify({'message': 'Semester created successfully'}), 201

@semesters_bp.route('/generate-AI-semester-schedule', methods=['POST'])
def generate_ai_semester_schedule_route():
    db = get_db_connection()
    data = request.get_json()

    all_classes = data.get('all_classes', [])
    semesters = data.get('semesters', [])
    current_semester_id = ('semester_id', 0)
    classes = data.get('classes', []),
    teachers = data.get('teachers', [])
    try:




# PUT functions
@semesters_bp.route('/semester', methods=['PUT'])
def update_semester_route():
    db = get_db_connection()
    data = request.get_json()
    try:
        cursor = db.cursor(dictionary=True)
        sql = "UPDATE semesters SET name = %s, start_date = %s, end_date = %s, status = %s WHERE id = %s"
        cursor.execute(sql, (data['name'], data['start_date'], data['end_date'], data['status'], data['id']))
        db.commit()
    finally:
        db.close()
        cursor.close()
    return jsonify({'message': 'Semester updated successfully'}), 200

# DELETE functions
@semesters_bp.route('/semester', methods=['DELETE'])
def delete_semester_route():
    db = get_db_connection()
    semester_id = request.args.get('semester_id')
    try:
        cursor = db.cursor(dictionary=True)
        sql = "DELETE FROM semesters WHERE id = %s"
        cursor.execute(sql, (semester_id,))
        db.commit()
    finally:
        db.close()
        cursor.close()
    return jsonify({'message': 'Semester deleted successfully'}), 200

# Helper functions
def call_deepseek_api(prompt):
    """
    Calls the DeepSeek API to get class suggestions.
    """
    deepseek_api_key = os.environ.get('DEEPSEEK_API_KEY')
    print(f"DeepSeek API Key: {deepseek_api_key}")  # Debugging line
    if not deepseek_api_key:
        return False, "API key not found"
    try:
        headers = {
            "Authorization": f"Bearer {deepseek_api_key}",
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

        response = requests.post("https://api.deepseek.com/v1/chat/completions", headers=headers, json=data)  # Replace with the actual DeepSeek endpoint
        response.raise_for_status()  # Raise HTTPError for bad responses (4xx or 5xx)

        json_response = response.json()

        # Extract the message content
        if 'choices' in json_response and len(json_response['choices']) > 0:
            message_content = json_response['choices'][0]['message']['content']
            return True, message_content
        else:
            return False, "No suggestions found in response"

    except requests.exceptions.RequestException as e:
        return False, f"API request failed: {e}"
    except Exception as e:
        return False, f"An unexpected error occurred: {e}"
    

def construct_prompt(all_classes, semesters, current_semester_id, classes, teachers):
    """
    Constructs the prompt for the language model.
    """

    prompt = f"""
    Suggest a semester schedule for a semester with the following information:
    - Current Semester Id: {current_semester_id}

    All Previous Classes (JSON Array):
    {json.dumps(all_classes)}

    All Semesters (JSON Array):
    {json.dumps(semesters)}

    Teachers (JSON Array of Objects with id and name):
    {json.dumps([{'id': t['id'], 'name': t['name']} for t in teachers])}

    Current Classes (JSON Array):
    {json.dumps(classes)}

    Based on this information, generate a JSON array of classes for the semester. Each class object should have the following fields:
    - class_id (integer)
    - class_name (string)
    - teacher_id (integer)
    - start_time (string, format HH:MM, e.g., 09:00)
    - end_time (string, format HH:MM, e.g., 10:50)
    - day (string, e.g "Monday", "Tuesday")
    - semester_id (integer)

    Consider the following constraints:
    - Previous classes offered in past semesters
    - Classes should be 1 hour and 50 minutes long
    - Offer more sections of popular classes to accommodate the student count
    - The number of teachers available
    - The teacher's previously taught classes
    - The teacher's experience
    - Valid start times are 9:00 AM, 11:00 AM, 1:30 PM, 3:30 PM, and 5:30 PM
    - Friday classes should only be able to start past 3:30 PM

    Example Output:
    [
        {{
            "class_id": 101,
            "class_name": "Introduction to Programming",
            "teacher_id": 1,
            "start_time": "09:00",
            "end_time": "10:50",
            "day": "Friday",
            "semester_id": 202501
        }},
        {{
            "class_id": 102,
            "class_name": "Data Structures and Algorithms",
            "teacher_id": 2,
            "start_time": "11:00",
            "end_time": "12:50",
            "day": "Tuesday",
            "semester_id": 202501
        }}
    ]
    """
    return prompt

def parse_ai_schedule(ai_response_text):
    """
    Parses the AI-generated schedule from the language model's response.
    """
    try:
        # Attempt to parse the AI response as a JSON array
        schedule = json.loads(ai_response_text)

        # Validate the structure of the schedule
        if not isinstance(schedule, list):
            raise ValueError("AI response is not a JSON array")

        for class_data in schedule:
            if not isinstance(class_data, dict):
                raise ValueError("Each item in the AI response should be a JSON object")

            # Check for required keys
            required_keys = ["class_id", "class_name", "teacher_id", "start_time", "end_time", "day", "semester_id"]
            for key in required_keys:
                if key not in class_data:
                    raise ValueError(f"Missing key: {key} in class data")

            # Basic type validation (you can add more specific validation)
            if not isinstance(class_data["class_id"], int):
                raise ValueError("class_id must be an integer")
            if not isinstance(class_data["class_name"], str):
                raise ValueError("class_name must be a string")
            if not isinstance(class_data["teacher_id"], int):
                raise ValueError("teacher_id must be an integer")
            if not isinstance(class_data["start_time"], str):
                raise ValueError("start_time must be a string")
            if not isinstance(class_data["end_time"], str):
                raise ValueError("end_time must be a string")
            if not isinstance(class_data["day"], list):
                raise ValueError("day must be a list")
            if not isinstance(class_data["semester_id"], int):
                raise ValueError("semester_id must be an integer")

        return True, schedule  # Return the parsed schedule

    except json.JSONDecodeError as e:
        return False, f"Invalid JSON format: {e}"
    except ValueError as e:
        return False, str(e)  # Return the error message
    except Exception as e:
        return False, f"An unexpected error occurred during parsing: {e}"
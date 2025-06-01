from datetime import timedelta, time
from db_connection import get_db_connection
from flask import Flask, jsonify, request, Blueprint
import requests
import os
import json
from datetime import date

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


@assignments_bp.route('/assignments/student-week', methods=['GET'])
def get_assignments_by_student_and_week():
    student_id = request.args.get('student_id')
    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)
        sql = "SELECT * FROM class_students WHERE user_id = %s"
        cursor.execute(sql, (student_id,))
        class_ids = cursor.fetchall()
        if not class_ids:
            return jsonify({"message": "No classes found for this student", "assignments": []})
        assignments = []
        for classData in class_ids:
            id = classData['class_id']
            sql = "SELECT * FROM assignments WHERE class_id = %s AND due_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY) ORDER BY due_date ASC"
            cursor.execute(sql, (id,))
            assignments_for_class = cursor.fetchall()
            sql = "SELECT * FROM classes WHERE id = %s"
            cursor.execute(sql, (id, ))
            classInfo = cursor.fetchone()
            print(classInfo)
            for assignment in assignments_for_class:
                assignment["class_id"] = id
                assignment["class_name"] = classInfo['class_name']
                assignments.append(assignment)
    finally:
        cursor.close()
        db.close()
    sorted_assignments = sorted(assignments, key=lambda x: x['due_date'])
    return jsonify({"message": "Assignments retrieved", "assignments": sorted_assignments})

@assignments_bp.route('/assignments/student', methods=['GET'])
def get_assignments_by_student():
    student_id = request.args.get('student_id')
    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)
        sql = "SELECT * FROM class_students WHERE user_id = %s"
        cursor.execute(sql, (student_id,))
        class_ids = cursor.fetchall()
        if not class_ids:
            return jsonify({"message": "No classes found for this student", "assignments": []})
        assignments = []
        for classData in class_ids:
            id = classData['class_id']
            sql = "SELECT * FROM assignments WHERE class_id = %s AND due_date >= CURDATE() ORDER BY due_date ASC"
            cursor.execute(sql, (id,))
            assignments_for_class = cursor.fetchall()
            sql = "SELECT * FROM classes WHERE id = %s"
            cursor.execute(sql, (id, ))
            classInfo = cursor.fetchone()
            sql = "SELECT * FROM users WHERE id = %s"
            cursor.execute(sql, (classInfo['teacher_id'], ))
            teacherInfo = cursor.fetchone()
            for assignment in assignments_for_class:
                assignment["teacher_name"] = teacherInfo['first_name'] if teacherInfo else "N/A"
                assignment["teacher_gender"] = teacherInfo["gender"] if teacherInfo else "N/A"
                assignment["class_id"] = id
                assignment["class_name"] = classInfo['class_name']
                assignments.append(assignment)
    finally:
        cursor.close()
        db.close()
    sorted_assignments = sorted(assignments, key=lambda x: x['due_date'])
    return jsonify({"message": "Assignments retrieved", "assignments": sorted_assignments})

@assignments_bp.route('/assignments/teacher-week', methods=['GET'])
def get_assignments_by_teacher_and_week():
    teacher_id = request.args.get('teacher_id')
    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)
        sql = "SELECT * FROM classes WHERE teacher_id = %s"
        cursor.execute(sql, (teacher_id,))
        class_ids = cursor.fetchall()
        if not class_ids:
            return jsonify({"message": "No classes found for this teacher", "assignments": []})
        assignments = []
        for classData in class_ids:
            id = classData['id']
            sql = "SELECT * FROM assignments WHERE class_id = %s AND due_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY) ORDER BY due_date ASC"
            cursor.execute(sql, (id,))
            assignments_for_class = cursor.fetchall()
            sql = "SELECT * FROM classes WHERE id = %s"
            cursor.execute(sql, (id, ))
            classInfo = cursor.fetchone()
            print(classInfo)
            for assignment in assignments_for_class:
                assignment["class_id"] = id
                assignment["class_name"] = classInfo['class_name']
                assignments.append(assignment)
    finally:
        cursor.close()
        db.close()
    sorted_assignments = sorted(assignments, key=lambda x: x['due_date'])
    return jsonify({"message": "Assignments retrieved", "assignments": sorted_assignments})

@assignments_bp.route('/assignments/teacher', methods=['GET'])
def get_assignments_by_teacher():
    teacher_id = request.args.get('teacher_id')
    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)
        sql = "SELECT * FROM classes WHERE teacher_id = %s"
        cursor.execute(sql, (teacher_id,))
        class_ids = cursor.fetchall()
        if not class_ids:
            return jsonify({"message": "No classes found for this teacher", "assignments": []})
        assignments = []
        for classData in class_ids:
            id = classData['id']
            sql = "SELECT * FROM assignments WHERE class_id = %s AND due_date >= CURDATE() ORDER BY due_date ASC"
            cursor.execute(sql, (id,))
            assignments_for_class = cursor.fetchall()
            sql = "SELECT * FROM classes WHERE id = %s"
            cursor.execute(sql, (id, ))
            classInfo = cursor.fetchone()
            sql = "SELECT * FROM users WHERE id = %s"
            cursor.execute(sql, (teacher_id, ))
            teacherInfo = cursor.fetchone()
            for assignment in assignments_for_class:
                assignment["teacher_name"] = teacherInfo['first_name'] if teacherInfo else "N/A"
                assignment["teacher_gender"] = teacherInfo['gender'] if teacherInfo else "N/A"
                assignment["class_id"] = id
                assignment["class_name"] = classInfo['class_name']
                assignments.append(assignment)
    finally:
        cursor.close()
        db.close()
    sorted_assignments = sorted(assignments, key=lambda x: x['due_date'])
    return jsonify({"message": "Assignments retrieved", "assignments": sorted_assignments})

@assignments_bp.route('/events/student', methods=['GET'])
def get_events_by_student():
    student_id = request.args.get('student_id')
    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)
        sql = "SELECT * FROM class_students WHERE user_id = %s"
        cursor.execute(sql, (student_id,))
        class_ids = cursor.fetchall()
        if not class_ids:
            return jsonify({"message": "No classes found for this student", "assignments": []})
        assignments = []
        classes = []
        for classData in class_ids:
            id = classData['class_id']
            sql = "SELECT * FROM assignments WHERE class_id = %s ORDER BY due_date ASC"
            cursor.execute(sql, (id,))
            assignments_for_class = cursor.fetchall()
            sql = "SELECT * FROM classes WHERE id = %s"
            cursor.execute(sql, (id, ))
            classInfo = cursor.fetchone()

            # Check if the semester is ongoing
            semester_id = classInfo.get('semester_id')
            if semester_id:
                sql = "SELECT status FROM semesters WHERE id = %s"
                cursor.execute(sql, (semester_id,))
                semester_info = cursor.fetchone()
                if semester_info and semester_info['status'] != 'Ongoing':
                    continue  # Skip this class if the semester is not ongoing

            if 'start_time' in classInfo and isinstance(classInfo['start_time'], timedelta):
                classInfo['start_time'] = format_24h_time(classInfo['start_time'])
            if 'end_time' in classInfo and isinstance(classInfo['end_time'], timedelta):
                classInfo['end_time'] = format_24h_time(classInfo['end_time'])

            classes.append(classInfo)
            sql = "SELECT * FROM users WHERE id = %s"
            cursor.execute(sql, (classInfo['teacher_id'], ))
            teacherInfo = cursor.fetchone()
            for assignment in assignments_for_class:

                assignment["teacher_name"] = teacherInfo['first_name'] if teacherInfo else "N/A"
                assignment["teacher_gender"] = teacherInfo["gender"] if teacherInfo else "N/A"
                assignment["class_id"] = id
                assignment["class_name"] = classInfo['class_name']
                assignments.append(assignment)
    finally:
        cursor.close()
        db.close()
    sorted_assignments = sorted(assignments, key=lambda x: x['due_date'])
    return jsonify({"message": "Assignments retrieved", "assignments": sorted_assignments, "classes": classes})

@assignments_bp.route('/events/teacher', methods=['GET'])
def get_events_by_teacher():
    teacher_id = request.args.get('teacher_id')
    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)
        sql = "SELECT * FROM classes WHERE teacher_id = %s"
        cursor.execute(sql, (teacher_id,))
        class_ids = cursor.fetchall()
        if not class_ids:
            return jsonify({"message": "No classes found for this teacher", "assignments": []})
        assignments = []
        classes = []
        for classData in class_ids:
            id = classData['id']
            # First, retrieve the class information
            sql = "SELECT * FROM classes WHERE id = %s"
            cursor.execute(sql, (id,))
            classInfo = cursor.fetchone()

            # Ensure classInfo is not None before proceeding
            if classInfo is None:
                print(f"Warning: Class with id {id} not found.")
                continue  # Skip to the next classData

            # Check if the semester is ongoing
            semester_id = classInfo.get('semester_id')
            if semester_id:
                sql = "SELECT status FROM semesters WHERE id = %s"
                cursor.execute(sql, (semester_id,))
                semester_info = cursor.fetchone()
                if semester_info is None:
                    print(f"Warning: Semester with id {semester_id} not found.")
                    continue  # Skip to the next classData
                if semester_info['status'] != 'Ongoing':
                    print(f"Skipping class {id} because semester {semester_id} is not ongoing.")
                    continue  # Skip to the next classData
            
            sql = "SELECT * FROM assignments WHERE class_id = %s ORDER BY due_date ASC"
            cursor.execute(sql, (id,))
            assignments_for_class = cursor.fetchall()

            if 'start_time' in classInfo and isinstance(classInfo['start_time'], timedelta):
                classInfo['start_time'] = format_24h_time(classInfo['start_time'])
            if 'end_time' in classInfo and isinstance(classInfo['end_time'], timedelta):
                classInfo['end_time'] = format_24h_time(classInfo['end_time'])

            classes.append(classInfo)
            sql = "SELECT * FROM users WHERE id = %s"
            cursor.execute(sql, (teacher_id, ))
            teacherInfo = cursor.fetchone()

            for assignment in assignments_for_class:
                assignment["teacher_name"] = teacherInfo['first_name'] if teacherInfo else "N/A"
                assignment["teacher_gender"] = teacherInfo['gender'] if teacherInfo else "N/A"
                assignment["class_id"] = id
                assignment["class_name"] = classInfo['class_name']
                assignments.append(assignment)
    finally:
        cursor.close()
        db.close()
    sorted_assignments = sorted(assignments, key=lambda x: x['due_date'])
    return jsonify({"message": "Assignments retrieved", "assignments": sorted_assignments, "classes": classes})

# POST functions
@assignments_bp.route('/assignments', methods=['POST'])
def add_assignment_route():
    data = request.get_json()
    class_id = data.get('class_id')
    title = data.get('title')
    description = data.get('description')
    due_date = data.get('due_date')

    add_assignment(class_id, description, due_date, title)
    return jsonify({"message": "Assignment added"})

def add_assignment(class_id, description, due_date, title):
    my_db = get_db_connection()
    try:
        cursor = my_db.cursor()
        sql = "INSERT INTO assignments " \
        "(class_id, description, due_date, title) " \
        "VALUES (%s, %s, %s, %s)"
        vals = (class_id, description, due_date, title)
        cursor.execute(sql, vals)
        my_db.commit()
    finally:
        cursor.close()
        my_db.close()

@assignments_bp.route('/ai/generate-assignment', methods=['POST'])
def generate_assignment():
    data = request.get_json()
    prompt = data.get('prompt')
    today = date.today()
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
        Make sure the due date is in the future past {today} and the assignment is suitable for the specified class and grade level.

        Return in this exact JSON format:
        {{
            "title": "string",
            "description": "string",
            "suggested_due_date": "YYYY-MM-DD"
        }}
        """

        # Call DeepSeek API
        api_key = os.environ.get('DEEPSEEK_API_KEY')
        if not api_key:
            return jsonify({"error": "DEEPSEEK_API_KEY not set"}), 500

        response = requests.post(
            'https://api.deepseek.com/v1/chat/completions',
            headers={
                'Authorization': f'Bearer {api_key}',
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
    title = data.get('title')
    description = data.get('description')
    due_date = data.get('due_date')

    assignment = update_assignment(id, class_id, description, due_date, title)
    if assignment is None:
        return jsonify({"message": "Assignment not found"})
    return jsonify({"message": "Assignment updated", "assignment": assignment})


def update_assignment(id, class_id, description, due_date, title):
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
        " = %s, due_date = %s, title = %s WHERE id = %s"
        vals = (class_id if class_id else assignment["class_id"], description if description else assignment["description"],
                due_date if due_date else assignment["due_date"], title if title else assignment["title"], id)
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

# Helper function to format time
def format_time(time_obj):
    if isinstance(time_obj, timedelta):
        # Convert timedelta to seconds and then to a time object
        total_seconds = time_obj.total_seconds()
        hours = int(total_seconds // 3600)
        minutes = int((total_seconds % 3600) // 60)
        time_obj = time(hours, minutes)
    return time_obj.strftime("%I:%M %p")
def format_24h_time(time_obj):
    if isinstance(time_obj, timedelta):
        # Convert timedelta to seconds and then to a time object
        total_seconds = time_obj.total_seconds()
        hours = int(total_seconds // 3600)
        minutes = int((total_seconds % 3600) // 60)
        time_obj = time(hours, minutes)
    return time_obj.strftime("%H:%M")
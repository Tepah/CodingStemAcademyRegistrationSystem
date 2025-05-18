from db_connection import get_db_connection
from flask import Blueprint, request, jsonify
from datetime import timedelta, time
import requests
import os

classes_bp = Blueprint('classes', __name__)

def format_time(time_obj):
    if isinstance(time_obj, timedelta):
        # Convert timedelta to seconds and then to a time object
        total_seconds = time_obj.total_seconds()
        hours = int(total_seconds // 3600)
        minutes = int((total_seconds % 3600) // 60)
        time_obj = time(hours, minutes)
    return time_obj.strftime("%I:%M %p")

# GET functions
@classes_bp.route('/classes', methods=['GET'])
def get_classes():
    my_db = get_db_connection()
    try:
        cursor = my_db.cursor(dictionary=True)
        cursor.execute("SELECT * FROM classes ORDER BY FIELD(day, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'), start_time;")
        res = cursor.fetchall()
        for classData in res:
            if 'start_time' in classData and isinstance(classData['start_time'], timedelta):
                classData['start_time'] = format_time(classData['start_time'])
            if 'end_time' in classData and isinstance(classData['end_time'], timedelta):
                classData['end_time'] = format_time(classData['end_time'])
    finally:
        cursor.close()
        my_db.close()
    return jsonify({'message': 'All classes retrieved', 'classes': res})

@classes_bp.route('/class', methods=['GET'])
def get_class_by_id():
    my_db = get_db_connection()
    try:
        cursor = my_db.cursor(dictionary=True)
        class_id = request.args.get('id')
        sql = "SELECT * FROM classes WHERE id = %s ORDER BY FIELD(day, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'), start_time;"
        val = (class_id, )
        cursor.execute(sql, val)
        res = cursor.fetchone()
        if res is None:
            return jsonify({'message': 'Class not found'}), 404
        if 'start_time' in res and isinstance(res['start_time'], timedelta):
            res['start_time'] = format_time(res['start_time'])
        if 'end_time' in res and isinstance(res['end_time'], timedelta):
            res['end_time'] = format_time(res['end_time'])
    finally:
        cursor.close()
        my_db.close()
    return jsonify({'message': 'Class retrieved', 'class': res})

@classes_bp.route('/classes-teacher/count', methods=['GET'])
def get_classes_count_by_teacher():
    my_db = get_db_connection()
    try:
        cursor = my_db.cursor(dictionary=True)
        teacher_id = request.args.get('teacher_id')
        sql = "SELECT count(*) as count FROM classes WHERE teacher_id = %s ORDER BY FIELD(day, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'), start_time;"
        val = (teacher_id, )
        cursor.execute(sql, val)
        res = cursor.fetchone()
    finally:
        cursor.close()
        my_db.close()
    return jsonify({'message': 'Classes count retrieved', 'count': res['count']})

@classes_bp.route('/classes-student/count', methods=['GET'])
def get_classes_count_by_student():
    my_db = get_db_connection()
    try:
        cursor = my_db.cursor(dictionary=True)
        student_id = request.args.get('student_id')
        sql = "SELECT count(*) as count FROM class_students WHERE user_id = %s"
        val = (student_id, )
        cursor.execute(sql, val)
        res = cursor.fetchone()
    finally:
        cursor.close()
        my_db.close()
    return jsonify({'message': 'Classes count retrieved', 'count': res['count']})

@classes_bp.route('/classes/semester', methods=['GET'])
def get_classes_by_semester():
    my_db = get_db_connection()
    try:
        cursor = my_db.cursor(dictionary=True)
        semester_id = request.args.get('semester_id')
        sql = "SELECT * FROM classes WHERE semester_id = %s ORDER BY FIELD(day, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'), start_time;"
        val = (semester_id, )
        cursor.execute(sql, val)
        res = cursor.fetchall()
        for classData in res:
            if 'start_time' in classData and isinstance(classData['start_time'], timedelta):
                classData['start_time'] = format_time(classData['start_time'])
            if 'end_time' in classData and isinstance(classData['end_time'], timedelta):
                classData['end_time'] = format_time(classData['end_time'])
        temp_classes = []
        for classData in res:
            sql = "SELECT * FROM users WHERE id = %s"
            val = (classData['teacher_id'], )
            cursor.execute(sql, val)
            teacher = cursor.fetchone()
            classData['teacher_name'] = teacher['first_name'] + " " + teacher['last_name']
            sql = "SELECT * FROM semesters WHERE id = %s"
            val = (classData['semester_id'], )
            cursor.execute(sql, val)
            semester = cursor.fetchone()
            classData['semester'] = semester['name']
            sql = "SELECT count(*) as count FROM class_students WHERE class_id = %s"
            val = (classData['id'], )
            cursor.execute(sql, val)
            count = cursor.fetchone()
            classData['student_count'] = count['count']
            temp_classes.append(classData)

    finally:
        cursor.close()
        my_db.close()
    if not temp_classes:
        return jsonify({'message': 'No classes found for this semester', 'classes': []})
    return jsonify({'message': 'Classes retrieved', 'classes': temp_classes })

@classes_bp.route('/all-classes-by-student', methods=['GET'])
def get_all_classes_by_student():
    db = get_db_connection()
    try:
        user_id = request.args.get('student_id')
        cursor = db.cursor(dictionary=True)
        sql = "SELECT * FROM class_students WHERE user_id = %s"
        vals = (user_id, )
        cursor.execute(sql, vals)
        student_classes = cursor.fetchall()
        classes = []
        for row in student_classes:
            sql = "SELECT * FROM classes WHERE id = %s"
            val = (row['class_id'], )
            cursor.execute(sql, val)
            class_info = cursor.fetchone()
            class_info['student_id'] = user_id
            
            # Convert timedelta fields (if any) to strings
            if 'start_time' in class_info and isinstance(class_info['start_time'], timedelta):
                class_info['start_time'] = format_time(class_info['start_time'])
            if 'end_time' in class_info and isinstance(class_info['end_time'], timedelta):
                class_info['end_time'] = format_time(class_info['end_time'])

            if class_info:
                classes.append(class_info)
    finally:
        db.close()
        cursor.close()
    if not classes:
        return jsonify({'message': 'No classes found for this student', 'classes': []})
    return jsonify({'message': 'Classes retrieved', 'classes': classes})

@classes_bp.route('/all-classes-by-teacher', methods=['GET'])
def get_classes_by_teacher():
    id = request.args.get('teacher_id')
    db = get_db_connection()
    try:
        cursor = db.cursor(dictionary=True)
        sql = "SELECT * FROM classes WHERE teacher_id = %s ORDER BY FIELD(day, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'), start_time;"
        val = (id, )
        cursor.execute(sql, val)
        res = cursor.fetchall()
        for classData in res:
            if 'start_time' in classData and isinstance(classData['start_time'], timedelta):
                classData['start_time'] = format_time(classData['start_time'])
            if 'end_time' in classData and isinstance(classData['end_time'], timedelta):
                classData['end_time'] = format_time(classData['end_time'])
    finally:
        db.close()
        cursor.close()
    return jsonify({'message': 'Classes retrieved', 'classes': res})


@classes_bp.route('/class/<int:id>', methods=['GET'])
def get_class(id):
    db = get_db_connection()
    try:
        cursor = db.cursor(dictionary=True)
        sql = "SELECT * FROM classes WHERE id = %s"
        val = (id, )
        cursor.execute(sql, val)
        res = cursor.fetchone()
        if res is None:
            return jsonify({'message': 'Class not found'}), 404
        if 'start_time' in res and isinstance(res['start_time'], timedelta):
            res['start_time'] = format_time(res['start_time'])
        if 'end_time' in res and isinstance(res['end_time'], timedelta):
            res['end_time'] = format_time(res['end_time'])
    finally:
        db.close()
        cursor.close()
    return jsonify({'message': 'Class retrieved', 'class': res})

@classes_bp.route('/student-classes-by-semester', methods=['GET'])
def get_student_classes_by_semester():
    db = get_db_connection()
    try:
        cursor = db.cursor(dictionary=True)
        sql = "SELECT * FROM class_students WHERE user_id = %s"
        semester_id = request.args.get('semester_id')
        student_id = request.args.get('student_id')
        val = (student_id, )
        cursor.execute(sql, val)
        res = cursor.fetchall()
        classes = []
        for row in res:
            sql = "SELECT * FROM classes WHERE id = %s and semester_id = %s ORDER BY FIELD(day, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'), start_time;"
            val = (row['class_id'], semester_id )
            cursor.execute(sql, val)
            class_info = cursor.fetchone()
            if class_info:
                classes.append(class_info)
                if 'start_time' in class_info and isinstance(class_info['start_time'], timedelta):
                    class_info['start_time'] = format_time(class_info['start_time'])
                if 'end_time' in class_info and isinstance(class_info['end_time'], timedelta):
                    class_info['end_time'] = format_time(class_info['end_time'])
    finally:
        db.close()
        cursor.close()
    return jsonify({'message': 'Classes retrieved', 'classes': classes})

@classes_bp.route('/teacher-classes-by-semester')
def get_teachers_classes_by_semesters():
    db = get_db_connection()
    try:
        cursor = db.cursor(dictionary=True)
        sql = "SELECT * FROM classes WHERE teacher_id = %s and semester_id = %s ORDER BY FIELD(day, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'), start_time;"
        semester_id = request.args.get('semester_id')
        teacher_id = request.args.get('teacher_id')
        val = (teacher_id, semester_id)
        cursor.execute(sql, val)
        res = cursor.fetchall()
        for classData in res:
            if 'start_time' in classData and isinstance(classData['start_time'], timedelta):
                classData['start_time'] = format_time(classData['start_time'])
            if 'end_time' in classData and isinstance(classData['end_time'], timedelta):
                classData['end_time'] = format_time(classData['end_time'])
    finally:
        db.close()
        cursor.close()
    return jsonify({'message': 'Classes retrieved', 'classes': res})

# POST functions


@classes_bp.route('/add-class', methods=['POST'])
def add_class():
    my_db = get_db_connection()
    data = request.get_json()
    try: 
        teacher_id = data.get('teacher_id')
        class_name = data.get('class_name')
        subject = data.get('subject')
        semester_id = data.get('semester_id')
        day = data.get('day')
        start_time = data.get('start_time')
        end_time = data.get('end_time')

        cursor = my_db.cursor()
        sql = "INSERT INTO classes (teacher_id, class_name, subject, semester_id, day, start_time, end_time) VALUES(%s, %s, %s, %s, %s, %s, %s)"
        vals = (teacher_id, class_name, subject, semester_id, day, start_time, end_time)
        cursor.execute(sql, vals)
        my_db.commit()
    
        return jsonify({'message': 'Class has been added successfully'})
    except Exception as e:
        my_db.rollback()
        return jsonify({'message': 'Error occurred while adding class', 'error': str(e)}), 500
    finally:
        cursor.close()
        my_db.close()


@classes_bp.route('/suggest-schedule', methods=['POST'])
def suggest_schedule():
    """
    Suggests a class schedule for a student based on their data and available classes.
    """
    try:
        student_data = request.get_json()  # Get the JSON data from the request
        available_classes = student_data.get('available_classes', [])

       
        prompt = construct_prompt(student_data, available_classes)
        
        success, suggestions = call_deepseek_api(prompt) 

        if success:
            # Parse the suggestions and return the schedule
            suggested_schedule = parse_suggestions(suggestions, available_classes)

            for classData in suggested_schedule:
                if 'start_time' in classData and isinstance(classData['start_time'], timedelta):
                    classData['start_time'] = format_time(classData['start_time'])
                if 'end_time' in classData and isinstance(classData['end_time'], timedelta):
                    classData['end_time'] = format_time(classData['end_time'])
            # Return the suggested schedule
            return jsonify({'message': 'Suggested schedule retrieved', 'schedule': suggested_schedule})
        else:
            return jsonify({'message': 'Failed to generate schedule', 'error': suggestions}), 500

    except Exception as e:
        return jsonify({'message': 'An error occurred', 'error': str(e)}), 500

# PUT functions
@classes_bp.route('/update_class/<int:id>', methods=['PUT'])
def update_class(id):
    data = request.get_json()
    teacher_id = data.get('teacher_id')
    class_name = data.get('class_name')
    subject = data.get('subject')
    semester_id = data.get('semester_id')
    day = data.get('day')
    start_time = data.get('start_time')
    end_time = data.get('end_time')
    my_db = get_db_connection()
    try:
        cursor = my_db.cursor()
        sql = "SELECT * FROM classes WHERE id = %s"
        val = (id, )
        cursor.execute(sql, val)
        classes = cursor.fetchone()
        if classes is None:
            return None
        sql = "UPDATE classes SET teacher_id = %s, class_name = %s, subject = %s, semester_id = %s, day = %s, start_time = %s, end_time = %s WHERE id = %s"
        vals = (
            teacher_id if teacher_id else classes["teacher_id"], class_name if class_name else classes["class_name"], 
            subject if subject else classes["subject"], semester_id if semester_id else classes["semester_id"],
            day if day else classes["day"], start_time if start_time else classes["start_time"], end_time if end_time else classes["end_time"], id
        )
        cursor.execute(sql, vals)
        my_db.commit()
    finally:
        cursor.close()
        my_db.close()
    return jsonify({'message': 'Class was changed'})

# DELETE functions
@classes_bp.route('/delete_class/<int:id>', methods=['DELETE'])
def delete_class(id):
    my_db = get_db_connection()
    try:
        cursor = my_db.cursor()
        sql = "DELETE FROM classes WHERE id = %s"
        val = (id, )
        cursor.execute(sql, val)
        my_db.commit()
    finally:
        cursor.close()
        my_db.close()
    return jsonify({'message': 'Class has been deleted'})


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
    
# TODO: Fix the prompt so that it gets ID's and not names
def construct_prompt(student_data, available_classes):
    """
    Constructs the prompt for the language model.
    """
    student_id = student_data.get('student_id')
    previous_classes = student_data.get('previous_classes', [])
    current_grade_level = student_data.get('grade_level', "")

    prompt = f"""
    Suggest a class schedule for student with the following information:
    - Student ID: {student_id}
    - Previously Taken Classes: {previous_classes}
    - Current Grade Level: {current_grade_level}

    Available Classes:
    """
    for class_data in available_classes:
        prompt += f"""
        - Class Name: {class_data['class_name']}, Subject: {class_data['subject']}, Id: {class_data['id']}
        """

    prompt += """
    Based on this information, suggest a schedule of 3-4 classes that are appropriate for the student.
    List only the class names, separated by newlines.
    Consider the student's grade level, previous classes, and conflict-free scheduling
    """
    return prompt

def parse_suggestions(suggestions_text, available_classes):
    """
    Parses the suggestions from the language model and returns a list of class data.
    """
    suggested_class_names = [s.strip() for s in suggestions_text.split("\n") if s.strip()]
    suggested_schedule = []

    for class_name in suggested_class_names:
        # Find the class in the available classes list
        for class_data in available_classes:
            if class_data['class_name'] == class_name:
                suggested_schedule.append(class_data)
                break  # Stop searching once the class is found

    return suggested_schedule
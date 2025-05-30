import datetime
import os

import requests
from db_connection import get_db_connection
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask import request, jsonify, Blueprint
import bcrypt
import uuid

users_bp = Blueprint('users', __name__)


# GET functions
@users_bp.route('/users', methods=['GET'])
def get_users():
    my_db = get_db_connection()
    try:
        cursor = my_db.cursor(dictionary=True)
        cursor.execute("SELECT * FROM users")
        res = cursor.fetchall()
    finally:
        my_db.close()
        cursor.close()
    return jsonify({"message": "Retrieved All Users", "users": res})

@users_bp.route('/users/by-name', methods=['GET'])
def get_user_by_name():
    first_name = request.args.get('first_name')
    last_name = request.args.get('last_name')
    my_db = get_db_connection()
    try:
        cursor = my_db.cursor(dictionary=True)
        sql = "SELECT * FROM users WHERE first_name = %s AND last_name = %s"
        val = (first_name, last_name)
        cursor.execute(sql, val)
        users = cursor.fetchall()
    finally:
        cursor.close()
        my_db.close()
    return jsonify({"message": "Retrieved All Users by name", "users": users})

@users_bp.route('/user', methods=['GET'])
def get_user_by_id():
    id = request.args.get('id')
    db = get_db_connection()
    try:
        cursor = db.cursor(dictionary=True)
        sql = "SELECT * FROM users WHERE id = %s"
        val = (id, )
        cursor.execute(sql, val)
        user = cursor.fetchone()
    finally:
        db.close()
        cursor.close()
    return jsonify({"message": "User retrieved", "user": user})

@users_bp.route('/students', methods=['GET'])
def get_students():
    db = get_db_connection()
    try:
        cursor = db.cursor(dictionary=True)
        sql = "SELECT * FROM users WHERE role = 'Student'"
        cursor.execute(sql)
        students = cursor.fetchall()
    finally:
        db.close()
        cursor.close()
    return jsonify({"message": "Retrieved All Students", "students": students})

@users_bp.route('/teachers', methods=['GET'])
def get_teachers():
    db = get_db_connection()
    try:
        cursor = db.cursor(dictionary=True)
        sql = "SELECT * FROM users WHERE role = 'Teacher'"
        cursor.execute(sql)
        teachers = cursor.fetchall()
    finally:
        db.close()
        cursor.close()
    return jsonify({"message": "Retrieved All Teachers", "teachers": teachers})

@users_bp.route('/get-teacher-by-class', methods=['GET'])
def get_teacher_by_class():
    id = request.args.get('class_id')
    db = get_db_connection()
    try:
        cursor = db.cursor(dictionary=True)
        sql = "SELECT * FROM classes WHERE id = %s"
        val = (id, )
        cursor.execute(sql, val)
        class_info = cursor.fetchone()
        if class_info is None:
            return jsonify({"message": "Class not found"})
        sql = "SELECT * FROM users WHERE id = %s"
        val = (class_info['teacher_id'], )
        cursor.execute(sql, val)
        teacher = cursor.fetchone()
    finally:
        db.close()
        cursor.close()
    if teacher is None:
        return jsonify({"message": "Teacher not found"})
    return jsonify({"message": "Teacher retrieved", "teacher": teacher})


@users_bp.route('/get-students-by-class', methods=['GET'])
def get_students_by_class():
    class_id = request.args.get('class_id')
    db = get_db_connection()
    try:
        cursor = db.cursor(dictionary=True)
        sql = "SELECT * FROM class_students WHERE class_id = %s"
        val = (class_id, )
        cursor.execute(sql, val)
        students = cursor.fetchall()
        student_list = []
        for row in students:
            sql = "SELECT * FROM users WHERE id = %s"
            val = (row['user_id'], )
            cursor.execute(sql, val)
            student_info = cursor.fetchone()
            if student_info is not None:
                student_list.append(student_info)
    finally:
        db.close()
        cursor.close()
    return jsonify({"message": "Students retrieved", "students": student_list})

@users_bp.route('/get-student-ids-by-class', methods=['GET'])
def get_student_ids_by_class():
    class_id = request.args.get('class_id')
    db = get_db_connection()
    try:
        cursor = db.cursor(dictionary=True)
        sql = "SELECT * FROM class_students WHERE class_id = %s"
        val = (class_id, )
        cursor.execute(sql, val)
        students = cursor.fetchall()
        student_ids = [row['user_id'] for row in students]
    finally:
        db.close()
        cursor.close()
    return jsonify({"message": "Student IDs retrieved", "student_ids": student_ids})

# POST functions
def add_auth(user_id, password):
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    my_db = get_db_connection()
    cursor = my_db.cursor()
    sql = "INSERT INTO auths (user_id, password) VALUES (%s, %s)"
    vals = (user_id, hashed_password)
    cursor.execute(sql, vals)
    my_db.commit()
    return jsonify({"message": "Auth added"})


@users_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    my_db = get_db_connection()
    try:
        cursor = my_db.cursor(dictionary=True)
        # Check if user with email exists
        sql = "SELECT * FROM users WHERE email = %s"
        val = (email, )
        cursor.execute(sql, val)
        user = cursor.fetchone()
        if user is None:
            return jsonify({"message": "Invalid email or password"})
        # Check if password matches
        sql = "SELECT * FROM auths WHERE user_id = %s"
        val = (user['id'], )
        cursor.execute(sql, val)
        auth = cursor.fetchone()
        if auth is None or not bcrypt.checkpw(password.encode('utf-8'), auth['password'].encode('utf-8')):
            return jsonify({"message": "Invalid password"})

        user_info = {
            "id": user['id'],
            'email': user['email'],
            'role': user['role'],
            'first_name': user['first_name'],
            'last_name': user['last_name'],
        }

        access_token = create_access_token(identity=user_info)
    finally:
        cursor.close()
        my_db.close()
    return jsonify({"message": "Login successful", "access_token": access_token})

@users_bp.route('/register', methods=['POST'])
def add_user():
    data = request.get_json()
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    birth_date = data.get('birth_date')
    gender = data.get('gender')
    email = data.get('email')
    phone = data.get('phone')
    address = data.get('address')
    guardian = data.get('guardian')
    guardian_phone = data.get('guardian_phone')
    health_ins = data.get('health_ins')
    health_ins_num = data.get('health_ins_num')
    role = data.get('role')
    grade_level = data.get('grade_level', None)

    my_db = get_db_connection()
    try:
        print(data)
        cursor = my_db.cursor()
        sql = "INSERT INTO users " \
        "(first_name, last_name, birth_date, gender, email, phone, address, guardian, guardian_phone, health_ins, " \
        "health_ins_num, role, grade_level) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
        vals = (first_name, last_name, birth_date, gender, email, phone, address, guardian, guardian_phone,
                health_ins, health_ins_num, role, grade_level)
        cursor.execute(sql, vals)
        my_db.commit()
        user_id = cursor.lastrowid
        add_auth(user_id, data.get('password'))
        cursor.close()

        user_info = {
            "id": user_id,
            'email': email,
            'role': role,
            'first_name': first_name,
            'last_name': last_name,
        }
    finally:
        my_db.close()
        cursor.close()

    access_token = create_access_token(identity=user_info)
    return jsonify({"message": "Login successful", "access_token": access_token})

def add_auth(user_id, password):
    my_db = get_db_connection()
    try:
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        cursor = my_db.cursor()
        sql = "INSERT INTO auths (user_id, password) VALUES (%s, %s)"
        vals = (user_id, hashed_password)
        cursor.execute(sql, vals)
        my_db.commit()
    finally:
        my_db.close()
        cursor.close()
    return jsonify({"message": "Auth added"})


# POST functions
@users_bp.route('/users/update', methods=['PUT'])
def update_user():
    data = request.get_json()
    id = data.get('id')
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    birth_date = data.get('birth_date')
    gender = data.get('gender')
    email = data.get('email')
    phone = data.get('phone')
    address = data.get('address')
    guardian = data.get('guardian')
    guardian_phone = data.get('guardian_phone')
    health_ins = data.get('health_ins')
    health_ins_num = data.get('health_ins_num')
    role = data.get('role')
    grade_level = data.get('grade_level', None)
    print(data)

    my_db = get_db_connection()
    try:
        cursor = my_db.cursor(dictionary=True)
        sql = "SELECT * FROM users WHERE id = %s"
        val = (id, )
        cursor.execute(sql, val)
        user = cursor.fetchone()
        if user is None:
            return jsonify({"message": "User not found"})
        sql = "UPDATE users SET first_name = %s, last_name = %s, birth_date" \
        " = %s, gender = %s, email = %s, phone = %s, address = %s, guardian = %s, guardian_phone = %s, health_ins = %s, " \
        "health_ins_num = %s, role = %s, grade_level = %s WHERE id = %s"
        vals = (first_name if first_name else user["first_name"], last_name if last_name else user["last_name"],
                birth_date if birth_date else user["birth_date"], gender if gender else user["gender"], email if email else user["email"],
                phone if phone else user["phone"], address if address else user["address"], guardian if guardian else user["guardian"],
                guardian_phone if guardian_phone else user["guardian_phone"], health_ins if health_ins else user["health_ins"],
                health_ins_num if health_ins_num else user["health_ins_num"], role if role else user["role"],
                grade_level if grade_level else user["grade_level"], id)
        cursor.execute(sql, vals)
        my_db.commit()
    finally:
        cursor.close()
        my_db.close()
    return jsonify({"message": "User updated"})

@users_bp.route('/teacher-invite', methods=['POST'])
def create_teacher_invite():
    invite_id = str(uuid.uuid4())
    email = request.json.get('email')
    expires_at = datetime.datetime.now() + datetime.timedelta(days=5)
    expires_at_str = expires_at.strftime('%Y-%m-%d %H:%M:%S')
    db = get_db_connection()
    try:
        cursor = db.cursor(dictionary=True)
        sql = "INSERT INTO teacher_invites (id, email, expires_at) VALUES (%s, %s, %s)"
        vals = (invite_id, email, expires_at_str)
        cursor.execute(sql, vals)
        db.commit()
    finally:
        db.close()
        cursor.close()
    return jsonify({"message": "Teacher invite created", "invite_id": invite_id, "expires_at": expires_at_str})

@users_bp.route('/verify-teacher-invite', methods=['POST'])
def verify_teacher_invite():
    invite_id = request.json.get('invite_id')
    db = get_db_connection()
    try:
        cursor = db.cursor(dictionary=True)
        sql = "SELECT * FROM teacher_invites WHERE id = %s"
        vals = (invite_id, )
        cursor.execute(sql, vals)
        invite = cursor.fetchone()
        if invite is None:
            return jsonify({"message": "Invalid invite", "status": False})
        expires_at = datetime.datetime.strptime(str(invite['expires_at']), '%Y-%m-%d %H:%M:%S')
        if expires_at < datetime.datetime.now():
            return jsonify({"message": "Invite expired", "status": False})
        if invite['used']:
            sql = "DELETE FROM teacher_invites WHERE id = %s"
            vals = (invite_id, )
            cursor.execute(sql, vals)
            db.commit()
            return jsonify({"message": "Invite already used", "status": False})
    finally:
        db.close()
        cursor.close()
    return jsonify({"message": "Invite verified", "status": True, "email": invite['email']})

@users_bp.route('/ai', methods=['POST'])
def ai_suggestions():
    data = request.get_json()
    questions = data.get('questions')
    answers = data.get('answers')

    prompt = create_prompt(questions, answers)
    print(f"Prompt for DeepSeek API: {prompt}")

    success, response = call_deepseek_api(prompt)
    if not success:
        return jsonify({"message": response}), 500

    return jsonify({"message": "AI suggestions retrieved", "suggestions": response})



# DELETE functions
@users_bp.route('/users', methods=['DELETE'])
def delete_user():
    id = request.args.get('id')
    my_db = get_db_connection()
    try:
        cursor = my_db.cursor()
        sql = "DELETE FROM users WHERE id = %s"
        val = (id, )
        cursor.execute(sql, val)
        my_db.commit()
    finally:
        cursor.close()
        my_db.close()
    return jsonify({"message": "User deleted"})


# HELPER functions
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

        response = requests.post("https://api.deepseek.com/v1/chat/completions", headers=headers, json=data) 
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
    

def create_prompt (questions, answers):
    """
    Creates a prompt for the DeepSeek API based on the provided questions and answers.
    """
    prompt = "You are a helpful assistant at a Stem Coding Academy in Maple, CA. Answer the last question:\n\n"
    for i in range(len(questions)):
        prompt += f"Q: {questions[i]}\n"
    prompt += "\n Here are the previous answers to the questions to help you answer the last question:\n\n"
    for i in range(len(answers)):
        prompt += f"A: {answers[i]}\n"
    prompt += """\n\nPlease answer only the last question in a concise and informative manner. 
    Do not answer any questions that are not related to being a Stem Coding Academy in Maple, CA.
    Do not include any personal information about students or teachers.
    Explain why it is a good opportunity for students to join the Stem Coding Academy in Maple, CA.
    Questions related to registering for classes, class schedules, and class content are acceptable.
    """
    return prompt
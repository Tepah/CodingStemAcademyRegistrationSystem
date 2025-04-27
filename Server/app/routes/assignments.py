from db_connection import get_db_connection
from flask import Flask, jsonify, request, Blueprint

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
                assignment["teacher_name"] = teacherInfo['first_name']
                assignment["teacher_gender"] = teacherInfo["gender"]
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
                assignment["teacher_name"] = teacherInfo['first_name']
                assignment["teacher_gender"] = teacherInfo['gender']
                assignment["class_id"] = id5
                assignment["class_name"] = classInfo['class_name']
                assignments.append(assignment)
    finally:
        cursor.close()
        db.close()
    sorted_assignments = sorted(assignments, key=lambda x: x['due_date'])
    return jsonify({"message": "Assignments retrieved", "assignments": sorted_assignments})

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
    return jsonify({"message": "Assignment deleted", "assignment": assignment})

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


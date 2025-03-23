import mysql.connector
from flask import Flask, request, jsonify

my_db = mysql.connector.connect(
    host="192.168.50.210",
    user="class_user",
    password="password",
    database="Registration"
)


# POST Data 
###################### DO NOT TOUCH #######################################
def add_user(first_name, last_name, birth_date, gender, 
             email, phone, address, guardian, guardian_phone, 
             health_ins, health_ins_num, role, grade_level = None):
    cursor = my_db.cursor()
    sql = "INSERT INTO users " \
    "(first_name, last_name, birth_date, gender, email, phone, address, guardian, guardian_phone, health_ins, " \
    "health_ins_num, role, grade_level) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
    vals = (first_name, last_name, birth_date, gender, email, phone, address, guardian, guardian_phone, 
             health_ins, health_ins_num, role, grade_level)
    cursor.execute(sql, vals)
    my_db.commit()

###################### DO NOT TOUCH #######################################
def add_auth(user_id, password):
    cursor = my_db.cursor()
    sql = "INSERT INTO auth (user_id, password) VALUES (%s, %s)"
    vals = (user_id, password)
    cursor.execute(sql, vals)
    my_db.commit()


# GET Data
###################### DO NOT TOUCH #######################################
def login(email, password):
    cursor = my_db.cursor(dictionary=True)
    # Check if user with email exists
    sql = "SELECT * FROM users WHERE email = %s"
    val = (email, )
    cursor.execute(sql, val)
    user = cursor.fetchone()
    if user is None:
        return None
    # Check if password matches
    sql = "SELECT * FROM auth WHERE user_id = %s AND password = %s"
    val = (user['id'], password)
    cursor.execute(sql, val)
    auth = cursor.fetchone()
    if auth is None:
        return None
    return user


###################### DO NOT TOUCH #######################################
def get_users():
    cursor = my_db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users")
    return cursor.fetchall()


###################### DO NOT TOUCH #######################################
def get_user_by_name(first_name, last_name):
    cursor = my_db.cursor(dictionary=True)
    sql = "SELECT * FROM users WHERE first_name = %s AND last_name = %s"
    val = (first_name, last_name)
    cursor.execute(sql, val)
    return cursor.fetchall()


###################### DO NOT TOUCH #######################################
def get_user_by_id(id):
    cursor = my_db.cursor(dictionary=True)
    sql = "SELECT * FROM users WHERE id = %s"
    val = (id, )
    cursor.execute(sql, val)
    return cursor.fetchone()


# PUT Data 
###################### DO NOT TOUCH #######################################
def update_user(id, first_name, last_name, birth_date, gender, 
             email, phone, address, guardian, guardian_phone, 
             health_ins, health_ins_num, role, grade_level = None):
    cursor = my_db.cursor(dictionary=True)
    sql = "SELECT * FROM users WHERE id = %s"
    val = (id, )
    cursor.execute(sql, val)
    user = cursor.fetchone()
    if user is None:
        return None
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
    return cursor.fetchone()


# DELETE Data
###################### DO NOT TOUCH #######################################
def delete_user(id):
    cursor = my_db.cursor()
    sql = "DELETE FROM users WHERE id = %s"
    val = (id, )
    cursor.execute(sql, val)
    my_db.commit()


if __name__ == '__main__':
    if my_db.is_connected():
        print("Connected to MySQL Database")
    else:
        print("Failed to connect to MySQL Database")



###class func
def add_class(class_id, teacher_id, class_name, subject, semester_id):
    cursor = my_db.cursor()
    sql = "INSERT INTO classes " \
    "(class_id,teacher_id,class_name,subject,semester_id) VALUES (%s, %s, %s, %s, %s)"
    vals = (class_id, teacher_id, class_name, subject, semester_id)
    cursor.execute(sql, vals)
    my_db.commit()
def update_class_id(class_id):
    cursor = my_db.cursor()
    sql = "UPDATE classes SET class_id = %s WHERE class_id = %s"
    vals = (class_id, class_id)
    cursor.execute(sql, vals)
    my_db.commit()
def update_teacher_id(teacher_id):
    cursor = my_db.cursor()
    sql = "UPDATE classes SET teacher_id = %s WHERE teacher_id = %s"
    vals = (teacher_id, teacher_id)
    cursor.execute(sql, vals)
    my_db.commit()
def update_class_name(class_name):  
    cursor = my_db.cursor()
    sql = "UPDATE classes SET class_name = %s WHERE class_name = %s"
    vals = (class_name, class_name)
    cursor.execute(sql, vals)
    my_db.commit()
def update_subject(subject):
    cursor = my_db.cursor()
    sql = "UPDATE classes SET subject = %s WHERE subject = %s"
    vals = (subject, subject)
    cursor.execute(sql, vals)
    my_db.commit()
def update_semester_id(semester_id):
    cursor = my_db.cursor()
    sql = "UPDATE classes SET semester_id = %s WHERE semester_id = %s"
    vals = (semester_id, semester_id)
    cursor.execute(sql, vals)
    my_db.commit()
def delete_class(class_id): 
    cursor = my_db.cursor()
    sql = "DELETE FROM classes WHERE class_id = %s"
    val = (class_id, )
    cursor.execute(sql, val)
    my_db.commit()
def get_classes():
    cursor = my_db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM classes")
    return cursor.fetchall()
def get_class_by_id(class_id):
    cursor = my_db.cursor(dictionary=True)
    sql = "SELECT * FROM classes WHERE class_id = %s"
    val = (class_id, )
    cursor.execute(sql, val)
    return cursor.fetchone()
def get_class_by_teacher_id(teacher_id):
    cursor = my_db.cursor(dictionary=True)
    sql = "SELECT * FROM classes WHERE teacher_id = %s"
    val = (teacher_id, )
    cursor.execute(sql, val)
    return cursor.fetchall()
def get_class_by_class_name(class_name):
    cursor = my_db.cursor(dictionary=True)
    sql = "SELECT * FROM classes WHERE class_name = %s"
    val = (class_name, )
    cursor.execute(sql, val)
    return cursor.fetchall()
def get_class_by_subject(subject):
    cursor = my_db.cursor(dictionary=True)
    sql = "SELECT * FROM classes WHERE subject = %s"
    val = (subject, )
    cursor.execute(sql, val)
    return cursor.fetchall()
def get_class_by_semester_id(semester_id):
    cursor = my_db.cursor(dictionary=True)
    sql = "SELECT * FROM classes WHERE semester_id = %s"
    val = (semester_id, )
    cursor.execute(sql, val)
    return cursor.fetchall()
def get_class_by_teacher_id_and_semester_id(teacher_id, semester_id):
    cursor = my_db.cursor(dictionary=True)
    sql = "SELECT * FROM classes WHERE teacher_id = %s AND semester_id = %s"
    val = (teacher_id, semester_id)
    cursor.execute(sql, val)
    return cursor.fetchall()
def get_class_by_class_name_and_subject(class_name, subject):    
    cursor = my_db.cursor(dictionary=True)
    sql = "SELECT * FROM classes WHERE class_name = %s AND subject = %s"
    val = (class_name, subject)
    cursor.execute(sql, val)
    return cursor.fetchall()
def get_class_by_class_name_and_semester_id(class_name, semester_id):
    cursor = my_db.cursor(dictionary=True)
    sql = "SELECT * FROM classes WHERE class_name = %s AND semester_id = %s"
    val = (class_name, semester_id)
    cursor.execute(sql, val)
    return cursor.fetchall()
def get_class_by_subject_and_semester_id(subject, semester_id):
    cursor = my_db.cursor(dictionary=True)
    sql = "SELECT * FROM classes WHERE subject = %s AND semester_id = %s"
    val = (subject, semester_id)
    cursor.execute(sql, val)
    return cursor.fetchall()
def get_class_by_teacher_id_and_class_name(teacher_id, class_name):     
    cursor = my_db.cursor(dictionary=True)
    sql = "SELECT * FROM classes WHERE teacher_id = %s AND class_name = %s"
    val = (teacher_id, class_name)
    cursor.execute(sql, val)
    return cursor.fetchall()
def get_class_by_teacher_id_and_subject(teacher_id, subject):
    cursor = my_db.cursor(dictionary=True)
    sql = "SELECT * FROM classes WHERE teacher_id = %s AND subject = %s"    
    val = (teacher_id, subject)
    cursor.execute(sql, val)
    return cursor.fetchall()
def get_class_by_teacher_id_and_class_name_and_subject(teacher_id, class_name, subject):
    cursor = my_db.cursor(dictionary=True)
    sql = "SELECT * FROM classes WHERE teacher_id = %s AND class_name = %s AND subject = %s"
    val = (teacher_id, class_name, subject)
    cursor.execute(sql, val)
    return cursor.fetchall()
def get_class_by_teacher_id_and_class_name_and_semester_id(teacher_id, class_name, semester_id):    
    cursor = my_db.cursor(dictionary=True)
    sql = "SELECT * FROM classes WHERE teacher_id = %s AND class_name = %s AND semester_id = %s"
    val = (teacher_id, class_name, semester_id)
    cursor.execute(sql, val)
    return cursor.fetchall()
def get_class_by_teacher_id_and_subject_and_semester_id(teacher_id, subject, semester_id):
    cursor = my_db.cursor(dictionary=True)
    sql = "SELECT * FROM classes WHERE teacher_id = %s AND subject = %s AND semester_id = %s"
    val = (teacher_id, subject, semester_id)
    cursor.execute(sql, val)
    return cursor.fetchall()
def get_class_by_class_name_and_subject_and_semester_id(class_name, subject, semester_id):
    cursor = my_db.cursor(dictionary=True)
    sql = "SELECT * FROM classes WHERE class_name = %s AND subject = %s AND semester_id = %s"
    val = (class_name, subject, semester_id)
    cursor.execute(sql, val)
    return cursor.fetchall()
def get_class_by_teacher_id_and_class_name_and_subject_and_semester_id(teacher_id, class_name, subject, semester_id):
    cursor = my_db.cursor(dictionary=True)
    sql = "SELECT * FROM classes WHERE teacher_id = %s AND class_name = %s AND subject = %s AND semester_id = %s"
    val = (teacher_id, class_name, subject, semester_id)
    cursor.execute(sql, val)
    return cursor.fetchall()
def get_class_by_id_and_teacher_id(class_id, teacher_id):    
    cursor = my_db.cursor(dictionary=True)
    sql = "SELECT * FROM classes WHERE class_id = %s AND teacher_id = %s"
    val = (class_id, teacher_id)
    cursor.execute(sql, val)
    return cursor.fetchall()
def get_class_by_id_and_class_name(class_id, class_name):
    cursor = my_db.cursor(dictionary=True)
    sql = "SELECT * FROM classes WHERE class_id = %s AND class_name = %s"
    val = (class_id, class_name)
    cursor.execute(sql, val)
    return cursor.fetchall()
def get_class_by_id_and_subject(class_id, subject):
    cursor = my_db.cursor(dictionary=True)
    sql = "SELECT * FROM classes WHERE class_id = %s AND subject = %s"
    val = (class_id, subject)
    cursor.execute(sql, val)
    return cursor.fetchall()
def get_class_by_id_and_semester_id(class_id, semester_id):   
    cursor = my_db.cursor(dictionary=True)
    sql = "SELECT * FROM classes WHERE class_id = %s AND semester_id = %s"
    val = (class_id, semester_id)
    cursor.execute(sql, val)
    return cursor.fetchall()

###class_student func
def add_user_class(user_id, class_id):
    cursor = my_db.cursor()
    sql = "INSERT INTO class_students " \
    "(user_id,class_id) VALUES (%s, %s)"
    vals = (user_id, class_id)
    cursor.execute(sql, vals)
    my_db.commit()
def update_user_id(new,old):
    cursor = my_db.cursor()
    sql = "UPDATE class_students SET user_id = %s WHERE user_id = %s"
    vals = (new,old)
    cursor.execute(sql, vals)
    my_db.commit()
def update_class_id(new,old):
    cursor = my_db.cursor()
    sql = "UPDATE class_students SET class_id = %s WHERE class_id = %s"
    vals = (new,old)
    cursor.execute(sql, vals) 
    my_db.commit()
def delete_user_class(user_id, class_id):
    cursor = my_db.cursor()
    sql = "DELETE FROM class_students WHERE user_id = %s AND class_id = %s"
    val = (user_id, class_id)
    cursor.execute(sql, val)
    my_db.commit()
def get_user_classes():   
    cursor = my_db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM class_students")
    return cursor.fetchall()

# -------------------- FLASK ENDPOINTS -----------------------------

app = Flask(__name__)

# ---------- USER ENDPOINTS ----------

@app.route("/users", methods=["POST"])
def create_user():
    data = request.json
    add_user(
        data.get("first_name"), data.get("last_name"), data.get("birth_date"),
        data.get("gender"), data.get("email"), data.get("phone"), data.get("address"),
        data.get("guardian"), data.get("guardian_phone"), data.get("health_ins"),
        data.get("health_ins_num"), data.get("role"), data.get("grade_level")
    )
    return jsonify({"message": "User added"}), 201

@app.route("/auth", methods=["POST"])
def create_auth():
    data = request.json
    add_auth(data.get("user_id"), data.get("password"))
    return jsonify({"message": "Auth added"}), 201

@app.route("/login", methods=["POST"])
def user_login():
    data = request.json
    user = login(data.get("email"), data.get("password"))
    if user:
        return jsonify(user)
    return jsonify({"error": "Invalid credentials"}), 401

@app.route("/users", methods=["GET"])
def list_users():
    users = get_users()
    return jsonify(users)

@app.route("/users/<int:user_id>", methods=["GET"])
def get_user(user_id):
    user = get_user_by_id(user_id)
    if user:
        return jsonify(user)
    return jsonify({"error": "User not found"}), 404

@app.route("/users/search", methods=["GET"])
def search_user():
    first_name = request.args.get("first_name")
    last_name = request.args.get("last_name")
    users = get_user_by_name(first_name, last_name)
    return jsonify(users)

@app.route("/users/<int:user_id>", methods=["PUT"])
def update_user_route(user_id):
    data = request.json
    updated = update_user(
        user_id, data.get("first_name"), data.get("last_name"), data.get("birth_date"),
        data.get("gender"), data.get("email"), data.get("phone"), data.get("address"),
        data.get("guardian"), data.get("guardian_phone"), data.get("health_ins"),
        data.get("health_ins_num"), data.get("role"), data.get("grade_level")
    )
    if updated is None:
        return jsonify({"error": "User not found"}), 404
    return jsonify({"message": "User updated"})

@app.route("/users/<int:user_id>", methods=["DELETE"])
def delete_user_route(user_id):
    delete_user(user_id)
    return jsonify({"message": "User deleted"})

# ---------- CLASS ENDPOINTS ----------

@app.route("/classes", methods=["POST"])
def create_class():
    data = request.json
    add_class(
        data.get("class_id"), data.get("teacher_id"),
        data.get("class_name"), data.get("subject"),
        data.get("semester_id")
    )
    return jsonify({"message": "Class added"}), 201

@app.route("/classes/update/class_id", methods=["PUT"])
def update_class_id_route():
    data = request.json
    update_class_id(data.get("class_id"))
    return jsonify({"message": "Class ID updated"})

@app.route("/classes/update/teacher_id", methods=["PUT"])
def update_teacher_id_route():
    data = request.json
    update_teacher_id(data.get("teacher_id"))
    return jsonify({"message": "Teacher ID updated"})

@app.route("/classes/update/class_name", methods=["PUT"])
def update_class_name_route():
    data = request.json
    update_class_name(data.get("class_name"))
    return jsonify({"message": "Class name updated"})

@app.route("/classes/update/subject", methods=["PUT"])
def update_subject_route():
    data = request.json
    update_subject(data.get("subject"))
    return jsonify({"message": "Subject updated"})

@app.route("/classes/update/semester_id", methods=["PUT"])
def update_semester_id_route():
    data = request.json
    update_semester_id(data.get("semester_id"))
    return jsonify({"message": "Semester ID updated"})

@app.route("/classes/<class_id>", methods=["DELETE"])
def delete_class_route(class_id):
    delete_class(class_id)
    return jsonify({"message": "Class deleted"})

@app.route("/classes", methods=["GET"])
def list_classes():
    classes = get_classes()
    return jsonify(classes)

@app.route("/classes/<class_id>", methods=["GET"])
def get_class_route(class_id):
    cls = get_class_by_id(class_id)
    if cls:
        return jsonify(cls)
    return jsonify({"error": "Class not found"}), 404

@app.route("/classes/teacher/<teacher_id>", methods=["GET"])
def get_class_by_teacher_route(teacher_id):
    classes = get_class_by_teacher_id(teacher_id)
    return jsonify(classes)

@app.route("/classes/name/<class_name>", methods=["GET"])
def get_class_by_name_route(class_name):
    classes = get_class_by_class_name(class_name)
    return jsonify(classes)

@app.route("/classes/subject/<subject>", methods=["GET"])
def get_class_by_subject_route(subject):
    classes = get_class_by_subject(subject)
    return jsonify(classes)

@app.route("/classes/semester/<semester_id>", methods=["GET"])
def get_class_by_semester_route(semester_id):
    classes = get_class_by_semester_id(semester_id)
    return jsonify(classes)

@app.route("/classes/teacher/<teacher_id>/semester/<semester_id>", methods=["GET"])
def get_class_by_teacher_and_semester_route(teacher_id, semester_id):
    classes = get_class_by_teacher_id_and_semester_id(teacher_id, semester_id)
    return jsonify(classes)

@app.route("/classes/name/<class_name>/subject/<subject>", methods=["GET"])
def get_class_by_name_and_subject_route(class_name, subject):
    classes = get_class_by_class_name_and_subject(class_name, subject)
    return jsonify(classes)

@app.route("/classes/name/<class_name>/semester/<semester_id>", methods=["GET"])
def get_class_by_name_and_semester_route(class_name, semester_id):
    classes = get_class_by_class_name_and_semester_id(class_name, semester_id)
    return jsonify(classes)

@app.route("/classes/subject/<subject>/semester/<semester_id>", methods=["GET"])
def get_class_by_subject_and_semester_route(subject, semester_id):
    classes = get_class_by_subject_and_semester_id(subject, semester_id)
    return jsonify(classes)

@app.route("/classes/teacher/<teacher_id>/name/<class_name>", methods=["GET"])
def get_class_by_teacher_and_name_route(teacher_id, class_name):
    classes = get_class_by_teacher_id_and_class_name(teacher_id, class_name)
    return jsonify(classes)

@app.route("/classes/teacher/<teacher_id>/subject/<subject>", methods=["GET"])
def get_class_by_teacher_and_subject_route(teacher_id, subject):
    classes = get_class_by_teacher_id_and_subject(teacher_id, subject)
    return jsonify(classes)

@app.route("/classes/teacher/<teacher_id>/name/<class_name>/subject/<subject>", methods=["GET"])
def get_class_by_teacher_name_subject_route(teacher_id, class_name, subject):
    classes = get_class_by_teacher_id_and_class_name_and_subject(teacher_id, class_name, subject)
    return jsonify(classes)

@app.route("/classes/teacher/<teacher_id>/name/<class_name>/semester/<semester_id>", methods=["GET"])
def get_class_by_teacher_name_semester_route(teacher_id, class_name, semester_id):
    classes = get_class_by_teacher_id_and_class_name_and_semester_id(teacher_id, class_name, semester_id)
    return jsonify(classes)

@app.route("/classes/teacher/<teacher_id>/subject/<subject>/semester/<semester_id>", methods=["GET"])
def get_class_by_teacher_subject_semester_route(teacher_id, subject, semester_id):
    classes = get_class_by_teacher_id_and_subject_and_semester_id(teacher_id, subject, semester_id)
    return jsonify(classes)

@app.route("/classes/name/<class_name>/subject/<subject>/semester/<semester_id>", methods=["GET"])
def get_class_by_name_subject_semester_route(class_name, subject, semester_id):
    classes = get_class_by_class_name_and_subject_and_semester_id(class_name, subject, semester_id)
    return jsonify(classes)

@app.route("/classes/teacher/<teacher_id>/name/<class_name>/subject/<subject>/semester/<semester_id>", methods=["GET"])
def get_class_by_teacher_name_subject_semester_route(teacher_id, class_name, subject, semester_id):
    classes = get_class_by_teacher_id_and_class_name_and_subject_and_semester_id(teacher_id, class_name, subject, semester_id)
    return jsonify(classes)

@app.route("/classes/<class_id>/teacher/<teacher_id>", methods=["GET"])
def get_class_by_id_teacher_route(class_id, teacher_id):
    classes = get_class_by_id_and_teacher_id(class_id, teacher_id)
    return jsonify(classes)

@app.route("/classes/<class_id>/name/<class_name>", methods=["GET"])
def get_class_by_id_name_route(class_id, class_name):
    classes = get_class_by_id_and_class_name(class_id, class_name)
    return jsonify(classes)

@app.route("/classes/<class_id>/subject/<subject>", methods=["GET"])
def get_class_by_id_subject_route(class_id, subject):
    classes = get_class_by_id_and_subject(class_id, subject)
    return jsonify(classes)

@app.route("/classes/<class_id>/semester/<semester_id>", methods=["GET"])
def get_class_by_id_semester_route(class_id, semester_id):
    classes = get_class_by_id_and_semester_id(class_id, semester_id)
    return jsonify(classes)

# ---------- CLASS-STUDENT ENDPOINTS ----------

@app.route("/class_students", methods=["POST"])
def create_class_student():
    data = request.json
    add_user_class(data.get("user_id"), data.get("class_id"))
    return jsonify({"message": "User added to class"}), 201

@app.route("/class_students/update_user_id", methods=["PUT"])
def update_class_student_user_id():
    data = request.json
    update_user_id(data.get("new"), data.get("old"))
    return jsonify({"message": "User ID updated in class_students"})

@app.route("/class_students/update_class_id", methods=["PUT"])
def update_class_student_class_id():
    data = request.json
    update_class_id(data.get("new"), data.get("old"))
    return jsonify({"message": "Class ID updated in class_students"})

@app.route("/class_students", methods=["DELETE"])
def delete_class_student():
    user_id = request.args.get("user_id")
    class_id = request.args.get("class_id")
    delete_user_class(user_id, class_id)
    return jsonify({"message": "User removed from class"})

@app.route("/class_students", methods=["GET"])
def list_class_students():
    cs = get_user_classes()
    return jsonify(cs)

# -------------------- MAIN -----------------------------
if __name__ == '__main__':
    if my_db.is_connected():
        print("Connected to MySQL Database")
    else:
        print("Failed to connect to MySQL Database")
    app.run(debug=True)

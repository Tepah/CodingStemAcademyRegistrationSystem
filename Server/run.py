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

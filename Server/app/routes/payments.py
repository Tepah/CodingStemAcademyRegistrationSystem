from db_connection import get_db_connection
from flask import jsonify, request, Blueprint

payments_bp = Blueprint('payments', __name__)

# GET functions
@payments_bp.route('/payments', methods=['GET'])
def get_payments():
    db = get_db_connection()
    try:
        cursor = db.cursor(dictionary=True)
        sql = "SELECT * FROM payments ORDER BY payment_date DESC"
        cursor.execute(sql)
        payments = cursor.fetchall()
    finally:
        db.close()
        cursor.close()
    return jsonify({'message': 'Payments retrieved', 'payments': payments})

@payments_bp.route('/payments/student', methods=['GET'])
def get_student_payments():
    db = get_db_connection()
    student_id = request.args.get('student_id')
    try:
        cursor = db.cursor(dictionary=True)
        sql = "SELECT * FROM payments WHERE student_id = %s ORDER BY payment_date DESC"
        cursor.execute(sql, (student_id,))
        payments = cursor.fetchall()
    finally:
        db.close()
        cursor.close()
    return jsonify({'message': 'Payments retrieved', 'payments': payments})

# POST functions
@payments_bp.route('/payment', methods=['POST'])
def create_payment():
    db = get_db_connection()
    data = request.get_json()
    try:
        cursor = db.cursor(dictionary=True)
        sql = "INSERT INTO payments (amount, notes, payment_date, payment_type, status, student_id, payment_method) VALUES (%s, %s, %s, %s, %s, %s, %s)"
        cursor.execute(sql, (data['amount'], data['notes'], data['payment_date'], data['payment_type'], data['status'], data['student_id'], data['payment_method']))
        db.commit()
    finally:
        db.close()
        cursor.close()
    return jsonify({'message': 'Payment created'})

# PUT function
@payments_bp.route('/payment', methods=['PUT'])
def update_payment():
    db = get_db_connection()
    data = request.get_json()
    try:
        cursor = db.cursor(dictionary=True)
        sql = "UPDATE payments SET amount = %s, notes = %s, payment_date = %s, payment_type = %s, status = %s, payment_method = %s WHERE id = %s"
        cursor.execute(sql, (data['amount'], data['notes'], data['payment_date'], data['payment_type'], data['status'], data['payment_method'], data['id']))
        db.commit()
    finally:
        db.close()
        cursor.close()
    return jsonify({'message': 'Payment updated'})

# DELETE function
@payments_bp.route('/payment', methods=['DELETE'])
def delete_payment():
    db = get_db_connection()
    id = request.args.get('payment_id')
    try:
        cursor = db.cursor(dictionary=True)
        sql = "DELETE FROM payments WHERE id = %s"
        cursor.execute(sql, (id,))
        db.commit()
    finally:
        db.close()
        cursor.close()
    return jsonify({'message': 'Payment deleted'})
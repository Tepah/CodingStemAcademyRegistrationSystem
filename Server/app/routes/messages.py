from db_connection import get_db_connection
from flask import Blueprint, request, jsonify
from datetime import timedelta, time

messages_bp = Blueprint('messages', __name__)


@messages_bp.route('/messages', methods=['GET'])
def get_messages():
    """
    Get all messages from the database.
    """
    conn = get_db_connection()
    try: 
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM messages")
        messages = cursor.fetchall()
    finally:
        cursor.close()
        conn.close()

    return jsonify({"message": "All Messages Retrieved", "messages": messages}), 200

@messages_bp.route('/messages/user', methods=['GET'])
def get_user_messages():
    """
    Get messages for a specific user.
    """
    conn = get_db_connection()
    user_id = request.args.get('user_id')
    try: 
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM messages WHERE receiver_user_id = %s ORDER BY sent_date DESC", (user_id,))
        messages = cursor.fetchall()
    finally:
        cursor.close()
        conn.close()

    return jsonify({"message": "User Messages Retrieved", "messages": messages}), 200

@messages_bp.route('/class-messages', methods=['GET'])
def get_class_messages():
    """
    Get messages for a specific class.
    """
    conn = get_db_connection()
    user_id = request.args.get('user_id')
    class_id = request.args.get('class_id')
    try: 
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM messages WHERE class_id = %s and receiver_user_id = %s ORDER BY sent_date DESC", (class_id, user_id))
        messages = cursor.fetchall()
    finally:
        cursor.close()
        conn.close()

    return jsonify({"message": "Class Messages Retrieved", "messages": messages}), 200

@messages_bp.route('/class-messages/unread', methods=['GET'])
def count_unread_class_messages():
    """
    Get messages for a specific class.
    """
    conn = get_db_connection()
    user_id = request.args.get('user_id')
    class_id = request.args.get('class_id')
    try: 
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT COUNT(*) as count FROM messages WHERE class_id = %s and receiver_user_id = %s and has_read = 0", (class_id, user_id))
        res = cursor.fetchone()
    finally:
        cursor.close()
        conn.close()

    return jsonify({'message': 'Unread count retrieved', 'count': res['count']}), 200


@messages_bp.route('/message', methods=['GET'])
def get_message():
    """
    Get a specific message by ID.
    """
    conn = get_db_connection()
    message_id = request.args.get('id')
    try: 
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM messages WHERE id = %s", (message_id,))
        message = cursor.fetchone()
    finally:
        cursor.close()
        conn.close()

    if message:
        return jsonify({"message": "Message Retrieved", "message": message}), 200
    else:
        return jsonify({"error": "Message not found"}), 404
    
@messages_bp.route('/messages', methods=['POST'])
def create_message():
    """
    Create a new message in the database.
    """
    data = request.get_json()
    print(data)
    sender_user_id = data.get('sender_user_id')
    class_id = data.get('class_id')
    message = data.get('message')
    receiver_user_id = data.get('receiver_user_id')
    title = data.get('title')
    if not sender_user_id or not class_id or not message or not receiver_user_id or not title:
        return jsonify({"error": "Invalid input"}), 400

    conn = get_db_connection()
    try: 
        cursor = conn.cursor()
        cursor.execute("INSERT INTO messages (sender_user_id, class_id, message, receiver_user_id, title) VALUES (%s, %s, %s, %s, %s)", (sender_user_id, class_id, message, receiver_user_id, title))
        conn.commit()
    finally:
        cursor.close()
        conn.close()

    return jsonify({"message": "Message Created"}), 201

@messages_bp.route('/messages', methods=['PUT'])
def update_message():
    """
    Update an existing message by ID.
    """
    message_id = request.json.get('id')
    data = request.get_json()
    title = data.get('title')
    message = data.get('message')
    receiver_user_id = data.get('receiver_user_id')
    sender_user_id = data.get('sender_user_id')
    class_id = data.get('class_id')
    has_read = data.get('has_read')
    # print(data)

    conn = get_db_connection()
    try: 
        cursor = conn.cursor()
        cursor.execute("UPDATE messages SET title=%s, message=%s, receiver_user_id=%s, sender_user_id=%s, class_id=%s, has_read=%s WHERE id = %s", (title, message, receiver_user_id, sender_user_id, class_id, has_read, message_id))
        conn.commit()
    finally:
        cursor.close()
        conn.close()

    return jsonify({"message": "Message Updated"}), 200

@messages_bp.route('/messages', methods=['DELETE'])
def delete_message():
    """
    Delete a message by ID.
    """
    message_id = request.args.get('id')
    conn = get_db_connection()
    try: 
        cursor = conn.cursor()
        cursor.execute("DELETE FROM messages WHERE id = %s", (message_id,))
        conn.commit()
    finally:
        cursor.close()
        conn.close()

    return jsonify({"message": "Message Deleted"}), 200
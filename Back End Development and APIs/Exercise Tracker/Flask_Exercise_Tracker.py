from flask import Flask, request, jsonify
from datetime import datetime

app = Flask(__name__)

users = {}
exercises = {}

def validate_date(date_str):
    try:
        datetime.strptime(date_str, '%Y-%m-%d')
        return True
    except ValueError:
        return False

@app.route('/api/users', methods=['POST'])
def create_user():
    username = request.form.get('username')
    if not username:
        return jsonify({"error": "Username is required"}), 400
    user_id = str(len(users) + 1)
    users[user_id] = {"username": username, "_id": user_id}
    exercises[user_id] = []
    return jsonify(users[user_id]), 201

@app.route('/api/users', methods=['GET'])
def get_users():
    return jsonify([{"_id": user_id, "username": user["username"]} for user_id, user in users.items()])

@app.route('/api/users/<user_id>/exercises', methods=['POST'])
def add_exercise(user_id):
    if user_id not in users:
        return jsonify({"error": "User not found"}), 404
    
    description = request.form.get('description')
    duration = request.form.get('duration')
    date = request.form.get('date', datetime.now().strftime("%a %b %d %Y"))
    
    if not description or not duration:
        return jsonify({"error": "Description and duration are required"}), 400
    
    exercise = {
        "description": description,
        "duration": int(duration),
        "date": date
    }
    
    exercises[user_id].append(exercise)
    
    return jsonify({
        "username": users[user_id]["username"],
        "description": exercise["description"],
        "duration": exercise["duration"],
        "date": exercise["date"]
    })

@app.route('/api/users/<user_id>/logs', methods=['GET'])
def get_user_logs(user_id):
    if user_id not in users:
        return jsonify({"error": "User not found"}), 404
    
    from_date = request.args.get('from')
    to_date = request.args.get('to')
    limit = request.args.get('limit')
    
    if from_date and not validate_date(from_date):
        return jsonify({"error": "Invalid from date format. Use yyyy-mm-dd."}), 400
    if to_date and not validate_date(to_date):
        return jsonify({"error": "Invalid to date format. Use yyyy-mm-dd."}), 400
    
    logs = exercises.get(user_id, [])
    
    if from_date:
        logs = [log for log in logs if log["date"] >= from_date]
    if to_date:
        logs = [log for log in logs if log["date"] <= to_date]
    
    if limit:
        logs = logs[:int(limit)]
    
    return jsonify({
        "_id": user_id,
        "username": users[user_id]["username"],
        "count": len(logs),
        "log": logs
    })

if __name__ == '__main__':
    app.run(debug=True)

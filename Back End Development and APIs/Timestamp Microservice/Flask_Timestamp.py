from flask import Flask, jsonify
from datetime import datetime

app = Flask(__name__)

@app.route('/api/<date_param>', methods=['GET'])
@app.route('/api/', methods=['GET'])
def timestamp(date_param=None):
    try:
        if date_param is None:
            now = datetime.utcnow()
            return jsonify({
                "unix": int(now.timestamp() * 1000),
                "utc": now.strftime("%a, %d %b %Y %H:%M:%S GMT")
            })

        if date_param.isdigit():
            date = datetime.utcfromtimestamp(int(date_param) / 1000)
        else:
            date = datetime.fromisoformat(date_param)

        return jsonify({
            "unix": int(date.timestamp() * 1000),
            "utc": date.strftime("%a, %d %b %Y %H:%M:%S GMT")
        })

    except ValueError:
        return jsonify({"error": "Invalid Date"})

if __name__ == '__main__':
    app.run(debug=True)

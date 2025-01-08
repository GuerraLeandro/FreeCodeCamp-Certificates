from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/api/whoami', methods=['GET'])
def whoami():
    ip_address = request.remote_addr
    
    language = request.headers.get('Accept-Language', 'Unknown')
    
    software = request.headers.get('User-Agent', 'Unknown')
    
    return jsonify({
        "ipaddress": ip_address,
        "language": language,
        "software": software
    })

if __name__ == '__main__':
    app.run(debug=True)

from flask import Flask, request, jsonify, redirect
from urllib.parse import urlparse
import re

app = Flask(__name__)

url_db = {}
id_counter = 1

def is_valid_url(url):
    parsed = urlparse(url)
    return bool(parsed.netloc) and bool(parsed.scheme)

@app.route('/api/shorturl', methods=['POST'])
def create_short_url():
    global id_counter
    
    original_url = request.json.get('url')
    
    if not is_valid_url(original_url):
        return jsonify({"error": "invalid url"})
    
    short_url = id_counter
    url_db[short_url] = original_url
    id_counter += 1
    
    return jsonify({"original_url": original_url, "short_url": short_url})

@app.route('/api/shorturl/<int:short_url>', methods=['GET'])
def redirect_to_url(short_url):
    original_url = url_db.get(short_url)
    
    if not original_url:
        return jsonify({"error": "No short URL found for the given input"})
    
    return redirect(original_url)

if __name__ == '__main__':
    app.run(debug=True)

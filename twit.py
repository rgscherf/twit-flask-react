from flask import Flask, render_template, jsonify, request
from getuser import getuser 

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_user', methods=['GET', 'POST'])
def get_user():
    s = request.args.get('user', '', type=str)
    u = getuser(s)
    return jsonify(u)

if __name__ == '__main__':
    app.run(port=5000, debug=True)
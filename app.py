from flask import Flask, session, request, jsonify
import firebase_admin
from firebase_admin import credentials, firestore
from flask_cors import CORS

# Initialize Firebase
cred = credentials.Certificate("#.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

app = Flask(__name__)
app.secret_key = "your_secret_key"  # Replace with a secure key
CORS(app)

# Helper function to validate email and password
def validate_user_data(name, email, password):
    if not name or not email or not password:
        return False, "All fields are required!"
    if len(password) < 6:
        return False, "Password must be at least 6 characters long!"
    return True, None

# Route to handle register User
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    # Validate user data
    is_valid, error_message = validate_user_data(name, email, password)
    if not is_valid:
        return jsonify({"success": False, "message": error_message}), 400

    try:
        # Check if the user already exists
        users_ref = db.collection('users')
        query = users_ref.where('email', '==', email).stream()
        for doc in query:
            return jsonify({"success": False, "message": "User already exists!"}), 400



        # Add new user to Firestore
        users_ref.add({
            'name': name,
            'email': email,
            'password': password,
        })

        return jsonify({"success": True, "message": "User registered successfully!"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

# Route to handle login
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"success": False, "message": "Email and password are required!"}), 400

    try:
        # Query Firestore for the user
        users_ref = db.collection('users')
        query = users_ref.where('email', '==', email).stream()

        user = None
        for doc in query:
            user = doc.to_dict()
            if user and user.get('password') == password:   # Secure password check
                # Save user info in session
                session['user'] = user
                return jsonify({"success": True, "user": user})
        return jsonify({"success": False, "message": "Invalid email or password"}), 401
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
        
# Route to handle google login   
@app.route('/google-login', methods=['POST'])
def google_login():
    data = request.json
    email = data.get('email')
    name = data.get('name')
    uid = data.get('uid')

    try:
        users_ref = db.collection('users')
        query = users_ref.where('email', '==', email).stream()

        # If user does not exist, create a new one
        if not any(query):
            users_ref.add({
                'email': email,
                'name': name,
                'uid': uid,
            })
        return jsonify({"success": True, "message": "Google login successful!"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


# Route to handle logout
@app.route('/logout', methods=['POST'])
def logout():
    session.pop('user', None)  # Clear user session
    return jsonify({'success': True, 'message': 'Logged out successfully'})

if __name__ == '__main__':
    app.run(debug=True)
from flask import Flask, send_from_directory, jsonify, request
from flask_cors import CORS
import pandas as pd
import pickle

app = Flask(
    __name__,
    static_folder="FrontEnd/build",  # Serve React's static files
    template_folder="FrontEnd/build"  # Serve React's index.html
)

model=pickle.load(open("BangloreModel.pkl",'rb'))

house=pd.read_csv("Cleaned_Bang.csv")

@app.route("/api/location-data", methods=["GET"])
def get_car_data():
    location = sorted(house["location"].unique())
    # Convert any numpy.int64 values to native Python int type
    house_data = {
        "location": location
    }
    # Return all lists as JSON
    return jsonify(house_data)

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    input_data = pd.DataFrame([{
        'location': data['location'],
        'total_sqft': data['total_sqft'],
        'bath': data['bath'],
        'bhk': data['bhk']
    }])
    print(data)
    # Perform the prediction
    prediction = model.predict(input_data)

    # Return the predicted value as a response
    print(prediction[0])
    return jsonify({'predicted_price': int(prediction[0])/100})

@app.route("/")
def serve_react():
    return send_from_directory(app.static_folder, "index.html")

@app.route("/<path:path>")
def serve_static_files(path):
    return send_from_directory(app.static_folder, path)

CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

if __name__ == "__main__":
    app.run(debug=True)
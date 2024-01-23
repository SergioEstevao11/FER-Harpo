from flask import Flask, request
from flask_cors import CORS
from tensorflow.keras.models import load_model
import numpy as np
import cv2
import skimage.transform
import os

app = Flask(__name__)
CORS(app)

# Load the model from the H5 file
model = load_model('Sign Language ASL Classifier.h5')

dict = {0: 'A', 1: 'B', 2: 'C', 3: 'D', 4: 'E', 5: 'F', 6: 'G', 7: 'H', 8: 'I', 9: 'J', 10: 'K', 11: 'L',
        12: 'M', 13: 'N', 14: 'O', 15: 'P', 16: 'Q', 17: 'R', 18: 'S', 19: 'T', 20: 'U', 21: 'V', 22: 'W', 
        23: 'X', 24: 'Y', 25: 'Z', 26: 'del', 27: 'nothing', 28: 'space', 29: 'other'}
threshold = 2e-3
imageSize = 224
current_letter = "V"
emotions = {0: "neutral", 1: "happy", 2: "success", 3: "sad"}
current_emotion = emotions[0] #neutral is the default


def evaluate_emotion(prediction, current_letter, threshold):

    if current_emotion == emotions[2]:
        return emotions[2]

    current_letter_confidence = prediction['confidences'][current_letter]

    # Success if the current letter is within valid classes and above the threshold
    if current_letter in prediction['valid_classes'] and current_letter_confidence > threshold:
        return emotions[2]  # 'success'

    # Happy if the prediction matches the current letter and is close to the threshold
    if prediction['predicted_class'] == current_letter and current_letter_confidence > 0.7*threshold:
        return emotions[1]  # 'happy'

    # Neutral if the confidence is somewhat close to the threshold
    if current_letter_confidence > 0.3*threshold:
        return emotions[0]  # 'neutral'

    # Sad if the confidence is far below the threshold
    return emotions[3]  # 'sad'


def predict_image(img_file, threshold):     
    global current_emotion

    img_file = skimage.transform.resize(img_file, (imageSize, imageSize, 3))
    img_arr = np.asarray([img_file])
    pred = model.predict(img_arr)
    pred_class = np.argmax(pred, axis=1)
    valid_classes = np.where(pred[0] > threshold)[0]

    prediction = {
        "predicted_class": dict[pred_class[0]],
        "valid_classes": [dict[i] for i in valid_classes],
        "confidences": {dict[i]: float(pred[0][i]) for i in range(len(pred[0]))},
        "is_valid": bool(pred[0][pred_class[0]] > threshold)
    }

    # Evaluate the emotional state based on the prediction
    current_emotion = evaluate_emotion(prediction, current_letter, threshold)
    prediction["emotion"] = current_emotion
    return prediction


@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return 'No file part', 400
    file = request.files['file']
    if file.filename == '':
        return 'No selected file', 400
    if current_letter == '':
        return 'No letter selected yet', 400
    if file:
        filename = "received_photo.jpg"
        save_path = os.path.join('./', filename)
        file.save(save_path)

        # Perform prediction
        img = cv2.imread(save_path)
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)  # Convert to RGB
        prediction = predict_image(img, threshold)

        return prediction, 200  # Return JSON serializable response

@app.route('/letter', methods=['POST'])
def update_letter():
    global current_letter
    global current_emotion
    data = request.get_json()
    if not data or 'letter' not in data:
        return 'No letter part', 400
    current_letter = data['letter'].upper()
    current_emotion = emotions[0]
    return {"message": f"Current letter updated to: {current_letter}"}, 200

@app.route("/get_letter")
def get_letter():
    return {"letter": current_letter}

@app.route("/test")
def test():
    return {"Status": "ok"}

if __name__ == "__main__":
    app.run(debug=True)

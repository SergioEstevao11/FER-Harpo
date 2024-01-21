import tensorflow as tf
from tensorflow.keras.models import load_model
import numpy as np
import cv2
import skimage

imageSize=50
# Load the model from the H5 file
model = load_model('trained_model.h5')
dict = {0: 'A', 1: 'B', 2: 'C', 3: 'D', 4: 'E', 5: 'F', 6: 'G', 7: 'H', 8: 'I', 9: 'J', 10: 'K', 11: 'L', 12: 'M', 13: 'N', 14: 'O', 15: 'P', 16: 'Q', 17: 'R', 18: 'S', 19: 'T', 20: 'U', 21: 'V', 22: 'W', 23: 'X', 24: 'Y', 25: 'Z', 26: 'del', 27: 'nothing', 28: 'space', 29: 'other'}
img = cv2.imread('imgs/2024-01-11-013812.jpg')


def predict_image(img_file):
    img_file = skimage.transform.resize(img_file, (imageSize, imageSize, 3))
    img_arr = np.asarray([np.asarray(img_file)])

    pred = model.predict(img_arr)
    pred_class = np.argmax(pred,axis = 1)
    print(pred)
    print(dict[pred_class[0]], pred_class)
    return dict[pred_class[0]]

print(predict_image(img))
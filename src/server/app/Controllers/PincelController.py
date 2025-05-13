import cv2
import numpy as np


class PincelController:

    def cinza(img):
        return cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    def blur(img):
        return cv2.GaussianBlur(img, (7, 7), 0)
        

    def inversao_cores(img):
        return cv2.bitwise_not(img)

    def aumento_contraste(img):
        lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
        l, a, b = cv2.split(lab)
        l = cv2.equalizeHist(l)
        img = cv2.merge((l, a, b))
        img = cv2.cvtColor(img, cv2.COLOR_LAB2BGR)
        return img
    def sharpen(img):
        kernel = np.array([[0, -1, 0],
                           [-1, 5, -1],
                           [0, -1, 0]])
        img = cv2.filter2D(img, -1, kernel)
        return img
    
    def deteccao_bordas(img):
        img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        img = cv2.Canny(img, 100, 200)
        return img
        
        
                       
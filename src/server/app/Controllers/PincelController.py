import cv2
import numpy as np

class PincelController:
    @staticmethod
    def cinza(img):
        return cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    @staticmethod
    def blur(img):
        return cv2.GaussianBlur(img, (7, 7), 0)

    @staticmethod
    def inversao_cores(img):
        return cv2.bitwise_not(img)

    @staticmethod
    def aumento_contraste(img):
        lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
        l, a, b = cv2.split(lab)
        l = cv2.equalizeHist(l)
        merged = cv2.merge((l, a, b))
        return cv2.cvtColor(merged, cv2.COLOR_LAB2BGR)

    @staticmethod
    def sharpen(img):
        kernel = np.array([[0, -1, 0],
                           [-1, 5, -1],
                           [0, -1, 0]])
        return cv2.filter2D(img, -1, kernel)

    @staticmethod
    def deteccao_bordas(img):
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        return cv2.Canny(gray, 100, 200)
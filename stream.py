
import time
import picamera
import picamera.array
import cv2
import sys

max_x = 160
max_y = 128
faceCascade = cv2.CascadeClassifier('frontalface.xml')

with picamera.PiCamera() as camera:
	camera.framerate = 10
	camera.resolution = (max_x, max_y)
	camera.start_preview()
	time.sleep(2)
	with picamera.array.PiRGBArray(camera, size =(max_x, max_y)) as stream:
		while True:
			camera.capture(stream, format='bgr', resize =(max_x, max_y))
			# At this point the image is available as stream.array
			image = stream.array

			gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
			faces = faceCascade.detectMultiScale(
				gray, 
				scaleFactor=1.1, 
				minNeighbors=5, 
				minSize=(30, 30), 
				#flags=cv2.cv.CV_HAAR_SCALE_IMAGE
			)

			if not len(faces)==0:
				print "Found {0} faces".format(len(faces))
				for (x, y, w, h) in faces:
					x_coord = float(x + w/2.0)/max_x
					y_coord = float(y + h/2.0)/max_y
					print('{0},{1}'.format(x_coord, y_coord))
					#cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)
				sys.stdout.flush()

			stream.truncate(0)
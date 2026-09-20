import requests

url = "http://127.0.0.1:5000/analyze"
image_path = r"C:\Users\KG\OneDrive\图片\23.jpg"

with open(image_path, 'rb') as f:
    files = {'image': f}
    response = requests.post(url, files=files)

print("Status Code:", response.status_code)
print("Response:", response.json())
from flask import Blueprint, request, redirect, make_response, jsonify
from repositories.authRepositories import AuthRepositories
import base64

user_rt = Blueprint('users', __name__, url_prefix='/users')

@user_rt.route('/newuser', methods=['POST'])
async def new_user():
    db = AuthRepositories()
    await db.connect()  # Sử dụng await khi gọi hàm không đồng bộ

    try:
        data = request.get_json()  # Sử dụng request.get_json() để lấy dữ liệu JSON
        fullname = data.get('fullname')
        username = data.get('username')
        password = data.get('password')
        email = data.get('email')
        print("data", data)
        
        x = await db.register(fullname, username, password, email)  # Sử dụng await khi gọi hàm không đồng bộ
        print("kq đăng ký:",x)
       # Assuming this line is within a function or method block
        return f'<h1 style="color: white;">Đã đăng ký thành công! <hr> <a href=\'/\'>Về trang chủ</a></h1>'

    except Exception as error:
        print("Lỗi đăng ký người dùng mới:", error)
        return f'<h1 style="color: white;">Lỗi đăng ký! <hr> <a href=\'/\'>Về trang chủ</a></h1>', 500
    finally:
        await db.end()  # Sử dụng await khi gọi hàm không đồng bộ

def decode_utf8_string(encoded_string):
    return encoded_string.decode('utf-8')


@user_rt.route('/fullname', methods=['POST'])
def fullname():
    data = request.get_json()  # Sử dụng request.get_json() để lấy dữ liệu JSON
    fullname = data.get('fullname')
    decoded_bytes = base64.b64decode(fullname)  # Giải mã chuỗi
    decoded_string = decoded_bytes.decode('utf-8')  # Chuyển đổi chuỗi byte thành chuỗi
    return decoded_string  # Trả về chuỗi Unicode
